export type BetTab = 'single' | 'acca' | 'multiples'

export type BetslipStatus = 'idle' | 'loading' | 'success' | 'error'

export type BetEntryV2 = {
  id: string
  match: string               // "FC Midtjylland vs Nottingham Forest"
  league?: string
  market: string              // "Full Time"
  selection: string           // "FC Midtjylland"
  odds: number                // decimal e.g. 2.95
  fractionalOdds?: string     // override e.g. "39/20" — if omitted, auto-converted
  suspended?: boolean
  badges?: string[]           // e.g. ["2UP"]
}

export type MultipleBetRow = {
  label: string               // "Double" | "Single"
  count: number               // 1 bet / 2 bets
  stake: string
}

/* ---- Odds helpers ---- */

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function toFractional(decimal: number): string {
  if (decimal === 1) return 'EVS'
  if (decimal < 1) return 'SP'
  const precision = 1000
  const n = Math.round((decimal - 1) * precision)
  const d = precision
  const divisor = gcd(Math.abs(n), d)
  return `${n / divisor}/${d / divisor}`
}

export function getOddsDisplay(bet: BetEntryV2): string {
  return bet.fractionalOdds ?? toFractional(bet.odds)
}

export function combinedOdds(bets: BetEntryV2[]): number {
  return bets.reduce((acc, b) => acc * b.odds, 1)
}

export function toFractionalStr(decimal: number): string {
  return toFractional(decimal)
}

export function getAccaLabel(count: number): string {
  if (count === 2) return 'Double'
  if (count === 3) return 'Treble'
  if (count === 4) return '4-Fold'
  return `${count}-Fold`
}

export function totalStake(stakes: Record<string, string>): number {
  return Object.values(stakes).reduce((sum, s) => sum + (parseFloat(s) || 0), 0)
}
