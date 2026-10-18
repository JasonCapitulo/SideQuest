import { useCallback, useEffect, useRef, useState } from 'react'
import { Sprout } from 'lucide-react'
import { useSound } from '../../audio/SoundContext.jsx'
import Button from '../../components/Button.jsx'
import GameResult from '../shared/GameResult.jsx'
import GameShell from '../shared/GameShell.jsx'

const HOLES = 9
const TOTAL_SPROUTS = 12
const TIMED_SECONDS = 30
const SPEEDS = { slow: 2200, normal: 1400 }

function WhackASprout({ headingRef, canReplay, roundsPlayed, limit, onRoundComplete, onContinue }) {
  const { sfx } = useSound()
  const [mode, setMode] = useState('steps') // 'steps' (untimed) | 'timed'
  const [speed, setSpeed] = useState('slow')
  const [phase, setPhase] = useState('idle') // idle | playing | done
  const [active, setActive] = useState(null)
  const [score, setScore] = useState(0)
  const [spawned, setSpawned] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS)
  const [tick, setTick] = useState(0)
  const spawnedRef = useRef(0)
  const prevHole = useRef(-1)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setActive(null)
    setPhase('done')
    sfx('win')
    onRoundComplete()
  }, [onRoundComplete, sfx])

  function start() {
    doneRef.current = false
    spawnedRef.current = 0
    prevHole.current = -1
    setScore(0)
    setSpawned(0)
    setActive(null)
    setTimeLeft(TIMED_SECONDS)
    setTick(0)
    setPhase('playing')
  }

  // Schedules one sprout at a time: wait, show it, hide it, repeat.
  useEffect(() => {
    if (phase !== 'playing') return undefined
    let hideTimer
    const showTimer = setTimeout(() => {
      let hole = Math.floor(Math.random() * HOLES)
      if (hole === prevHole.current) hole = (hole + 1) % HOLES
      prevHole.current = hole
      spawnedRef.current += 1
      setSpawned(spawnedRef.current)
      setActive(hole)
      hideTimer = setTimeout(() => {
        setActive(null)
        if (mode === 'steps' && spawnedRef.current >= TOTAL_SPROUTS) finish()
        else setTick((k) => k + 1)
      }, SPEEDS[speed])
    }, 600)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [phase, tick, mode, speed, finish])

  // Optional gentle timer (off by default).
  useEffect(() => {
    if (phase !== 'playing' || mode !== 'timed') return undefined
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          finish()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, mode, finish])

  const whack = useCallback(
    (hole) => {
      if (phase !== 'playing') return
      if (hole === active) {
        sfx('pop')
        setScore((s) => s + 1)
        setActive(null)
        if (mode === 'steps' && spawnedRef.current >= TOTAL_SPROUTS) finish()
        else setTick((k) => k + 1)
      }
    },
    [phase, active, mode, sfx, finish],
  )

  // Number keys 1-9 map to the holes as a shortcut (buttons also work).
  useEffect(() => {
    if (phase !== 'playing') return undefined
    const onKey = (e) => {
      if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) whack(Number(e.key) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, whack])

  return (
    <GameShell
      title="Whack-a-Sprout"
      headingRef={headingRef}
      instructions={[
        'A sprout pops up in one of nine holes. Press or tap its hole before it hides.',
        'Missing is fine — nothing bad happens. Keys 1 to 9 also work.',
        'By default there is no timer: the round ends after 12 sprouts.',
      ]}
    >
      {phase === 'idle' && (
        <fieldset className="mb-4 space-y-3">
          <legend className="font-bold text-[var(--color-text)]">Round options</legend>
          <label className="flex items-center gap-2 text-[var(--color-text)]">
            <input
              type="radio"
              name="whack-mode"
              checked={mode === 'steps'}
              onChange={() => setMode('steps')}
              className="h-6 w-6 shrink-0 accent-[var(--color-primary)]"
            />
            Relaxed: 12 sprouts, no timer
          </label>
          <label className="flex items-center gap-2 text-[var(--color-text)]">
            <input
              type="radio"
              name="whack-mode"
              checked={mode === 'timed'}
              onChange={() => setMode('timed')}
              className="h-6 w-6 shrink-0 accent-[var(--color-primary)]"
            />
            Timed: {TIMED_SECONDS} seconds
          </label>
          <label className="flex items-center gap-2 text-[var(--color-text)]">
            Sprout speed
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="min-h-11 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-card)] px-2 text-[var(--color-text)]"
            >
              <option value="slow">Slow (stays longer)</option>
              <option value="normal">Normal</option>
            </select>
          </label>
        </fieldset>
      )}

      {phase !== 'idle' && (
        <p className="mb-3 font-semibold text-[var(--color-text)]" aria-live="off">
          Score: {score}
          {mode === 'steps' ? ` · Sprout ${Math.min(spawned, TOTAL_SPROUTS)} of ${TOTAL_SPROUTS}` : ` · Time left: ${timeLeft}s`}
        </p>
      )}

      {phase === 'idle' && (
        <Button onClick={start} disabled={roundsPlayed >= limit}>
          Start round
        </Button>
      )}

      {phase !== 'idle' && (
        <div role="group" aria-label="Sprout holes" className="grid max-w-sm grid-cols-3 gap-2">
          {Array.from({ length: HOLES }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => whack(i)}
              disabled={phase === 'done'}
              aria-keyshortcuts={String(i + 1)}
              aria-label={`Hole ${i + 1}${active === i ? ', sprout is up' : ''}`}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 text-sm font-bold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                active === i
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-game-surface)] text-[var(--color-text-soft)]'
              }`}
            >
              {active === i ? <Sprout size={32} aria-hidden="true" /> : <span aria-hidden="true">{i + 1}</span>}
            </button>
          ))}
        </div>
      )}

      {phase === 'done' && (
        <GameResult
          headline="Round complete!"
          detail={`You whacked ${score} sprouts.`}
          canReplay={canReplay}
          roundsPlayed={roundsPlayed}
          limit={limit}
          onReplay={() => {
            setPhase('idle')
            headingRef?.current?.focus()
          }}
          onContinue={onContinue}
        />
      )}
    </GameShell>
  )
}

export default WhackASprout
