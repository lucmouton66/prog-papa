import { Link } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function HistoriquePage() {
  const { sessions, loading } = useAppStore()

  if (loading) {
    return <p className="p-6 text-center text-zinc-500">Chargement…</p>
  }

  if (sessions.length === 0) {
    return <p className="p-6 text-center text-zinc-500">Aucune séance enregistrée pour l'instant.</p>
  }

  return (
    <div className="space-y-3 p-4 pb-24">
      <h1 className="text-2xl font-bold text-zinc-900">Historique</h1>
      {sessions.map((session) => {
        const totalSets = session.exercises.reduce((acc, e) => acc + e.sets.length, 0)
        const doneSets = session.exercises.reduce(
          (acc, e) => acc + e.sets.filter((s) => s.fait).length,
          0,
        )
        return (
          <Link
            key={session.id}
            to={`/historique/${session.id}`}
            className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm active:bg-zinc-50"
          >
            <div className="text-lg font-semibold capitalize text-zinc-900">{session.sessionName}</div>
            <div className="text-zinc-500">{formatDate(session.date)}</div>
            <div className="mt-1 text-sm text-zinc-400">{doneSets} / {totalSets} séries faites</div>
          </Link>
        )
      })}
    </div>
  )
}
