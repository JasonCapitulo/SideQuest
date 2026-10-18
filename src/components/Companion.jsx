/**
 * Sprig: an original seedling companion drawn in SVG. Decorative only
 * (aria-hidden) — any meaning is carried by nearby text.
 */
const EYES = {
  idle: (
    <>
      <circle cx="26" cy="40" r="2.6" fill="#24361f" />
      <circle cx="38" cy="40" r="2.6" fill="#24361f" />
    </>
  ),
  blink: (
    <>
      <path d="M23.5 40 h5" stroke="#24361f" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M35.5 40 h5" stroke="#24361f" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <path d="M23.5 41 q2.5 -4 5 0" stroke="#24361f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M35.5 41 q2.5 -4 5 0" stroke="#24361f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  sleepy: (
    <>
      <path d="M23.5 40 q2.5 3 5 0" stroke="#24361f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M35.5 40 q2.5 3 5 0" stroke="#24361f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  cool: (
    <>
      <rect x="21" y="37" width="10" height="6" rx="2" fill="#24361f" />
      <rect x="33" y="37" width="10" height="6" rx="2" fill="#24361f" />
      <path d="M31 39.5 h2" stroke="#24361f" strokeWidth="2" />
    </>
  ),
}

const MOUTH = {
  idle: <path d="M28 47 q4 3.5 8 0" stroke="#24361f" strokeWidth="2" fill="none" strokeLinecap="round" />,
  happy: <path d="M27 46 q5 7 10 0 z" fill="#24361f" />,
  cheer: <path d="M27 46 q5 7 10 0 z" fill="#24361f" />,
  sleepy: <circle cx="32" cy="47.5" r="1.8" fill="#24361f" />,
  cool: <path d="M28 47 q4 3.5 8 0" stroke="#24361f" strokeWidth="2" fill="none" strokeLinecap="round" />,
}

function Companion({ pose = 'idle', size = 96, className = '' }) {
  const eyes = EYES[pose] ?? (pose === 'cheer' ? EYES.happy : EYES.idle)
  const mouth = MOUTH[pose] ?? MOUTH.idle
  const arms = pose === 'cheer'

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* sprouting leaves */}
      <path d="M32 22 C32 16 31 12 29 9" stroke="#3f7d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M29 12 C21 6 13 10 14 17 C22 18 28 16 29 12 Z" fill="#5fae4f" stroke="#2f5f2b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M31 12 C37 3 48 5 48 12 C41 16 33 16 31 12 Z" fill="#7cc667" stroke="#2f5f2b" strokeWidth="1.5" strokeLinejoin="round" />

      {/* body */}
      <path
        d="M32 21 C47 21 53 31 53 42 C53 53 44 58 32 58 C20 58 11 53 11 42 C11 31 17 21 32 21 Z"
        fill="#f6efd2"
        stroke="#2f5f2b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* little feet */}
      <ellipse cx="23" cy="58.5" rx="5" ry="2.5" fill="#d9c98c" stroke="#2f5f2b" strokeWidth="1.5" />
      <ellipse cx="41" cy="58.5" rx="5" ry="2.5" fill="#d9c98c" stroke="#2f5f2b" strokeWidth="1.5" />

      {/* arms: tucked, or raised when cheering */}
      {arms ? (
        <>
          <path d="M13 40 C8 34 8 28 10 24" stroke="#2f5f2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M51 40 C56 34 56 28 54 24" stroke="#2f5f2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M12 44 C9 46 9 50 12 51" stroke="#2f5f2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M52 44 C55 46 55 50 52 51" stroke="#2f5f2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* face */}
      {eyes}
      {mouth}
      <circle cx="21" cy="46" r="2.6" fill="#f5a3a3" opacity="0.7" />
      <circle cx="43" cy="46" r="2.6" fill="#f5a3a3" opacity="0.7" />
    </svg>
  )
}

export default Companion
