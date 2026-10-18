import { useEffect, useState } from 'react'
import Board from './Board.jsx'
import Button from '../../components/Button.jsx'
import { MODES, useTicTacToe } from './useTicTacToe.js'

const MARK_LABEL = { X: 'Blossom (🌸)', O: 'Leaf (🍃)' }

function StudyBuddyDuel({ onContinueToStudyQuest }) {
  const [mode, setMode] = useState(MODES.TWO_PLAYER)
  const {
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
  } = useTicTacToe(mode, 'X')

  useEffect(() => {
    if (mode !== MODES.VS_COMPUTER || gameOver || currentTurn !== computerMark) return
    const timeoutId = setTimeout(runComputerTurn, 450)
    return () => clearTimeout(timeoutId)
  }, [mode, gameOver, currentTurn, computerMark, runComputerTurn])

  function handleModeChange(nextMode) {
    setMode(nextMode)
    restart()
  }

  let statusMessage
  if (winnerInfo) {
    statusMessage =
      mode === MODES.VS_COMPUTER && winnerInfo.player === computerMark
        ? 'Study Buddy wins this round!'
        : `${MARK_LABEL[winnerInfo.player]} wins this round!`
  } else if (draw) {
    statusMessage = "It's a cozy draw — well matched!"
  } else if (mode === MODES.VS_COMPUTER && currentTurn === computerMark) {
    statusMessage = isComputerThinking ? 'Study Buddy is thinking…' : "Study Buddy's turn…"
  } else {
    statusMessage = `${MARK_LABEL[currentTurn]}'s turn`
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="text-center text-3xl font-extrabold text-[var(--color-text)]">
        Study Buddy Duel
      </h1>
      <p className="mt-2 text-center text-[var(--color-text-soft)]">
        A quick, friendly round of tic-tac-toe to warm up your focus.
      </p>

      <div className="mt-6 flex justify-center gap-2" role="radiogroup" aria-label="Game mode">
        <button
          type="button"
          role="radio"
          aria-checked={mode === MODES.TWO_PLAYER}
          onClick={() => handleModeChange(MODES.TWO_PLAYER)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
            mode === MODES.TWO_PLAYER
              ? 'bg-[var(--color-primary)] text-white'
              : 'border-2 border-[var(--color-border)] text-[var(--color-text-soft)]'
          }`}
        >
          Pass & Play
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === MODES.VS_COMPUTER}
          onClick={() => handleModeChange(MODES.VS_COMPUTER)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
            mode === MODES.VS_COMPUTER
              ? 'bg-[var(--color-primary)] text-white'
              : 'border-2 border-[var(--color-border)] text-[var(--color-text-soft)]'
          }`}
        >
          Vs. Study Buddy
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-6 text-center text-lg font-bold text-[var(--color-text)]"
      >
        {statusMessage}
      </p>

      <div className="mt-4">
        <Board
          board={board}
          onPlay={handleCellPlay}
          disabled={gameOver || (mode === MODES.VS_COMPUTER && currentTurn === computerMark)}
          winningLine={winnerInfo?.line}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {gameOver ? (
          <>
            <Button variant="primary" onClick={onContinueToStudyQuest}>
              📖 Continue to Study Quest
            </Button>
            <Button variant="secondary" onClick={restart}>
              🔁 Play Again
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={restart}>
            🔁 Restart
          </Button>
        )}
      </div>
    </div>
  )
}

export default StudyBuddyDuel
