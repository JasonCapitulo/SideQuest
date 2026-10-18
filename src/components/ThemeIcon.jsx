import {
  BookOpen,
  Contrast,
  Gamepad2,
  Home,
  Leaf,
  Palette,
  Settings,
  Sparkles,
  Star,
  Trophy,
  Type,
  WandSparkles,
} from 'lucide-react'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { Glyph } from './Sprite.jsx'

// name -> [lucide icon, Sprout glyph]. Sprout Garden uses the kit's own glyphs;
// every other theme keeps the line icons.
const ICONS = {
  home: [Home, 'home'],
  games: [Gamepad2, 'gamepad'],
  quest: [BookOpen, 'trophy'],
  settings: [Settings, 'gear'],
  reset: [Leaf, 'star'],
  palette: [Palette, 'crown'],
  type: [Type, 'chat'],
  size: [WandSparkles, 'plus'],
  motion: [Sparkles, 'star'],
  contrast: [Contrast, 'alert'],
  star: [Star, 'star'],
  trophy: [Trophy, 'trophy'],
}

/** Decorative icon (aria-hidden). Pair it with visible text. */
function ThemeIcon({ name, size = 18, tone = 'brown' }) {
  const { theme } = useThemePreferences()
  const [LucideIcon, glyph] = ICONS[name] ?? []
  if (!LucideIcon) return null
  if (theme === 'sprout') return <Glyph name={glyph} tone={tone} scale={Math.max(1, Math.round(size / 12))} />
  return <LucideIcon size={size} aria-hidden="true" />
}

export default ThemeIcon
