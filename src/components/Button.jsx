import { useThemePreferences } from '../context/ThemeContext.jsx'

const FOCUS =
  'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]'

function Button({ variant = 'primary', size = 'md', children, className = '', type = 'button', ...props }) {
  const { theme } = useThemePreferences()
  const pad = size === 'lg' ? 'min-h-14 px-8 py-3 text-lg' : 'min-h-11 px-5 py-2.5'
  const base = `inline-flex items-center justify-center gap-2 font-bold ${FOCUS}`

  let styles
  if (theme === 'sprout') {
    styles = `sg-button ${variant === 'secondary' ? 'sg-button--secondary' : ''} ${size === 'lg' ? 'min-h-14 px-8 text-lg' : 'min-h-11'}`
  } else if (theme === 'retro') {
    styles = `retro-button ${pad} ${
      variant === 'primary'
        ? 'bg-[var(--color-primary)] text-[var(--color-text)]'
        : 'bg-[var(--color-secondary)] text-[var(--color-text)]'
    }`
  } else {
    styles = `${pad} rounded-2xl transition-transform duration-150 active:translate-y-0.5 disabled:opacity-60 ${
      variant === 'primary'
        ? 'facet-button bg-[var(--color-primary)] text-[var(--color-on-primary)]'
        : 'border-2 border-[var(--color-secondary)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]'
    }`
  }

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
