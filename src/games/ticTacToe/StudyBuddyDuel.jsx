import { useEffect, useState } from 'react'
import { Flower2, Leaf } from 'lucide-react'
import Board from './Board.jsx'
import Button from '../../components/Button.jsx'
import Panel from '../../components/Panel.jsx'
import { CatSprite, SpecialSprite } from '../../components/Sprite.jsx'
import TabButton from '../../components/TabButton.jsx'
import { useThemePreferences } from '../../context/ThemeContext.jsx'
import { MODES, useTicTacToe } from './useTicTacToe.js'

const MARK_LABEL = { X: 'Blossom', O: 'Leaf' }

function StudyBuddyDuel({ onContinueToStudyQuest }) {
  const { theme } = useThemePreferences()
  const isSprout = theme === 'sprout'
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

  const computerWon = Boolean(winnerInfo) && mode === MODES.VS_COMPUTER && winnerInfo.player === computerMark

  let statusMessage
  if (winnerInfo) {
    statusMessage = computerWon
      ? 'Study Buddy wins this round!'
      : `${MARK_LABEL[winnerInfo.player]} wins this round!`
  } else if (draw) {
    statusMessage = "It's a cozy draw — well matched!"
  } else if (mode === MODES.VS_COMPUTER && currentTurn === computerMark) {
    statusMessage = isComputerThinking ? 'Study Buddy is thinking…' : "Study Buddy's turn…"
  } else {
    statusMessage = `${MARK_LABEL[currentTurn]}'s turn`
  }

  // The Sprout Garden cat reacts to how the round is going.
  let catPose = 'idle'
  if (computerWon) catPose = 'cool'
  else if (winnerInfo) catPose = 'cheer'
  else if (draw) catPose = 'sleepy'
  else if (isComputerThinking) catPose = 'blink'

  return (
    <Panel variant="panel" className="mx-auto mt-8 max-w-xl" as="section" aria-labelledby="duel-title">
      <div className="px-2 py-4 sm:px-4">
        <div className="flex flex-col items-center gap-2">
          {isSprout && <CatSprite pose={catPose} scale={3} />}
          <h2
            id="duel-title"
            className="font-heading text-center text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl"
          >
            Study Buddy Duel
          </h2>
        </div>
        <p className="mt-2 text-center text-[var(--color-text-soft)]">
          A quick, friendly round of tic-tac-toe to warm up your focus.
        </p>

        <div className="mt-5 flex items-center justify-center gap-4 text-sm text-[var(--color-text-soft)]">
          <span className="flex items-center gap-1.5">
            {isSprout ? (
              <SpecialSprite name="star" scale={1} />
            ) : (
              <Flower2 size={16} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            )}
            Blossom
          </span>
          <span className="flex items-center gap-1.5">
            {isSprout ? (
              <SpecialSprite name="heart" scale={1} />
            ) : (
              <Leaf size={16} style={{ color: 'var(--color-secondary)' }} aria-hidden="true" />
            )}
            Leaf
          </span>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Game mode">
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
                Continue to Study Quest
              </Button>
              <Button variant="secondary" onClick={restart}>
                Play Again
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={restart}>
              Restart
            </Button>
          )}
        </div>
      </div>
    </Panel>
  )
}

export default StudyBuddyDuel
