import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/AppStore'
import { makeId } from '../lib/id'
import { playBeep } from '../lib/beep'
import type { Exercise } from '../types'

const READY_SECONDS = 5
const HOLD_SECONDS = 30

type Phase = 'ready' | 'hold'

interface FlowStep {
  exercise: Exercise
  otherSide: boolean
}

function buildFlow(exercises: Exercise[]): FlowStep[] {
  return exercises.flatMap((ex) =>
    ex.reps.includes('/côté')
      ? [
          { exercise: ex, otherSide: false },
          { exercise: ex, otherSide: true },
        ]
      : [{ exercise: ex, otherSide: false }],
  )
}

export function GuidedFlowPage() {
  const { dayId } = useParams<{ dayId: string }>()
  const { program, loading, recordSession } = useAppStore()
  const navigate = useNavigate()

  const template = program?.sessions.find((s) => s.id === dayId)
  const exercises = useMemo(() => template?.circuits.flatMap((c) => c.exercises) ?? [], [template])
  const flow = useMemo(() => buildFlow(exercises), [exercises])

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [secondsLeft, setSecondsLeft] = useState(READY_SECONDS)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null)

  const step = flow[index]
  const current = step?.exercise

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
    if (finished || paused || !step) return
    if (secondsLeft <= 0) {
      if (phase === 'ready') {
        playBeep(660, 200)
        if (navigator.vibrate) navigator.vibrate(200)
        setPhase('hold')
        setSecondsLeft(HOLD_SECONDS)
      } else if (index + 1 < flow.length) {
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
  }, [secondsLeft, phase, paused, finished, index, flow.length, step])

  function skipStep() {
    if (index + 1 < flow.length) {
      setIndex((i) => i + 1)
      setPhase('ready')
      setSecondsLeft(READY_SECONDS)
    } else {
      setFinished(true)
    }
  }

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
        sets: [{ reps: HOLD_SECONDS, poids: 0, fait: true }],
      })),
    })
    navigate('/historique')
  }

  if (loading) {
    return <p className="p-6 text-center text-zinc-500">Chargement…</p>
  }

  if (!template || flow.length === 0) {
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

  const total = phase === 'ready' ? READY_SECONDS : HOLD_SECONDS
  const progress = ((total - secondsLeft) / total) * 100

  return (
    <div className="flex h-screen flex-col items-center gap-2 overflow-y-auto bg-zinc-50 px-4 pb-20 pt-4 text-center">
      <div className="text-sm text-zinc-400">
        {index + 1} / {flow.length}
      </div>
      <div className="text-2xl font-bold text-zinc-900">
        {current.name}
        {step.otherSide && <span className="block text-lg font-semibold text-sky-600">Autre côté</span>}
      </div>
      {current.video && (
        <video
          key={current.id}
          src={`${import.meta.env.BASE_URL}videos/${current.video}`}
          autoPlay
          muted
          loop
          playsInline
          className="max-h-[40vh] w-auto rounded-2xl object-contain shadow-lg"
        />
      )}
      {current.note && <p className="max-w-sm text-sm text-zinc-500">{current.note}</p>}
      <div className="flex-1" />
      <div className="text-sm font-semibold uppercase tracking-wide text-sky-600">
        {phase === 'ready' ? 'Prépare-toi' : 'Tiens la position'}
      </div>
      <div className="text-6xl font-black tabular-nums text-sky-600">{secondsLeft}</div>
      <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full bg-sky-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => setPaused((p) => !p)}
          className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 active:bg-zinc-200"
        >
          {paused ? 'Reprendre' : 'Pause'}
        </button>
        <button
          onClick={skipStep}
          className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 active:bg-zinc-200"
        >
          Passer
        </button>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 active:bg-zinc-200"
        >
          Quitter
        </button>
      </div>
    </div>
  )
}
