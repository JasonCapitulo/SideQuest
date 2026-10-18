const KEY = 'sidequest-best-scores'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {}
  } catch {
    return {}
  }
}

export function getBest(gameId) {
  const v = read()[gameId]
  return typeof v === 'number' ? v : null
}

/** Records a score where lower is better (e.g. moves). Returns true if it is a new best. */
export function recordLowest(gameId, value) {
  const prev = getBest(gameId)
  if (prev !== null && prev <= value) return false
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [gameId]: value }))
  } catch {
    /* storage unavailable: the best just won't persist */
  }
  return true
}
