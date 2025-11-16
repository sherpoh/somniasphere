import { SDK } from '@somnia-chain/streams';
import { createPublicClient, createWalletClient, http } from 'viem';
import { defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://dream-rpc.somnia.network'] },
    public: { http: ['https://dream-rpc.somnia.network'] },
  },
});

// Ganti langsung di sini atau pakai import.meta.env.VITE_PRIVATE_KEY
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const PUBLISHER_ADDRESS = import.meta.env.VITE_PUBLIC_KEY;

const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY),
  chain: somniaTestnet,
  transport: http('https://dream-rpc.somnia.network'),
});

const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http('https://dream-rpc.somnia.network'),
});

const sdk = new SDK({ public: publicClient, wallet: walletClient });

const tokenPairSchema = 'string pairId, uint64 timestamp, uint256 price';

export const subscribeTokenPair = async (
  pairId: string,
  onUpdate: (data: { price: number }) => void,
  useDummy: boolean
) => {
  if (useDummy) {
    // 🔴 DUMMY MODE
    let price = Math.random() * 10 + 1;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.2;
      price = Math.max(0, price + delta);
      onUpdate({ price: parseFloat(price.toFixed(4)) });
    }, 1000);
    return { unsubscribe: () => clearInterval(interval) };
  } else {
    // 🟢 LIVE MODE
    const schemaId = await sdk.streams.computeSchemaId(tokenPairSchema);

    const poll = async () => {
      try {
        const response = await sdk.streams.getAllPublisherDataForSchema(schemaId, PUBLISHER_ADDRESS);
        const rows = Array.isArray(response) ? response : response?.data ?? [];

        const latest = rows
          .filter((row) => {
            const pairField = row.find((f) => f.name === 'pairId');
            return pairField?.value === pairId;
          })
          .pop();

        if (!latest) return;

        const priceField = latest.find((f) => f.name === 'price');
        const price = Number(priceField?.value?.value ?? priceField?.value);
        onUpdate({ price });
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    poll();
    const interval = setInterval(poll, 3000);
    return { unsubscribe: () => clearInterval(interval) };
  }
};