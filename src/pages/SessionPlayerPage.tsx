import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'
import { useRestTimer } from '../hooks/useRestTimer'
import { makeId } from '../lib/id'
import type { LoggedExercise, SetEntry } from '../types'

function parseDefaultReps(reps: string): number {
  const match = reps.match(/\d+/)
  return match ? Number(match[0]) : 0
}

export function SessionPlayerPage() {
  const { dayId } = useParams<{ dayId: string }>()
  const { program, loading, recordSession } = useAppStore()
  const navigate = useNavigate()
  const { secondsLeft, start } = useRestTimer()

  const template = program?.sessions.find((s) => s.id === dayId)

  const [exercises, setExercises] = useState<LoggedExercise[]>([])

  useEffect(() => {
    if (!template) return
    setExercises(
      template.circuits.flatMap((circuit) =>
        circuit.exercises.map((ex) => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: Array.from({ length: circuit.tours }, (): SetEntry => ({
            reps: parseDefaultReps(ex.reps),
            poids: 0,
            fait: false,
          })),
        })),
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.id])

  const exerciseIndexById = useMemo(() => {
    const map = new Map<string, number>()
    exercises.forEach((ex, i) => map.set(ex.exerciseId, i))
    return map
  }, [exercises])

  const totalSets = useMemo(() => exercises.reduce((acc, e) => acc + e.sets.length, 0), [exercises])
  const doneSets = useMemo(
    () => exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.fait).length, 0),
    [exercises],
  )

  if (loading) {
    return <p className="p-6 text-center text-zinc-500">Chargement…</p>
  }

  if (!template) {
    return <p className="p-6 text-center text-zinc-500">Séance introuvable.</p>
  }

  const canGuide =
    template.circuits.length === 1 &&
    template.circuits[0].tours === 1 &&
    template.circuits[0].exercises.every((ex) => ex.unit === 'secondes')

  function updateSet(exIndex: number, setIndex: number, patch: Partial<SetEntry>) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIndex
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === setIndex ? { ...s, ...patch } : s)) },
      ),
    )
  }

  async function finishSession() {
    await recordSession({
      id: makeId(),
      templateId: template!.id,
      sessionName: template!.name,
      date: new Date().toISOString().slice(0, 10),
      exercises,
    })
    navigate('/historique')
  }

  return (
    <div className="space-y-6 p-4 pb-32">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{template.name}</h1>
        <p className="text-zinc-500">
          {doneSets} / {totalSets} séries faites
        </p>
      </div>

      {canGuide && (
        <Link
          to={`/seance/${template.id}/guide`}
          className="block rounded-2xl bg-sky-600 py-4 text-center text-lg font-bold text-white shadow-lg active:bg-sky-700"
        >
          ▶ Commencer (guidé, sans rien toucher)
        </Link>
      )}

      {secondsLeft !== null && (
        <div className="sticky top-2 z-10 rounded-2xl bg-sky-600 p-4 text-center text-xl font-bold text-white shadow-lg">
          Repos… {secondsLeft}s
        </div>
      )}

      <div className="space-y-8">
        {template.circuits.map((circuit) => (
          <div key={circuit.id} className="space-y-3">
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4">
              <div className="text-lg font-bold text-sky-800">
                {circuit.tours > 1 ? `🔄 Circuit ${circuit.name}` : circuit.name}
              </div>
              <div className="mt-1 text-sm text-sky-700/80">
                {circuit.tours > 1
                  ? `Fais ${circuit.tours} tours au total : enchaîne les ${circuit.exercises.length} exercices à la suite, repose-toi ${circuit.repos}s, puis recommence.`
                  : `Fais ces ${circuit.exercises.length} exercices à la suite, en tenant chaque position indiquée.`}
                {circuit.intensite ? ` Intensité : ${circuit.intensite}.` : ''}
              </div>
              {circuit.tours > 1 && (
                <button
                  onClick={() => start(circuit.repos)}
                  className="mt-3 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white active:bg-sky-700"
                >
                  Repos entre les tours ({circuit.repos}s)
                </button>
              )}
            </div>

            {circuit.exercises.map((ex) => {
              const exIndex = exerciseIndexById.get(ex.id)
              if (exIndex === undefined) return null
              const unitLabel = ex.unit === 'secondes' ? 'sec' : 'reps'
              return (
                <div key={ex.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="mb-3">
                    <div className="text-lg font-semibold text-zinc-900">{ex.name}</div>
                    <div className="text-sm text-zinc-500">Objectif : {ex.reps}</div>
                    {ex.note && <div className="mt-1 text-sm text-zinc-500">{ex.note}</div>}
                  </div>

                  <div className="space-y-2">
                    {exercises[exIndex]?.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-2">
                        <span className="w-6 text-center text-zinc-400">{setIndex + 1}</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={set.reps}
                          onChange={(e) =>
                            updateSet(exIndex, setIndex, { reps: Number(e.target.value) })
                          }
                          className="w-20 rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-center text-lg text-zinc-900"
                          aria-label={unitLabel === 'sec' ? 'Secondes' : 'Répétitions'}
                        />
                        <span className="text-zinc-400">{unitLabel}</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={set.poids}
                          onChange={(e) =>
                            updateSet(exIndex, setIndex, { poids: Number(e.target.value) })
                          }
                          className="w-20 rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-center text-lg text-zinc-900"
                          aria-label="Poids"
                        />
                        <span className="text-zinc-400">kg</span>
                        <button
                          onClick={() => updateSet(exIndex, setIndex, { fait: !set.fait })}
                          className={`ml-auto h-12 w-12 rounded-xl text-2xl ${
                            set.fait ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-400'
                          }`}
                          aria-label="Série faite"
                        >
                          ✓
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <button
        onClick={finishSession}
        className="fixed inset-x-4 bottom-20 mx-auto max-w-lg rounded-2xl bg-sky-600 py-4 text-lg font-bold text-white shadow-lg active:bg-sky-700"
      >
        Terminer la séance
      </button>
    </div>
  )
}
