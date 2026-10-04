import { useCallback, useEffect, useRef, useState } from 'react'

export function useRestTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  const start = useCallback((seconds: number) => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    setSecondsLeft(seconds)
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    setSecondsLeft(null)
  }, [])

  return { secondsLeft, start, stop }
}
