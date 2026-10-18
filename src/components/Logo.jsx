/**
 * SideQuest brand mark. The drawing and Pixelify Sans wordmark are fixed; only
 * its four colours follow the active theme (--logo-* tokens in index.css), always
 * on a dark plate so the light-on-dark contrast holds in every theme.
 *
 * Symbol: a winding trail that forks toward a star (the "side" quest) while the
 * main path climbs to a flag.
 */
const PLATE = 'var(--logo-plate, #2d2a55)'
const GOLD = 'var(--logo-accent, #f4c95d)'
const CREAM = 'var(--logo-ink, #fdf3dc)'
const CORAL = 'var(--logo-flag, #ff7a7a)'

export function LogoSymbol({ size = 32 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="32" height="32" rx="7" style={{ fill: PLATE }} />
      {/* main trail */}
      <g style={{ fill: GOLD }}>
        <rect x="4" y="24" width="4" height="4" />
        <rect x="8" y="24" width="4" height="4" />
        <rect x="12" y="24" width="4" height="4" />
        <rect x="12" y="20" width="4" height="4" />
        <rect x="16" y="20" width="4" height="4" />
        <rect x="20" y="20" width="4" height="4" />
        <rect x="20" y="16" width="4" height="4" />
      </g>
      {/* flag */}
      <rect x="22" y="5" width="2" height="11" style={{ fill: CREAM }} />
      <g style={{ fill: CORAL }}>
        <rect x="24" y="5" width="6" height="2" />
        <rect x="24" y="7" width="4" height="2" />
        <rect x="24" y="9" width="2" height="2" />
      </g>
      {/* side path to a star */}
      <g style={{ fill: CREAM }}>
        <rect x="12" y="18" width="2" height="2" />
        <rect x="10" y="15" width="2" height="2" />
        <rect x="10" y="12" width="2" height="2" />
        <rect x="8" y="5" width="2" height="8" />
        <rect x="6" y="8" width="6" height="2" />
      </g>
    </svg>
  )
}

function Logo({ size = 'md' }) {
  const symbol = size === 'sm' ? 24 : 30
  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 8,
        padding: size === 'sm' ? '3px 10px 3px 4px' : '4px 12px 4px 5px',
        borderRadius: 12,
        background: PLATE,
        border: `1px solid color-mix(in srgb, ${GOLD} 40%, transparent)`,
        lineHeight: 1,
      }}
    >
      <LogoSymbol size={symbol} />
      <span
        style={{
          fontFamily: "'Pixelify Sans', monospace",
          fontWeight: 700,
          fontSize: size === 'sm' ? 17 : 20,
          letterSpacing: '0.02em',
          color: CREAM,
          textTransform: 'none',
        }}
      >
        Side<span style={{ color: GOLD }}>Quest</span>
      </span>
    </span>
  )
}

export default Logo
