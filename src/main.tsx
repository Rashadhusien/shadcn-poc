import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import { AppProviders } from '@/app/AppProviders'
import { ThemeProvider } from '@/theme/ThemeProvider'
import '@/theme/fonts.css'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppProviders>
          <App />
        </AppProviders>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
