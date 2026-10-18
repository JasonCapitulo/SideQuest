import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { parseSpotifyUrl } from '../features/spotify/spotifyUrl.js'
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

const SPOTIFY_KEY = 'sidequest-spotify-item'

function loadSpotify() {
  try {
    return parseSpotifyUrl(sessionStorage.getItem(SPOTIFY_KEY))
  } catch {
    return null
  }
}

export function SoundProvider({ children }) {
  const { theme, lowStimulation } = useThemePreferences()
  const [{ muted: mutedPref, volume }, setPrefs] = useState(load)
  // Low-stimulation mode silences everything immediately, without losing the saved mute choice.
  const muted = mutedPref || lowStimulation
  // Never persisted and never true on load: ambient only starts from a button press.
  const [ambientRequested, setAmbientOn] = useState(false)
  // Optional Spotify embed. Only one music source plays at a time: choosing Spotify stops SideQuest's own ambient
  // sound, and closing the player never restarts it. Link only (no credentials); kept for this tab.
  const [spotify, setSpotify] = useState(loadSpotify)
  const ambientOn = ambientRequested && !lowStimulation

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted: mutedPref, volume }))
    } catch {
      /* storage unavailable: preferences just won't persist */
    }
    setMasterLevel(muted, volume)
  }, [mutedPref, muted, volume])

  // Turning low-stimulation on cancels any background sound; it never resumes on its own afterwards.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (lowStimulation) setAmbientOn(false)
  }, [lowStimulation])

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
    if (lowStimulation) return
    ensureContext()
    setPrefs((p) => ({ ...p, muted: !p.muted }))
  }, [lowStimulation])

  const setVolume = useCallback((v) => {
    ensureContext()
    setPrefs((p) => ({ ...p, volume: v }))
  }, [])

  useEffect(() => {
    try {
      if (spotify) sessionStorage.setItem(SPOTIFY_KEY, spotify.openUrl)
      else sessionStorage.removeItem(SPOTIFY_KEY)
    } catch {
      /* in-memory only */
    }
  }, [spotify])

  const toggleAmbient = useCallback(() => {
    if (lowStimulation) return
    ensureContext()
    setMasterLevel(muted, volume)
    if (!ambientOn) setSpotify(null) // switching to SideQuest music removes the Spotify player
    setAmbientOn((on) => !on)
  }, [muted, volume, lowStimulation, ambientOn])

  const playSpotify = useCallback((item) => {
    setAmbientOn(false) // pause theme music immediately
    setSpotify(item)
  }, [])
  const closeSpotify = useCallback(() => setSpotify(null), []) // deliberately leaves theme music off

  const sfx = useCallback(
    (name) => {
      if (muted) return
      ensureContext()
      playSfx(name, theme)
    },
    [muted, theme],
  )

  const value = useMemo(
    () => ({ supported: isSupported(), muted, lowStimulation, volume, ambientOn, toggleMute, setVolume, toggleAmbient, sfx, spotify, playSpotify, closeSpotify }),
    [muted, lowStimulation, volume, ambientOn, toggleMute, setVolume, toggleAmbient, sfx, spotify, playSpotify, closeSpotify],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used within a SoundProvider')
  return ctx
}
