/**
 * Study Radio suggestions. These are descriptive ideas plus a Spotify *search* query, not
 * specific playlist links: we have no verified playlist IDs, so none are invented and
 * nothing is embedded. The search link opens Spotify's own results in a new tab.
 */
export const MOODS = [
  {
    id: 'deep-focus',
    label: 'Deep Focus',
    suggestions: [
      { title: 'Lyric-free deep focus', description: 'Steady instrumental tracks that fade into the background.', query: 'deep focus instrumental' },
      { title: 'Concentration mix', description: 'Calm, repetitive music for one long task.', query: 'concentration music' },
      { title: 'Minimal piano for studying', description: 'Sparse piano, no sudden changes.', query: 'minimal piano study' },
      { title: 'Ambient study session', description: 'Slow ambient textures with no beat.', query: 'ambient study music' },
    ],
  },
  {
    id: 'cozy-rain',
    label: 'Cozy Rain',
    suggestions: [
      { title: 'Rainy-day lo-fi beats', description: 'Gentle beats with rain in the mix.', query: 'rainy day lofi beats' },
      { title: 'Rain sounds for studying', description: 'Just rainfall, nothing to follow.', query: 'rain sounds for studying' },
      { title: 'Cozy lo-fi café', description: 'Warm, mellow lo-fi with a café feel.', query: 'cozy lofi cafe' },
      { title: 'Lo-fi and thunderstorm', description: 'Soft thunder under mellow beats.', query: 'lofi thunderstorm study' },
    ],
  },
  {
    id: 'soft-instrumentals',
    label: 'Soft Instrumentals',
    suggestions: [
      { title: 'Soft piano instrumentals', description: 'Quiet, unhurried piano pieces.', query: 'soft piano instrumentals' },
      { title: 'Acoustic guitar for studying', description: 'Gentle fingerpicked guitar.', query: 'acoustic guitar instrumental study' },
      { title: 'Gentle classical for focus', description: 'Slow, familiar classical pieces.', query: 'calm classical for studying' },
      { title: 'Calm instrumental mix', description: 'Mellow instrumental music across styles.', query: 'calm instrumental music' },
    ],
  },
  {
    id: 'retro-energy',
    label: 'Retro Energy',
    suggestions: [
      { title: '8-bit chiptune focus', description: 'Upbeat chiptune to get moving.', query: '8-bit chiptune focus' },
      { title: 'Retro synthwave for studying', description: 'Driving synths with no vocals.', query: 'synthwave study instrumental' },
      { title: 'Video game soundtrack study', description: 'Familiar game music to keep a steady pace.', query: 'video game music study' },
      { title: 'Upbeat chiptune', description: 'Bright, bouncy tracks for a quick burst.', query: 'upbeat chiptune' },
    ],
  },
]

export const DEFAULT_MOOD_BY_THEME = {
  lofi: 'cozy-rain',
  sprout: 'soft-instrumentals',
  quiet: 'soft-instrumentals',
  retro: 'retro-energy',
  midnight: 'deep-focus',
}

/** Spotify's public web search. The query is URL-encoded so spaces and symbols are safe. */
export function spotifySearchUrl(query) {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`
}

/** Picks a random suggestion index that differs from the last one (when more than one exists). */
export function nextSuggestionIndex(count, last) {
  if (count <= 1) return 0
  let next = Math.floor(Math.random() * count)
  if (next === last) next = (next + 1 + Math.floor(Math.random() * (count - 1))) % count
  return next
}
