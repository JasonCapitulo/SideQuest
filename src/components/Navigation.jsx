
import { Palette } from 'lucide-react'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { THEMES } from '../theme/themes.js'
import Logo from './Logo.jsx'
import TabButton from './TabButton.jsx'
import ThemeIcon from './ThemeIcon.jsx'

const NAV_ITEMS = [
  { label: 'Home', page: 'Home', icon: 'home' },
  { label: 'Arcade', page: 'Games', icon: 'games' },
  { label: 'Study Quest', page: 'Study Quest', icon: 'quest' },
  { label: 'Settings', page: 'Settings', icon: 'settings' },
]

function Navigation({ current, onNavigate }) {
  const { theme, setTheme } = useThemePreferences()
  const isSprout = theme === 'sprout'

  return (
    <>
      <header
        className={`sticky top-0 z-20 ${
          isSprout
            ? 'sg-nav'
            : 'border-b-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]/90 backdrop-blur'
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate('Home')}
            aria-label="SideQuest home"
            className="shrink-0 rounded-xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <Logo size="sm" />
          </button>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1.5 lg:gap-2">
              {NAV_ITEMS.map(({ label, page, icon }) => {
                const isActive = current === page

                return (
                  <li key={page}>
                    <TabButton
                      selected={isActive}
                      onClick={() => onNavigate(page)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <ThemeIcon name={icon} size={16} />
                      {label}
                    </TabButton>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Theme selector */}
          <label className="flex min-h-11 min-w-0 items-center gap-1 rounded-xl border-2 border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-text)]">
            <Palette size={16} aria-hidden="true" className="shrink-0" />
            <span className="sr-only">Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              aria-label="Theme"
              className={`min-h-9 min-w-0 max-w-32 bg-transparent text-xs font-semibold text-[var(--color-text)] focus-visible:outline-none sm:max-w-none sm:text-sm ${
                isSprout ? 'sg-select px-1' : ''
              }`}
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
          {NAV_ITEMS.map(({ label, page, icon }) => {
            const isActive = current === page

            return (
              <li key={page} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onNavigate(page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--color-focus)] ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <ThemeIcon name={icon} size={19} />
                  <span className="whitespace-nowrap">
                    {label === 'Study Quest' ? 'Study' : label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

export default Navigation
