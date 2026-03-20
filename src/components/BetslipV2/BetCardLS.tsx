import type { BetEntryV2 } from './types'
import { getOddsDisplay } from './types'
import styles from './BetCardLS.module.css'

const IconClose = () => (
  <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconWarning = () => (
  <svg viewBox="0 0 10 10" fill="none" width="10" height="10" aria-hidden="true">
    <path d="M5 1L9.5 9H0.5L5 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <path d="M5 4.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

type Props = {
  bet: BetEntryV2
  /* undefined = no inline stake (Acca / Multiples tabs) */
  stake?: string
  currency?: string
  onStakeChange?: (id: string, value: string) => void
  onRemove: (id: string) => void
}

export function BetCardLS({ bet, stake, currency = '€', onStakeChange, onRemove }: Props) {
  const oddsDisplay = getOddsDisplay(bet)
  const stakeNum = parseFloat(stake ?? '') || 0
  const potentialReturn = stakeNum > 0 ? stakeNum * bet.odds : null
  const showStake = stake !== undefined

  return (
    <>
      {/* Match header row */}
      <div className={styles.matchHeader}>
        <span className={styles.matchName} title={bet.match}>{bet.match}</span>
      </div>

      {/* Bet card */}
      <div className={`${styles.card} ${bet.suspended ? styles['card--suspended'] : ''}`}>
        {/* Left: odds + info */}
        <div className={styles.left}>
          <div className={styles.oddsRow}>
            <span className={styles.odds}>{oddsDisplay}</span>
            <span className={styles.selection}>{bet.selection}</span>
          </div>
          <span className={styles.market}>{bet.market}</span>

          {/* Promo badges (e.g. "2UP") */}
          {bet.badges && bet.badges.length > 0 && (
            <div className={styles.badges}>
              {bet.badges.map((badge) => (
                <span key={badge} className={styles.badge}>{badge}</span>
              ))}
            </div>
          )}

          {/* Suspended warning */}
          {bet.suspended && (
            <span className={styles.suspendedTag} role="alert">
              <IconWarning /> Suspended
            </span>
          )}
        </div>

        {/* Right: stake input + remove + to return */}
        <div className={styles.right}>
          <div className={styles.stakeRow}>
            {showStake && (
              <input
                className={styles.stakeInput}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={stake}
                onChange={(e) => onStakeChange?.(bet.id, e.target.value)}
                aria-label={`Stake for ${bet.match}`}
              />
            )}
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(bet.id)}
              aria-label={`Remove ${bet.match}`}
              type="button"
            >
              <IconClose />
            </button>
          </div>

          {/* Per-bet "To return" shown when stake is entered */}
          {showStake && potentialReturn !== null && (
            <span className={styles.toReturn}>
              To return
              <span className={styles.toReturnValue}>{currency}{potentialReturn.toFixed(2)}</span>
            </span>
          )}
        </div>
      </div>
    </>
  )
}
