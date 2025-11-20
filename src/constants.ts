// constants.ts

// Alamat kontrak game FlipCoin
export const FLIP_GAME_ADDRESS = '0x68EB6B995De4914C429adaC7E41f63F187Ba844E';

// ABI kontrak game FlipCoin
export const FLIP_GAME_ABI = [
  // ... ABI untuk playFlip, getLeaderboard, dll
  {
    "inputs": [
      { "internalType": "uint8", "name": "choice", "type": "uint8" }
    ],
    "name": "playFlip",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLeaderboard",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" },
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Alamat kontrak token FLIP (misalnya ini kontrak ERC20 terpisah)
export const FLIP_TOKEN_ADDRESS = '0x68EB6B995De4914C429adaC7E41f63F187Ba844E'; // ganti jika beda

// ABI standar ERC20 minimal untuk balance
export const FLIP_TOKEN_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  }
];


