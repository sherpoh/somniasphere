import { useEffect, useState } from 'react'

interface FuturesStats {
  symbol: string
  priceChangePercent: string
  volume: string
  openInterest: string
}

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOMIUSDT']

export default function Stats() {
  const [stats, setStats] = useState<Record<string, FuturesStats>>({})

  useEffect(() => {
    const ws = new WebSocket(
      'wss://fstream.binance.com/stream?streams=' +
      PAIRS.map(p => `${p.toLowerCase()}@ticker`).join('/')
    )

    ws.onmessage = (msg) => {
      try {
        const payload = JSON.parse(msg.data)
        const data = payload.data
        if (data?.s) {
          setStats(prev => ({
            ...prev,
            [data.s]: {
              symbol: data.s,
              priceChangePercent: data.P,
              volume: data.v,
              openInterest: data.o ?? '-', // open interest kadang perlu REST API
            }
          }))
        }
      } catch (e) {
        console.error('[Stats WS] parse error', e)
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className="dashboard-stats">
      {PAIRS.map(sym => {
        const s = stats[sym]
        return (
          <div key={sym} className="card stat-card">
            <div className="card-header">{sym} Stats</div>
            <div className="card-body">
              <div>24h Change: {s ? `${s.priceChangePercent}%` : '-'}</div>
              <div>Volume: {s ? s.volume : '-'}</div>
              <div>Open Interest: {s ? s.openInterest : '-'}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}