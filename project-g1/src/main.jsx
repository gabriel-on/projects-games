import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ProgressBarProvider } from './context/ProgressBarContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ProgressBarProvider>
        <App />
      </ProgressBarProvider>
    </ThemeProvider>
  </React.StrictMode>,
);