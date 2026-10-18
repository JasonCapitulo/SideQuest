import { useCallback, useEffect, useRef, useState } from 'react'
import { useSound } from '../../audio/SoundContext.jsx'
import Button from '../../components/Button.jsx'
import { useThemePreferences } from '../../context/ThemeContext.jsx'
import GameResult from '../shared/GameResult.jsx'
import GameShell from '../shared/GameShell.jsx'

const TOTAL = 12
const AREA_H = 300
const RADIUS = 34
const FLIGHT_MS = { slow: 4200, normal: 2800 }
const SPAWN_MS = { slow: 1500, normal: 1100 }

// Original SVG fruit. Each has a distinct silhouette and a name, not just a colour.
const FRUITS = [
  { id: 'apple', name: 'apple' },
  { id: 'orange', name: 'orange' },
  { id: 'lemon', name: 'lemon' },
]

function FruitArt({ id, size = 64 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width={size} height={size}>
      {id === 'apple' && (
        <>
          <path d="M32 18 C14 10 6 30 12 44 C16 54 26 58 32 54 C38 58 48 54 52 44 C58 30 50 10 32 18 Z" fill="#e0483f" stroke="#7a1f1a" strokeWidth="3" strokeLinejoin="round" />
          <path d="M32 18 C32 12 34 8 38 6" stroke="#5a3a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M36 12 C42 6 50 8 50 12 C44 16 38 15 36 12 Z" fill="#4f9a45" stroke="#2f5f2b" strokeWidth="2" />
        </>
      )}
      {id === 'orange' && (
        <>
          <circle cx="32" cy="34" r="22" fill="#f59a2f" stroke="#8a4a0e" strokeWidth="3" />
          <g fill="#c9741a">
            <circle cx="24" cy="28" r="1.6" />
            <circle cx="38" cy="26" r="1.6" />
            <circle cx="30" cy="40" r="1.6" />
            <circle cx="42" cy="38" r="1.6" />
          </g>
          <path d="M30 12 C34 8 40 8 42 12 C38 16 32 16 30 12 Z" fill="#4f9a45" stroke="#2f5f2b" strokeWidth="2" />
        </>
      )}
      {id === 'lemon' && (
        <>
          <path d="M6 34 C12 18 26 14 34 14 C48 14 58 22 58 34 C58 46 48 52 34 52 C22 52 12 48 6 34 Z" fill="#f4dc3c" stroke="#8a7a0a" strokeWidth="3" strokeLinejoin="round" />
          <path d="M6 34 L1 33 M58 34 L63 35" stroke="#8a7a0a" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

function pickFruit(i) {
  return FRUITS[i % FRUITS.length]
}

function FruitFlick({ headingRef, canReplay, roundsPlayed, limit, onRoundComplete, onContinue }) {
  const { sfx } = useSound()
  const { prefersReducedMotion } = useThemePreferences()
  const [mode, setMode] = useState(prefersReducedMotion ? 'keys' : 'swipe')
  const [speed, setSpeed] = useState('slow')
  const [phase, setPhase] = useState('idle')
  const [score, setScore] = useState(0)
  const [handled, setHandled] = useState(0) // fruits sliced or missed
  const [fruits, setFruits] = useState([]) // swipe mode: { id, kind, x, born, sliced }
  const [now, setNow] = useState(0)
  const [message, setMessage] = useState('')
  const areaRef = useRef(null)
  const pressedRef = useRef(false)
  const spawnedRef = useRef(0)
  const doneRef = useRef(false)
  const fruitsRef = useRef([])

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setPhase('done')
    sfx('win')
    onRoundComplete()
  }, [onRoundComplete, sfx])

  function start() {
    doneRef.current = false
    spawnedRef.current = 0
    fruitsRef.current = []
    setScore(0)
    setHandled(0)
    setFruits([])
    setMessage(mode === 'keys' ? 'Slice the fruit shown below.' : 'Swipe across the fruit, or tap it.')
    setPhase('playing')
  }

  // ----- swipe mode: spawn and animate -----
  // The ref is the source of truth; `fruits` state is a per-frame snapshot for rendering.
  useEffect(() => {
    if (phase !== 'playing' || mode !== 'swipe') return undefined
    let raf
    const loop = () => {
      const t = performance.now()
      let missed = 0
      fruitsRef.current = fruitsRef.current.filter((f) => {
        if (f.sliced) return t - f.slicedAt < 350
        if (t - f.born > FLIGHT_MS[speed]) {
          missed += 1
          return false
        }
        return true
      })
      if (missed) setHandled((h) => h + missed)
      setNow(t)
      setFruits(fruitsRef.current.slice())
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const spawn = setInterval(() => {
      if (spawnedRef.current >= TOTAL) return
      const i = spawnedRef.current++
      const width = areaRef.current?.clientWidth ?? 320
      fruitsRef.current.push({
        id: i,
        kind: pickFruit(i).id,
        x: 60 + Math.random() * Math.max(40, width - 120),
        born: performance.now(),
        sliced: false,
      })
    }, SPAWN_MS[speed])
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(spawn)
    }
  }, [phase, mode, speed])

  // Round ends when all fruit have been handled.
  useEffect(() => {
    if (phase === 'playing' && handled >= TOTAL) finish()
  }, [phase, handled, finish])

  const slice = useCallback(
    (fruit) => {
      if (fruit.sliced) return
      fruit.sliced = true
      fruit.slicedAt = performance.now()
      sfx('slice')
      setScore((s) => s + 1)
      setHandled((h) => h + 1)
    },
    [sfx],
  )

  function fruitPos(f) {
    const p = Math.min(1, (now - f.born) / FLIGHT_MS[speed])
    // parabola: rises to the top then falls
    const y = AREA_H - 40 - 4 * (AREA_H - 90) * p * (1 - p)
    return { x: f.x, y }
  }

  function trySlice(clientX, clientY) {
    const rect = areaRef.current.getBoundingClientRect()
    const px = clientX - rect.left
    const py = clientY - rect.top
    fruitsRef.current.forEach((f) => {
      if (f.sliced) return
      const { x, y } = fruitPos(f)
      if (Math.hypot(px - x, py - y) < RADIUS) slice(f)
    })
  }

  // ----- keys mode: one fruit at a time -----
  function sliceCurrent() {
    sfx('slice')
    setScore((s) => s + 1)
    const next = handled + 1
    setHandled(next)
    setMessage(
      next >= TOTAL
        ? 'All fruit sliced!'
        : `Sliced the ${pickFruit(handled).name}. ${next} of ${TOTAL}.`,
    )
  }

  const current = pickFruit(handled)

  return (
    <GameShell
      title="Fruit Flick"
      headingRef={headingRef}
      instructions={[
        'Slice 12 fruits. Swipe across a fruit, or just tap or click it.',
        'Prefer a keyboard or no moving targets? Choose "One at a time" and press the Slice button.',
        'Missed fruit never costs you anything. There is no timer.',
      ]}
    >
      {phase === 'idle' && (
        <fieldset className="mb-4 space-y-3">
          <legend className="font-bold text-[var(--color-text)]">Round options</legend>
          <label className="flex items-center gap-2 text-[var(--color-text)]">
            <input type="radio" name="fruit-mode" checked={mode === 'swipe'} onChange={() => setMode('swipe')} className="h-6 w-6 shrink-0 accent-[var(--color-primary)]" />
            Swipe or tap fruit as it floats by
          </label>
          <label className="flex items-center gap-2 text-[var(--color-text)]">
            <input type="radio" name="fruit-mode" checked={mode === 'keys'} onChange={() => setMode('keys')} className="h-6 w-6 shrink-0 accent-[var(--color-primary)]" />
            One at a time: press a button (keyboard friendly)
          </label>
          {mode === 'swipe' && (
            <label className="flex items-center gap-2 text-[var(--color-text)]">
              Fruit speed
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="min-h-11 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-card)] px-2 text-[var(--color-text)]"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
              </select>
            </label>
          )}
          <div>
            <Button onClick={start}>Start round</Button>
          </div>
        </fieldset>
      )}

      {phase !== 'idle' && (
        <p role="status" aria-live="polite" className="mb-2 font-semibold text-[var(--color-text)]">
          {phase === 'done' ? 'Round finished.' : message}
        </p>
      )}
      {phase !== 'idle' && (
        <p className="mb-2 text-sm text-[var(--color-text-soft)]">
          Sliced: {score} · Fruit handled: {Math.min(handled, TOTAL)} of {TOTAL}
        </p>
      )}

      {phase === 'playing' && mode === 'swipe' && (
        <div
          ref={areaRef}
          aria-label="Fruit play area. Swipe or tap fruit to slice it. Keyboard users can restart and choose One at a time."
          role="group"
          className="relative touch-none select-none overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-game-surface)]"
          style={{ height: AREA_H }}
          onPointerDown={(e) => {
            pressedRef.current = true
            trySlice(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => pressedRef.current && trySlice(e.clientX, e.clientY)}
          onPointerUp={() => (pressedRef.current = false)}
          onPointerLeave={() => (pressedRef.current = false)}
        >
          {fruits.map((f) => {
            const { x, y } = fruitPos(f)
            return (
              <div
                key={f.id}
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{ left: x - 32, top: y - 32, opacity: f.sliced ? 0.35 : 1, transform: f.sliced ? 'scale(1.2)' : 'none' }}
              >
                <FruitArt id={f.kind} />
              </div>
            )
          })}
        </div>
      )}

      {phase === 'playing' && mode === 'keys' && handled < TOTAL && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-game-surface)] p-4">
          <FruitArt id={current.id} size={96} />
          <Button onClick={sliceCurrent}>Slice the {current.name}</Button>
        </div>
      )}

      {phase === 'done' && (
        <GameResult
          headline="Fruit all handled!"
          detail={`You sliced ${score} of ${TOTAL} fruits.`}
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

export default FruitFlick
