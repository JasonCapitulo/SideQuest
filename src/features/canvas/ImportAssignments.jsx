import { useId, useState } from 'react'
import { Loader2 } from 'lucide-react'
import BrandLogo from '../../components/BrandLogo.jsx'
import Button from '../../components/Button.jsx'
import Panel from '../../components/Panel.jsx'
import TabButton from '../../components/TabButton.jsx'
import { useQuestState } from '../../context/QuestStateContext.jsx'
import { ImportError, MAX_FILE_BYTES, parseIcs } from './parseIcs.js'
import { DIFFICULTY, rankItems } from './prioritize.js'
import { sampleAssignments } from './sampleAssignments.js'

const SOURCES = {
  'canvas-ics-file': {
    brand: 'canvas',
    label: 'Canvas',
    steps:
      'In Canvas, open Calendar, then Calendar Feed (bottom right). Open that link in a new tab and save the file (it ends in .ics). The feed link is private, so don’t share it.',
  },
  'google-ics-file': {
    brand: 'google',
    label: 'Google Calendar',
    steps:
      'In Google Calendar, open Settings, then Import & export, then Export. Unzip the download and choose the .ics file for the calendar you want. Calendar events are never treated as assignments.',
  },
}

const TZ_LOCAL = Intl.DateTimeFormat().resolvedOptions().timeZone

function formatDue(item) {
  const d = new Date(item.dueAt)
  const day = { weekday: 'short', month: 'short', day: 'numeric' }
  const label = item.allDay
    ? d.toLocaleDateString(undefined, day)
    : d.toLocaleString(undefined, { ...day, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
  const zone = !item.allDay && item.tzid && item.tzid !== 'UTC' && item.tzid !== TZ_LOCAL ? ` (file zone: ${item.tzid})` : ''
  return `${item.kind === 'assignment' ? 'Due' : 'Starts'} ${label}${zone}`
}

/**
 * Read-only calendar import from a local .ics file, or clearly labelled sample data.
 * There is no live connection to Canvas or Google: that needs server-side OAuth, and the browser must never hold a token.
 */
function ImportAssignments({ initialSource, onSelect, onClose, headingRef }) {
  const fileId = useId()
  const { imported, setImported, selected, meta, pinnedId, setMeta, setPinned } = useQuestState()
  const [sourceId, setSourceId] = useState(
    initialSource ?? (imported?.source === 'google-ics-file' ? 'google-ics-file' : 'canvas-ics-file'),
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showEvents, setShowEvents] = useState(false)
  const source = SOURCES[sourceId]

  const isSample = imported?.source === 'sample-demo'
  const all = imported?.items ?? []
  const assignments = all.filter((i) => i.kind === 'assignment')
  const noneLabelled = assignments.length === 0 && all.length > 0
  const visible = showEvents || noneLabelled ? all : assignments
  const hiddenEvents = all.length - assignments.length
  const ranked = rankItems(visible, meta, pinnedId)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow choosing the same file again
    if (!file) return
    setError('')
    setNotice('')
    if (file.size > MAX_FILE_BYTES) {
      setError('That file is larger than 2 MB. Please export a single calendar as an .ics file.')
      return
    }
    if (!/\.ics$/i.test(file.name) && !/calendar/i.test(file.type)) {
      setError('Please choose a calendar file ending in .ics.')
      return
    }
    setBusy(true)
    try {
      const result = parseIcs(await file.text(), { source: sourceId })
      const sameAsBefore =
        imported?.source === sourceId &&
        imported.items.length === result.items.length &&
        imported.items.every((it, i) => it.id === result.items[i].id)
      if (sameAsBefore) {
        setNotice('That file is already imported, so nothing changed. Duplicates are never added twice.')
      } else {
        setImported({ source: sourceId, fileName: file.name, items: result.items, pastCount: result.pastCount })
        setShowEvents(false)
        const parts = []
        if (result.pastCount) parts.push(`${result.pastCount} past item${result.pastCount === 1 ? '' : 's'} hidden`)
        if (result.skipped) parts.push(`${result.skipped} without a usable date or title skipped`)
        const extra = parts.length ? ` ${parts.join('; ')}.` : ''
        setNotice(
          result.items.length === 0
            ? `The file was read, but it has no upcoming items.${extra}`
            : `Found ${result.items.length} upcoming item${result.items.length === 1 ? '' : 's'}.${extra}`,
        )
      }
    } catch (err) {
      setError(
        err instanceof ImportError
          ? err.message
          : 'Something went wrong reading that file. Please try exporting the calendar again.',
      )
    } finally {
      setBusy(false)
    }
  }

  function useSample() {
    setError('')
    setImported({ source: 'sample-demo', fileName: null, items: sampleAssignments(), pastCount: 0 })
    setShowEvents(false)
    setNotice('Loaded sample demo data. These are made-up assignments.')
  }

  return (
    <Panel variant="panel" as="section" aria-labelledby="import-title" className="mt-4">
      <div className="px-1 py-2 sm:px-2">
        <div className="flex items-center gap-3">
          <BrandLogo brand={source.brand} size={44} />
          <h2
            id="import-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-heading text-xl font-bold text-[var(--color-text)] focus:outline-none"
          >
            Import coursework
          </h2>
        </div>
        <p className="mt-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm text-[var(--color-text)]">
          <strong>Read-only snapshot from a file on your device.</strong> SideQuest is not connected to {source.label},
          nothing is uploaded, and the list won&apos;t update by itself.
        </p>

        <div role="radiogroup" aria-label="Calendar source" className="mt-3 flex flex-wrap gap-2">
          {Object.entries(SOURCES).map(([id, s]) => (
            <TabButton
              key={id}
              role="radio"
              aria-checked={id === sourceId}
              selected={id === sourceId}
              onClick={() => setSourceId(id)}
            >
              {s.label}
            </TabButton>
          ))}
        </div>

        <h3 className="mt-4 font-bold text-[var(--color-text)]">Get your {source.label} file</h3>
        <p className="text-sm text-[var(--color-text-soft)]">{source.steps}</p>
        <label htmlFor={fileId} className="mt-3 block font-semibold text-[var(--color-text)]">
          Import all from a calendar file (.ics)
        </label>
        <input
          id={fileId}
          type="file"
          accept=".ics,text/calendar"
          onChange={handleFile}
          className="mt-1 block w-full min-h-11 text-[var(--color-text)] file:mr-3 file:min-h-11 file:rounded-lg file:border-2 file:border-[var(--color-border)] file:bg-[var(--color-card)] file:px-3 file:font-semibold file:text-[var(--color-text)]"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={useSample}>
            Try sample demo data
          </Button>
          <span className="text-sm text-[var(--color-text-soft)]">Made-up assignments, not from any account.</span>
        </div>

        {busy && (
          <p role="status" className="mt-3 flex items-center gap-2 text-[var(--color-text)]">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Reading your file…
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 rounded-lg border-2 border-[var(--color-text)] bg-[var(--color-card)] p-3 font-semibold text-[var(--color-text)]">
            {error} You can try another file or use the sample demo data.
          </p>
        )}
        {notice && !error && (
          <p role="status" className="mt-3 text-[var(--color-text)]">
            {notice}
          </p>
        )}

        {imported && (
          <div className="mt-4">
            <h3 className="font-bold text-[var(--color-text)]">
              {isSample
                ? 'SAMPLE DEMO DATA (not real assignments)'
                : `Upcoming from ${imported.fileName} (${SOURCES[imported.source]?.label ?? 'calendar'} file, read-only)`}
            </h3>
            {hiddenEvents > 0 && !noneLabelled && (
              <label className="mt-1 flex min-h-11 items-center gap-2 text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={showEvents}
                  onChange={(e) => setShowEvents(e.target.checked)}
                  className="h-6 w-6 shrink-0 accent-[var(--color-primary)]"
                />
                Also show other calendar events ({hiddenEvents})
              </label>
            )}
            {noneLabelled && (
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                {imported.source === 'canvas-ics-file'
                  ? 'This file doesn’t mark any items as Canvas assignments, so everything is listed as a calendar event.'
                  : 'These are calendar events, not verified assignments.'}{' '}
                Pick the one you want.
              </p>
            )}

            {ranked.length === 0 ? (
              <p className="mt-2 text-[var(--color-text)]">No upcoming items to show.</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                  Ordered by due date, any effort you add, and difficulty you choose. This is a suggestion, and you can
                  pick anything.
                </p>
                <ol className="mt-2 list-none space-y-2 p-0">
                  {ranked.map((r, index) => {
                    const item = r.item
                    const isSelected = selected?.id === item.id
                    const m = meta[item.id] ?? {}
                    return (
                      <li
                        key={item.id}
                        className={`rounded-xl border-2 bg-[var(--color-card)] p-3 ${
                          isSelected ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            {index === 0 && (
                              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-soft)]">
                                {r.pinned ? 'Your pick: first' : 'Suggested first'}
                              </p>
                            )}
                            <p className="font-bold text-[var(--color-text)]">
                              {item.title}{' '}
                              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 align-middle text-xs font-semibold">
                                {item.kind === 'assignment' ? 'Assignment' : 'Calendar event'}
                              </span>
                            </p>
                            <p className="text-sm text-[var(--color-text-soft)]">
                              {item.course ? `${item.course} · ` : ''}
                              {formatDue(item)} · {r.minutes ? `about ${r.minutes} min (${r.minutesSource})` : 'effort unknown'}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            onClick={() => onSelect(item)}
                            aria-pressed={isSelected}
                            aria-label={`${isSelected ? 'Selected' : 'Use this'}: ${item.title}`}
                          >
                            {isSelected ? 'Selected' : 'Use this'}
                          </Button>
                        </div>
                        <details className="mt-2">
                          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-[var(--color-text)]">
                            {index === 0 ? 'Why this first? / Adjust' : 'Why this rank? / Adjust'}
                          </summary>
                          <ul className="ml-5 list-disc text-sm text-[var(--color-text-soft)]">
                            {r.reasons.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                          <div className="mt-2 flex flex-wrap items-end gap-3">
                            <label className="text-sm font-semibold text-[var(--color-text)]">
                              Estimated minutes
                              <input
                                type="number"
                                min="5"
                                max="1440"
                                step="5"
                                inputMode="numeric"
                                value={m.minutes ?? ''}
                                onChange={(e) => setMeta(item.id, { minutes: e.target.value === '' ? null : Number(e.target.value) })}
                                className="mt-1 block min-h-11 w-28 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-[var(--color-text)]"
                              />
                            </label>
                            <label className="text-sm font-semibold text-[var(--color-text)]">
                              Difficulty (optional)
                              <select
                                value={m.difficulty ?? ''}
                                onChange={(e) => setMeta(item.id, { difficulty: e.target.value ? Number(e.target.value) : null })}
                                className="mt-1 block min-h-11 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-[var(--color-text)]"
                              >
                                <option value="">Not set</option>
                                {Object.entries(DIFFICULTY).map(([v, label]) => (
                                  <option key={v} value={v}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <Button
                              variant="secondary"
                              aria-pressed={pinnedId === item.id}
                              onClick={() => setPinned(pinnedId === item.id ? null : item.id)}
                            >
                              {pinnedId === item.id ? 'Unpin from first' : 'Do this first'}
                            </Button>
                          </div>
                        </details>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
          </div>
        )}

        <div className="mt-4">
          <Button variant="secondary" onClick={onClose}>
            Close import
          </Button>
        </div>
      </div>
    </Panel>
  )
}

export default ImportAssignments
