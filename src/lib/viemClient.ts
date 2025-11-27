import { createPublicClient, createWalletClient, http, custom } from 'viem'

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

export const CONTRACT_ADDRESS = '0x6ae521a129594e9815349aFC55AFe101958C93BA'

export const abi = [
  {
    type: 'function',
    name: 'post',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'content', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'totalPosts',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
]

export const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(somniaTestnet.rpcUrls.default.http[0]),
})

export function makeWalletClient(ethereum: any, account: `0x${string}`) {
  return createWalletClient({
    chain: somniaTestnet,
    transport: custom(ethereum), // ✅ signer dari MetaMask
    account,
  })
}

export const EXPLORER = somniaTestnet.blockExplorers.default.url