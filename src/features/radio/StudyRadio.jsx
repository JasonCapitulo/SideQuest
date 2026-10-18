import { useState } from 'react'
import { useSound } from '../../audio/SoundContext.jsx'
import BrandLogo from '../../components/BrandLogo.jsx'
import { parseSpotifyUrl } from '../spotify/spotifyUrl.js'
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
  const { spotify, playSpotify, lowStimulation } = useSound()
  const [link, setLink] = useState('')
  const [linkError, setLinkError] = useState('')
  const mood = MOODS.find((m) => m.id === moodId) ?? MOODS[0]
  const suggestion = mood.suggestions[index % mood.suggestions.length]

  function chooseMood(id) {
    setMoodId(id)
    setIndex(0)
  }

  function playLink(e) {
    e.preventDefault()
    const item = parseSpotifyUrl(link)
    if (!item) {
      setLinkError('That doesn’t look like a Spotify playlist, album or track link. Copy it from Spotify with Share, then Copy link.')
      return
    }
    setLinkError('')
    setLink('')
    playSpotify(item)
  }

  return (
    <Panel as="section" aria-label="Study radio" className="mt-6" id="study-radio">
      <details>
      <summary className="font-heading flex min-h-11 cursor-pointer items-center text-lg font-bold text-[var(--color-text)]">
        Study radio (optional)
      </summary>
      <p className="mt-2">Optional background music ideas. Nothing plays until you choose it, and you don&apos;t need a Spotify account to look.</p>

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

      <form onSubmit={playLink} className="mt-4 border-t-2 border-[var(--color-border)] pt-3">
        <div className="flex items-center gap-3">
          <BrandLogo brand="spotify" />
          <label htmlFor="spotify-link" className="font-semibold text-[var(--color-text)]">
            Play your own Spotify link
          </label>
        </div>
        <p id="spotify-hint" className="mt-1 text-sm text-[var(--color-text-soft)]">
          Paste a playlist, album or track link. Playing it pauses SideQuest sound.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id="spotify-link"
            type="url"
            inputMode="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            aria-describedby="spotify-hint spotify-link-status"
            aria-invalid={Boolean(linkError)}
            placeholder="https://open.spotify.com/playlist/…"
            className="min-h-11 min-w-0 flex-1 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 text-[var(--color-text)]"
          />
          <Button type="submit" disabled={!link.trim() || lowStimulation}>
            Play in SideQuest
          </Button>
        </div>
        <p id="spotify-link-status" role={linkError ? 'alert' : 'status'} className="mt-1 text-sm text-[var(--color-text)]">
          {linkError ||
            (lowStimulation
              ? 'The player is off while low-stimulation mode is on.'
              : spotify
                ? 'Spotify player is open at the bottom of the page.'
                : '')}
        </p>
      </form>
      </details>
    </Panel>
  )
}

export default StudyRadio
