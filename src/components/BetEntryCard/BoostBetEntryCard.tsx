import styles from './BoostBetEntryCard.module.css'

export type BoostBetEntryCardProps = {
  sportIcon?: string
  sportLabel: string
  kickoffTime?: string
  description: string
  outcome: string
  odds: string
  originalOdds?: string
  onRemove?: () => void
  removeAriaLabel?: string
}

export function BoostBetEntryCard({
  sportIcon = '⚽',
  sportLabel,
  kickoffTime,
  description,
  outcome,
  odds,
  originalOdds,
  onRemove,
  removeAriaLabel = 'Remove selection',
}: BoostBetEntryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.sportIcon}>{sportIcon}</span>
          <span className={styles.sportLabel}>{sportLabel}</span>
        </div>
        <div className={styles.headerRight}>
          {kickoffTime && (
            <>
              <svg className={styles.clockIcon} viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.kickoffTime}>{kickoffTime}</span>
            </>
          )}
          {onRemove ? (
            <button className={styles.removeButton} onClick={onRemove} type="button" aria-label={removeAriaLabel}>
              ✕
            </button>
          ) : (
            <span className={styles.removeButton}>✕</span>
          )}
        </div>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.oddsRow}>
        <span className={styles.outcome}>{outcome}</span>
        {originalOdds && (
          <span className={styles.originalOdds}>{originalOdds}</span>
        )}
        {originalOdds && <span className={styles.arrow}>›</span>}
        <span className={styles.odds}>{odds}</span>
      </div>
    </div>
  )
}
