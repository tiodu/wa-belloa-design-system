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

export function MyBetsPage() {
  const [activeTab, setActiveTab] = useState<MyBetsTab>('open')
  const [bets, setBets] = useState<MyBetCardProps[]>(ALL_BETS)

  // Controls state
  const [controlBetFilter, setControlBetFilter] = useState<'all' | 'cashout' | 'live' | 'settled' | 'empty'>('all')

  const BALANCE = 1000
  const CURRENCY = '₺'

  const visibleBets = (() => {
    if (controlBetFilter === 'empty') return []
    if (controlBetFilter === 'cashout') return ALL_BETS.filter(b => b.cashOutValue !== undefined && b.status === 'open')
    if (controlBetFilter === 'live') return ALL_BETS.filter(b => b.isLive && b.status === 'open')
    if (controlBetFilter === 'settled') return ALL_BETS.filter(b => b.status !== 'open')
    return bets
  })()

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

  const CONTROL_FILTERS: { id: typeof controlBetFilter; label: string }[] = [
    { id: 'all',      label: 'All bets' },
    { id: 'cashout',  label: 'With cash out' },
    { id: 'live',     label: 'Live only' },
    { id: 'settled',  label: 'Settled only' },
    { id: 'empty',    label: 'Empty' },
  ]

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
          <span className={styles.controlLabel}>Bet data</span>
          <div className={styles.chipRow}>
            {CONTROL_FILTERS.map(f => (
              <button
                key={f.id}
                className={`${styles.chip} ${controlBetFilter === f.id ? styles.chipActive : ''}`}
                onClick={() => setControlBetFilter(f.id)}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Phone frame ─── */}
      <span className={styles.frameLabel}>Mobile preview · My Bets</span>
      <div className={styles.phoneFrame}>
        <div className={styles.mobileBook}>
          <MyBetsHeader balance={BALANCE} currency={CURRENCY} />

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

          <BottomNav />
        </div>
      </div>
    </div>
  )
}
