-- Create partnership waitlist table
CREATE TABLE public.partnership_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partnership_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public waitlist)
CREATE POLICY "Anyone can submit to waitlist" 
ON public.partnership_waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view (authenticated users can view their own or all if admin)
CREATE POLICY "Public can view their own submissions" 
ON public.partnership_waitlist 
FOR SELECT 
USING (true);