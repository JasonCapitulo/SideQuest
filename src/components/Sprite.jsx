import {
  CAT,
  CAT_POSES,
  GLYPHS,
  SPECIAL,
  SPECIAL_CELLS,
  glyphCell,
} from '../theme/sprout.js'

/**
 * Draws one cell of a sprite sheet with CSS background positioning at an
 * integer scale, so pixels stay crisp. Purely decorative: it is aria-hidden
 * and never carries meaning on its own.
 */
function Sprite({ sheet, col, row, size, scale = 2, className = '', style }) {
  const px = size * scale
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: px,
        height: px,
        backgroundImage: `url(${sheet.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${sheet.sheetW * scale}px ${sheet.sheetH * scale}px`,
        backgroundPosition: `-${col * size * scale}px -${row * size * scale}px`,
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  )
}

export function CatSprite({ pose = 'idle', scale = 3, className, style }) {
  const [col, row] = CAT_POSES[pose] ?? CAT_POSES.idle
  return <Sprite sheet={CAT} col={col} row={row} size={CAT.frame} scale={scale} className={className} style={style} />
}

export function Glyph({ name, tone = 'brown', scale = 2, className }) {
  const cell = glyphCell(name, tone)
  if (!cell) return null
  return <Sprite sheet={GLYPHS} col={cell[0]} row={cell[1]} size={GLYPHS.cell} scale={scale} className={className} />
}

export function SpecialSprite({ name, scale = 2, className, style }) {
  const [col, row] = SPECIAL_CELLS[name]
  return <Sprite sheet={SPECIAL} col={col} row={row} size={SPECIAL.cell} scale={scale} className={className} style={style} />
}

export default Sprite
