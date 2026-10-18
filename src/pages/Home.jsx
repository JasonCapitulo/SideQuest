import GameCard from '../components/GameCard.jsx'
import StudySpace from '../components/StudySpace.jsx'
import ThemePreviewCard from '../components/ThemePreviewCard.jsx'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { GAMES } from '../games/catalog.js'
import { THEMES } from '../theme/themes.js'

function Home({ onNavigate }) {
  const { theme, setTheme } = useThemePreferences()

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 sm:px-6">
      <StudySpace
        onQuickReset={() => onNavigate('Games')}
        onSkipToStudy={() => onNavigate('Study Quest')}
      />

      <section aria-labelledby="home-games">
        <h2 id="home-games" className="font-heading mb-3 text-xl font-extrabold text-[var(--color-text)]">
          Pick a game
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} onPlay={() => onNavigate('Games')} />
          ))}
        </div>
      </section>

      <section aria-labelledby="home-themes">
        <h2 id="home-themes" className="font-heading mb-3 text-xl font-extrabold text-[var(--color-text)]">
          Pick your vibe
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
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
    </div>
  )
}

export default Home
