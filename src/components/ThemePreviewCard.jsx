import { Check } from 'lucide-react'

/**
 * Swatch-only preview of a theme. It deliberately uses no theme artwork, so a
 * theme's image assets never leak into the others.
 */
function ThemePreviewCard({ themeTheme, isActive, onSelect, compact = false }) {
  const { id, name, description, swatches } = themeTheme

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={isActive}
      className={`flex flex-col text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
        compact ? 'gap-2 p-2' : 'gap-3 p-3'
      } rounded-2xl border-[3px] ${
        isActive ? 'border-[var(--color-text)]' : 'border-[var(--color-border)]'
      }`}
      style={{ backgroundColor: swatches.bg, color: swatches.text }}
    >
      <div
        className={`flex items-center justify-between rounded-xl border-2 p-2 ${compact ? 'h-10' : 'h-16'}`}
        style={{ backgroundColor: swatches.surface, borderColor: swatches.accent }}
        aria-hidden="true"
      >
        <span
          className={`rounded-full ${compact ? 'h-5 w-5' : 'h-7 w-7'}`}
          style={{ backgroundColor: swatches.primary }}
        />
        <span
          className={`rounded-full ${compact ? 'h-3 w-3' : 'h-5 w-5'}`}
          style={{ backgroundColor: swatches.accent }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`font-bold ${compact ? 'text-sm' : ''}`}>{name}</span>
          {isActive && <Check size={18} className="shrink-0" aria-label="Selected" />}
        </div>
        {!compact && <p className="mt-1 text-xs opacity-80">{description}</p>}
      </div>
    </button>
  )
}

export default ThemePreviewCard
