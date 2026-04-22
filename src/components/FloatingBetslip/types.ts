export type OddsDirection = 'up' | 'down'

export type VaixLeg = {
  selection: string
  market: string
}

export type BetEntry = {
  id: string
  match: string
  league?: string
  market: string
  selection: string
  odds: number
  originalOdds?: number        // odds when first added (for flash direction)
  oddsDirection?: OddsDirection
  oddsChangeSignal?: number      // increment to re-trigger blink animation
  suspended?: boolean
  isLive?: boolean
  score?: string               // e.g. "1-0"
  minute?: number              // e.g. 67
  sparkline?: number[]         // 6 normalised values 0–1 (for full drawer graph)
  /** Special bet types that cannot be combined with regular bets */
  betType?: 'vaix' | 'boost'
  /** VAIX: the individual legs shown inside the grouped entry card */
  vaixLegs?: VaixLeg[]
  /** Boost: sport label shown in the card header */
  sportLabel?: string
  /** Boost: sport icon shown in the card header */
  sportIcon?: string
  /** Boost: kickoff date/time shown in the card header */
  kickoffTime?: string
  /** Event or market is no longer available for betting (error 157) */
  unavailable?: boolean
}

export type BetslipState = 'mini' | 'open' | 'closed'

export type BetPlacementStage = 'idle' | 'loading' | 'summary' | 'error'

export type BonusThreshold = {
  selections: number   // qualifying selections needed
  percent: number      // boost percentage at this tier
}

export type BonusTrackerConfig = {
  label: string
  thresholds: BonusThreshold[]
  /** Minimum odds required for a selection to count toward the boost (e.g. 1.3) */
  minOdds?: number
}

/* ---- Odds helpers ---- */

export function combinedOdds(bets: BetEntry[]): number {
  if (bets.length === 0) return 1
  return bets.reduce((acc, b) => acc * b.odds, 1)
}

export function getAccaLabel(count: number): string {
  if (count === 2) return 'Double'
  if (count === 3) return 'Treble'
  if (count === 4) return '4-Fold'
  return `${count}-Fold`
}
