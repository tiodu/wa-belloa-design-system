import type { BetEntryV2 } from './types'
import { BetCardLS } from './BetCardLS'

type Props = {
  bets: BetEntryV2[]
  stakes: Record<string, string>
  currency?: string
  onStakeChange: (id: string, value: string) => void
  onRemove: (id: string) => void
}

export function SingleView({ bets, stakes, currency = '€', onStakeChange, onRemove }: Props) {
  return (
    <>
      {bets.map((bet) => (
        <BetCardLS
          key={bet.id}
          bet={bet}
          stake={stakes[bet.id] ?? ''}
          currency={currency}
          onStakeChange={onStakeChange}
          onRemove={onRemove}
        />
      ))}
    </>
  )
}
