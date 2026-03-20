import { useState, useCallback } from 'react'
import type { BetEntry as BetEntryType, Bonus, BetslipStatus } from './types'
import { combinedOdds } from './types'
import { BetEntry } from './BetEntry'
import { AccumulatorSummary } from './AccumulatorSummary'
import { StakeInput } from './StakeInput'
import { BonusSection } from './BonusSection'
import { PlaceBetButton } from './PlaceBetButton'
import styles from './Betslip.module.css'

const IconBetslip = () => (
  <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M16 22h16M16 30h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="28" cy="8" r="2" fill="currentColor" />
  </svg>
)

export type BetslipProps = {
  bets: BetEntryType[]
  bonuses?: Bonus[]
  currency?: string
  onPlaceBet: (bets: BetEntryType[], stake: number) => void | Promise<void>
  onRemoveBet: (id: string) => void
  onClearAll?: () => void
}

export function Betslip({
  bets,
  bonuses = [],
  currency = '€',
  onPlaceBet,
  onRemoveBet,
  onClearAll,
}: BetslipProps) {
  const [stake, setStake] = useState('')
  const [status, setStatus] = useState<BetslipStatus>('idle')
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null)

  const stakeNum = parseFloat(stake) || 0
  const odds = bets.length > 0 ? combinedOdds(bets) : 0
  const potentialReturns = stakeNum * odds

  const hasSuspended = bets.some((b) => b.suspended)
  const canPlace = bets.length > 0 && stakeNum > 0 && !hasSuspended && status === 'idle'

  const handlePlace = useCallback(async () => {
    if (!canPlace) return
    setStatus('loading')
    try {
      await onPlaceBet(bets, stakeNum)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [bets, stakeNum, canPlace, onPlaceBet])

  const handleRetry = useCallback(() => {
    setStatus('idle')
  }, [])

  if (bets.length === 0) {
    return (
      <div className={styles.betslip} role="complementary" aria-label="Bet slip">
        <div className={styles.header}>
          <span className={styles.title}>Bet Slip</span>
        </div>
        <div className={styles.empty}>
          <IconBetslip />
          <span className={styles.emptyTitle}>Your bet slip is empty</span>
          <span className={styles.emptySubtitle}>Add selections to build your bet</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.betslip} role="complementary" aria-label="Bet slip">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Bet Slip ({bets.length})</span>
        {onClearAll && (
          <button className={styles.clearBtn} onClick={onClearAll} type="button">
            Clear all
          </button>
        )}
      </div>

      {/* Bet entries */}
      <div className={styles.betList} role="list" aria-label="Your selections">
        {bets.map((bet) => (
          <div key={bet.id} role="listitem">
            <BetEntry
              bet={bet}
              showBonus={selectedBonusId !== null}
              onRemove={onRemoveBet}
            />
          </div>
        ))}
      </div>

      {/* Accumulator summary + stake + bonuses */}
      <div className={styles.body}>
        <AccumulatorSummary bets={bets} />

        <StakeInput
          stake={stake}
          potentialReturns={potentialReturns}
          currency={currency}
          onChange={setStake}
        />

        {bonuses.length > 0 && (
          <BonusSection
            bonuses={bonuses}
            selectedId={selectedBonusId}
            onSelect={setSelectedBonusId}
          />
        )}
      </div>

      {/* CTA */}
      <div className={styles.footer}>
        <PlaceBetButton
          status={status}
          disabled={!canPlace}
          onClick={status === 'error' ? handleRetry : handlePlace}
        />
      </div>
    </div>
  )
}
