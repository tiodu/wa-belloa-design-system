import { ChevronRight } from 'lucide-react'
import { SportCategoryTabs } from '../../../components/SportCategoryTabs/SportCategoryTabs'
import { LiveMatchesSection } from '../../../components/LiveMatchesSection/LiveMatchesSection'
import type { BetEntry } from '../../../components/FloatingBetslip'
import styles from './SportsbookHomeView.module.css'

// ─── Shared bet props ─────────────────────────────────────────

interface BetProps {
  selectedBetIds: Set<string>
  onAddBet: (bet: BetEntry) => void
  onRemoveBet: (id: string) => void
}

// ─── Mock data ────────────────────────────────────────────────

interface OddsButton {
  label: string
  odds: string
}

interface HeroMatch {
  competition: string
  teamHome: string
  teamAway: string
  time: string
  buttons: OddsButton[]
}

interface MatchRow {
  id: string
  competition: string
  teamHome: string
  teamAway: string
  time: string
  b1: string
  bX: string
  b2: string
}

const HERO: HeroMatch = {
  competition: 'Champions League',
  teamHome: 'Galatasaray',
  teamAway: 'Fenerbahçe',
  time: 'Today 19:00',
  buttons: [
    { label: '1', odds: '2.60' },
    { label: 'X', odds: '3.20' },
    { label: '2', odds: '2.40' },
  ],
}

const FEATURED_MATCHES: MatchRow[] = [
  { id: 'f1', competition: 'Premier League', teamHome: 'Chelsea',         teamAway: 'Liverpool',    time: 'Today 21:00', b1: '3.20', bX: '3.40', b2: '2.10' },
  { id: 'f2', competition: 'La Liga',        teamHome: 'Atlético Madrid', teamAway: 'Sevilla',      time: 'Today 21:00', b1: '1.85', bX: '3.50', b2: '4.20' },
  { id: 'f3', competition: 'Ligue 1',        teamHome: 'PSG',             teamAway: 'Lyon',         time: 'Today 22:00', b1: '1.55', bX: '4.10', b2: '5.50' },
  { id: 'f4', competition: 'Bundesliga',     teamHome: 'Leverkusen',      teamAway: 'Leipzig',      time: 'Tomorrow 18:00', b1: '2.10', bX: '3.30', b2: '3.40' },
]

const TOP_BET_MATCHES: MatchRow[] = [
  { id: 't1', competition: 'Champions League', teamHome: 'Real Madrid', teamAway: 'Man City',  time: 'Today 20:00', b1: '2.10', bX: '3.60', b2: '3.20' },
  { id: 't2', competition: 'Europa League',    teamHome: 'Roma',        teamAway: 'Ajax',      time: 'Today 21:00', b1: '2.30', bX: '3.20', b2: '2.90' },
]

const COMING_SOON: MatchRow[] = [
  { id: 'c1', competition: 'Premier League', teamHome: 'Tottenham',   teamAway: 'Newcastle',    time: 'Thu 01 May · 20:00', b1: '2.40', bX: '3.30', b2: '2.80' },
  { id: 'c2', competition: 'La Liga',        teamHome: 'Real Betis',  teamAway: 'Valencia',     time: 'Thu 01 May · 21:00', b1: '2.20', bX: '3.10', b2: '3.20' },
  { id: 'c3', competition: 'Serie A',        teamHome: 'Inter Milan', teamAway: 'Napoli',       time: 'Fri 02 May · 20:45', b1: '1.90', bX: '3.60', b2: '3.80' },
  { id: 'c4', competition: 'Bundesliga',     teamHome: 'Stuttgart',   teamAway: 'Wolfsburg',    time: 'Fri 02 May · 18:30', b1: '2.00', bX: '3.40', b2: '3.50' },
]

// ─── Odds button ──────────────────────────────────────────────

function OddsBtn({
  id, label, odds, selected, onAddBet, onRemoveBet,
}: {
  id: string
  label: string
  odds: string
  selected: boolean
  onAddBet: (bet: BetEntry) => void
  onRemoveBet: (id: string) => void
}) {
  function handleClick() {
    if (selected) {
      onRemoveBet(id)
    } else {
      onAddBet({ id, match: '', market: 'Match Result', selection: label, odds: parseFloat(odds) })
    }
  }

  return (
    <button
      className={`${styles.oddsBtn} ${selected ? styles.oddsBtnSelected : ''}`}
      type="button"
      onClick={handleClick}
    >
      <span className={styles.oddsBtnLabel}>{label}</span>
      <span className={styles.oddsBtnOdds}>{odds}</span>
    </button>
  )
}

function SectionHeader({ title, count, showSeeAll = true }: { title: string; count?: number; showSeeAll?: boolean }) {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderLeft}>
        <span className={styles.sectionTitle}>{title}</span>
        {count !== undefined && (
          <span className={styles.sectionBadge}>{count}</span>
        )}
      </div>
      {showSeeAll && (
        <button className={styles.seeAllBtn} type="button">
          See all <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

function MatchRowItem({ match, betProps }: { match: MatchRow; betProps: BetProps }) {
  const { selectedBetIds, onAddBet, onRemoveBet } = betProps
  const matchLabel = `${match.teamHome} v ${match.teamAway}`

  function makeOddsBtn(label: string, oddsVal: string) {
    const id = `${match.id}-${label}`
    return (
      <OddsBtn
        key={id}
        id={id}
        label={label}
        odds={oddsVal}
        selected={selectedBetIds.has(id)}
        onAddBet={(bet) => onAddBet({ ...bet, match: matchLabel, league: match.competition })}
        onRemoveBet={onRemoveBet}
      />
    )
  }

  return (
    <div className={styles.matchRow}>
      <div className={styles.matchRowLeft}>
        <span className={styles.matchCompetition}>{match.competition}</span>
        <div className={styles.matchTeams}>
          <span className={styles.matchTeam}>{match.teamHome}</span>
          <span className={styles.matchVs}>vs</span>
          <span className={styles.matchTeam}>{match.teamAway}</span>
        </div>
        <span className={styles.matchTime}>{match.time}</span>
      </div>
      <div className={styles.matchOdds}>
        {makeOddsBtn('1', match.b1)}
        {makeOddsBtn('X', match.bX)}
        {makeOddsBtn('2', match.b2)}
      </div>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────

function HeroCarousel({ betProps }: { betProps: BetProps }) {
  const { selectedBetIds, onAddBet, onRemoveBet } = betProps
  const matchLabel = `${HERO.teamHome} v ${HERO.teamAway}`

  return (
    <div className={styles.heroWrap}>
      <div className={styles.heroCard}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroCompetition}>
            <span className={styles.heroCompetitionDot} />
            {HERO.competition}
          </div>
          <div className={styles.heroTeams}>
            <span className={styles.heroTeam}>{HERO.teamHome}</span>
            <span className={styles.heroSeparator}>—</span>
            <span className={styles.heroTeam}>{HERO.teamAway}</span>
          </div>
          <div className={styles.heroTime}>{HERO.time}</div>
          <div className={styles.heroOdds}>
            {HERO.buttons.map(b => {
              const id = `hero-${b.label}`
              return (
                <OddsBtn
                  key={id}
                  id={id}
                  label={b.label}
                  odds={b.odds}
                  selected={selectedBetIds.has(id)}
                  onAddBet={(bet) => onAddBet({ ...bet, match: matchLabel, league: HERO.competition })}
                  onRemoveBet={onRemoveBet}
                />
              )
            })}
          </div>
        </div>
        <div className={styles.heroSilhouetteHome} />
        <div className={styles.heroSilhouetteAway} />
      </div>
      <div className={styles.heroDots}>
        <span className={`${styles.heroDot} ${styles.heroDotActive}`} />
        <span className={styles.heroDot} />
        <span className={styles.heroDot} />
      </div>
    </div>
  )
}

function FeaturedMatchesSection({ betProps }: { betProps: BetProps }) {
  return (
    <div className={styles.section}>
      <SectionHeader title="Featured matches today" />
      {FEATURED_MATCHES.map(m => (
        <MatchRowItem key={m.id} match={m} betProps={betProps} />
      ))}
    </div>
  )
}

function TopBetSection({ betProps }: { betProps: BetProps }) {
  return (
    <div className={styles.section}>
      <SectionHeader title="Top bet" />
      {TOP_BET_MATCHES.map(m => (
        <MatchRowItem key={m.id} match={m} betProps={betProps} />
      ))}
    </div>
  )
}

function ComingSoonSection({ betProps }: { betProps: BetProps }) {
  return (
    <div className={styles.section}>
      <SectionHeader title="Coming soon" showSeeAll={false} />
      {COMING_SOON.map(m => (
        <MatchRowItem key={m.id} match={m} betProps={betProps} />
      ))}
    </div>
  )
}

// ─── View ─────────────────────────────────────────────────────

interface SportsbookHomeViewProps {
  selectedBetIds: Set<string>
  onAddBet: (bet: BetEntry) => void
  onRemoveBet: (id: string) => void
}

export function SportsbookHomeView({ selectedBetIds, onAddBet, onRemoveBet }: SportsbookHomeViewProps) {
  const betProps: BetProps = { selectedBetIds, onAddBet, onRemoveBet }

  return (
    <div className={styles.view}>
      <SportCategoryTabs />
      <HeroCarousel betProps={betProps} />
      <LiveMatchesSection
        selectedBetIds={selectedBetIds}
        onAddBet={onAddBet}
        onRemoveBet={onRemoveBet}
      />
      <div className={styles.divider} />
      <FeaturedMatchesSection betProps={betProps} />
      <div className={styles.divider} />
      <TopBetSection betProps={betProps} />
      <div className={styles.divider} />
      <ComingSoonSection betProps={betProps} />
      <div className={styles.bottomPad} />
    </div>
  )
}
