import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * MathQuest Odyssey - Main Entry Point
 *
 * Initializes the React application with:
 * - Accessibility features
 * - Performance optimizations
 * - Error boundaries
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
