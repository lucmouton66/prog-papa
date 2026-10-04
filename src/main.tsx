import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Dès qu'une nouvelle version du service worker prend le contrôle (nouveau déploiement),
// on recharge automatiquement la page pour ne jamais rester bloqué sur une vieille version.
if ('serviceWorker' in navigator) {
  let hasReloaded = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloaded) return
    hasReloaded = true
    window.location.reload()
  })
  navigator.serviceWorker.ready.then((registration) => {
    setInterval(() => registration.update(), 60 * 60 * 1000)
  })
}

// HashRouter (plutôt que BrowserRouter) : GitHub Pages ne sait pas servir
// index.html pour une route profonde rechargée directement (/seance/xyz) —
// avec un hash (#/seance/xyz), le serveur ne voit toujours que la racine.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
)
