import { useEffect, useRef, useState } from 'react'
import { Cherry, Clover, Flower2, Leaf, Sprout, TreePine } from 'lucide-react'
import { useSound } from '../../audio/SoundContext.jsx'
import GameResult from '../shared/GameResult.jsx'
import GameShell from '../shared/GameShell.jsx'

const PLANTS = [
  { id: 'sprout', name: 'Sprout', Icon: Sprout },
  { id: 'flower', name: 'Flower', Icon: Flower2 },
  { id: 'leaf', name: 'Leaf', Icon: Leaf },
  { id: 'tree', name: 'Pine tree', Icon: TreePine },
  { id: 'clover', name: 'Clover', Icon: Clover },
  { id: 'cherry', name: 'Cherries', Icon: Cherry },
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
      </p>

      <div role="group" aria-label="Memory cards" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((card, i) => {
          const shown = faceUp.includes(card.key) || matched.includes(card.id)
          const isMatched = matched.includes(card.id)
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => flip(card)}
              aria-disabled={isMatched}
              aria-label={shown ? `${card.name}, card ${i + 1}${isMatched ? ', matched' : ''}` : `Card ${i + 1}, face down`}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-sm font-bold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                shown
                  ? 'border-[var(--color-primary)] bg-[var(--color-card)] text-[var(--color-text)]'
                  : 'border-[var(--color-border)] bg-[var(--color-game-surface)] text-[var(--color-text-soft)]'
              } ${isMatched ? 'border-dashed' : ''}`}
            >
              {shown ? (
                <>
                  <card.Icon size={28} aria-hidden="true" />
                  <span>{card.name}</span>
                </>
              ) : (
                <span aria-hidden="true" className="text-2xl">
                  ?
                </span>
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
