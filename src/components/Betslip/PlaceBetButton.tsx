import type { BetslipStatus } from './types'
import styles from './PlaceBetButton.module.css'

const IconCheck = () => (
  <svg className={styles.icon} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 9l4.5 4.5L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconRetry = () => (
  <svg className={styles.icon} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M4 4a7 7 0 1 1 0 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 2v4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LABEL: Record<BetslipStatus, string> = {
  idle:    'Place Bet',
  loading: 'Placing Bet…',
  success: 'Bet Placed!',
  error:   'Retry',
}

const ARIA_LABEL: Record<BetslipStatus, string> = {
  idle:    'Place your bet',
  loading: 'Placing your bet, please wait',
  success: 'Bet placed successfully',
  error:   'Bet failed — click to retry',
}

type Props = {
  status: BetslipStatus
  disabled?: boolean
  onClick: () => void
}

export function PlaceBetButton({ status, disabled = false, onClick }: Props) {
  const isDisabled = disabled || status === 'loading' || status === 'success'

  return (
    <button
      className={`${styles.btn} ${styles[`btn--${status}`]}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ARIA_LABEL[status]}
      aria-busy={status === 'loading'}
      aria-live="polite"
      type="button"
    >
      {status === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
      {status === 'success' && <IconCheck />}
      {status === 'error'   && <IconRetry />}
      <span>{LABEL[status]}</span>
    </button>
  )
}
