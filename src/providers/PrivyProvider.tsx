import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { ReactNode } from 'react';

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID as string;

  if (!appId) {
    console.error('[Privy] VITE_PRIVY_APP_ID is required but not found in environment variables');
    return <>{children}</>;
  }

  return (
    <Privy
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#6B4EFF',
          logo: 'https://c8a70b11-cf73-4090-8c2a-4e214504d79e.lovableproject.com/gami-logo.png',
        },
        loginMethods: ['wallet', 'email', 'google'],
        embeddedWallets: {
          showWalletUIs: true,
        },
      }}
    >
      {children}
    </Privy>
  );
};
