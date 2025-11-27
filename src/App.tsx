import { useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import SocialFeed from './pages/SocialFeed'
import Game from './pages/Game'
import { WalletProvider } from './context/WalletContext'
import './styles.css'

export default function App() {
  const [tab, setTab] = useState<'feed' | 'game'>('feed')

  return (
    <WalletProvider>
      <Header onNav={setTab} />
      <main className="container">
        <Tabs tab={tab} setTab={setTab} />
        {tab === 'feed' ? <SocialFeed /> : <Game />}
      </main>
    </WalletProvider>
  )
}