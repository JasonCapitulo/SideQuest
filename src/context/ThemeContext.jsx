import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const THEMES = ['lavender', 'sage', 'peach', 'midnight']
const FONTS = ['nunito', 'atkinson']
const SIZES = ['sm', 'md', 'lg']

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
  const [theme, setTheme] = useState(THEMES.includes(stored.theme) ? stored.theme : 'lavender')
  const [font, setFont] = useState(FONTS.includes(stored.font) ? stored.font : 'nunito')
  const [textSize, setTextSize] = useState(SIZES.includes(stored.textSize) ? stored.textSize : 'md')
  const [reducedMotion, setReducedMotion] = useState(Boolean(stored.reducedMotion))

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-font', font)
    root.setAttribute('data-text-size', textSize)
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false')
  }, [theme, font, textSize, reducedMotion])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ theme, font, textSize, reducedMotion }),
    )
  }, [theme, font, textSize, reducedMotion])

  const value = {
    theme,
    setTheme,
    font,
    setFont,
    textSize,
    setTextSize,
    reducedMotion,
    setReducedMotion,
    THEMES,
    FONTS,
    SIZES,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemePreferences() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemePreferences must be used within a ThemeProvider')
  return ctx
}
