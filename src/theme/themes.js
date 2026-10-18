/**
 * Centralized theme registry. CSS custom properties for each theme live in
 * src/index.css (`:root[data-theme="<id>"]`) — the swatch hexes here are
 * metadata for rendering previews in Settings and must stay in sync with it.
 */
export const THEMES = [
  {
    id: 'lofi',
    name: 'Lo-Fi Hideaway',
    description: 'Deep plum and lilac with a warm lamp glow and soft rain.',
    headingFont: 'Nunito',
    swatches: {
      bg: '#39264F',
      surface: '#604777',
      primary: '#EAE0EF',
      accent: '#F0C9A0',
      text: '#FAF5FC',
    },
  },
  {
    id: 'quiet',
    name: 'Quiet Mode',
    description: 'Clean white, cream, and sage for distraction-free focus.',
    headingFont: 'Atkinson Hyperlegible',
    swatches: {
      bg: '#ffffff',
      surface: '#ffffff',
      primary: '#4f7356',
      accent: '#e4dcc3',
      text: '#1f2a1f',
    },
  },
  {
    id: 'sprout',
    name: 'Sprout Garden',
    description: 'Leafy greens and warm paper with swaying plants and drifting leaves.',
    headingFont: 'Fraunces',
    swatches: {
      bg: '#dcefc4',
      surface: '#f8f4e4',
      primary: '#3f7d3a',
      accent: '#f2c14e',
      text: '#23361f',
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
  { id: 'nunito', label: 'Nunito', description: 'Rounded and cozy (overrides body text)' },
  { id: 'atkinson', label: 'Atkinson Hyperlegible', description: 'Designed for maximum legibility' },
]

export const FONT_IDS = FONTS.map((f) => f.id)

export const TEXT_SIZES = [
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' },
]

export const TEXT_SIZE_IDS = TEXT_SIZES.map((s) => s.id)

/** How many game rounds one "break" allows before SideQuest nudges toward studying. */
export const ROUND_LIMITS = [
  { id: '1', label: '1 round', value: 1 },
  { id: '3', label: '3 rounds', value: 3 },
  { id: '5', label: '5 rounds', value: 5 },
  { id: 'none', label: 'No limit', value: Infinity },
]

export const ROUND_LIMIT_IDS = ROUND_LIMITS.map((r) => r.id)

export const DEFAULT_PREFERENCES = {
  theme: 'lofi',
  font: 'theme',
  textSize: 'md',
  reducedMotion: false,
  highContrast: false,
  lowStimulation: false,
  roundLimit: '3',
}
