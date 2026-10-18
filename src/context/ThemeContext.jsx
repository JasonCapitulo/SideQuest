import { createContext, useContext, useEffect, useState } from 'react'
import {
  DEFAULT_PREFERENCES,
  FONT_IDS,
  TEXT_SIZE_IDS,
  THEME_IDS,
} from '../theme/themes.js'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'sidequest-preferences'

function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
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
    typeof stored.reducedMotion === 'boolean'
      ? stored.reducedMotion
      : DEFAULT_PREFERENCES.reducedMotion,
  )
  const [highContrast, setHighContrast] = useState(
    typeof stored.highContrast === 'boolean'
      ? stored.highContrast
      : DEFAULT_PREFERENCES.highContrast,
  )

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-font', font)
    root.setAttribute('data-text-size', textSize)
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false')
    root.setAttribute('data-contrast', highContrast ? 'high' : 'normal')
  }, [theme, font, textSize, reducedMotion, highContrast])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme, font, textSize, reducedMotion, highContrast }),
    )
  }, [theme, font, textSize, reducedMotion, highContrast])

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
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemePreferences() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemePreferences must be used within a ThemeProvider')
  return ctx
}
