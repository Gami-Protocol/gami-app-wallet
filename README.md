# 🎮 Gami Protocol

**The Modular On-Chain Gamification Engine**

Gami Protocol unifies XP, rewards, and AI-driven engagement across apps, games, and blockchains. A comprehensive gamification platform that bridges Web2 and Web3 experiences.


https://gamiprotocol.xyz/

## ✨ Features

### 🎯 User Portal
- **Gamified Wallet**: Manage your crypto wallet with XP tracking and level progression
- **AI-Generated Avatars**: Unique character avatars generated when wallets are created
- **Quest System**: Complete challenges and earn rewards
- **Achievement Tracking**: Monitor your progress and milestones
- **Reward Redemption**: Exchange XP for exclusive rewards
- **Airdrop Allocations**: Track and claim token distributions
- **Level & XP System**: Progress through levels with bonus multipliers

### 💼 Business Portal
- **Dashboard Analytics**: Comprehensive metrics and insights
- **Quest Management**: Create and manage gamification campaigns
- **User Analytics**: Track engagement and participation
- **Settings & Configuration**: Customize your gamification experience

### 🔐 Authentication & Wallet Integration
- **Privy Integration**: Secure Web3 authentication
- **Multiple Login Methods**: Wallet, email, and Google sign-in
- **Embedded Wallets**: Create wallets without leaving the app
- **External Wallet Connection**: Link existing crypto wallets

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **React Router** - Client-side routing
- **TanStack Query** - Server state management

### Backend (Lovable Cloud)
- **Supabase** - Backend as a service
- **PostgreSQL** - Robust database
- **Row Level Security** - Data protection
- **Edge Functions** - Serverless compute
- **AI Gateway** - Image generation for avatars

### Web3
- **Privy** - Wallet authentication
- **Wagmi** - React hooks for Ethereum

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layouts/        # Layout wrappers for user/business portals
│   └── ui/            # shadcn/ui components
├── pages/              # Route pages
│   ├── user/          # User portal pages
│   └── business/      # Business portal pages
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
├── integrations/      # Third-party integrations
│   └── supabase/     # Supabase client & types
└── providers/         # Context providers

supabase/
├── functions/         # Edge functions
│   ├── generate-avatar/      # AI avatar generation
│   ├── create-checkout/      # Payment processing
│   └── manage-access-codes/  # Access control
└── migrations/        # Database migrations
```

## 🗄 Database Schema

### Core Tables
- **wallets** - User wallet data with XP and levels
- **quests** - Gamification challenges
- **quest_user** - User quest participation
- **quest_completions** - Completed quest records
- **rewards** - Available rewards catalog
- **user_rewards** - Redeemed rewards tracking
- **airdrop_allocations** - Token distribution management

## 🎨 Key Features Implementation

### Avatar Generation
When users create a wallet, an AI-generated character avatar is automatically created using the Lovable AI Gateway with Google's Gemini model.

### XP & Leveling System
- XP accumulates through quest completion
- Level calculation: `floor(sqrt(xp / 100))`
- Each level provides a 5% bonus multiplier
- XP required for next level scales progressively

### Quest System
- Businesses create quests with XP rewards
- Users complete quests to earn XP
- Real-time progress tracking
- Claim system with validation

### Reward Redemption
- Spend XP to unlock rewards
- Persistent reward catalog
- Transaction history tracking

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Authentication required** for protected routes
- **Input validation** using Zod schemas
- **Secure wallet integration** via Privy
- **Environment variables** for sensitive data


## 🆘 Support

- **Discord**: https://discord.gg/WzsZpqGy7j
- **Email**: info@gamiprotocol.xyz

