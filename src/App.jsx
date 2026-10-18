import { useCallback, useEffect, useRef, useState } from 'react'
import { SoundProvider } from './audio/SoundContext.jsx'
import Companion from './components/Companion.jsx'
import Navigation from './components/Navigation.jsx'
import Panel from './components/Panel.jsx'
import SoundControls from './components/SoundControls.jsx'
import Switch from './components/Switch.jsx'
import ThemeBackdrop from './components/ThemeBackdrop.jsx'
import { ThemeProvider, useThemePreferences } from './context/ThemeContext.jsx'
import Games from './pages/Games.jsx'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import StudyQuest from './pages/StudyQuest.jsx'

const PAGES = {
  Home,
  Games,
  'Study Quest': StudyQuest,
  Settings,
}

const PAGE_TITLES = { Home: 'Home', Games: 'Arcade', 'Study Quest': 'Study Quest', Settings: 'Settings' }
const VEIL_MS = 900

function AppShell() {
  const { theme, prefersReducedMotion, lowStimulation, setLowStimulation } = useThemePreferences()
  const [page, setPage] = useState('Home')
  // 'game' when the player arrived from finishing a game.
  const [arrivedFrom, setArrivedFrom] = useState(null)
  const [launchGame, setLaunchGame] = useState(null)
  const [veilMessage, setVeilMessage] = useState(null)
  const timerRef = useRef(null)
  const mainRef = useRef(null)
  const shownPage = useRef(page)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Per-page document title, and keyboard/screen-reader focus on the new page's heading.
  useEffect(() => {
    document.title = `${PAGE_TITLES[page]} | SideQuest`
    if (shownPage.current === page) return // initial load: leave focus at the top of the document
    shownPage.current = page
    const main = mainRef.current
    if (!main || main.contains(document.activeElement)) return // a page already placed focus
    const heading = main.querySelector('h1')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }, [page])

  const go = useCallback((next, options) => {
    setArrivedFrom(options?.from ?? null)
    setLaunchGame(options?.game ?? null)
    setPage(next)
    window.scrollTo(0, 0)
  }, [])

  // `options.transition` shows a short "reset complete" screen before the new page.
  const navigate = useCallback(
    (next, options = {}) => {
      clearTimeout(timerRef.current)
      if (!options.transition || prefersReducedMotion) {
        setVeilMessage(null)
        go(next, options)
        return
      }
      setVeilMessage(options.transition)
      timerRef.current = setTimeout(() => {
        go(next, options)
        setVeilMessage(null)
      }, VEIL_MS)
    },
    [go, prefersReducedMotion],
  )

  const Page = PAGES[page] ?? Home

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <ThemeBackdrop />
      <Navigation current={page} onNavigate={navigate} />

      <main id="main" ref={mainRef} tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
        <div key={page} className="page-enter">
          <Page onNavigate={navigate} arrivedFrom={arrivedFrom} initialGame={launchGame} />
        </div>
      </main>

      <footer className="relative z-10 mt-6 border-t-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6">
          <SoundControls />
          <Switch
            checked={lowStimulation}
            onChange={setLowStimulation}
            label="Low-stimulation mode"
            hint="Hides animated backgrounds and animations, and simplifies the home screen."
          />
          <p className="text-xs text-[var(--color-text-soft)]">
            Sound is off until you turn it on. Imported calendar data stays in this browser tab.
          </p>
        </div>
      </footer>

      {veilMessage && (
        <div
          role="status"
          className="page-enter fixed inset-0 z-30 flex items-center justify-center bg-[var(--color-bg)]/90 p-6"
        >
          <Panel variant="panel" className="max-w-sm text-center">
            <div className="flex flex-col items-center gap-3 p-2">
              {theme === 'sprout' && <Companion pose="cheer" size={96} />}
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
      <SoundProvider>
        <AppShell />
      </SoundProvider>
    </ThemeProvider>
  )
}

export default App
