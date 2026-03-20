import type { BetEntry as BetEntryType } from './types'
import styles from './BetEntry.module.css'

/* Inline SVG icons — no icon lib dependency */
const IconSport = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 3C12 3 9 7 9 12s3 9 3 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const IconClose = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconWarning = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width="12" height="12">
    <path d="M6 1L11 10H1L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M6 5v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="6" cy="9" r="0.5" fill="currentColor" />
  </svg>
)

type Props = {
  bet: BetEntryType
  showBonus?: boolean
  onRemove: (id: string) => void
}

export function BetEntry({ bet, showBonus = false, onRemove }: Props) {
  return (
    <div className={`${styles.entry} ${bet.suspended ? styles['entry--suspended'] : ''}`}>
      {/* Sport icon */}
      <span className={styles.sportIcon} aria-hidden="true">
        <IconSport />
      </span>

      {/* Match info */}
      <div className={styles.info}>
        <span className={styles.match} title={bet.match}>{bet.match}</span>
        <span className={styles.meta}>
          {bet.league ? `${bet.league}: ` : ''}{bet.market}{'\n'}{bet.selection}
        </span>

        {bet.suspended && (
          <div className={styles.suspendedBanner} role="alert">
            <IconWarning />
            <span className={styles.suspendedText}>Bet suspended — odds may have changed</span>
          </div>
        )}
      </div>

      {/* Right: odds + remove */}
      <div className={styles.right}>
        <div className={styles.oddsRow}>
          <div className={styles.oddsBadge}>
            <span className={`${styles.oddsValue} ${bet.suspended ? styles['oddsValue--suspended'] : ''}`}>
              {bet.odds.toFixed(2)}
            </span>
          </div>
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(bet.id)}
            aria-label={`Remove ${bet.match}`}
          >
            <IconClose />
          </button>
        </div>

        {/* B badge — shown when a bonus is applied to this bet */}
        {showBonus && (
          <div className={styles.bonusBadge} aria-label="Bonus applied">B</div>
        )}
      </div>
    </div>
  )
}
