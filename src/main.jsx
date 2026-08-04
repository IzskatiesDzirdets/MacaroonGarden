import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SupabaseProvider } from './hooks/useSupabase'
import { CMSProvider } from './hooks/useCMS'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupabaseProvider>
      <CMSProvider>
        <App />
      </CMSProvider>
    </SupabaseProvider>
  </StrictMode>,
)
