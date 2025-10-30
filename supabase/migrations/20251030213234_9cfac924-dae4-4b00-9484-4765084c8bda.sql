-- Add XP and level tracking to wallets table
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS xp bigint NOT NULL DEFAULT 0;
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1;
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS wallet_address text;

-- Create airdrop allocation tracking table
CREATE TABLE IF NOT EXISTS public.airdrop_allocations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  base_allocation numeric NOT NULL DEFAULT 100,
  quest_bonus numeric NOT NULL DEFAULT 0,
  level_bonus numeric NOT NULL DEFAULT 0,
  total_allocation numeric GENERATED ALWAYS AS (base_allocation + quest_bonus + level_bonus) STORED,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.airdrop_allocations ENABLE ROW LEVEL SECURITY;

-- RLS policies for airdrop_allocations
CREATE POLICY "Users can view their own allocation"
  ON public.airdrop_allocations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own allocation"
  ON public.airdrop_allocations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allocations can be created for users"
  ON public.airdrop_allocations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create airdrop allocation for new users
CREATE OR REPLACE FUNCTION public.create_airdrop_allocation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.airdrop_allocations (user_id, base_allocation)
  VALUES (NEW.id, 100);
  
  RETURN NEW;
END;
$$;

-- Trigger to create allocation on user creation
DROP TRIGGER IF EXISTS on_user_created_airdrop ON auth.users;
CREATE TRIGGER on_user_created_airdrop
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_airdrop_allocation();

-- Add updated_at trigger for airdrop_allocations
DROP TRIGGER IF EXISTS update_airdrop_allocations_updated_at ON public.airdrop_allocations;
CREATE TRIGGER update_airdrop_allocations_updated_at
  BEFORE UPDATE ON public.airdrop_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();