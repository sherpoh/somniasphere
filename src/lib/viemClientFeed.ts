import { createPublicClient, http, webSocket } from 'viem'

export const somniaTestnet = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network/ws'],
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
    type: 'event',
    name: 'PostCreated',
    inputs: [
      { name: 'author', type: 'address', indexed: true },
      { name: 'content', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
      { name: 'contentHash', type: 'bytes32', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    name: 'getPosts',
    stateMutability: 'view',
    inputs: [
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'author', type: 'address' },
          { name: 'content', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'contentHash', type: 'bytes32' },
        ],
      },
    ],
  },
]

// ✅ HTTP client untuk ambil data lama via getPosts
export const publicClientFeedHttp = createPublicClient({
  chain: somniaTestnet,
  transport: http(somniaTestnet.rpcUrls.default.http[0]),
})

// ✅ WebSocket client untuk realtime event PostCreated
export const publicClientFeedWs = createPublicClient({
  chain: somniaTestnet,
  transport: webSocket(somniaTestnet.rpcUrls.default.webSocket[0]),
})

export const EXPLORER = somniaTestnet.blockExplorers.default.url