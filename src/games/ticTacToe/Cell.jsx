import { Flower2, Leaf } from 'lucide-react'
import { SpecialSprite } from '../../components/Sprite.jsx'
import { useThemePreferences } from '../../context/ThemeContext.jsx'

const MARK_ICON = { X: Flower2, O: Leaf }
// Sprout Garden draws the marks with the kit's star and heart.
const SPROUT_MARK = { X: 'star', O: 'heart' }

function Cell({ value, onPlay, disabled, isWinningCell, index }) {
  const { theme } = useThemePreferences()
  const isSprout = theme === 'sprout'
  const MarkIcon = value ? MARK_ICON[value] : null

  const look = isSprout
    ? `sg-cell ${isWinningCell ? 'sg-cell--win win-pulse' : ''}`
    : `rounded-xl border-2 transition-colors ${
        isWinningCell
          ? 'win-pulse border-[var(--color-primary)] bg-[var(--color-accent)]/50'
          : 'border-[var(--color-border)] bg-[var(--color-surface)]'
      } enabled:hover:border-[var(--color-primary)] enabled:hover:bg-[var(--color-bg)]`

  return (
    <button
      type="button"
      onClick={() => onPlay(index)}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell ${index + 1}, filled with ${value}` : `Cell ${index + 1}, empty`}
      className={`flex aspect-square items-center justify-center focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed ${look}`}
    >
      {value && isSprout && <SpecialSprite name={SPROUT_MARK[value]} scale={4} className="pop-in" />}
      {value && !isSprout && MarkIcon && (
        <MarkIcon
          aria-hidden="true"
          size={32}
          className="pop-in"
          style={{ color: value === 'X' ? 'var(--color-primary)' : 'var(--color-secondary)' }}
        />
      )}
    </button>
  )
}

export default Cell
