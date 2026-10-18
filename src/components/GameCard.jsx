import { useId } from 'react'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { getBest } from '../games/bestScores.js'
import Button from './Button.jsx'
import GameArt from './GameArt.jsx'
import Panel from './Panel.jsx'

const BEST_LABEL = { 'memory-garden': (n) => `Best: ${n} moves` }

function GameCard({ game, selected = false, disabled = false, level = 3, onPlay }) {
  const { theme } = useThemePreferences()
  const howToId = useId()
  const best = getBest(game.id)
  const bestText = best !== null && BEST_LABEL[game.id] ? BEST_LABEL[game.id](best) : null

  return (
    <Panel
      as="article"
      title={game.title}
      level={level}
      style={{ '--game-hue': game.hue }}
      className={`flex h-full w-full flex-col ${selected ? 'ring-2 ring-[var(--color-focus)] ring-offset-2' : ''}`}
    >
      <div
        className={`game-art mb-3 flex h-24 items-center justify-center ${theme === 'retro' ? '' : 'rounded-xl'}`}
      >
        <GameArt id={game.id} />
      </div>
      <p>{game.blurb}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
        {game.meta}
        {bestText && <span> · {bestText}</span>}
      </p>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer font-semibold text-[var(--color-text)] underline-offset-2 hover:underline">
          How to play
        </summary>
        <p id={howToId} className="mt-1">
          {game.howTo}
        </p>
      </details>
      <div className="mt-auto pt-4">
        <Button
          disabled={disabled}
          onClick={() => onPlay?.(game.id)}
          aria-label={`Play ${game.title}`}
          className="w-full"
        >
          Play
        </Button>
      </div>
    </Panel>
  )
}

export default GameCard
