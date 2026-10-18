import { useThemePreferences } from '../context/ThemeContext.jsx'
import ThemeIcon from './ThemeIcon.jsx'

/**
 * Themed container. `variant="panel"` is the large menu frame; `"card"` is the
 * smaller raised block. Both fall back to the same soft rounded look outside
 * Sprout Garden / Retro Arcade.
 */
function Panel({ title, icon, variant = 'card', as: Tag = 'div', children, className = '', ...props }) {
  const { theme } = useThemePreferences()

  let frame
  if (theme === 'sprout') frame = variant === 'panel' ? 'sg-panel' : 'sg-card'
  else if (theme === 'retro') frame = 'retro-panel p-5'
  else
    frame =
      'rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--theme-shadow)]'

  return (
    <Tag className={`${frame} ${className}`} {...props}>
      {title && (
        <h3 className="font-heading mb-2 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
          {icon && <ThemeIcon name={icon} />}
          {title}
        </h3>
      )}
      <div className="text-[var(--color-text-soft)]">{children}</div>
    </Tag>
  )
}

export default Panel
