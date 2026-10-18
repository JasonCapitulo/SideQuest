import { useState } from 'react'
import StartPrompt from '../components/StartPrompt.jsx'
import StudySpace from '../components/StudySpace.jsx'
import { useQuestState } from '../context/QuestStateContext.jsx'

const CHOICE_KEY = 'sidequest-start-choice'

function readChoice() {
  try {
    return sessionStorage.getItem(CHOICE_KEY) === 'skip'
  } catch {
    return false
  }
}

/** Home: one headline, one dominant action, light secondary navigation. */
function Home({ onNavigate }) {
  const { imported } = useQuestState()
  const [prompting, setPrompting] = useState(false)
  const [skipped, setSkipped] = useState(readChoice)

  function start() {
    if (imported || skipped) onNavigate('Games')
    else setPrompting(true)
  }

  function continueWithout() {
    try {
      sessionStorage.setItem(CHOICE_KEY, 'skip') // remembered for this browser tab only
    } catch {
      /* in-memory only */
    }
    setSkipped(true)
    setPrompting(false)
    onNavigate('Study Quest')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <StudySpace
        onStart={start}
        onSkipToStudy={() => onNavigate('Study Quest')}
        onBrowseArcade={() => onNavigate('Games')}
      />
      {prompting && (
        <StartPrompt
          onImport={() => onNavigate('Study Quest', { from: 'import' })}
          onContinue={continueWithout}
          onDismiss={() => setPrompting(false)}
        />
      )}
    </div>
  )
}

export default Home
