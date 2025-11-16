export const FLIP_GAME_ADDRESS = '0x340DcEaF9bd241B1f6dC6c190c7a53808bcE593A';

export const FLIP_GAME_ABI = [
  {
    "inputs": [
      { "internalType": "uint8", "name": "userChoice", "type": "uint8" }
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