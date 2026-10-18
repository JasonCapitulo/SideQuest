import Button from './Button.jsx'
import Panel from './Panel.jsx'

function GameCard({ game, selected = false, onPlay }) {
  return (
    <Panel
      as="article"
      title={game.title}
      icon={game.icon}
      className={`flex h-full flex-col ${selected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}
    >
      <p>{game.blurb}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide">{game.meta}</p>
      <div className="mt-auto pt-4">
        <Button
          variant={game.playable ? 'primary' : 'secondary'}
          disabled={!game.playable}
          onClick={() => onPlay?.(game.id)}
          aria-label={game.playable ? `Play ${game.title}` : `${game.title} is coming soon`}
          className="w-full"
        >
          {game.playable ? (selected ? 'Playing' : 'Play') : 'Locked'}
        </Button>
      </div>
    </Panel>
  )
}

export default GameCard
