'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';

import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, goerli } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Test Wallet App',
  projectId: '2a6ea45d7b774258abb68a5e1d7d80e0',
  chains: [mainnet, goerli],
  ssr: true,
});

const queryClient = new QueryClient();

function WalletStatus() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <p>Wallet not connected</p>;

  return <p>Connected wallet: {address}</p>;
}

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{ padding: 20 }}>
            <h1>✅ Working WalletConnect + RainbowKit</h1>
            <ConnectButton />
            <WalletStatus />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}