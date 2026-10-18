import { useEffect, useState } from 'react'
import { useSound } from '../../audio/SoundContext.jsx'
import GameResult from '../shared/GameResult.jsx'
import GameShell from '../shared/GameShell.jsx'

const GATES = 8

// Every colour also has a name and a distinct shape, so colour is never the only cue.
const COLORS = [
  { id: 'coral', name: 'Coral', shape: 'triangle', fill: '#f4a3a3' },
  { id: 'mint', name: 'Mint', shape: 'circle', fill: '#a8e0c4' },
  { id: 'sky', name: 'Sky', shape: 'square', fill: '#a9d4f5' },
  { id: 'gold', name: 'Gold', shape: 'star', fill: '#f6d78a' },
]

function Shape({ shape, fill, size = 28 }) {
  const common = { fill, stroke: '#1f1a2b', strokeWidth: 2 }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}>
      {shape === 'triangle' && <path d="M12 3 L22 21 H2 Z" {...common} strokeLinejoin="round" />}
      {shape === 'circle' && <circle cx="12" cy="12" r="9" {...common} />}
      {shape === 'square' && <rect x="3" y="3" width="18" height="18" rx="2" {...common} />}
      {shape === 'star' && (
        <path d="M12 2.5 L14.8 9 L21.8 9.6 L16.5 14.2 L18.1 21 L12 17.4 L5.9 21 L7.5 14.2 L2.2 9.6 L9.2 9 Z" {...common} strokeLinejoin="round" />
      )}
    </svg>
  )
}

function newCourse() {
  return Array.from({ length: GATES }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
}

function ColorHop({ headingRef, canReplay, roundsPlayed, limit, onRoundComplete, onContinue }) {
  const { sfx } = useSound()
  const [course, setCourse] = useState(newCourse)
  const [position, setPosition] = useState(0) // gates cleared
  const [bounces, setBounces] = useState(0)
  const [message, setMessage] = useState('Match the gate to start hopping.')
  const done = position >= GATES
  const gate = course[position]
  const next = course[position + 1]

  // Number keys 1-4 pick a colour from anywhere on the page.
  useEffect(() => {
    if (done) return undefined
    const onKey = (e) => {
      const idx = Number(e.key) - 1
      if (idx >= 0 && idx < COLORS.length && !e.ctrlKey && !e.metaKey && !e.altKey) choose(COLORS[idx])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function choose(color) {
    if (done) return
    if (color.id === gate.id) {
      const cleared = position + 1
      setPosition(cleared)
      sfx('correct')
      if (cleared >= GATES) {
        setMessage('You hopped through every gate!')
        sfx('win')
        onRoundComplete()
      } else {
        setMessage(`Hop! ${cleared} of ${GATES} gates cleared.`)
      }
    } else {
      setBounces((b) => b + 1)
      sfx('wrong')
      setMessage(`Bounced! That gate needs ${gate.name} (${gate.shape}). Try again.`)
    }
  }

  function replay() {
    setCourse(newCourse())
    setPosition(0)
    setBounces(0)
    setMessage('Match the gate to start hopping.')
    headingRef?.current?.focus()
  }

  return (
    <GameShell
      title="Color Hop"
      headingRef={headingRef}
      instructions={[
        'Your hopper must pass 8 gates. Each gate shows a colour, a shape and a name.',
        'Press the button that matches the gate. Wrong pick? It just bounces — try again.',
        'No timer. Keys 1 to 4 also work.',
      ]}
    >
      <p role="status" aria-live="polite" className="font-semibold text-[var(--color-text)]">
        {message}
      </p>

      <ol aria-label="Course progress" className="my-3 flex flex-wrap gap-1.5">
        {course.map((c, i) => (
          <li
            key={i}
            aria-current={i === position && !done ? 'step' : undefined}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 ${
              i < position
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                : i === position
                  ? 'border-[var(--color-text)] bg-[var(--color-card)]'
                  : 'border-[var(--color-border)] bg-[var(--color-game-surface)]'
            }`}
          >
            <span className="sr-only">{`Gate ${i + 1}, ${c.name} ${c.shape}, ${i < position ? 'cleared' : i === position ? 'current' : 'ahead'}`}</span>
            {i < position ? (
              <span aria-hidden="true" className="font-bold">
                ✓
              </span>
            ) : (
              <Shape shape={c.shape} fill={c.fill} size={22} />
            )}
          </li>
        ))}
      </ol>

      {!done && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-3 text-[var(--color-text)]">
            <span className="font-bold">Gate {position + 1} needs:</span>
            <span className="flex items-center gap-2 font-bold">
              <Shape shape={gate.shape} fill={gate.fill} />
              {gate.name} {gate.shape}
            </span>
            {next && (
              <span className="text-sm text-[var(--color-text-soft)]">
                Next up: {next.name} {next.shape}
              </span>
            )}
          </div>

          <div role="group" aria-label="Pick a colour" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {COLORS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c)}
                aria-keyshortcuts={String(i + 1)}
                className="flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#1f1a2b] px-3 py-2 font-bold text-[#1f1a2b] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                style={{ backgroundColor: c.fill }}
              >
                <Shape shape={c.shape} fill="#ffffff" size={22} />
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}

      {done && (
        <GameResult
          headline="Course complete!"
          detail={`You cleared all ${GATES} gates with ${bounces} bounce${bounces === 1 ? '' : 's'}.`}
          canReplay={canReplay}
          roundsPlayed={roundsPlayed}
          limit={limit}
          onReplay={replay}
          onContinue={onContinue}
        />
      )}
    </GameShell>
  )
}

export default ColorHop
