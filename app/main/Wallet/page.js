'use client';
import '@/app/css/wallet.css';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import Image from "next/image";
import OFABalance from "@/app/components/one_for_all";
import Transaction from "@/app/components/Transaction";

import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Setting() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [walletStatus, setWalletStatus] = useState('Not Connected');
  const { address, isConnected } = useAccount(); 
    
    
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
        if (!res.ok) {
          router.replace("/");
          alert("Invalid Credentials");
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
  
  useEffect(() => {
      
      if (isConnected && address) {
          setWalletStatus(address)
      } else {
          setWalletStatus('Not Connected')
      }
      
      
  }, [isConnected, address])

  return (
    <div className='wallet_cons'>
      <div className='wallet_banner'>
          <button onClick={() => { router.push('/main/Home') }}>Back</button>
      <div>
        <h1>Wallet Connect</h1>
      </div>
      </div>   

      <div className="Wallet_Connect">
        <div className='wallet_left'>
          <Image
            src="/Icons/logo-transparent.png"
            alt="logo"
            width={60}
            height={60}
            className='walletImage'
          />
          <p>{walletStatus}</p>
          
           </div>
           <OFABalance />
        <div className='wallet_right'>
          <ConnectButton />
              
        </div>
        
        
        
        <a href={`https://scan.test2.btcs.network/tokentxns?a=${address}`}
  style={{ color: '#00f', margin: '12px' }}
  target="_blank"
  rel="noopener noreferrer"
>
  Transaction History
</a>
      </div>
      
      
    </div>
  );
}
