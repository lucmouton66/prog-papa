export interface Exercise {
  id: string
  name: string
  reps: string // ex: "10-12" ou "8"
  note?: string // explication / consigne d'exécution
}

export interface Circuit {
  id: string
  name: string // ex: "Mobilité", "Renfo + Prévention"
  tours: number // nombre de tours du circuit
  repos: number // secondes de repos entre chaque tour
  intensite?: string // ex: "RPE 7"
  exercises: Exercise[]
}

export interface SessionTemplate {
  id: string
  name: string
  circuits: Circuit[]
}

export interface Program {
  id: string
  name: string
  sessions: SessionTemplate[]
}

export interface SetEntry {
  reps: number
  poids: number
  fait: boolean
}

export interface LoggedExercise {
  exerciseId: string
  exerciseName: string
  sets: SetEntry[]
}

export interface SessionLog {
  id: string
  templateId: string
  sessionName: string
  date: string // ISO date (yyyy-mm-dd)
  exercises: LoggedExercise[]
}
