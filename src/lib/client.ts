import { createPublicClient, http, formatEther } from 'viem'
import { somniaTestnet } from 'viem/chains'
import { FLIP_GAME_ABI } from './constants'

// ✅ bikin publicClient sekali
export const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http('https://dream-rpc.somnia.network'), // ganti sesuai RPC
})

// ✅ helper untuk decode hasil FlipPlayed
export async function parseFlipResult(txHash: string) {
  const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

  for (const log of receipt.logs) {
    try {
      const decoded = publicClient.decodeEventLog({
        abi: FLIP_GAME_ABI,
        data: log.data,
        topics: log.topics,
      })

      if (decoded.eventName === 'FlipPlayed') {
        const { win, rewardFLIP } = decoded.args as {
          win: boolean
          rewardFLIP: bigint
        }

        return {
          win,
          reward: Number(formatEther(rewardFLIP)),
        }
      }
    } catch {
      // skip log yang bukan FlipPlayed
    }
  }
  return null
}