# My Bets User Stories

Scope: MyBetsPage mobile (FloatingBetslip navigates here via `/my-bets`).
Status tags: ✅ Done · ⚠️ Partial · ❌ Missing · 🔲 Out of scope

---

## 1. Tab Navigation

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 1.1 | As a user, I can see four tabs: Open, Cash Out, Live, Settled | ✅ Done | Pill tab bar, accent active state |
| 1.2 | As a user, tapping a tab immediately filters the bet list | ✅ Done | Client-side filter by status/isLive/cashOutValue |
| 1.3 | As a user, I can see the Open tab shows all in-play bets (including live) | ✅ Done | Filters status === 'open' |
| 1.4 | As a user, I can see the Cash Out tab shows only bets with a live cash out value | ✅ Done | Filters open bets with cashOutValue set |
| 1.5 | As a user, I can see the Live tab shows only in-play bets on live events | ✅ Done | Filters open + isLive bets |
| 1.6 | As a user, I can see the Settled tab shows bets from the last 7 days | ✅ Done | Filters won/lost/void/cashedout bets |

---

## 2. Bet Card Display

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 2.1 | As a user, I can see the bet type label (Single, Double, Treble, N-Fold Acca, Bet Builder) | ✅ Done | MyBetCard header |
| 2.2 | As a user, I can see the stake and combined odds for each bet | ✅ Done | Header row with accent stake + odds |
| 2.3 | As a user, I can see multi-leg bets displayed as a connected timeline (like VAIX entries) | ✅ Done | Circle + connector timeline in MyBetCard |
| 2.4 | As a user, I can see each leg's selection name and market | ✅ Done | legSelection + legMarket per leg |
| 2.5 | As a user, single-leg bets show the selection and market inline (no timeline) | ✅ Done | Single-leg branch skips timeline |
| 2.6 | As a user, I can see the event name and kickoff date on each card | ✅ Done | eventRow with name + date |
| 2.7 | As a user, I can see the stake and potential/actual return at the bottom of each card | ✅ Done | stakeReturnRow |
| 2.8 | As a user, I can see boosted odds (strikethrough original → new odds) on eligible bets | ✅ Done | originalOdds prop on MyBetCard header |
| 2.9 | As a user, I can see a LIVE badge on bets with events currently in play | ✅ Done | Red pulsing LIVE badge |

---

## 3. Cash Out

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 3.1 | As a user, I can see a "Cash Out ₺X.XX" button on eligible bets in the Open tab | ✅ Done | Full-width teal cashOutBtn |
| 3.2 | As a user, tapping Cash Out settles the bet immediately at the cash out value | ✅ Done | Status → 'cashedout', actualReturn set |
| 3.3 | As a user, the Cash Out tab lets me find eligible bets without scrolling all Open bets | ✅ Done | Filtered view: open + cashOutValue set |
| 3.4 | As a user, after cashing out a bet, it moves to the Settled tab as "Cashed Out" | ✅ Done | Status badge + moves to settled filter |

---

## 4. Bet Statuses

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 4.1 | As a user, open bets show no status badge (clean) | ✅ Done | status === 'open' renders no badge |
| 4.2 | As a user, won bets show a green "Won" badge | ✅ Done | status_won: success-fg background |
| 4.3 | As a user, lost bets show a red "Lost" badge | ✅ Done | status_lost: critical-fg background |
| 4.4 | As a user, void bets show a grey "Void" badge | ✅ Done | status_void: action-neutral background |
| 4.5 | As a user, cashed-out bets show a yellow "Cashed Out" badge | ✅ Done | status_cashedout: warning-fg background |
| 4.6 | As a user, won bets show the actual returned amount in green | ✅ Done | returnWon class on stakeReturnValue |
| 4.7 | As a user, individual legs on multi-leg bets show per-leg result via circle colour | ✅ Done | circle_won/lost/void/pending CSS variants |

---

## 5. Settled Tab & Bet History

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 5.1 | As a user, the Settled tab shows bets settled in the last 3–7 days | ✅ Done | won/lost/void/cashedout filter |
| 5.2 | As a user, I can see a "View Bet History" CTA at the bottom of the Settled tab | ✅ Done | historyBtnInline (outlined, accent colour) |
| 5.3 | As a user, "View Bet History" navigates to a dedicated history section | ❌ Missing | Placeholder only — Bet History page not yet built |
| 5.4 | As a user, I can search or filter bet history by date, event, or outcome | ❌ Missing | Future Bet History page feature |

---

## 6. Empty States

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 6.1 | As a user, each tab shows a contextual empty state when no bets match | ✅ Done | emptyState with icon + tab-specific subtitle |
| 6.2 | As a user, the Settled empty state also shows the "View Bet History" CTA | ✅ Done | historyBtn rendered inside emptyState |

---

## 7. Page Chrome

| # | Story | Status | Notes |
|---|-------|--------|-------|
| 7.1 | As a user, the page shows a logged-in header with balance and deposit button | ✅ Done | Matches CasinoLobbyPage header pattern |
| 7.2 | As a user, the bottom nav shows "My Bets" as the active tab | ✅ Done | bottomNavItemActive on My Bets item |
| 7.3 | As a developer/designer, I can manipulate bet state via the controls panel | ✅ Done | Active tab + Bet data filter chips above phone frame |

---

## Gaps Summary

| Priority | Story | Notes |
|----------|-------|-------|
| High | 5.3 — Bet History page | Dedicated page needed for history search/filter |
| Medium | 5.4 — Search/filter in history | Date, event, outcome filters |
| Low | Partial cash out | Ability to cash out a portion (not full amount) |
| Low | Edit/add to bet | Acca edit functionality post-placement |
