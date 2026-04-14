import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api/auth': 'http://localhost:3000',
      '/api/sales': 'http://localhost:3003'
    }
  }
})
