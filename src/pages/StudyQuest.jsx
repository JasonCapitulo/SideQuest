import Panel from '../components/Panel.jsx'

function StudyQuest({ arrivedFrom }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-[var(--color-text)]">Study Quest</h1>
      <p className="mt-2 text-[var(--color-text-soft)]">
        Your guided study planner will live here soon.
      </p>

      {arrivedFrom === 'game' && (
        <Panel className="mt-6" title="Nice reset!" icon="star" role="status">
          Your mind is warmed up. Pick one small task and make it your first quest.
        </Panel>
      )}

      <Panel className="mt-6" variant="panel" title="Coming soon" icon="quest">
        We&apos;re still building this quest. Check back shortly!
      </Panel>
    </section>
  )
}

export default StudyQuest
