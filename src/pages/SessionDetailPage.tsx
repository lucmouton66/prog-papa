import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { sessions, removeSession } = useAppStore()
  const navigate = useNavigate()

  const session = sessions.find((s) => s.id === sessionId)

  if (!session) {
    return <p className="p-6 text-center text-zinc-400">Séance introuvable.</p>
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette séance de l\'historique ?')) return
    await removeSession(session!.id)
    navigate('/historique')
  }

  return (
    <div className="space-y-4 p-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold capitalize text-zinc-100">{session.sessionName}</h1>
        <p className="text-zinc-400">{session.date}</p>
      </div>

      <div className="space-y-3">
        {session.exercises.map((ex) => (
          <div key={ex.exerciseId} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 text-lg font-semibold text-zinc-100">{ex.exerciseName}</div>
            <div className="space-y-1">
              {ex.sets.map((set, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <span className="w-6 text-zinc-500">{i + 1}</span>
                  <span>{set.reps} reps</span>
                  <span>{set.poids} kg</span>
                  <span>{set.fait ? '✓' : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleDelete}
        className="w-full rounded-2xl border border-red-900 bg-red-950 py-3 font-medium text-red-300 active:bg-red-900"
      >
        Supprimer cette séance
      </button>
    </div>
  )
}
