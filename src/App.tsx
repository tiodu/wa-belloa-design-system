import './tokens/belloa.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BelloaBetslipPage } from './pages/BelloaBetslipPage'
import { CasinoLobbyPage } from './pages/CasinoLobbyPage'
import { HomeHubPage } from './pages/HomeHubPage'
import { MyBetsPage } from './pages/MyBetsPage'
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
