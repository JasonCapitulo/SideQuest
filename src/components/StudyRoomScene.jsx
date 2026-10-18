function StudyRoomScene() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="A cozy pixel-art study room at night with a desk, lamp, open book, plant, and a small round companion floating beside the desk"
      className="h-auto w-full max-w-sm"
      shapeRendering="crispEdges"
    >
      {/* room backdrop */}
      <rect x="0" y="0" width="320" height="240" fill="var(--color-bg-alt)" />
      <rect x="0" y="180" width="320" height="60" fill="var(--color-border)" opacity="0.5" />

      {/* window */}
      <rect x="20" y="24" width="90" height="70" fill="var(--color-primary)" opacity="0.18" />
      <rect x="20" y="24" width="90" height="70" fill="none" stroke="var(--color-border)" strokeWidth="4" />
      <line x1="65" y1="24" x2="65" y2="94" stroke="var(--color-border)" strokeWidth="3" />
      <line x1="20" y1="59" x2="110" y2="59" stroke="var(--color-border)" strokeWidth="3" />
      <circle cx="85" cy="42" r="10" fill="var(--color-accent)" />
      <circle cx="40" cy="70" r="2" fill="var(--color-surface)" />
      <circle cx="55" cy="36" r="2" fill="var(--color-surface)" />
      <circle cx="95" cy="75" r="2" fill="var(--color-surface)" />

      {/* shelf plant */}
      <rect x="230" y="60" width="40" height="8" fill="var(--color-border)" />
      <rect x="244" y="36" width="12" height="24" fill="var(--color-secondary)" />
      <path
        d="M250 36 C240 24, 226 30, 236 42 C240 30, 250 30, 250 36 Z"
        fill="var(--color-secondary)"
      />
      <path
        d="M250 36 C260 22, 274 30, 262 40 C260 28, 250 30, 250 36 Z"
        fill="var(--color-secondary-hover)"
      />

      {/* desk */}
      <rect x="10" y="150" width="230" height="12" fill="var(--color-border)" />
      <rect x="20" y="162" width="16" height="50" fill="var(--color-border)" />
      <rect x="214" y="162" width="16" height="50" fill="var(--color-border)" />

      {/* open book on desk */}
      <path d="M90 150 L130 142 L170 150 L170 158 L130 150 L90 158 Z" fill="var(--color-surface)" />
      <path
        d="M90 150 L130 142 L170 150"
        fill="none"
        stroke="var(--color-text-soft)"
        strokeWidth="2"
      />
      <line x1="130" y1="142" x2="130" y2="150" stroke="var(--color-text-soft)" strokeWidth="2" />

      {/* lamp */}
      <rect x="180" y="110" width="4" height="40" fill="var(--color-border)" />
      <path d="M164 96 L200 96 L192 112 L172 112 Z" fill="var(--color-accent)" />
      <circle cx="182" cy="150" r="6" fill="var(--color-border)" />
      <circle cx="182" cy="104" r="26" fill="var(--color-accent)" opacity="0.2" />

      {/* mug */}
      <rect x="60" y="138" width="16" height="12" fill="var(--color-secondary)" />
      <path
        d="M76 140 q8 0 8 5 q0 5 -8 5"
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="2"
      />

      {/* companion blob */}
      <g className="float-bob">
        <ellipse cx="270" cy="170" rx="22" ry="20" fill="var(--color-primary)" />
        <circle cx="262" cy="164" r="3.5" fill="var(--color-text)" />
        <circle cx="278" cy="164" r="3.5" fill="var(--color-text)" />
        <path
          d="M261 174 Q270 180 279 174"
          stroke="var(--color-text)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="255" cy="170" r="3" fill="var(--color-accent)" opacity="0.8" />
        <circle cx="285" cy="170" r="3" fill="var(--color-accent)" opacity="0.8" />
        <path
          d="M258 150 Q262 140 268 148"
          stroke="var(--color-primary-hover)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M282 150 Q278 140 272 148"
          stroke="var(--color-primary-hover)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* sparkles */}
      <g fill="var(--color-accent)">
        <circle cx="140" cy="60" r="2" />
        <circle cx="200" cy="40" r="1.6" />
        <circle cx="300" cy="90" r="1.8" />
      </g>
    </svg>
  )
}

export default StudyRoomScene
