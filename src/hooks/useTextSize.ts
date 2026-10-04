import { useCallback, useEffect, useState } from 'react'

export type TextSize = 'normal' | 'grand'

const KEY = 'prog-papa:text-size'
const SCALE: Record<TextSize, string> = { normal: '100%', grand: '125%' }

function applyToDocument(size: TextSize) {
  document.documentElement.style.fontSize = SCALE[size]
}

export function useTextSize() {
  const [size, setSizeState] = useState<TextSize>(() => {
    const stored = localStorage.getItem(KEY)
    return stored === 'grand' ? 'grand' : 'normal'
  })

  useEffect(() => {
    applyToDocument(size)
  }, [size])

  const setSize = useCallback((next: TextSize) => {
    localStorage.setItem(KEY, next)
    setSizeState(next)
  }, [])

  return { size, setSize }
}
