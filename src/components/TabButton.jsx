import { useThemePreferences } from '../context/ThemeContext.jsx'

const FOCUS =
  'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]'

/**
 * Selectable button used for navigation tabs and option groups. Pass
 * `aria-current`, `aria-checked` (with role="radio") or `aria-pressed`;
 * `selected` only drives the non-Sprout visual state.
 */
function TabButton({ selected, children, className = '', ...props }) {
  const { theme } = useThemePreferences()

  const look =
    theme === 'sprout'
      ? 'sg-tab min-h-11'
      : theme === 'retro'
        ? `retro-button px-3 py-2 text-sm ${
            selected ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'
          } text-[var(--color-text)]`
        : `rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            selected
              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
              : 'border-2 border-[var(--color-border)] text-[var(--color-text-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`

  return (
    <button type="button" className={`inline-flex min-h-11 items-center justify-center gap-1.5 ${FOCUS} ${look} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default TabButton
