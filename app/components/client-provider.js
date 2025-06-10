'use client';

import dynamic from 'next/dynamic';

// Dynamically import WalletProviders with SSR disabled
const WalletProviders = dynamic(() => import('./WalletProviders'), {
  ssr: false,
});

export default function ProvidersClientWrapper({ children }) {
  return <WalletProviders>{children}</WalletProviders>;
}