'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ERC20Transfers() {
  const { address, isConnected } = useAccount();

  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_BTCS_API_KEY;

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchTransfers = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://scan.test2.btcs.network/api?module=account&action=tokentx&address=${address}&apikey=${API_KEY}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        if (data.status !== '1') {
          throw new Error(data.message);
        }

        setTransfers(data.result || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [address, isConnected, API_KEY]);

  if (!isConnected) return <p>Please connect your wallet first 😅</p>;
  if (loading) return <p>Loading transfers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 border rounded-md text-white bg-gray-900 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">ERC-20 Transfer History</h2>
      {transfers.length === 0 ? (
        <p>No transfers found 😭</p>
      ) : (
        <ul className="space-y-1 max-h-60 overflow-auto">
          {transfers.map((tx) => (
            <li key={tx.hash}>
              <a
                href={`https://scan.test2.btcs.network/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {tx.hash.slice(0, 10)}... from {tx.from.slice(0, 6)} → {tx.to.slice(0, 6)}
              </a>{' '}
              — {tx.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}