import { useState, useRef, useEffect, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
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
const PLACE_BET_LOADING_MS = 1000
const BET_SUMMARY_VISIBLE_MS = 5000

type BetPlacementStage = 'idle' | 'loading' | 'summary'

type BetPlacementSummary = {
  ref: string
  stake: string
  odds: string
  potentialWin: string
}

function Numpad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className={styles.numpad}>
      <div className={styles.numpadGrid}>
        {NUMPAD_KEYS.map((k) => (
          <button key={k} className={styles.numpadKey} onClick={() => onKey(k)} type="button">
            {k}
          </button>
        ))}
      </div>
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
  /** Layout mode: floating mobile drawer or docked desktop panel. */
  layout?: 'floating' | 'desktop'
  /** Optional in-context navigation for contained previews. */
  onOpenMyBets?: () => void
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
  layout = 'floating',
  onOpenMyBets,
}: FloatingBetslipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [stakeStr, setStakeStr] = useState('')
  const [singleStakeById, setSingleStakeById] = useState<Record<string, string>>({})
  const [activeStakeTarget, setActiveStakeTarget] = useState<'multiple' | string>('multiple')
  const [betMode, setBetMode] = useState<'single' | 'multiple'>('single')
  const [betPlacementStage, setBetPlacementStage] = useState<BetPlacementStage>('idle')
  const [betPlacementSummary, setBetPlacementSummary] = useState<BetPlacementSummary | null>(null)
  const loadingTimer = useRef<ReturnType<typeof setTimeout>>()
  const summaryTimer = useRef<ReturnType<typeof setTimeout>>()
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
  const showFooterStakeControls = betMode === 'multiple' || bets.length === 1
  const footerStakeTarget =
    betMode === 'multiple' ? 'multiple' : (bets[0]?.id ?? 'multiple')
  const isDesktop = layout === 'desktop'

  useEffect(
    () => () => {
      clearTimeout(loadingTimer.current)
      clearTimeout(summaryTimer.current)
    },
    []
  )

  function clearPlacementTimers() {
    clearTimeout(loadingTimer.current)
    clearTimeout(summaryTimer.current)
  }

  function finalizePlacedBet() {
    clearPlacementTimers()
    setBetPlacementStage('idle')
    setBetPlacementSummary(null)
    setStakeStr('')
    setSingleStakeById({})
    onClearAll()
  }

  // If all bets are removed externally, collapse the drawer
  useEffect(() => {
    if (bets.length === 0) {
      setIsOpen(false)
      setNumpadOpen(false)
      setStakeStr('')
      setSingleStakeById({})
      setBetMode('single')
      setActiveStakeTarget('multiple')
      setBetPlacementStage('idle')
      setBetPlacementSummary(null)
      clearPlacementTimers()
    }
  }, [bets.length])

  useEffect(() => {
    if (bets.length <= 1) {
      setBetMode('single')
      if (bets[0]) setActiveStakeTarget(bets[0].id)
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
    // Keep the same micro-animation on both numpad open and close transitions.
    requestAnimationFrame(() => {
      stakeSectionRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
    })
  }, [numpadOpen])

  function handleClose() {
    setIsOpen(false)
    setNumpadOpen(false)
    if (betPlacementStage !== 'idle') {
      finalizePlacedBet()
    }
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
    if (footerStakeTarget === 'multiple') {
      setStakeStr(amount.toString())
      setActiveStakeTarget('multiple')
      return
    }
    setSingleStakeById((prev) => ({ ...prev, [footerStakeTarget]: amount.toString() }))
    setActiveStakeTarget(footerStakeTarget)
    // Chips only set the stake — numpad opens only via the stake input field
  }

  function handlePlaceBet() {
    if (hasSuspended) {
      bets.filter((b) => b.suspended).forEach((b) => onRemoveBet(b.id))
      return
    }
    const placedStake = betMode === 'multiple' ? multipleStake : singleStakeTotal
    if (placedStake <= 0) return
    setNumpadOpen(false)
    const ref = `BLX-${Math.floor(100000 + Math.random() * 900000)}`
    setBetPlacementSummary({
      ref,
      stake: placedStake.toFixed(2),
      odds: combined.toFixed(2),
      potentialWin: ((betMode === 'multiple' ? placedStake * combined : singlePotentialWin) || 0).toFixed(2),
    })
    onPlaceBet?.(placedStake)
    clearPlacementTimers()
    setBetPlacementStage('loading')
    loadingTimer.current = setTimeout(() => {
      setBetPlacementStage('summary')
      summaryTimer.current = setTimeout(() => {
        setIsOpen(false)
        finalizePlacedBet()
      }, BET_SUMMARY_VISIBLE_MS)
    }, PLACE_BET_LOADING_MS)
  }

  if (bets.length === 0 && !isDesktop) return null

  const posClass = contained ? styles.posAbsolute : styles.posFixed
  const themeClass = variant === 'figma' ? styles.figmaTheme : ''
  const isBetPlacementPending = betPlacementStage === 'loading' || betPlacementStage === 'summary'
  const ctaDisabled =
    isBetPlacementPending || (!hasSuspended && (betMode === 'multiple' ? multipleStake <= 0 : singleStakeTotal <= 0))

  const ctaLabel = betPlacementStage === 'loading'
    ? 'Placing bet...'
    : hasSuspended
    ? '⏸ Remove suspended selections'
    : stake > 0
    ? `Place Bet — ${currency}${(betMode === 'multiple' ? multipleStake : singleStakeTotal).toFixed(2)}`
    : 'Place Bet'
  const ctaStakeLabel = `${currency}${(betMode === 'multiple' ? multipleStake : singleStakeTotal).toFixed(2)}`
  const ctaReturnLabel = potentialWin ? `${currency}${potentialWin}` : '—'

  function handleMyBetsClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!onOpenMyBets) return
    event.preventDefault()
    handleClose()
    onOpenMyBets()
  }

  return (
    <>
      {/* Mini strip — hidden while drawer is open */}
      {!isDesktop && !isOpen && (
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
      {!isDesktop && isOpen && (
        <div
          className={`${styles.overlay} ${posClass}`}
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
        />
      )}

      {/* Drawer */}
      {(isDesktop || isOpen) && (
        <div
          className={[
            styles.drawer,
            isDesktop ? styles.desktopDrawer : posClass,
            themeClass,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle / collapse tap target */}
          {!isDesktop && (
            <button
              className={styles.handleWrap}
              onClick={handleClose}
              type="button"
              aria-label="Close"
            >
              <div className={styles.handle} />
            </button>
          )}

          {/* Header — locked, never scrolls */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {bets.length > 0 && <span className={styles.headerCount}>{bets.length}</span>}
              <span className={styles.headerTitle}>{isDesktop ? 'Bet Slip' : 'Betslip'}</span>
              {bets.length > 0 && <span className={styles.headerMultiplier}>{combined.toFixed(2)}</span>}
            </div>
            {bets.length > 0 && (
              <button className={styles.clearAll} onClick={onClearAll} type="button">
                Clear all
              </button>
            )}
          </div>

          {/* Scrollable content — everything below the header */}
          <div className={styles.scrollContent}>
            {isDesktop && bets.length === 0 ? (
              <>
                <div className={styles.desktopTabs}>
                  <button type="button" className={`${styles.desktopTab} ${styles.desktopTabActive}`}>Single</button>
                  <button type="button" className={styles.desktopTab}>Acca</button>
                  <button type="button" className={styles.desktopTab}>Multiples</button>
                </div>

                <div className={styles.desktopEmptyState}>
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                    <path d="M22 12h28a4 4 0 0 1 4 4v36l-6-4-6 4-6-4-6 4-6-4V16a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M29 27h14M29 35h14M29 43h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <p className={styles.desktopEmptyTitle}>Your bet slip is empty</p>
                </div>

                <div className={styles.desktopFooter}>
                  <div className={styles.desktopFooterRow}>
                    <span>Single</span>
                    <span>To return</span>
                  </div>
                  <div className={styles.desktopFooterRow}>
                    <span>—</span>
                    <span className={styles.desktopReturnDash}>—</span>
                  </div>
                </div>

                <button className={`${styles.cta} ${styles.ctaDisabled}`} disabled type="button">
                  Place bet
                </button>
              </>
            ) : (
              <>
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

            {/* Selection rows */}
            {bets.map((bet) => (
              <div key={bet.id} className={styles.selectionBlock}>
                <SelectionRow bet={bet} onRemove={onRemoveBet} />
                {betMode === 'single' && bets.length > 1 && (
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
              {showFooterStakeControls && (
                <div className={styles.stakeInputRow}>
                  <div className={styles.chips}>
                    {([25, 50, 100] as const).map((amount) => (
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
                  <button
                    className={`${styles.stakeField}${activeStakeStr ? '' : ` ${styles.stakeFieldEmpty}`}`}
                    onClick={() => {
                      setActiveStakeTarget(footerStakeTarget)
                      setNumpadOpen(true)
                    }}
                    type="button"
                    aria-label="Enter stake amount"
                  >
                    <span className={`${styles.stakeValue}${activeStakeStr ? '' : ` ${styles.stakeValuePlaceholder}`}`}>
                      {activeStakeStr ? `${currency}${activeStakeStr}` : 'Stake'}
                    </span>
                  </button>
                </div>
              )}

              {numpadOpen && (
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
                  {!hasSuspended ? (
                    <span className={styles.ctaStack}>
                      <span className={styles.ctaMain}>
                        {betPlacementStage === 'loading' ? (
                          <span className={styles.ctaLoading}>
                            <span className={styles.ctaSpinner} aria-hidden="true" />
                            Placing bet...
                          </span>
                        ) : (
                          <>Place Bet {ctaStakeLabel}</>
                        )}
                      </span>
                      <span className={styles.ctaSub}>
                        {betPlacementStage === 'loading' ? 'Please wait' : `Return ${ctaReturnLabel}`}
                      </span>
                    </span>
                  ) : (
                    ctaLabel
                  )}
                </button>
              )}

              {/* Numpad — shown only when stake field is tapped */}
              {numpadOpen && (
                <>
                  <Numpad onKey={handleNumpadKey} />
                  <button className={styles.numpadClose} onClick={() => setNumpadOpen(false)} type="button">
                    Done
                  </button>
                </>
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
              {!numpadOpen && (
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
                  {betPlacementStage === 'loading' ? (
                    <span className={styles.ctaLoading}>
                      <span className={styles.ctaSpinner} aria-hidden="true" />
                      Placing bet...
                    </span>
                  ) : (
                    ctaLabel
                  )}
                </button>
              )}
            </div>
              </>
            )}
          </div>

          {/* Bet placement summary stage */}
          {betPlacementStage === 'summary' && betPlacementSummary && (
            <div className={styles.betSummaryOverlay}>
              <div className={styles.betSummaryTimerTrack}>
                <div className={styles.betSummaryTimerFill} />
              </div>
              <div className={styles.betSummaryContent}>
                <div className={styles.betSummaryIcon}>✓</div>
                <div className={styles.betSummaryTitle}>Bet placed</div>
                <div className={styles.betSummaryRef}>{betPlacementSummary.ref}</div>
                <div className={styles.betSummaryDetails}>
                  <span>{currency}{betPlacementSummary.stake}</span>
                  <span className={styles.betSummarySep}>·</span>
                  <span>Odds {betPlacementSummary.odds}</span>
                  <span className={styles.betSummarySep}>·</span>
                  <span>Return {currency}{betPlacementSummary.potentialWin}</span>
                </div>
                <Link to="/my-bets" className={styles.betSummaryLink} onClick={handleMyBetsClick}>
                  My Bets
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
