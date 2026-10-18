/**
 * Small original illustrations, one per game. Drawn with currentColor plus the
 * card's tint so they follow the active theme. Decorative (aria-hidden).
 */
const ART = {
  'tic-tac-toe': (
    <>
      <path d="M40 14v52M64 14v52M20 32h64M20 50h64" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <path d="M24 17l12 12M36 17L24 29" strokeWidth="4" strokeLinecap="round" />
      <circle cx="52" cy="41" r="7" strokeWidth="4" />
      <path d="M68 53l12 12M80 53L68 65" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  'memory-garden': (
    <>
      <rect x="18" y="20" width="32" height="42" rx="6" strokeWidth="3" opacity=".6" />
      <path d="M28 34h12M28 42h12M28 50h12" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <rect x="54" y="14" width="32" height="42" rx="6" strokeWidth="3" transform="rotate(8 70 35)" />
      <path d="M70 48V32m0 6c-6 0-8-4-8-8 6 0 8 4 8 8zm0 2c6 0 8-4 8-8-6 0-8 4-8 8z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(8 70 35)" />
    </>
  ),
  'whack-a-sprout': (
    <>
      <path d="M16 62c4-10 16-14 36-14s32 4 36 14" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52 48V30m0 6c-8 0-12-5-12-11 8 0 12 5 12 11zm0 4c8 0 12-5 12-11-8 0-12 5-12 11z" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 20l5 5M80 20l-5 5M52 10v5" strokeWidth="3" strokeLinecap="round" opacity=".6" />
    </>
  ),
  'color-hop': (
    <>
      <circle cx="26" cy="54" r="10" strokeWidth="3.5" />
      <rect x="44" y="34" width="20" height="20" rx="3" strokeWidth="3.5" />
      <path d="M86 24l11 20H75z" strokeWidth="3.5" strokeLinejoin="round" transform="translate(-4 4)" />
      <path d="M32 40c4-12 8-14 12-14M64 26c4-8 8-8 12-4" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" opacity=".7" />
    </>
  ),
  'fruit-flick': (
    <>
      <circle cx="48" cy="44" r="22" strokeWidth="3.5" />
      <path d="M48 22c0-6 4-10 10-12" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M14 70L90 14" strokeWidth="3.5" strokeLinecap="round" opacity=".7" />
      <path d="M72 62l8 6M80 52l8 4" strokeWidth="3" strokeLinecap="round" opacity=".5" />
    </>
  ),
}

function GameArt({ id }) {
  return (
    <svg
      viewBox="0 0 104 80"
      className="h-full max-h-24 w-auto"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {ART[id]}
    </svg>
  )
}

export default GameArt
