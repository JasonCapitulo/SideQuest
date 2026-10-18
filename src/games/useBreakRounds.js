import { useCallback, useState } from 'react'

const KEY = 'sidequest-break-rounds'

function read() {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0
  } catch {
    return 0
  }
}

/** Counts finished game rounds in the current "break" (tab session). Resets when the student moves on to Study Quest. */
export function useBreakRounds() {
  const [rounds, setRounds] = useState(read)

  const write = useCallback((n) => {
    setRounds(n)
    try {
      sessionStorage.setItem(KEY, String(n))
    } catch {
      /* session storage unavailable: count lives in memory only */
    }
  }, [])

  const addRound = useCallback(() => setRounds((n) => {
    const next = n + 1
    try {
      sessionStorage.setItem(KEY, String(next))
    } catch {
      /* ignore */
    }
    return next
  }), [])

  const reset = useCallback(() => write(0), [write])

  return { rounds, addRound, reset }
}
