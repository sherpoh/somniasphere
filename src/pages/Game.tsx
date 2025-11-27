import GameWallet from '../components/GameWallet'
import GameFlip from '../components/GameFlip'
import GameLeaderboard from '../components/GameLeaderboard'
import './Game.css'

export default function Game() {
  return (
    <div className="grid">
      <div className="col">
        <GameWallet />
        <GameLeaderboard />
      </div>
      <div className="col">
	  <GameFlip />
	    
      </div>
    </div>
  )
}