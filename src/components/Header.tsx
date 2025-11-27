import './header.css'

export default function Header() {
  return (
    <header className="hdr">
      <div className="hdr-inner">
        <h1 className="title">Somniasphere</h1>
        <p className="subtitle">
          Powered by <strong>Somnia Data Streams</strong>, this demo showcases how
          real-time blockchain events flow seamlessly into your dApp. 
		  Built for the <a href="https://dorahacks.io/hackathon/somnia-datastreams"
            target="_blank"
            rel="noopener noreferrer"
            className="link gold"
          >
            Somnia Data Streams Hackathon
          </a>
          , running on the Somnia Testnet.
        </p>
        <div className="nav">
          <a
            className="btn gold"
            href="https://x.com/0xsherpoh"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            className="btn gold-outline"
            href="https://github.com/sherpoh/somniasphere"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="btn gold-outline"
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Video
          </a>
        </div>
      </div>
    </header>
  )
}