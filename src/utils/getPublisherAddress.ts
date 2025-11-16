import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';

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

// Ganti dengan private key kamu
const walletClient = createWalletClient({
  account: privateKeyToAccount('0xYOUR_PRIVATE_KEY'),
  chain: somniaTestnet,
  transport: http('https://dream-rpc.somnia.network'),
});

const publisherAddress = walletClient.account.address;
console.log('Publisher Address:', publisherAddress);