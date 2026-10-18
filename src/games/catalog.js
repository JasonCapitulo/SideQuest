/**
 * The Arcade lineup. Every entry here is implemented and playable; do not add a
 * game until its component exists. `component` names are resolved in Games.jsx.
 */
export const GAMES = [
  {
    id: 'tic-tac-toe',
    title: 'Study Buddy Duel',
    icon: 'games',
    blurb: 'Tic-tac-toe with a friend or a gentle computer opponent.',
    meta: '1–2 players',
    hue: '#5b84e0',
    howTo: 'Take turns placing X and O. Three in a row wins.',
  },
  {
    id: 'memory-garden',
    title: 'Memory Garden',
    icon: 'reset',
    blurb: 'Match six pairs of plants. No timer.',
    meta: 'Untimed',
    hue: '#4fa564',
    howTo: 'Flip two cards at a time and match all six plant pairs. No timer.',
  },
  {
    id: 'whack-a-sprout',
    title: 'Whack-a-Sprout',
    icon: 'star',
    blurb: 'Tap the sprout before it hides. Relaxed or timed.',
    meta: 'Adjustable',
    hue: '#e0883f',
    howTo: 'Tap each sprout before it hides. Choose relaxed or timed.',
  },
  {
    id: 'color-hop',
    title: 'Color Hop',
    icon: 'motion',
    blurb: 'Match colour and shape to hop through 8 gates.',
    meta: 'Untimed',
    hue: '#a665d6',
    howTo: 'Match the gate’s colour and shape to hop through all eight.',
  },
  {
    id: 'fruit-flick',
    title: 'Fruit Flick',
    icon: 'trophy',
    blurb: 'Swipe, tap or click to slice 12 fruits.',
    meta: 'Keyboard option',
    hue: '#d9546a',
    howTo: 'Swipe, tap or press keys to slice 12 fruits. Keyboard works too.',
  },
]
