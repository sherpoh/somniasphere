import { useEffect, useState, useRef } from 'react'
import type { FeedEvent } from '../lib/types'
import { publicClientFeedHttp, publicClientFeedWs, CONTRACT_ADDRESS, abi, EXPLORER } from '../lib/viemClientFeed'

export default function Feed() {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [offset, setOffset] = useState<bigint>(0n)
  const [loading, setLoading] = useState(false)
  const limit = 20n // ambil 20 post per batch
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const fetchFeed = async (newOffset: bigint) => {
    try {
      setLoading(true)
      const posts = await publicClientFeedHttp.readContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getPosts',
        args: [newOffset, limit],
      }) as any[]

      const data: FeedEvent[] = posts.map((p: any) => ({
        author: p.author,
        content: p.content,
        timestamp: BigInt(p.timestamp),
        contentHash: p.contentHash,
        txHash: undefined,
      }))

      setEvents(prev => [...prev, ...data.reverse()])
      setOffset(newOffset + limit)
    } catch (err) {
      console.error('Failed to fetch feed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // load batch pertama
    fetchFeed(0n)

    // realtime event listener
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
          setEvents(prev => [ev, ...prev])
        })
      },
    })

    return () => unwatch()
  }, [])

  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        fetchFeed(offset)
      }
    })
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [offset, loading])

  const shortenAddress = (addr: string) => `${addr.slice(0, 3)}...${addr.slice(-4)}`
  const shortenTx = (tx: string) => `${tx.slice(0, 3)}...${tx.slice(-3)}`

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
            {events.map((e, i) => (
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
            {events.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', opacity: 0.7 }}>
                  Waiting for events...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div ref={loaderRef} style={{ textAlign: 'center', padding: '10px' }}>
          {loading ? 'Loading more...' : 'Scroll to load more'}
        </div>
      </div>
    </div>
  )
}