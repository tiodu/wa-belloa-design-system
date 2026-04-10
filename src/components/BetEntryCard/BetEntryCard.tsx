import styles from './BetEntryCard.module.css'

type OddsDirection = 'up' | 'down'

type BetEntryCardProps = {
  topMeta?: string
  topPrimary: string
  topSecondary?: string
  odds?: string
  selection?: string
  market: string
  suspendedLabel?: string
  oddsDirection?: OddsDirection
  onRemove?: () => void
  removeAriaLabel?: string
}

export function BetEntryCard({
  topMeta,
  topPrimary,
  topSecondary,
  odds,
  selection,
  market,
  suspendedLabel,
  oddsDirection,
  onRemove,
  removeAriaLabel = 'Remove selection',
}: BetEntryCardProps) {
  const oddsClass =
    oddsDirection === 'up'
      ? `${styles.odds} ${styles.oddsUp}`
      : oddsDirection === 'down'
      ? `${styles.odds} ${styles.oddsDown}`
      : styles.odds

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.topLine}>
          <span className={styles.topPrimary}>
            {topMeta && <span className={styles.meta}>{topMeta}</span>}
            <span>{topPrimary}</span>
          </span>
          {onRemove ? (
            <button className={styles.removeButton} onClick={onRemove} type="button" aria-label={removeAriaLabel}>
              ✕
            </button>
          ) : (
            <span className={styles.removeButton}>✕</span>
          )}
        </div>
        {topSecondary && <span className={styles.topSecondary}>{topSecondary}</span>}
      </div>

      <div className={styles.mid}>
        {suspendedLabel ? (
          <span className={styles.suspended}>{suspendedLabel}</span>
        ) : (
          <>
            <span className={styles.oddsWrap}>
              {odds && <span className={oddsClass}>{odds}</span>}
              {oddsDirection && (
                <span className={oddsDirection === 'up' ? styles.deltaUp : styles.deltaDown}>
                  {oddsDirection === 'up' ? '▲' : '▼'}
                </span>
              )}
            </span>
            {selection && <span className={styles.selection}>{selection}</span>}
          </>
        )}
      </div>

      <div className={styles.market}>{market}</div>
    </div>
  )
}
