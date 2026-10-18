const THEME_SWATCHES = {
  lavender: '#a78bd8',
  sage: '#8fb89e',
  peach: '#f0a978',
  midnight: '#2b2a42',
}

function ThemeOptionButton({ themeName, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(themeName)}
      aria-pressed={isActive}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 capitalize transition-colors ${
        isActive
          ? 'border-[var(--color-primary)] bg-[var(--color-bg)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
      }`}
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 rounded-full border-2 border-[var(--color-border)]"
        style={{ backgroundColor: THEME_SWATCHES[themeName] }}
      />
      <span className="text-sm font-semibold text-[var(--color-text)]">{themeName}</span>
    </button>
  )
}

export default ThemeOptionButton
