-- Add avatar_url column to wallets table
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS avatar_url TEXT;