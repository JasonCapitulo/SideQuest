import GameCard from '../components/GameCard.jsx'
import StudySpace from '../components/StudySpace.jsx'
import ThemePreviewCard from '../components/ThemePreviewCard.jsx'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { GAMES } from '../games/catalog.js'
import { THEMES } from '../theme/themes.js'

function Home({ onNavigate }) {
  const { theme, setTheme, lowStimulation } = useThemePreferences()

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-4 sm:px-6">
      <StudySpace
        onQuickReset={() => onNavigate('Games')}
        onSkipToStudy={() => onNavigate('Study Quest')}
      />

      {!lowStimulation && (
        <>
          <section aria-labelledby="home-games">
            <h2 id="home-games" className="font-heading mb-2 text-xl font-extrabold text-[var(--color-text)]">
              Pick a game
            </h2>
            <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.map((game) => (
                <li key={game.id} className="flex">
                  <GameCard game={game} onPlay={(id) => onNavigate('Games', { game: id })} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="home-themes">
            <h2 id="home-themes" className="font-heading mb-2 text-xl font-extrabold text-[var(--color-text)]">
              Pick your vibe
            </h2>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {THEMES.map((option) => (
                <ThemePreviewCard
                  key={option.id}
                  compact
                  themeTheme={option}
                  isActive={theme === option.id}
                  onSelect={setTheme}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Home
