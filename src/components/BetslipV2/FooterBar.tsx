import type { BetslipStatus } from './types'
import styles from './FooterBar.module.css'

const QUICK_STAKES = [10, 20, 50]

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 8l4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type Props = {
  /** Bet type label: "Single", "Double", "Treble", "Multiples" */
  typeLabel: string
  /** Combined fractional odds string — e.g. "3.66/1". Omit for Single tab. */
  oddsLabel?: string
  /** Potential return amount. null = not yet calculable (no stake). */
  potentialReturn: number | null
  totalStake: number
  currency?: string
  status: BetslipStatus
  canPlace: boolean
  activeChip: number | null
  onChipClick: (amount: number) => void
  onPlace: () => void
}

export function FooterBar({
  typeLabel,
  oddsLabel,
  potentialReturn,
  totalStake,
  currency = '€',
  status,
  canPlace,
  activeChip,
  onChipClick,
  onPlace,
}: Props) {
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const btnDisabled = !canPlace || isLoading || isSuccess

  const returnDisplay = potentialReturn !== null && potentialReturn > 0
    ? `${currency}${potentialReturn.toFixed(2)}`
    : null

  const ctaLabel = isLoading
    ? 'Placing…'
    : isSuccess
    ? 'Bet Placed!'
    : totalStake > 0
    ? `Place bet ${currency}${totalStake.toFixed(2)}`
    : 'Place bet'

  return (
    <div className={styles.footer}>
      {/* Quick stakes */}
      <div className={styles.quickStakes} role="group" aria-label="Quick stake amounts">
        {QUICK_STAKES.map((amount) => (
          <button
            key={amount}
            className={`${styles.chip} ${activeChip === amount ? styles['chip--active'] : ''}`}
            onClick={() => onChipClick(amount)}
            type="button"
            aria-label={`Set stake to ${currency}${amount}`}
            aria-pressed={activeChip === amount}
          >
            {currency}{amount}.00
          </button>
        ))}
      </div>

      {/* Summary row */}
      <div className={styles.summary}>
        <div className={styles.summaryLeft}>
          <span className={styles.summaryType}>{typeLabel}</span>
          {oddsLabel && <span className={styles.summaryOdds}>{oddsLabel}</span>}
        </div>
        <div className={styles.summaryRight}>
          <span className={styles.summaryLabel}>To return</span>
          {returnDisplay
            ? <span className={styles.summaryReturn}>{returnDisplay}</span>
            : <span className={styles.summaryDash}>—</span>
          }
        </div>
      </div>

      {/* CTA */}
      <button
        className={`${styles.cta} ${isLoading ? styles['cta--loading'] : ''} ${isSuccess ? styles['cta--success'] : ''}`}
        onClick={onPlace}
        disabled={btnDisabled}
        aria-busy={isLoading}
        aria-label={ctaLabel}
        type="button"
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        {isSuccess && <IconCheck />}
        <span>{ctaLabel}</span>
      </button>
    </div>
  )
}
