-- Create quest status enum
CREATE TYPE public.quest_status AS ENUM ('draft', 'active', 'completed', 'expired');

-- Create quest difficulty enum
CREATE TYPE public.quest_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Create transaction type enum
CREATE TYPE public.transaction_type AS ENUM ('reward', 'purchase', 'transfer', 'stake');

-- Create quests table
CREATE TABLE public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty public.quest_difficulty NOT NULL DEFAULT 'medium',
  reward_amount DECIMAL(20, 8) NOT NULL,
  reward_token TEXT NOT NULL DEFAULT 'GAMI',
  max_participants INTEGER,
  current_participants INTEGER NOT NULL DEFAULT 0,
  status public.quest_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  requirements JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date > start_date)
);

-- Enable RLS on quests
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Create quest_participants table
CREATE TABLE public.quest_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.quest_status NOT NULL DEFAULT 'active',
  progress INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quest_id, user_id)
);

-- Enable RLS on quest_participants
ALTER TABLE public.quest_participants ENABLE ROW LEVEL SECURITY;

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_url TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  quest_id UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.transaction_type NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  token TEXT NOT NULL DEFAULT 'GAMI',
  description TEXT NOT NULL,
  quest_id UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create wallets table
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL DEFAULT 'GAMI',
  balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Enable RLS on wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quests
CREATE POLICY "Anyone can view active quests"
  ON public.quests
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Business users can manage their own quests"
  ON public.quests
  FOR ALL
  TO authenticated
  USING (
    business_id = auth.uid() AND 
    (public.has_role(auth.uid(), 'business') OR public.has_role(auth.uid(), 'admin'))
  );

-- RLS Policies for quest_participants
CREATE POLICY "Users can view their own quest participation"
  ON public.quest_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can join quests"
  ON public.quest_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own quest progress"
  ON public.quest_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Business users can view participants for their quests"
  ON public.quest_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quests 
      WHERE quests.id = quest_participants.quest_id 
      AND quests.business_id = auth.uid()
    ) AND (public.has_role(auth.uid(), 'business') OR public.has_role(auth.uid(), 'admin'))
  );

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements"
  ON public.achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Achievements can be created for users"
  ON public.achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Transactions can be created"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallet"
  ON public.wallets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own wallet"
  ON public.wallets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Wallets can be created for users"
  ON public.wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to create default wallet on user creation
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id, token, balance)
  VALUES (NEW.id, 'GAMI', 0);
  
  RETURN NEW;
END;
$$;

-- Trigger to create wallet after profile creation
CREATE TRIGGER create_wallet_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_wallet();

-- Triggers for updated_at
CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_quest_participants_updated_at
  BEFORE UPDATE ON public.quest_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();