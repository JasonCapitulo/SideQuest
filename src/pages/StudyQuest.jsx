import { useState } from 'react'
import Panel from '../components/Panel.jsx'
import Button from '../components/Button.jsx'

const BARRIERS = [
  { value: 'overwhelmed', label: 'Feeling overwhelmed' },
  { value: 'dont_know_where_to_start', label: "Don't know where to start" },
  { value: 'distracted', label: 'Easily distracted' },
  { value: 'bored', label: 'Bored or unmotivated' },
  { value: 'tired', label: 'Tired' },
]

const ENERGY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const FIELD =
  'mt-1 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'

function StudyQuest({ arrivedFrom }) {
  const [taskDescription, setTaskDescription] = useState('')
  const [barrier, setBarrier] = useState(BARRIERS[0].value)
  const [energy, setEnergy] = useState('low')
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function requestQuest(feedback, previousQuest) {
    const task = taskDescription.trim()
    if (!task) {
      setError('Tell me what you want to study first.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription: task, barrier, energy, feedback, previousQuest }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }
      setQuest(data)
    } catch {
      setError("Couldn't reach the quest server. Check that the backend is running and try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    requestQuest('initial', null)
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-[var(--color-text)]">Study Quest</h1>
      <p className="mt-2 text-[var(--color-text-soft)]">
        Tell us what you need to do and we&apos;ll find a tiny first step.
      </p>

      {arrivedFrom === 'game' && (
        <Panel className="mt-6" title="Nice reset!" icon="star" role="status">
          Your mind is warmed up. Pick one small task and make it your first quest.
        </Panel>
      )}

      <Panel className="mt-6" variant="panel" title="Your task" icon="quest">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-semibold text-[var(--color-text)]">
            What do you want to study?
            <textarea
              className={FIELD}
              rows={3}
              maxLength={1000}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="e.g. Read chapter 4 for biology"
              aria-describedby={error ? 'quest-error' : undefined}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block font-semibold text-[var(--color-text)]">
              What&apos;s in the way?
              <select className={FIELD} value={barrier} onChange={(e) => setBarrier(e.target.value)}>
                {BARRIERS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block font-semibold text-[var(--color-text)]">
              Energy level
              <select className={FIELD} value={energy} onChange={(e) => setEnergy(e.target.value)}>
                {ENERGY_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading && !quest ? 'Generating…' : 'Generate Quest'}
          </Button>
        </form>

        {error && (
          <p id="quest-error" role="alert" className="mt-4 font-semibold text-[var(--color-text)]">
            {error}
          </p>
        )}
      </Panel>

      {quest && (
        <Panel className="mt-6" title={quest.questTitle} icon="star" aria-live="polite">
          <p>{quest.questDescription}</p>
          <p className="mt-2 font-semibold text-[var(--color-text)]">
            About {quest.estimatedMinutes} minute{quest.estimatedMinutes === 1 ? '' : 's'}
          </p>
          <p className="mt-2 italic">{quest.encouragement}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" disabled={loading} onClick={() => requestQuest('still_stuck', quest)}>
              {loading ? 'Thinking…' : 'Still Stuck'}
            </Button>
            <Button variant="secondary" disabled={loading} onClick={() => requestQuest('restart', null)}>
              Start Over
            </Button>
          </div>
        </Panel>
      )}
    </section>
  )
}

export default StudyQuest
