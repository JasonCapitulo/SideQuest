function MidnightScene() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="A calm late-night library scene with a tall window, moon and stars, a desk, and a dim lamp"
      className="h-auto w-full max-w-sm"
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width="320" height="240" fill="var(--color-bg-alt)" />
      <rect x="0" y="185" width="320" height="55" fill="var(--color-surface)" opacity="0.5" />

      {/* tall window with moon and stars */}
      <rect x="190" y="18" width="100" height="110" fill="var(--color-primary)" opacity="0.14" />
      <rect x="190" y="18" width="100" height="110" fill="none" stroke="var(--color-border)" strokeWidth="4" />
      <line x1="240" y1="18" x2="240" y2="128" stroke="var(--color-border)" strokeWidth="3" />
      <circle cx="260" cy="45" r="12" fill="var(--color-secondary)" />
      <circle cx="255" cy="42" r="10" fill="var(--color-bg-alt)" opacity="0.9" />
      <g fill="var(--color-secondary)">
        <circle className="float-bob" cx="210" cy="40" r="1.6" />
        <circle className="float-bob" cx="270" cy="90" r="1.4" />
        <circle className="float-bob" cx="215" cy="100" r="1.8" />
      </g>

      {/* bookshelf */}
      <rect x="20" y="40" width="70" height="90" fill="none" stroke="var(--color-border)" strokeWidth="3" />
      <line x1="20" y1="70" x2="90" y2="70" stroke="var(--color-border)" strokeWidth="2" />
      <line x1="20" y1="100" x2="90" y2="100" stroke="var(--color-border)" strokeWidth="2" />
      <g>
        <rect x="26" y="46" width="8" height="20" fill="var(--color-primary)" />
        <rect x="36" y="46" width="8" height="20" fill="var(--color-secondary)" />
        <rect x="46" y="46" width="8" height="20" fill="var(--color-accent)" />
        <rect x="26" y="76" width="8" height="20" fill="var(--color-accent)" />
        <rect x="36" y="76" width="8" height="20" fill="var(--color-primary)" />
      </g>

      {/* desk */}
      <rect x="10" y="150" width="200" height="12" fill="var(--color-border)" />
      <rect x="20" y="162" width="14" height="46" fill="var(--color-border)" />
      <rect x="186" y="162" width="14" height="46" fill="var(--color-border)" />

      {/* dim desk lamp */}
      <rect x="150" y="118" width="4" height="34" fill="var(--color-border)" />
      <path d="M136 106 L168 106 L160 120 L144 120 Z" fill="var(--color-secondary)" />
      <circle cx="152" cy="152" r="5" fill="var(--color-border)" />
      <circle cx="152" cy="112" r="22" fill="var(--color-secondary)" opacity="0.18" />

      {/* open book */}
      <path d="M60 152 L95 145 L130 152 L130 159 L95 152 L60 159 Z" fill="var(--color-surface)" />
      <line x1="95" y1="145" x2="95" y2="152" stroke="var(--color-text-soft)" strokeWidth="2" />
    </svg>
  )
}

export default MidnightScene
