/**
 * Small deterministic ranking for imported coursework. No AI and no network: it only uses the due date plus
 * what the student typed in (estimated minutes, difficulty). Canvas files carry neither effort nor difficulty,
 * so when they are missing the effort is reported as unknown rather than guessed.
 *
 * meta[id] = { minutes?: number, difficulty?: 1 | 2 | 3 }
 */
export const DIFFICULTY = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const HOUR = 3600000

function urgency(hours) {
  if (hours < 0) return { points: 100, text: 'It is already past its due time.' }
  if (hours < 24) return { points: 85, text: 'It is due within 24 hours.' }
  if (hours < 72) return { points: 65, text: 'It is due within 3 days.' }
  if (hours < 168) return { points: 45, text: 'It is due within a week.' }
  return { points: Math.max(5, 30 - Math.floor(hours / 168) * 3), text: 'It is due more than a week away.' }
}

export function scoreItem(item, meta = {}, now = Date.now()) {
  const hours = (new Date(item.dueAt).getTime() - now) / HOUR
  const u = urgency(hours)
  const reasons = [u.text]
  let score = u.points

  const minutes = Number(meta.minutes) > 0 ? Number(meta.minutes) : item.estimatedMinutes
  const minutesSource = Number(meta.minutes) > 0 ? 'your estimate' : item.estimatedMinutes ? 'a sample estimate' : null
  if (minutes) {
    score += Math.min(15, Math.round(minutes / 12)) // longer work needs an earlier start
    reasons.push(`Effort is about ${minutes} min (${minutesSource}), so it needs time set aside.`)
  } else {
    reasons.push('Effort is unknown: the calendar file has no time estimate. Add one to refine the order.')
  }
  if (meta.difficulty) {
    score += (meta.difficulty - 1) * 5
    reasons.push(`You marked it ${DIFFICULTY[meta.difficulty].toLowerCase()}.`)
  }
  if (item.kind !== 'assignment') {
    score -= 20
    reasons.push('It is a calendar event, not a verified assignment, so it ranks lower.')
  }
  return { score, reasons, minutes: minutes || null, minutesSource }
}

/** Sorted best-first. A pinned item (the student's manual choice) always goes first. */
export function rankItems(items, meta = {}, pinnedId = null, now = Date.now()) {
  const ranked = items.map((item) => ({ item, ...scoreItem(item, meta[item.id], now) }))
  ranked.sort((a, b) => b.score - a.score || new Date(a.item.dueAt) - new Date(b.item.dueAt))
  const pinned = ranked.findIndex((r) => r.item.id === pinnedId)
  if (pinned > 0) ranked.unshift({ ...ranked.splice(pinned, 1)[0], pinned: true })
  else if (pinned === 0) ranked[0].pinned = true
  return ranked
}
