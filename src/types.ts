export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string // ex: "10-12" ou "8"
  repos: number // secondes de repos conseillées
  intensite?: string // ex: "RPE 7"
  note?: string // explication / consigne d'exécution
}

export interface SessionTemplate {
  id: string
  name: string
  exercises: Exercise[]
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
