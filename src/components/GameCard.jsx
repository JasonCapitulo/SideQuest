import Button from './Button.jsx'
import Panel from './Panel.jsx'

function GameCard({ game, selected = false, disabled = false, level = 3, onPlay }) {
  return (
    <Panel
      as="article"
      title={game.title}
      icon={game.icon}
      level={level}
      className={`flex h-full w-full flex-col ${selected ? 'ring-2 ring-[var(--color-focus)] ring-offset-2' : ''}`}
    >
      <p>{game.blurb}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide">{game.meta}</p>
      <div className="mt-auto pt-3">
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
