import StudyBuddyDuel from '../games/ticTacToe/StudyBuddyDuel.jsx'

function Games({ onNavigate }) {
  return (
    <section className="py-8">
      <StudyBuddyDuel onContinueToStudyQuest={() => onNavigate('Study Quest')} />
    </section>
  )
}

export default Games
