import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { ReactNode } from 'react';

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Privy
      appId="cm5q8yv0g00kfl60fpvjwbnd7"
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
