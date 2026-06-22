import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @justin_evo/evo-ui is symlinked to ../evo-ui during local development and
  // ships React as an external peer dependency. Without dedupe, Vite bundles
  // BOTH the docs' React and evo-ui's nested node_modules/react, producing two
  // React instances and the runtime error "Cannot read properties of null
  // (reading 'useState')" (an invalid hook call). Force a single copy.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
