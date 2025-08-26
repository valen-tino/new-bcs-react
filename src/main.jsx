import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (import.meta.env.PROD) {
  const noop = () => {}
  console.log = noop
  console.info = noop
  console.debug = noop
  console.warn = noop
}

// Initialize lazy Firebase loading on user interaction
import { initFirebaseOnInteraction } from './utils/lazyFirebase'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)

// Start lazy Firebase initialization after app mounts
setTimeout(() => {
  initFirebaseOnInteraction();
}, 100);
