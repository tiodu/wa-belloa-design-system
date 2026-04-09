import './tokens/belloa.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BelloaBetslipPage } from './pages/BelloaBetslipPage'
import { HomeHubPage } from './pages/HomeHubPage'
import { SportsbookPlaygroundPage } from './pages/SportsbookPlaygroundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeHubPage />} />
        <Route path="/betslip" element={<BelloaBetslipPage />} />
        <Route path="/sportsbook" element={<SportsbookPlaygroundPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
