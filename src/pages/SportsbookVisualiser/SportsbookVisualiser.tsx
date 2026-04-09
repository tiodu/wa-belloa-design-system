import { useMemo, useState } from 'react'
import { Betslip } from '../../components/Betslip'
import { BetslipV2 } from '../../components/BetslipV2'
import { BetslipTR } from '../../components/BetslipTR'
import { FloatingBetslip } from '../../components/FloatingBetslip'
import type { BetEntry, Bonus } from '../../components/Betslip/types'
import type { BetEntryV2 } from '../../components/BetslipV2/types'
import type { BetEntryTR } from '../../components/BetslipTR'
import type { BetEntry as FloatBetEntry } from '../../components/FloatingBetslip'
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

const TR_BETS: BetEntryTR[] = [
  { id: '1', match: 'Galatasaray - Fenerbahçe', league: 'Süper Lig', market: 'Maç Sonucu', selection: 'Galatasaray', odds: 2.15 },
  { id: '2', match: 'Beşiktaş - Trabzonspor', league: 'Süper Lig', market: 'Maç Sonucu', selection: 'Beşiktaş', odds: 1.85 },
]

const FLOAT_BETS_LIVE: FloatBetEntry[] = [
  {
    id: 'f1',
    match: 'Arsenal - Manchester City',
    league: 'Premier League',
    market: 'Match Result',
    selection: 'Arsenal',
    odds: 2.15,
    isLive: true,
    score: '1-0',
    minute: 67,
  },
  {
    id: 'f2',
    match: 'Liverpool - Chelsea',
    league: 'Premier League',
    market: 'Over/Under 2.5',
    selection: 'Over',
    odds: 1.85,
    isLive: true,
    score: '0-0',
    minute: 34,
  },
  {
    id: 'f3',
    match: 'Tottenham - Manchester United',
    league: 'Premier League',
    market: 'Match Result',
    selection: 'Tottenham',
    odds: 3.40,
  },
]

const FLOAT_BETS_PREMATCH: FloatBetEntry[] = [
  {
    id: 'f1',
    match: 'Inter - Juventus',
    league: 'Serie A',
    market: 'Match Result',
    selection: 'Inter',
    odds: 2.2,
  },
  {
    id: 'f2',
    match: 'Barcelona - Real Madrid',
    league: 'La Liga',
    market: 'Over/Under 2.5',
    selection: 'Over',
    odds: 1.92,
  },
  {
    id: 'f3',
    match: 'Bayern - Dortmund',
    league: 'Bundesliga',
    market: 'Both Teams To Score',
    selection: 'Yes',
    odds: 1.78,
  },
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

type MobileOddKey = 'home' | 'draw' | 'away'

type MobileMatch = {
  id: string
  league: string
  home: string
  away: string
  minute?: string
  odds: Record<MobileOddKey, { label: string; decimal: number }>
}

const MOBILE_POPULAR = ['World Cup 2026', 'Superlig', 'La Liga', 'Football', 'Baseball', 'Tennis']

const MOBILE_MATCHES_LIVE: MobileMatch[] = [
  {
    id: 'm1',
    league: 'Premier League',
    home: 'Arsenal',
    away: 'Manchester City',
    minute: "74'",
    odds: {
      home: { label: '8/5', decimal: 2.6 },
      draw: { label: '12/4', decimal: 4.0 },
      away: { label: '15/7', decimal: 3.14 },
    },
  },
  {
    id: 'm2',
    league: 'Premier League',
    home: 'Liverpool',
    away: 'Chelsea',
    minute: "61'",
    odds: {
      home: { label: '8/5', decimal: 2.6 },
      draw: { label: '12/4', decimal: 4.0 },
      away: { label: '15/7', decimal: 3.14 },
    },
  },
  {
    id: 'm3',
    league: 'Premier League',
    home: 'Tottenham',
    away: 'Manchester United',
    minute: "52'",
    odds: {
      home: { label: '8/5', decimal: 2.6 },
      draw: { label: '12/4', decimal: 4.0 },
      away: { label: '15/7', decimal: 3.14 },
    },
  },
]

const MOBILE_MATCHES_PREMATCH: MobileMatch[] = [
  {
    id: 'm1',
    league: 'Serie A',
    home: 'Inter',
    away: 'Juventus',
    odds: {
      home: { label: '6/5', decimal: 2.2 },
      draw: { label: '11/5', decimal: 3.2 },
      away: { label: '12/5', decimal: 3.4 },
    },
  },
  {
    id: 'm2',
    league: 'La Liga',
    home: 'Barcelona',
    away: 'Real Madrid',
    odds: {
      home: { label: '7/5', decimal: 2.4 },
      draw: { label: '12/5', decimal: 3.4 },
      away: { label: '8/5', decimal: 2.6 },
    },
  },
  {
    id: 'm3',
    league: 'Bundesliga',
    home: 'Bayern',
    away: 'Dortmund',
    odds: {
      home: { label: '11/10', decimal: 2.1 },
      draw: { label: '5/2', decimal: 3.5 },
      away: { label: '12/5', decimal: 3.4 },
    },
  },
]

type EntryMode = 'live' | 'prematch'

const FLOAT_BETS_BY_MODE: Record<EntryMode, FloatBetEntry[]> = {
  live: FLOAT_BETS_LIVE,
  prematch: FLOAT_BETS_PREMATCH,
}

const MOBILE_MATCHES_BY_MODE: Record<EntryMode, MobileMatch[]> = {
  live: MOBILE_MATCHES_LIVE,
  prematch: MOBILE_MATCHES_PREMATCH,
}

type EntryCoverageRow = {
  scenario: string
  topZone: string
  selectionZone: string
  marketZone: string
}

type EntryVariantMock = {
  id: string
  title: string
  state: 'Live' | 'Pre-match' | 'Suspended'
  topMeta?: string
  topPrimary: string
  topSecondary?: string
  odds: string
  selection: string
  market: string
}

const ENTRY_COVERAGE_ROWS: EntryCoverageRow[] = [
  {
    scenario: 'Football live 1x2',
    topZone: "Score + clock (1-0 · 67') with match line",
    selectionZone: 'Decimal odds + team selection',
    marketZone: 'Match Result · Full Time',
  },
  {
    scenario: 'Football pre-match totals',
    topZone: 'Match line only',
    selectionZone: 'Odds + Over/Under line',
    marketZone: 'Total Goals · Full Time',
  },
  {
    scenario: 'Player card market',
    topZone: 'Match line + optional live status',
    selectionZone: 'Odds + player name',
    marketZone: 'Player to Be Carded',
  },
  {
    scenario: 'Tennis live detailed',
    topZone: 'Line 1 players, line 2 set/game context',
    selectionZone: 'Odds + player/set selection',
    marketZone: 'Set Winner or Game Handicap',
  },
  {
    scenario: 'Basketball live',
    topZone: 'Qx + game clock + score',
    selectionZone: 'Odds + side/total pick',
    marketZone: 'Moneyline or Total Points',
  },
  {
    scenario: 'Esports map market',
    topZone: 'Teams + map/round state',
    selectionZone: 'Odds + team/map outcome',
    marketZone: 'Map Winner · Map 2',
  },
  {
    scenario: 'Suspended selection',
    topZone: 'Context unchanged',
    selectionZone: 'Suspended label replaces odds',
    marketZone: 'Keep market label visible',
  },
  {
    scenario: 'Long names stress test',
    topZone: 'Ellipsis on line 1, preserve key live metadata',
    selectionZone: 'Odds never truncate, selection may ellipsize',
    marketZone: 'Wrap to max 2 lines',
  },
]

const ENTRY_VARIANTS: EntryVariantMock[] = [
  {
    id: 'v1',
    title: 'Football Live — Team Pick',
    state: 'Live',
    topMeta: "1-0 · 67'",
    topPrimary: 'Arsenal - Manchester City',
    odds: '2.15',
    selection: 'Arsenal',
    market: 'Match Result',
  },
  {
    id: 'v2',
    title: 'Football Pre-match — Totals',
    state: 'Pre-match',
    topPrimary: 'Barcelona - Real Madrid',
    odds: '1.92',
    selection: 'Over 2.5',
    market: 'Total Goals',
  },
  {
    id: 'v3',
    title: 'Tennis Live — Detailed Context',
    state: 'Live',
    topPrimary: 'Nadal vs Alcaraz',
    topSecondary: '2nd Set · 0-1 · 2-2 AD:40',
    odds: '1.78',
    selection: 'Alcaraz to win Set 2',
    market: 'Set Winner',
  },
  {
    id: 'v4',
    title: 'Player Card Market',
    state: 'Live',
    topMeta: "0-0 · 34'",
    topPrimary: 'Liverpool - Chelsea',
    odds: '3.40',
    selection: 'Declan Rice',
    market: 'Player to Be Carded',
  },
  {
    id: 'v5',
    title: 'Basketball Live',
    state: 'Live',
    topPrimary: 'Lakers - Celtics',
    topSecondary: 'Q3 · 04:21 · 74-71',
    odds: '1.84',
    selection: 'Over 164.5',
    market: 'Total Points',
  },
  {
    id: 'v6',
    title: 'Suspended Example',
    state: 'Suspended',
    topMeta: "2-1 · 88'",
    topPrimary: 'Tottenham - Manchester United',
    odds: '⏸',
    selection: 'Suspended',
    market: 'Match Result',
  },
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

function buildFloatBet(match: MobileMatch, oddKey: MobileOddKey): FloatBetEntry {
  const selection = oddKey === 'home' ? match.home : oddKey === 'draw' ? 'Draw' : match.away
  return {
    id: `${match.id}-${oddKey}`,
    match: `${match.home} - ${match.away}`,
    league: match.league,
    market: 'Full Time Result',
    selection,
    odds: match.odds[oddKey].decimal,
    isLive: true,
    minute: Number((match.minute ?? '').replace("'", '')) || 43,
  }
}

function MobileSportsbookMock({
  floatBets,
  matches,
  entryMode,
  onToggleOdd,
}: {
  floatBets: FloatBetEntry[]
  matches: MobileMatch[]
  entryMode: EntryMode
  onToggleOdd: (match: MobileMatch, odd: MobileOddKey) => void
}) {
  const activeByMatch = useMemo(() => {
    const map: Record<string, MobileOddKey | undefined> = {}
    for (const bet of floatBets) {
      const [matchId, oddKey] = bet.id.split('-') as [string, MobileOddKey]
      if (matchId && oddKey) map[matchId] = oddKey
    }
    return map
  }, [floatBets])

  return (
    <div className={styles.mobileViewport}>
      <div className={styles.mobileBook}>
        <div className={styles.mobileHeader}>
          <button className={styles.mobileHeaderBtn} type="button">⌕</button>
          <div className={styles.mobileLogo}>110x28</div>
          <button className={styles.mobileIconGhost} type="button">🎁</button>
          <div className={styles.mobileHeaderActions}>
            <button className={styles.mobilePillGhost} type="button">Log in</button>
            <button className={styles.mobilePillPrimary} type="button">Register</button>
          </div>
        </div>

        <div className={styles.mobileHeroWrap}>
          <div className={styles.mobileHero}>
            <div className={styles.mobileHeroLeague}>Champions League</div>
            <div className={styles.mobileHeroTitle}>Galatasaray - Fenerbahce</div>
            <div className={styles.mobileHeroKickoff}>Today 19:00</div>
            <div className={styles.mobileHeroOdds}>
              <span className={styles.mobileHeroOddBtn}>8/5</span>
              <span className={styles.mobileHeroOddBtn}>11/5</span>
              <span className={styles.mobileHeroOddBtn}>13/8</span>
            </div>
          </div>
          <div className={styles.mobileDots}>
            <span className={styles.mobileDotActive} />
            <span className={styles.mobileDot} />
            <span className={styles.mobileDot} />
          </div>
        </div>

        <div className={styles.mobileSectionTitle}>Popular</div>
        <div className={styles.mobilePopularRow}>
          {MOBILE_POPULAR.map((name) => (
            <span key={name} className={styles.mobileTag}>{name}</span>
          ))}
        </div>

        <div className={styles.mobileLiveHeader}>
          <div className={styles.mobileLiveHeaderTop}>
            <span className={styles.mobileLiveBadge}>LIVE</span>
            <span className={styles.mobileSectionTitleInline}>
              {entryMode === 'live' ? 'Live matches' : 'Pre-match matches'}
            </span>
            <span className={styles.mobileCountBadge}>48</span>
          </div>
          <div className={styles.mobileLiveHeaderBottom}>
            <span className={`${styles.mobileSmallBadge} ${styles.mobileSmallBadgeActive}`}>⚽</span>
            <span className={styles.mobileSmallBadge}>●</span>
            <span className={styles.mobileSmallBadge}>●</span>
            <span className={styles.mobileSmallBadge}>●</span>
            <span className={styles.mobileSettings}>⚙</span>
          </div>
        </div>

        <div className={styles.mobileOddsHeader}>
          <span className={styles.mobileOddsSpacer}>Matches</span>
          <span className={styles.mobileMarketLabel}>FULL TIME RESULT</span>
          <span>1</span>
          <span>X</span>
          <span>2</span>
        </div>

        <div className={styles.mobileMatches}>
          {matches.map((match) => {
            const active = activeByMatch[match.id]
            return (
              <div key={match.id} className={styles.mobileMatchRow}>
                <div className={styles.mobileLeague}>{match.league}</div>
                <div className={styles.mobileMatchMain}>
                  <div className={styles.mobileTeams}>
                    <div className={styles.mobileTeamLine}>
                      <span className={styles.mobileTeamCheck} />
                      <span>{match.home}</span>
                      <span className={styles.mobileTeamScore}>0</span>
                    </div>
                    <div className={styles.mobileTeamLine}>
                      <span className={styles.mobileTeamCheck} />
                      <span>{match.away}</span>
                      <span className={styles.mobileTeamScore}>0</span>
                    </div>
                  </div>
                  <div className={styles.mobileOddsRow}>
                    {(['home', 'draw', 'away'] as const).map((oddKey) => (
                      <button
                        key={oddKey}
                        type="button"
                        className={`${styles.mobileOddBtn} ${active === oddKey ? styles.mobileOddBtnActive : ''}`}
                        onClick={() => onToggleOdd(match, oddKey)}
                      >
                        {match.odds[oddKey].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.mobileMatchFooter}>
                  <div className={styles.mobileMinute}>{match.minute}</div>
                  <div className={styles.mobileRowIcons}>◫ ◯</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.mobileShowMore}>Show More</div>
      </div>
    </div>
  )
}

/* ---- Main Visualiser ---- */

type SportsbookVisualiserMode = 'official' | 'playground'

type SportsbookVisualiserProps = {
  mode?: SportsbookVisualiserMode
}

export function SportsbookVisualiser({ mode = 'official' }: SportsbookVisualiserProps) {
  const [v1Bets, setV1Bets] = useState<BetEntry[]>(V1_BETS)
  const [v2Bets, setV2Bets] = useState<BetEntryV2[]>(V2_BETS)
  const [trBets, setTrBets] = useState<BetEntryTR[]>(TR_BETS)
  const [entryMode, setEntryMode] = useState<EntryMode>('live')
  const [floatBets, setFloatBets] = useState<FloatBetEntry[]>(FLOAT_BETS_BY_MODE.live)
  const [openDefaultSignal, setOpenDefaultSignal] = useState(0)
  const sourceFloatBets = FLOAT_BETS_BY_MODE[entryMode]
  const currentMobileMatches = MOBILE_MATCHES_BY_MODE[entryMode]

  function toggleFromOdds(match: MobileMatch, odd: MobileOddKey) {
    const nextId = `${match.id}-${odd}`
    setFloatBets((prev) => {
      const withoutMatch = prev.filter((b) => !b.id.startsWith(`${match.id}-`))
      const alreadyActive = prev.some((b) => b.id === nextId)
      if (alreadyActive) return withoutMatch
      return [...withoutMatch, buildFloatBet(match, odd)]
    })
  }

  const isOfficial = mode === 'official'
  const isPlayground = mode === 'playground'

  return (
    <div className={styles.page}>
      {isPlayground && (
        <div className={styles.sportsbook}>
          <TopNav />

          <div className={styles.layout}>
            <LeftSidebar />

            <CenterContent />

            {/* Right sidebar */}
            <aside className={styles.rightSidebar}>
              <LatestResults />
              <LatestWins />
            </aside>
          </div>
        </div>
      )}

      {isOfficial && <div className={styles.miniStripSection}>
        <span className={styles.betslipLabel}>Belloa Betslip</span>
        <p className={styles.miniStripHint}>
          Tap the mini strip to open the drawer · tap stake field to enter amount · Place Bet to confirm
        </p>

        {/* Controls */}
        <div className={styles.miniStripControls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Entries</span>
            <div className={styles.chipRow}>
              <button
                className={`${styles.chip} ${entryMode === 'live' ? styles.chipActive : ''}`}
                onClick={() => {
                  setEntryMode('live')
                  setFloatBets(FLOAT_BETS_BY_MODE.live)
                }}
                type="button"
              >
                Live matches
              </button>
              <button
                className={`${styles.chip} ${entryMode === 'prematch' ? styles.chipActive : ''}`}
                onClick={() => {
                  setEntryMode('prematch')
                  setFloatBets(FLOAT_BETS_BY_MODE.prematch)
                }}
                type="button"
              >
                Pre-match matches
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Selections</span>
            <div className={styles.chipRow}>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`${styles.chip} ${floatBets.length === n ? styles.chipActive : ''}`}
                  onClick={() => setFloatBets(sourceFloatBets.slice(0, n))}
                  type="button"
                >
                  {n} sel.
                </button>
              ))}
              <button
                className={`${styles.chip} ${floatBets.length === 0 ? styles.chipActive : ''}`}
                onClick={() => setFloatBets([])}
                type="button"
              >
                Empty
              </button>
              <button
                className={styles.chip}
                onClick={() => setFloatBets(sourceFloatBets)}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Odds direction (sel. 1)</span>
            <div className={styles.chipRow}>
              {(['none', 'up', 'down'] as const).map((dir) => (
                <button
                  key={dir}
                  className={styles.chip}
                  onClick={() =>
                    setFloatBets((prev) =>
                      prev.map((b, i) =>
                        i === 0 ? { ...b, oddsDirection: dir === 'none' ? undefined : dir } : b
                      )
                    )
                  }
                  type="button"
                >
                  {dir === 'none' ? '— none' : dir === 'up' ? '▲ up' : '▼ down'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Suspended</span>
            <div className={styles.chipRow}>
              <button
                className={styles.chip}
                onClick={() =>
                  setFloatBets((prev) =>
                    prev.map((b, i) => (i === 1 ? { ...b, suspended: !b.suspended } : b))
                  )
                }
                type="button"
              >
                Toggle sel. 2
              </button>
              <button
                className={styles.chip}
                onClick={() =>
                  setFloatBets((prev) => prev.map((b) => ({ ...b, suspended: true })))
                }
                type="button"
              >
                Suspend all
              </button>
            </div>
          </div>
        </div>

        <div className={styles.floatDemoRow}>
          <div className={styles.phoneDemoCol}>
            <span className={styles.phoneVariantLabel}>Mobile preview · Current</span>
            <div
              className={`${styles.phoneFrame} ${styles.phoneFrameBgLive}`}
              onClick={() => setOpenDefaultSignal((s) => s + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setOpenDefaultSignal((s) => s + 1)
              }}
            >
              <MobileSportsbookMock
                floatBets={floatBets}
                matches={currentMobileMatches}
                entryMode={entryMode}
                onToggleOdd={toggleFromOdds}
              />
              <div className={styles.phoneBottomNav} />
              <FloatingBetslip
                bets={floatBets}
                contained
                variant="default"
                openSignal={openDefaultSignal}
                onRemoveBet={(id) => setFloatBets((prev) => prev.filter((b) => b.id !== id))}
                onClearAll={() => setFloatBets([])}
              />
            </div>
          </div>

          <div className={styles.desktopDemoCol}>
            <span className={styles.phoneVariantLabel}>Desktop preview · Current</span>
            <div className={styles.desktopPreviewShell}>
              <TopNav />
              <div className={styles.layout}>
                <LeftSidebar />
                <CenterContent />
                <aside className={styles.rightSidebar}>
                  <LatestResults />
                  <LatestWins />
                </aside>
              </div>
              <div className={styles.desktopPreviewBetslip}>
                <FloatingBetslip
                  bets={floatBets}
                  contained
                  variant="default"
                  onRemoveBet={(id) => setFloatBets((prev) => prev.filter((b) => b.id !== id))}
                  onClearAll={() => setFloatBets([])}
                />
              </div>
            </div>
          </div>
        </div>
      </div>}

      {isOfficial && <section className={styles.betEntryLabSection}>
        <span className={styles.betslipLabel}>BetEntry Coverage Matrix</span>
        <p className={styles.betEntryLabIntro}>
          Documentation + mocks for a future-proof entry model. Each variant follows three content zones:
          event context, selection+odds, and market descriptor.
        </p>

        <div className={styles.betEntryDocsGrid}>
          <article className={styles.betEntryDocCard}>
            <h3 className={styles.betEntryDocTitle}>Structure Rules</h3>
            <ul className={styles.betEntryRuleList}>
              <li>Top zone: match/participants plus live metadata when available.</li>
              <li>Selection zone: odds plus selected outcome (team, player, line, or combo).</li>
              <li>Market zone: canonical market label with optional scope (full time, set, map).</li>
              <li>Fallbacks: preserve odds visibility, then selection, then market wrapping.</li>
            </ul>
          </article>

          <article className={styles.betEntryDocCard}>
            <h3 className={styles.betEntryDocTitle}>Coverage Matrix</h3>
            <div className={styles.betEntryTable}>
              <div className={styles.betEntryTableHeader}>
                <span>Scenario</span>
                <span>Top Zone</span>
                <span>Selection Zone</span>
                <span>Market Zone</span>
              </div>
              {ENTRY_COVERAGE_ROWS.map((row) => (
                <div key={row.scenario} className={styles.betEntryTableRow}>
                  <span>{row.scenario}</span>
                  <span>{row.topZone}</span>
                  <span>{row.selectionZone}</span>
                  <span>{row.marketZone}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className={styles.betEntryVariantGrid}>
          {ENTRY_VARIANTS.map((variant) => (
            <article key={variant.id} className={styles.betEntryVariantCard}>
              <div className={styles.betEntryVariantHead}>
                <span className={styles.betEntryVariantTitle}>{variant.title}</span>
                <span
                  className={[
                    styles.betEntryStatePill,
                    variant.state === 'Live'
                      ? styles.betEntryStateLive
                      : variant.state === 'Pre-match'
                      ? styles.betEntryStatePrematch
                      : styles.betEntryStateSuspended,
                  ].join(' ')}
                >
                  {variant.state}
                </span>
              </div>
              <div className={styles.betEntryMock}>
                <div className={styles.betEntryMockTop}>
                  <div className={styles.betEntryMockTopLine}>
                    <span className={styles.betEntryMockTopPrimary}>
                      {variant.topMeta && (
                        <span className={styles.betEntryMockMeta}>{variant.topMeta}</span>
                      )}
                      <span>{variant.topPrimary}</span>
                    </span>
                    <span className={styles.betEntryMockRemove}>✕</span>
                  </div>
                  {variant.topSecondary && (
                    <span className={styles.betEntryMockTopSecondary}>{variant.topSecondary}</span>
                  )}
                </div>
                <div className={styles.betEntryMockMid}>
                  <span className={styles.betEntryMockOdds}>{variant.odds}</span>
                  <span className={styles.betEntryMockSelection}>{variant.selection}</span>
                </div>
                <div className={styles.betEntryMockMarket}>{variant.market}</div>
              </div>
            </article>
          ))}
        </div>
      </section>}

      {isPlayground && <div className={styles.betslipComparison}>
        <div className={styles.betslipColumn}>
          <span className={styles.betslipLabel}>Betslip V1</span>
          <Betslip
            bets={v1Bets}
            bonuses={V1_BONUSES}
            onPlaceBet={async () => {}}
            onRemoveBet={(id) => setV1Bets((prev) => prev.filter((b) => b.id !== id))}
            onClearAll={() => setV1Bets([])}
          />
        </div>
        <div className={styles.betslipColumn}>
          <span className={styles.betslipLabel}>Betslip V2</span>
          <BetslipV2
            bets={v2Bets}
            onPlaceBet={async () => {}}
            onRemoveBet={(id) => setV2Bets((prev) => prev.filter((b) => b.id !== id))}
            onClearAll={() => setV2Bets([])}
          />
        </div>
        <div className={styles.betslipColumn}>
          <span className={styles.betslipLabel}>Betslip TR 🇹🇷</span>
          <BetslipTR
            bets={trBets}
            onPlaceBet={async () => {}}
            onRemoveBet={(id) => setTrBets((prev) => prev.filter((b) => b.id !== id))}
            onClearAll={() => setTrBets([])}
          />
        </div>
      </div>}
    </div>
  )
}