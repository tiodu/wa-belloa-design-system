import { useState } from 'react'
import { Info, BarChart2, Play } from 'lucide-react'
import styles from './LiveMatchesSection.module.css'

// ─── Types ────────────────────────────────────────────────────

type SportType = 'football' | 'basketball' | 'tennis' | 'mma'

interface OddsEntry {
  label: string
  value: string
  selected?: boolean
  trendUp?: boolean
  trendDown?: boolean
}

interface LiveMatch {
  id: string
  sport: SportType
  sportIcon: string
  sportLabel: string
  competition: string
  market: string
  teamHome: string
  teamAway: string
  scoreHome?: string
  scoreAway?: string
  /** Tennis: current set scores [home, away] */
  currentSet?: [string, string]
  odds: OddsEntry[]
  liveTime: string
}

// ─── Mock data ────────────────────────────────────────────────

const LIVE_MATCHES: LiveMatch[] = [
  // Football matches (shown in football filter view)
  {
    id: 'lm-f1',
    sport: 'football',
    sportIcon: '⚽',
    sportLabel: 'Football',
    competition: 'Premier League',
    market: 'Full time Result',
    teamHome: 'Liverpool',
    teamAway: 'Manchester City',
    scoreHome: '(2)',
    scoreAway: '(2)',
    odds: [
      { label: '1',  value: '1.49', selected: true },
      { label: 'X',  value: '1.49' },
      { label: '2',  value: '6.10' },
    ],
    liveTime: "65'",
  },
  {
    id: 'lm-f2',
    sport: 'football',
    sportIcon: '⚽',
    sportLabel: 'Football',
    competition: 'Bundesliga',
    market: 'Full time Result',
    teamHome: 'Bayern Munich',
    teamAway: 'Borussia Dortmund',
    scoreHome: '(3)',
    scoreAway: '(0)',
    odds: [
      { label: '1',  value: '1.60', trendDown: true },
      { label: 'X',  value: '1.49' },
      { label: '2',  value: '1.49', trendUp: true },
    ],
    liveTime: "80'",
  },
  {
    id: 'lm-f3',
    sport: 'football',
    sportIcon: '⚽',
    sportLabel: 'Football',
    competition: 'Serie A',
    market: 'Full time Result',
    teamHome: 'Juventus',
    teamAway: 'AC Milan',
    scoreHome: '(2)',
    scoreAway: '(1)',
    odds: [
      { label: '1', value: '1.49' },
      { label: 'X', value: '1.49' },
      { label: '2', value: '1.49', trendUp: true },
    ],
    liveTime: "75'",
  },
  {
    id: 'lm-f4',
    sport: 'football',
    sportIcon: '⚽',
    sportLabel: 'Football',
    competition: 'Ligue 1',
    market: 'Full time Result',
    teamHome: 'Paris SG',
    teamAway: 'Marseille',
    scoreHome: '(4)',
    scoreAway: '(2)',
    odds: [
      { label: '1', value: '1.49' },
      { label: 'X', value: '1.49' },
      { label: '2', value: '9.00' },
    ],
    liveTime: "85'",
  },
  {
    id: 'lm-f5',
    sport: 'football',
    sportIcon: '⚽',
    sportLabel: 'Football',
    competition: 'Eredivisie',
    market: 'Full time Result',
    teamHome: 'Ajax',
    teamAway: 'Feyenoord',
    scoreHome: '(3)',
    scoreAway: '(1)',
    odds: [
      { label: '1', value: '1.49' },
      { label: 'X', value: '1.49' },
      { label: '2', value: '6.80' },
    ],
    liveTime: "88'",
  },
  // Basketball
  {
    id: 'lm-b1',
    sport: 'basketball',
    sportIcon: '🏀',
    sportLabel: 'Basketball',
    competition: 'BSL',
    market: 'Over / Under',
    teamHome: 'Anadolu Efes',
    teamAway: 'Fenerbahçe B...',
    scoreHome: '(48)',
    scoreAway: '(52)',
    odds: [
      { label: 'O 21.5', value: '1.49' },
      { label: 'U 21.5', value: '1.49' },
    ],
    liveTime: 'Q3 · 4:22',
  },
  // Tennis
  {
    id: 'lm-t1',
    sport: 'tennis',
    sportIcon: '🎾',
    sportLabel: 'Tennis',
    competition: 'ATP Istanbul',
    market: 'Over / Under',
    teamHome: 'Ç. Alcaraz',
    teamAway: 'D. Medvedev',
    scoreHome: '6-',
    scoreAway: '4',
    currentSet: ['3-', '2'],
    odds: [
      { label: 'O 21.5', value: '1.49' },
      { label: 'U 21.5', value: '1.49' },
    ],
    liveTime: '2nd Set',
  },
  // MMA
  {
    id: 'lm-m1',
    sport: 'mma',
    sportIcon: '🥊',
    sportLabel: 'MMA',
    competition: 'MMA Fight Night',
    market: 'Total Rounds Over/Under',
    teamHome: 'I. Adesanya',
    teamAway: 'R. Whittaker',
    scoreHome: '(2)',
    scoreAway: '(1)',
    odds: [
      { label: 'O 4.5 Rounds', value: '1.85' },
      { label: 'U 4.5 Rounds', value: '1.95' },
    ],
    liveTime: 'R2 · 1:15 LEFT',
  },
]

const FILTER_TABS: { id: string; icon: string; sport?: SportType }[] = [
  { id: 'all',        icon: '⚽🏀' },
  { id: 'football',   icon: '⚽', sport: 'football'   },
  { id: 'basketball', icon: '🏀', sport: 'basketball' },
  { id: 'tennis',     icon: '🎾', sport: 'tennis'     },
  { id: 'mma',        icon: '🥊', sport: 'mma'        },
]

// ─── Sub-components ───────────────────────────────────────────

function LiveBadge() {
  return (
    <div className={styles.liveBadge}>
      <span className={styles.liveBadgeText}>Live</span>
    </div>
  )
}

function FootballOdds({ odds }: { odds: OddsEntry[] }) {
  const [left, mid, right] = odds
  return (
    <div className={styles.oddsGroup}>
      <button type="button" className={`${styles.oddsBtn} ${styles.oddsBtnLeft} ${left?.selected ? styles.oddsBtnSelected : ''}`}>
        <div className={styles.oddsBtnInner}>
          {left?.trendDown && <span className={`${styles.trendArrow} ${styles.trendDown}`}>▼</span>}
          <span className={styles.oddsBtnLabel}>{left?.label}</span>
          <span className={`${styles.oddsBtnValue} ${left?.trendDown ? styles.oddsBtnValueDown : ''}`}>{left?.value}</span>
        </div>
      </button>
      <button type="button" className={`${styles.oddsBtn} ${styles.oddsBtnMiddle} ${mid?.selected ? styles.oddsBtnSelected : ''}`}>
        <div className={styles.oddsBtnInner}>
          <span className={styles.oddsBtnLabel}>{mid?.label}</span>
          <span className={styles.oddsBtnValue}>{mid?.value}</span>
        </div>
      </button>
      <button type="button" className={`${styles.oddsBtn} ${styles.oddsBtnRight} ${right?.selected ? styles.oddsBtnSelected : ''}`}>
        <div className={styles.oddsBtnInner}>
          {right?.trendUp && <span className={`${styles.trendArrow} ${styles.trendUp}`}>▲</span>}
          <span className={styles.oddsBtnLabel}>{right?.label}</span>
          <span className={styles.oddsBtnValue}>{right?.value}</span>
        </div>
      </button>
    </div>
  )
}

function TwoWayOdds({ odds }: { odds: OddsEntry[] }) {
  const [left, right] = odds
  return (
    <div className={styles.oddsGroup}>
      <button type="button" className={`${styles.oddsBtn} ${styles.oddsBtnOLeft} ${left?.selected ? styles.oddsBtnSelected : ''}`}>
        <div className={styles.oddsBtnInner}>
          <span className={styles.oddsBtnLabel}>{left?.label}</span>
          <span className={styles.oddsBtnValue}>{left?.value}</span>
        </div>
      </button>
      <button type="button" className={`${styles.oddsBtn} ${styles.oddsBtnORight} ${right?.selected ? styles.oddsBtnSelected : ''}`}>
        <div className={styles.oddsBtnInner}>
          <span className={styles.oddsBtnLabel}>{right?.label}</span>
          <span className={styles.oddsBtnValue}>{right?.value}</span>
        </div>
      </button>
    </div>
  )
}

function MatchCard({ match, showSportHeader }: { match: LiveMatch; showSportHeader: boolean }) {
  const isTennis = match.sport === 'tennis'

  return (
    <div className={styles.card}>
      {showSportHeader && (
        <div className={styles.sportHeader}>
          <div className={styles.sportHeaderAccent} />
          <div className={styles.sportHeaderLeft}>
            <span className={styles.sportIcon}>{match.sportIcon}</span>
            <span className={styles.sportName}>{match.sportLabel}</span>
          </div>
        </div>
      )}

      <div className={styles.matchContent}>
        <div className={styles.matchMetaRow}>
          <span className={styles.matchCompetition}>{match.competition}</span>
          <span className={styles.matchMarket}>{match.market}</span>
        </div>

        <div className={styles.matchTeamsOdds}>
          <div className={styles.matchTeams}>
            <div className={styles.matchTeamRow}>
              <span className={styles.matchTeamName}>{match.teamHome}</span>
              {isTennis ? (
                <div className={styles.matchTeamSets}>
                  <span className={styles.matchTeamSetScore}>{match.scoreHome}</span>
                  <span className={`${styles.matchTeamSetScore} ${styles.matchTeamSetScoreCurrent}`}>{match.currentSet?.[0]}</span>
                </div>
              ) : (
                <span className={styles.matchTeamScore}>{match.scoreHome}</span>
              )}
            </div>
            <div className={styles.matchTeamRow}>
              <span className={styles.matchTeamName}>{match.teamAway}</span>
              {isTennis ? (
                <div className={styles.matchTeamSets}>
                  <span className={styles.matchTeamSetScore}>{match.scoreAway}</span>
                  <span className={styles.matchTeamSetScore}>{match.currentSet?.[1]}</span>
                </div>
              ) : (
                <span className={styles.matchTeamScore}>{match.scoreAway}</span>
              )}
            </div>
          </div>

          {match.sport === 'football' ? (
            <FootballOdds odds={match.odds} />
          ) : (
            <TwoWayOdds odds={match.odds} />
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardFooterLeft}>
          <LiveBadge />
          <span className={styles.cardFooterTime}>{match.liveTime}</span>
        </div>
        <div className={styles.cardFooterActions}>
          <button type="button" className={styles.footerActionBtn}>
            <BarChart2 size={14} />
          </button>
          <button type="button" className={styles.footerActionBtn}>
            <Play size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────

interface LiveMatchesSectionProps {
  totalCount?: number
  matches?: LiveMatch[]
}

export function LiveMatchesSection({ totalCount = 48, matches = LIVE_MATCHES }: LiveMatchesSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? matches.filter((m, _, arr) => arr.findIndex(x => x.sport === m.sport) === arr.indexOf(m))
    : matches.filter(m => m.sport === (FILTER_TABS.find(t => t.id === activeFilter)?.sport))

  const showSportHeader = activeFilter === 'all'

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <LiveBadge />
          <span className={styles.sectionTitle}>Live matches</span>
          <button type="button" className={styles.infoBtn}>
            <Info size={14} />
          </button>
        </div>
        <button type="button" className={styles.viewAllBtn}>
          View All {totalCount}
        </button>
      </div>

      <div className={styles.filterTabs}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.filterTab} ${activeFilter === tab.id ? styles.filterTabActive : ''}`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      <div className={styles.cardsList}>
        {filtered.map(match => (
          <MatchCard key={match.id} match={match} showSportHeader={showSportHeader} />
        ))}
      </div>
    </div>
  )
}
