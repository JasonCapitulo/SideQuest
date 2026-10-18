import { useEffect, useRef, useState } from 'react'
import GameCard from '../components/GameCard.jsx'
import Button from '../components/Button.jsx'
import Panel from '../components/Panel.jsx'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { GAMES } from '../games/catalog.js'
import ColorHop from '../games/colorHop/ColorHop.jsx'
import FruitFlick from '../games/fruitFlick/FruitFlick.jsx'
import MemoryGarden from '../games/memoryGarden/MemoryGarden.jsx'
import StudyBuddyDuel from '../games/ticTacToe/StudyBuddyDuel.jsx'
import { useBreakRounds } from '../games/useBreakRounds.js'
import WhackASprout from '../games/whackASprout/WhackASprout.jsx'
import { ROUND_LIMITS } from '../theme/themes.js'

const GAME_COMPONENTS = {
  'tic-tac-toe': StudyBuddyDuel,
  'memory-garden': MemoryGarden,
  'whack-a-sprout': WhackASprout,
  'color-hop': ColorHop,
  'fruit-flick': FruitFlick,
}

/** The Arcade: pick a game, play a short finite round, then move on to Study Quest. */
function Games({ onNavigate, initialGame = null }) {
  const { roundLimit } = useThemePreferences()
  const limit = ROUND_LIMITS.find((r) => r.id === roundLimit)?.value ?? 3
  const { rounds, addRound, reset } = useBreakRounds()
  const [openId, setOpenId] = useState(initialGame)
  const gameHeadingRef = useRef(null)
  const arcadeHeadingRef = useRef(null)
  const lastOpened = useRef(null)

  const Game = openId ? GAME_COMPONENTS[openId] : null
  const breakOver = rounds >= limit

  // Move focus to the game title when a game opens, and back to the Arcade title when it closes.
  useEffect(() => {
    if (openId) gameHeadingRef.current?.focus()
  }, [openId])

  function open(id) {
    lastOpened.current = id
    setOpenId(id)
  }

  function close() {
    setOpenId(null)
    requestAnimationFrame(() => arcadeHeadingRef.current?.focus())
  }

  function goStudy() {
    reset()
    onNavigate('Study Quest', { from: 'game', transition: 'Nice reset! Off to Study Quest…' })
  }

  return (
    <section aria-labelledby="arcade-title" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1
        id="arcade-title"
        ref={arcadeHeadingRef}
        tabIndex={-1}
        className="font-heading text-center text-3xl font-extrabold text-[var(--color-text)] focus:outline-none"
      >
        Arcade
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-[var(--color-text-soft)]">
        Short games to help you shift gears. Each round is finite, then it&apos;s on to Study Quest.
      </p>

      {breakOver && !Game && (
        <Panel className="mt-3" title="Your break rounds are done" level={2}>
          <p>You&apos;ve played {Number.isFinite(limit) ? limit : 'your'} rounds. Ready for one small step?</p>
          <div className="mt-3">
            <Button onClick={goStudy}>Continue to Study Quest</Button>
          </div>
        </Panel>
      )}

      {Game ? (
        <div className="mt-3">
          <Button variant="secondary" onClick={close} className="mb-3">
            Back to Arcade
          </Button>
          <Game
            headingRef={gameHeadingRef}
            roundsPlayed={rounds}
            limit={limit}
            canReplay={rounds < limit}
            onRoundComplete={addRound}
            onContinue={goStudy}
          />
        </div>
      ) : (
        <ul className="mx-auto mt-8 grid max-w-4xl list-none grid-cols-1 justify-center gap-4 p-0 sm:grid-cols-2 lg:grid-cols-6">
          {GAMES.map((game) => (
            <li key={game.id} className="flex lg:col-span-2 lg:[&:nth-child(4)]:col-start-2">
              <GameCard game={game} level={2} disabled={breakOver} onPlay={open} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Games
