/**
 * Client for the Gemini-backed quest endpoint. The request and response shapes are a
 * contract owned by the backend: do not rename fields here.
 *
 *   POST /api/quest
 *   body:     { taskDescription, barrier, energy, feedback, previousQuest }
 *   response: { questTitle, questDescription, estimatedMinutes, encouragement }   (extra fields are ignored)
 *
 * feedback is 'initial' | 'still_stuck' | 'restart'.
 */
export const FEEDBACK = { INITIAL: 'initial', STILL_STUCK: 'still_stuck', RESTART: 'restart' }

const ENDPOINT = '/api/quest'
const TIMEOUT_MS = 60000
// Statuses that mean "nothing is serving this route", as opposed to "the service failed".
const UNAVAILABLE = new Set([404, 405, 501, 502, 503, 504])

export class QuestApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'QuestApiError'
  }
}

function isValidQuest(q) {
  return (
    q &&
    typeof q.questTitle === 'string' &&
    typeof q.questDescription === 'string' &&
    typeof q.encouragement === 'string' &&
    Number.isFinite(Number(q.estimatedMinutes))
  )
}

/**
 * Resolves to { quest, mode: 'live' | 'demo' }.
 * - mode 'live': the backend answered.
 * - mode 'demo': the endpoint is unreachable, so a locally written SAMPLE is returned. It is never AI output.
 * Throws QuestApiError when the backend is reachable but fails (so the UI can offer retry).
 */
export async function requestQuest(input) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskDescription: input.taskDescription,
        barrier: input.barrier,
        energy: input.energy,
        feedback: input.feedback,
        previousQuest: input.previousQuest ?? null,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw new QuestApiError('The quest service took too long to answer.')
    return { quest: demoQuest(input), mode: 'demo' } // network error: nothing is listening
  } finally {
    clearTimeout(timer)
  }

  if (UNAVAILABLE.has(response.status)) return { quest: demoQuest(input), mode: 'demo' }

  const type = response.headers.get('content-type') ?? ''
  if (!type.includes('application/json')) {
    // e.g. a dev server answering with an HTML page: no real API behind this route
    if (response.ok) return { quest: demoQuest(input), mode: 'demo' }
    throw new QuestApiError('The quest service returned an unexpected response.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new QuestApiError('The quest service returned something unreadable.')
  }
  if (!response.ok) {
    const detail = typeof data?.error === 'string' ? ` (${data.error})` : ''
    throw new QuestApiError(`The quest service had a problem${detail}.`)
  }
  if (!isValidQuest(data)) throw new QuestApiError('The quest service sent an incomplete answer.')

  return {
    quest: {
      questTitle: data.questTitle,
      questDescription: data.questDescription,
      estimatedMinutes: Number(data.estimatedMinutes),
      encouragement: data.encouragement,
    },
    mode: 'live',
  }
}

/** Locally written SAMPLE quest used only in DEMO MODE. It does not analyse the task. */
export function demoQuest({ taskDescription, energy, feedback, previousQuest }) {
  const task = taskDescription.trim()
  const short = task.length > 60 ? `${task.slice(0, 57)}…` : task
  const base = energy === 'low' ? 2 : energy === 'high' ? 5 : 3

  if (feedback === FEEDBACK.STILL_STUCK) {
    const minutes = Math.max(1, (previousQuest?.estimatedMinutes ?? base) - 1)
    return {
      questTitle: 'Make it even smaller',
      questDescription: `Write down just one word or question about "${short}". That's the whole step.`,
      estimatedMinutes: minutes,
      encouragement: 'Tiny steps count. You can stop after this one if you need to.',
    }
  }
  if (feedback === FEEDBACK.RESTART) {
    return {
      questTitle: 'A fresh start',
      questDescription: `Set a ${base}-minute timer and jot down anything you already know about "${short}". Messy is perfect.`,
      estimatedMinutes: base,
      encouragement: 'Starting again is normal, and it takes nothing away from what you did before.',
    }
  }
  return {
    questTitle: 'Open it and look around',
    questDescription: `Open "${short}" and spend ${base} minutes just finding the very first thing to do. You don't need to do it yet.`,
    estimatedMinutes: base,
    encouragement: "You don't have to finish anything. Just find your starting point.",
  }
}
