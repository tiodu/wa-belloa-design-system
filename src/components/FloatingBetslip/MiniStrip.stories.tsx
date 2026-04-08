import type { Meta, StoryObj } from '@storybook/react'
import { MiniStrip } from './MiniStrip'
import type { BetEntry } from './types'
import '../../tokens/belloa.css'

const meta: Meta<typeof MiniStrip> = {
  title: 'Components/FloatingBetslip/MiniStrip',
  component: MiniStrip,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101211' }],
    },
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        component:
          'Floating mini strip anchored 58px above the bottom nav. Tap anywhere to open the full drawer. Mobile-only (390px), Belloa Default theme.',
      },
    },
  },
  args: {
    currency: '₺',
    onOpen: () => console.log('open drawer'),
  },
}
export default meta
type Story = StoryObj<typeof MiniStrip>

/* ---- Fixtures ---- */

const BET_1: BetEntry = {
  id: 'b1',
  match: 'Galatasaray - Fenerbahçe',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Galatasaray',
  odds: 2.15,
}

const BET_2: BetEntry = {
  id: 'b2',
  match: 'Beşiktaş - Trabzonspor',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Beşiktaş',
  odds: 1.85,
}

const BET_3: BetEntry = {
  id: 'b3',
  match: 'Kasımpaşa - Başakşehir',
  league: 'Süper Lig',
  market: 'İY/MS',
  selection: 'Kasımpaşa / Kasımpaşa',
  odds: 3.4,
}

/* ---- Stories ---- */

export const Single: Story = {
  name: 'Single selection',
  args: { bets: [BET_1] },
}

export const SingleWithStake: Story = {
  name: 'Single — stake entered',
  args: { bets: [BET_1], stake: 50 },
}

export const Double: Story = {
  name: 'Double (2-fold)',
  args: { bets: [BET_1, BET_2] },
}

export const Treble: Story = {
  name: 'Treble (3-fold)',
  args: { bets: [BET_1, BET_2, BET_3], stake: 100 },
}

export const OddsUp: Story = {
  name: 'Odds moved — up',
  args: {
    bets: [{ ...BET_1, originalOdds: 2.0, oddsDirection: 'up' }],
  },
}

export const OddsDown: Story = {
  name: 'Odds moved — down',
  args: {
    bets: [{ ...BET_1, originalOdds: 2.5, oddsDirection: 'down' }],
  },
}

export const WithSuspended: Story = {
  name: 'Has suspended selection',
  args: {
    bets: [BET_1, { ...BET_2, suspended: true }, BET_3],
  },
}

export const LongLabel: Story = {
  name: 'Long selection name (truncates)',
  args: {
    bets: [
      {
        ...BET_1,
        selection: 'Fenerbahçe Spor Kulübü Kazanır — İlk Yarı ve Maç Geneli',
      },
    ],
  },
}
