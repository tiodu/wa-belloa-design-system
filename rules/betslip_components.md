# Belloa Betslip — Components, Competitive Refs & Scope

> Part of the Belloa Sportsbook context. See also: [BELLOA_SPORTSBOOK_CONTEXT.md](BELLOA_SPORTSBOOK_CONTEXT.md)

---

## 5. Component Inventory (built and validated)

The following components have been designed and prototyped. Build new work as extensions of these patterns.

### 5.1 Match Card (live)
- Red left border (3px, `--color-live`)
- Live dot (pulsing ring animation) + `LIVE` label + match minute
- Score box (centre, `--font-mono`, bold)
- 1x2 odds row at bottom
- On tap: navigates to event page

### 5.2 Match Card (upcoming)
- No live border — uniform `--color-border`
- Kick-off time (top right, `--font-mono`)
- Team names + "vs" separator
- 1x2 odds row

### 5.3 Event Page
- Match header: league, live state, score, team names, progress bar (match minute / 90)
- Market pill tabs ordered for live priority: **Main → Next Goal → Corners → Player**
- Market rows: name, optional SUSPENDED badge, odds buttons row
- Floating betslip persistent over this view

### 5.4 Floating Betslip (mini)
- Anchored: `position: fixed, bottom: 58px` (above bottom nav)
- Left: count badge (accent) + selection label + combined odds
- Right: inline stake input (readonly, opens full slip on tap) + ↑ arrow
- Entrance animation: slide up + scale from 0.97

### 5.5 Floating Betslip (full drawer)
- Slides up from bottom, max-height 78vh
- Drag handle at top (tap to collapse)
- Header: "Betslip (N)" + "Clear all"
- Acca tag (when >1 selection): "N-Fold Accumulator" + total odds
- Selection rows (see section 3.4 in BELLOA_SPORTSBOOK_CONTEXT.md)
- Stake section: quick chips → stake display → numpad (when open) → summary → CTA
- CTA states: idle (no stake), ready (stake entered), suspended (has suspended selection)

### 5.6 Phone Numpad
- Grid: 3 columns, 4 rows
- Row 1–3: digits 1–9
- Row 4: `.` | `0` | `⌫`
- Row 5 (full width): `✓ Done` — accent background, closes numpad
- Key size: minimum 44px height for touch targets

---

## 6. What Claude Code Should Ask Before Building (`ask_user_question`)

Before starting any new component or screen, ask:

1. **Which component or screen is being built?** (home, event page, betslip, specific state)
2. **Is this a new isolated component or integration into an existing Belloa file?** (affects import paths and token usage)
3. **Which Poligon brand is the target?** (Betsat / Superbetin / Turkbet — affects theme override layer on top of base tokens)
4. **Should the output be pushed to Figma via html.to.design after building?**
5. **Mobile-only or responsive?** (default: mobile-first 390px, no desktop breakpoints unless asked)

---

## 7. Competitive Reference Summary

| Feature | Source | Priority |
|---|---|---|
| Live score + minute on slip row | Betby | Must have |
| Odds change flash + delta indicator | Betby | Must have |
| Custom phone numpad with Done key | LiveScoreBet | Must have |
| Accumulated odds in mini strip | Novibet | Must have |
| Suspended state in slip (non-destructive) | Belloa original | Must have |
| Sparklines on slip rows | LiveScoreBet | High |
| Quick stake chips | Novibet / LiveScoreBet | High |
| Quickbet (one-tap stake for repeat bettors) | Betby | Consider |
| Max bet button | Betby | Consider |
| Per-selection single/multiple toggle | Novibet | Lower priority |
| Bet share | Novibet | Lower priority |

---

## 8. Out of Scope (do not build unless explicitly asked)

- Casino / slots surfaces
- Desktop / tablet layouts
- Registration / KYC flows
- Payment deposit / withdrawal flows
- RTL (Arabic) layout — Turkish is LTR
- Dark/light theme toggle — Belloa dark only for Poligon
