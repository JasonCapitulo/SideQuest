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

/** Home hero: headline, one dominant action, and a compact themed scene. */
function StudySpace({ onStart, onSkipToStudy, onBrowseArcade }) {
  const { theme, lowStimulation } = useThemePreferences()
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length))
  const [pats, setPats] = useState(0)
  const isSprout = theme === 'sprout'
  const Scene = SCENES[theme]
  const tip = TIPS[tipIndex]
  const showScene = !lowStimulation && (isSprout || Scene)

  const pat = () => {
    setTipIndex((i) => (i + 1) % TIPS.length)
    setPats((n) => n + 1)
  }

  const linkClass =
    'inline-flex min-h-11 items-center rounded-lg px-2 font-semibold text-[var(--color-text)] underline decoration-2 underline-offset-4 hover:text-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]'

  return (
    <section
      aria-labelledby="home-title"
      className={`grid items-center gap-8 md:gap-12 ${showScene ? 'md:grid-cols-2' : 'mx-auto max-w-xl text-center'}`}
    >
      <div className={`flex flex-col ${showScene ? 'items-center text-center md:items-start md:text-left' : 'items-center'}`}>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-soft)]">
          Welcome back, adventurer
        </p>
        <h1
          id="home-title"
          className="font-heading mt-3 max-w-full break-words text-3xl font-extrabold leading-tight text-[var(--color-text)] sm:text-5xl"
        >
          Small steps start here.
        </h1>
        <p className="mt-4 max-w-md text-lg text-[var(--color-text-soft)]">
          Play a two-minute reset, then turn your to-do list into one small quest.
        </p>

        <div className="mt-8">
          <Button size="lg" onClick={onStart}>
            Start a SideQuest
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 md:justify-start">
          <button type="button" onClick={onSkipToStudy} className={linkClass}>
            Skip to Study Quest
          </button>
          <button type="button" onClick={onBrowseArcade} className={linkClass}>
            Browse the Arcade
          </button>
        </div>
      </div>

      {showScene &&
        (isSprout ? (
          <Panel variant="panel">
            <SproutScene tip={tip} pats={pats} onPat={pat} />
          </Panel>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className={`overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-surface)] ${
                theme === 'retro' ? 'pixel-corners' : 'rounded-2xl'
              }`}
            >
              <Scene />
            </div>
            <p role="status" aria-live="polite" className="text-center text-sm text-[var(--color-text-soft)]">
              {tip}
            </p>
          </div>
        ))}
    </section>
  )
}

export default StudySpace
