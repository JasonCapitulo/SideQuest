import Button from './Button.jsx'
import StudyRoomScene from './StudyRoomScene.jsx'

function Hero({ onQuickReset, onStartStudying }) {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-6 pb-8 sm:px-6">
      <div className="grid gap-5 rounded-3xl border-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 shadow-sm sm:p-6 md:grid-cols-2 md:items-center md:gap-8">
        <div className="pixel-corners overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
          <StudyRoomScene />
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <span className="inline-block rounded-full bg-[var(--color-accent)]/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-soft)]">
            Welcome back, adventurer
          </span>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug text-[var(--color-text)] sm:text-3xl">
            Ready for a small quest?
          </h1>
          <p className="mt-2 max-w-sm text-sm text-[var(--color-text-soft)] sm:text-base">
            Your study buddy is waiting. Pick a gentle reset or jump straight
            into your next quest.
          </p>

          <div className="mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="primary" onClick={onQuickReset} className="w-full sm:w-auto">
              🎮 Play a Quick Reset
            </Button>
            <Button variant="secondary" onClick={onStartStudying} className="w-full sm:w-auto">
              📖 Help Me Start Studying
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
