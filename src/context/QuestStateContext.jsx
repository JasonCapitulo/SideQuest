import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const QuestStateContext = createContext(null)

// Calendar data and drafts are private, so they live in sessionStorage (this tab only), never localStorage.
// No access tokens are handled anywhere in the app, so none can be stored.
const KEY = 'sidequest-quest-state'
const EMPTY_DRAFT = { task: '', barrier: 'not_sure_where_to_start', energy: 'medium' }

function load() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) ?? '{}')
    return {
      draft: { ...EMPTY_DRAFT, ...(raw.draft ?? {}) },
      imported: raw.imported && Array.isArray(raw.imported.items) ? raw.imported : null,
      selected: raw.selected && typeof raw.selected.id === 'string' ? raw.selected : null,
      meta: raw.meta && typeof raw.meta === 'object' ? raw.meta : {},
      pinnedId: typeof raw.pinnedId === 'string' ? raw.pinnedId : null,
    }
  } catch {
    return { draft: EMPTY_DRAFT, imported: null, selected: null, meta: {}, pinnedId: null }
  }
}

/** Selected coursework, the task draft and imported calendar data, shared across pages and refreshes. */
export function QuestStateProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: state stays in memory for this session */
    }
  }, [state])

  const updateDraft = useCallback((patch) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch } })), [])
  const setImported = useCallback((imported) => setState((s) => ({ ...s, imported, selected: null, pinnedId: null, meta: imported?.source === s.imported?.source ? s.meta : {} })), [])
  const setMeta = useCallback(
    (id, patch) => setState((s) => ({ ...s, meta: { ...s.meta, [id]: { ...s.meta[id], ...patch } } })),
    [],
  )
  const setPinned = useCallback((pinnedId) => setState((s) => ({ ...s, pinnedId })), [])
  const setSelected = useCallback((selected) => setState((s) => ({ ...s, selected })), [])

  const value = useMemo(
    () => ({ ...state, updateDraft, setImported, setSelected, setMeta, setPinned }),
    [state, updateDraft, setImported, setSelected, setMeta, setPinned],
  )
  return <QuestStateContext.Provider value={value}>{children}</QuestStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuestState() {
  const ctx = useContext(QuestStateContext)
  if (!ctx) throw new Error('useQuestState must be used within a QuestStateProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export { EMPTY_DRAFT }
