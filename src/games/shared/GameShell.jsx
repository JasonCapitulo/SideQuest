import Panel from '../../components/Panel.jsx'

/**
 * Common frame for every game: title (focus target when a game opens), plain-language
 * instructions that are always visible, then the game itself.
 */
function GameShell({ title, instructions, headingRef, children }) {
  return (
    <Panel variant="panel" as="section" aria-labelledby="game-title" className="mx-auto max-w-2xl">
      <div className="px-1 py-2 sm:px-3">
        <h2
          id="game-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-heading text-2xl font-extrabold text-[var(--color-text)] focus:outline-none"
        >
          {title}
        </h2>
        <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-[var(--color-text-soft)]">How to play</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-[var(--color-text)]">
          {instructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mt-4">{children}</div>
      </div>
    </Panel>
  )
}

export default GameShell
