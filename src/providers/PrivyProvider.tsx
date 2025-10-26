import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { ReactNode } from 'react';

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID as string | undefined;

  if (!appId) {
    console.warn('[Privy] Missing VITE_PRIVY_APP_ID. Rendering without Privy provider.');
    return <>{children}</>;
  }

  return (
    <Privy
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#6B4EFF',
        },
        loginMethods: ['email', 'google', 'wallet'],
      }}
    >
      {children}
    </Privy>
  );
};
