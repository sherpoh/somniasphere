import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FLIP_GAME_ADDRESS, FLIP_GAME_ABI, FLIP_TOKEN_ADDRESS, FLIP_TOKEN_ABI } from '../constants';

export default function GameTab() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balanceSTT, setBalanceSTT] = useState<string>('0');
  const [balanceFLIP, setBalanceFLIP] = useState<string>('0');
  const [choice, setChoice] = useState<0 | 1>(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ address: string; points: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const connectWallet = async () => {
  try {
    if (!window.ethereum) return alert('Please install MetaMask');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    fetchBalances(address);
  } catch (err) {
    console.error('Wallet connection failed:', err);
  }
};

const fetchBalances = async (address: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sttBalance = await provider.getBalance(address);
    setBalanceSTT(ethers.utils.formatEther(sttBalance));

    const flipToken = new ethers.Contract(FLIP_TOKEN_ADDRESS, FLIP_TOKEN_ABI, provider);
    const flipBalance = await flipToken.balanceOf(address);
    setBalanceFLIP(ethers.utils.formatEther(flipBalance));
  } catch (err) {
    console.error('Failed to fetch balances:', err);
  }
};

const playFlip = async () => {
  try {
    if (!window.ethereum) return alert('Please connect a wallet like MetaMask');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(FLIP_GAME_ADDRESS, FLIP_GAME_ABI, signer);

    setLoading(true);
    setStatus('Sending transaction...');

    const tx = await contract.playFlip(choice, {
      value: ethers.utils.parseEther('0.05'),
    });
    await tx.wait();

    setStatus('Flip complete! Check your wallet for FLIP tokens.');
    setLoading(false);
    fetchLeaderboard();
    if (walletAddress) fetchBalances(walletAddress);
  } catch (err: any) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
    setLoading(false);
  }
};

  const fetchLeaderboard = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://dream-rpc.somnia.network');
      const contract = new ethers.Contract(FLIP_GAME_ADDRESS, FLIP_GAME_ABI, provider);
      const [addresses, points] = await contract.getLeaderboard();
      const data = addresses.map((addr: string, i: number) => ({
        address: addr,
        points: points[i].toNumber(),
      }));
	const sortedData = data.sort(
	  (a: { address: string; points: number }, b: { address: string; points: number }) => b.points - a.points
	);
      setLeaderboard(sortedData);
    } catch (err) {
      console.error('Failed to take the leaderboard:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleLeaderboard = leaderboard.slice(startIndex, endIndex);
    return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">SomniaSphere Game Arena</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Welcome to the SomniaSphere arena! Flip coins, collect FLIP tokens, and increase your points.
      </p>

      {/* Wallet Connect + Balance */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div>
          {walletAddress ? (
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-mono">
                Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                💰 STT: <span className="font-mono">{balanceSTT}</span> | ✅ FLIP: <span className="font-mono">{balanceFLIP}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Wallet is not connected yet</p>
          )}
        </div>
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          {walletAddress ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>

      {/* Flip Coin UI */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">🎲 Flip Coin</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setChoice(0)}
            className={`px-4 py-2 rounded-full ${
              choice === 0
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            HEAD
          </button>
          <button
            onClick={() => setChoice(1)}
            className={`px-4 py-2 rounded-full ${
              choice === 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            TAIL
          </button>
        </div>
        <button
          onClick={playFlip}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Flipping...' : 'Flip Now (0.05 STT)'}
        </button>
        {status && <p className="text-sm text-yellow-500">{status}</p>}
      </div>

      {/* Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-2">🏆 Leaderboard</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="py-1">Address</th>
              <th className="py-1 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {visibleLeaderboard.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-2 text-gray-500 dark:text-gray-400">
                  There are no players yet.
                </td>
              </tr>
            ) : (
				visibleLeaderboard.map((entry, i) => (
				  <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
					<td className="py-1 font-mono text-indigo-700 dark:text-indigo-300">
					  #{startIndex + i + 1} — {entry.address.slice(0, 10)}...
					</td>
					<td className="py-1 text-right font-bold text-gray-800 dark:text-gray-100">
					  {entry.points}
					</td>
				  </tr>
				))
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-2 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={endIndex >= leaderboard.length}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Smart Contract Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-2">📄 Smart Contract</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
		The FlipCoin contract runs on the <strong>Somnia Testnet</strong>. You can add this address to your OKEx or MetaMask wallet to view FLIP tokens and interactions.
        </p>
        <div className="mt-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 font-mono text-sm text-indigo-700 dark:text-indigo-300">
          <span>0x340DcEaF9bd241B1f6dC6c190c7a53808bcE593A</span>
          <button
            onClick={() => navigator.clipboard.writeText('0x340DcEaF9bd241B1f6dC6c190c7a53808bcE593A')}
            className="ml-4 px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
