export default function Tabs({ tab, setTab }: { tab: 'feed' | 'game', setTab: (t: 'feed' | 'game') => void }) {
  return (
    <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
      <button className={`btn ${tab==='feed'?'gold':'gold-outline'}`} onClick={() => setTab('feed')}>Social Feed</button>
      <button className={`btn ${tab==='game'?'gold':'gold-outline'}`} onClick={() => setTab('game')}>Game</button>
    </div>
  )
}