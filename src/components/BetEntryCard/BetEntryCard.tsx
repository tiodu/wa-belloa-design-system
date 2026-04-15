import { useState, useEffect, type ReactNode } from 'react'
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
  oddsChangeSignal?: number
  isLive?: boolean
  /** Optional slot rendered inside the card below a divider (e.g. per-entry stake input). */
  footer?: ReactNode
  onRemove?: () => void
  removeAriaLabel?: string
  onBannerDismiss?: () => void
}

const BLINK_DURATION_MS = 1800

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
  oddsChangeSignal,
  isLive = false,
  footer,
  onRemove,
  removeAriaLabel = 'Remove selection',
  onBannerDismiss,
}: BetEntryCardProps) {
  const [animDir, setAnimDir] = useState<'up' | 'down' | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!oddsDirection) {
      setAnimDir(null)
      setShowBanner(false)
      return
    }
    setAnimDir(oddsDirection)
    setShowBanner(true)
    const timer = setTimeout(() => setAnimDir(null), BLINK_DURATION_MS)
    return () => clearTimeout(timer)
  // oddsChangeSignal increments on each trigger so the effect re-runs even if direction stays the same
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oddsChangeSignal, oddsDirection])

  const oddsClass =
    animDir === 'up'
      ? `${styles.odds} ${styles.oddsBlinkUp}`
      : animDir === 'down'
      ? `${styles.odds} ${styles.oddsBlinkDown}`
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
              {!originalOdds && animDir && (
                <span className={animDir === 'up' ? styles.deltaBlinkUp : styles.deltaBlinkDown}>
                  {animDir === 'up' ? '▲' : '▼'}
                </span>
              )}
            </span>
            {selection && <span className={styles.selection}>{selection}</span>}
          </>
        )}
      </div>

      <div className={styles.market}>{market}</div>

      {showBanner && !suspendedLabel && (
        <div className={styles.oddsChangedBanner}>
          <span className={styles.oddsChangedIcon}>ⓘ</span>
          <span className={styles.oddsChangedText}>Odds changed</span>
          <button
            className={styles.oddsChangedClose}
            onClick={() => { setShowBanner(false); onBannerDismiss?.() }}
            type="button"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  )
}
