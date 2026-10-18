import { useThemePreferences } from '../context/ThemeContext.jsx'
import ThemeIcon from './ThemeIcon.jsx'

/**
 * Themed container. `variant="panel"` is the large menu frame; `"card"` is the
 * smaller raised block. Both fall back to the same soft rounded look outside
 * Sprout Garden / Retro Arcade.
 */
function Panel({ title, icon, level = 3, variant = 'card', as: Tag = 'div', children, className = '', ...props }) {
  const Heading = `h${level}`
  const { theme } = useThemePreferences()

  let frame
  if (theme === 'sprout') frame = variant === 'panel' ? 'sg-panel' : 'sg-card'
  else if (theme === 'retro') frame = 'retro-panel p-4'
  else
    frame =
      'rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--theme-shadow)]'

  return (
    <Tag className={`${frame} ${className}`} {...props}>
      {title && (
        <Heading className="font-heading mb-1.5 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
          {icon && <ThemeIcon name={icon} />}
          {title}
        </Heading>
      )}
      <div className="text-[var(--color-text-soft)]">{children}</div>
    </Tag>
  )
}

export default Panel
