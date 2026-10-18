/**
 * Asset map for the Sprout Garden theme. Every file lives in
 * public/assets/sprout-garden/ and was sliced from the Sprout Lands UI Pack
 * (see that pack's read_me.txt for its license). These are only ever rendered
 * when the active theme is `sprout` — see Sprite.jsx and sprout.css.
 */
export const SPROUT_BASE = '/assets/sprout-garden/'

export const sproutUrl = (file) => `${SPROUT_BASE}${file}`

/** Cat companion: 160x480 sheet of 32x32 frames (5 columns x 15 rows). */
export const CAT = { src: sproutUrl('cat.png'), sheetW: 160, sheetH: 480, frame: 32 }

// [column, row] of each pose in the cat sheet.
export const CAT_POSES = {
  idle: [0, 0],
  blink: [1, 3],
  happy: [0, 4],
  cheer: [1, 6],
  cool: [0, 8],
  grumpy: [0, 9],
  sleepy: [0, 12],
  sleep: [0, 13],
}

/** Stars / hearts / coin: 112x64 sheet of 16x16 cells. */
export const SPECIAL = { src: sproutUrl('special.png'), sheetW: 112, sheetH: 64, cell: 16 }

/** Small glyph icons: 288x48 sheet of 16x16 cells in white, cream and brown sets. */
export const GLYPHS = { src: sproutUrl('glyphs.png'), sheetW: 288, sheetH: 48, cell: 16 }

// name -> [column, row] within the white set. Cream is +6 columns.
const WHITE_SET = {
  gamepad: [0, 0], chat: [1, 0], skull: [2, 0], gear: [3, 0], help: [4, 0], star: [5, 0],
  alert: [0, 1], coin: [1, 1], cart: [2, 1], podium: [3, 1], trophy: [4, 1], crown: [5, 1],
  plus: [0, 2], minus: [1, 2], home: [2, 2], check: [3, 2], x: [4, 2], no: [5, 2],
}

// The brown set is rotated relative to the other two, so it has its own table.
const BROWN_SET = {
  gear: [12, 0], help: [13, 0], star: [14, 0], gamepad: [15, 0], chat: [16, 0], skull: [17, 0],
  podium: [12, 1], trophy: [13, 1], crown: [14, 1], alert: [15, 1], coin: [16, 1], cart: [17, 1],
  check: [12, 2], x: [13, 2], no: [14, 2], plus: [15, 2], minus: [16, 2], home: [17, 2],
}

export function glyphCell(name, tone = 'brown') {
  if (tone === 'brown') return BROWN_SET[name]
  const [col, row] = WHITE_SET[name] ?? []
  if (col === undefined) return undefined
  return [tone === 'cream' ? col + 6 : col, row]
}

/** Cells in the special sheet: row 1 has the white-outlined stars and hearts. */
export const SPECIAL_CELLS = {
  star: [0, 1],
  heart: [3, 1],
  coin: [6, 1],
}
