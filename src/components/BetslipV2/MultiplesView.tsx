import type { BetEntryV2 } from './types'
import { BetCardLS } from './BetCardLS'
import { combinedOdds, getAccaLabel, toFractional } from './types'
import styles from './MultiplesView.module.css'

type Props = {
  bets: BetEntryV2[]
  multipleStake: string
  singleStakes: Record<string, string>
  currency?: string
  onMultipleStakeChange: (value: string) => void
  onSingleStakeChange: (id: string, value: string) => void
  onRemove: (id: string) => void
}

export function MultiplesView({
  bets,
  multipleStake,
  singleStakes,
  currency = '€',
  onMultipleStakeChange,
  onSingleStakeChange,
  onRemove,
}: Props) {
  const combined = combinedOdds(bets)
  const multipleLabel = getAccaLabel(bets.length)
  const multipleOdds = toFractional(combined)
  const multipleStakeNum = parseFloat(multipleStake) || 0
  const multipleReturn = multipleStakeNum > 0 ? multipleStakeNum * combined : null

  return (
    <>
      {/* Multiple bets section header */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Multiple bets</span>
      </div>

      {/* Double / N-Fold row */}
      <div className={styles.multipleRow}>
        <div className={styles.multipleLeft}>
          <span className={styles.multipleLabel}>{multipleLabel}</span>
          <span className={styles.multipleOdds}>{multipleOdds}</span>
          <span className={styles.multipleMeta}>{bets.length} bets</span>
        </div>
        <div className={styles.multipleRight}>
          <input
            className={styles.stakeInput}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={multipleStake}
            onChange={(e) => onMultipleStakeChange(e.target.value)}
            aria-label={`Stake for ${multipleLabel}`}
          />
          {multipleReturn !== null && (
            <span className={styles.toReturn}>
              To return
              <span className={styles.toReturnValue}>{currency}{multipleReturn.toFixed(2)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Singles section header */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Singles</span>
      </div>

      {/* Individual bet cards with per-bet stake */}
      {bets.map((bet) => (
        <BetCardLS
          key={bet.id}
          bet={bet}
          stake={singleStakes[bet.id] ?? ''}
          currency={currency}
          onStakeChange={onSingleStakeChange}
          onRemove={onRemove}
        />
      ))}
    </>
  )
}
