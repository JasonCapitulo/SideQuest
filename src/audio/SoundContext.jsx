import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import {
  ensureContext,
  isSupported,
  playSfx,
  resumeAudio,
  setMasterLevel,
  startAmbient,
  stopAmbient,
  suspendAudio,
} from './soundEngine.js'

const SoundContext = createContext(null)
const STORAGE_KEY = 'sidequest-sound'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return {
      muted: typeof raw.muted === 'boolean' ? raw.muted : true, // muted until the user says otherwise
      volume: typeof raw.volume === 'number' ? Math.min(1, Math.max(0, raw.volume)) : 0.5,
    }
  } catch {
    return { muted: true, volume: 0.5 }
  }
}

export function SoundProvider({ children }) {
  const { theme } = useThemePreferences()
  const [{ muted, volume }, setPrefs] = useState(load)
  // Never persisted and never true on load: ambient only starts from a button press.
  const [ambientOn, setAmbientOn] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted, volume }))
    } catch {
      /* storage unavailable: preferences just won't persist */
    }
    setMasterLevel(muted, volume)
  }, [muted, volume])

  // One ambient bed at a time; restart it when the theme changes.
  useEffect(() => {
    if (ambientOn) startAmbient(theme)
    else stopAmbient()
    return () => stopAmbient()
  }, [ambientOn, theme])

  // Pause everything while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => (document.hidden ? suspendAudio() : resumeAudio())
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const toggleMute = useCallback(() => {
    ensureContext()
    setPrefs((p) => ({ ...p, muted: !p.muted }))
  }, [])

  const setVolume = useCallback((v) => {
    ensureContext()
    setPrefs((p) => ({ ...p, volume: v }))
  }, [])

  const toggleAmbient = useCallback(() => {
    ensureContext()
    setMasterLevel(muted, volume)
    setAmbientOn((on) => !on)
  }, [muted, volume])

  const sfx = useCallback(
    (name) => {
      if (muted) return
      ensureContext()
      playSfx(name, theme)
    },
    [muted, theme],
  )

  const value = useMemo(
    () => ({ supported: isSupported(), muted, volume, ambientOn, toggleMute, setVolume, toggleAmbient, sfx }),
    [muted, volume, ambientOn, toggleMute, setVolume, toggleAmbient, sfx],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used within a SoundProvider')
  return ctx
}
