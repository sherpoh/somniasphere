import WalletConnect from '../components/WalletConnect'
import PostForm from '../components/PostForm'
import Feed from '../components/Feed'
import PriceTicker from '../components/PriceTicker'
import Chart from '../components/Chart'
import './SocialFeed.css'


export default function SocialFeed() {
  return (
    <div className="grid">
      <div className="col">
        <WalletConnect />
        <PostForm />
        <Feed />
      </div>
      <div className="col">
        <PriceTicker />
        <Chart />
      </div>
    </div>
  )
}