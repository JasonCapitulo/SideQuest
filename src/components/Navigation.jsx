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
    <header
      className={`sticky top-0 z-20 ${
        isSprout
          ? 'sg-nav'
          : 'border-b-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]/90 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('Home')}
          aria-label="SideQuest home"
          className="rounded-xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          <Logo size="sm" />
        </button>

        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {NAV_ITEMS.map(({ label, page, icon }) => {
              const isActive = current === page
              return (
                <li key={label}>
                  <TabButton
                    selected={isActive}
                    onClick={() => onNavigate(page)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <ThemeIcon name={icon} size={16}  />
                    {label}
                  </TabButton>
                </li>
              )
            })}
          </ul>
        </nav>

        <label className="flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-[var(--color-border)] px-2 py-1.5 text-sm text-[var(--color-text)]">
          <Palette size={16} aria-hidden="true" />
          <span className="sr-only">Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`min-h-9 bg-transparent font-semibold text-[var(--color-text)] focus-visible:outline-none ${
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
  )
}

export default Navigation
