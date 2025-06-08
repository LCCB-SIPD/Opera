'use client';
import '@/app/css/setting.css';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Define Core Testnet network info
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

const queryClient = new QueryClient();

function WalletStatus() {
  const { address, isConnected } = useAccount();

  if (!isConnected) return <p>Wallet not connected</p>;

  return (
    <div>
      <p>✅ Connected!</p>
    </div>
  );
}

export default function Setting() {
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
  
    const conf = getDefaultConfig({
      appName: 'Test Wallet App',
      projectId: '2a6ea45d7b774258abb68a5e1d7d80e0',
      chains: [coreTestnet],
    });
    setConfig(conf);
    
    const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth", { credentials: "include" });
                if (!res.ok) {
                    router.replace("/");
                    alert("Invalid Credentials")
                    return;
                }
                const userData = await res.json();
                setUser(userData);
            } catch (error) {
                router.replace("/");
            }
        };

        checkAuth();
    
  }, [router]);

  if (!config) return <p>Loading...</p>;

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="Wallet_Connect">
            <WalletStatus />
            <h1>Connect Your Wallet</h1>
            <ConnectButton />
            
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
    
  );
}