import { useEffect, useState } from 'react';
import TokenPriceTable from './components/TokenPriceTable';
import LiveChart from './components/LiveChart';
import GameTab from './pages/GameTab';
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const tokenPairs = ['STT-USDT', 'STT-USDC', 'STT-ETH', 'STT-SOL'];

export default function App() {
  const [useDummy, setUseDummy] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'game'>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPair, setSelectedPair] = useState(tokenPairs[0]);
  const [prices, setPrices] = useState<{ [pairId: string]: { price: number | null } }>({});

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Simulasi dummy price update untuk chart
  useEffect(() => {
    if (useDummy) {
      const interval = setInterval(() => {
        setPrices((prev) => {
          const updated = { ...prev };
          tokenPairs.forEach((pair) => {
            const prevPrice = prev[pair]?.price ?? Math.random() * 100 + 1;
            const newPrice = parseFloat((prevPrice + (Math.random() - 0.5) * 2).toFixed(4));
            updated[pair] = { price: newPrice };
          });
          return updated;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [useDummy]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <header className="w-full max-w-screen-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-300">SomniaSphere</h1>
          <div className="flex flex-wrap gap-2">
            {['home', 'game'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'home' | 'game')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-300 dark:border-indigo-500'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-screen-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6">
        {activeTab === 'home' ? (
          <>
            {/* Pair Selector */}
            <div className="flex flex-wrap gap-2">
              {tokenPairs.map((pair) => (
                <button
                  key={pair}
                  onClick={() => setSelectedPair(pair)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedPair === pair
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-300 dark:border-indigo-500'
                  }`}
                >
                  {pair}
                </button>
              ))}
            </div>

            {/* Chart */}
            <LiveChart pairId={selectedPair} price={prices[selectedPair]?.price ?? null} />

            {/* Toggle Mode */}
            <div className="flex justify-end">
              <button
                onClick={() => setUseDummy((prev) => !prev)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
              >
                Switch to {useDummy ? 'Live' : 'Dummy'} Mode
              </button>
            </div>

            {/* Price Table */}
            <TokenPriceTable pairs={tokenPairs} useDummy={useDummy} />
          </>
        ) : (
          <GameTab />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-screen-lg mt-10 text-center text-sm text-gray-500">
        <div className="flex flex-col items-center space-y-2">
          <p>Built with ❤️ by <span className="font-semibold text-indigo-600">Sherpoh</span></p>
          <div className="flex space-x-4 text-xl text-indigo-500">
            <a href="https://github.com/sherpoh" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">
              <FaGithub />
            </a>
            <a href="https://twitter.com/0xsherpoh" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">
              <FaTwitter />
            </a>
            <a href="https://www.youtube.com/@sherlypontoh3073" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}