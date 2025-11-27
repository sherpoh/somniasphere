import { useState } from 'react'
import { parseEther } from 'viem'
import { useWallet } from '../context/WalletContext'
import { FLIP_GAME_ADDRESS, FLIP_GAME_ABI } from '../lib/constants'
import { parseFlipResult } from '../lib/client'   // ✅ helper decode log
import './GameFlip.css'

export default function GameFlip() {
  const { connected, address, walletClient } = useWallet()
  const [choice, setChoice] = useState<0 | 1>(0)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [result, setResult] = useState<'win' | 'lose' | null>(null)
  const [finalSide, setFinalSide] = useState<'H' | 'T' | null>(null)
  const [reward, setReward] = useState<string | null>(null)
  const [coinRotation, setCoinRotation] = useState(0)

  const shorten = (val?: string) => (val ? `${val.slice(0, 6)}...${val.slice(-4)}` : '-')

  const playFlip = async () => {
    if (!walletClient || !address) return
    try {
      setLoading(true)
      setStatus('⏳ Flipping the coin...')
      setAnimate(true)
      setResult(null)
      setFinalSide(null)
      setReward(null)

      // ✅ Kirim transaksi ke kontrak
      const txHash = await walletClient.writeContract({
        address: FLIP_GAME_ADDRESS,
        abi: FLIP_GAME_ABI,
        functionName: 'playFlip',
        args: [choice],
        account: address,
        value: parseEther('0.05'),
      })

      // ✅ Decode hasil dari event FlipPlayed
      const parsed = await parseFlipResult(txHash)

      if (parsed) {
        setReward(`${parsed.reward} FLIP`)
        if (parsed.win) {
          setResult('win')
          setFinalSide(choice === 0 ? 'H' : 'T')
          setStatus('🏆 You Win.')
        } else {
          setResult('lose')
          setFinalSide(choice === 0 ? 'H' : 'T')
          setStatus('❌ You Lose.')
        }
      } else {
        setStatus(`ℹ️ Tx complete: ${shorten(txHash)}`)
      }

      // ✅ Tentukan rotasi coin sesuai pilihan
      setCoinRotation(choice === 0 ? 0 : 180)
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
      setAnimate(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">🎲 Flip Coin</div>
      <div className="card-body">
        <div className="choice-buttons">
          <button onClick={() => setChoice(0)} className={choice === 0 ? 'btn active' : 'btn'}>
            HEAD
          </button>
          <button onClick={() => setChoice(1)} className={choice === 1 ? 'btn active' : 'btn'}>
            TAIL
          </button>
        </div>

        {/* ✅ Coin visual */}
        <div className="coin-container">
          <div
            className={`coin ${animate ? 'spin' : ''}`}
            style={{ transform: `rotateY(${coinRotation}deg)` }}
          >
            <div className="front">H</div>
            <div className="back">T</div>
          </div>
        </div>

        <button onClick={playFlip} disabled={loading || !connected} className="btn gold mt-4">
          {loading ? 'Flipping...' : 'Flip Now (0.05 STT)'}
        </button>

        {/* ✅ Status & Reward */}
        {status && <p className="mt-2 text-sm">{status}</p>}
        {reward && <p className="mt-2 text-yellow-500 font-bold">🎁 Reward: {reward}</p>}
      </div>
    </div>
  )
}