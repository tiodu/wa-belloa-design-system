import { useState, useRef, useEffect } from 'react'
import { MiniStrip } from './MiniStrip'
import type { BetEntry } from './types'
import { combinedOdds, getAccaLabel } from './types'
import styles from './FloatingBetslip.module.css'

/* ─── LiveBadge ─── */

function LiveBadge({ score, minute }: { score?: string; minute?: number }) {
  return (
    <span className={styles.liveBadge}>
      <span className={styles.liveDot} />
      {score && <span className={styles.liveScore}>{score}</span>}
      {minute !== undefined && <span className={styles.liveMinute}>· {minute}'</span>}
    </span>
  )
}

/* ─── Sparkline ─── */

function Sparkline({ values, direction }: { values: number[]; direction?: 'up' | 'down' }) {
  const max = Math.max(...values, 0.01)
  return (
    <div className={styles.sparkline} aria-hidden="true">
      {values.map((v, i) => {
        const isLast = i === values.length - 1
        const height = Math.max(20, (v / max) * 100)
        const bg = isLast
          ? direction === 'up'
            ? 'var(--status-success-fg)'
            : direction === 'down'
            ? 'var(--status-critical-fg)'
            : 'var(--content-subtle)'
          : 'var(--border-default)'
        return (
          <div key={i} className={styles.sparkBar} style={{ height: `${height}%`, background: bg }} />
        )
      })}
    </div>
  )
}

/* ─── SelectionRow ─── */

function SelectionRow({ bet, onRemove }: { bet: BetEntry; onRemove: (id: string) => void }) {
  const oddsClass =
    bet.oddsDirection === 'up'
      ? `${styles.oddsValue} ${styles.oddsUp}`
      : bet.oddsDirection === 'down'
      ? `${styles.oddsValue} ${styles.oddsDown}`
      : styles.oddsValue

  return (
    <div className={`${styles.selRow}${bet.suspended ? ` ${styles.selRowSuspended}` : ''}`}>
      <div className={styles.selTop}>
        <div className={styles.selMatchInfo}>
          {bet.isLive && <LiveBadge score={bet.score} minute={bet.minute} />}
          <span className={styles.selMatch}>{bet.match}</span>
        </div>
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(bet.id)}
          aria-label={`Remove ${bet.selection}`}
          type="button"
        >
          ✕
        </button>
      </div>

      <div className={styles.selBottom}>
        <div className={styles.selMeta}>
          <span className={styles.selMarket}>{bet.market}</span>
          <span className={styles.selSelection}>{bet.selection}</span>
        </div>
        <div className={styles.selOddsArea}>
          {bet.suspended ? (
            <span className={styles.suspendedInline}>⏸ Suspended</span>
          ) : (
            <div className={styles.oddsRow}>
              <span key={`${bet.odds}-${bet.oddsDirection ?? 'none'}`} className={oddsClass}>
                {bet.odds.toFixed(2)}
              </span>
              {bet.oddsDirection && (
                <span className={bet.oddsDirection === 'up' ? styles.deltaUp : styles.deltaDown}>
                  {bet.oddsDirection === 'up' ? '▲' : '▼'}
                </span>
              )}
            </div>
          )}
          {bet.sparkline && (
            <Sparkline values={bet.sparkline} direction={bet.oddsDirection} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Numpad ─── */

const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'] as const

function Numpad({ onKey, onDone }: { onKey: (k: string) => void; onDone: () => void }) {
  return (
    <div className={styles.numpad}>
      <div className={styles.numpadGrid}>
        {NUMPAD_KEYS.map((k) => (
          <button key={k} className={styles.numpadKey} onClick={() => onKey(k)} type="button">
            {k}
          </button>
        ))}
      </div>
      <button className={styles.numpadDone} onClick={onDone} type="button">
        ✓ Done
      </button>
    </div>
  )
}

/* ─── FloatingBetslip ─── */

export type FloatingBetslipProps = {
  bets: BetEntry[]
  onRemoveBet: (id: string) => void
  onClearAll: () => void
  onPlaceBet?: (stake: number) => void
  currency?: string
  /**
   * When true, the overlay and drawer use position:absolute so they are
   * clipped by the nearest positioned ancestor (e.g. a preview phone frame).
   * Defaults to false (position:fixed, covers the full viewport).
   */
  contained?: boolean
}

export function FloatingBetslip({
  bets,
  onRemoveBet,
  onClearAll,
  onPlaceBet,
  currency = '₺',
  contained = false,
}: FloatingBetslipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [stakeStr, setStakeStr] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmRef, setConfirmRef] = useState('')
  const confirmTimer = useRef<ReturnType<typeof setTimeout>>()

  const stake = parseFloat(stakeStr) || 0
  const combined = combinedOdds(bets)
  const potentialWin = stake > 0 ? (stake * combined).toFixed(2) : null
  const hasSuspended = bets.some((b) => b.suspended)

  useEffect(() => () => clearTimeout(confirmTimer.current), [])

  // If all bets are removed externally, collapse the drawer
  useEffect(() => {
    if (bets.length === 0) {
      setIsOpen(false)
      setNumpadOpen(false)
      setStakeStr('')
    }
  }, [bets.length])

  function handleClose() {
    setIsOpen(false)
    setNumpadOpen(false)
  }

  function handleNumpadKey(k: string) {
    if (k === '⌫') {
      setStakeStr((s) => s.slice(0, -1))
      return
    }
    if (k === '.') {
      if (!stakeStr.includes('.')) setStakeStr((s) => s + '.')
      return
    }
    // Guard: max 2 decimal places, max 8 chars total
    const parts = stakeStr.split('.')
    if (parts[1]?.length >= 2) return
    if (stakeStr.length >= 8) return
    setStakeStr((s) => s + k)
  }

  function handleChip(amount: number) {
    setStakeStr(amount.toString())
    // Chips only set the stake — numpad opens only via the stake input field
  }

  function handlePlaceBet() {
    if (hasSuspended) {
      bets.filter((b) => b.suspended).forEach((b) => onRemoveBet(b.id))
      return
    }
    if (stake <= 0) return

    const ref = `BLX-${Math.floor(100000 + Math.random() * 900000)}`
    setConfirmRef(ref)
    setConfirming(true)
    onPlaceBet?.(stake)

    confirmTimer.current = setTimeout(() => {
      setConfirming(false)
      setIsOpen(false)
      setNumpadOpen(false)
      setStakeStr('')
      onClearAll()
    }, 2800)
  }

  if (bets.length === 0) return null

  const posClass = contained ? styles.posAbsolute : styles.posFixed
  const ctaDisabled = !hasSuspended && stake <= 0

  const ctaLabel = hasSuspended
    ? '⏸ Remove suspended selections'
    : stake > 0
    ? `Place Bet — ${currency}${stake.toFixed(2)}`
    : 'Place Bet'

  return (
    <>
      {/* Mini strip — hidden while drawer is open */}
      {!isOpen && (
        <MiniStrip
          bets={bets}
          stake={stake > 0 ? stake : undefined}
          currency={currency}
          onOpen={() => setIsOpen(true)}
          style={
            contained
              ? { position: 'absolute', bottom: 58, left: 12, right: 12, zIndex: 10 }
              : undefined
          }
        />
      )}

      {/* Scrim */}
      {isOpen && (
        <div className={`${styles.overlay} ${posClass}`} onClick={handleClose} />
      )}

      {/* Drawer */}
      {isOpen && (
        <div className={`${styles.drawer} ${posClass}`}>
          {/* Drag handle / collapse tap target */}
          <button
            className={styles.handleWrap}
            onClick={handleClose}
            type="button"
            aria-label="Close"
          >
            <div className={styles.handle} />
          </button>

          {/* Header — locked, never scrolls */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.headerTitle}>Betslip ({bets.length})</span>
              {bets.length > 1 && (
                <span className={styles.headerMultiplier}>{combined.toFixed(2)}×</span>
              )}
            </div>
            <button className={styles.clearAll} onClick={onClearAll} type="button">
              Clear all
            </button>
          </div>

          {/* Scrollable content — everything below the header */}
          <div className={styles.scrollContent}>
            {/* Acca label — odds already shown in header */}
            {bets.length > 1 && (
              <div className={styles.accaTag}>
                <span className={styles.accaLabel}>{getAccaLabel(bets.length)} Accumulator</span>
              </div>
            )}

            {/* Selection rows */}
            {bets.map((bet) => (
              <SelectionRow key={bet.id} bet={bet} onRemove={onRemoveBet} />
            ))}

            {/* Stake section */}
            <div className={styles.stakeSection}>
              {/* Quick-stake chips */}
              <div className={styles.chips}>
                {([25, 50, 100, 200] as const).map((amount) => (
                  <button
                    key={amount}
                    className={`${styles.chip}${stake === amount ? ` ${styles.chipActive}` : ''}`}
                    onClick={() => handleChip(amount)}
                    type="button"
                  >
                    {currency}{amount}
                  </button>
                ))}
              </div>

              {/* Stake display / numpad trigger */}
              <button
                className={styles.stakeField}
                onClick={() => setNumpadOpen(true)}
                type="button"
                aria-label="Enter stake amount"
              >
                <span className={styles.stakeLabel}>Stake</span>
                <span className={styles.stakeValue}>
                  {stakeStr ? `${currency}${stakeStr}` : `${currency}—`}
                </span>
              </button>

              {/* Numpad — shown only when stake field is tapped */}
              {numpadOpen && (
                <Numpad onKey={handleNumpadKey} onDone={() => setNumpadOpen(false)} />
              )}

              {/* Summary */}
              {!numpadOpen && (
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Total Odds</span>
                    <span className={styles.summaryValue}>{combined.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Potential Win</span>
                    <span className={styles.summaryWin}>
                      {potentialWin ? `${currency}${potentialWin}` : '—'}
                    </span>
                  </div>
                </div>
              )}

              {/* Place Bet CTA */}
              <button
                className={[
                  styles.cta,
                  hasSuspended ? styles.ctaSuspended : ctaDisabled ? styles.ctaDisabled : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={handlePlaceBet}
                disabled={ctaDisabled}
                type="button"
              >
                {ctaLabel}
              </button>
            </div>
          </div>

          {/* Confirmation card — slides over the drawer after placement */}
          {confirming && (
            <div className={styles.confirmation}>
              <div className={styles.confirmIcon}>✓</div>
              <div className={styles.confirmTitle}>Bet Confirmed!</div>
              <div className={styles.confirmRef}>{confirmRef}</div>
              <div className={styles.confirmDetails}>
                <span>{currency}{stake.toFixed(2)}</span>
                <span className={styles.confirmSep}>·</span>
                <span>Odds {combined.toFixed(2)}</span>
                <span className={styles.confirmSep}>·</span>
                <span>Win {currency}{potentialWin ?? '—'}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
