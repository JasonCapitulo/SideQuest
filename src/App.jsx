import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Games from './pages/Games.jsx'
import StudyQuest from './pages/StudyQuest.jsx'
import Settings from './pages/Settings.jsx'

const PAGES = {
  Home,
  Games,
  'Study Quest': StudyQuest,
  Settings,
}

function App() {
  const [page, setPage] = useState('Home')
  const Page = PAGES[page] ?? Home

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar current={page} onNavigate={setPage} />
        <main>
          <Page onNavigate={setPage} />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
