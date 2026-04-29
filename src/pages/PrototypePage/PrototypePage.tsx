import { useState } from 'react'
import { Menu, Gift, Home, Radio, ClipboardList, Gamepad2 } from 'lucide-react'
import { MobileSideMenuV2 } from '../../components/MobileSideMenuV2'
import { CasinoLobbyPage } from '../CasinoLobbyPage'
import { MyBetsPage } from '../MyBetsPage'
import { SportsbookHomeView } from './views/SportsbookHomeView'
import styles from './PrototypePage.module.css'

type View = 'sportsbook' | 'casino' | 'my-bets'


// ─── TopBar ───────────────────────────────────────────────────

function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <button className={styles.menuBtn} aria-label="Menu" onClick={onMenuOpen}>
          <Menu size={20} />
        </button>
        <div className={styles.logo}>B</div>
      </div>
      <div className={styles.topBarRight}>
        <button className={styles.giftBtn} aria-label="Promotions">
          <Gift size={16} />
        </button>
        <div className={styles.balance}>
          <span className={styles.balanceCurrency}>€</span>
          <span className={styles.balanceAmount}>10,000.00</span>
        </div>
        <button className={styles.depositBtn} type="button">DEPOSIT</button>
        <div className={styles.avatar}>S</div>
      </div>
    </header>
  )
}

// ─── BottomNav ────────────────────────────────────────────────

function BottomNav({ activeView, onChange }: { activeView: View; onChange: (v: View) => void }) {
  return (
    <nav className={styles.bottomNav}>
      <button
        className={`${styles.navItem} ${activeView === 'sportsbook' ? styles.navItemActive : ''}`}
        onClick={() => onChange('sportsbook')}
        type="button"
      >
        <Home size={22} />
        Sports
      </button>
      <button
        className={styles.navItem}
        type="button"
      >
        <Radio size={22} />
        Live
      </button>
      <div className={styles.navBetslipCell}>
        <div className={styles.navBetslipIndicator}>Betslip</div>
      </div>
      <button
        className={`${styles.navItem} ${activeView === 'my-bets' ? styles.navItemActive : ''}`}
        onClick={() => onChange('my-bets')}
        type="button"
      >
        <ClipboardList size={22} />
        My Bets
      </button>
      <button
        className={`${styles.navItem} ${activeView === 'casino' ? styles.navItemActive : ''}`}
        onClick={() => onChange('casino')}
        type="button"
      >
        <Gamepad2 size={22} />
        Casino
      </button>
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function PrototypePage() {
  const [activeView, setActiveView] = useState<View>('sportsbook')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn] = useState(true)

  return (
    <main className={styles.page}>
      <div className={styles.frameLabel}>Mobile Prototype · Full App</div>
      <div className={styles.phoneFrame}>
        <MobileSideMenuV2
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isLoggedIn={isLoggedIn}
        />

        <div className={styles.shell}>
          <TopBar onMenuOpen={() => setIsMenuOpen(true)} />

          <div className={styles.content}>
            {activeView === 'sportsbook' && <SportsbookHomeView />}
            {activeView === 'casino'     && <CasinoLobbyPage noShell />}
            {activeView === 'my-bets'    && <MyBetsPage noShell />}
          </div>

          <BottomNav activeView={activeView} onChange={setActiveView} />
        </div>
      </div>
    </main>
  )
}
