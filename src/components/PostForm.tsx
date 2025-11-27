import { useState } from 'react'
import { useWallet } from '../context/WalletContext'
import { abi, CONTRACT_ADDRESS, EXPLORER } from '../lib/viemClient'
import './PostForm.css'

export default function PostForm() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  // ✅ ambil account dari context (alias address)
  const { connected, walletClient, account } = useWallet()

  const onPost = async () => {
    if (!connected || !walletClient || !account) {
      return alert('Connect wallet first.')
    }
    if (!text.trim()) {
      return alert('Content cannot be empty.')
    }

    setBusy(true)
    setTxHash(null)

    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'post',
        args: [text.trim()],
        account, // ✅ wajib untuk signer
      })
      setTxHash(hash)
      setText('')
    } catch (e: any) {
      console.error(e)
      setTxHash(null)
      alert(e?.shortMessage ?? 'Transaction failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">Create Post</div>
      <div className="card-body">
        <textarea
          className="input"
          rows={3}
          placeholder="Type your message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="form-actions">
          <button
            className="btn gold"
            onClick={onPost}
            disabled={!connected || busy}
          >
            {busy ? 'Sending...' : 'Send'}
          </button>
          {txHash && (
            <div className="tx-notice">
              ✅ Posted! Tx:{' '}
              <a
                href={`${EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txHash.slice(0, 10)}...
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}