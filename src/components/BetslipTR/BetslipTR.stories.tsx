import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { BetslipTR } from './BetslipTR'
import type { BetEntryTR } from './types'
import '../../tokens/belloa.css'

/* ---- Fixtures ---- */

const BET_1: BetEntryTR = {
  id: 'b1',
  match: 'Galatasaray - Fenerbahçe',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Galatasaray',
  odds: 2.15,
}

const BET_2: BetEntryTR = {
  id: 'b2',
  match: 'Beşiktaş - Trabzonspor',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Beşiktaş',
  odds: 1.85,
}

const BET_3: BetEntryTR = {
  id: 'b3',
  match: 'Kasımpaşa - Başakşehir',
  league: 'Süper Lig',
  market: 'İlk Yarı / Maç Sonucu',
  selection: 'Kasımpaşa / Kasımpaşa',
  odds: 3.40,
}

const BET_SUSPENDED: BetEntryTR = {
  id: 'b4',
  match: 'Antalyaspor - Sivasspor',
  league: 'Süper Lig',
  market: 'Üst / Alt 2.5',
  selection: 'Üst',
  odds: 1.95,
  suspended: true,
}

/* ---- Meta ---- */

const meta = {
  title: 'Sportsbook/BetslipTR',
  component: BetslipTR,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101211' }],
    },
    docs: {
      description: {
        component:
          'Turkish-market betslip. Supports single and kombine (accumulator) modes with ₺ quick-stake chips. Suspended selections are excluded from the bet total.',
      },
    },
  },
  argTypes: {
    onPlaceBet: { action: 'placeBet' },
    onRemoveBet: { action: 'removeBet' },
    onClearAll:  { action: 'clearAll' },
  },
} satisfies Meta<typeof BetslipTR>

export default meta
type Story = StoryObj<typeof meta>

/* ---- Stories ---- */

export const Empty: Story = {
  name: 'Empty state',
  args: { bets: [] },
}

export const SingleBet: Story = {
  name: 'Single bet',
  args: { bets: [BET_1] },
}

export const Double: Story = {
  name: 'Double (2 selections)',
  args: { bets: [BET_1, BET_2] },
}

export const Treble: Story = {
  name: 'Treble (3 selections)',
  args: { bets: [BET_1, BET_2, BET_3] },
}

export const WithSuspended: Story = {
  name: 'With suspended selection',
  args: { bets: [BET_1, BET_SUSPENDED, BET_3] },
}

export const AllSuspended: Story = {
  name: 'All selections suspended',
  args: {
    bets: [
      { ...BET_1, suspended: true },
      { ...BET_2, suspended: true },
    ],
  },
}

export const Interactive: Story = {
  name: 'Interactive (remove + place)',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntryTR[]>([BET_1, BET_2, BET_3])
    return (
      <BetslipTR
        {...args}
        bets={bets}
        onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
        onClearAll={() => setBets([])}
        onPlaceBet={async () => {
          await new Promise((res) => setTimeout(res, 1200))
        }}
      />
    )
  },
  args: { bets: [BET_1, BET_2, BET_3] },
}
