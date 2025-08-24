import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

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
