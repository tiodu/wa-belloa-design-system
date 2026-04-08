# Belloa Sportsbook Widget — Project Context
> Read this file before writing any code. It contains operator constraints, market research,
> UX decisions, and design token references that must inform every component built.
>
> Extended references:
> - Design tokens & theming → [themes.md](themes.md)
> - Component inventory, competitive refs & scope → [betslip_components.md](betslip_components.md)

---

## 1. Operator Context

**Platform:** Belloa — WA Technology's white-label iGaming platform (multi-tenant)
**Active operator group:** Poligon (three brands: Betsat, Superbetin, Turkbet)
**Market:** Turkey — grey market (offshore, unlicensed from Turkish law perspective)
**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

### Grey market implications for UX
- **No persistent identity assumptions.** Domain rotation is frequent; users may re-register across sessions. Do not design flows that depend on rich account history being present.
- **High churn, fast decisions.** Every extra tap is a potential exit to a competitor. Friction = lost revenue.
- **Trust must be earned through the UI.** No regulatory badge legitimises the platform. Transparency in odds, confirmations, and payouts is a UX feature, not a legal one.
- **Payment friction is real.** Users are accustomed to deposits failing. Confirmation states and balance updates must be immediate and explicit.

---

## 2. Turkish Market Behaviour

### Live betting is primary — not secondary
- 47% of all sports bets globally are placed in-play (H2GC, 2024)
- During UCL peak events, live/in-play wagers reached 70%+ of total handle (DraftKings, April 2024)
- Live betting is the **dominant session type** for Turkish bettors, not a tab within pre-match
- **Design consequence:** Live is the default landing state. Pre-match is secondary. Do not treat live as a feature — treat it as the product.

### Football dominance
- Süper Lig is the primary betting surface — treat it as always present in live section
- UCL (especially Galatasaray/Fenerbahçe in European competition) drives peak traffic
- 1x2, BTTS, Over/Under 2.5, Next Goal, and Corners are the highest-volume markets in live football — this is the market pill order on event pages

### Device profile
- Mobile-first, mid-range Android dominates (Samsung A-series, budget devices)
- **Performance is a UX decision.** Heavy animations, large bundles, and layout reflows during live odds updates will cause lag and drop-offs on real user devices
- Keep animations functional, not decorative. CSS transitions over JS-driven animations where possible

### Demographics
- Core bettor: 21–35, male, sports-passionate, fast-decision maker
- Sports betting accounts for 55.6% of Turkish online gambling revenue (2024)
- 88.3% internet penetration — fully digital, mobile-first audience

---

## 3. UX Principles — Non-Negotiable

These decisions have been made and validated through competitive analysis. Do not deviate without explicit instruction.

### 3.1 Live-first information hierarchy
- Home screen defaults to Live tab — do not render pre-match as first content
- Live match cards are visually distinct from upcoming cards (red left border, live dot, score, minute)
- Live state must be visible at every level: home card, event header, and inside the betslip on each selection row

### 3.2 Floating betslip — never full-screen takeover
**This is the most critical structural decision.**
- Betslip exists in two states: **mini strip** (10–20% height, anchored above bottom nav) and **full drawer** (slides up from bottom, max 78% height)
- Mini strip must always show: selection count badge, selection label or "N-Fold Accumulator", combined odds, inline stake input
- Full drawer opens via tap on mini strip — never replaces the screen
- Closing the drawer returns to mini strip — never destroys the slip
- The event page (markets) must remain visible behind the full drawer (dimmed overlay, not navigated away)

### 3.3 Custom numpad for stake input
- Do not use the system keyboard for stake entry. It covers content and breaks the live context.
- Numpad is a 3×4 phone-style grid embedded within the betslip stake section
- Keys: 1–9, 0, decimal (.), backspace (⌫), and a full-width **Done ✓** confirm key
- Done key: full-width, accent colour (#c8f135), closes the numpad and returns focus to the Place Bet CTA
- Tapping Place Bet while numpad is open should fire the bet directly (no separate confirm step needed)

### 3.4 Live state on every betslip selection row (from Betby)
Each selection row in the betslip must show:
- Match name
- Live badge with current score and match minute (e.g. `1–0 · 67'`) — updates in real time
- Market name
- Selection label
- Current odds (with change indicator if price moved after adding)

### 3.5 Odds change indicators (from Betby)
- When an odds value changes after a selection is added to the slip, flash the value and show a ▲ or ▼ delta indicator
- Green (▲) = odds drifted up (better value for user), Red (▼) = odds shortened
- On market list buttons: flash the button background green or red when odds update (not just the number)

### 3.6 Sparklines on slip selections (from LiveScoreBet)
- Each slip row shows a small 6-bar sparkline of odds movement since the selection was added
- Last bar colour: green if odds moved up from original, red if moved down
- Communicates value and builds trust without requiring the user to check an external source

### 3.7 Accumulated odds in mini strip (from Novibet)
- Mini strip always shows the combined accumulator odds, not just the selection count
- For a single: shows that selection's odds
- For multiples: shows the running total multiplied odds (e.g. `6.05`)

### 3.8 Suspended market state — Belloa original (not solved by any competitor)
- When a live market suspends (common during goals, VAR, dangerous attacks), the UI must:
  - Show a pulsing SUSPENDED badge on the market row
  - Lock odds buttons (no tap, cursor: not-allowed, opacity reduced)
  - Flag suspended selections inside the betslip row with a `⏸ Market suspended` inline message
  - Change the Place Bet CTA to `⏸ Remove suspended selections` (amber state)
  - When market reopens, clear the suspended state non-destructively (selection remains in slip, badge disappears)
- **This is a differentiation opportunity.** No competitor handles this gracefully.

### 3.9 Quick stake chips
- Row of 4 preset amounts above the numpad: ₺25 / ₺50 / ₺100 / ₺200
- Tapping a chip sets the stake AND opens the numpad for adjustment
- Active chip is highlighted with accent border and background

### 3.10 Bet confirmation state
- After placement: show a confirmation card (not a modal — a card that slides up within the betslip area)
- Show: selection(s), stake, total odds, potential win, reference number (format: BLX-XXXXXX)
- Update balance in header immediately to reflect deducted stake
- Auto-dismiss after 2.8 seconds and reset the slip
