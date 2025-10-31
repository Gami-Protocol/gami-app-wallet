-- Fix 1: Add missing UPDATE policy for wallets table
CREATE POLICY "Users can update their own wallet"
ON public.wallets
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix 2: Add missing UPDATE policy for airdrop_allocations table
CREATE POLICY "Users can update their own allocation"
ON public.airdrop_allocations
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix 3: Create server-side business access verification function
CREATE OR REPLACE FUNCTION public.verify_business_access()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role(auth.uid(), 'business'::app_role) 
      OR public.has_role(auth.uid(), 'admin'::app_role);
END;
$$;

-- Fix 4: Create rate limiting infrastructure
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for rate_limits
CREATE POLICY "Users can view their own rate limits"
ON public.rate_limits
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage rate limits"
ON public.rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint_window 
ON public.rate_limits(user_id, endpoint, window_start);

-- Rate limit checking function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 1
)
RETURNS TABLE(allowed BOOLEAN, requests_remaining INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
  v_existing_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 0, 'Not authenticated';
    RETURN;
  END IF;
  
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Clean up old rate limit records
  DELETE FROM public.rate_limits
  WHERE window_start < v_window_start - INTERVAL '1 hour';
  
  -- Get current count for this window
  SELECT id, request_count INTO v_existing_id, v_current_count
  FROM public.rate_limits
  WHERE user_id = v_user_id
    AND endpoint = p_endpoint
    AND window_start > v_window_start
  ORDER BY window_start DESC
  LIMIT 1;
  
  -- If no recent requests, create new record
  IF v_existing_id IS NULL THEN
    INSERT INTO public.rate_limits (user_id, endpoint, request_count)
    VALUES (v_user_id, p_endpoint, 1);
    
    RETURN QUERY SELECT true, p_max_requests - 1, NULL::TEXT;
    RETURN;
  END IF;
  
  -- Check if limit exceeded
  IF v_current_count >= p_max_requests THEN
    RETURN QUERY SELECT false, 0, 'Rate limit exceeded. Please try again later.';
    RETURN;
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits
  SET request_count = request_count + 1,
      updated_at = NOW()
  WHERE id = v_existing_id;
  
  RETURN QUERY SELECT true, p_max_requests - (v_current_count + 1), NULL::TEXT;
END;
$$;

-- Fix 5: Add server-side validation to claim_quest_reward
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
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Authentication required';
    RETURN;
  END IF;
  
  -- Validate input parameters
  IF p_quest_participant_id IS NULL THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Invalid request';
    RETURN;
  END IF;
  
  IF p_expected_reward IS NULL OR p_expected_reward <= 0 OR p_expected_reward > 50000 THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Invalid reward amount';
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
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Operation failed';
    RETURN;
  END IF;
  
  -- Validate reward matches expected (prevent tampering)
  IF v_actual_reward != p_expected_reward THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Operation failed';
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

-- Fix 6: Add server-side validation to redeem_reward
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
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Authentication required';
    RETURN;
  END IF;
  
  -- Validate input parameters
  IF p_reward_cost IS NULL OR p_reward_cost <= 0 OR p_reward_cost > 50000 THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Invalid request';
    RETURN;
  END IF;
  
  IF p_reward_name IS NULL OR LENGTH(p_reward_name) = 0 OR LENGTH(p_reward_name) > 200 THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::INTEGER, 'Invalid request';
    RETURN;
  END IF;
  
  -- Get current XP
  SELECT xp INTO v_current_xp
  FROM wallets
  WHERE user_id = auth.uid();
  
  -- Check sufficient balance
  IF v_current_xp < p_reward_cost THEN
    RETURN QUERY SELECT false, v_current_xp, 0::INTEGER, 'Insufficient balance';
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
  VALUES (auth.uid(), 'reward_redemption', -p_reward_cost, 'Redeemed: ' || LEFT(p_reward_name, 100));
  
  RETURN QUERY SELECT true, v_new_xp, v_new_level, NULL::TEXT;
END;
$$;