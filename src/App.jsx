import { useCallback, useEffect, useRef, useState } from 'react'
import { ThemeProvider, useThemePreferences } from './context/ThemeContext.jsx'
import Navigation from './components/Navigation.jsx'
import Panel from './components/Panel.jsx'
import { CatSprite } from './components/Sprite.jsx'
import Home from './pages/Home.jsx'
import Games from './pages/Games.jsx'
import StudyQuest from './pages/StudyQuest.jsx'
import Settings from './pages/Settings.jsx'

const PAGES = {
  Home,
  Games,
  'Study Quest': StudyQuest,
  Settings,
}

const VEIL_MS = 900

function AppShell() {
  const { theme, reducedMotion } = useThemePreferences()
  const [page, setPage] = useState('Home')
  // 'game' when the player arrived from finishing a reset game.
  const [arrivedFrom, setArrivedFrom] = useState(null)
  const [veilMessage, setVeilMessage] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const go = useCallback((next, from = null) => {
    setArrivedFrom(from)
    setPage(next)
    window.scrollTo(0, 0)
  }, [])

  // `options.transition` shows a short "reset complete" screen before the new page.
  const navigate = useCallback(
    (next, options = {}) => {
      clearTimeout(timerRef.current)
      if (!options.transition || reducedMotion) {
        setVeilMessage(null)
        go(next, options.from)
        return
      }
      setVeilMessage(options.transition)
      timerRef.current = setTimeout(() => {
        go(next, options.from)
        setVeilMessage(null)
      }, VEIL_MS)
    },
    [go, reducedMotion],
  )

  const Page = PAGES[page] ?? Home

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navigation current={page} onNavigate={navigate} />
      <main key={page} className="page-enter">
        <Page onNavigate={navigate} arrivedFrom={arrivedFrom} />
      </main>

      {veilMessage && (
        <div
          role="status"
          className="page-enter fixed inset-0 z-30 flex items-center justify-center bg-[var(--color-bg)]/90 p-6"
        >
          <Panel variant="panel" className="max-w-sm text-center">
            <div className="flex flex-col items-center gap-3 p-2">
              {theme === 'sprout' && <CatSprite pose="cheer" scale={4} />}
              <p className="font-heading text-xl font-bold text-[var(--color-text)]">{veilMessage}</p>
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App
