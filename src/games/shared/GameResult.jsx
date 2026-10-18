import Button from '../../components/Button.jsx'

/**
 * End-of-round panel shared by every game. The message sits in a live region so
 * screen readers hear the outcome; Continue to Study Quest is the primary action.
 */
function GameResult({ headline, detail, canReplay, roundsPlayed, limit, onReplay, onContinue }) {
  const limited = Number.isFinite(limit)
  const atLimit = limited && roundsPlayed >= limit

  return (
    <div className="mt-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-4 text-center">
      <div role="status" aria-live="polite">
        <p className="font-heading text-xl font-bold text-[var(--color-text)]">{headline}</p>
        {detail && <p className="mt-1 text-[var(--color-text-soft)]">{detail}</p>}
        {atLimit && (
          <p className="mt-2 text-[var(--color-text-soft)]">
            That&apos;s your break for now — nice work. Ready for one small step?
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button onClick={onContinue}>Continue to Study Quest</Button>
        <Button variant="secondary" onClick={onReplay} disabled={!canReplay}>
          Play again
        </Button>
      </div>
      {limited && (
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          Round {Math.min(roundsPlayed, limit)} of {limit} for this break. You can change this in Settings.
        </p>
      )}
    </div>
  )
}

export default GameResult
