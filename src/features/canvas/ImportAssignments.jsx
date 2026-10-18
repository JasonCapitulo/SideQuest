import { useId, useState } from 'react'
import Button from '../../components/Button.jsx'
import Panel from '../../components/Panel.jsx'
import { ImportError, MAX_FILE_BYTES, parseIcs } from './parseIcs.js'
import { sampleAssignments } from './sampleAssignments.js'

const DATE_ONLY = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
const DATE_TIME = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatDue(item) {
  const d = new Date(item.dueAt)
  const label = item.allDay ? DATE_ONLY.format(d) : DATE_TIME.format(d)
  return item.kind === 'assignment' ? `Due ${label}` : `Starts ${label}`
}

/**
 * Read-only assignment import. Works from a local .ics file or clearly labelled sample data.
 * There is deliberately no live Canvas connection: that needs server-side OAuth or a
 * school-approved developer key, and the browser must never hold a Canvas token.
 */
function ImportAssignments({ imported, onImported, onSelect, onClose, headingRef }) {
  const fileId = useId()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showEvents, setShowEvents] = useState(false)

  const isSample = imported?.source === 'sample-demo'
  const all = imported?.items ?? []
  const assignments = all.filter((i) => i.kind === 'assignment')
  const noneLabelled = assignments.length === 0 && all.length > 0
  const visible = showEvents || noneLabelled ? all : assignments
  const hiddenEvents = all.length - assignments.length

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow choosing the same file again
    if (!file) return
    setError('')
    setNotice('')
    if (file.size > MAX_FILE_BYTES) {
      setError('That file is larger than 2 MB. Please choose a calendar (.ics) file exported from Canvas.')
      return
    }
    if (!/\.ics$/i.test(file.name) && !/calendar/i.test(file.type)) {
      setError('Please choose a calendar file ending in .ics.')
      return
    }
    setBusy(true)
    try {
      const text = await file.text()
      const result = parseIcs(text)
      onImported({ source: 'canvas-ics-file', fileName: file.name, items: result.items, pastCount: result.pastCount })
      setShowEvents(false)
      const parts = []
      if (result.pastCount) parts.push(`${result.pastCount} past item${result.pastCount === 1 ? '' : 's'} hidden`)
      if (result.skipped) parts.push(`${result.skipped} without a usable date or title skipped`)
      setNotice(
        result.items.length === 0
          ? 'The file was read, but it has no upcoming items.' + (parts.length ? ` (${parts.join('; ')}.)` : '')
          : `Found ${result.items.length} upcoming item${result.items.length === 1 ? '' : 's'}.` +
              (parts.length ? ` ${parts.join('; ')}.` : ''),
      )
    } catch (err) {
      setError(
        err instanceof ImportError
          ? err.message
          : "Something went wrong reading that file. Please try exporting the calendar again.",
      )
    } finally {
      setBusy(false)
    }
  }

  function useSample() {
    setError('')
    onImported({ source: 'sample-demo', fileName: null, items: sampleAssignments(), pastCount: 0 })
    setShowEvents(false)
    setNotice('Loaded sample demo data. These are made-up assignments.')
  }

  return (
    <Panel variant="panel" as="section" aria-labelledby="import-title" className="mt-4">
      <div className="px-1 py-2 sm:px-2">
        <h2
          id="import-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-heading text-xl font-bold text-[var(--color-text)] focus:outline-none"
        >
          Import assignments
        </h2>
        <p className="mt-1 text-[var(--color-text)]">
          Optional. Pick an assignment from a calendar file and SideQuest will fill in your task for you.
        </p>
        <p className="mt-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm text-[var(--color-text)]">
          <strong>Read-only snapshot.</strong> SideQuest reads a file you choose on your device. It is not connected to
          Canvas, nothing is uploaded, and the list won&apos;t update by itself.
        </p>

        <h3 className="mt-4 font-bold text-[var(--color-text)]">Option 1: Use a Canvas calendar file</h3>
        <p className="text-sm text-[var(--color-text-soft)]">
          In Canvas, open Calendar, then Calendar Feed. Open that link in a new tab and save the file (it ends in .ics),
          then choose it below. The feed link is private, so don&apos;t share it.
        </p>
        <label htmlFor={fileId} className="mt-2 block font-semibold text-[var(--color-text)]">
          Choose a calendar file (.ics)
        </label>
        <input
          id={fileId}
          type="file"
          accept=".ics,text/calendar"
          onChange={handleFile}
          className="mt-1 block w-full min-h-11 text-[var(--color-text)] file:mr-3 file:min-h-11 file:rounded-lg file:border-2 file:border-[var(--color-border)] file:bg-[var(--color-card)] file:px-3 file:font-semibold file:text-[var(--color-text)]"
        />

        <h3 className="mt-4 font-bold text-[var(--color-text)]">Option 2: Try sample demo data</h3>
        <div className="mt-1">
          <Button variant="secondary" onClick={useSample}>
            Load sample demo data
          </Button>
        </div>

        <h3 className="mt-4 font-bold text-[var(--color-text)]">Live Canvas connection</h3>
        <div className="mt-1">
          <Button variant="secondary" disabled aria-describedby="canvas-live-note">
            Connect to Canvas (not available)
          </Button>
        </div>
        <p id="canvas-live-note" className="mt-1 text-sm text-[var(--color-text-soft)]">
          A live connection needs secure OAuth or a school-approved developer key, set up on a server. SideQuest will
          never ask you to paste a Canvas token into this page.
        </p>

        {busy && (
          <p role="status" className="mt-3 text-[var(--color-text)]">
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
              {isSample ? 'SAMPLE DEMO DATA (not real assignments)' : `Imported from ${imported.fileName} (read-only)`}
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
                This file doesn&apos;t mark which items are assignments, so all upcoming calendar events are listed.
                Pick the one you want.
              </p>
            )}

            {visible.length === 0 ? (
              <p className="mt-2 text-[var(--color-text)]">No upcoming items to show.</p>
            ) : (
              <ul className="mt-2 list-none space-y-2 p-0">
                {visible.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-[var(--color-text)]">{item.title}</p>
                      <p className="text-sm text-[var(--color-text-soft)]">
                        {item.course ? `${item.course} · ` : ''}
                        {formatDue(item)}
                        {item.estimatedMinutes ? ` · about ${item.estimatedMinutes} min (sample estimate)` : ''}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => onSelect(item)}
                      aria-label={`Use this assignment: ${item.title}`}
                    >
                      Use this
                    </Button>
                  </li>
                ))}
              </ul>
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
