const ENERGY = {
  low: { caption: 'Low energy: a slow, cozy pace is just fine.', cls: 'rn-sleepy', eyes: 'closed' },
  medium: { caption: 'Medium energy: steady and calm.', cls: 'rn-steady', eyes: 'open' },
  high: { caption: 'High energy: ready for a quick burst.', cls: 'rn-bouncy', eyes: 'open' },
}

const BARRIER = {
  not_sure_where_to_start: 'A signpost helps point the way.',
  task_too_big: 'A big block, split into smaller pieces.',
  distracted: 'Loose thoughts drifting around, to gently gather.',
  low_energy: 'A warm cup to recharge.',
  confused: 'A question mark: we will take it one piece at a time.',
}

function Prop({ barrier }) {
  const stroke = { stroke: 'var(--color-text)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (barrier) {
    case 'task_too_big':
      return (
        <g className="rn-split" {...stroke} fill="var(--color-secondary)">
          <rect className="rn-block-a" x="128" y="118" width="26" height="26" rx="4" />
          <rect className="rn-block-b" x="156" y="118" width="26" height="26" rx="4" />
          <rect className="rn-block-c" x="142" y="92" width="26" height="26" rx="4" />
        </g>
      )
    case 'distracted':
      return (
        <g fill="var(--color-accent)" {...stroke}>
          <circle className="rn-orbit rn-orbit-a" cx="150" cy="70" r="7" />
          <circle className="rn-orbit rn-orbit-b" cx="170" cy="100" r="5" />
          <circle className="rn-orbit rn-orbit-c" cx="38" cy="80" r="6" />
        </g>
      )
    case 'low_energy':
      return (
        <g {...stroke} fill="var(--color-secondary)">
          <path d="M136 112h38v22a14 14 0 0 1-14 14h-10a14 14 0 0 1-14-14z" />
          <path d="M174 118h6a7 7 0 0 1 0 14h-6" fill="none" />
          <path className="rn-steam" d="M148 100c-4-6 4-8 0-14" fill="none" />
          <path className="rn-steam rn-steam-b" d="M162 100c-4-6 4-8 0-14" fill="none" />
        </g>
      )
    case 'confused':
      return (
        <g {...stroke} fill="none">
          <path className="rn-wobble" d="M146 92a14 14 0 1 1 20 12c-6 3-6 8-6 12" />
          <circle cx="160" cy="132" r="2.5" fill="var(--color-text)" />
        </g>
      )
    default:
      return (
        <g {...stroke} fill="var(--color-secondary)">
          <path d="M160 150V86" fill="none" />
          <path className="rn-point" d="M160 90h26l8 9-8 9h-26z" />
        </g>
      )
  }
}

/**
 * Original illustration that reacts to the energy and barrier choices. Fixed square box so nothing shifts;
 * motion is CSS-only and is switched off by the app's reduced-motion / low-stimulation rules.
 */
function RightNowScene({ energy, barrier }) {
  const e = ENERGY[energy] ?? ENERGY.medium
  return (
    <figure className="m-0">
      <div className="aspect-square w-full max-w-[16rem] overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-game-surface)]">
        <svg viewBox="0 0 200 200" role="img" aria-label={`${e.caption} ${BARRIER[barrier] ?? ''}`} className="h-full w-full">
          <ellipse cx="80" cy="168" rx="46" ry="8" fill="var(--color-border)" opacity="0.35" />
          <g className={e.cls}>
            <path
              d="M34 150c-4-40 14-76 46-76s50 36 46 76c0 8-10 10-46 10s-46-2-46-10z"
              fill="var(--color-primary)"
              stroke="var(--color-text)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {e.eyes === 'closed' ? (
              <g stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M62 112q6 5 12 0" />
                <path d="M88 112q6 5 12 0" />
              </g>
            ) : (
              <g fill="var(--color-text)">
                <circle cx="68" cy="112" r="4.5" />
                <circle cx="94" cy="112" r="4.5" />
              </g>
            )}
            <path
              d={energy === 'high' ? 'M70 128q10 12 20 0z' : energy === 'low' ? 'M72 130h16' : 'M70 128q10 8 20 0'}
              stroke="var(--color-text)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={energy === 'high' ? 'var(--color-text)' : 'none'}
            />
            {energy === 'low' && (
              <text className="rn-z" x="110" y="76" fontSize="16" fontWeight="700" fill="var(--color-text)">
                z
              </text>
            )}
            {energy === 'high' && (
              <g stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" className="rn-spark">
                <path d="M118 70v10M113 75h10" />
                <path d="M42 80v8M38 84h8" />
              </g>
            )}
          </g>
          <Prop barrier={barrier} />
        </svg>
      </div>
      <figcaption role="status" aria-live="polite" className="mt-2 max-w-[16rem] text-sm text-[var(--color-text-soft)]">
        {e.caption} {BARRIER[barrier]}
      </figcaption>
    </figure>
  )
}

export default RightNowScene
