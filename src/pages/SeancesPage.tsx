import { Link } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'

export function SeancesPage() {
  const { program, loading } = useAppStore()

  if (loading) {
    return <p className="p-6 text-center text-zinc-400">Chargement…</p>
  }

  if (!program || program.sessions.length === 0) {
    return <p className="p-6 text-center text-zinc-400">Aucun programme pour le moment.</p>
  }

  return (
    <div className="space-y-4 p-4 pb-24">
      <h1 className="text-2xl font-bold text-zinc-100">{program.name}</h1>
      <p className="text-zinc-400">Choisis la séance à faire aujourd'hui.</p>
      <div className="space-y-3">
        {program.sessions.map((session) => (
          <Link
            key={session.id}
            to={`/seance/${session.id}`}
            className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 active:bg-zinc-800"
          >
            <div className="text-xl font-semibold text-zinc-100">{session.name}</div>
            <div className="mt-1 text-zinc-400">{session.exercises.length} exercice(s)</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
