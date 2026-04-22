export type BettingError = {
  code: number
  message: string
  detail: string
}

const ERRORS: Record<number, BettingError> = {
  103: { code: 103, message: 'Invalid stake amount',      detail: 'The stake value entered is not valid. Please enter a valid amount.' },
  109: { code: 109, message: 'Insufficient funds',        detail: 'Your balance is too low to cover this stake. Please deposit and try again.' },
  111: { code: 111, message: 'Max win exceeded',          detail: 'Your potential return exceeds the maximum payout allowed for this bet.' },
  116: { code: 116, message: 'Wager limit reached',       detail: 'You have reached your personal wager limit. Please contact support.' },
  117: { code: 117, message: 'Wager limit exceeded',      detail: 'Your total wager limit has been reached for this period.' },
  122: { code: 122, message: 'Betting suspended',         detail: 'Betting is temporarily unavailable. Please try again shortly.' },
  136: { code: 136, message: 'Something went wrong',      detail: 'An unexpected error occurred while placing your bet. Please try again.' },
  151: { code: 151, message: 'Odds have changed',         detail: 'The odds on one or more selections changed before your bet was confirmed.' },
  157: { code: 157, message: 'Event not available',       detail: 'One or more events in your bet slip are no longer available.' },
  168: { code: 168, message: 'Bet rejected',              detail: 'Your bet was rejected by the risk system. Please review your selections.' },
}

export const DEMO_ERROR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '',    label: '— No error (success)' },
  { value: '109', label: '109 — Insufficient funds' },
  { value: '103', label: '103 — Invalid stake' },
  { value: '111', label: '111 — Max win exceeded' },
  { value: '116', label: '116 — Wager limit reached' },
  { value: '122', label: '122 — Betting suspended' },
  { value: '151', label: '151 — Odds changed' },
  { value: '157', label: '157 — Event not available' },
  { value: '168', label: '168 — Bet rejected' },
  { value: '136', label: '136 — Generic error' },
]

export function getBettingError(code: number): BettingError {
  return (
    ERRORS[code] ?? {
      code,
      message: 'Bet could not be placed',
      detail: 'An error occurred while placing your bet. Please try again.',
    }
  )
}
