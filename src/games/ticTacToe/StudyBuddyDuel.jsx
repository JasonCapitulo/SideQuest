import { useEffect, useRef, useState } from 'react'
import { Flower2, Leaf } from 'lucide-react'
import Board from './Board.jsx'
import { useSound } from '../../audio/SoundContext.jsx'
import Companion from '../../components/Companion.jsx'
import TabButton from '../../components/TabButton.jsx'
import { useThemePreferences } from '../../context/ThemeContext.jsx'
import GameResult from '../shared/GameResult.jsx'
import GameShell from '../shared/GameShell.jsx'
import { MODES, useTicTacToe } from './useTicTacToe.js'

const MARK_LABEL = { X: 'Blossom', O: 'Leaf' }

function StudyBuddyDuel({ headingRef, canReplay, roundsPlayed, limit, onRoundComplete, onContinue }) {
  const { theme } = useThemePreferences()
  const { sfx } = useSound()
  const isSprout = theme === 'sprout'
  const [mode, setMode] = useState(MODES.TWO_PLAYER)
  const [difficulty, setDifficulty] = useState('easy')
  const countedRef = useRef(false)
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
  } = useTicTacToe(mode, 'X', difficulty)

  useEffect(() => {
    if (mode !== MODES.VS_COMPUTER || gameOver || currentTurn !== computerMark) return
    const timeoutId = setTimeout(runComputerTurn, 450)
    return () => clearTimeout(timeoutId)
  }, [mode, gameOver, currentTurn, computerMark, runComputerTurn])

  // Report the finished round exactly once.
  useEffect(() => {
    if (gameOver && !countedRef.current) {
      countedRef.current = true
      sfx(winnerInfo ? 'win' : 'correct')
      onRoundComplete()
    }
  }, [gameOver, winnerInfo, onRoundComplete, sfx])

  function resetRound() {
    countedRef.current = false
    restart()
  }

  function handleModeChange(nextMode) {
    setMode(nextMode)
    resetRound()
  }

  const computerWon = Boolean(winnerInfo) && mode === MODES.VS_COMPUTER && winnerInfo.player === computerMark

  let statusMessage
  if (winnerInfo) {
    statusMessage = computerWon ? 'Study Buddy wins this round!' : `${MARK_LABEL[winnerInfo.player]} wins this round!`
  } else if (draw) {
    statusMessage = "It's a cozy draw — well matched!"
  } else if (mode === MODES.VS_COMPUTER && currentTurn === computerMark) {
    statusMessage = isComputerThinking ? 'Study Buddy is thinking…' : "Study Buddy's turn…"
  } else {
    statusMessage = `${MARK_LABEL[currentTurn]}'s turn`
  }

  let companionPose = 'idle'
  if (computerWon) companionPose = 'cool'
  else if (winnerInfo) companionPose = 'cheer'
  else if (draw) companionPose = 'sleepy'

  return (
    <GameShell
      title="Study Buddy Duel"
      headingRef={headingRef}
      instructions={[
        'Take turns placing a mark. Get three in a row to win; a full board is a draw.',
        'Pick Pass & Play for two people, or play against Study Buddy.',
        'Tab to a square and press Enter or Space (or tap) to place your mark.',
      ]}
    >
      {isSprout && (
        <div className="mb-2 flex justify-center">
          <Companion pose={companionPose} size={64} />
        </div>
      )}

      <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-text)]">
        <span className="flex items-center gap-1.5">
          <Flower2 size={16} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
          Blossom (first)
        </span>
        <span className="flex items-center gap-1.5">
          <Leaf size={16} style={{ color: 'var(--color-secondary)' }} aria-hidden="true" />
          Leaf
        </span>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Game mode">
        <TabButton
          role="radio"
          aria-checked={mode === MODES.TWO_PLAYER}
          selected={mode === MODES.TWO_PLAYER}
          onClick={() => handleModeChange(MODES.TWO_PLAYER)}
        >
          Pass & Play
        </TabButton>
        <TabButton
          role="radio"
          aria-checked={mode === MODES.VS_COMPUTER}
          selected={mode === MODES.VS_COMPUTER}
          onClick={() => handleModeChange(MODES.VS_COMPUTER)}
        >
          Vs. Study Buddy
        </TabButton>
      </div>

      {mode === MODES.VS_COMPUTER && (
        <div className="mt-3 flex justify-center">
          <label className="flex items-center gap-2 text-[var(--color-text)]">
            Study Buddy plays
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value)
                resetRound()
              }}
              className="min-h-11 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-card)] px-2 text-[var(--color-text)]"
            >
              <option value="easy">Gently (random moves)</option>
              <option value="unbeatable">Smartly (hard to beat)</option>
            </select>
          </label>
        </div>
      )}

      <p role="status" aria-live="polite" className="mt-4 text-center text-lg font-bold text-[var(--color-text)]">
        {statusMessage}
      </p>

      <div className="mt-3">
        <Board
          board={board}
          onPlay={(i) => {
            sfx('click')
            handleCellPlay(i)
          }}
          disabled={gameOver || (mode === MODES.VS_COMPUTER && currentTurn === computerMark)}
          winningLine={winnerInfo?.line}
        />
      </div>

      {gameOver ? (
        <GameResult
          headline={statusMessage}
          canReplay={canReplay}
          roundsPlayed={roundsPlayed}
          limit={limit}
          onReplay={() => {
            resetRound()
            headingRef?.current?.focus()
          }}
          onContinue={onContinue}
        />
      ) : (
        <div className="mt-4 flex justify-center">
          <TabButton onClick={resetRound}>Restart this round</TabButton>
        </div>
      )}
    </GameShell>
  )
}

export default StudyBuddyDuel
