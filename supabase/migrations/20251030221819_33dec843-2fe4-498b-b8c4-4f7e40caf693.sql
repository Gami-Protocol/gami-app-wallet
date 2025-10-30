-- =====================================================
-- CRITICAL SECURITY FIXES
-- =====================================================

-- 1. Remove dangerous UPDATE policies that allow users to manipulate their own financial data
DROP POLICY IF EXISTS "Users can update their own wallet" ON wallets;
DROP POLICY IF EXISTS "Users can update their own allocation" ON airdrop_allocations;

-- 2. Add database constraints for access codes (drop first if exists to be safe)
DO $$ 
BEGIN
  ALTER TABLE access_codes DROP CONSTRAINT IF EXISTS max_uses_positive;
  ALTER TABLE access_codes DROP CONSTRAINT IF EXISTS current_uses_non_negative;
  ALTER TABLE access_codes DROP CONSTRAINT IF EXISTS current_uses_lte_max_uses;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE access_codes
ADD CONSTRAINT max_uses_positive CHECK (max_uses > 0 AND max_uses <= 10000),
ADD CONSTRAINT current_uses_non_negative CHECK (current_uses >= 0),
ADD CONSTRAINT current_uses_lte_max_uses CHECK (current_uses <= max_uses);

-- 3. Add database constraints for quests (drop first if exists to be safe)
DO $$ 
BEGIN
  ALTER TABLE quests DROP CONSTRAINT IF EXISTS reward_amount_positive;
  ALTER TABLE quests DROP CONSTRAINT IF EXISTS max_participants_reasonable;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE quests
ADD CONSTRAINT reward_amount_positive CHECK (reward_amount > 0 AND reward_amount <= 50000),
ADD CONSTRAINT max_participants_reasonable CHECK (max_participants IS NULL OR max_participants > 0);

-- 4. Add RLS policy for user_access_codes INSERT
DROP POLICY IF EXISTS "System can record code usage" ON user_access_codes;
CREATE POLICY "System can record code usage" ON user_access_codes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM access_codes 
    WHERE id = access_code_id 
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
);

-- 5. Fix access code race condition with row locking
CREATE OR REPLACE FUNCTION public.validate_access_code(p_code text, p_user_id uuid)
RETURNS TABLE(valid boolean, tier text, error_message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_code_record access_codes%ROWTYPE;
BEGIN
  -- Get and LOCK the access code row to prevent race conditions
  SELECT * INTO v_code_record
  FROM access_codes
  WHERE code = p_code AND is_active = true
  FOR UPDATE;  -- This locks the row until transaction completes
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Invalid access code';
    RETURN;
  END IF;
  
  -- Check if expired
  IF v_code_record.expires_at IS NOT NULL AND v_code_record.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Access code has expired';
    RETURN;
  END IF;
  
  -- Check if max uses reached (now safe due to lock)
  IF v_code_record.current_uses >= v_code_record.max_uses THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Access code has reached maximum uses';
    RETURN;
  END IF;
  
  -- Check if user already used this code
  IF EXISTS (SELECT 1 FROM user_access_codes WHERE user_id = p_user_id AND access_code_id = v_code_record.id) THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'You have already used this access code';
    RETURN;
  END IF;
  
  -- Atomically increment usage count
  UPDATE access_codes
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = v_code_record.id;
  
  -- Record usage
  INSERT INTO user_access_codes (user_id, access_code_id)
  VALUES (p_user_id, v_code_record.id);
  
  -- Assign business role
  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, 'business')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN QUERY SELECT true, v_code_record.tier, NULL::TEXT;
END;
$$;

-- 6. Create secure function for claiming quest rewards
CREATE OR REPLACE FUNCTION public.claim_quest_reward(
  p_quest_participant_id UUID,
  p_expected_reward NUMERIC
)
RETURNS TABLE(success BOOLEAN, new_xp BIGINT, new_level INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_quest_id UUID;
  v_actual_reward NUMERIC;
  v_current_xp BIGINT;
  v_current_level INTEGER;
  v_new_xp BIGINT;
  v_new_level INTEGER;
  v_level_bonus NUMERIC;
  v_quest_bonus NUMERIC;
BEGIN
  -- Get authenticated user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Not authenticated';
    RETURN;
  END IF;
  
  -- Verify quest participant belongs to user and is completable
  SELECT qp.user_id, qp.quest_id, q.reward_amount
  INTO v_user_id, v_quest_id, v_actual_reward
  FROM quest_participants qp
  JOIN quests q ON q.id = qp.quest_id
  WHERE qp.id = p_quest_participant_id 
    AND qp.user_id = auth.uid()
    AND qp.status = 'active'
    AND qp.progress >= 100;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Quest not found or already claimed';
    RETURN;
  END IF;
  
  -- Validate reward matches expected (prevent tampering)
  IF v_actual_reward != p_expected_reward THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Reward amount mismatch';
    RETURN;
  END IF;
  
  -- Get current wallet state
  SELECT xp, level INTO v_current_xp, v_current_level
  FROM wallets
  WHERE user_id = auth.uid();
  
  -- Calculate new values
  v_new_xp := v_current_xp + v_actual_reward;
  v_new_level := LEAST(FLOOR(v_new_xp / 1000) + 1, 100);
  v_level_bonus := (v_new_level - 1) * 10;
  v_quest_bonus := v_actual_reward / 10;
  
  -- Update wallet
  UPDATE wallets
  SET xp = v_new_xp,
      level = v_new_level,
      updated_at = NOW()
  WHERE user_id = auth.uid();
  
  -- Update airdrop allocation
  UPDATE airdrop_allocations
  SET quest_bonus = quest_bonus + v_quest_bonus,
      level_bonus = v_level_bonus,
      total_allocation = base_allocation + quest_bonus + v_quest_bonus + v_level_bonus,
      updated_at = NOW()
  WHERE user_id = auth.uid();
  
  -- Mark quest as completed
  UPDATE quest_participants
  SET status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_quest_participant_id;
  
  -- Record transaction
  INSERT INTO transactions (user_id, type, amount, quest_id, description)
  VALUES (auth.uid(), 'quest_reward', v_actual_reward, v_quest_id, 'Quest reward claimed');
  
  RETURN QUERY SELECT true, v_new_xp, v_new_level, NULL::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION claim_quest_reward TO authenticated;

-- 7. Create secure function for redeeming rewards
CREATE OR REPLACE FUNCTION public.redeem_reward(
  p_reward_cost BIGINT,
  p_reward_name TEXT
)
RETURNS TABLE(success BOOLEAN, new_xp BIGINT, new_level INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_xp BIGINT;
  v_new_xp BIGINT;
  v_new_level INTEGER;
BEGIN
  -- Get authenticated user
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Not authenticated';
    RETURN;
  END IF;
  
  -- Validate cost
  IF p_reward_cost <= 0 OR p_reward_cost > 50000 THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Invalid reward cost';
    RETURN;
  END IF;
  
  -- Get current XP
  SELECT xp INTO v_current_xp
  FROM wallets
  WHERE user_id = auth.uid();
  
  -- Check sufficient balance
  IF v_current_xp < p_reward_cost THEN
    RETURN QUERY SELECT false, v_current_xp, 0::INTEGER, 'Insufficient XP';
    RETURN;
  END IF;
  
  -- Calculate new values
  v_new_xp := v_current_xp - p_reward_cost;
  v_new_level := LEAST(FLOOR(v_new_xp / 1000) + 1, 100);
  
  -- Update wallet
  UPDATE wallets
  SET xp = v_new_xp,
      level = v_new_level,
      updated_at = NOW()
  WHERE user_id = auth.uid();
  
  -- Record transaction
  INSERT INTO transactions (user_id, type, amount, description)
  VALUES (auth.uid(), 'reward_redemption', -p_reward_cost, 'Redeemed: ' || p_reward_name);
  
  RETURN QUERY SELECT true, v_new_xp, v_new_level, NULL::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION redeem_reward TO authenticated;

-- 8. Create function for generating wallet address (server-side only)
CREATE OR REPLACE FUNCTION public.generate_wallet_address()
RETURNS TABLE(success BOOLEAN, wallet_address TEXT, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_address TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Get authenticated user
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Not authenticated';
    RETURN;
  END IF;
  
  -- Check if wallet already has address
  SELECT wallet_address IS NOT NULL INTO v_exists
  FROM wallets
  WHERE user_id = auth.uid();
  
  IF v_exists THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Wallet address already exists';
    RETURN;
  END IF;
  
  -- Generate random Ethereum-style address
  v_address := '0x' || encode(gen_random_bytes(20), 'hex');
  
  -- Update wallet
  UPDATE wallets
  SET wallet_address = v_address,
      updated_at = NOW()
  WHERE user_id = auth.uid();
  
  RETURN QUERY SELECT true, v_address, NULL::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION generate_wallet_address TO authenticated;