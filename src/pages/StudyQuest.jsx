import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Button from '../components/Button.jsx'
import Panel from '../components/Panel.jsx'
import TabButton from '../components/TabButton.jsx'
import Dictation from '../features/quest/Dictation.jsx'
import ImportAssignments from '../features/canvas/ImportAssignments.jsx'
import { EMPTY_DRAFT, useQuestState } from '../context/QuestStateContext.jsx'
import Integrations from '../features/quest/Integrations.jsx'
import RightNowScene from '../components/RightNowScene.jsx'
import StudyRadio from '../features/radio/StudyRadio.jsx'
import { demoQuest, FEEDBACK, QuestApiError, requestQuest } from '../services/questApi.js'

const BARRIERS = [
  { id: 'not_sure_where_to_start', label: "I don't know where to start" },
  { id: 'task_too_big', label: 'It feels too big' },
  { id: 'distracted', label: "I'm distracted" },
  { id: 'low_energy', label: "I'm tired or low on energy" },
  { id: 'confused', label: "I don't understand it yet" },
]
const ENERGIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]
function formatDue(item) {
  const d = new Date(item.dueAt)
  const when = item.allDay
    ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    : d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  return item.kind === 'assignment' ? `due ${when}` : `on ${when}`
}

function StudyQuest({ arrivedFrom }) {
  const { draft, updateDraft: update, selected, setSelected } = useQuestState()
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null) // { quest, mode }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)
  const [importOpen, setImportOpen] = useState(arrivedFrom === 'import')
  const [importSource, setImportSource] = useState(null)

  const headingRef = useRef(null)
  const taskRef = useRef(null)
  const importHeadingRef = useRef(null)
  const importButtonRef = useRef(null)
  const requestRef = useRef(0)
  const inFlight = useRef(false)

  // Move focus to the step heading whenever the step changes.
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (importOpen) importHeadingRef.current?.focus()
  }, [importOpen])

  const generate = useCallback(
    async (feedback, overrides = {}) => {
      if (inFlight.current) return // ignore double clicks while a request is running
      inFlight.current = true
      const input = { ...draft, ...overrides }
      const id = ++requestRef.current
      setLoading(true)
      setError('')
      setStarted(false)
      setStep(3)
      try {
        const { quest, mode } = await requestQuest({
          taskDescription: input.task.trim(),
          barrier: input.barrier,
          energy: input.energy,
          feedback,
          previousQuest: feedback === FEEDBACK.INITIAL ? null : result?.quest ?? null,
        })
        if (id === requestRef.current) setResult({ quest, mode })
      } catch (err) {
        if (id === requestRef.current)
          setError(err instanceof QuestApiError ? err.message : 'Something went wrong getting your step.')
      } finally {
        if (id === requestRef.current) setLoading(false)
        inFlight.current = false
      }
      lastFeedback.current = feedback
    },
    [draft, result],
  )
  const lastFeedback = useRef(FEEDBACK.INITIAL)

  function useDemoInstead() {
    const quest = demoQuest({
      taskDescription: draft.task,
      energy: draft.energy,
      feedback: lastFeedback.current,
      previousQuest: result?.quest ?? null,
    })
    setError('')
    setResult({ quest, mode: 'demo' })
  }

  function pickAssignment(item) {
    const parts = [item.title]
    if (item.course) parts.push(`(${item.course})`)
    parts.push(`— ${formatDue(item)}`)
    update({ task: parts.join(' ') })
    setSelected(item)
    setImportOpen(false)
    requestAnimationFrame(() => taskRef.current?.focus())
  }

  function openImport(source) {
    setImportSource(source)
    setStep(1)
    setImportOpen(true)
  }

  function closeImport() {
    setImportOpen(false)
    requestAnimationFrame(() => importButtonRef.current?.focus())
  }

  const canContinue = draft.task.trim().length > 0

  return (
    <section aria-labelledby="quest-title" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 id="quest-title" className="font-heading text-3xl font-extrabold text-[var(--color-text)]">
        Study Quest
      </h1>
      <p className="mt-1 text-[var(--color-text-soft)]">
        Tell us what you need to do. We&apos;ll suggest one small first step.
      </p>

      {arrivedFrom === 'game' && (
        <Panel className="mt-3" title="Nice reset!" icon="star" level={2} role="status">
          Your mind is warmed up. Let&apos;s pick one small thing.
        </Panel>
      )}

      <p className="mt-4 text-sm font-bold text-[var(--color-text-soft)]">Step {step} of 3</p>

      {step === 1 && (
        <Panel variant="panel" as="section" aria-labelledby="step1-title" className="mt-1">
          <div className="px-1 py-2 sm:px-2">
            <h2 id="step1-title" ref={headingRef} tabIndex={-1} className="font-heading text-xl font-bold text-[var(--color-text)] focus:outline-none">
              What do you need to work on?
            </h2>
            <label htmlFor="task" className="mt-2 block font-semibold text-[var(--color-text)]">
              Your task
            </label>
            <p id="task-hint" className="text-sm text-[var(--color-text-soft)]">
              A few words is enough, like &quot;Finish my CS assignment on pointers.&quot;
            </p>
            <textarea
              id="task"
              ref={taskRef}
              rows={3}
              placeholder="Finish my CS assignment on pointers."
              maxLength={500}
              value={draft.task}
              onChange={(e) => update({ task: e.target.value })}
              aria-describedby="task-hint"
              className="mt-2 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-4 text-lg text-[var(--color-text)]"
            />
            {selected && (
              <p role="status" className="mt-1 text-sm text-[var(--color-text-soft)]">
                Filled in from &quot;{selected.title}&quot;. You can edit it.
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => generate(FEEDBACK.INITIAL)} disabled={!canContinue}>
                Generate Quest
              </Button>
              <Button variant="secondary" onClick={() => setStep(2)} disabled={!canContinue}>
                Personalize first
              </Button>
            </div>
            {canContinue && (
              <p className="mt-2 text-xs text-[var(--color-text-soft)]">
                Generating sends the task text above to the AI service. Imported calendar files themselves are never
                uploaded.
              </p>
            )}
            {!canContinue && (
              <p className="mt-2 text-sm text-[var(--color-text-soft)]">Type or dictate your task to continue.</p>
            )}

            <div className="mt-6 flex flex-wrap items-start gap-3 border-t-2 border-[var(--color-border)] pt-4">
              <Dictation onText={(text) => update({ task: `${draft.task}${draft.task && !/\s$/.test(draft.task) ? ' ' : ''}${text}` })} />
              <Button
                variant="secondary"
                ref={importButtonRef}
                onClick={() => setImportOpen((o) => !o)}
                aria-expanded={importOpen}
                aria-controls="import-panel"
              >
                {importOpen ? 'Hide assignment import' : 'Pick from imported assignments'}
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {step === 1 && importOpen && (
        <div id="import-panel">
          <ImportAssignments
            key={importSource ?? 'default'}
            initialSource={importSource}
            onSelect={pickAssignment}
            onClose={closeImport}
            headingRef={importHeadingRef}
          />
        </div>
      )}

      {step === 2 && (
        <Panel variant="panel" as="section" aria-labelledby="step2-title" className="mt-1">
          <div className="grid gap-6 px-1 py-2 sm:px-2 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <h2 id="step2-title" ref={headingRef} tabIndex={-1} className="font-heading text-xl font-bold text-[var(--color-text)] focus:outline-none">
              A little about right now
            </h2>
            <p className="mt-1 text-[var(--color-text-soft)]">
              This helps shape a step that fits. Your task: <em>{draft.task}</em>
            </p>

            <fieldset className="mt-3">
              <legend className="font-semibold text-[var(--color-text)]">What&apos;s getting in the way?</legend>
              <div className="mt-1 flex flex-col gap-2">
                {BARRIERS.map((b) => (
                  <label key={b.id} className="flex min-h-11 items-center gap-2 text-[var(--color-text)]">
                    <input
                      type="radio"
                      name="barrier"
                      checked={draft.barrier === b.id}
                      onChange={() => update({ barrier: b.id })}
                      className="h-6 w-6 shrink-0 accent-[var(--color-primary)]"
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-3">
              <legend className="font-semibold text-[var(--color-text)]">How&apos;s your energy?</legend>
              <div className="mt-1 flex flex-wrap gap-2" role="radiogroup" aria-label="Energy level">
                {ENERGIES.map((e) => (
                  <TabButton
                    key={e.id}
                    role="radio"
                    aria-checked={draft.energy === e.id}
                    selected={draft.energy === e.id}
                    onClick={() => update({ energy: e.id })}
                  >
                    {e.label}
                  </TabButton>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={() => generate(FEEDBACK.INITIAL)}>Get my first step</Button>
              <Button
                variant="secondary"
                onClick={() => generate(FEEDBACK.INITIAL, { barrier: EMPTY_DRAFT.barrier, energy: EMPTY_DRAFT.energy })}
              >
                Skip these questions
              </Button>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
          <aside aria-label="How you are feeling" className="md:justify-self-end">
            <RightNowScene energy={draft.energy} barrier={draft.barrier} />
          </aside>
        </div>
        </Panel>
      )}

      {step === 3 && (
        <Panel variant="panel" as="section" aria-labelledby="step3-title" className="mt-1">
          <div className="px-1 py-2 sm:px-2">
            <h2 id="step3-title" ref={headingRef} tabIndex={-1} className="font-heading text-xl font-bold text-[var(--color-text)] focus:outline-none">
              Your next small step
            </h2>

            {loading && (
              <p role="status" className="mt-3 flex items-center gap-2 text-[var(--color-text)]">
                <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                Finding a small first step for you…
              </p>
            )}

            {error && !loading && (
              <div role="alert" className="mt-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-text)]">
                <h3 className="font-heading text-lg font-bold">Quest help isn&apos;t available right now</h3>
                <p className="mt-1">{error} No step was generated, and your task is saved exactly as you wrote it.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button onClick={() => generate(lastFeedback.current)}>Retry</Button>
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Keep editing
                  </Button>
                </div>
                <p className="mt-3 text-sm text-[var(--color-text-soft)]">
                  Or{' '}
                  <button type="button" onClick={useDemoInstead} className="min-h-11 font-semibold underline">
                    show a built-in sample step
                  </button>{' '}
                  (not AI-generated).
                </p>
              </div>
            )}

            {result && !loading && !error && (
              <div aria-live="polite">
                <p className="mt-3 text-sm text-[var(--color-text-soft)]">
                  {result.mode === 'demo'
                    ? 'Sample step, not AI-generated: the quest service isn’t reachable, and this example doesn’t read your task closely.'
                    : 'Suggested by AI (Gemini). Check that it makes sense for you.'}
                </p>

                <div className="mt-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-4">
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text)]">{result.quest.questTitle}</h3>
                  <p className="mt-1 text-[var(--color-text)]">{result.quest.questDescription}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-text-soft)]">
                    About {result.quest.estimatedMinutes} minute{result.quest.estimatedMinutes === 1 ? '' : 's'}
                  </p>
                  <p className="mt-2 italic text-[var(--color-text-soft)]">{result.quest.encouragement}</p>
                </div>

                {started ? (
                  <p role="status" className="mt-3 font-semibold text-[var(--color-text)]">
                    You&apos;ve got this. Take it one minute at a time. You can come back here whenever you like.
                  </p>
                ) : (
                  <div className="mt-4">
                    <Button onClick={() => setStarted(true)}>I&apos;ll start this now</Button>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => generate(FEEDBACK.STILL_STUCK)}>
                    I&apos;m still stuck — make it smaller
                  </Button>
                  <Button variant="secondary" onClick={() => generate(FEEDBACK.RESTART)}>
                    Try a different approach
                  </Button>
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Change my task
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}

      <Integrations onOpenImport={openImport} />
      <StudyRadio />
    </section>
  )
}

export default StudyQuest
