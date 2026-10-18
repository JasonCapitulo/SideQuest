const NAV_ITEMS = ['Home', 'Games', 'Study Quest', 'Settings']

function Navbar({ current, onNavigate }) {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => onNavigate('Home')}
          className="flex items-center gap-2 text-lg font-extrabold text-[var(--color-primary)]"
        >
          <span aria-hidden="true">🌙</span>
          SideQuest
        </button>

        <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = current === item
            return (
              <li key={item}>
                <button
                  onClick={() => onNavigate(item)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors sm:text-base ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {item}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
