import { useEffect, useRef, useState } from 'react'
import { CatSprite, SpecialSprite } from '../Sprite.jsx'

/**
 * Sprout Garden study space: a cat companion you can pet for a new tip.
 * The cat is a real button, so it works with keyboard and screen readers.
 */
function SproutScene({ tip, pats, onPat }) {
  const [excited, setExcited] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handlePat() {
    onPat()
    setExcited(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setExcited(false), 1100)
  }

  const pose = excited ? (pats % 5 === 0 ? 'cheer' : 'happy') : 'idle'

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <p
        role="status"
        aria-live="polite"
        className="sg-card w-full text-center text-sm font-semibold text-[var(--color-text)]"
      >
        {tip}
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={handlePat}
          aria-label="Pet your study buddy for a new tip"
          className="sg-cat-bob block rounded focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
          style={{ cursor: "url('/assets/sprout-garden/catpaw-pointing-mouse-icon.png') 5 1, pointer" }}
        >
          <CatSprite pose={pose} scale={5} />
        </button>
        {pats > 0 && (
          <span key={pats} className="heart-float pointer-events-none absolute -top-2 right-2">
            <SpecialSprite name="heart" scale={2} />
          </span>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-text)]">
        <SpecialSprite name="star" scale={1} />
        Pats given: {pats}
      </p>
    </div>
  )
}

export default SproutScene
