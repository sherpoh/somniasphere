import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi Vite
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Naikkan batas ukuran chunk jadi 1000 KB
  },
});
