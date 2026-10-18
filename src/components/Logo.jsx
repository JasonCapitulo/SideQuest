/**
 * SideQuest brand mark. Deliberately independent of the active theme: fixed
 * colors, fixed Pixelify Sans wordmark, and its own indigo plate so contrast is
 * the same on light and dark pages (cream on indigo ≈ 12:1, gold on indigo ≈ 8:1).
 *
 * Symbol: a winding trail that forks toward a star (the "side" quest) while the
 * main path climbs to a flag.
 */
const PLATE = '#2d2a55'
const GOLD = '#f4c95d'
const CREAM = '#fdf3dc'
const CORAL = '#ff7a7a'

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
      <rect width="32" height="32" rx="7" fill={PLATE} />
      {/* main trail */}
      <g fill={GOLD}>
        <rect x="4" y="24" width="4" height="4" />
        <rect x="8" y="24" width="4" height="4" />
        <rect x="12" y="24" width="4" height="4" />
        <rect x="12" y="20" width="4" height="4" />
        <rect x="16" y="20" width="4" height="4" />
        <rect x="20" y="20" width="4" height="4" />
        <rect x="20" y="16" width="4" height="4" />
      </g>
      {/* flag */}
      <rect x="22" y="5" width="2" height="11" fill={CREAM} />
      <g fill={CORAL}>
        <rect x="24" y="5" width="6" height="2" />
        <rect x="24" y="7" width="4" height="2" />
        <rect x="24" y="9" width="2" height="2" />
      </g>
      {/* side path to a star */}
      <g fill={CREAM}>
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
        border: `1px solid ${GOLD}66`,
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
