import { useState } from 'react'
import { Menu, Gift } from 'lucide-react'
import { MobileSideMenu } from '../../components/MobileSideMenu'
import { MobileSideMenuV2 } from '../../components/MobileSideMenuV2'
import { FloatingBetslip } from '../../components/FloatingBetslip'
import type { BetEntry } from '../../components/FloatingBetslip'
import { BottomNav } from '../../components/BottomNav'
import type { View } from '../../components/BottomNav'
import { CasinoLobbyPage } from '../CasinoLobbyPage'
import { MyBetsPage } from '../MyBetsPage'
import { SportsbookHomeView } from './views/SportsbookHomeView'
import styles from './PrototypePage.module.css'

type MenuVariant = 'v1' | 'v2'

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

// ─── Page ─────────────────────────────────────────────────────

export function PrototypePage() {
  const [activeView, setActiveView] = useState<View>('sportsbook')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [menuVariant, setMenuVariant] = useState<MenuVariant>('v2')
  const [bets, setBets] = useState<BetEntry[]>([])
  const [openSignal, setOpenSignal] = useState(0)

  const selectedBetIds = new Set(bets.map(b => b.id))

  function handleAddBet(bet: BetEntry) {
    setBets(prev => {
      if (prev.some(b => b.id === bet.id)) return prev
      return [...prev, bet]
    })
    setOpenSignal(s => s + 1)
  }

  function handleRemoveBet(id: string) {
    setBets(prev => prev.filter(b => b.id !== id))
  }

  return (
    <main className={styles.page}>
      <div className={styles.frameLabel}>
        <span>Mobile Prototype · Full App</span>
        <div className={styles.menuToggle}>
          <button
            className={`${styles.menuToggleBtn}${menuVariant === 'v1' ? ` ${styles.menuToggleBtnActive}` : ''}`}
            onClick={() => setMenuVariant('v1')}
            type="button"
          >
            Menu V1
          </button>
          <button
            className={`${styles.menuToggleBtn}${menuVariant === 'v2' ? ` ${styles.menuToggleBtnActive}` : ''}`}
            onClick={() => setMenuVariant('v2')}
            type="button"
          >
            Menu V2
          </button>
        </div>
      </div>
      <div className={styles.phoneFrame}>
        {menuVariant === 'v1' ? (
          <MobileSideMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            isLoggedIn={isLoggedIn}
            onToggleAuth={() => setIsLoggedIn(p => !p)}
          />
        ) : (
          <MobileSideMenuV2
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            isLoggedIn={isLoggedIn}
          />
        )}

        <div className={styles.shell}>
          <TopBar onMenuOpen={() => setIsMenuOpen(true)} />

          <div className={styles.content}>
            {activeView === 'sportsbook' && (
              <SportsbookHomeView
                selectedBetIds={selectedBetIds}
                onAddBet={handleAddBet}
                onRemoveBet={handleRemoveBet}
              />
            )}
            {activeView === 'casino'  && <CasinoLobbyPage />}
            {activeView === 'my-bets' && <MyBetsPage noShell />}
          </div>

          <BottomNav activeView={activeView} onChange={setActiveView} />
        </div>

        <FloatingBetslip
          contained
          bets={bets}
          onRemoveBet={handleRemoveBet}
          onClearAll={() => setBets([])}
          openSignal={openSignal}
          onOpenMyBets={() => setActiveView('my-bets')}
          isLoggedIn={isLoggedIn}
          currency="€"
          balance={10000}
          bonusTracker={{
            label: 'Acca Boost',
            thresholds: [
              { selections: 3, percent: 5 },
              { selections: 5, percent: 10 },
              { selections: 7, percent: 15 },
            ],
            minOdds: 1.3,
          }}
        />
      </div>
    </main>
  )
}
