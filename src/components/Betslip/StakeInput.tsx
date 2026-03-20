import { useState, useId } from 'react'
import styles from './StakeInput.module.css'

const QUICK_STAKES = [5, 10, 25, 50]

type Props = {
  stake: string
  potentialReturns: number
  currency?: string
  onChange: (value: string) => void
}

export function StakeInput({ stake, potentialReturns, currency = '€', onChange }: Props) {
  const [error, setError] = useState<string | null>(null)
  const inputId = useId()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (val !== '' && (isNaN(Number(val)) || Number(val) < 0)) {
      setError('Enter a valid stake amount')
    } else {
      setError(null)
    }
    onChange(val)
  }

  function addQuickStake(amount: number) {
    const current = parseFloat(stake) || 0
    onChange(String(current + amount))
    setError(null)
  }

  const displayReturns = potentialReturns > 0
    ? `${currency}${potentialReturns.toFixed(2)}`
    : '—'

  return (
    <div className={styles.container}>
      {/* Stake field */}
      <label htmlFor={inputId} style={{ display: 'none' }}>Stake</label>
      <div className={`${styles.inputRow} ${error ? styles['inputRow--error'] : ''}`}>
        <span className={styles.currencyLabel}>{currency}</span>
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={stake}
          onChange={handleChange}
          className={styles.input}
          aria-label="Stake amount"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>

      {error && (
        <span id={`${inputId}-error`} className={styles.errorMsg} role="alert">
          {error}
        </span>
      )}

      {/* Quick-stake chips */}
      <div className={styles.chips} role="group" aria-label="Quick stake amounts">
        {QUICK_STAKES.map((amount) => (
          <button
            key={amount}
            className={styles.chip}
            onClick={() => addQuickStake(amount)}
            type="button"
            aria-label={`Add ${currency}${amount}`}
          >
            +{currency}{amount}
          </button>
        ))}
      </div>

      {/* Potential winnings — Figma: sportsbook/betslip/potentialWinnings */}
      <div className={styles.winningsCard}>
        <div className={styles.winningsLabel}>Potential Winnings</div>
        <div className={styles.winningsAmount} aria-live="polite">{displayReturns}</div>
      </div>
    </div>
  )
}
