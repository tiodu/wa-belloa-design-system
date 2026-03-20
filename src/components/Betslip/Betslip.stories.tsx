import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Betslip } from './Betslip'
import type { BetEntry, Bonus } from './types'

/* ---- Fixtures ---- */

const singleBet: BetEntry[] = [
  { id: '1', match: 'Arsenal - Manchester City', league: 'Premier League', market: '1x2', selection: '1', odds: 2.96 },
]

const multipleBets: BetEntry[] = [
  { id: '1', match: 'Arsenal - Manchester City', league: 'Premier League', market: '1x2', selection: '1', odds: 2.96 },
  { id: '2', match: 'Udinese - US Lecce', league: 'Serie A', market: '1x2', selection: '1', odds: 2.23 },
  { id: '3', match: 'Real Madrid - Barcelona', league: 'La Liga', market: 'Both teams to score', selection: 'Yes', odds: 1.75 },
]

const bonuses: Bonus[] = [
  { id: 'b1', type: 'OddsBoost', label: 'Odds Boost', originalOdds: 7.50, boostedOdds: 8.75 },
  { id: 'b2', type: 'FreeBet', label: 'Free Bet', amount: 10 },
]

const suspendedBets: BetEntry[] = [
  { id: '1', match: 'Arsenal - Manchester City', league: 'Premier League', market: '1x2', selection: '1', odds: 2.96, suspended: true },
  { id: '2', match: 'Udinese - US Lecce', league: 'Serie A', market: '1x2', selection: '1', odds: 2.23 },
]

/* ---- Meta ---- */

const meta = {
  title: 'Sportsbook/Betslip',
  component: Betslip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**WA Belloa Design System — Betslip**

Figma source: \`sportsbook/betslip\` (node 54917:16571)

All tokens reference \`belloa.css\` CSS custom properties extracted from the Figma file.
        `,
      },
    },
  },
  argTypes: {
    currency: { control: 'text' },
    onPlaceBet: { action: 'placeBet' },
    onRemoveBet: { action: 'removeBet' },
    onClearAll:  { action: 'clearAll' },
  },
} satisfies Meta<typeof Betslip>

export default meta
type Story = StoryObj<typeof meta>

/* ---- Stories ---- */

export const Empty: Story = {
  name: 'Empty state',
  args: {
    bets: [],
    bonuses: [],
    onPlaceBet: () => {},
    onRemoveBet: () => {},
  },
}

export const SingleBet: Story = {
  name: 'Single bet',
  args: {
    bets: singleBet,
    bonuses: [],
    onPlaceBet: () => {},
    onRemoveBet: () => {},
  },
}

export const Accumulator: Story = {
  name: 'Accumulator (3 bets)',
  args: {
    bets: multipleBets,
    bonuses: [],
    onPlaceBet: () => {},
    onRemoveBet: () => {},
    onClearAll: () => {},
  },
}

export const WithBonuses: Story = {
  name: 'With bonuses',
  args: {
    bets: multipleBets,
    bonuses,
    onPlaceBet: () => {},
    onRemoveBet: () => {},
    onClearAll: () => {},
  },
}

export const Suspended: Story = {
  name: 'Suspended selection',
  args: {
    bets: suspendedBets,
    bonuses: [],
    onPlaceBet: () => {},
    onRemoveBet: () => {},
  },
}

/** Interactive story — controlled state for loading / success / error */
export const Interactive: Story = {
  name: 'Interactive (all states)',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>(multipleBets)
    return (
      <Betslip
        {...args}
        bets={bets}
        onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
        onClearAll={() => setBets([])}
        onPlaceBet={async () => {
          await new Promise((res) => setTimeout(res, 1500))
        }}
      />
    )
  },
  args: {
    bets: multipleBets,
    bonuses,
    onPlaceBet: () => {},
    onRemoveBet: () => {},
    onClearAll: () => {},
  },
}

export const Loading: Story = {
  name: 'Loading state (snapshot)',
  parameters: {
    docs: { description: { story: 'PlaceBetButton in loading state. Triggered automatically in the Interactive story.' } },
  },
  args: {
    bets: singleBet,
    bonuses: [],
    onPlaceBet: () => new Promise(() => {}), // never resolves
    onRemoveBet: () => {},
  },
}
