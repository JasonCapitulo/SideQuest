import Panel from '../components/Panel.jsx'
import Switch from '../components/Switch.jsx'
import TabButton from '../components/TabButton.jsx'
import ThemePreviewCard from '../components/ThemePreviewCard.jsx'
import { useThemePreferences } from '../context/ThemeContext.jsx'
import { FONTS, TEXT_SIZES, THEMES } from '../theme/themes.js'

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
    highContrast,
    setHighContrast,
  } = useThemePreferences()

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
        Settings
      </h1>
      <p className="mt-2 text-[var(--color-text-soft)]">
        Make SideQuest feel like yours. Your choices are saved automatically.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Panel title="Theme" icon="palette" variant="panel" className="sm:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {THEMES.map((themeOption) => (
              <ThemePreviewCard
                key={themeOption.id}
                themeTheme={themeOption}
                isActive={theme === themeOption.id}
                onSelect={setTheme}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Readable font" icon="type">
          <div role="radiogroup" aria-label="Body text font" className="flex flex-col gap-2">
            {FONTS.map((fontOption) => (
              <TabButton
                key={fontOption.id}
                role="radio"
                aria-checked={font === fontOption.id}
                selected={font === fontOption.id}
                onClick={() => setFont(fontOption.id)}
                className="w-full !justify-start text-left"
              >
                <span>
                  <span className="block">{fontOption.label}</span>
                  <span className="block text-xs font-normal opacity-80">{fontOption.description}</span>
                </span>
              </TabButton>
            ))}
          </div>
        </Panel>

        <Panel title="Text size" icon="size">
          <div role="radiogroup" aria-label="Text size" className="flex gap-2">
            {TEXT_SIZES.map((size) => (
              <TabButton
                key={size.id}
                role="radio"
                aria-checked={textSize === size.id}
                selected={textSize === size.id}
                onClick={() => setTextSize(size.id)}
                className="flex-1"
              >
                {size.label}
              </TabButton>
            ))}
          </div>
        </Panel>

        <Panel title="Motion" icon="motion">
          <Switch
            checked={reducedMotion}
            onChange={setReducedMotion}
            label="Reduce motion and animations"
            hint="We also honor your system's reduced-motion setting automatically."
          />
        </Panel>

        <Panel title="Contrast" icon="contrast">
          <Switch
            checked={highContrast}
            onChange={setHighContrast}
            label="Increase contrast"
            hint="Strengthens borders and softened text for better readability."
          />
        </Panel>
      </div>
    </section>
  )
}

export default Settings
