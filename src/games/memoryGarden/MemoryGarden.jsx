import { useEffect, useRef, useState } from 'react'
import { Bug, Check, Droplets, Flower2, Leaf, Sprout, Sun } from 'lucide-react'
import { useSound } from '../../audio/SoundContext.jsx'
import { getBest, recordLowest } from '../bestScores.js'
import GameResult from '../shared/GameResult.jsx'
import GameShell from '../shared/GameShell.jsx'

// Card art lives in public/games/memoryPNGS (square images, white background). Each pair uses
// the same file twice; if one fails to load, the card falls back to its icon.
const PLANTS = [
  { id: 'seedling', name: 'Seedling', Icon: Sprout, src: '/games/memoryPNGS/seedling.png' },
  { id: 'flowering-pot', name: 'Flowering pot', Icon: Flower2, src: '/games/memoryPNGS/floweringpot.png' },
  { id: 'mushroom', name: 'Mushroom', Icon: Leaf, src: '/games/memoryPNGS/mushroom.png' },
  { id: 'sunflower', name: 'Sunflower', Icon: Sun, src: '/games/memoryPNGS/sunflower.png' },
  { id: 'ladybug', name: 'Ladybug', Icon: Bug, src: '/games/memoryPNGS/ladybug.png' },
  { id: 'watering-can', name: 'Watering can', Icon: Droplets, src: '/games/memoryPNGS/wateringcan.png' },
]

function newDeck() {
  const cards = PLANTS.flatMap((p) => [p, p]).map((p, i) => ({ key: i, ...p }))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards.map((c, i) => ({ ...c, key: i }))
}

function MemoryGarden({ headingRef, canReplay, roundsPlayed, limit, onRoundComplete, onContinue }) {
  const { sfx } = useSound()
  const [deck, setDeck] = useState(newDeck)
  const [faceUp, setFaceUp] = useState([]) // keys currently turned over (max 2)
  const [matched, setMatched] = useState([]) // plant ids found
  const [moves, setMoves] = useState(0)
  const [failed, setFailed] = useState([]) // plant ids whose image did not load
  const [best, setBest] = useState(() => getBest('memory-garden'))
  const [message, setMessage] = useState('Turn over any card to begin.')
  const lockRef = useRef(false)
  const timerRef = useRef(null)
  const done = matched.length === PLANTS.length

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function flip(card) {
    if (lockRef.current || done || faceUp.includes(card.key) || matched.includes(card.id)) return
    sfx('flip')
    const next = [...faceUp, card.key]
    setFaceUp(next)
    if (next.length < 2) {
      setMessage(`${card.name}. Now find its pair.`)
      return
    }
    const [a, b] = next.map((k) => deck.find((c) => c.key === k))
    setMoves((m) => m + 1)
    if (a.id === b.id) {
      const found = [...matched, a.id]
      setMatched(found)
      setFaceUp([])
      sfx('correct')
      if (found.length === PLANTS.length) {
        recordLowest('memory-garden', moves + 1)
        setBest(getBest('memory-garden'))
        setMessage('You found every pair!')
        sfx('win')
        onRoundComplete()
      } else {
        setMessage(`Match! ${a.name} pair found. ${found.length} of ${PLANTS.length}.`)
      }
    } else {
      lockRef.current = true
      setMessage(`${a.name} and ${b.name} don't match. No worries — try again.`)
      sfx('wrong')
      timerRef.current = setTimeout(() => {
        setFaceUp([])
        lockRef.current = false
      }, 1200)
    }
  }

  function replay() {
    clearTimeout(timerRef.current)
    lockRef.current = false
    setDeck(newDeck())
    setFaceUp([])
    setMatched([])
    setMoves(0)
    setMessage('Turn over any card to begin.')
    headingRef?.current?.focus()
  }

  return (
    <GameShell
      title="Memory Garden"
      headingRef={headingRef}
      instructions={[
        'Turn over two cards at a time to find the matching plants.',
        'There are 6 pairs. There is no timer — take as long as you like.',
        'Use Tab and Enter (or tap) to turn a card.',
      ]}
    >
      <p role="status" aria-live="polite" className="mb-3 font-semibold text-[var(--color-text)]">
        {message}
      </p>
      <p className="mb-3 text-sm text-[var(--color-text-soft)]">
        Moves: {moves} · Pairs found: {matched.length} of {PLANTS.length}
        {best !== null && ` · Best: ${best} moves`}
      </p>

      <div role="group" aria-label="Memory cards" className="mx-auto grid max-w-md grid-cols-3 gap-3 sm:grid-cols-4 sm:max-w-lg">
        {deck.map((card, i) => {
          const shown = faceUp.includes(card.key) || matched.includes(card.id)
          const isMatched = matched.includes(card.id)
          const useImage = !failed.includes(card.id)
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => flip(card)}
              aria-disabled={isMatched}
              aria-label={shown ? `${card.name}, card ${i + 1}${isMatched ? ', matched' : ''}` : `Card ${i + 1}, face down`}
              className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 p-1.5 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                shown
                  ? `bg-white text-[#23361f] ${isMatched ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]' : 'border-[var(--color-border)]'}`
                  : 'mg-back border-[var(--color-border)] text-[var(--color-text)]'
              }`}
            >
              {shown ? (
                <>
                  {useImage ? (
                    <img
                      src={card.src}
                      alt=""
                      draggable="false"
                      onError={() => setFailed((f) => (f.includes(card.id) ? f : [...f, card.id]))}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <card.Icon size={36} aria-hidden="true" />
                  )}
                  {isMatched && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </>
              ) : (
                <Sprout size={28} aria-hidden="true" className="opacity-70" />
              )}
            </button>
          )
        })}
      </div>

      {done && (
        <GameResult
          headline="Garden complete!"
          detail={`You matched all ${PLANTS.length} pairs in ${moves} moves.`}
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

export default MemoryGarden
