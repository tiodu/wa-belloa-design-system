import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FloatingBetslip } from './FloatingBetslip'
import type { BetEntry } from './types'
import '../../tokens/belloa.css'

/* ---- Fixtures ---- */

const BET_LIVE_1: BetEntry = {
  id: 'f1',
  match: 'Galatasaray - Fenerbahçe',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Galatasaray',
  odds: 2.15,
  isLive: true,
  score: '1-0',
  minute: 67,
  sparkline: [0.6, 0.55, 0.7, 0.65, 0.8, 0.9],
}

const BET_LIVE_2: BetEntry = {
  id: 'f2',
  match: 'Beşiktaş - Trabzonspor',
  league: 'Süper Lig',
  market: 'Üst/Alt 2.5',
  selection: 'Üst',
  odds: 1.85,
  isLive: true,
  score: '0-0',
  minute: 34,
  sparkline: [0.9, 0.85, 0.75, 0.7, 0.6, 0.5],
}

const BET_PREMATCH: BetEntry = {
  id: 'f3',
  match: 'Kasımpaşa - Başakşehir',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Kasımpaşa',
  odds: 3.40,
  sparkline: [0.4, 0.5, 0.45, 0.55, 0.6, 0.65],
}

/* ---- Shared parameters ---- */

const phoneFrame = {
  layout: 'fullscreen',
  backgrounds: {
    default: 'dark',
    values: [{ name: 'dark', value: '#101211' }],
  },
  viewport: { defaultViewport: 'mobile1' },
}

/* ---- Meta ---- */

const meta = {
  title: 'Sportsbook/FloatingBetslip',
  component: FloatingBetslip,
  parameters: {
    ...phoneFrame,
    docs: {
      description: {
        component: `
**FloatingBetslip** — Turkish market floating betslip with mini strip + full drawer.

- Mini strip anchored 58px above bottom nav, entrance slide-up animation
- Full drawer slides up (max 78% height), collapsible via drag handle
- Custom phone numpad — no system keyboard
- Quick-stake chips (₺25 / ₺50 / ₺100 / ₺200)
- Live badges with score + minute on each selection row
- Sparklines showing odds movement history
- Odds change flash indicators (▲ green / ▼ red)
- Suspended state: pulsing badge, locked CTA → "Remove suspended selections"
- Bet confirmation card with BLX-XXXXXX reference, auto-dismiss 2.8s
        `,
      },
    },
  },
  args: {
    currency: '₺',
    contained: true,
  },
  argTypes: {
    onRemoveBet: { action: 'removeBet' },
    onClearAll:  { action: 'clearAll' },
    onPlaceBet:  { action: 'placeBet' },
  },
  decorators: [
    (Story) => (
      <div style={{
        position: 'relative',
        width: 390,
        height: 700,
        background: 'var(--surface-page)',
        margin: '0 auto',
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
      }}>
        {/* Simulated bottom nav */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 58,
          background: 'var(--surface-layer-1)',
          borderTop: '1px solid var(--border-subtle)',
          zIndex: 1,
        }} />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloatingBetslip>

export default meta
type Story = StoryObj<typeof meta>

/* ---- Stories ---- */

export const MiniStripSingle: Story = {
  name: 'Mini strip — single selection',
  args: { bets: [BET_LIVE_1] },
}

export const MiniStripAcca: Story = {
  name: 'Mini strip — 3-fold accumulator',
  args: { bets: [BET_LIVE_1, BET_LIVE_2, BET_PREMATCH] },
}

export const MiniStripSuspended: Story = {
  name: 'Mini strip — suspended indicator',
  args: {
    bets: [BET_LIVE_1, { ...BET_LIVE_2, suspended: true }],
  },
}

export const TwoSelectionsLive: Story = {
  name: 'Double — 2 live selections (interactive)',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2])
    return (
      <FloatingBetslip
        {...args}
        bets={bets}
        onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
        onClearAll={() => setBets([])}
        onPlaceBet={async (stake) => console.log('stake:', stake)}
      />
    )
  },
  args: { bets: [] },
}

export const OddsUp: Story = {
  name: 'Odds moved — up (▲ flash)',
  args: {
    bets: [{ ...BET_LIVE_1, oddsDirection: 'up', originalOdds: 1.95 }],
  },
}

export const OddsDown: Story = {
  name: 'Odds moved — down (▼ flash)',
  args: {
    bets: [{ ...BET_LIVE_1, oddsDirection: 'down', originalOdds: 2.50 }],
  },
}

export const SuspendedState: Story = {
  name: 'Suspended — CTA locked (interactive)',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([
      BET_LIVE_1,
      { ...BET_LIVE_2, suspended: true },
      BET_PREMATCH,
    ])
    return (
      <FloatingBetslip
        {...args}
        bets={bets}
        onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
        onClearAll={() => setBets([])}
      />
    )
  },
  args: { bets: [] },
}

export const FullFlow: Story = {
  name: 'Full flow — interactive',
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    return (
      <FloatingBetslip
        {...args}
        bets={bets}
        onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
        onClearAll={() => setBets([])}
        onPlaceBet={async (stake) => {
          console.log('Bet placed, stake:', stake)
        }}
      />
    )
  },
  args: { bets: [] },
}
