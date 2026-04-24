import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 🌟 프록시 설정 추가 영역
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8788', // 백엔드(Wrangler)가 돌아가는 포트
        changeOrigin: true,
      },
    },
  },
})