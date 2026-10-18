function RetroScene() {
  return (
    <div
      role="img"
      aria-label="A retro pixel-art arcade scene with a tiled floor and a small pixel companion"
      className="relative flex h-full min-h-[200px] w-full items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/patterns/tile_0006.png')",
        backgroundSize: '48px 48px',
        imageRendering: 'pixelated',
      }}
    >
      <div className="absolute inset-0 bg-[var(--color-bg)]/35" />

      <svg
        viewBox="0 0 120 120"
        className="relative h-32 w-32"
        style={{ imageRendering: 'pixelated' }}
        shapeRendering="crispEdges"
      >
        <rect x="40" y="30" width="40" height="40" fill="var(--color-primary)" />
        <rect x="48" y="40" width="8" height="8" fill="var(--color-text)" />
        <rect x="64" y="40" width="8" height="8" fill="var(--color-text)" />
        <rect x="48" y="58" width="24" height="6" fill="var(--color-text)" />
        <rect x="32" y="70" width="56" height="12" fill="var(--color-secondary)" />
        <rect x="36" y="82" width="16" height="16" fill="var(--color-accent)" />
        <rect x="68" y="82" width="16" height="16" fill="var(--color-accent)" />
      </svg>

      {/* Chunky CSS dialog box in place of an image asset. */}
      <div
        aria-hidden="true"
        className="absolute bottom-3 right-3 h-8 w-24 border-4 border-[var(--color-text)] bg-[var(--color-surface)] shadow-[4px_4px_0_0_var(--color-text)]"
      />
    </div>
  )
}

export default RetroScene
