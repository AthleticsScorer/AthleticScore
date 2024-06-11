import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://athleticscore-89d44187f67a.herokuapp.com
export default defineConfig({
  plugins: [react()],
  define: {
    backend: JSON.stringify('https://athleticscore-89d44187f67a.herokuapp.com')
  }
})
