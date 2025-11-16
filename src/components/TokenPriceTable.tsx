import { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

interface TokenPriceTableProps {
  pairs: string[];
  useDummy: boolean;
}

interface PriceData {
  [pairId: string]: {
    price: number | null;
    prev: number | null;
    volume: number | null;
    mcap: number | null;
  };
}

function generateRealisticDummyData(pairId: string, existingPrices: number[]): {
  price: number;
  volume: number;
  mcap: number;
} {
  let price: number;
  do {
    price = parseFloat((Math.random() * 100 + 1).toFixed(4));
  } while (existingPrices.includes(price));

  let volume = 0;
  let mcap = 0;

  switch (pairId) {
    case 'STT-USDT':
      volume = Math.floor(Math.random() * 9_000_000 + 1_000_000); // 1M–10M
      mcap = Math.floor(Math.random() * 400_000_000 + 100_000_000); // 100M–500M
      break;
    case 'STT-USDC':
      volume = Math.floor(Math.random() * 4_500_000 + 500_000); // 0.5M–5M
      mcap = Math.floor(Math.random() * 250_000_000 + 50_000_000); // 50M–300M
      break;
    case 'STT-ETH':
      volume = Math.floor(Math.random() * 1_800_000 + 200_000); // 0.2M–2M
      mcap = Math.floor(Math.random() * 180_000_000 + 20_000_000); // 20M–200M
      break;
    case 'STT-SOL':
      volume = Math.floor(Math.random() * 900_000 + 100_000); // 0.1M–1M
      mcap = Math.floor(Math.random() * 90_000_000 + 10_000_000); // 10M–100M
      break;
    default:
      volume = Math.floor(Math.random() * 1_000_000 + 100_000);
      mcap = Math.floor(volume * (Math.random() * 10 + 1));
  }

  return { price, volume, mcap };
}

export default function TokenPriceTable({ pairs, useDummy }: TokenPriceTableProps) {
  const [prices, setPrices] = useState<PriceData>({});

  useEffect(() => {
    if (useDummy) {
      const interval = setInterval(() => {
        setPrices((prev) => {
          const existingPrices = Object.values(prev).map((d) => d.price ?? 0);
          const updated: PriceData = {};

          pairs.forEach((pairId) => {
            const { price, volume, mcap } = generateRealisticDummyData(pairId, existingPrices);
            updated[pairId] = {
              price,
              prev: prev[pairId]?.price ?? null,
              volume,
              mcap,
            };
            existingPrices.push(price);
          });

          return updated;
        });
      }, 2000);

      return () => clearInterval(interval);
    }

    return () => {};
  }, [pairs, useDummy]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <thead className="bg-indigo-100 dark:bg-gray-800 text-indigo-900 dark:text-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Pair</th>
            <th className="text-right px-4 py-2">Price</th>
            <th className="text-right px-4 py-2">Change</th>
            <th className="text-right px-4 py-2">Volume</th>
            <th className="text-right px-4 py-2">MCap</th>
            <th className="text-center px-4 py-2">Mode</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pairId) => {
            const data = prices[pairId];
            const price = data?.price ?? null;
            const prev = data?.prev ?? null;
            const volume = data?.volume ?? null;
            const mcap = data?.mcap ?? null;
            const change = price !== null && prev !== null ? price - prev : null;
            const up = change !== null && change > 0;
            const down = change !== null && change < 0;

            return (
              <tr
                key={pairId}
                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 font-semibold text-indigo-900 dark:text-gray-100">{pairId}</td>
                <td
                  className={`px-4 py-2 text-right font-mono text-lg ${
                    up ? 'text-green-600 dark:text-green-400' : down ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {price !== null ? `$${price.toFixed(4)}` : '—'}
                </td>
                <td className="px-4 py-2 text-right font-mono flex items-center justify-end gap-1">
                  {change !== null ? (
                    <>
                      <span
                        className={`${
                          up ? 'text-green-500 dark:text-green-300' : down ? 'text-red-500 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {up ? '+' : ''}
                        {change.toFixed(4)}
                      </span>
                      {up ? (
                        <FaArrowUp className="text-green-500 dark:text-green-300" />
                      ) : down ? (
                        <FaArrowDown className="text-red-500 dark:text-red-300" />
                      ) : (
                        <FaMinus className="text-gray-400 dark:text-gray-500" />
                      )}
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-2 text-right font-mono text-sm text-gray-700 dark:text-gray-300">
                  {volume !== null ? `$${volume.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-2 text-right font-mono text-sm text-gray-700 dark:text-gray-300">
                  {mcap !== null ? `$${mcap.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      useDummy
                        ? 'bg-yellow-400 text-black dark:bg-yellow-300 dark:text-gray-900'
                        : 'bg-green-500 text-white dark:bg-green-400 dark:text-gray-900'
                    }`}
                  >
                    {useDummy ? 'DUMMY' : 'LIVE'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}