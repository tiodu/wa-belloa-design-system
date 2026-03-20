import type { BetEntryV2 } from './types'
import { BetCardLS } from './BetCardLS'
import styles from './AccaView.module.css'
import { getAccaLabel, combinedOdds, toFractional } from './types'

type Props = {
  bets: BetEntryV2[]
  onRemove: (id: string) => void
}

export function AccaView({ bets, onRemove }: Props) {
  const combined = combinedOdds(bets)
  const accaLabel = getAccaLabel(bets.length)
  const accaOdds = toFractional(combined)

  return (
    <>
      {/* Acca summary pill */}
      <div className={styles.accaSummary}>
        <span className={styles.accaLabel}>{accaLabel}</span>
        <span className={styles.accaOdds}>{accaOdds}</span>
      </div>

      {/* Bet cards — no inline stake inputs */}
      {bets.map((bet) => (
        <BetCardLS
          key={bet.id}
          bet={bet}
          onRemove={onRemove}
        />
      ))}
    </>
  )
}
