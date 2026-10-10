import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'
import { makeId } from '../lib/id'
import { playBeep } from '../lib/beep'

const READY_SECONDS = 7

type Phase = 'ready' | 'hold'

function parseDuration(reps: string): number {
  const match = reps.match(/\d+/)
  return match ? Number(match[0]) : 30
}

export function GuidedFlowPage() {
  const { dayId } = useParams<{ dayId: string }>()
  const { program, loading, recordSession } = useAppStore()
  const navigate = useNavigate()

  const template = program?.sessions.find((s) => s.id === dayId)
  const exercises = template?.circuits.flatMap((c) => c.exercises) ?? []

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [secondsLeft, setSecondsLeft] = useState(READY_SECONDS)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null)

  const current = exercises[index]

  useEffect(() => {
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> }
    }
    nav.wakeLock
      ?.request('screen')
      .then((lock) => {
        wakeLockRef.current = lock
      })
      .catch(() => {})
    return () => {
      wakeLockRef.current?.release().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (finished || paused || !current) return
    if (secondsLeft <= 0) {
      if (phase === 'ready') {
        playBeep(660, 200)
        if (navigator.vibrate) navigator.vibrate(200)
        setPhase('hold')
        setSecondsLeft(parseDuration(current.reps))
      } else if (index + 1 < exercises.length) {
        playBeep(880, 150)
        if (navigator.vibrate) navigator.vibrate([100, 60, 100])
        setIndex((i) => i + 1)
        setPhase('ready')
        setSecondsLeft(READY_SECONDS)
      } else {
        playBeep(1046, 300)
        if (navigator.vibrate) navigator.vibrate([150, 80, 150, 80, 150])
        setFinished(true)
      }
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft, phase, paused, finished, index, exercises.length, current])

  async function handleFinish() {
    if (!template) return
    await recordSession({
      id: makeId(),
      templateId: template.id,
      sessionName: template.name,
      date: new Date().toISOString().slice(0, 10),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: [{ reps: parseDuration(ex.reps), poids: 0, fait: true }],
      })),
    })
    navigate('/historique')
  }

  if (loading) {
    return <p className="p-6 text-center text-zinc-500">Chargement…</p>
  }

  if (!template || exercises.length === 0) {
    return <p className="p-6 text-center text-zinc-500">Séance introuvable.</p>
  }

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-6 text-center">
        <div className="text-3xl font-bold text-zinc-900">Bravo, terminé ! 🎉</div>
        <button
          onClick={handleFinish}
          className="rounded-2xl bg-sky-600 px-8 py-4 text-lg font-bold text-white active:bg-sky-700"
        >
          Terminer
        </button>
      </div>
    )
  }

  const total = phase === 'ready' ? READY_SECONDS : parseDuration(current.reps)
  const progress = ((total - secondsLeft) / total) * 100

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-6 text-center">
      <div className="text-sm text-zinc-400">
        {index + 1} / {exercises.length}
      </div>
      <div className="text-3xl font-bold text-zinc-900">{current.name}</div>
      {current.video && (
        <video
          key={current.id}
          src={`${import.meta.env.BASE_URL}videos/${current.video}`}
          autoPlay
          muted
          loop
          playsInline
          className="w-full max-w-xs rounded-2xl shadow-lg"
        />
      )}
      {current.note && <p className="max-w-sm text-zinc-500">{current.note}</p>}
      <div className="text-sm font-semibold uppercase tracking-wide text-sky-600">
        {phase === 'ready' ? 'Prépare-toi' : 'Tiens la position'}
      </div>
      <div className="text-7xl font-black tabular-nums text-sky-600">{secondsLeft}</div>
      <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full bg-sky-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setPaused((p) => !p)}
          className="rounded-xl bg-zinc-100 px-6 py-3 font-medium text-zinc-700 active:bg-zinc-200"
        >
          {paused ? 'Reprendre' : 'Pause'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-zinc-100 px-6 py-3 font-medium text-zinc-700 active:bg-zinc-200"
        >
          Quitter
        </button>
      </div>
    </div>
  )
}
