const MARK_EMOJI = { X: '🌸', O: '🍃' }

function Cell({ value, onPlay, disabled, isWinningCell, index }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(index)}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell ${index + 1}, filled with ${value}` : `Cell ${index + 1}, empty`}
      className={`flex aspect-square items-center justify-center rounded-xl border-2 text-3xl font-extrabold transition-colors sm:text-4xl ${
        isWinningCell
          ? 'border-[var(--color-primary)] bg-[var(--color-accent)]/50'
          : 'border-[var(--color-border)] bg-[var(--color-surface)]'
      } focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed enabled:hover:bg-[var(--color-bg)]`}
    >
      {value && (
        <span aria-hidden="true" className="float-bob">
          {MARK_EMOJI[value]}
        </span>
      )}
    </button>
  )
}

export default Cell
