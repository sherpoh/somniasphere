import { useEffect, useState } from 'react';
import { subscribeTokenPair } from '../streams/tokenPairStream';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

interface TokenPriceCardProps {
  pairId: string;
  useDummy: boolean;
}

export default function TokenPriceCard({ pairId, useDummy }: TokenPriceCardProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  useEffect(() => {
    let stream: { unsubscribe: () => void } | null = null;

    subscribeTokenPair(pairId, (data) => {
      setPrevPrice((prev) => (prev !== null ? price : null));
      setPrice(data.price);
    }, useDummy).then((s) => {
      stream = s;
    });

    return () => {
      stream?.unsubscribe?.();
    };
  }, [pairId, useDummy]);

  const priceChange = price !== null && prevPrice !== null ? price - prevPrice : 0;
  const priceUp = priceChange > 0;
  const priceDown = priceChange < 0;

  return (
    <div className="relative w-full bg-white border border-somnia-light rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">
      {/* Mode Indicator */}
      <div
        className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-semibold ${
          useDummy ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'
        }`}
      >
        {useDummy ? 'DUMMY' : 'LIVE'}
      </div>

      {/* Pair Title */}
      <h2 className="text-xl font-semibold text-somnia-dark mb-2">{pairId}</h2>

      {/* Price Display */}
      <div className="flex items-center space-x-2">
        <p
          className={`text-4xl font-bold transition-all duration-300 ${
            priceUp ? 'text-green-600' : priceDown ? 'text-red-600' : 'text-gray-800'
          }`}
        >
          {price !== null ? `$${price.toFixed(4)}` : 'Loading...'}
        </p>

        {price !== null && prevPrice !== null && (
          <>
            {priceUp && <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />}
            {priceDown && <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />}
          </>
        )}
      </div>

      {/* Price Change */}
      {price !== null && prevPrice !== null && (
        <p
          className={`text-sm mt-1 font-medium ${
            priceUp ? 'text-green-600' : priceDown ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {priceUp && '+'}
          {priceDown && ''}
          {priceChange.toFixed(4)}
        </p>
      )}
    </div>
  );
}