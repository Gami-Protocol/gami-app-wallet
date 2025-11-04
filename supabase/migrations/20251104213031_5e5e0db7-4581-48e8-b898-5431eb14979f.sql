-- Fix critical security issue: Partnership waitlist publicly readable
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view their own submissions" ON public.partnership_waitlist;

-- Add admin-only policy for viewing submissions
CREATE POLICY "Admins can view all waitlist submissions"
ON public.partnership_waitlist
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));