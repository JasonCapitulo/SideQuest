// Symbol-only logos from public/assets/Logos. All are square, so object-contain never crops or stretches them.
const LOGOS = {
  canvas: { src: '/assets/Logos/canvas.png', name: 'Canvas' },
  google: { src: '/assets/Logos/Google_Calendar_icon_%282020%29.png', name: 'Google Calendar' },
  spotify: { src: '/assets/Logos/spotify.png', name: 'Spotify' },
  notion: { src: '/assets/Logos/Notion_app_logo.png', name: 'Notion' },
}

/** Official symbol in an equal square container with a light ground, so every logo reads at the same optical size. */
function BrandLogo({ brand, size = 40, className = '' }) {
  const l = LOGOS[brand]
  return (
    <span
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white p-1.5 ${className}`}
    >
      <img src={l.src} alt="" aria-hidden="true" width={size} height={size} className="max-h-full max-w-full object-contain" />
    </span>
  )
}

export default BrandLogo
