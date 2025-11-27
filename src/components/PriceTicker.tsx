import { useEffect, useRef, useState } from 'react'
import './PriceTicker.css'   // CSS grid responsif

interface FuturesTicker {
  e: string
  E: number
  s: string   // symbol
  p: string   // mark price
  P?: string  // 24h change percent
  v?: string  // volume
  o?: string  // open interest
}

const REQUIRED = ['BTCUSDT', 'ETHUSDT', 'SOMIUSDT']

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [stats, setStats] = useState<Record<string, FuturesTicker>>({})
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const streams = REQUIRED
      .map(sym => `${sym.toLowerCase()}@markPrice/${sym.toLowerCase()}@ticker`)
      .join('/')
    const ws = new WebSocket(`wss://fstream.binance.com/stream?streams=${streams}`)
    wsRef.current = ws

    ws.onmessage = (msg) => {
      try {
        const payload = JSON.parse(msg.data)
        const data: FuturesTicker = payload.data
        if (data?.s) {
          if (data.p) {
            setPrices(prev => ({ ...prev, [data.s]: data.p }))
          }
          setStats(prev => ({
            ...prev,
            [data.s]: { ...prev[data.s], ...data }
          }))
        }
      } catch (e) {
        console.error('[PriceTicker WS] parse error', e)
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className="card">
      <div className="card-header">Price Ticker + Stats (Binance Futures)</div>
      <div className="card-body ticker">
        {REQUIRED.map((sym) => {
          const price = prices[sym]
          const stat = stats[sym]
          return (
            <div key={sym} className="ticker-item">
              <div className="ticker-symbol">{sym}</div>
              <div className="ticker-price">
                {price ? `$${parseFloat(price).toFixed(4)}` : '-'}
              </div>
              <div className="ticker-stats">
                <span>
					<div>
					 - 24h Change: {stat?.P ? `${parseFloat(stat.P).toFixed(2)}%` : '-'}
					</div>
					<div>
					 - Volume: {stat?.v ? parseFloat(stat.v).toFixed(2) : '-'}
					</div>
					<div>
					 - Open Interest: {stat?.o ? parseFloat(stat.o).toFixed(2) : '-'}
					</div>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}