import { usePrivy } from '@privy-io/react-auth';

// Auth hook that uses Privy for wallet authentication
export function useAuth() {
  const privy = usePrivy();
  
  return {
    ...privy,
    provider: 'privy' as const,
  };
}
