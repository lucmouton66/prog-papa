import { Link } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'

export function SeancesPage() {
  const { program, loading } = useAppStore()

  if (loading) {
    return <p className="p-6 text-center text-zinc-500">Chargement…</p>
  }

  if (!program || program.sessions.length === 0) {
    return <p className="p-6 text-center text-zinc-500">Aucun programme pour le moment.</p>
  }

  return (
    <div className="space-y-4 p-4 pb-24">
      <h1 className="text-2xl font-bold text-zinc-900">{program.name}</h1>
      <p className="text-zinc-500">Choisis la séance à faire aujourd'hui.</p>
      <div className="space-y-3">
        {program.sessions.map((session) => (
          <Link
            key={session.id}
            to={`/seance/${session.id}`}
            className="block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm active:bg-zinc-50"
          >
            <div className="text-xl font-semibold text-zinc-900">{session.name}</div>
            <div className="mt-1 text-zinc-500">
              {session.circuits.map((c) => c.name).join(' + ')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
