import { useCallback, useMemo, useState } from 'react'
import { EMPTY_BOARD, getComputerMove, getWinner, isDraw, isGameOver } from './logic.js'

export const MODES = {
  TWO_PLAYER: 'two-player',
  VS_COMPUTER: 'vs-computer',
}

export function useTicTacToe(mode = MODES.TWO_PLAYER, humanMark = 'X') {
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [currentTurn, setCurrentTurn] = useState('X')
  const [isComputerThinking, setIsComputerThinking] = useState(false)

  const winnerInfo = useMemo(() => getWinner(board), [board])
  const draw = useMemo(() => isDraw(board), [board])
  const gameOver = Boolean(winnerInfo) || draw
  const computerMark = humanMark === 'X' ? 'O' : 'X'

  const playMove = useCallback(
    (index) => {
      if (gameOver || board[index] !== null) return
      const next = board.slice()
      next[index] = currentTurn
      setBoard(next)
      setCurrentTurn(currentTurn === 'X' ? 'O' : 'X')
    },
    [board, currentTurn, gameOver],
  )

  const handleCellPlay = useCallback(
    (index) => {
      if (mode === MODES.VS_COMPUTER && currentTurn !== humanMark) return
      playMove(index)
    },
    [mode, currentTurn, humanMark, playMove],
  )

  const runComputerTurn = useCallback(() => {
    if (mode !== MODES.VS_COMPUTER) return
    if (gameOver) return
    if (currentTurn !== computerMark) return

    setIsComputerThinking(true)
    const move = getComputerMove(board, computerMark, humanMark, 'unbeatable')
    setIsComputerThinking(false)
    if (move !== null && !isGameOver(board)) {
      playMove(move)
    }
  }, [mode, gameOver, currentTurn, computerMark, board, humanMark, playMove])

  const restart = useCallback(() => {
    setBoard(EMPTY_BOARD)
    setCurrentTurn('X')
  }, [])

  return {
    board,
    currentTurn,
    winnerInfo,
    draw,
    gameOver,
    isComputerThinking,
    computerMark,
    handleCellPlay,
    runComputerTurn,
    restart,
  }
}
