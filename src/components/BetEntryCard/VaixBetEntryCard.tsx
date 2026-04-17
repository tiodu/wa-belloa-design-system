import styles from './VaixBetEntryCard.module.css'

export type VaixLeg = {
  selection: string
  market: string
}

export type VaixBetEntryCardProps = {
  match: string
  legs: VaixLeg[]
  odds: string
  onRemove?: () => void
  removeAriaLabel?: string
}

export function VaixBetEntryCard({
  match,
  legs,
  odds,
  onRemove,
  removeAriaLabel = 'Remove selection',
}: VaixBetEntryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.vaixBadge}>VAIX</span>
        <span className={styles.match}>{match}</span>
        {onRemove ? (
          <button className={styles.removeButton} onClick={onRemove} type="button" aria-label={removeAriaLabel}>
            ✕
          </button>
        ) : (
          <span className={styles.removeButton}>✕</span>
        )}
      </div>

      <div className={styles.legsWrap}>
        <div className={styles.timeline}>
          {legs.map((_, i) => (
            <div key={i} className={styles.timelineRow}>
              <div className={styles.circle} />
              {i < legs.length - 1 && <div className={styles.connector} />}
            </div>
          ))}
        </div>
        <div className={styles.legsContent}>
          {legs.map((leg, i) => (
            <div key={i} className={styles.leg}>
              <span className={styles.legSelection}>{leg.selection}</span>
              <span className={styles.legMarket}>{leg.market}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerLabel}>Combined odds</span>
        <span className={styles.footerOdds}>{odds}</span>
      </div>
    </div>
  )
}
