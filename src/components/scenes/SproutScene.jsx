import { useEffect, useRef, useState } from 'react'
import { Heart, Star } from 'lucide-react'
import Companion from '../Companion.jsx'

/**
 * Sprout Garden study space: a seedling companion you can pet for a new tip.
 * The companion is a real button, so it works with keyboard and screen readers.
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
    <div className="flex flex-col items-center gap-2 p-1">
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
          className="sg-companion block rounded-2xl p-1 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          <Companion pose={pose} size={104} />
        </button>
        {pats > 0 && (
          <span key={pats} className="heart-float pointer-events-none absolute -top-1 right-1">
            <Heart size={20} fill="#e8707f" color="#a8404f" aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-text)]">
        <Star size={14} fill="#f2c14e" color="#9a7a1c" aria-hidden="true" />
        Pats given: {pats}
      </p>
    </div>
  )
}

export default SproutScene
