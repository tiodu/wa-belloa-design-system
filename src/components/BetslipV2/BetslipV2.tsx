import { useState, useCallback } from 'react'
import type { BetEntryV2, BetTab, BetslipStatus } from './types'
import { combinedOdds, getAccaLabel, toFractional, totalStake } from './types'
import { TabBar } from './TabBar'
import { SingleView } from './SingleView'
import { AccaView } from './AccaView'
import { MultiplesView } from './MultiplesView'
import { FooterBar } from './FooterBar'
import styles from './BetslipV2.module.css'

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 4h12M5 4V2.5A.5.5 0 015.5 2h5a.5.5 0 01.5.5V4M6 7v5M10 7v5M3 4l1 9.5A.5.5 0 004.5 14h7a.5.5 0 00.5-.5L13 4"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export type BetslipV2Props = {
  bets: BetEntryV2[]
  currency?: string
  onPlaceBet?: (payload: { tab: BetTab; stakes: Record<string, string>; multipleStake: string }) => Promise<void>
  onRemoveBet?: (id: string) => void
  onClearAll?: () => void
}

export function BetslipV2({
  bets,
  currency = '€',
  onPlaceBet,
  onRemoveBet,
  onClearAll,
}: BetslipV2Props) {
  const [activeTab, setActiveTab] = useState<BetTab>('single')
  const [stakes, setStakes] = useState<Record<string, string>>({})
  const [multipleStake, setMultipleStake] = useState('')
  const [activeChip, setActiveChip] = useState<number | null>(null)
  const [status, setStatus] = useState<BetslipStatus>('idle')

  /* ---- Stake handlers ---- */

  const handleSingleStakeChange = useCallback((id: string, value: string) => {
    setStakes((prev) => ({ ...prev, [id]: value }))
    setActiveChip(null)
  }, [])

  const handleChipClick = useCallback((amount: number) => {
    setActiveChip(amount)
    if (activeTab === 'single') {
      // Apply chip to all single bets at once
      const updated: Record<string, string> = {}
      bets.forEach((b) => { updated[b.id] = String(amount) })
      setStakes(updated)
    } else if (activeTab === 'acca') {
      // Acca uses the FooterBar stake as global; stored as multipleStake
      setMultipleStake(String(amount))
    } else {
      setMultipleStake(String(amount))
    }
  }, [activeTab, bets])

  /* ---- Place bet ---- */

  const handlePlace = useCallback(async () => {
    if (!onPlaceBet) return
    setStatus('loading')
    try {
      await onPlaceBet({ tab: activeTab, stakes, multipleStake })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }, [onPlaceBet, activeTab, stakes, multipleStake])

  /* ---- Derived values ---- */

  const combined = combinedOdds(bets)

  const footerProps = (() => {
    if (activeTab === 'single') {
      const stake = totalStake(stakes)
      const potReturn = stake > 0 ? bets.reduce((sum, b) => {
        const s = parseFloat(stakes[b.id] ?? '') || 0
        return sum + s * b.odds
      }, 0) : null
      return {
        typeLabel: 'Single',
        oddsLabel: undefined as string | undefined,
        potentialReturn: potReturn,
        totalStake: stake,
      }
    }
    if (activeTab === 'acca') {
      const stake = parseFloat(multipleStake) || 0
      const potReturn = stake > 0 ? stake * combined : null
      return {
        typeLabel: getAccaLabel(bets.length),
        oddsLabel: toFractional(combined),
        potentialReturn: potReturn,
        totalStake: stake,
      }
    }
    // multiples — stake = multiple stake + sum of single stakes
    const mStake = parseFloat(multipleStake) || 0
    const sStake = totalStake(stakes)
    const stake = mStake + sStake
    const mReturn = mStake > 0 ? mStake * combined : 0
    const sReturn = bets.reduce((sum, b) => {
      const s = parseFloat(stakes[b.id] ?? '') || 0
      return sum + s * b.odds
    }, 0)
    return {
      typeLabel: 'Multiples',
      oddsLabel: undefined as string | undefined,
      potentialReturn: stake > 0 ? mReturn + sReturn : null,
      totalStake: stake,
    }
  })()

  const canPlace = footerProps.totalStake > 0 && bets.length > 0 && !bets.some((b) => b.suspended)

  /* ---- Empty state ---- */

  if (bets.length === 0) {
    return (
      <div className={styles.shell}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Bet Slip</span>
        </div>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your bet slip is empty</p>
          <p className={styles.emptyHint}>Add selections to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>Bet Slip</span>
        <span className={styles.betCount}>{bets.length}</span>
        <button
          className={styles.clearBtn}
          onClick={onClearAll}
          aria-label="Clear all bets"
          type="button"
        >
          <IconTrash />
        </button>
      </div>

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Scrollable bet list */}
      <div className={styles.betList} role="tabpanel">
        {activeTab === 'single' && (
          <SingleView
            bets={bets}
            stakes={stakes}
            currency={currency}
            onStakeChange={handleSingleStakeChange}
            onRemove={(id) => onRemoveBet?.(id)}
          />
        )}
        {activeTab === 'acca' && (
          <AccaView
            bets={bets}
            onRemove={(id) => onRemoveBet?.(id)}
          />
        )}
        {activeTab === 'multiples' && (
          <MultiplesView
            bets={bets}
            multipleStake={multipleStake}
            singleStakes={stakes}
            currency={currency}
            onMultipleStakeChange={setMultipleStake}
            onSingleStakeChange={handleSingleStakeChange}
            onRemove={(id) => onRemoveBet?.(id)}
          />
        )}
      </div>

      {/* Sticky footer */}
      <FooterBar
        typeLabel={footerProps.typeLabel}
        oddsLabel={footerProps.oddsLabel}
        potentialReturn={footerProps.potentialReturn}
        totalStake={footerProps.totalStake}
        currency={currency}
        status={status}
        canPlace={canPlace}
        activeChip={activeChip}
        onChipClick={handleChipClick}
        onPlace={handlePlace}
      />
    </div>
  )
}
