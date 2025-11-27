import { useEffect, useState } from 'react'
import { useWallet } from '../context/WalletContext'
import { publicClient } from '../lib/constants'
import { formatEther } from 'viem'

// ✅ Kontrak FlipCoin ERC20
const FLIP_COIN_ADDRESS = '0x68EB6B995De4914C429adaC7E41f63F187Ba844E'
const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
]

export default function GameWallet() {
  const { connected, address, balance, connect, disconnect } = useWallet()
  const [flipBalance, setFlipBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const shorten = (val?: string) => (val ? `${val.slice(0, 6)}...${val.slice(-4)}` : '-')

  const formatNumber = (val?: string | null) => {
    if (!val) return '-'
    const num = Number(val)
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 })
  }

  const switchToSomnia = async () => {
    const somniaChain = {
      chainId: '0xC488', // 50312 HEX
      chainName: 'Somnia Testnet',
      nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
      rpcUrls: ['https://dream-rpc.somnia.network'],
      blockExplorerUrls: ['https://shannon-explorer.somnia.network'],
    }
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: somniaChain.chainId }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [somniaChain],
        })
      } else {
        console.error('Switch chain error:', switchError)
      }
    }
  }

  const handleConnect = async () => {
    try {
      await switchToSomnia()
      await connect()
    } catch (err) {
      console.error('Connect error:', err)
    }
  }

  // ✅ Fetch FlipCoin balance
  const fetchFlipBalance = async () => {
    if (!connected || !address) return
    try {
      setLoading(true)
      const bal = await publicClient.readContract({
        address: FLIP_COIN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint
      setFlipBalance(formatEther(bal))
    } catch (err) {
      console.error('Flip balance error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlipBalance()
  }, [connected, address])

  return (
    <div className="card">
      <div className="card-header">Wallet</div>
      <div className="card-body">
        {connected ? (
          <>
            <div><strong>Address:</strong> {address}</div>
            <div><strong>Balance (STT):</strong> {balance ?? '-'}</div>
            <div className="flex items-center gap-2">
              <strong>FlipCoin Balance:</strong> {formatNumber(flipBalance)}
			  <span> </span> 
              <button onClick={fetchFlipBalance} className="btn small gold">
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <strong>Contract:</strong>
              <span className="font-mono">{shorten(FLIP_COIN_ADDRESS)}</span>
			  <span> </span> 
              <button
                onClick={() => navigator.clipboard.writeText(FLIP_COIN_ADDRESS)}
                className="btn small gold"
              >
                Copy
              </button>
            </div>

            <button className="btn gold-outline mt-3" onClick={disconnect}>
              Disconnect
            </button>
          </>
        ) : (
          <button className="btn gold" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  )
}