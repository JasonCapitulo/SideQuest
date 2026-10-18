import Cell from './Cell.jsx'

function Board({ board, onPlay, disabled, winningLine }) {
  return (
    <div
      role="group"
      aria-label="Tic-tac-toe board"
      className="mx-auto grid w-full max-w-[15rem] grid-cols-3 gap-2 sm:max-w-[17rem]"
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          onPlay={onPlay}
          disabled={disabled}
          isWinningCell={Boolean(winningLine?.includes(index))}
        />
      ))}
    </div>
  )
}

export default Board
