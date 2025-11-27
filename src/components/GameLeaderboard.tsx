import { useEffect, useState } from 'react'
import { FLIP_GAME_ADDRESS, FLIP_GAME_ABI, publicClient } from '../lib/constants'

export default function GameLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<{ address: string; points: number }[]>([])
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const [loading, setLoading] = useState(false)

  const shorten = (val?: string) => (val ? `${val.slice(0, 6)}...${val.slice(-4)}` : '-')

  // ✅ bikin fungsi fetch reusable
  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const [addresses, points] = await publicClient.readContract({
        address: FLIP_GAME_ADDRESS,
        abi: FLIP_GAME_ABI,
        functionName: 'getLeaderboard',
      }) as [string[], bigint[]]

      const data = addresses.map((addr, i) => ({
        address: addr,
        points: Number(points[i]),
      }))
      setLeaderboard(data.sort((a, b) => b.points - a.points))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const startIndex = (page - 1) * itemsPerPage
  const visible = leaderboard.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <span>Leaderboard </span>
        {/* ✅ Tombol Refresh */}
        <button onClick={fetchLeaderboard} className="btn small">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th className="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((entry, i) => (
              <tr key={i}>
                <td>#{startIndex + i + 1}</td>
                <td>{shorten(entry.address)}</td>
                <td className="text-right">{entry.points}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center">No players yet</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn small"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={startIndex + itemsPerPage >= leaderboard.length}
            className="btn small"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
