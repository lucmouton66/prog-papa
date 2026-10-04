import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Erreur app:', error)
  }

  handleReset = async () => {
    try {
      const dbs = await indexedDB.databases?.()
      await Promise.all((dbs ?? []).map((d) => d.name && indexedDB.deleteDatabase(d.name)))
    } catch {
      // ignore
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-6 text-center text-zinc-900">
          <div className="text-xl font-bold">Un problème est survenu</div>
          <p className="text-zinc-500">
            Essaie de recharger la page. Si ça ne suffit pas, le bouton ci-dessous réinitialise les
            données de l'app (tes séances enregistrées seront perdues).
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-zinc-100 px-6 py-3 font-medium text-zinc-800 active:bg-zinc-200"
          >
            Recharger
          </button>
          <button
            onClick={this.handleReset}
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-medium text-red-600 active:bg-red-100"
          >
            Réinitialiser les données
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
