import './tokens/belloa.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BelloaBetslipPage } from './pages/BelloaBetslipPage'
import { CasinoCategoryPage } from './pages/CasinoCategoryPage'
import { CasinoLobbyPage } from './pages/CasinoLobbyPage'
import { HomeHubPage } from './pages/HomeHubPage'
import { MyBetsPage } from './pages/MyBetsPage'
import { PrototypePage } from './pages/PrototypePage'
import { SportsbookPlaygroundPage } from './pages/SportsbookPlaygroundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeHubPage />} />
        <Route path="/betslip" element={<BelloaBetslipPage />} />
        <Route path="/my-bets" element={<MyBetsPage />} />
        <Route path="/sportsbook" element={<SportsbookPlaygroundPage />} />
        <Route path="/casino" element={<CasinoLobbyPage />} />
        <Route path="/casino/:category" element={<CasinoCategoryPage />} />
        <Route path="/prototype" element={<PrototypePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
