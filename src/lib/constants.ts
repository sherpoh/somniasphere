// constants.ts
import { createPublicClient, http } from 'viem'

// Chain config Somnia Testnet
export const somniaTestnet = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network',
    },
  },
}

// ✅ Public client untuk read-only (balances, leaderboard)
export const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(somniaTestnet.rpcUrls.default.http[0]),
})

// Alamat kontrak game FlipCoin
export const FLIP_GAME_ADDRESS = '0x68EB6B995De4914C429adaC7E41f63F187Ba844E'

// ABI kontrak game FlipCoin
export const FLIP_GAME_ABI = [
  {
    inputs: [{ internalType: 'uint8', name: 'choice', type: 'uint8' }],
    name: 'playFlip',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLeaderboard',
    outputs: [
      { internalType: 'address[]', name: '', type: 'address[]' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// Alamat kontrak token FLIP (misalnya ini kontrak ERC20 terpisah)
export const FLIP_TOKEN_ADDRESS = '0x68EB6B995De4914C429adaC7E41f63F187Ba844E' // ganti jika beda

// ABI standar ERC20 minimal untuk balance
export const FLIP_TOKEN_ABI = [
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
]