import { useEffect, useRef } from 'react'
import Button from './Button.jsx'

/** Native modal <dialog>: focus is trapped and Escape closes it for free. Never asks for an account. */
function StartPrompt({ onImport, onContinue, onDismiss }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby="start-prompt-title"
      onClose={onDismiss}
      onClick={(e) => e.target === ref.current && onDismiss()}
      className="m-auto w-[min(92vw,26rem)] rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-0 text-[var(--color-text)] shadow-[var(--theme-shadow)] backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2 id="start-prompt-title" className="font-heading text-xl font-bold">
          Bring in your coursework?
        </h2>
        <p className="mt-2 text-[var(--color-text-soft)]">
          Import a calendar file and SideQuest can suggest what to start first. It&apos;s optional, and nothing is
          uploaded or connected to an account.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={onImport}>Import my coursework</Button>
          <Button variant="secondary" onClick={onContinue}>
            Continue without importing
          </Button>
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-11 rounded-lg font-semibold text-[var(--color-text-soft)] underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Not now
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default StartPrompt
