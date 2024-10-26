import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './features/dashboard'
import App from './app'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
