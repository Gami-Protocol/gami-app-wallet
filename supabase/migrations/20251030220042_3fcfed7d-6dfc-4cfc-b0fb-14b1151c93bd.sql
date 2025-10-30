-- Create access codes table for business registration
CREATE TABLE public.access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'growth', 'enterprise', 'free')),
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage all access codes
CREATE POLICY "Admins can manage access codes"
ON public.access_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Track which codes were used by which users
CREATE TABLE public.user_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_code_id UUID REFERENCES public.access_codes(id) ON DELETE CASCADE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, access_code_id)
);

-- Enable RLS
ALTER TABLE public.user_access_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own code usage
CREATE POLICY "Users can view their own code usage"
ON public.user_access_codes
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all code usage
CREATE POLICY "Admins can view all code usage"
ON public.user_access_codes
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Function to validate and consume access code
CREATE OR REPLACE FUNCTION public.validate_access_code(
  p_code TEXT,
  p_user_id UUID
)
RETURNS TABLE(valid BOOLEAN, tier TEXT, error_message TEXT)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code_record access_codes%ROWTYPE;
BEGIN
  -- Get the access code
  SELECT * INTO v_code_record
  FROM access_codes
  WHERE code = p_code AND is_active = true;
  
  -- Check if code exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Invalid access code';
    RETURN;
  END IF;
  
  -- Check if expired
  IF v_code_record.expires_at IS NOT NULL AND v_code_record.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Access code has expired';
    RETURN;
  END IF;
  
  -- Check if max uses reached
  IF v_code_record.current_uses >= v_code_record.max_uses THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Access code has reached maximum uses';
    RETURN;
  END IF;
  
  -- Check if user already used this code
  IF EXISTS (SELECT 1 FROM user_access_codes WHERE user_id = p_user_id AND access_code_id = v_code_record.id) THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'You have already used this access code';
    RETURN;
  END IF;
  
  -- Increment usage count
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
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_access_codes_updated_at
BEFORE UPDATE ON public.access_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert some initial access codes
INSERT INTO public.access_codes (code, tier, max_uses, expires_at) VALUES
  ('FREE-TIER-2025', 'free', 100, now() + interval '1 year'),
  ('STARTER-LAUNCH', 'starter', 50, now() + interval '6 months'),
  ('ENTERPRISE-VIP', 'enterprise', 10, now() + interval '1 year');