import { z } from 'zod';

export const xpUpdateSchema = z.object({
  amount: z.number().int().positive().max(100000, "XP amount too large"),
});

export const questClaimSchema = z.object({
  questId: z.string().uuid("Invalid quest ID"),
  reward: z.number().int().positive().max(50000, "Reward amount invalid"),
});

export const airdropUpdateSchema = z.object({
  questBonus: z.number().min(0).max(10000, "Quest bonus out of range"),
  levelBonus: z.number().min(0).max(10000, "Level bonus out of range"),
});

export const walletAddressSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
});

// Level progression system - export for use in components
export const LEVEL_CONFIG = {
  xpPerLevel: 1000,
  maxLevel: 100,
  airdropBonusPerLevel: 10,
} as const;

export function calculateLevel(xp: number): number {
  return Math.min(
    Math.floor(xp / LEVEL_CONFIG.xpPerLevel) + 1,
    LEVEL_CONFIG.maxLevel
  );
}

export function calculateXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_CONFIG.maxLevel) return 0;
  return currentLevel * LEVEL_CONFIG.xpPerLevel;
}

export function calculateLevelBonus(level: number): number {
  return (level - 1) * LEVEL_CONFIG.airdropBonusPerLevel;
}
