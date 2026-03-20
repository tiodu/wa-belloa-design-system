import { useState, useCallback } from 'react'
import { VersionSelector } from '../../components/Controls/VersionSelector'
import type { ControlItem } from '../../components/Controls/VersionSelector'
import { Betslip } from '../../components/Betslip'
import { BetslipV2 } from '../../components/BetslipV2'
import type { BetEntry, Bonus } from '../../components/Betslip/types'
import type { BetEntryV2 } from '../../components/BetslipV2/types'
import styles from './SportsbookVisualiser.module.css'

/* ---- Sample data ---- */

const V1_BETS: BetEntry[] = [
  { id: '1', match: 'Arsenal - Manchester City', league: 'Premier League', market: '1x2', selection: '1', odds: 2.96 },
  { id: '2', match: 'Liverpool - Chelsea', league: 'Premier League', market: '1x2', selection: 'X', odds: 3.45 },
]
const V1_BONUSES: Bonus[] = [
  { id: 'b1', type: 'OddsBoost', label: 'Odds Boost', originalOdds: 7.5, boostedOdds: 8.75 },
  { id: 'b2', type: 'FreeBet', label: 'Free Bet', amount: 10 },
]

const V2_BETS: BetEntryV2[] = [
  { id: '1', match: 'FC Midtjylland vs Nottingham Forest', league: 'UEFA Champions League', market: 'Full Time', selection: 'FC Midtjylland', odds: 2.95, fractionalOdds: '39/20' },
  { id: '2', match: 'Liverpool vs Real Madrid', league: 'UEFA Champions League', market: 'Full Time', selection: 'Liverpool', odds: 1.95, badges: ['2UP'] },
]

/* ---- Static mock content ---- */

const SPORTS = [
  { icon: '⚽', label: 'Football', count: 1193 },
  { icon: '🏀', label: 'Basketball', count: 879 },
  { icon: '⚾', label: 'Baseball', count: 1024 },
  { icon: '🏒', label: 'Hockey', count: 542 },
  { icon: '🎾', label: 'Tennis', count: 889 },
  { icon: '⛳', label: 'Golf', count: 454 },
  { icon: '🏐', label: 'Volleyball', count: 876 },
  { icon: '🏉', label: 'Rugby', count: 310 },
  { icon: '🏎', label: 'Motor', count: 987 },
  { icon: '🏏', label: 'Cricket', count: 234 },
]

const LIVE_MATCHES = [
  { time: '74\'', home: 'Arsenal', away: 'Manchester City', o1: '2.96', ox: '2.96', o2: '2.96', badge: '+1596' },
  { time: '61\'', home: 'Liverpool', away: 'Chelsea', o1: '2.96', ox: '2.96', o2: '2.96', badge: '+815' },
  { time: '88\'', home: 'Tottenham', away: 'Man United', o1: '2.96', ox: '2.96', o2: '2.96', highlighted: true },
  { time: '45\'', home: 'Juventus', away: 'AC Milan', o1: '2.96', ox: '2.96', o2: '2.96', badge: '+609' },
  { time: '32\'', home: 'Barcelona', away: 'Real Madrid', o1: '2.96', ox: '2.96', o2: '2.96', badge: '+603' },
]

const RESULTS = [
  { league: 'Serie A – 14 Usa', date: '28/10 23:00', home: 'Juventus', away: 'Real Madrid', s1: 2, s2: 3 },
  { league: 'Serie A – A', date: '26/10 20:45', home: 'Juventus', away: 'AC Milan', s1: 1, s2: 1 },
  { league: 'England – Premier League', date: '27/10 19:30', home: 'Manchester City', away: 'Liverpool', s1: 3, s2: 2 },
]

/* ---- Nav ---- */

function TopNav() {
  return (
    <header className={styles.topNav}>
      <div className={styles.navLeft}>
        <div className={styles.navLogo}>
          <div className={styles.logoMark} />
          <span className={styles.logoText}>WA Sports</span>
        </div>
        <nav className={styles.navLinks}>
          {['Sports', 'Live', 'Casino', 'Live Casino', 'e-Sport', 'Promotions'].map((item, i) => (
            <a key={item} className={`${styles.navLink} ${i === 0 ? styles['navLink--active'] : ''}`} href="#">
              {item}
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.navRight}>
        <button className={styles.navIconBtn} type="button" aria-label="Language">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><ellipse cx="8" cy="8" rx="2.5" ry="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 6h13M1.5 10h13" stroke="currentColor" strokeWidth="1.2"/></svg>
        </button>
        <button className={styles.depositBtn} type="button">Deposit</button>
        <span className={styles.navBalance}>EUR 0.00</span>
        <button className={styles.navUser} type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <span>User-name</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </button>
      </div>
    </header>
  )
}

/* ---- Left sidebar ---- */

function LeftSidebar() {
  return (
    <aside className={styles.leftSidebar}>
      <div className={styles.sidebarSection}>
        <span className={styles.sidebarTitle}>Favourite League</span>
        <div className={styles.searchBox}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 8l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <input className={styles.searchInput} placeholder="Search" type="text" />
        </div>
        {['Première League', 'Première League', 'Première League'].map((l, i) => (
          <div key={i} className={styles.leagueRow}>
            <span className={styles.leagueIcon}>⚽</span>
            <div className={styles.leagueInfo}>
              <span className={styles.leagueSport}>Football</span>
              <span className={styles.leagueName}>{l}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sidebarSection}>
        <span className={styles.sidebarTitle}>Pre-Match</span>
        <div className={styles.dateTabs}>
          {['€', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
            <button key={d} className={`${styles.dateTab} ${i === 0 ? styles['dateTab--active'] : ''}`} type="button">{d}</button>
          ))}
        </div>
        {SPORTS.map((s) => (
          <div key={s.label} className={styles.sportRow}>
            <span className={styles.sportIcon}>{s.icon}</span>
            <span className={styles.sportLabel}>{s.label}</span>
            <span className={styles.sportCount}>{s.count}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

/* ---- Center content ---- */

function CenterContent() {
  return (
    <main className={styles.center}>
      {/* Hero */}
      <div className={styles.hero} />

      {/* Last minute */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionDot} />
          Last minute
        </h2>
        <div className={styles.tabRow}>
          {['Football', 'Tennis', 'Basketball', 'Volleyball'].map((t, i) => (
            <button key={t} className={`${styles.contentTab} ${i === 0 ? styles['contentTab--active'] : ''}`} type="button">{t}</button>
          ))}
        </div>
        <div className={styles.oddsHeader}>
          <span className={styles.oddsHeaderCell}>1</span>
          <span className={styles.oddsHeaderCell}>x</span>
          <span className={styles.oddsHeaderCell}>2</span>
        </div>
        {LIVE_MATCHES.map((m, i) => (
          <div key={i} className={styles.matchRow}>
            <span className={styles.matchTime}>{m.time}</span>
            <span className={styles.matchTeams}>{m.home} – {m.away}</span>
            {m.highlighted
              ? <span className={styles.suspended}>⚠ BET SUSPENDED</span>
              : <>
                  <span className={`${styles.odd} ${i === 0 ? styles['odd--active'] : ''}`}>{m.o1}</span>
                  <span className={styles.odd}>{m.ox}</span>
                  <span className={styles.odd}>{m.o2}</span>
                  {m.badge && <span className={styles.matchBadge}>{m.badge}</span>}
                </>
            }
          </div>
        ))}
      </section>
    </main>
  )
}

/* ---- Right sidebar ---- */

function LatestResults() {
  return (
    <div className={styles.rightSection}>
      <div className={styles.rightSectionHeader}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        Latest Results
      </div>
      {RESULTS.map((r, i) => (
        <div key={i} className={styles.resultRow}>
          <div className={styles.resultMeta}>
            <span className={styles.resultLeague}>{r.league}</span>
            <span className={styles.resultDate}>{r.date}</span>
          </div>
          <div className={styles.resultMatch}>
            <span className={styles.resultTeam}>{r.home}</span>
            <div className={styles.scoreBox}>
              <span className={styles.score}>{r.s1}</span>
              <span className={styles.scoreSep}>:</span>
              <span className={styles.score}>{r.s2}</span>
            </div>
            <span className={styles.resultTeam}>{r.away}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function LatestWins() {
  const wins = [
    { label: 'C.P', date: '03/11/2025', bet: 7.0, won: 29.5 },
    { label: 'D.Q', date: '04/11/2025', bet: 15.0, lost: true },
    { label: 'E.R', date: '05/11/2025', bet: 10.0, won: 38.0 },
    { label: 'F.T', date: '06/11/2025', bet: 5.0, won: 22.0 },
  ]
  return (
    <div className={styles.rightSection}>
      <div className={styles.rightSectionHeader}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3H11l-2.7 2 1 3.3L6 7.5 2.7 9.3l1-3.3L1 4h3.5L6 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
        Latest Wins
      </div>
      {wins.map((w, i) => (
        <div key={i} className={styles.winRow}>
          <div className={styles.winLeft}>
            <span className={styles.winUser}>{w.label}</span>
            <span className={styles.winDate}>{w.date}</span>
          </div>
          <div className={styles.winRight}>
            <span className={styles.winBet}>Bet EUR {w.bet.toFixed(2)}</span>
            {w.lost
              ? <span className={styles.winLost}>Lost EUR 0.00</span>
              : <span className={styles.winAmount}>Won EUR {w.won!.toFixed(2)}</span>
            }
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---- Main Visualiser ---- */

type BetslipVersion = 'v1' | 'v2'

const CONTROLS: ControlItem[] = [
  {
    id: 'betslip',
    label: 'Betslip',
    options: [
      { value: 'v1', label: 'Betslip V1' },
      { value: 'v2', label: 'Betslip V2' },
    ],
    value: 'v1',
  },
]

export function SportsbookVisualiser() {
  const [controls, setControls] = useState<ControlItem[]>(CONTROLS)
  const [v1Bets, setV1Bets] = useState<BetEntry[]>(V1_BETS)
  const [v2Bets, setV2Bets] = useState<BetEntryV2[]>(V2_BETS)

  const activeBetslip = (controls.find((c) => c.id === 'betslip')?.value ?? 'v1') as BetslipVersion

  const handleControlChange = useCallback((id: string, value: string) => {
    setControls((prev) => prev.map((c) => c.id === id ? { ...c, value } : c))
  }, [])

  return (
    <div className={styles.page}>
      <VersionSelector controls={controls} onChange={handleControlChange} />

      <div className={styles.sportsbook}>
        <TopNav />

        <div className={styles.layout}>
          <LeftSidebar />

          <CenterContent />

          {/* Right sidebar */}
          <aside className={styles.rightSidebar}>
            {/* Betslip slot */}
            <div className={styles.betslipSlot}>
              {activeBetslip === 'v1' && (
                <Betslip
                  bets={v1Bets}
                  bonuses={V1_BONUSES}
                  onPlaceBet={async () => {}}
                  onRemoveBet={(id) => setV1Bets((prev) => prev.filter((b) => b.id !== id))}
                  onClearAll={() => setV1Bets([])}
                />
              )}
              {activeBetslip === 'v2' && (
                <BetslipV2
                  bets={v2Bets}
                  onPlaceBet={async () => {}}
                  onRemoveBet={(id) => setV2Bets((prev) => prev.filter((b) => b.id !== id))}
                  onClearAll={() => setV2Bets([])}
                />
              )}
            </div>

            <LatestResults />
            <LatestWins />
          </aside>
        </div>
      </div>
    </div>
  )
}
