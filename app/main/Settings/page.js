'use client';
import '@/app/css/setting.css';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import Image from "next/image";
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
      <p>{address}</p>
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
          <div className='setting_banner'>
            <button onClick={() => {router.push('/main/Home')}}>Back</button>
            <div>
              <h1>Settings</h1>
            </div>
          </div>
          <div className="Wallet_Connect">
            <div className='wallet_left'>
              <Image 
              src="/Icons/logo-transparent.png"
              alt="logo"
              width={40}
              height={40}
              className='walletImage'
              />
              <WalletStatus />
            </div>
            <div className='wallet_right'>
              <ConnectButton />
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
    
  );
}