import type React from 'react'
import type { BetEntry } from './types'
import { combinedOdds, getAccaLabel } from './types'
import styles from './MiniStrip.module.css'

export type MiniStripProps = {
  /** Active bet selections in the slip. Renders nothing when empty. */
  bets: BetEntry[]
  /** Current stake in the major currency unit (e.g. 50 → renders "₺50.00"). */
  stake?: number
  /** Currency symbol prefix. Defaults to ₺ for TR market. */
  currency?: string
  /** Called when the user taps anywhere on the strip to open the full drawer. */
  onOpen: () => void
  /** Override or extend root class (e.g. to swap position:fixed → absolute in preview). */
  className?: string
  /** Inline style overrides on the root element. */
  style?: React.CSSProperties
}

const IconChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2.5 9.5L7 5L11.5 9.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function MiniStrip({ bets, stake, currency = '₺', onOpen, className, style }: MiniStripProps) {
  if (bets.length === 0) return null

  const combined = combinedOdds(bets)
  const hasSuspended = bets.some(b => b.suspended)

  // First bet with a direction signal drives the flash colour
  const oddsDirection = bets.find(b => b.oddsDirection)?.oddsDirection

  const label =
    bets.length === 1
      ? bets[0].selection
      : `${getAccaLabel(bets.length)} Accumulator`

  const stakeLabel =
    stake && stake > 0 ? `${currency}${stake.toFixed(2)}` : `${currency}—`

  // Key the odds span on value + direction so CSS animation re-fires on change
  const oddsKey = `${combined.toFixed(2)}-${oddsDirection ?? 'none'}`

  const oddsClass =
    oddsDirection === 'up'
      ? `${styles.odds} ${styles.oddsUp}`
      : oddsDirection === 'down'
        ? `${styles.odds} ${styles.oddsDown}`
        : styles.odds

  return (
    <button
      className={`${styles.strip}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={onOpen}
      type="button"
      aria-label={`Bahis kuponu — ${bets.length} seçim, oran ${combined.toFixed(2)}`}
    >
      {/* Left: badge · label · odds */}
      <div className={styles.left}>
        <span className={styles.badge} aria-hidden="true">
          {bets.length}
        </span>

        <span className={styles.label}>{label}</span>

        <span key={oddsKey} className={oddsClass}>
          {combined.toFixed(2)}
        </span>

        {hasSuspended && (
          <span
            className={styles.suspendedDot}
            role="img"
            aria-label="Askıya alınmış seçim var"
          />
        )}
      </div>

      {/* Right: stake · divider · open button */}
      <div className={styles.right}>
        <span className={styles.stakeDisplay} aria-label="Bahis miktarı">
          {stakeLabel}
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.openBtn} aria-hidden="true">
          <IconChevronUp />
        </span>
      </div>
    </button>
  )
}
