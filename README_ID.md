# 🌐 SomniaSphere

**SomniaSphere** adalah proyek hackathon yang dirancang untuk mendemonstrasikan kekuatan **Somnia Data Streams** dalam membangun dashboard Web3 yang modular, responsif, dan interaktif. Meskipun data harga pair yang ditampilkan masih berupa simulasi (dummy), struktur dan arsitektur proyek ini sepenuhnya mewakili alur kerja dan potensi integrasi data stream dari jaringan Somnia.

---

### 🎯 Tujuan Proyek

- Menampilkan **data blockchain secara real-time** dalam bentuk visual yang menarik
- Membangun **dashboard modular** dengan pemisahan panel (data vs wallet)
- Mengintegrasikan **wallet connect** dan interaksi smart contract langsung
- Menyediakan **UI/UX yang bersih dan scalable** untuk pengembangan lebih lanjut
- Menunjukkan bagaimana **Somnia Testnet** bisa digunakan untuk eksperimen dan showcase

---

### 🧩 Struktur Proyek

- **Dashboard Panel**: Menampilkan harga pair (dummy) sebagai representasi data stream
- **Wallet Panel**: Koneksi MetaMask dan interaksi smart contract
- **FlipCoin Game**: Modul tambahan untuk demonstrasi reward dan leaderboard berbasis kontrak

---

### 🛠️ Teknologi

| Layer        | Teknologi                          |
|--------------|------------------------------------|
| Frontend     | React + TypeScript + Tailwind CSS  |
| Blockchain   | Solidity + Somnia Testnet          |
| Wallet       | MetaMask + ethers.js               |
| Build Tool   | Vite                               |

---

### 📦 Fitur Utama

- 📊 Visualisasi harga pair (dummy) sebagai simulasi Somnia Data Streams
- 🔐 Koneksi wallet via MetaMask
- 🎮 FlipCoin game sebagai showcase reward interaktif
- 🏆 Leaderboard on-chain berdasarkan poin
- 💰 Reward token FLIP untuk setiap kemenangan

---

### 🧑‍💻 Cara Jalankan Lokal

```bash
# Clone repo
git clone https://github.com/sherpoh/somniasphere.git
cd somniasphere

# Install dependencies
npm install

# Jalankan lokal
npm run dev
