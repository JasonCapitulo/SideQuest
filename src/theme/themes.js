/**
 * Centralized theme registry. CSS custom properties for each theme live in
 * src/index.css (`:root[data-theme="<id>"]`) — the swatch hexes here are
 * metadata for rendering previews in Settings and must stay in sync with it.
 */
export const THEMES = [
  {
    id: 'lofi',
    name: 'Lo-Fi Hideaway',
    description: 'Dusty lavender and cream with warm lamp lighting.',
    headingFont: 'DM Sans',
    swatches: {
      bg: '#f1e7ec',
      surface: '#fffaf3',
      primary: '#b08bb8',
      accent: '#f0c9a0',
      text: '#3d2f3a',
    },
  },
  {
    id: 'quiet',
    name: 'Quiet Mode',
    description: 'Clean white, cream, and sage for distraction-free focus.',
    headingFont: 'DM Sans',
    swatches: {
      bg: '#ffffff',
      surface: '#ffffff',
      primary: '#6b8f71',
      accent: '#e4dcc3',
      text: '#1f2a1f',
    },
  },
  {
    id: 'sprout',
    name: 'Sprout Garden',
    description: 'A cozy pixel-art garden built from hand-drawn wooden UI pieces.',
    headingFont: 'Sprout Pixel',
    swatches: {
      bg: '#a9c779',
      surface: '#dcb98a',
      primary: '#6f8f3a',
      accent: '#c0d470',
      text: '#3f2a1c',
    },
  },
  {
    id: 'retro',
    name: 'Retro Arcade',
    description: 'Pastel peach, mint, and pink with chunky arcade borders and hard shadows.',
    headingFont: 'Pixelify Sans',
    swatches: {
      bg: '#fdeef0',
      surface: '#ffffff',
      primary: '#ff9eb0',
      accent: '#ffd88a',
      text: '#3a2a3d',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Library',
    description: 'Navy and indigo with muted gold and quiet celestial motifs.',
    headingFont: 'Fraunces',
    swatches: {
      bg: '#141a30',
      surface: '#222c4d',
      primary: '#5b6fb0',
      accent: '#c7a44a',
      text: '#e8e6f5',
    },
  },
]

export const THEME_IDS = THEMES.map((t) => t.id)

export const FONTS = [
  { id: 'theme', label: 'Match theme', description: "Uses each theme's own typeface" },
  { id: 'nunito', label: 'Nunito', description: 'Rounded and cozy' },
  { id: 'atkinson', label: 'Atkinson Hyperlegible', description: 'Designed for maximum legibility' },
]

export const FONT_IDS = FONTS.map((f) => f.id)

export const TEXT_SIZES = [
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' },
]

export const TEXT_SIZE_IDS = TEXT_SIZES.map((s) => s.id)

export const DEFAULT_PREFERENCES = {
  theme: 'lofi',
  font: 'theme',
  textSize: 'md',
  reducedMotion: false,
  highContrast: false,
}
