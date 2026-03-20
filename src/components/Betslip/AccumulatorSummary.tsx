import { getAccumulatorLabel, combinedOdds } from './types'
import type { BetEntry } from './types'
import styles from './AccumulatorSummary.module.css'

type Props = {
  bets: BetEntry[]
}

export function AccumulatorSummary({ bets }: Props) {
  if (bets.length < 2) return null

  const label = getAccumulatorLabel(bets.length)
  const odds = combinedOdds(bets)

  return (
    <div className={styles.summary}>
      <div className={styles.left}>
        <span className={styles.countBadge} aria-label={`${bets.length} bets`}>
          {bets.length}
        </span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.oddsGroup}>
        <span className={styles.oddsLabel}>Combined odds</span>
        <span className={styles.oddsValue}>{odds.toFixed(2)}</span>
      </div>
    </div>
  )
}
