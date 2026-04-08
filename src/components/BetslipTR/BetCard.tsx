import type { BetEntryTR } from './types'
import styles from './BetCard.module.css'

const IconClose = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconSuspended = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1L11 10.5H1L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M6 5v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="6" cy="9" r="0.5" fill="currentColor" />
  </svg>
)

type Props = {
  bet: BetEntryTR
  onRemove: (id: string) => void
}

export function BetCard({ bet, onRemove }: Props) {
  return (
    <div className={`${styles.card} ${bet.suspended ? styles['card--suspended'] : ''}`}>
      {/* Top row: league + remove */}
      <div className={styles.topRow}>
        {bet.league && <span className={styles.league}>{bet.league}</span>}
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(bet.id)}
          aria-label={`Remove ${bet.match}`}
          type="button"
        >
          <IconClose />
        </button>
      </div>

      {/* Match name */}
      <span className={styles.match}>{bet.match}</span>

      {/* Market row: market + selection + odds */}
      <div className={styles.marketRow}>
        <div className={styles.marketInfo}>
          <span className={styles.market}>{bet.market}</span>
          <span className={styles.selection}>{bet.selection}</span>
        </div>
        <span className={`${styles.odds} ${bet.suspended ? styles['odds--suspended'] : ''}`}>
          {bet.odds.toFixed(2)}
        </span>
      </div>

      {/* Suspended warning */}
      {bet.suspended && (
        <div className={styles.suspendedRow} role="alert">
          <IconSuspended />
          <span>This bet has been suspended</span>
        </div>
      )}
    </div>
  )
}
