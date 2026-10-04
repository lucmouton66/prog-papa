import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const { program, recordSession } = useAppStore()
  const navigate = useNavigate()
  const { secondsLeft, start } = useRestTimer()

  const template = program?.sessions.find((s) => s.id === dayId)

  const [exercises, setExercises] = useState<LoggedExercise[]>(() => {
    if (!template) return []
    return template.exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: Array.from({ length: ex.sets }, (): SetEntry => ({
        reps: parseDefaultReps(ex.reps),
        poids: 0,
        fait: false,
      })),
    }))
  })

  const totalSets = useMemo(() => exercises.reduce((acc, e) => acc + e.sets.length, 0), [exercises])
  const doneSets = useMemo(
    () => exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.fait).length, 0),
    [exercises],
  )

  if (!template) {
    return <p className="p-6 text-center text-zinc-400">Séance introuvable.</p>
  }

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
    <div className="space-y-4 p-4 pb-32">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">{template.name}</h1>
        <p className="text-zinc-400">
          {doneSets} / {totalSets} séries faites
        </p>
      </div>

      {secondsLeft !== null && (
        <div className="sticky top-2 z-10 rounded-2xl bg-sky-600 p-4 text-center text-xl font-bold text-white shadow-lg">
          Repos… {secondsLeft}s
        </div>
      )}

      <div className="space-y-4">
        {template.exercises.map((ex, exIndex) => (
          <div key={ex.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-zinc-100">{ex.name}</div>
                <div className="text-sm text-zinc-400">Objectif : {ex.sets} x {ex.reps}</div>
              </div>
              {ex.repos > 0 && (
                <button
                  onClick={() => start(ex.repos)}
                  className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 active:bg-zinc-700"
                >
                  Repos {ex.repos}s
                </button>
              )}
            </div>

            <div className="space-y-2">
              {exercises[exIndex]?.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center gap-2">
                  <span className="w-6 text-center text-zinc-500">{setIndex + 1}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.reps}
                    onChange={(e) => updateSet(exIndex, setIndex, { reps: Number(e.target.value) })}
                    className="w-20 rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-center text-lg text-zinc-100"
                    aria-label="Répétitions"
                  />
                  <span className="text-zinc-500">reps</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={set.poids}
                    onChange={(e) => updateSet(exIndex, setIndex, { poids: Number(e.target.value) })}
                    className="w-20 rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-center text-lg text-zinc-100"
                    aria-label="Poids"
                  />
                  <span className="text-zinc-500">kg</span>
                  <button
                    onClick={() => updateSet(exIndex, setIndex, { fait: !set.fait })}
                    className={`ml-auto h-12 w-12 rounded-xl text-2xl ${
                      set.fait ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500'
                    }`}
                    aria-label="Série faite"
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
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
