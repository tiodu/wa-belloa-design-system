import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { FloatingBetslip } from './FloatingBetslip'
import type { BetEntry, BonusTrackerConfig } from './types'
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
    onRemoveBet: () => {},
    onClearAll: () => {},
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
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => console.log('stake:', stake)}
        />
      </MemoryRouter>
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
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
        />
      </MemoryRouter>
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
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => {
            console.log('Bet placed, stake:', stake)
          }}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

/* ══════════════════════════════════════════════════════════════════
   ADDITIONAL FIXTURES
   ══════════════════════════════════════════════════════════════════ */

const BET_PREMATCH_2: BetEntry = {
  id: 'f4',
  match: 'Antalyaspor - Alanyaspor',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Beraberlik',
  odds: 3.10,
  sparkline: [0.5, 0.52, 0.48, 0.53, 0.49, 0.51],
}

const BET_PREMATCH_3: BetEntry = {
  id: 'f5',
  match: 'Sivasspor - Konyaspor',
  league: 'Süper Lig',
  market: 'Üst/Alt 2.5',
  selection: 'Alt',
  odds: 1.75,
  sparkline: [0.6, 0.65, 0.62, 0.68, 0.7, 0.72],
}

const BET_LIVE_3: BetEntry = {
  id: 'f6',
  match: 'Fenerbahçe - Galatasaray',
  league: 'Süper Lig',
  market: 'İlk Yarı Sonucu',
  selection: 'Fenerbahçe',
  odds: 2.80,
  isLive: true,
  score: '0-1',
  minute: 42,
  sparkline: [0.3, 0.35, 0.4, 0.38, 0.45, 0.5],
}

const BET_PREMATCH_4: BetEntry = {
  id: 'f7',
  match: 'Rizespor - Samsunspor',
  league: 'Süper Lig',
  market: 'Maç Sonucu',
  selection: 'Samsunspor',
  odds: 2.20,
  sparkline: [0.45, 0.5, 0.48, 0.52, 0.55, 0.58],
}

const BET_PREMATCH_5: BetEntry = {
  id: 'f8',
  match: 'Kayserispor - Hatayspor',
  league: 'Süper Lig',
  market: 'Karşılıklı Gol',
  selection: 'Evet',
  odds: 1.65,
  sparkline: [0.55, 0.58, 0.6, 0.62, 0.65, 0.68],
}

const BET_LONG_NAMES: BetEntry = {
  id: 'f9',
  match: 'Büyükşehir Belediye Erzurumspor - Altınordu FK',
  league: 'TFF 1. Lig',
  market: 'Toplam Gol Sayısı Üst/Alt',
  selection: 'Üst 3.5 Gol',
  odds: 4.20,
  sparkline: [0.2, 0.25, 0.3, 0.28, 0.35, 0.4],
}

const ACCA_BOOST_CONFIG: BonusTrackerConfig = {
  label: 'Acca Boost',
  minOdds: 1.3,
  thresholds: [
    { selections: 3, percent: 5 },
    { selections: 5, percent: 10 },
    { selections: 8, percent: 20 },
  ],
}

/* ══════════════════════════════════════════════════════════════════
   HIGH PRIORITY — Core User Flows
   ══════════════════════════════════════════════════════════════════ */

/* ── Desktop layout ─────────────────────────────────────────────── */

export const DesktopEmpty: Story = {
  name: 'Desktop — empty slip',
  parameters: {
    docs: {
      description: {
        story:
          'Desktop static panel with no selections. Shows Single/Acca/Multiples tabs, empty-state icon, and a disabled Place bet CTA.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--surface-page)',
        display: 'flex',
        alignItems: 'stretch',
      }}>
        <Story />
      </div>
    ),
  ],
  args: {
    bets: [],
    layout: 'desktop',
    contained: false,
  },
}

export const DesktopWithBets: Story = {
  name: 'Desktop — with selections (interactive)',
  parameters: {
    docs: {
      description: {
        story:
          'Desktop static panel showing the betslip with 3 selections. No drag handle or scrim — the panel is always visible. Tap a chip or the Stake field to enter a stake.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => console.log('stake:', stake)}
        />
      </MemoryRouter>
    )
  },
  args: {
    bets: [],
    layout: 'desktop',
    contained: false,
  },
}

/* ── Placement flow ─────────────────────────────────────────────── */

export const PlacementFlow: Story = {
  name: 'Placement — loading → summary (interactive)',
  parameters: {
    docs: {
      description: {
        story: `
**Steps to observe both placement states:**
1. Tap the mini strip to open the drawer
2. Tap **₺50** chip to set a stake
3. Tap **Place Bet** — observe the 1 s loading spinner
4. After ~1 s the confirmation card appears (auto-dismisses after 5 s)

Covers: \`betPlacementStage = 'loading'\` and \`betPlacementStage = 'summary'\`.
        `,
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => console.log('placed stake:', stake)}
          onOpenMyBets={() => console.log('navigate → My Bets')}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

export const PlacementFlowPreOpened: Story = {
  name: 'Placement — drawer pre-opened, ready to place',
  parameters: {
    docs: {
      description: {
        story:
          'Drawer is already open via `openSignal`. Tap **₺50**, then **Place Bet** to trigger loading → summary in 2 taps.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => console.log('placed stake:', stake)}
          onOpenMyBets={() => console.log('navigate → My Bets')}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

/* ── Acca Boost tracker ─────────────────────────────────────────── */

export const AccaBoostUnqualified: Story = {
  name: 'Acca Boost — unqualified (add 2 more)',
  parameters: {
    docs: {
      description: {
        story:
          'Bonus tracker shown with 1 selection — no tier met yet. The tracker reads "Add 2 more" toward the 3-fold 5% tier.',
      },
    },
  },
  args: {
    bets: [BET_LIVE_1],
    openSignal: 1,
    bonusTracker: ACCA_BOOST_CONFIG,
  },
}

export const AccaBoostMidTier: Story = {
  name: 'Acca Boost — mid tier (5% active, 5-fold next)',
  parameters: {
    docs: {
      description: {
        story:
          '3 selections meet the first threshold (5%). Progress bar fills to first tick; "5% ★" badge shown. Add 2 more to reach 10%.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          bonusTracker={ACCA_BOOST_CONFIG}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

export const AccaBoostMaxTier: Story = {
  name: 'Acca Boost — max tier (20% active)',
  parameters: {
    docs: {
      description: {
        story:
          '8 selections — maximum boost tier reached (20%). Progress bar is full, "20% ★" badge shown. No further prompt.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([
      BET_LIVE_1,
      BET_LIVE_2,
      BET_PREMATCH,
      BET_PREMATCH_2,
      BET_PREMATCH_3,
      BET_LIVE_3,
      BET_PREMATCH_4,
      BET_PREMATCH_5,
    ])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          bonusTracker={ACCA_BOOST_CONFIG}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

export const AccaBoostBoostedReturn: Story = {
  name: 'Acca Boost — boosted return line (interactive)',
  parameters: {
    docs: {
      description: {
        story:
          '5 selections at 10% boost tier. Enter a stake to see the **Boosted Return** line in the summary footer alongside the standard Potential Win.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([
      BET_LIVE_1,
      BET_LIVE_2,
      BET_PREMATCH,
      BET_PREMATCH_2,
      BET_PREMATCH_3,
    ])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          bonusTracker={ACCA_BOOST_CONFIG}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

/* ── Single mode per-entry stakes ───────────────────────────────── */

export const SingleModeMultipleBets: Story = {
  name: 'Single mode — per-entry stake inputs (interactive)',
  parameters: {
    docs: {
      description: {
        story:
          'Three selections with the **Single** tab active. Each BetEntryCard has its own "Stake" button in its footer. Tapping any entry\'s stake button opens the numpad and targets that specific selection.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => console.log('total stake:', stake)}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
  play: async ({ canvasElement: _c }) => {
    // Note: After the drawer opens, click the "Single" tab to enter single mode.
    // Each entry will show a per-entry "Stake" button in its card footer.
  },
}

/* ── Accept odds CTA ────────────────────────────────────────────── */

export const AcceptOddsCTANoStake: Story = {
  name: 'Accept odds CTA — no stake (static label)',
  parameters: {
    docs: {
      description: {
        story:
          'When one or more selections have `oddsDirection` set and no stake has been entered, the CTA reads **"Accept odds & place bet"** instead of "Place Bet". Enter a stake to see the label update with the stake amount.',
      },
    },
  },
  args: {
    bets: [
      { ...BET_LIVE_1, oddsDirection: 'up', originalOdds: 1.95 },
      { ...BET_LIVE_2, oddsDirection: 'down', originalOdds: 2.10 },
      BET_PREMATCH,
    ],
    openSignal: 1,
  },
}

export const AcceptOddsCTAWithStake: Story = {
  name: 'Accept odds CTA — with stake (full label, interactive)',
  parameters: {
    docs: {
      description: {
        story:
          'Odds changed on two selections. Tap **₺50** to set a stake — the CTA updates to **"Accept odds & place bet — ₺50.00"**. This is the full label variant.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([
      { ...BET_LIVE_1, oddsDirection: 'up', originalOdds: 1.95 },
      { ...BET_LIVE_2, oddsDirection: 'down', originalOdds: 2.10 },
      BET_PREMATCH,
    ])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onPlaceBet={async (stake) => console.log('stake:', stake)}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

/* ══════════════════════════════════════════════════════════════════
   MEDIUM PRIORITY — Important Variants
   ══════════════════════════════════════════════════════════════════ */

/* ── Suspended ──────────────────────────────────────────────────── */

export const MultipleSuspended: Story = {
  name: 'Suspended — multiple selections locked (interactive)',
  parameters: {
    docs: {
      description: {
        story:
          'Two of three selections are suspended. CTA reads **"⏸ Remove suspended selections"**. Tapping the CTA removes both suspended entries simultaneously via `onRemoveBet`.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([
      { ...BET_LIVE_1, suspended: true },
      { ...BET_LIVE_2, suspended: true },
      BET_PREMATCH,
    ])
    return (
      <MemoryRouter>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

export const AllSuspended: Story = {
  name: 'Suspended — all selections locked',
  parameters: {
    docs: {
      description: {
        story:
          'Every selection is suspended. Betslip is fully locked. The mini strip shows the pulsing suspended indicator dot.',
      },
    },
  },
  args: {
    bets: [
      { ...BET_LIVE_1, suspended: true },
      { ...BET_LIVE_2, suspended: true },
      { ...BET_PREMATCH, suspended: true },
    ],
    openSignal: 1,
  },
}

/* ── openSignal external trigger ───────────────────────────────── */

export const OpenViaSignal: Story = {
  name: 'openSignal — external drawer trigger',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the `openSignal` prop. The counter button lives outside the betslip component. Each click increments the signal and re-opens the drawer — even if it was manually closed.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [signal, setSignal] = useState<number | undefined>(undefined)
    return (
      <MemoryRouter>
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 20 }}>
          <button
            type="button"
            style={{
              background: 'var(--color-brand-teal)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => setSignal((n) => (n ?? 0) + 1)}
          >
            Open betslip (signal: {signal ?? 0})
          </button>
        </div>
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={signal}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

/* ── My Bets navigation ─────────────────────────────────────────── */

export const MyBetsNavigation: Story = {
  name: 'My Bets — onOpenMyBets navigation callback',
  parameters: {
    docs: {
      description: {
        story:
          'When `onOpenMyBets` is provided, clicking the clipboard icon in the header or the "My Bets" link in the placement summary calls the callback instead of navigating. A panel below simulates the target view.',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [bets, setBets] = useState<BetEntry[]>([BET_LIVE_1, BET_LIVE_2, BET_PREMATCH])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [navigated, setNavigated] = useState(false)
    return (
      <MemoryRouter>
        {navigated && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 30, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface-page)', gap: 12,
          }}>
            <span style={{ fontSize: 32 }}>📋</span>
            <p style={{ color: 'var(--color-text-primary)', fontSize: 16, fontWeight: 600, margin: 0 }}>
              My Bets
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: 0 }}>
              (navigated via onOpenMyBets callback)
            </p>
            <button
              type="button"
              style={{ marginTop: 8, padding: '6px 16px', borderRadius: 8, background: 'var(--color-brand-teal)', color: '#fff', border: 'none', cursor: 'pointer' }}
              onClick={() => setNavigated(false)}
            >
              ← Back
            </button>
          </div>
        )}
        <FloatingBetslip
          {...args}
          bets={bets}
          openSignal={1}
          onRemoveBet={(id) => setBets((prev) => prev.filter((b) => b.id !== id))}
          onClearAll={() => setBets([])}
          onOpenMyBets={() => setNavigated(true)}
        />
      </MemoryRouter>
    )
  },
  args: { bets: [] },
}

/* ── Figma theme variant ────────────────────────────────────────── */

/* ── Mixed live + pre-match ─────────────────────────────────────── */

export const MixedLivePrematch: Story = {
  name: 'Mixed — live + pre-match selections',
  parameters: {
    docs: {
      description: {
        story:
          'Betslip containing both live selections (with score, minute, sparkline) and pre-match selections (no live metadata). Tests that row rendering handles both variants side-by-side.',
      },
    },
  },
  args: {
    bets: [BET_LIVE_1, BET_PREMATCH, BET_LIVE_2, BET_PREMATCH_2],
    openSignal: 1,
  },
}

/* ── Single entry (1 selection) ─────────────────────────────────── */

export const SingleBetEntry: Story = {
  name: 'Single bet — 1 selection (footer stake field active)',
  parameters: {
    docs: {
      description: {
        story:
          'Only one selection in the slip. `betMode` is locked to "single". The footer shows the standard chip row + stake field (not per-entry buttons). The Multiple tab is disabled.',
      },
    },
  },
  args: {
    bets: [BET_LIVE_1],
    openSignal: 1,
  },
}

/* ══════════════════════════════════════════════════════════════════
   LOW PRIORITY — Edge Cases
   ══════════════════════════════════════════════════════════════════ */

export const LongSelectionNames: Story = {
  name: 'Edge case — long match & selection names',
  parameters: {
    docs: {
      description: {
        story:
          'Tests text truncation for very long match names, league names, market labels, and selection names across both mini strip and full drawer.',
      },
    },
  },
  args: {
    bets: [BET_LONG_NAMES, BET_LIVE_1],
    openSignal: 1,
  },
}

export const EuroCurrency: Story = {
  name: 'Edge case — Euro currency symbol',
  parameters: {
    docs: {
      description: {
        story:
          'Swap `currency` to "€". All monetary values — chips, stake field, potential win — should render with the Euro symbol.',
      },
    },
  },
  args: {
    bets: [BET_LIVE_1, BET_LIVE_2, BET_PREMATCH],
    currency: '€',
    openSignal: 1,
  },
}

export const ContainedPositioning: Story = {
  name: 'Edge case — contained=false (fixed positioning)',
  parameters: {
    docs: {
      description: {
        story:
          '`contained=false` switches the overlay and drawer from `position:absolute` (clipped by frame) to `position:fixed` (covers full viewport). In this story the drawer will overlay the entire Storybook canvas.',
      },
    },
  },
  args: {
    bets: [BET_LIVE_1, BET_LIVE_2],
    contained: false,
    openSignal: 1,
  },
}
