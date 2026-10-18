import { ChevronRight } from 'lucide-react'
import BrandLogo from '../../components/BrandLogo.jsx'
import Panel from '../../components/Panel.jsx'
import { useQuestState } from '../../context/QuestStateContext.jsx'

const SOURCE_LABEL = { 'canvas-ics-file': 'Canvas', 'google-ics-file': 'Google Calendar' }

/**
 * Settings-style list. Both rows are honest file imports: nothing is an authenticated account connection,
 * so no row ever says "Connected".
 */
function Integrations({ onOpenImport }) {
  const { imported } = useQuestState()

  const rows = [
    { brand: 'canvas', name: 'Canvas LMS', source: 'canvas-ics-file', blurb: 'Import upcoming coursework from a calendar (.ics) file.' },
    { brand: 'google', name: 'Google Calendar', source: 'google-ics-file', blurb: 'Import events from an exported .ics file. Events, not assignments.' },
  ]

  return (
    <Panel as="section" aria-labelledby="integrations-title" className="mt-6" id="integrations">
      <h2 id="integrations-title" className="font-heading text-lg font-bold text-[var(--color-text)]">
        Integrations
      </h2>
      <p className="mt-1 text-sm text-[var(--color-text-soft)]">
        Optional. SideQuest reads files you choose and isn&apos;t signed in to any account.
      </p>
      <ul className="mt-2 list-none divide-y divide-[var(--color-border)] p-0">
        {rows.map((r) => {
          const count = imported?.source === r.source ? imported.items.length : null
          return (
            <li key={r.name} className="flex items-center gap-3 py-3">
              <BrandLogo brand={r.brand} />
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-tight text-[var(--color-text)]">{r.name}</p>
                <p className="truncate text-sm text-[var(--color-text-soft)]" title={r.blurb}>
                  {r.blurb}
                </p>
              </div>
              <span className="hidden shrink-0 text-sm font-semibold text-[var(--color-text-soft)] min-[520px]:inline">
                {count === null ? 'Not imported' : `${count} item${count === 1 ? '' : 's'} from file`}
              </span>
              <button
                type="button"
                onClick={() => onOpenImport(r.source)}
                aria-label={`${count === null ? 'Import' : 'Review'} ${SOURCE_LABEL[r.source]} file${count === null ? '' : ` (${count} items from file)`}`}
                className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm font-bold text-[var(--color-text)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {count === null ? 'Import file' : 'Review'}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export default Integrations
