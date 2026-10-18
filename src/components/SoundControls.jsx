import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../audio/SoundContext.jsx'
import Button from './Button.jsx'

/** Sound is OFF until the user turns it on. Mute, play/pause and volume are all real controls. */
function SoundControls() {
  const { supported, muted, volume, ambientOn, toggleMute, setVolume, toggleAmbient } = useSound()

  if (!supported) {
    return <p className="text-sm text-[var(--color-text-soft)]">Sound isn&apos;t available in this browser.</p>
  }

  return (
    <section aria-labelledby="sound-heading" className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <h2 id="sound-heading" className="text-sm font-bold text-[var(--color-text)]">
        Sound
      </h2>

      <Button variant="secondary" onClick={toggleMute} className="!px-3 !py-2 text-sm">
        {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
        {muted ? 'Muted — unmute' : 'Sound on — mute'}
      </Button>

      <Button variant="secondary" onClick={toggleAmbient} className="!px-3 !py-2 text-sm">
        {ambientOn ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        {ambientOn ? 'Pause background sound' : 'Play background sound'}
      </Button>

      <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
        Volume
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={Math.round(volume * 100)}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          aria-valuetext={`${Math.round(volume * 100)} percent`}
          className="h-6 w-28 accent-[var(--color-primary)]"
        />
      </label>

      {ambientOn && muted && (
        <p role="status" className="text-sm text-[var(--color-text-soft)]">
          Background sound is playing but muted.
        </p>
      )}
    </section>
  )
}

export default SoundControls
