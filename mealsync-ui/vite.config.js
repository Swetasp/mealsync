import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward /api/* and /health to Cloud Run
      '^/(api|health)': {
        target: 'https://mealsync-q7xjhodara-uc.a.run.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
