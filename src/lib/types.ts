// Tipe untuk ticker harga (PriceTicker)
export type TickerItem = {
  symbol: string
  c: string // close price
  E: number // event time (ms)
}

// Tipe untuk event feed dari kontrak SomniasphereFeedToken
export type FeedEvent = {
  author: `0x${string}`
  content: string
  timestamp: bigint
  contentHash: `0x${string}`
  txHash?: `0x${string}`
}