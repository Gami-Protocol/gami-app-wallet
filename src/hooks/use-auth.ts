import { usePrivy as usePrivyHook } from '@privy-io/react-auth';

// Safe auth hook that falls back gracefully when Privy isn't configured
export function useAuth(): any {
  try {
    const ctx = usePrivyHook();
    return { ...ctx, provider: 'privy' as const };
  } catch (e) {
    // Fallback: no auth provider configured
    return {
      provider: 'none' as const,
      ready: true,
      authenticated: false,
      login: () => {
        console.warn('[Auth] Privy not configured. Set VITE_PRIVY_APP_ID to enable login.');
        alert('Login is not configured yet. Please set VITE_PRIVY_APP_ID in project secrets to enable Privy login.');
      },
      logout: undefined,
      user: undefined,
    };
  }
}
