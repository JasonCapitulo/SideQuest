import Hero from '../components/Hero.jsx'
import Card from '../components/Card.jsx'

function Home({ onNavigate }) {
  return (
    <>
      <Hero
        onQuickReset={() => onNavigate('Games')}
        onStartStudying={() => onNavigate('Study Quest')}
      />

      <section className="mx-auto grid max-w-5xl gap-3 px-4 pb-10 sm:grid-cols-3 sm:px-6">
        <Card title="Quick Reset" icon="🌿" className="py-4">
          A 2-minute mini-game to calm a racing mind before you dive in.
        </Card>
        <Card title="Study Quest" icon="📖" className="py-4">
          Turn your to-do list into bite-sized quests with built-in breaks.
        </Card>
        <Card title="Settings" icon="⚙️" className="py-4">
          Pick a cozy theme, a comfy font, and a pace that feels like you.
        </Card>
      </section>
    </>
  )
}

export default Home
