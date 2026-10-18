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

const ICONS = {
  home: Home,
  games: Gamepad2,
  quest: BookOpen,
  settings: Settings,
  reset: Leaf,
  palette: Palette,
  type: Type,
  size: WandSparkles,
  motion: Sparkles,
  contrast: Contrast,
  star: Star,
  trophy: Trophy,
}

/** Decorative icon (aria-hidden). Pair it with visible text. */
function ThemeIcon({ name, size = 18 }) {
  const Icon = ICONS[name]
  if (!Icon) return null
  return <Icon size={size} aria-hidden="true" />
}

export default ThemeIcon
