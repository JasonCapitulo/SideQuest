import { useThemePreferences } from '../context/ThemeContext.jsx'

/**
 * Decorative animated scenery behind the page content, one per theme.
 * Everything here is aria-hidden, pointer-events: none, original CSS/SVG, and
 * animates only transform/opacity. Animations are switched off by
 * backdrops.css when reduced motion is on.
 */

// Deterministic pseudo-random so renders are stable (no Math.random in render).
const rnd = (i, salt = 1) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}
const range = (n) => Array.from({ length: n }, (_, i) => i)

/* ---------- Lo-Fi Hideaway: rain on a warm window ---------- */
const RAIN = range(36).map((i) => ({
  left: `${rnd(i, 1) * 105}%`,
  height: 36 + rnd(i, 2) * 52,
  duration: 1.1 + rnd(i, 3) * 1.1,
  delay: -rnd(i, 4) * 3,
  opacity: 0.16 + rnd(i, 5) * 0.16,
}))

function RainBackdrop() {
  return (
    <>
      <div className="bd-window-glow" />
      <svg className="bd-window" viewBox="0 0 120 150" aria-hidden="true">
        <rect x="6" y="6" width="108" height="138" rx="6" fill="#f6c177" opacity="0.5" className="bd-window-light" />
        <g fill="none" stroke="#8a6a8f" strokeWidth="5" opacity="0.7">
          <rect x="6" y="6" width="108" height="138" rx="6" />
          <path d="M60 6 V144 M6 75 H114" />
        </g>
      </svg>
      {RAIN.map((d, i) => (
        <span
          key={i}
          className="bd-rain"
          style={{
            left: d.left,
            height: d.height,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </>
  )
}

/* ---------- Sprout Garden: swaying plants + drifting leaves ---------- */
const PLANTS = [
  { x: 1, kind: 'fern', scale: 1.25, delay: 0 },
  { x: 11, kind: 'flower', scale: 1, delay: -2, petal: '#f4a6b8' },
  { x: 22, kind: 'grass', scale: 0.9, delay: -1 },
  { x: 41, kind: 'flower', scale: 0.8, delay: -3.5, petal: '#f6d45a' },
  { x: 58, kind: 'grass', scale: 1, delay: -2.5 },
  { x: 72, kind: 'fern', scale: 1.1, delay: -1.5 },
  { x: 84, kind: 'flower', scale: 1.15, delay: -4, petal: '#ffffff' },
  { x: 94, kind: 'fern', scale: 1.3, delay: -0.5 },
]

function Plant({ kind, petal }) {
  if (kind === 'grass') {
    return (
      <svg viewBox="0 0 80 110" width="80" height="110">
        <g fill="none" stroke="#5f9648" strokeWidth="4" strokeLinecap="round">
          <path d="M40 110 C38 80 30 50 22 24" />
          <path d="M40 110 C40 76 42 46 46 14" />
          <path d="M40 110 C44 84 54 60 66 38" />
          <path d="M40 110 C34 90 20 78 10 64" stroke="#76ae5a" />
          <path d="M40 110 C48 94 62 86 72 80" stroke="#76ae5a" />
        </g>
      </svg>
    )
  }
  if (kind === 'flower') {
    return (
      <svg viewBox="0 0 80 150" width="80" height="150">
        <path d="M40 150 C40 110 38 80 40 42" stroke="#4f8a3c" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="26" cy="110" rx="15" ry="6" fill="#76ae5a" transform="rotate(-28 26 110)" />
        <ellipse cx="55" cy="92" rx="15" ry="6" fill="#5f9648" transform="rotate(28 55 92)" />
        <g fill={petal}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="40" cy="26" rx="7" ry="12" transform={`rotate(${a} 40 38)`} />
          ))}
        </g>
        <circle cx="40" cy="38" r="6" fill="#e0a23a" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 90 150" width="90" height="150">
      <path d="M45 150 C45 110 44 70 46 20" stroke="#4f8a3c" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g fill="#6aa551">
        {[118, 92, 66, 42].map((y, i) => (
          <g key={y}>
            <ellipse cx={30 - i * 2} cy={y} rx="17" ry="6" transform={`rotate(-24 ${30 - i * 2} ${y})`} />
            <ellipse cx={60 + i * 2} cy={y - 10} rx="17" ry="6" transform={`rotate(24 ${60 + i * 2} ${y - 10})`} fill="#7cb85f" />
          </g>
        ))}
      </g>
    </svg>
  )
}

const LEAVES = range(9).map((i) => ({
  left: `${rnd(i, 7) * 96}%`,
  size: 16 + rnd(i, 8) * 14,
  duration: 20 + rnd(i, 9) * 14,
  delay: -rnd(i, 10) * 30,
  color: ['#6aa551', '#8bc06a', '#4f8a3c', '#a6cf7c'][i % 4],
}))

function GardenBackdrop() {
  return (
    <>
      {LEAVES.map((l, i) => (
        <svg
          key={i}
          className="bd-leaf"
          viewBox="0 0 24 14"
          width={l.size}
          height={l.size * 0.58}
          style={{ left: l.left, animationDuration: `${l.duration}s`, animationDelay: `${l.delay}s` }}
        >
          <path d="M1 7 C6 -1 17 0 23 7 C17 14 6 14 1 7 Z" fill={l.color} />
          <path d="M3 7 H21" stroke="#3f6f35" strokeWidth="1" opacity="0.6" />
        </svg>
      ))}
      {PLANTS.map((p, i) => (
        <div key={i} className="bd-plant" style={{ left: `${p.x}%`, transform: `scale(${p.scale})`, transformOrigin: 'bottom left' }}>
          <div className="bd-plant-sway" style={{ animationDelay: `${p.delay}s` }}>
            <Plant kind={p.kind} petal={p.petal} />
          </div>
        </div>
      ))}
    </>
  )
}

/* ---------- Quiet Mode: zen mountains, stones, and a still pond ---------- */
function ZenBackdrop() {
  return (
    <svg
      className="bd-zen"
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <circle cx="1010" cy="130" r="46" fill="#eef1e4" className="bd-zen-sun" />
      <path d="M0 300 L180 170 L300 250 L470 120 L650 262 L820 190 L1000 280 L1200 200 V420 H0 Z" fill="#e6eee3" />
      <path d="M0 340 L140 255 L280 320 L460 230 L640 330 L820 270 L1010 340 L1200 290 V420 H0 Z" fill="#d5e3d3" />
      {/* pond */}
      <ellipse cx="170" cy="388" rx="210" ry="28" fill="#cfe2e0" />
      <g fill="none" stroke="#9fc1bd" strokeWidth="2">
        <ellipse cx="170" cy="388" rx="100" ry="13" className="bd-ripple" />
        <ellipse cx="170" cy="388" rx="100" ry="13" className="bd-ripple bd-ripple-2" />
        <ellipse cx="170" cy="388" rx="100" ry="13" className="bd-ripple bd-ripple-3" />
      </g>
      {/* stacked garden stones */}
      <g>
        <ellipse cx="1090" cy="402" rx="46" ry="13" fill="#bdb8a8" />
        <ellipse cx="1090" cy="386" rx="33" ry="11" fill="#cdc8b8" />
        <ellipse cx="1090" cy="372" rx="21" ry="9" fill="#dcd8ca" />
        <ellipse cx="1090" cy="362" rx="11" ry="6" fill="#e8e5da" />
      </g>
      <path d="M0 410 C200 396 360 414 560 404 C760 394 980 416 1200 402 V420 H0 Z" fill="#c9dbc6" />
    </svg>
  )
}

/* ---------- Retro Arcade: drifting pixel stars and shapes ---------- */
const PIXEL_COLORS = ['#ff9eb0', '#9fe3c7', '#ffd88a', '#b9a8ff', '#8fd3ff']
const PIXELS = range(30).map((i) => ({
  top: `${rnd(i, 11) * 96}%`,
  left: `${rnd(i, 12) * 96}%`,
  shape: ['plus', 'square', 'diamond'][i % 3],
  color: PIXEL_COLORS[i % PIXEL_COLORS.length],
  duration: 34 + rnd(i, 13) * 36,
  delay: -rnd(i, 14) * 50,
  size: 8 + Math.floor(rnd(i, 15) * 3) * 4,
}))

function ArcadeBackdrop() {
  return (
    <>
      {PIXELS.map((p, i) => (
        <span
          key={i}
          className={`bd-pixel bd-pixel-${p.shape}`}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            color: p.color,
            background: p.shape === 'plus' ? 'none' : p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ...(p.shape === 'plus' ? { boxShadow: `${p.size}px 0 0 0 ${p.color}, -${p.size}px 0 0 0 ${p.color}, 0 ${p.size}px 0 0 ${p.color}, 0 -${p.size}px 0 0 ${p.color}, 0 0 0 0 ${p.color}` } : {}),
          }}
        />
      ))}
    </>
  )
}

/* ---------- Midnight Library: twinkling stars and moonlight ---------- */
const STARS = range(46).map((i) => ({
  top: `${rnd(i, 21) * 100}%`,
  left: `${rnd(i, 22) * 100}%`,
  size: rnd(i, 23) > 0.85 ? 3 : 2,
  duration: 2.6 + rnd(i, 24) * 4.4,
  delay: -rnd(i, 25) * 6,
}))

function LibraryBackdrop() {
  return (
    <>
      <div className="bd-moon-halo" />
      <svg className="bd-moon" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M40 6 A27 27 0 1 0 58 46 A22 22 0 0 1 40 6 Z" fill="#f3e3a3" />
      </svg>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="bd-star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  )
}

const BACKDROPS = {
  lofi: RainBackdrop,
  sprout: GardenBackdrop,
  quiet: ZenBackdrop,
  retro: ArcadeBackdrop,
  midnight: LibraryBackdrop,
}

function ThemeBackdrop() {
  const { theme } = useThemePreferences()
  const Scene = BACKDROPS[theme]
  if (!Scene) return null
  return (
    <div className={`backdrop backdrop-${theme}`} aria-hidden="true">
      <Scene />
    </div>
  )
}

export default ThemeBackdrop
