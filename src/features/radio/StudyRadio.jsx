import { useState } from 'react'
import { ExternalLink, RefreshCw } from 'lucide-react'
import Button from '../../components/Button.jsx'
import Panel from '../../components/Panel.jsx'
import TabButton from '../../components/TabButton.jsx'
import { useThemePreferences } from '../../context/ThemeContext.jsx'
import { DEFAULT_MOOD_BY_THEME, MOODS, nextSuggestionIndex, spotifySearchUrl } from './playlists.js'

function StudyRadio() {
  const { theme } = useThemePreferences()
  const [moodId, setMoodId] = useState(DEFAULT_MOOD_BY_THEME[theme] ?? MOODS[0].id)
  const [index, setIndex] = useState(0)
  const mood = MOODS.find((m) => m.id === moodId) ?? MOODS[0]
  const suggestion = mood.suggestions[index % mood.suggestions.length]

  function chooseMood(id) {
    setMoodId(id)
    setIndex(0)
  }

  return (
    <Panel as="section" aria-label="Study radio" title="Study radio" icon="motion" level={2} className="mt-6" id="study-radio">
      <p>Optional background music ideas. Nothing plays here, and you don&apos;t need a Spotify account to look.</p>

      <div role="radiogroup" aria-label="Music mood" className="mt-3 flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <TabButton
            key={m.id}
            role="radio"
            aria-checked={m.id === moodId}
            selected={m.id === moodId}
            onClick={() => chooseMood(m.id)}
          >
            {m.label}
          </TabButton>
        ))}
      </div>

      <div role="status" aria-live="polite" className="mt-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-game-surface)] p-3">
        <p className="font-bold text-[var(--color-text)]">{suggestion.title}</p>
        <p className="text-sm text-[var(--color-text-soft)]">{suggestion.description}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setIndex((i) => nextSuggestionIndex(mood.suggestions.length, i % mood.suggestions.length))}>
          <RefreshCw size={18} aria-hidden="true" />
          Regenerate suggestion
        </Button>
        <a
          href={spotifySearchUrl(suggestion.query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-primary)] px-5 py-2.5 font-bold text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Find on Spotify
          <ExternalLink size={18} aria-hidden="true" />
          <span className="sr-only">(opens Spotify search in a new tab)</span>
        </a>
      </div>
    </Panel>
  )
}

export default StudyRadio
