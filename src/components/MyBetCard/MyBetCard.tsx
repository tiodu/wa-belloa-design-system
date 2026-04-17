import styles from './MyBetCard.module.css'

export type MyBetLeg = {
  selection: string
  market: string
  result?: 'pending' | 'won' | 'lost' | 'void'
}

export type MyBetCardProps = {
  id: string
  betType: string
  stake: number
  potentialReturn: number
  actualReturn?: number
  currency?: string
  status: 'open' | 'won' | 'lost' | 'void' | 'cashedout'
  isLive?: boolean
  event: string
  kickoffDate: string
  legs: MyBetLeg[]
  cashOutValue?: number
  odds: number
  originalOdds?: number
  onCashOut?: (id: string) => void
}

const STATUS_LABELS: Record<MyBetCardProps['status'], string> = {
  open: 'Open',
  won: 'Won',
  lost: 'Lost',
  void: 'Void',
  cashedout: 'Cashed Out',
}

export function MyBetCard({
  id,
  betType,
  stake,
  potentialReturn,
  actualReturn,
  currency = '₺',
  status,
  isLive,
  event,
  kickoffDate,
  legs,
  cashOutValue,
  odds,
  originalOdds,
  onCashOut,
}: MyBetCardProps) {
  const showCashOut = status === 'open' && cashOutValue !== undefined
  const returnValue = actualReturn !== undefined ? actualReturn : potentialReturn
  const returnLabel = status === 'won' || status === 'cashedout' ? 'Returned' : 'To Return'

  return (
    <div className={styles.card}>
      {/* Header row: status badge + stake + bet type */}
      <div className={styles.header}>
        {status !== 'open' && (
          <span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
            {STATUS_LABELS[status]}
          </span>
        )}
        {isLive && status === 'open' && (
          <span className={styles.liveBadge}>LIVE</span>
        )}
        <span className={styles.headerStake}>
          {currency}{stake.toFixed(2)}
        </span>
        <span className={styles.headerBetType}>{betType}</span>
        <div className={styles.headerOdds}>
          {originalOdds !== undefined && (
            <span className={styles.originalOdds}>{originalOdds.toFixed(2)}</span>
          )}
          <span className={styles.odds}>{odds.toFixed(2)}</span>
        </div>
      </div>

      {/* Legs */}
      {legs.length === 1 ? (
        <div className={styles.singleLeg}>
          <span className={styles.legSelection}>{legs[0].selection}</span>
          <span className={styles.legMarket}>{legs[0].market}</span>
        </div>
      ) : (
        <div className={styles.legsWrap}>
          <div className={styles.timeline}>
            {legs.map((_, i) => (
              <div key={i} className={styles.timelineRow}>
                <div className={`${styles.circle}${legs[i].result ? ` ${styles[`circle_${legs[i].result}`]}` : ''}`} />
                {i < legs.length - 1 && <div className={styles.connector} />}
              </div>
            ))}
          </div>
          <div className={styles.legsContent}>
            {legs.map((leg, i) => (
              <div key={i} className={styles.leg}>
                <span className={styles.legSelection}>{leg.selection}</span>
                <span className={styles.legMarket}>{leg.market}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event + date */}
      <div className={styles.eventRow}>
        <span className={styles.eventName}>{event}</span>
        <span className={styles.eventDate}>{kickoffDate}</span>
      </div>

      {/* Stake / Return */}
      <div className={styles.stakeReturnRow}>
        <div className={styles.stakeReturnItem}>
          <span className={styles.stakeReturnLabel}>Stake</span>
          <span className={styles.stakeReturnValue}>{currency}{stake.toFixed(2)}</span>
        </div>
        <div className={styles.stakeReturnItem}>
          <span className={styles.stakeReturnLabel}>{returnLabel}</span>
          <span className={`${styles.stakeReturnValue}${status === 'won' ? ` ${styles.returnWon}` : ''}`}>
            {currency}{returnValue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Cash Out */}
      {showCashOut && (
        <button
          className={styles.cashOutBtn}
          onClick={() => onCashOut?.(id)}
          type="button"
        >
          Cash Out {currency}{cashOutValue!.toFixed(2)}
        </button>
      )}
    </div>
  )
}
