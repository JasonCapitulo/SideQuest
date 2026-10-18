import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react'
import { useSound } from '../../audio/SoundContext.jsx'
import BrandLogo from '../../components/BrandLogo.jsx'
import Button from '../../components/Button.jsx'
import { parseSpotifyUrl } from './spotifyUrl.js'

/**
 * Spotify's official embed. It plays inside Spotify's own iframe, so SideQuest cannot see or control playback:
 * it only mounts the iframe for the user's chosen link and unmounts it (Close, or Low-Stimulation Mode) to stop it.
 */
function SpotifyPlayer() {
  const { spotify, playSpotify, closeSpotify, lowStimulation } = useSound()
  const [collapsed, setCollapsed] = useState(false)
  const [editing, setEditing] = useState(false)
  const [link, setLink] = useState('')
  const [linkError, setLinkError] = useState('')
  const [slow, setSlow] = useState(false)
  const editRef = useRef(null)
  const embedUrl = spotify?.embedUrl

  // The iframe can't report errors, so if it hasn't loaded after a while, say so and offer the direct link.
  useEffect(() => {
    if (!embedUrl) return undefined
    const t = setTimeout(() => setSlow(true), 8000)
    return () => {
      clearTimeout(t)
      setSlow(false)
    }
  }, [embedUrl])

  useEffect(() => {
    if (editing) editRef.current?.focus()
  }, [editing])

  if (!spotify || lowStimulation) return null
  const height = spotify.type === 'track' ? 152 : 232

  function submit(e) {
    e.preventDefault()
    const item = parseSpotifyUrl(link)
    if (!item) {
      setLinkError('That isn’t a valid Spotify track, album or playlist link. Use Share, then Copy link, in Spotify.')
      return
    }
    setLinkError('')
    setLink('')
    setEditing(false)
    setCollapsed(false)
    playSpotify(item)
  }

  const btn = '!px-3 !py-2 text-sm'
  return (
    <section aria-label="Spotify player" className="relative z-10 border-t-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <BrandLogo brand="spotify" size={36} />
          <p className="mr-auto font-bold text-[var(--color-text)]">Spotify</p>
          <Button variant="secondary" className={btn} aria-expanded={!collapsed} onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
            {collapsed ? 'Expand' : 'Collapse'}
          </Button>
          <Button variant="secondary" className={btn} aria-expanded={editing} onClick={() => setEditing((v) => !v)}>
            Change link
          </Button>
          <Button variant="secondary" className={btn} onClick={closeSpotify}>
            <X size={16} aria-hidden="true" /> Close
          </Button>
        </div>

        {editing && (
          <form onSubmit={submit} className="mt-2">
            <label htmlFor="spotify-change" className="sr-only">
              New Spotify link
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="spotify-change"
                ref={editRef}
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                aria-invalid={Boolean(linkError)}
                aria-describedby="spotify-change-msg"
                placeholder="https://open.spotify.com/track/…"
                className="min-h-11 min-w-0 flex-1 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 text-[var(--color-text)]"
              />
              <Button type="submit" disabled={!link.trim()}>
                Load
              </Button>
            </div>
            <p id="spotify-change-msg" role={linkError ? 'alert' : undefined} className="mt-1 text-sm text-[var(--color-text)]">
              {linkError}
            </p>
          </form>
        )}

        {/* Collapsing only hides the iframe; it stays loaded, but browsers may still pause it. */}
        <iframe
          key={spotify.embedUrl}
          title={`Spotify ${spotify.type} player`}
          src={spotify.embedUrl}
          width="100%"
          height={height}
          loading="lazy"
          allow="encrypted-media"
          hidden={collapsed}
          className="mt-2 rounded-xl border-0"
          onLoad={() => setSlow(false)}
        />
        <p className="mt-1 text-xs text-[var(--color-text-soft)]">
          {collapsed
            ? 'Collapsed. Playback may pause while hidden; expand to check. '
            : slow
              ? 'Still loading. This content may be unavailable or blocked here. '
              : 'Press play inside the player. Without a Spotify login in this browser it may play only a preview. '}
          <a href={spotify.openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline">
            Open in Spotify <ExternalLink size={12} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          . Close unloads the player and does not restart SideQuest sound.
        </p>
      </div>
    </section>
  )
}

export default SpotifyPlayer
