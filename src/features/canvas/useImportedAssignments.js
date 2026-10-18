import { useCallback, useState } from 'react'

const KEY = 'sidequest-imported-assignments'

function read() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY) ?? 'null')
    return parsed && Array.isArray(parsed.items) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Holds the imported list for this browser tab only (sessionStorage). Calendar data is
 * private, so it is never written to localStorage and never sent anywhere.
 */
export function useImportedAssignments() {
  const [imported, setImported] = useState(read)

  const save = useCallback((value) => {
    setImported(value)
    try {
      if (value) sessionStorage.setItem(KEY, JSON.stringify(value))
      else sessionStorage.removeItem(KEY)
    } catch {
      /* in-memory only */
    }
  }, [])

  return { imported, save }
}
