import type { ReactNode } from 'react'
import styles from './BetEntryCard.module.css'

type OddsDirection = 'up' | 'down'

type BetEntryCardProps = {
  topMeta?: string
  topPrimary: string
  topSecondary?: string
  odds?: string
  originalOdds?: string
  selection?: string
  market: string
  suspendedLabel?: string
  oddsDirection?: OddsDirection
  isLive?: boolean
  /** Optional slot rendered inside the card below a divider (e.g. per-entry stake input). */
  footer?: ReactNode
  onRemove?: () => void
  removeAriaLabel?: string
}

export function BetEntryCard({
  topMeta,
  topPrimary,
  topSecondary,
  odds,
  originalOdds,
  selection,
  market,
  suspendedLabel,
  oddsDirection,
  isLive = false,
  footer,
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
            {topMeta && (
              <span className={`${styles.meta}${isLive ? ` ${styles.metaLive}` : ''}`}>
                {topMeta}
              </span>
            )}
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
              {odds && originalOdds ? (
                <span className={styles.boostedOdds}>
                  <span className={styles.boostedValues}>
                    <span className={styles.originalOdds}>{originalOdds}</span>
                    <span className={`${oddsClass} ${styles.boostedCurrentOdds}`}>{odds}</span>
                  </span>
                </span>
              ) : (
                odds && <span className={oddsClass}>{odds}</span>
              )}
              {!originalOdds && oddsDirection && (
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

      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  )
}
