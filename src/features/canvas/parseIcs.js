import ICAL from 'ical.js'

/**
 * Parses a calendar (.ics) export, such as a Canvas calendar feed saved to disk,
 * into normalised, read-only items. Nothing is fetched and nothing is invented:
 * fields the file does not contain stay null (Canvas files carry no time estimates).
 *
 * Item: { id, title, course, dueAt (ISO string), allDay, kind, source, estimatedMinutes, context, url }
 */
export const MAX_FILE_BYTES = 2 * 1024 * 1024
const WINDOW_DAYS = 180 // how far ahead recurring events are expanded
const MAX_OCCURRENCES = 80 // per recurring event
const MAX_ITERATIONS = 3000 // safety cap for very old, endless recurrences

export class ImportError extends Error {}

function startOfToday(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function toJsDate(time) {
  // Date-only values (all-day) are anchored to local midnight rather than UTC.
  if (time.isDate) return new Date(time.year, time.month - 1, time.day)
  return time.toJSDate()
}

/** Canvas titles look like "Essay 2 [ENGL 101-004]": split the course code off when present. */
function splitCourse(summary) {
  const m = /^(.*?)\s*\[([^\]]+)\]\s*$/.exec(summary)
  if (m && m[1]) return { title: m[1].trim(), course: m[2].trim() }
  return { title: summary.trim(), course: null }
}

function cleanContext(description) {
  if (!description) return null
  const text = String(description).replace(/\s+/g, ' ').trim()
  return text ? text.slice(0, 300) : null
}

export function parseIcs(text, { now = new Date(), source = 'canvas-ics-file' } = {}) {
  if (!text || !text.trim()) throw new ImportError('That file is empty, so there is nothing to import.')

  let root
  try {
    root = new ICAL.Component(ICAL.parse(text))
  } catch {
    throw new ImportError("That doesn't look like a valid calendar (.ics) file.")
  }
  if (root.name !== 'vcalendar') throw new ImportError("That doesn't look like a valid calendar (.ics) file.")

  // Register the file's own time zones so local times convert correctly.
  ICAL.TimezoneService.reset()
  root.getAllSubcomponents('vtimezone').forEach((tz) => {
    try {
      ICAL.TimezoneService.register(new ICAL.Timezone(tz))
    } catch {
      /* unknown zone: ical.js falls back to floating time */
    }
  })

  const events = root.getAllSubcomponents('vevent').map((c) => new ICAL.Event(c))
  if (events.length === 0) throw new ImportError('No calendar events were found in that file.')

  const masters = new Map()
  const exceptions = []
  events.forEach((ev) => (ev.isRecurrenceException() ? exceptions.push(ev) : masters.set(ev.uid, ev)))
  exceptions.forEach((ex) => masters.get(ex.uid)?.relateException(ex))

  const today = startOfToday(now)
  const windowEnd = new Date(today.getTime() + WINDOW_DAYS * 86400000)
  const seen = new Set()
  const items = []
  let skippedNoDate = 0
  let pastCount = 0

  const push = (ev, startTime, summaryItem) => {
    const due = toJsDate(startTime)
    if (Number.isNaN(due.getTime())) {
      skippedNoDate += 1
      return
    }
    if (due < today) {
      pastCount += 1
      return
    }
    const rawSummary = summaryItem.summary
    if (!rawSummary || !rawSummary.trim()) {
      skippedNoDate += 1
      return
    }
    const { title, course } = splitCourse(rawSummary)
    const iso = due.toISOString()
    const dedupeKey = `${title.toLowerCase()}|${course ?? ''}|${iso}`
    const id = `${ev.uid}::${iso}`
    if (seen.has(id) || seen.has(dedupeKey)) return
    seen.add(id)
    seen.add(dedupeKey)
    items.push({
      id,
      title,
      course,
      dueAt: iso,
      allDay: Boolean(startTime.isDate),
      // Canvas marks real assignments with an "event-assignment-…" UID. Anything else is just a calendar event.
      kind: /assignment/i.test(ev.uid) ? 'assignment' : 'event',
      source,
      estimatedMinutes: null,
      context: cleanContext(summaryItem.description),
      url: ev.component.getFirstPropertyValue('url') || null,
    })
  }

  masters.forEach((ev) => {
    if (!ev.startDate) {
      skippedNoDate += 1
      return
    }
    try {
      if (ev.isRecurring()) {
        const it = ev.iterator()
        let next
        let kept = 0
        let guard = 0
        while ((next = it.next()) && kept < MAX_OCCURRENCES && guard++ < MAX_ITERATIONS) {
          const details = ev.getOccurrenceDetails(next)
          if (toJsDate(details.startDate) > windowEnd) break
          if (toJsDate(details.startDate) >= today) {
            push(ev, details.startDate, details.item)
            kept += 1
          }
        }
      } else {
        push(ev, ev.startDate, ev)
      }
    } catch {
      skippedNoDate += 1
    }
  })

  items.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
  return { items, pastCount, skipped: skippedNoDate, totalEvents: masters.size }
}
