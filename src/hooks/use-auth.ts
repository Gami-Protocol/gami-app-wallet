import React from 'react';

// Check if we're inside a Privy provider context
function usePrivySafely() {
  try {
    // Only import and use if we can access React context
    const { usePrivy } = require('@privy-io/react-auth');
    return usePrivy();
  } catch (e) {
    return null;
  }
}

// Safe auth hook that falls back gracefully when Privy isn't configured
export function useAuth(): any {
  const privyContext = usePrivySafely();
  
  if (privyContext) {
    return { ...privyContext, provider: 'privy' as const };
  }
  
  // Fallback: no auth provider configured
  return {
    provider: 'none' as const,
    ready: true,
    authenticated: false,
    login: () => {
      alert('Demo mode: Login not configured. The wallet will open in demo mode.');
    },
    logout: () => {},
    user: { wallet: { address: '0x1234...5678' } },
  };
}
