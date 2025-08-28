import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { DarkModeProvider } from './component/darkMode/darkModeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
        <App />
    </DarkModeProvider>
  </StrictMode>,
)
