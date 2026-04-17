# Betslip User Stories

Scope: FloatingBetslip (sole production component as of April 2026).
Status tags: ✅ Done · ⚠️ Partial · ❌ Missing · 🔲 Out of scope

---

## 1. Adding Selections

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 1.1 | As a user, I can see my betslip update immediately when I tap a market odds button | ✅ Done | Handled by parent page, betslip receives via props |
| 1.2 | As a user, I can see how many selections I have at a glance without opening the betslip | ✅ Done | MiniStrip badge shows count |
| 1.3 | As a user, I can see a preview of my selections and combined odds on the mini strip | ✅ Done | First 3 labels + "+N" overflow |
| 1.4 | As a user, I can see when the betslip first appears (smooth entrance animation) | ✅ Done | Slide-up + scale animation on first selection |

---

## 2. Viewing the Betslip

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 2.1 | As a user, I can open the full betslip by tapping the mini strip | ✅ Done | Tap anywhere on MiniStrip |
| 2.2 | As a user, I can see each selection's event name, market, and my chosen outcome | ✅ Done | BetEntryCard top/selection/market zones |
| 2.3 | As a user, I can see the current odds for each selection | ✅ Done | FloatingBetslip |
| 2.4 | As a user, I can see the combined/accumulator odds for multi-selection bets | ✅ Done | Header multiplier + MiniStrip |
| 2.5 | As a user, I can see which selections are live, including the current score and match minute | ✅ Done | FloatingBetslip |
| 2.6 | As a user, I can see the odds history trend for each selection via sparklines | ✅ Done | FloatingBetslip |
| 2.7 | As a user, I can see my betslip in a side panel on desktop | ✅ Done | FloatingBetslip `layout='desktop'` |
| 2.8 | As a user, I can see an empty state when my betslip has no selections | ✅ Done | FloatingBetslip (mobile + desktop) |
| 2.9 | As a user, I can switch between Single and Multiple bet modes | ✅ Done | FloatingBetslip mode toggle |

---

## 3. Managing Selections

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 3.1 | As a user, I can remove a single selection from my betslip | ✅ Done | ✕ button on each bet row |
| 3.2 | As a user, I can clear all selections at once | ✅ Done | Trash icon in header |
| 3.3 | As a user, I can see suspended selections highlighted without them being auto-removed | ✅ Done | "⏸ Suspended" badge, selection stays in slip |
| 3.4 | As a user, I can remove all suspended selections with a single tap | ✅ Done | CTA changes to "Remove suspended selections" |
| 3.5 | As a user, I can see a pulsing indicator on the mini strip when any selection is suspended | ✅ Done | Animated dot on MiniStrip |

---

## 4. Stake Input

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 4.1 | As a user, I can enter a stake amount using a custom numeric keypad (no system keyboard) | ✅ Done | Custom 3×4 numpad with Done key |
| 4.2 | As a user, I can close the numpad by tapping "Done" | ✅ Done | Full-width Done key |
| 4.3 | As a user, I can quickly set a stake using preset chips (e.g. ₺25, ₺50, ₺100) | ✅ Done | FloatingBetslip footer chips |
| 4.4 | As a user, I can set my stake to the maximum allowed using a "Max" button | ✅ Done | Requires `balance` prop |
| 4.5 | As a user, I can enter a stake per individual selection in Single mode | ✅ Done | FloatingBetslip single mode (2+ bets) |
| 4.6 | As a user, I can enter a single stake for the entire accumulator in Multiple mode | ✅ Done | FloatingBetslip multiple mode |

---

## 5. Potential Returns & Summary

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 5.1 | As a user, I can see my potential return before placing a bet | ✅ Done | Footer summary (stake × odds) |
| 5.2 | As a user, I can see the total stake across all bets | ✅ Done | Footer summary |
| 5.3 | As a user, I can see a boosted potential return when an Acca Boost bonus applies | ✅ Done | BonusTrackerBar + boosted return line |
| 5.4 | As a user, I can see my Acca Boost progression and how many more selections I need | ✅ Done | BonusTrackerBar with tier ticks |

---

## 6. Odds Changes

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 6.1 | As a user, I am visually alerted when odds change on any of my selections | ✅ Done | Flash animation (green ▲ / red ▼) on BetEntryCard |
| 6.2 | As a user, I can see a banner notification when odds have changed | ✅ Done | Dismissable "Odds changed" banner per entry |
| 6.3 | As a user, the Place Bet button prompts me to accept changed odds before placing | ✅ Done | CTA label: "Accept odds & place bet" |
| 6.4 | As a user, I can see the odds change direction reflected on the mini strip | ✅ Done | Mini strip odds flash green/red |

---

## 7. Placing the Bet

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 7.1 | As a logged-in user, I can place my bet with a single tap | ✅ Done | FloatingBetslip CTA |
| 7.2 | As a user, I can see a loading/processing state after tapping Place Bet | ✅ Done | Spinner + "Placing bet..." label |
| 7.3 | As a user, I receive a confirmation with a reference number and potential return after placing | ✅ Done | BetSummaryOverlay (BLX-XXXXXX), auto-dismiss 5s |
| 7.4 | As a user, the betslip resets automatically after successful placement | ✅ Done | Clears all selections after summary dismisses |
| 7.5 | As a user, I can see an error state if my bet fails, and I can retry | ✅ Done | Error badge, auto-reset, retry callback |
| 7.6 | As a guest/logged-out user, the Place Bet button is disabled and prompts me to log in | ✅ Done | `isLoggedIn` prop disables CTA + shows label |
| 7.7 | As a user, I cannot place a bet with no stake entered | ✅ Done | CTA disabled when stake = 0 |
| 7.8 | As a user, I cannot place a bet while suspended selections are still in my slip | ✅ Done | CTA locked until suspended are removed |
| 7.9 | As a user, I cannot place a bet when VAIX or Boost bets are mixed with regular bets | ✅ Done | Error banner in betslip + CTA disabled |

---

## 8. Navigation & Context

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 8.1 | As a user, I can navigate to "My Bets" to see previously placed bets | ✅ Done | Header icon + bet summary link |
| 8.2 | As a user, I can share my betslip with others | 🔲 Out of scope | |

---

## 9. Promotions & Bonuses

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 9.1 | As a user, I can select a free bet or bonus to apply to my stake | ❌ Missing | Not yet implemented in FloatingBetslip |
| 9.2 | As a user, I can see acca boost bonus tiers and track my progress | ✅ Done | BonusTrackerBar with progression |

---

## 10. Special Bet Types

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 10.1 | As a user, I can see a VAIX bet as a grouped entry showing all legs in one card | ✅ Done | VaixBetEntryCard with timeline + circle indicators |
| 10.2 | As a user, I can see a Boost bet rendered as a standard entry with boosted/original odds | ✅ Done | BetEntryCard with `originalOdds` strikethrough |
| 10.3 | As a user, I am prevented from mixing VAIX or Boost bets with regular bets | ✅ Done | Error banner in betslip, CTA disabled on conflict |
| 10.4 | As a user, I can resolve a mix conflict by removing the conflicting selections | ✅ Done | ✕ button on each entry clears the conflict |

---

## 11. Market-Specific & Localisation

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 11.1 | As a Turkish-market user, I can use the betslip in TRY (₺) with local quick-stake amounts | ✅ Done | `currency` prop + ₺25/50/100 chips |
| 11.2 | As a user, I can view odds in fractional format | ❌ Missing | FloatingBetslip is decimal only |

---

## Gaps Summary

| Priority | Story | Notes |
|----------|-------|-------|
| Medium | 9.1 — Free bet / bonus selector | Not yet in FloatingBetslip |
| Low | 11.2 — Fractional odds display | Decimal only currently |
