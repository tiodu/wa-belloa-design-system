export type BetEntryTR = {
  id: string
  match: string
  league?: string
  market: string
  selection: string
  odds: number
  suspended?: boolean
}

export type BetslipMode = 'single' | 'kombine'
export type BetslipStatus = 'idle' | 'loading' | 'success' | 'error'

export function combinedOdds(bets: BetEntryTR[]): number {
  return bets.reduce((acc, b) => acc * b.odds, 1)
}
