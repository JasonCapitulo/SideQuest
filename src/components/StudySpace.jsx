import { useState } from 'react'
import Button from './Button.jsx'
import Panel from './Panel.jsx'
import LofiScene from './scenes/LofiScene.jsx'
import MidnightScene from './scenes/MidnightScene.jsx'
import RetroScene from './scenes/RetroScene.jsx'
import SproutScene from './scenes/SproutScene.jsx'
import { useThemePreferences } from '../context/ThemeContext.jsx'

const SCENES = {
  lofi: LofiScene,
  retro: RetroScene,
  midnight: MidnightScene,
  quiet: null,
}

const TIPS = [
  'Take three slow breaths, then pick ONE tiny task.',
  'Five focused minutes counts. Start small!',
  'Water and a stretch? Your brain will thank you.',
  'Phone face-down. Future you says thanks.',
  'Done beats perfect. Start messy.',
]

/** Home hero: a small interactive study space plus the two main actions. */
function StudySpace({ onQuickReset, onSkipToStudy }) {
  const { theme } = useThemePreferences()
  const [tipIndex, setTipIndex] = useState(0)
  const [pats, setPats] = useState(0)
  const isSprout = theme === 'sprout'
  const Scene = SCENES[theme]
  const tip = TIPS[tipIndex]

  const nextTip = () => setTipIndex((i) => (i + 1) % TIPS.length)
  const pat = () => {
    nextTip()
    setPats((n) => n + 1)
  }

  const scenePane = isSprout ? (
    <Panel variant="panel">
      <SproutScene tip={tip} pats={pats} onPat={pat} />
    </Panel>
  ) : (
    <div className="flex flex-col gap-3">
      {Scene && (
        <div className="pixel-corners overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
          <Scene />
        </div>
      )}
      <p
        role="status"
        aria-live="polite"
        className="rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-text)]"
      >
        {tip}
      </p>
      <Button variant="secondary" onClick={nextTip} className="self-center">
        Another tip
      </Button>
    </div>
  )

  return (
    <section
      aria-labelledby="home-title"
      className={`grid gap-6 md:grid-cols-2 md:items-center md:gap-10 ${
        isSprout
          ? ''
          : theme === 'retro'
            ? 'retro-panel bg-[var(--color-bg-alt)] p-4 sm:p-6'
            : 'rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 shadow-[var(--theme-shadow)] sm:p-6'
      }`}
    >
      {scenePane}

      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <span className="inline-block rounded-full bg-[var(--color-accent)]/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text)]">
          Welcome back, adventurer
        </span>
        <h1
          id="home-title"
          className="font-heading mt-3 text-3xl font-extrabold leading-tight text-[var(--color-text)] sm:text-4xl"
        >
          SideQuest
        </h1>
        <p className="mt-2 max-w-sm text-[var(--color-text-soft)]">
          Can&apos;t get started? Play a two-minute reset game, then turn your to-do list into small
          quests.
        </p>

        <div className="mt-6 flex w-full flex-col gap-4 sm:w-auto">
          <Button size="lg" onClick={onQuickReset}>
            Play a Quick Reset
          </Button>
          <Button variant="secondary" onClick={onSkipToStudy}>
            Skip to Study Quest
          </Button>
        </div>
      </div>
    </section>
  )
}

export default StudySpace
