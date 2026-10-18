import { useThemePreferences } from '../context/ThemeContext.jsx'

/** Labelled on/off control. Always a real checkbox, so keyboard and screen readers work. */
function Switch({ checked, onChange, label, hint }) {
  const { theme } = useThemePreferences()
  const isSprout = theme === 'sprout'

  return (
    <label
      className={`flex cursor-pointer items-center gap-3 p-3 ${
        isSprout ? '' : 'rounded-xl border-2 border-[var(--color-border)]'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={isSprout ? 'sg-switch-input sr-only' : 'h-4 w-4 accent-[var(--color-primary)]'}
      />
      {isSprout && (
        <span className="sg-switch-track" aria-hidden="true">
          <span className="sg-switch-knob" />
        </span>
      )}
      <span>
        <span className="block text-[var(--color-text)]">{label}</span>
        {hint && <span className="block text-xs text-[var(--color-text-soft)]">{hint}</span>}
      </span>
    </label>
  )
}

export default Switch
