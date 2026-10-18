import { useThemePreferences } from '../context/ThemeContext.jsx'

const FOCUS =
  'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'

function Button({ variant = 'primary', size = 'md', children, className = '', type = 'button', ...props }) {
  const { theme } = useThemePreferences()
  const pad = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3'
  const base = `inline-flex items-center justify-center gap-2 font-bold ${FOCUS}`

  let styles
  if (theme === 'sprout') {
    styles = `sg-button ${variant === 'secondary' ? 'sg-button--secondary' : ''} ${size === 'lg' ? 'text-lg' : ''}`
  } else if (theme === 'retro') {
    styles = `retro-button ${pad} ${
      variant === 'primary'
        ? 'bg-[var(--color-primary)] text-[var(--color-text)]'
        : 'bg-[var(--color-secondary)] text-[var(--color-text)]'
    }`
  } else {
    styles = `${pad} rounded-2xl transition-transform duration-150 active:translate-y-0.5 disabled:opacity-60 ${
      variant === 'primary'
        ? 'bg-[var(--color-primary)] text-white shadow-[var(--theme-shadow)] hover:bg-[var(--color-primary-hover)]'
        : 'border-2 border-[var(--color-secondary)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-secondary)] hover:text-white'
    }`
  }

  return (
    <button type={type} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
