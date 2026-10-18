import Card from '../components/Card.jsx'

function StudyQuest() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-[var(--color-text)]">Study Quest</h1>
      <p className="mt-2 text-[var(--color-text-soft)]">
        Your guided study planner will live here soon.
      </p>
      <Card className="mt-6" title="Coming soon" icon="📖">
        We're still building this quest. Check back shortly!
      </Card>
    </section>
  )
}

export default StudyQuest
