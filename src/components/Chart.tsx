import { useEffect, useRef, useState } from 'react'
import ChartJS from 'chart.js/auto'

type TF = '1m' | '5m' | '1h' | '24h' | '7d' | '1mo'

function bucketMs(tf: TF) {
  switch (tf) {
    case '1m': return 60_000
    case '5m': return 300_000
    case '1h': return 3_600_000
    case '24h': return 86_400_000
    case '7d': return 7 * 86_400_000
    case '1mo': return 30 * 86_400_000
  }
}

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOMIUSDT']

// Warna berbeda untuk tiap pair
const PAIR_COLORS: Record<string, { border: string; background: string }> = {
  BTCUSDT: { border: '#1e90ff', background: 'rgba(30,144,255,0.15)' },   // biru
  ETHUSDT: { border: '#32cd32', background: 'rgba(50,205,50,0.15)' },    // hijau
  SOMIUSDT: { border: '#d4af37', background: 'rgba(212,175,55,0.15)' },  // emas
}

export default function Chart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<ChartJS | null>(null)
  const [tf, setTf] = useState<TF>('5m')              // default 5m
  const [pair, setPair] = useState<string>('SOMIUSDT') // default SOMIUSDT
  const [dataPoints, setDataPoints] = useState<{ t: number, p: number }[]>([])

  // Ambil data harga real-time dari Binance Futures
  useEffect(() => {
    const stream = `${pair.toLowerCase()}@markPrice`
    const ws = new WebSocket(`wss://fstream.binance.com/ws/${stream}`)

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        if (data?.s === pair && data?.p) {
          const p = Number(data.p)
          setDataPoints(prev => [...prev, { t: Date.now(), p }].slice(-500))
        }
      } catch (e) {
        console.error('[Binance Futures WS] parse error', e)
      }
    }

    ws.onerror = (e) => {
      console.error('[Binance Futures WS] error', e)
    }

    return () => ws.close()
  }, [pair])

  // Render chart
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    // Aggregate by timeframe bucket
    const bucket = bucketMs(tf)
    const grouped: Record<number, number[]> = {}
    for (const dp of dataPoints) {
      const b = Math.floor(dp.t / bucket) * bucket
      grouped[b] ??= []
      grouped[b].push(dp.p)
    }
    const labels = Object.keys(grouped).map(n => new Date(Number(n)).toLocaleTimeString())
    const values = Object.values(grouped).map(arr => arr.reduce((a,b)=>a+b,0) / arr.length)

    const colors = PAIR_COLORS[pair]

    if (chartRef.current) {
      chartRef.current.data.labels = labels
      chartRef.current.data.datasets[0].data = values
      chartRef.current.data.datasets[0].label = pair
      chartRef.current.data.datasets[0].borderColor = colors.border
      chartRef.current.data.datasets[0].backgroundColor = colors.background
      chartRef.current.update()
      return
    }

    chartRef.current = new ChartJS(el, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: pair,
          data: values,
          borderColor: colors.border,
          backgroundColor: colors.background,
          tension: 0.25,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          x: { ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.08)' } },
          y: { ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.08)' } },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [dataPoints, tf, pair])

  return (
    <div className="card">
      <div className="card-header">Chart Ticker (Binance Futures) | Example</div>
      <div className="card-body">
        <div className="mb-3">
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="form-select"
          >
            {PAIRS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="tf mb-3">
          {(['1m','5m','1h','24h','7d','1mo'] as TF[]).map(k => (
            <button
              key={k}
              className={`btn ${tf===k?'gold':'gold-outline'}`}
              onClick={() => setTf(k)}
            >
              {k}
            </button>
          ))}
        </div>
        <canvas ref={canvasRef} height={120} />
      </div>
    </div>
  )
}