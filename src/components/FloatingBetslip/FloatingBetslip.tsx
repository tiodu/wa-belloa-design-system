import { useState, useRef, useEffect } from 'react'
import { MiniStrip } from './MiniStrip'
import type { BetEntry } from './types'
import { combinedOdds } from './types'
import { BetEntryCard } from '../BetEntryCard'
import styles from './FloatingBetslip.module.css'

/* ─── SelectionRow ─── */

function SelectionRow({ bet, onRemove }: { bet: BetEntry; onRemove: (id: string) => void }) {
  const topMeta = bet.isLive && bet.score
    ? `${bet.score}${bet.minute !== undefined ? ` · ${bet.minute}'` : ''}`
    : undefined

  return (
    <div className={`${styles.selRow}${bet.suspended ? ` ${styles.selRowSuspended}` : ''}`}>
      <BetEntryCard
        topMeta={topMeta}
        topPrimary={bet.match}
        odds={bet.odds.toFixed(2)}
        oddsDirection={bet.oddsDirection}
        selection={bet.selection}
        market={bet.market}
        suspendedLabel={bet.suspended ? '⏸ Suspended' : undefined}
        onRemove={() => onRemove(bet.id)}
        removeAriaLabel={`Remove ${bet.selection}`}
      />
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
  /** Visual theme variant for the mini strip + drawer. */
  variant?: 'default' | 'figma'
  /** External signal to open the drawer (increments/triggers). */
  openSignal?: number
}

export function FloatingBetslip({
  bets,
  onRemoveBet,
  onClearAll,
  onPlaceBet,
  currency = '₺',
  contained = false,
  variant = 'default',
  openSignal,
}: FloatingBetslipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [stakeStr, setStakeStr] = useState('')
  const [singleStakeById, setSingleStakeById] = useState<Record<string, string>>({})
  const [activeStakeTarget, setActiveStakeTarget] = useState<'multiple' | string>('multiple')
  const [betMode, setBetMode] = useState<'single' | 'multiple'>('single')
  const [confirming, setConfirming] = useState(false)
  const [confirmRef, setConfirmRef] = useState('')
  const confirmTimer = useRef<ReturnType<typeof setTimeout>>()
  const stakeSectionRef = useRef<HTMLDivElement>(null)

  const multipleStake = parseFloat(stakeStr) || 0
  const singleStakeTotal = bets.reduce((sum, b) => sum + (parseFloat(singleStakeById[b.id] ?? '') || 0), 0)
  const singlePotentialWin = bets.reduce(
    (sum, b) => sum + ((parseFloat(singleStakeById[b.id] ?? '') || 0) * b.odds),
    0
  )
  const activeStakeStr = activeStakeTarget === 'multiple' ? stakeStr : (singleStakeById[activeStakeTarget] ?? '')
  const stake = betMode === 'multiple' ? multipleStake : singleStakeTotal
  const combined = combinedOdds(bets)
  const potentialWin =
    stake > 0
      ? (betMode === 'multiple' ? stake * combined : singlePotentialWin).toFixed(2)
      : null
  const hasSuspended = bets.some((b) => b.suspended)

  useEffect(() => () => clearTimeout(confirmTimer.current), [])

  // If all bets are removed externally, collapse the drawer
  useEffect(() => {
    if (bets.length === 0) {
      setIsOpen(false)
      setNumpadOpen(false)
      setStakeStr('')
      setSingleStakeById({})
      setBetMode('single')
      setActiveStakeTarget('multiple')
    }
  }, [bets.length])

  useEffect(() => {
    if (bets.length <= 1) {
      setBetMode('single')
      return
    }
    // Default to multiples when two or more selections are present.
    setBetMode('multiple')
    setActiveStakeTarget('multiple')
    setNumpadOpen(false)
  }, [bets.length])

  useEffect(() => {
    if (openSignal === undefined) return
    setIsOpen(true)
  }, [openSignal])

  useEffect(() => {
    if (!numpadOpen) return
    // Ensure Done + Place Bet remain visible inside constrained previews.
    requestAnimationFrame(() => {
      stakeSectionRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
    })
  }, [numpadOpen])

  function handleClose() {
    setIsOpen(false)
    setNumpadOpen(false)
  }

  function handleNumpadKey(k: string) {
    const currentStakeStr = activeStakeStr
    const setCurrentStakeStr = (next: string | ((prev: string) => string)) => {
      if (activeStakeTarget === 'multiple') {
        setStakeStr(next)
        return
      }
      setSingleStakeById((prev) => {
        const curr = prev[activeStakeTarget] ?? ''
        const resolved = typeof next === 'function' ? next(curr) : next
        return { ...prev, [activeStakeTarget]: resolved }
      })
    }

    if (k === '⌫') {
      setCurrentStakeStr((s) => s.slice(0, -1))
      return
    }
    if (k === '.') {
      if (!currentStakeStr.includes('.')) setCurrentStakeStr((s) => s + '.')
      return
    }
    // Guard: max 2 decimal places, max 8 chars total
    const parts = currentStakeStr.split('.')
    if (parts[1]?.length >= 2) return
    if (currentStakeStr.length >= 8) return
    setCurrentStakeStr((s) => s + k)
  }

  function handleChip(amount: number) {
    setStakeStr(amount.toString())
    setActiveStakeTarget('multiple')
    // Chips only set the stake — numpad opens only via the stake input field
  }

  function handlePlaceBet() {
    if (hasSuspended) {
      bets.filter((b) => b.suspended).forEach((b) => onRemoveBet(b.id))
      return
    }
    const placedStake = betMode === 'multiple' ? multipleStake : singleStakeTotal
    if (placedStake <= 0) return

    const ref = `BLX-${Math.floor(100000 + Math.random() * 900000)}`
    setConfirmRef(ref)
    setConfirming(true)
    onPlaceBet?.(placedStake)

    confirmTimer.current = setTimeout(() => {
      setConfirming(false)
      setIsOpen(false)
      setNumpadOpen(false)
      setStakeStr('')
      setSingleStakeById({})
      onClearAll()
    }, 2800)
  }

  if (bets.length === 0) return null

  const posClass = contained ? styles.posAbsolute : styles.posFixed
  const themeClass = variant === 'figma' ? styles.figmaTheme : ''
  const ctaDisabled = !hasSuspended && (betMode === 'multiple' ? multipleStake <= 0 : singleStakeTotal <= 0)

  const ctaLabel = hasSuspended
    ? '⏸ Remove suspended selections'
    : stake > 0
    ? `Place Bet — ${currency}${(betMode === 'multiple' ? multipleStake : singleStakeTotal).toFixed(2)}`
    : 'Place Bet'

  return (
    <>
      {/* Mini strip — hidden while drawer is open */}
      {!isOpen && (
        <MiniStrip
          bets={bets}
          stake={stake > 0 ? stake : undefined}
          currency={currency}
          variant={variant}
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
        <div
          className={`${styles.overlay} ${posClass}`}
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
        />
      )}

      {/* Drawer */}
      {isOpen && (
        <div
          className={`${styles.drawer} ${posClass} ${themeClass}`}
          onClick={(e) => e.stopPropagation()}
        >
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
                <span className={styles.headerMultiplier}>{combined.toFixed(2)}</span>
              )}
            </div>
            <button className={styles.clearAll} onClick={onClearAll} type="button">
              Clear all
            </button>
          </div>

          {/* Scrollable content — everything below the header */}
          <div className={styles.scrollContent}>
            {bets.length >= 2 && (
              <div className={styles.modeTabs}>
                <button
                  type="button"
                  className={`${styles.modeTab} ${betMode === 'single' ? styles.modeTabActive : ''}`}
                  onClick={() => {
                    setBetMode('single')
                    setNumpadOpen(false)
                  }}
                >
                  Single
                </button>
                <button
                  type="button"
                  className={`${styles.modeTab} ${betMode === 'multiple' ? styles.modeTabActive : ''}`}
                  onClick={() => {
                    if (bets.length <= 1) return
                    setBetMode('multiple')
                    setNumpadOpen(false)
                    setActiveStakeTarget('multiple')
                  }}
                  disabled={bets.length <= 1}
                >
                  Multiple
                </button>
              </div>
            )}

            {/* Selection rows */}
            {bets.map((bet) => (
              <div key={bet.id} className={styles.selectionBlock}>
                <SelectionRow bet={bet} onRemove={onRemoveBet} />
                {betMode === 'single' && (
                  <div
                    className={`${styles.singleStakeRow} ${bets.length === 1 ? styles.singleStakeRowFull : ''}`}
                  >
                    <button
                      className={`${styles.singleStakeField} ${bets.length === 1 ? styles.singleStakeFieldFull : ''}`}
                      onClick={() => {
                        setActiveStakeTarget(bet.id)
                        setNumpadOpen(true)
                      }}
                      type="button"
                    >
                      <span className={styles.singleStakeValue}>
                        {singleStakeById[bet.id] ? `${currency}${singleStakeById[bet.id]}` : 'Stake'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Stake section */}
            <div className={styles.stakeSection} ref={stakeSectionRef}>
              {/* Quick-stake chips */}
              {!numpadOpen && betMode === 'multiple' && (
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
              )}

              {/* Stake display / numpad trigger */}
              {betMode === 'multiple' && (
                <button
                  className={`${styles.stakeField}${stakeStr ? '' : ` ${styles.stakeFieldEmpty}`}`}
                  onClick={() => {
                    setActiveStakeTarget('multiple')
                    setNumpadOpen(true)
                  }}
                  type="button"
                  aria-label="Enter stake amount"
                >
                  {stakeStr && <span className={styles.stakeLabel}>Stake</span>}
                  <span className={styles.stakeValue}>
                    {stakeStr ? `${currency}${stakeStr}` : 'Stake'}
                  </span>
                </button>
              )}

              {/* Numpad — shown only when stake field is tapped */}
              {numpadOpen && (
                <Numpad onKey={handleNumpadKey} onDone={() => setNumpadOpen(false)} />
              )}

              {/* Summary */}
              {!numpadOpen && (
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      {betMode === 'multiple' ? 'Total Odds' : 'Total Stake'}
                    </span>
                    <span className={styles.summaryValue}>
                      {betMode === 'multiple' ? combined.toFixed(2) : `${currency}${singleStakeTotal.toFixed(2)}`}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      {betMode === 'multiple' ? 'Potential Win' : 'Total Return'}
                    </span>
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
