import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Program, SessionLog } from '../types'
import { buildSeedProgram } from './seedProgram'

interface AppDB extends DBSchema {
  program: {
    key: string
    value: Program
  }
  sessions: {
    key: string
    value: SessionLog
    indexes: { 'by-date': string }
  }
}

const DB_NAME = 'prog-papa'
const DB_VERSION = 1
const PROGRAM_KEY = 'current'

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('program')) {
          db.createObjectStore('program')
        }
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' })
          store.createIndex('by-date', 'date')
        }
      },
    })
  }
  return dbPromise
}

export async function getProgram(): Promise<Program> {
  const db = await getDB()
  const existing = await db.get('program', PROGRAM_KEY)
  if (existing) return existing
  const seed = buildSeedProgram()
  await db.put('program', seed, PROGRAM_KEY)
  return seed
}

export async function getAllSessions(): Promise<SessionLog[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('sessions', 'by-date')
  return all.sort((a, b) => b.date.localeCompare(a.date))
}

export async function saveSession(session: SessionLog): Promise<void> {
  const db = await getDB()
  await db.put('sessions', session)
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('sessions', id)
}

export interface ExportedData {
  version: 1
  exportedAt: string
  program: Program
  sessions: SessionLog[]
}

export async function exportAllData(): Promise<ExportedData> {
  const [program, sessions] = await Promise.all([getProgram(), getAllSessions()])
  return { version: 1, exportedAt: new Date().toISOString(), program, sessions }
}

export async function importAllData(data: ExportedData): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['program', 'sessions'], 'readwrite')
  await tx.objectStore('program').put(data.program, PROGRAM_KEY)
  const sessionsStore = tx.objectStore('sessions')
  await sessionsStore.clear()
  for (const s of data.sessions) await sessionsStore.put(s)
  await tx.done
}

export async function resetAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['program', 'sessions'], 'readwrite')
  await tx.objectStore('sessions').clear()
  await tx.objectStore('program').delete(PROGRAM_KEY)
  await tx.done
}
