import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EvoThemeProvider } from '@justin_evo/evo-ui'
import '@justin_evo/evo-ui/dist/evo-ui.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EvoThemeProvider defaultTheme="system" storageKey="evo-docs-theme">
      <App />
    </EvoThemeProvider>
  </StrictMode>,
)
