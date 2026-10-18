import { Moon, Palette } from 'lucide-react'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { THEMES } from '../theme/themes.js'
import { CatSprite } from './Sprite.jsx'
import TabButton from './TabButton.jsx'
import ThemeIcon from './ThemeIcon.jsx'

const NAV_ITEMS = [
  { label: 'Home', icon: 'home' },
  { label: 'Games', icon: 'games' },
  { label: 'Study Quest', icon: 'quest' },
  { label: 'Settings', icon: 'settings' },
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
          className="font-heading flex items-center gap-2 text-lg font-extrabold text-[var(--color-primary)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          {isSprout ? <CatSprite pose="idle" scale={1} /> : <Moon size={20} aria-hidden="true" />}
          <span className={isSprout ? 'text-[var(--color-text)]' : ''}>SideQuest</span>
        </button>

        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {NAV_ITEMS.map(({ label, icon }) => {
              const isActive = current === label
              return (
                <li key={label}>
                  <TabButton
                    selected={isActive}
                    onClick={() => onNavigate(label)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <ThemeIcon name={icon} size={16} tone={isActive ? 'white' : 'brown'} />
                    {label}
                  </TabButton>
                </li>
              )
            })}
          </ul>
        </nav>

        <label className="flex items-center gap-1.5 rounded-xl border-2 border-[var(--color-border)] px-2 py-1.5 text-sm text-[var(--color-text-soft)]">
          <Palette size={16} aria-hidden="true" />
          <span className="sr-only">Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`bg-transparent font-semibold text-[var(--color-text)] focus-visible:outline-none ${
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
