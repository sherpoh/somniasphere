import { useWallet } from '../context/WalletContext'

export default function WalletConnect() {
  const { connected, address, balance, connect, disconnect } = useWallet()

  // Fungsi untuk switch ke Somnia Testnet
  const switchToSomnia = async () => {
    const somniaChain = {
      chainId: '0xC488', // ✅ 50312 dalam HEX (bukan 0xC488)
      chainName: 'Somnia Testnet',
      nativeCurrency: {
        name: 'Somnia Test Token',
        symbol: 'STT',
        decimals: 18,
      },
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
        // chain belum ada → tambahkan dulu
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
      await switchToSomnia()   // ✅ pastikan chain benar dulu
      await connect()          // ✅ baru connect wallet
    } catch (err) {
      console.error('Connect error:', err)
    }
  }

  return (
    <div className="card">
      <div className="card-header">Wallet</div>
      <div className="card-body">
        {connected ? (
          <>
            <div><strong>Address:</strong> {address}</div>
            <div><strong>Balance:</strong> {balance ?? '-'}</div>
            <button className="btn gold-outline" onClick={disconnect}>
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