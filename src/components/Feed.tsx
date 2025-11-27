import { useEffect, useState } from 'react'
import type { FeedEvent } from '../lib/types'
import {
  publicClientFeedHttp,
  publicClientFeedWs,
  CONTRACT_ADDRESS,
  abi,
  EXPLORER,
} from '../lib/viemClientFeed'

export default function Feed() {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const pageSize = 5
  const maxItems = 50n // ✅ batasi 50 data terbaru

  const fetchFeed = async () => {
    try {
      setLoading(true)

      // ✅ ambil jumlah total post dari kontrak
      const total = await publicClientFeedHttp.readContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'totalPosts', // pakai fungsi lama
      }) as bigint

      // ✅ hitung offset supaya ambil 50 terbaru
      const start = total > maxItems ? total - maxItems : 0n

      const posts = await publicClientFeedHttp.readContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getPosts',
        args: [start, maxItems],
      }) as any[]

      const data: FeedEvent[] = posts.map((p: any) => ({
        author: p.author,
        content: p.content,
        timestamp: BigInt(p.timestamp),
        contentHash: p.contentHash,
        txHash: undefined,
      }))

      // ✅ simpan 50 terbaru
      setEvents(data.reverse())
      setPage(0) // reset ke halaman terbaru
    } catch (err) {
      console.error('Failed to fetch feed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()

    // ✅ realtime listener
    const unwatch = publicClientFeedWs.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi,
      eventName: 'PostCreated',
      onLogs: logs => {
        logs.forEach(log => {
          const ev: FeedEvent = {
            author: log.args.author,
            content: log.args.content,
            timestamp: BigInt(log.args.timestamp),
            contentHash: log.args.contentHash,
            txHash: log.transactionHash,
          }
          setEvents(prev => [ev, ...prev].slice(0, Number(maxItems)))
          setPage(0) // reset ke halaman terbaru
        })
      },
    })

    return () => unwatch()
  }, [])

  const shortenAddress = (addr: string) => `${addr.slice(0, 3)}...${addr.slice(-4)}`
  const shortenTx = (tx: string) => `${tx.slice(0, 3)}...${tx.slice(-3)}`

  // ✅ pagination
  const totalPages = Math.ceil(events.length / pageSize)
  const startIndex = page * pageSize
  const visible = events.slice(startIndex, startIndex + pageSize)

  return (
    <div className="card">
      <div className="card-header">Realtime Social Feed</div>
      <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date (UTC)</th>
              <th>Address</th>
              <th>Content</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((e, i) => (
              <tr key={i}>
                <td>
                  {new Date(Number(e.timestamp) * 1000).toLocaleString('en-US', {
                    timeZone: 'UTC',
                    hour12: true,
                  })}
                </td>
                <td>{shortenAddress(e.author)}</td>
                <td style={{ maxWidth: 420, whiteSpace: 'pre-wrap' }}>{e.content}</td>
                <td>
                  {e.txHash ? (
                    <a
                      href={`${EXPLORER}/tx/${e.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="link"
                    >
                      {shortenTx(e.txHash)}
                    </a>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', opacity: 0.7 }}>
                  Waiting for events...
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination controls + indikator */}
        <div className="flex justify-between items-center mt-2">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="btn small"
            >
              Back
            </button>
            <button
              onClick={() => setPage(p => (p + 1 < totalPages ? p + 1 : p))}
              disabled={page + 1 >= totalPages}
              className="btn small"
            >
              Next
            </button>
          </div>
        </div>

        {/* ✅ Refresh button */}
        <div className="flex justify-center mt-2">
          <button onClick={fetchFeed} className="btn small gold">
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  )
}