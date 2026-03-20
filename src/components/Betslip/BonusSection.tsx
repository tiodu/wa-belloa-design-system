import type { Bonus } from './types'
import styles from './BonusSection.module.css'

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
  </svg>
)

type Props = {
  bonuses: Bonus[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function BonusSection({ bonuses, selectedId, onSelect }: Props) {
  if (bonuses.length === 0) return null

  function toggle(id: string) {
    onSelect(selectedId === id ? null : id)
  }

  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>Bonuses &amp; Promotions</span>
      <div className={styles.chips} role="group" aria-label="Available bonuses">
        {bonuses.map((bonus) => {
          const isSelected = selectedId === bonus.id

          if (bonus.type === 'OddsBoost') {
            return (
              <button
                key={bonus.id}
                className={`${styles.chip} ${styles['chip--odd']} ${isSelected ? styles['chip--selected'] : ''}`}
                onClick={() => toggle(bonus.id)}
                aria-pressed={isSelected}
                type="button"
              >
                {/* "Yes" / selection label */}
                <span className={styles.chipLabel}>{bonus.label}</span>
                {/* Strikethrough original → boosted */}
                <div className={styles.oddsRow}>
                  {bonus.originalOdds != null && (
                    <span className={styles.oddsOriginal}>{bonus.originalOdds.toFixed(2)}</span>
                  )}
                  {bonus.boostedOdds != null && (
                    <span className={styles.oddsBoosted}>{bonus.boostedOdds.toFixed(2)}</span>
                  )}
                </div>
              </button>
            )
          }

          if (bonus.type === 'FreeBet') {
            return (
              <button
                key={bonus.id}
                className={`${styles.chip} ${isSelected ? styles['chip--selected'] : ''}`}
                onClick={() => toggle(bonus.id)}
                aria-pressed={isSelected}
                type="button"
              >
                {bonus.amount != null && (
                  <span className={styles.freeBetAmount}>
                    {bonus.amount.toFixed(2)}
                  </span>
                )}
                <IconArrow />
                <span className={styles.chipLabel}>{bonus.label}</span>
              </button>
            )
          }

          /* CashbackOffer fallback */
          return (
            <button
              key={bonus.id}
              className={`${styles.chip} ${isSelected ? styles['chip--selected'] : ''}`}
              onClick={() => toggle(bonus.id)}
              aria-pressed={isSelected}
              type="button"
            >
              <span className={styles.chipLabel}>{bonus.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
