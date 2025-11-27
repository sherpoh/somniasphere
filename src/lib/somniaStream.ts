import type { FeedEvent } from './types'
import { decodeEventLog, parseAbi } from 'viem'
import { publicClient, CONTRACT_ADDRESS } from './viemClient'

// ABI untuk event PostCreated
const abi = parseAbi([
  'event PostCreated(address indexed author,string content,uint256 timestamp,bytes32 indexed contentHash)',
])

/**
 * Subscribe ke feed.
 * Catatan:
 * - SDS (Somnia Data Stream) belum aktif, jadi fallback ke viem watchContractEvent.
 * - Nanti kalau SDS sudah aktif, tinggal aktifkan blok SDS di bawah.
 */
export async function subscribeFeed(onEvent: (event: FeedEvent) => void) {
  // ====== [SDS PATH] ======
  // ⚠️ SDS belum aktif, blok ini hanya placeholder.
  // const { SDK } = await import('@somnia-chain/streams')
  // const streamClient = new SDK({ public: publicClient })
  // return streamClient.subscribe({
  //   eventContractSources: [CONTRACT_ADDRESS],
  //   ethCalls: [],
  //   onlyPushChanges: false,
  //   onData: (data: any) => {
  //     try {
  //       const decoded = decodeEventLog({
  //         abi,
  //         data: data.result.data,
  //         topics: data.result.topics,
  //       })
  //       const ev: FeedEvent = {
  //         author: decoded.args.author,
  //         content: decoded.args.content,
  //         timestamp: Number(decoded.args.timestamp),
  //         contentHash: decoded.args.contentHash,
  //         txHash: undefined,
  //       }
  //       onEvent(ev)
  //     } catch (err) {
  //       console.error('[SDS decode error]', err)
  //     }
  //   },
  //   onError: (err: Error) => {
  //     console.error('[SDS] Error', err)
  //   },
  // })

  // ====== [FALLBACK PATH: viem] ======
  const unwatch = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi,
    eventName: 'PostCreated',
onLogs: (logs) => {
  console.log('Raw logs:', logs)
  logs.forEach((log) => {
    console.log('Decoded args:', log.args)
    const ev: FeedEvent = {
      author: log.args?.author,
      content: log.args?.content,
      timestamp: Number(log.args?.timestamp),
      contentHash: log.args?.contentHash,
      txHash: log.transactionHash,
    }
    onEvent(ev)
  })
}
,
  })

  return {
    unsubscribe: () => unwatch(),
  }
}