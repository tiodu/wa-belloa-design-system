import { useState } from 'react'
import { Gift, Menu, Home, Search, Radio, ClipboardList, Gamepad2 } from 'lucide-react'
import { MyBetCard, type MyBetCardProps } from '../../components/MyBetCard'
import styles from './MyBetsPage.module.css'

/* ─── Types ─── */

type MyBetsTab = 'open' | 'cashout' | 'live' | 'settled'

/* ─── Mock data ─── */

const ALL_BETS: MyBetCardProps[] = [
  {
    id: 'b1',
    betType: 'Bet Builder',
    stake: 5.00,
    potentialReturn: 24.50,
    currency: '₺',
    status: 'open',
    isLive: true,
    event: 'Man Utd vs Leeds',
    kickoffDate: 'Mon 13 Apr · 20:00',
    odds: 4.90,
    cashOutValue: 3.20,
    legs: [
      { selection: 'FT Result: Man Utd', market: 'Full Time Result', result: 'pending' },
      { selection: 'Matheus Cunha: 2+ Shots on Target', market: 'Player Shots on Target', result: 'pending' },
      { selection: 'Bryan Mbeumo: 2+ Shots on Target', market: 'Player Shots on Target', result: 'pending' },
    ],
  },
  {
    id: 'b1b',
    betType: '4-Fold Acca',
    stake: 12.00,
    potentialReturn: 186.00,
    currency: '₺',
    status: 'open',
    isLive: false,
    event: 'Multi-sport',
    kickoffDate: 'Tue 15 Apr',
    odds: 15.50,
    cashOutValue: 8.40,
    legs: [
      { event: 'Premier League · Arsenal vs Chelsea', selection: 'Arsenal', market: 'Full Time Result', kickoffTime: 'Tue 15 Apr · 21:00' },
      { event: 'La Liga · Barcelona vs Atlético', selection: 'Over 2.5', market: 'Total Goals', kickoffTime: 'Tue 15 Apr · 21:00' },
      { event: 'NBA · Lakers vs Celtics', selection: 'Lakers -4.5', market: 'Handicap', kickoffTime: 'Wed 16 Apr · 02:30' },
      { event: 'ATP Madrid · Djokovic vs Alcaraz', selection: 'Alcaraz', market: 'Match Winner', kickoffTime: 'Thu 17 Apr · 14:00' },
    ],
  },
  {
    id: 'b2',
    betType: 'Double',
    stake: 10.00,
    potentialReturn: 38.40,
    currency: '₺',
    status: 'open',
    isLive: false,
    event: 'Barcelona vs Real Madrid',
    kickoffDate: 'Tue 15 Apr · 21:00',
    odds: 3.84,
    cashOutValue: 7.50,
    legs: [
      { selection: 'Barcelona', market: 'Full Time Result', result: 'pending' },
      { selection: 'Over 2.5', market: 'Total Goals', result: 'pending' },
    ],
  },
  {
    id: 'b3',
    betType: 'Single',
    stake: 15.00,
    potentialReturn: 37.50,
    currency: '₺',
    status: 'open',
    isLive: true,
    event: 'Arsenal vs Liverpool',
    kickoffDate: 'Mon 13 Apr · 17:30',
    odds: 2.50,
    legs: [
      { selection: 'Arsenal', market: 'Full Time Result', result: 'pending' },
    ],
  },
  {
    id: 'b4',
    betType: 'Single',
    stake: 20.00,
    potentialReturn: 44.00,
    actualReturn: 44.00,
    currency: '₺',
    status: 'won',
    isLive: false,
    event: 'Bayern vs Dortmund',
    kickoffDate: 'Sat 12 Apr · 18:30',
    odds: 2.20,
    legs: [
      { selection: 'Bayern Munich', market: 'Full Time Result', result: 'won' },
    ],
  },
  {
    id: 'b5',
    betType: 'Treble',
    stake: 8.00,
    potentialReturn: 62.40,
    actualReturn: 0,
    currency: '₺',
    status: 'lost',
    isLive: false,
    event: 'Multi-event',
    kickoffDate: 'Sat 12 Apr',
    odds: 7.80,
    legs: [
      { selection: 'Chelsea', market: 'Full Time Result', result: 'won' },
      { selection: 'Over 2.5', market: 'Total Goals', result: 'lost' },
      { selection: 'Tottenham', market: 'Full Time Result', result: 'void' },
    ],
  },
  {
    id: 'b6',
    betType: 'Single',
    stake: 25.00,
    potentialReturn: 52.25,
    actualReturn: 52.25,
    currency: '₺',
    status: 'won',
    isLive: false,
    event: 'Galatasaray vs Fenerbahçe',
    kickoffDate: 'Fri 11 Apr · 19:00',
    odds: 2.09,
    originalOdds: 1.90,
    legs: [
      { selection: 'Galatasaray', market: 'Full Time Result', result: 'won' },
    ],
  },
]

function filterBets(bets: MyBetCardProps[], tab: MyBetsTab): MyBetCardProps[] {
  switch (tab) {
    case 'open':     return bets.filter(b => b.status === 'open')
    case 'cashout':  return bets.filter(b => b.status === 'open' && b.cashOutValue !== undefined)
    case 'live':     return bets.filter(b => b.status === 'open' && b.isLive)
    case 'settled':  return bets.filter(b => b.status !== 'open')
  }
}

/* ─── Header ─── */

function MyBetsHeader({ balance, currency }: { balance: number; currency: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.headerMenuBtn} type="button" aria-label="Menu">
          <Menu size={20} />
        </button>
        <div className={styles.headerLogo}>B</div>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.headerGiftBtn} type="button" aria-label="Promotions">
          <Gift size={16} />
        </button>
        <div className={styles.headerBalance}>
          <span className={styles.headerBalanceCurrency}>{currency}</span>
          <span className={styles.headerBalanceAmount}>{balance.toFixed(2)}</span>
        </div>
        <button className={styles.headerDepositBtn} type="button">DEPOSIT</button>
        <div className={styles.headerAvatar}>U</div>
      </div>
    </header>
  )
}

/* ─── Bottom Nav ─── */

function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <button className={styles.bottomNavItem} type="button">
        <Home size={20} />
        <span>Home</span>
      </button>
      <button className={styles.bottomNavItem} type="button">
        <Search size={20} />
        <span>All Sports</span>
      </button>
      <button className={styles.bottomNavItem} type="button">
        <Radio size={20} />
        <span>In-Play</span>
      </button>
      <button className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`} type="button">
        <ClipboardList size={20} />
        <span>My Bets</span>
      </button>
      <button className={styles.bottomNavItem} type="button">
        <Gamepad2 size={20} />
        <span>Casino</span>
      </button>
    </nav>
  )
}

/* ─── Main page ─── */

const BET_PERMUTATIONS: { id: string; label: string }[] = [
  { id: 'b1',  label: 'Bet Builder · live' },
  { id: 'b1b', label: 'Multi-sport Acca' },
  { id: 'b2',  label: 'Double · pre-match' },
  { id: 'b3',  label: 'Single · live' },
  { id: 'b4',  label: 'Won · single' },
  { id: 'b5',  label: 'Lost · treble' },
  { id: 'b6',  label: 'Boosted · single' },
]

export function MyBetsPage({ noShell }: { noShell?: boolean } = {}) {
  const [activeTab, setActiveTab] = useState<MyBetsTab>('open')
  const [bets, setBets] = useState<MyBetCardProps[]>(ALL_BETS)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set(BET_PERMUTATIONS.map(p => p.id))
  )

  const BALANCE = 1000
  const CURRENCY = '₺'

  function toggleBet(id: string) {
    setVisibleIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const visibleBets = bets.filter(b => visibleIds.has(b.id))
  const tabBets = filterBets(visibleBets, activeTab)

  function handleCashOut(id: string) {
    setBets(prev => prev.map(b =>
      b.id === id ? { ...b, status: 'cashedout' as const, actualReturn: b.cashOutValue, cashOutValue: undefined } : b
    ))
  }

  const TABS: { id: MyBetsTab; label: string }[] = [
    { id: 'open',    label: 'Open' },
    { id: 'cashout', label: 'Cash Out' },
    { id: 'live',    label: 'Live' },
    { id: 'settled', label: 'Settled' },
  ]

  const betsContent = (
    <>
      {!noShell && <MyBetsHeader balance={BALANCE} currency={CURRENCY} />}

      {/* Tabs */}
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bet list */}
      <div className={styles.betList}>
        {tabBets.length === 0 ? (
          <div className={styles.emptyState}>
            <ClipboardList size={32} strokeWidth={1.2} className={styles.emptyIcon} />
            <span className={styles.emptyTitle}>No bets here</span>
            <span className={styles.emptySubtitle}>
              {activeTab === 'cashout' && 'No bets available for cash out.'}
              {activeTab === 'live' && 'No live bets at the moment.'}
              {activeTab === 'open' && 'You have no open bets.'}
              {activeTab === 'settled' && 'No settled bets in the last 7 days.'}
            </span>
            {activeTab === 'settled' && (
              <button className={styles.historyBtn} type="button">
                View Bet History
              </button>
            )}
          </div>
        ) : (
          <>
            {tabBets.map(bet => (
              <MyBetCard
                key={bet.id}
                {...bet}
                onCashOut={handleCashOut}
              />
            ))}
            {activeTab === 'settled' && (
              <button className={styles.historyBtnInline} type="button">
                View Bet History
              </button>
            )}
          </>
        )}
      </div>

      {!noShell && <BottomNav />}
    </>
  )

  if (noShell) {
    return <div className={styles.mobileBook}>{betsContent}</div>
  }

  return (
    <div className={styles.page}>
      {/* ─── Controls ─── */}
      <div className={styles.controls}>
        <span className={styles.controlsTitle}>My Bets Preview</span>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Active tab</span>
          <div className={styles.chipRow}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.chip} ${activeTab === t.id ? styles.chipActive : ''}`}
                onClick={() => setActiveTab(t.id)}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Bet permutations</span>
          <div className={styles.chipRow}>
            {BET_PERMUTATIONS.map(p => (
              <button
                key={p.id}
                className={`${styles.chip} ${visibleIds.has(p.id) ? styles.chipActive : ''}`}
                onClick={() => toggleBet(p.id)}
                type="button"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Phone frame ─── */}
      <span className={styles.frameLabel}>Mobile preview · My Bets</span>
      <div className={styles.phoneFrame}>
        <div className={styles.mobileBook}>
          {betsContent}
        </div>
      </div>
    </div>
  )
}
