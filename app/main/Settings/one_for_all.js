import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

// Replace with your OFA token contract address
const OFA_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;


// Minimal ERC-20 ABI with balanceOf
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export function OFABalance() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletClient || !address) return;

      const provider = new ethers.BrowserProvider(walletClient);
      const contract = new ethers.Contract(OFA_TOKEN_ADDRESS, ERC20_ABI, provider);
      
      const rawBalance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const formatted = ethers.formatUnits(rawBalance, decimals);

      setBalance(formatted);
    };

    fetchBalance();
  }, [walletClient, address]);

  if (!isConnected) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>💰 OFA Balance</h3>
      <p>{balance !== null ? `${balance} OFA` : 'Fetching...'}</p>
    </div>
  );
}