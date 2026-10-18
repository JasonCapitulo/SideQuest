import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import Button from '../../components/Button.jsx'

const ERROR_TEXT = {
  'not-allowed': "Microphone access was blocked. You can allow it in your browser's site settings, or just type instead.",
  'service-not-allowed': "Speech recognition isn't allowed in this browser right now. Typing works everywhere.",
  'no-speech': "I didn't hear anything. Try again, or type instead.",
  'audio-capture': 'No microphone was found. You can type instead.',
  network: "The speech service couldn't be reached. Typing works too.",
}

/**
 * Optional dictation. It only starts when the student presses the button, and the
 * recognised words are appended to the (editable) text box, so typing is always available.
 */
function Dictation({ onText }) {
  const SpeechRecognition =
    typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined
  const recRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [error, setError] = useState('')

  useEffect(() => () => recRef.current?.abort?.(), [])

  if (!SpeechRecognition) {
    return (
      <p className="text-sm text-[var(--color-text-soft)]">
        Dictation isn&apos;t available in this browser. Typing works everywhere.
      </p>
    )
  }

  function toggle() {
    if (listening) {
      recRef.current?.stop()
      return
    }
    setError('')
    setHeard('')
    const rec = new SpeechRecognition()
    rec.lang = navigator.language || 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) final += text
        else interim += text
      }
      setHeard(interim)
      if (final.trim()) onText(final.trim())
    }
    rec.onerror = (event) => setError(ERROR_TEXT[event.error] ?? "Dictation didn't work this time. You can type instead.")
    rec.onend = () => {
      setListening(false)
      setHeard('')
    }
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setError("Dictation couldn't start. You can type instead.")
    }
  }

  return (
    <div>
      <Button variant="secondary" onClick={toggle}>
        {listening ? <Square size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
        {listening ? 'Stop dictating' : 'Dictate instead of typing'}
      </Button>
      <p className="mt-1 text-sm text-[var(--color-text-soft)]">
        Optional. Your browser may send your voice to an online service to turn it into text. Whatever it hears is
        added to the box above, where you can edit it.
      </p>
      <p role="status" className="mt-1 text-sm text-[var(--color-text)]">
        {listening ? `Listening… ${heard}` : ''}
      </p>
      {error && (
        <p role="alert" className="mt-1 text-sm font-semibold text-[var(--color-text)]">
          {error}
        </p>
      )}
    </div>
  )
}

export default Dictation
