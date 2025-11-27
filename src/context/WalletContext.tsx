import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { formatEther } from 'viem'
import { makeWalletClient, publicClient } from '../lib/viemClient'

type WalletCtx = {
  address?: `0x${string}`
  account?: `0x${string}` // alias untuk PostForm
  connected: boolean
  balance?: string
  connect: () => Promise<void>
  disconnect: () => void
  walletClient?: ReturnType<typeof makeWalletClient>
}

const Ctx = createContext<WalletCtx>({
  connected: false,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | undefined>(undefined)
  const [balance, setBalance] = useState<string | undefined>(undefined)
  const [walletClient, setWalletClient] = useState<ReturnType<typeof makeWalletClient> | undefined>(undefined)

  useEffect(() => {
    const ethereum = (window as any).ethereum
    if (!ethereum) return
    ethereum.request({ method: 'eth_accounts' }).then(async (accounts: string[]) => {
      if (accounts?.[0]) {
        const addr = accounts[0] as `0x${string}`
        setAddress(addr)
        setWalletClient(makeWalletClient(ethereum, addr))
        const bal = await publicClient.getBalance({ address: addr })
        setBalance(`${Number(formatEther(bal)).toFixed(4)} STT`)
      }
    })
  }, [])

  useEffect(() => {
    const ethereum = (window as any).ethereum
    if (!ethereum) return
    const handleAccountsChanged = async (accounts: string[]) => {
      const addr = accounts?.[0] as `0x${string}` | undefined
      setAddress(addr)
      if (addr) {
        setWalletClient(makeWalletClient(ethereum, addr))
        const bal = await publicClient.getBalance({ address: addr })
        setBalance(`${Number(formatEther(bal)).toFixed(4)} STT`)
      } else {
        setWalletClient(undefined)
        setBalance(undefined)
      }
    }
    const handleChainChanged = async () => {
      if (address) {
        const bal = await publicClient.getBalance({ address })
        setBalance(`${Number(formatEther(bal)).toFixed(4)} STT`)
      }
    }
    ethereum.on?.('accountsChanged', handleAccountsChanged)
    ethereum.on?.('chainChanged', handleChainChanged)
    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
      ethereum.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [address])

  const connect = async () => {
    const ethereum = (window as any).ethereum
    if (!ethereum) {
      alert('Wallet extension not found.')
      return
    }
    const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' })
    const addr = accounts[0] as `0x${string}`
    setAddress(addr)
    setWalletClient(makeWalletClient(ethereum, addr))
    const bal = await publicClient.getBalance({ address: addr })
    setBalance(`${Number(formatEther(bal)).toFixed(4)} STT`)
  }

  const disconnect = () => {
    setAddress(undefined)
    setWalletClient(undefined)
    setBalance(undefined)
  }

  const value = useMemo(
    () => ({
      address,
      account: address, // ✅ alias untuk PostForm
      connected: Boolean(address),
      balance,
      connect,
      disconnect,
      walletClient,
    }),
    [address, balance, walletClient],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useWallet = () => useContext(Ctx)