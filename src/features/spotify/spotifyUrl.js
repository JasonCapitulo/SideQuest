const TYPES = ['playlist', 'track', 'album']
const ID = '[A-Za-z0-9]{22}' // Spotify IDs are always 22 base-62 characters

/**
 * Accepts only well-formed open.spotify.com links (or spotify: URIs) and rebuilds the official embed URL
 * from the type and ID alone, so nothing else from the pasted text reaches the iframe.
 * This checks the format, not that the content exists or is playable in the player's region.
 */
export function parseSpotifyUrl(input) {
  const text = String(input ?? '').trim()
  let type
  let id
  const uri = new RegExp(`^spotify:(${TYPES.join('|')}):(${ID})$`).exec(text)
  if (uri) [, type, id] = uri
  else {
    let url
    try {
      url = new URL(text)
    } catch {
      return null
    }
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com') return null
    const m = new RegExp(`^/(?:intl-[a-z-]+/)?(${TYPES.join('|')})/(${ID})/?$`).exec(url.pathname)
    if (!m) return null
    ;[, type, id] = m
  }
  return {
    type,
    id,
    openUrl: `https://open.spotify.com/${type}/${id}`,
    embedUrl: `https://open.spotify.com/embed/${type}/${id}`,
  }
}
