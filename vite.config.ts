import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/token': 'http://localhost:3000',
      '/grade': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/export-gradebook': 'http://localhost:3000',
    },
  },
})
