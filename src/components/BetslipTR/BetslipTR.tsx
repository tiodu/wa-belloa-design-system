import { useState, useCallback } from 'react'
import type { BetEntryTR, BetslipMode, BetslipStatus } from './types'
import { combinedOdds } from './types'
import { BetCard } from './BetCard'
import styles from './BetslipTR.module.css'

/* ---- Quick stake amounts (TRY) ---- */
const QUICK_STAKES = [25, 50, 100, 250]

/* ---- Icons ---- */
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 4h12M5 4V2.5A.5.5 0 015.5 2h5a.5.5 0 01.5.5V4M6 7v5M10 7v5M3 4l1 9.5A.5.5 0 004.5 14h7a.5.5 0 00.5-.5L13 4"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 8l4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconTicket = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M4 12a2 2 0 000 4v4a2 2 0 002 2h20a2 2 0 002-2v-4a2 2 0 000-4v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10v12M16 14h4M16 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/* ---- Props ---- */
export type BetslipTRProps = {
  bets: BetEntryTR[]
  onPlaceBet?: (stake: number, mode: BetslipMode) => Promise<void>
  onRemoveBet?: (id: string) => void
  onClearAll?: () => void
}

export function BetslipTR({
  bets,
  onPlaceBet,
  onRemoveBet,
  onClearAll,
}: BetslipTRProps) {
  const [mode, setMode] = useState<BetslipMode>('single')
  const [stake, setStake] = useState('')
  const [activeChip, setActiveChip] = useState<number | null>(null)
  const [status, setStatus] = useState<BetslipStatus>('idle')

  /* ---- Stake handlers ---- */
  const handleStakeChange = useCallback((value: string) => {
    setStake(value)
    setActiveChip(null)
  }, [])

  const handleChipClick = useCallback((amount: number) => {
    setStake(String(amount))
    setActiveChip(amount)
  }, [])

  /* ---- Place bet ---- */
  const handlePlace = useCallback(async () => {
    if (!onPlaceBet) return
    const stakeNum = parseFloat(stake) || 0
    if (stakeNum <= 0) return
    setStatus('loading')
    try {
      await onPlaceBet(stakeNum, mode)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }, [onPlaceBet, stake, mode])

  /* ---- Derived values ---- */
  const activeBets = bets.filter((b) => !b.suspended)
  const stakeNum = parseFloat(stake) || 0
  const combined = combinedOdds(activeBets)

  const potentialReturn = (() => {
    if (stakeNum <= 0 || activeBets.length === 0) return null
    if (mode === 'kombine') return stakeNum * combined
    // Single: one stake applied to each bet individually, total return
    return activeBets.reduce((sum, b) => sum + stakeNum * b.odds, 0)
  })()

  const hasSuspended = bets.some((b) => b.suspended)
  const canPlace = stakeNum > 0 && activeBets.length > 0 && status === 'idle'

  const ctaLabel = status === 'loading'
    ? 'İşleniyor…'
    : status === 'success'
    ? 'Bahis Alındı!'
    : stakeNum > 0
    ? `Bahis Yap  ₺${stakeNum.toFixed(2)}`
    : 'Bahis Yap'

  /* ---- Accumulator label ---- */
  const accaLabel = (() => {
    const n = activeBets.length
    if (n === 2) return 'İkili'
    if (n === 3) return 'Üçlü'
    if (n >= 4) return `${n}'lı Kombine`
    return 'Kombine'
  })()

  /* ---- Empty state ---- */
  if (bets.length === 0) {
    return (
      <div className={styles.shell}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Bahis Kuponu</span>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}><IconTicket /></span>
          <p className={styles.emptyText}>Kuponunuz boş</p>
          <p className={styles.emptyHint}>Bahis eklemek için maçlardan seçim yapın</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>Bahis Kuponu</span>
        <span className={styles.betCount}>{bets.length}</span>
        <button
          className={styles.clearBtn}
          onClick={onClearAll}
          aria-label="Tüm bahisleri kaldır"
          type="button"
        >
          <IconTrash />
        </button>
      </div>

      {/* Mode tabs — only show if >1 bet */}
      {bets.length > 1 && (
        <div className={styles.tabs} role="tablist" aria-label="Bahis türü">
          <button
            className={`${styles.tab} ${mode === 'single' ? styles['tab--active'] : ''}`}
            onClick={() => setMode('single')}
            role="tab"
            aria-selected={mode === 'single'}
            type="button"
          >
            Tekli
          </button>
          <button
            className={`${styles.tab} ${mode === 'kombine' ? styles['tab--active'] : ''}`}
            onClick={() => setMode('kombine')}
            role="tab"
            aria-selected={mode === 'kombine'}
            type="button"
          >
            Kombine
          </button>
        </div>
      )}

      {/* Bet list */}
      <div className={styles.betList}>
        {bets.map((bet) => (
          <BetCard
            key={bet.id}
            bet={bet}
            onRemove={(id) => onRemoveBet?.(id)}
          />
        ))}

        {/* Kombine summary row */}
        {mode === 'kombine' && activeBets.length > 1 && (
          <div className={styles.accaSummary}>
            <span className={styles.accaLabel}>{accaLabel}</span>
            <span className={styles.accaOdds}>@ {combined.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Suspended notice */}
      {hasSuspended && (
        <div className={styles.suspendedNotice} role="alert">
          Askıya alınan seçimler bahse dahil edilmeyecek
        </div>
      )}

      {/* Footer: stake + CTA */}
      <div className={styles.footer}>
        {/* Quick chips */}
        <div className={styles.quickChips} role="group" aria-label="Hızlı bahis tutarları">
          {QUICK_STAKES.map((amount) => (
            <button
              key={amount}
              className={`${styles.chip} ${activeChip === amount ? styles['chip--active'] : ''}`}
              onClick={() => handleChipClick(amount)}
              type="button"
              aria-pressed={activeChip === amount}
              aria-label={`₺${amount} bahis`}
            >
              ₺{amount}
            </button>
          ))}
        </div>

        {/* Stake input */}
        <div className={styles.stakeRow}>
          <label className={styles.stakeLabel} htmlFor="tr-stake">Bahis Tutarı</label>
          <div className={styles.stakeInputWrap}>
            <span className={styles.currencySymbol}>₺</span>
            <input
              id="tr-stake"
              className={styles.stakeInput}
              type="number"
              inputMode="decimal"
              min="0"
              step="1"
              placeholder="0"
              value={stake}
              onChange={(e) => handleStakeChange(e.target.value)}
              aria-label="Bahis tutarı"
            />
          </div>
        </div>

        {/* Potential return */}
        <div className={styles.returnRow}>
          <span className={styles.returnLabel}>Potansiyel Kazanç</span>
          <span className={`${styles.returnValue} ${potentialReturn !== null ? styles['returnValue--active'] : ''}`}>
            {potentialReturn !== null ? `₺${potentialReturn.toFixed(2)}` : '—'}
          </span>
        </div>

        {/* CTA */}
        <button
          className={`${styles.cta} ${status === 'loading' ? styles['cta--loading'] : ''} ${status === 'success' ? styles['cta--success'] : ''} ${status === 'error' ? styles['cta--error'] : ''}`}
          onClick={handlePlace}
          disabled={!canPlace}
          aria-busy={status === 'loading'}
          type="button"
        >
          {status === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
          {status === 'success' && <IconCheck />}
          <span>{ctaLabel}</span>
        </button>
      </div>
    </div>
  )
}
