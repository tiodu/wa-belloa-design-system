export type BetEntry = {
  id: string
  match: string
  league?: string
  market: string
  selection: string
  odds: number
  suspended?: boolean
}

export type BonusType = 'FreeBet' | 'OddsBoost' | 'CashbackOffer'

export type Bonus = {
  id: string
  type: BonusType
  label: string
  amount?: number          // FreeBet amount
  originalOdds?: number   // OddsBoost: before
  boostedOdds?: number    // OddsBoost: after
}

export type BetslipStatus = 'idle' | 'loading' | 'success' | 'error'

export type AccumulatorLabel = 'Single' | 'Double' | 'Treble' | 'Accumulator'

export function getAccumulatorLabel(count: number): AccumulatorLabel {
  if (count === 1) return 'Single'
  if (count === 2) return 'Double'
  if (count === 3) return 'Treble'
  return 'Accumulator'
}

export function combinedOdds(bets: BetEntry[]): number {
  return bets.reduce((acc, b) => acc * b.odds, 1)
}
