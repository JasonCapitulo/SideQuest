import Card from '../components/Card.jsx'
import ThemeOptionButton from '../components/ThemeOptionButton.jsx'
import { useThemePreferences } from '../context/ThemeContext.jsx'

const FONT_LABELS = {
  nunito: 'Nunito (rounded & cozy)',
  atkinson: 'Atkinson Hyperlegible (extra readable)',
}

const SIZE_LABELS = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
}

function Settings() {
  const {
    theme,
    setTheme,
    font,
    setFont,
    textSize,
    setTextSize,
    reducedMotion,
    setReducedMotion,
    THEMES,
    FONTS,
    SIZES,
  } = useThemePreferences()

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-[var(--color-text)]">Settings</h1>
      <p className="mt-2 text-[var(--color-text-soft)]">
        Make SideQuest feel like yours. Your choices are saved automatically.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card title="Theme" icon="🎨">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {THEMES.map((themeName) => (
              <ThemeOptionButton
                key={themeName}
                themeName={themeName}
                isActive={theme === themeName}
                onSelect={setTheme}
              />
            ))}
          </div>
        </Card>

        <Card title="Font" icon="🔤">
          <div className="flex flex-col gap-2">
            {FONTS.map((fontName) => (
              <label
                key={fontName}
                className="flex items-center gap-3 rounded-xl border-2 border-[var(--color-border)] p-3"
              >
                <input
                  type="radio"
                  name="font"
                  value={fontName}
                  checked={font === fontName}
                  onChange={() => setFont(fontName)}
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />
                <span className="text-[var(--color-text)]">{FONT_LABELS[fontName]}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card title="Text size" icon="🔍">
          <div className="flex gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                aria-pressed={textSize === size}
                className={`flex-1 rounded-xl border-2 p-3 font-semibold ${
                  textSize === size
                    ? 'border-[var(--color-primary)] bg-[var(--color-bg)] text-[var(--color-text)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-soft)]'
                }`}
              >
                {SIZE_LABELS[size]}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Motion" icon="🧘">
          <label className="flex items-center gap-3 rounded-xl border-2 border-[var(--color-border)] p-3">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            <span className="text-[var(--color-text)]">Reduce motion and animations</span>
          </label>
        </Card>
      </div>
    </section>
  )
}

export default Settings
