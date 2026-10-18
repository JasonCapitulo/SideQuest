import { createContext, useContext, useEffect, useState } from 'react'
import {
  DEFAULT_PREFERENCES,
  FONT_IDS,
  ROUND_LIMIT_IDS,
  TEXT_SIZE_IDS,
  THEME_IDS,
} from '../theme/themes.js'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'sidequest-preferences'

function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    // 'nunito' used to be the default body font and would mask per-theme typography.
    if (parsed.font === 'nunito') parsed.font = 'theme'
    return parsed
  } catch {
    return {}
  }
}

function systemPrefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return DEFAULT_PREFERENCES.reducedMotion
  }
}

export function ThemeProvider({ children }) {
  const stored = loadPreferences()
  const [theme, setTheme] = useState(
    THEME_IDS.includes(stored.theme) ? stored.theme : DEFAULT_PREFERENCES.theme,
  )
  const [font, setFont] = useState(
    FONT_IDS.includes(stored.font) ? stored.font : DEFAULT_PREFERENCES.font,
  )
  const [textSize, setTextSize] = useState(
    TEXT_SIZE_IDS.includes(stored.textSize) ? stored.textSize : DEFAULT_PREFERENCES.textSize,
  )
  const [reducedMotion, setReducedMotion] = useState(
    typeof stored.reducedMotion === 'boolean' ? stored.reducedMotion : systemPrefersReducedMotion(),
  )
  const [highContrast, setHighContrast] = useState(
    typeof stored.highContrast === 'boolean'
      ? stored.highContrast
      : DEFAULT_PREFERENCES.highContrast,
  )

  const [lowStimulation, setLowStimulation] = useState(
    typeof stored.lowStimulation === 'boolean' ? stored.lowStimulation : DEFAULT_PREFERENCES.lowStimulation,
  )
  const [roundLimit, setRoundLimit] = useState(
    ROUND_LIMIT_IDS.includes(stored.roundLimit) ? stored.roundLimit : DEFAULT_PREFERENCES.roundLimit,
  )

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-font', font)
    root.setAttribute('data-text-size', textSize)
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false')
    root.setAttribute('data-contrast', highContrast ? 'high' : 'normal')
    root.setAttribute('data-low-stim', lowStimulation ? 'true' : 'false')
    // Low-stimulation implies reduced motion for everything that keys off it.
    if (lowStimulation) root.setAttribute('data-reduced-motion', 'true')
  }, [theme, font, textSize, reducedMotion, highContrast, lowStimulation])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme, font, textSize, reducedMotion, highContrast, lowStimulation, roundLimit }),
    )
  }, [theme, font, textSize, reducedMotion, highContrast, lowStimulation, roundLimit])

  const value = {
    theme,
    setTheme,
    font,
    setFont,
    textSize,
    setTextSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    lowStimulation,
    setLowStimulation,
    roundLimit,
    setRoundLimit,
    prefersReducedMotion: reducedMotion || lowStimulation,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemePreferences() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemePreferences must be used within a ThemeProvider')
  return ctx
}
