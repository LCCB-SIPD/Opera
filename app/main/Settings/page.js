'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';

import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const coreTestnet = {
  id: 1114,
  name: 'Core Blockchain TestNet',
  network: 'core-testnet',
  nativeCurrency: {
    name: 'tCORE2',
    symbol: 'tCORE2',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test2.btcs.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CoreScan',
      url: 'https://scan.test2.btcs.network',
    },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: 'Test Wallet App',
  projectId: '2a6ea45d7b774258abb68a5e1d7d80e0',
  chains: [coreTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

function WalletStatus() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <p>Wallet not connected</p>;

  return <p>Connected</p>;
}

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="Wallet_Connect">
            <h1>✅ Working WalletConnect + RainbowKit</h1>
            <ConnectButton />
            <WalletStatus />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
