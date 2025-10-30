-- Add username to profiles table
ALTER TABLE public.profiles
ADD COLUMN username TEXT UNIQUE;

-- Create business_profiles table for business-specific information
CREATE TABLE public.business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on business_profiles
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Business users can view their own business profile
CREATE POLICY "Business users can view their own business profile"
ON public.business_profiles
FOR SELECT
USING (
  auth.uid() = user_id AND 
  (has_role(auth.uid(), 'business') OR has_role(auth.uid(), 'admin'))
);

-- Business users can update their own business profile
CREATE POLICY "Business users can update their own business profile"
ON public.business_profiles
FOR UPDATE
USING (
  auth.uid() = user_id AND 
  (has_role(auth.uid(), 'business') OR has_role(auth.uid(), 'admin'))
);

-- System can create business profiles
CREATE POLICY "System can create business profiles"
ON public.business_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger to update updated_at on business_profiles
CREATE TRIGGER update_business_profiles_updated_at
BEFORE UPDATE ON public.business_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();