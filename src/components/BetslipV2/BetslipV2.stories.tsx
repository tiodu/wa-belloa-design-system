import type { Meta, StoryObj } from '@storybook/react'
import { BetslipV2 } from './BetslipV2'
import type { BetEntryV2 } from './types'
import '../../tokens/belloa.css'

const meta: Meta<typeof BetslipV2> = {
  title: 'Components/BetslipV2',
  component: BetslipV2,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#101211' }],
    },
  },
  args: {
    currency: '€',
  },
}
export default meta
type Story = StoryObj<typeof BetslipV2>

/* ---- Shared fixtures ---- */

const BET_1: BetEntryV2 = {
  id: 'b1',
  match: 'FC Midtjylland vs Nottingham Forest',
  league: 'UEFA Champions League',
  market: 'Full Time',
  selection: 'FC Midtjylland',
  odds: 2.95,
  fractionalOdds: '39/20',
}

const BET_2: BetEntryV2 = {
  id: 'b2',
  match: 'Liverpool vs Real Madrid',
  league: 'UEFA Champions League',
  market: 'Full Time',
  selection: 'Liverpool',
  odds: 1.95,
  badges: ['2UP'],
}

const BET_3: BetEntryV2 = {
  id: 'b3',
  match: 'Manchester City vs Bayern Munich',
  league: 'UEFA Champions League',
  market: 'Both Teams To Score',
  selection: 'Yes',
  odds: 1.75,
}

const BET_SUSPENDED: BetEntryV2 = {
  id: 'b4',
  match: 'Arsenal vs Atletico Madrid',
  league: 'UEFA Champions League',
  market: 'Full Time',
  selection: 'Arsenal',
  odds: 2.2,
  suspended: true,
}

/* ---- Stories ---- */

export const Empty: Story = {
  args: {
    bets: [],
  },
}

export const SingleBet: Story = {
  name: 'Single — 1 bet',
  args: {
    bets: [BET_1],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
}

export const SingleWithBadge: Story = {
  name: 'Single — 2UP promo badge',
  args: {
    bets: [BET_2],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
}

export const AccaDouble: Story = {
  name: 'Acca — Double (2 bets)',
  args: {
    bets: [BET_1, BET_2],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
}

export const AccaTreble: Story = {
  name: 'Acca — Treble (3 bets)',
  args: {
    bets: [BET_1, BET_2, BET_3],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
}

export const MultiplesTab: Story = {
  name: 'Multiples — Double + Singles',
  args: {
    bets: [BET_1, BET_2],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
  play: async ({ canvasElement: _c }) => {
    // Start on the Multiples tab
  },
}

export const WithSuspended: Story = {
  name: 'Suspended bet',
  args: {
    bets: [BET_1, BET_SUSPENDED],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
}

export const Interactive: Story = {
  name: 'Interactive (full)',
  args: {
    bets: [BET_1, BET_2, BET_3],
    onPlaceBet: async () => { await new Promise((r) => setTimeout(r, 1500)) },
    onRemoveBet: (id) => console.log('remove', id),
    onClearAll: () => console.log('clear all'),
  },
}
