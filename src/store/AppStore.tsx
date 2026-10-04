import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Program, SessionLog } from '../types'
import { getAllSessions, getProgram, saveSession, deleteSession as dbDeleteSession } from '../lib/db'

interface AppStoreValue {
  loading: boolean
  program: Program | null
  sessions: SessionLog[]
  recordSession: (session: SessionLog) => Promise<void>
  removeSession: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [program, setProgram] = useState<Program | null>(null)
  const [sessions, setSessions] = useState<SessionLog[]>([])

  const refresh = useCallback(async () => {
    const [p, s] = await Promise.all([getProgram(), getAllSessions()])
    setProgram(p)
    setSessions(s)
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const recordSession = useCallback(async (session: SessionLog) => {
    await saveSession(session)
    await refresh()
  }, [refresh])

  const removeSession = useCallback(async (id: string) => {
    await dbDeleteSession(id)
    await refresh()
  }, [refresh])

  return (
    <AppStoreContext.Provider value={{ loading, program, sessions, recordSession, removeSession, refresh }}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore doit être utilisé dans AppStoreProvider')
  return ctx
}
