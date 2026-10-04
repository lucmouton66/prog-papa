import type { Program } from '../types'

// ⚠️ Programme d'exemple — à remplacer par le vrai programme.
// Modifie directement les séances et exercices ci-dessous, puis redéploie l'app.
export function buildSeedProgram(): Program {
  return {
    id: 'programme-1',
    name: 'Mon programme',
    sessions: [
      {
        id: 'jour-1',
        name: 'Jour 1 — Exemple',
        exercises: [
          { id: 'ex-1', name: 'Marche rapide', sets: 1, reps: '10 min', repos: 0 },
          { id: 'ex-2', name: 'Exercice à remplacer', sets: 3, reps: '10-12', repos: 60 },
        ],
      },
      {
        id: 'jour-2',
        name: 'Jour 2 — Exemple',
        exercises: [
          { id: 'ex-3', name: 'Exercice à remplacer', sets: 3, reps: '10-12', repos: 60 },
        ],
      },
    ],
  }
}
