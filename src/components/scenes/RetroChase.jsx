import { useEffect, useRef } from 'react'

const CHOMPER = 30
const CRITTER = 24
const FLEE_RADIUS = 130

function canChase() {
  try {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  } catch {
    return false
  }
}

/**
 * Original arcade-style chase: a faceted "chomper" follows the pointer while a little "blip" scurries away.
 * Both are non-interactive (pointer-events: none), stay inside the scene, and only run while a fine pointer
 * hovers it. `enabled` is false for reduced-motion and Low-Stimulation Mode; touch devices never start it.
 */
function RetroChase({ enabled }) {
  const rootRef = useRef(null)
  const chomperRef = useRef(null)
  const critterRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current?.parentElement
    if (!enabled || !root || !canChase()) return undefined

    const state = { frame: 0, pointer: null, c: { x: 40, y: 40 }, b: { x: 0, y: 0 }, size: { w: 0, h: 0 } }
    const measure = () => {
      const r = root.getBoundingClientRect()
      state.size = { w: r.width, h: r.height }
      state.b = { x: r.width * 0.75, y: r.height * 0.6 }
    }
    measure()

    const clamp = (v, max, pad) => Math.min(max - pad, Math.max(pad, v))

    const tick = () => {
      const { w, h } = state.size
      const p = state.pointer
      if (p) {
        // chomper eases toward the pointer, then idles next to it
        const dx = p.x - state.c.x
        const dy = p.y - state.c.y
        const dist = Math.hypot(dx, dy)
        if (dist > 26) {
          state.c.x += dx * 0.07
          state.c.y += dy * 0.07
        }
        state.c.x = clamp(state.c.x, w, CHOMPER / 2)
        state.c.y = clamp(state.c.y, h, CHOMPER / 2)
        // critter backs away from the pointer, and from the chomper if it gets close
        for (const src of [p, state.c]) {
          const ex = state.b.x - src.x
          const ey = state.b.y - src.y
          const d = Math.hypot(ex, ey) || 1
          if (d < FLEE_RADIUS) {
            const push = ((FLEE_RADIUS - d) / FLEE_RADIUS) * 5
            state.b.x += (ex / d) * push
            state.b.y += (ey / d) * push
          }
        }
        state.b.x = clamp(state.b.x, w, CRITTER / 2)
        state.b.y = clamp(state.b.y, h, CRITTER / 2)
        const face = dx < 0 ? -1 : 1
        if (chomperRef.current)
          chomperRef.current.style.transform = `translate(${state.c.x - CHOMPER / 2}px, ${state.c.y - CHOMPER / 2}px) scaleX(${face})`
        if (critterRef.current)
          critterRef.current.style.transform = `translate(${state.b.x - CRITTER / 2}px, ${state.b.y - CRITTER / 2}px)`
      }
      state.frame = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = root.getBoundingClientRect()
      state.pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onEnter = (e) => {
      if (e.pointerType !== 'mouse') return
      measure()
      rootRef.current.dataset.active = 'true'
      cancelAnimationFrame(state.frame)
      state.frame = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      state.pointer = null
      cancelAnimationFrame(state.frame)
      if (rootRef.current) rootRef.current.dataset.active = 'false'
    }

    root.addEventListener('pointerenter', onEnter)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(state.frame)
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={rootRef} aria-hidden="true" data-active="false" className="retro-chase pointer-events-none absolute inset-0 overflow-hidden">
      <svg ref={chomperRef} width={CHOMPER} height={CHOMPER} viewBox="0 0 30 30" className="absolute left-0 top-0" shapeRendering="crispEdges">
        <g className="rt-jaw-top">
          <path d="M15 15L3 15L9 4L21 4L27 15Z" fill="var(--color-accent)" stroke="var(--color-text)" strokeWidth="2" strokeLinejoin="round" />
          <rect x="15" y="8" width="3" height="3" fill="var(--color-text)" />
        </g>
        <g className="rt-jaw-bottom">
          <path d="M3 15L27 15L21 26L9 26Z" fill="var(--color-accent)" stroke="var(--color-text)" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </svg>
      <svg ref={critterRef} width={CRITTER} height={CRITTER} viewBox="0 0 24 24" className="absolute left-0 top-0" shapeRendering="crispEdges">
        <rect x="4" y="6" width="16" height="12" fill="var(--color-secondary)" stroke="var(--color-text)" strokeWidth="2" />
        <rect x="8" y="10" width="3" height="3" fill="var(--color-text)" />
        <rect x="14" y="10" width="3" height="3" fill="var(--color-text)" />
        <rect x="6" y="18" width="4" height="3" fill="var(--color-text)" />
        <rect x="14" y="18" width="4" height="3" fill="var(--color-text)" />
        <path d="M8 6V2M16 6V2" stroke="var(--color-text)" strokeWidth="2" />
      </svg>
    </div>
  )
}

export default RetroChase
