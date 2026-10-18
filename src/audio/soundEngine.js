/**
 * Web Audio engine. Everything is synthesised (no audio files, so nothing to
 * license). The AudioContext is created lazily from a user gesture, never on
 * load, so there is no autoplay. Only one ambient bed can exist at a time.
 */
let ctx = null
let master = null
let stopAmbientFn = null
let lastSfx = { name: '', at: 0 }

const WAVE_BY_THEME = { retro: 'square', quiet: 'sine', midnight: 'sine', lofi: 'triangle', sprout: 'triangle' }

export function isSupported() {
  return typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext)
}

/** Must be called from a user gesture the first time. */
export function ensureContext() {
  if (!isSupported()) return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function setMasterLevel(muted, volume) {
  if (!ctx || !master) return
  master.gain.setTargetAtTime(muted ? 0 : Math.min(1, Math.max(0, volume)) * 0.7, ctx.currentTime, 0.03)
}

export function suspendAudio() {
  if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {})
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
}

function tone(freq, start, duration, { type = 'sine', gain = 0.25, slideTo } = {}) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(g).connect(master)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

const SFX = {
  click: (t, w) => tone(520, t, 0.06, { type: w, gain: 0.18 }),
  flip: (t, w) => tone(440, t, 0.09, { type: w, gain: 0.2, slideTo: 660 }),
  pop: (t, w) => tone(720, t, 0.1, { type: w, gain: 0.22, slideTo: 320 }),
  slice: (t) => tone(900, t, 0.12, { type: 'sawtooth', gain: 0.1, slideTo: 260 }),
  correct: (t, w) => {
    tone(523, t, 0.12, { type: w, gain: 0.2 })
    tone(659, t + 0.1, 0.16, { type: w, gain: 0.2 })
  },
  wrong: (t) => tone(240, t, 0.18, { type: 'sine', gain: 0.18, slideTo: 190 }),
  win: (t, w) => [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.1, 0.18, { type: w, gain: 0.2 })),
}

export function playSfx(name, theme) {
  if (!ctx || !master || ctx.state !== 'running') return
  const now = performance.now()
  if (lastSfx.name === name && now - lastSfx.at < 40) return // never stack identical sounds
  lastSfx = { name, at: now }
  SFX[name]?.(ctx.currentTime, WAVE_BY_THEME[theme] ?? 'sine')
}

function noiseSource() {
  const length = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  return src
}

function slowLfo(target, rate, depth) {
  const lfo = ctx.createOscillator()
  const amount = ctx.createGain()
  lfo.frequency.value = rate
  amount.gain.value = depth
  lfo.connect(amount).connect(target)
  lfo.start()
  return lfo
}

/** Starts one quiet ambient bed for the theme, replacing any current one. */
export function startAmbient(theme) {
  stopAmbient()
  if (!ensureContext()) return
  const out = ctx.createGain()
  out.gain.value = 0.0001
  out.connect(master)
  out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.2)

  const nodes = []
  let interval = null

  if (theme === 'lofi' || theme === 'sprout') {
    // rain / breeze: band-passed noise
    const n = noiseSource()
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = theme === 'lofi' ? 1400 : 650
    f.Q.value = 0.4
    const g = ctx.createGain()
    g.gain.value = theme === 'lofi' ? 0.22 : 0.16
    n.connect(f).connect(g).connect(out)
    n.start()
    nodes.push(n)
    if (theme === 'sprout') nodes.push(slowLfo(g.gain, 0.12, 0.07))
  } else if (theme === 'quiet' || theme === 'midnight') {
    const base = theme === 'quiet' ? [130.8, 196] : [98, 147, 196.5]
    base.forEach((hz, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = hz
      g.gain.value = 0.05
      o.connect(g).connect(out)
      o.start()
      nodes.push(o, slowLfo(g.gain, 0.05 + i * 0.02, 0.03))
    })
  } else {
    // retro: a soft, slow square-wave arpeggio
    const notes = [262, 330, 392, 330]
    let step = 0
    interval = setInterval(() => {
      if (!ctx || ctx.state !== 'running') return
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'square'
      o.frequency.value = notes[step++ % notes.length]
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      o.connect(g).connect(out)
      o.start(t)
      o.stop(t + 0.4)
    }, 500)
  }

  stopAmbientFn = () => {
    if (interval) clearInterval(interval)
    const t = ctx.currentTime
    out.gain.cancelScheduledValues(t)
    out.gain.setTargetAtTime(0.0001, t, 0.15)
    setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
      out.disconnect()
    }, 600)
  }
}

export function stopAmbient() {
  if (stopAmbientFn) {
    stopAmbientFn()
    stopAmbientFn = null
  }
}
