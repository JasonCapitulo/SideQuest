export const EMPTY_BOARD = Array(9).fill(null)

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function getWinner(board) {
  for (const line of LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line }
    }
  }
  return null
}

export function isDraw(board) {
  return board.every((cell) => cell !== null) && !getWinner(board)
}

export function getEmptyIndices(board) {
  const indices = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) indices.push(i)
  }
  return indices
}

export function isGameOver(board) {
  return Boolean(getWinner(board)) || isDraw(board)
}

function minimax(board, mark, opponentMark, turnMark, depth) {
  const winner = getWinner(board)
  if (winner) {
    if (winner.player === mark) return 10 - depth
    return depth - 10
  }
  if (isDraw(board)) return 0

  const empties = getEmptyIndices(board)
  const nextTurnMark = turnMark === mark ? opponentMark : mark
  const scores = empties.map((index) => {
    const next = board.slice()
    next[index] = turnMark
    return minimax(next, mark, opponentMark, nextTurnMark, depth + 1)
  })

  return turnMark === mark ? Math.max(...scores) : Math.min(...scores)
}

/**
 * Picks a move for `computerMark`. `difficulty` 'easy' plays randomly;
 * 'unbeatable' uses minimax to always win or draw.
 */
export function getComputerMove(board, computerMark, humanMark, difficulty = 'unbeatable') {
  const empties = getEmptyIndices(board)
  if (empties.length === 0) return null

  if (difficulty === 'easy') {
    return empties[Math.floor(Math.random() * empties.length)]
  }

  let bestScore = -Infinity
  let bestMove = empties[0]

  for (const index of empties) {
    const next = board.slice()
    next[index] = computerMark
    const score = minimax(next, computerMark, humanMark, humanMark, 1)
    if (score > bestScore) {
      bestScore = score
      bestMove = index
    }
  }

  return bestMove
}
