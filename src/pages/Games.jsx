import { useState } from 'react'
import GameCard from '../components/GameCard.jsx'
import StudyBuddyDuel from '../games/ticTacToe/StudyBuddyDuel.jsx'
import { GAMES } from '../games/catalog.js'

function Games({ onNavigate }) {
  const [selectedId, setSelectedId] = useState('study-buddy-duel')

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
        Quick Reset Games
      </h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            selected={selectedId === game.id}
            onPlay={setSelectedId}
          />
        ))}
      </div>

      {selectedId === 'study-buddy-duel' && (
        <StudyBuddyDuel
          onContinueToStudyQuest={() =>
            onNavigate('Study Quest', { from: 'game', transition: 'Reset complete! Off to Study Quest…' })
          }
        />
      )}
    </section>
  )
}

export default Games
