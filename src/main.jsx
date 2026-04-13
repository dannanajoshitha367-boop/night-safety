import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// PWA Service Worker Registration
// Import registerSW from virtual:pwa-register for automatic SW updates
import { registerSW } from 'virtual:pwa-register'

// Register service worker with auto-update capability
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App is ready to work offline')
  }
})

// Optional: Add a global update handler
window.addEventListener('sw-update-notification', () => {
  console.log('Service Worker update notification received')
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

export { updateSW }
