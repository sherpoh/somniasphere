#🌐 SomniaSphere

SomniaSphere is a hackathon project designed to demonstrate the power of Somnia Data Streams in building modular, responsive, and interactive Web3 dashboards. While the displayed pair price data is still simulated (dummy), the project's structure and architecture fully represent the workflow and potential data stream integration of the Somnia network.

---

### 🎯 Project Goals

- Display real-time blockchain data in an engaging visual format
- Build a modular dashboard with separate panels (data vs. wallet)
- Integrate wallet connect and direct smart contract interaction
- Provide a clean and scalable UI/UX for further development
- Demonstrate how the Somnia Testnet can be used for experimentation and showcase

---

### 🧩 Project Structure

- Dashboard Panel: Displays dummy pair prices as a representation of the data stream
- Wallet Panel: MetaMask connection and smart contract interaction
- FlipCoin Game: Additional module for demonstrating contract-based rewards and leaderboards

---

### 🛠️ Technology

| Layer | Technology |
|---------|------------------------------------|
| Frontend | React + TypeScript + Tailwind CSS |
| Blockchain | Solidity + Somnia Testnet |
| Wallet | MetaMask + ethers.js |
| Build Tool | Vite |

---

### 📦 Key Features

- 📊 Dummy price pair visualization as a simulation of Somnia Data Streams
- 🔐 Wallet connection via MetaMask
- 🎮 FlipCoin game as an interactive reward showcase
- 🏆 On-chain leaderboard based on points
- 💰 FLIP token rewards for every win

---

### 🧑‍💻 How to Run Locally

```bash
# Clone repo
git clone https://github.com/sherpoh/somniasphere.git
cd somniasphere

# Install dependencies
npm install

# Run locally
npm run dev
