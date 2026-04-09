# Belloa Betslip Entry Variations

This document defines the supported bet slip entry variations and the content model used in the `SportsbookVisualiser` coverage matrix.

## Entry Model

Each bet slip entry is organized in three content zones:

1. **Top zone**: event context (teams/players) plus optional live metadata.
2. **Selection zone**: odds plus selected outcome.
3. **Market zone**: canonical market label (with optional scope such as full time, set, or map).

### Field Specification

- `id`: unique entry variant identifier.
- `title`: human-readable scenario name.
- `state`: one of `Live`, `Pre-match`, `Suspended`.
- `topMeta` (optional): compact live context, for example score and clock.
- `topPrimary`: main event line (teams or players).
- `topSecondary` (optional): secondary live context line.
- `odds`: decimal odds, or suspended indicator when unavailable.
- `selection`: user-selected outcome (team, player, line, combo, etc.).
- `market`: market name.

### Fallback Rules

- Preserve **odds visibility** first.
- Preserve **selection text** second.
- Allow **market text wrapping** after the above priorities.

## Coverage Matrix

| Scenario | Top Zone | Selection Zone | Market Zone |
|---|---|---|---|
| Football live 1x2 | Score + clock (1-0 · 67') with match line | Decimal odds + team selection | Match Result · Full Time |
| Football pre-match totals | Match line only | Odds + Over/Under line | Total Goals · Full Time |
| Player card market | Match line + optional live status | Odds + player name | Player to Be Carded |
| Tennis live detailed | Line 1 players, line 2 set/game context | Odds + player/set selection | Set Winner or Game Handicap |
| Basketball live | Qx + game clock + score | Odds + side/total pick | Moneyline or Total Points |
| Esports map market | Teams + map/round state | Odds + team/map outcome | Map Winner · Map 2 |
| Suspended selection | Context unchanged | Suspended label replaces odds | Keep market label visible |
| Long names stress test | Ellipsis on line 1, preserve key live metadata | Odds never truncate, selection may ellipsize | Wrap to max 2 lines |

## Sport-Specific Visual Impact

Different sports change the information density and emphasis of each betslip entry. The layout remains the same, but content priority shifts by sport.

| Sport | Top Zone Visual Impact | Selection Zone Visual Impact | Market Zone Visual Impact |
|---|---|---|---|
| Football | Uses score + minute for live (`1-0 · 67'`) or single match line pre-match; usually compact. | Team pick or totals line is short and readable; odds remain primary anchor. | Common labels (`Match Result`, `Total Goals`) are short and stable. |
| Tennis | Needs an additional context line for set/game state (`2nd Set · 0-1 · 2-2 AD:40`), increasing vertical space. | Selection often includes set context (`to win Set 2`), longer than football team picks. | Labels like `Set Winner` stay concise, but scope changes often (set/game). |
| Basketball | Quarter + clock + score (`Q3 · 04:21 · 74-71`) creates dense live metadata on top zone. | Total/side picks are medium length; numeric lines (for totals) are common. | `Total Points` / `Moneyline` remain compact and easy to scan. |
| Esports | Top zone includes map/round context, which can be volatile and update frequently. | Selections may include map-specific outcomes and longer team names. | Market labels often include map scope (`Map Winner · Map 2`), increasing width demand. |
| Player Props (cross-sport) | Top zone usually mirrors core match context; no major structural change. | Selection includes player name, which can be long and should ellipsize before odds. | Labels like `Player to Be Carded` are long and should allow wrapping. |

### Design Implications

- Keep the 3-zone structure fixed across sports to preserve scanning muscle memory.
- Allow optional `topSecondary` for sports with richer live states (tennis, basketball, esports).
- Protect odds from truncation in all sports and let selection text ellipsize first.
- Permit market labels to wrap (up to 2 lines) for long prop and scoped map markets.

## Current Mock Variants

### V1 — Football Live Team Pick

- `state`: `Live`
- `topMeta`: `1-0 · 67'`
- `topPrimary`: `Arsenal - Manchester City`
- `odds`: `2.15`
- `selection`: `Arsenal`
- `market`: `Match Result`

### V2 — Football Pre-match Totals

- `state`: `Pre-match`
- `topPrimary`: `Barcelona - Real Madrid`
- `odds`: `1.92`
- `selection`: `Over 2.5`
- `market`: `Total Goals`

### V3 — Tennis Live Detailed Context

- `state`: `Live`
- `topPrimary`: `Nadal vs Alcaraz`
- `topSecondary`: `2nd Set · 0-1 · 2-2 AD:40`
- `odds`: `1.78`
- `selection`: `Alcaraz to win Set 2`
- `market`: `Set Winner`

### V4 — Player Card Market

- `state`: `Live`
- `topMeta`: `0-0 · 34'`
- `topPrimary`: `Liverpool - Chelsea`
- `odds`: `3.40`
- `selection`: `Declan Rice`
- `market`: `Player to Be Carded`

### V5 — Basketball Live

- `state`: `Live`
- `topPrimary`: `Lakers - Celtics`
- `topSecondary`: `Q3 · 04:21 · 74-71`
- `odds`: `1.84`
- `selection`: `Over 164.5`
- `market`: `Total Points`

### V6 — Suspended Example

- `state`: `Suspended`
- `topMeta`: `2-1 · 88'`
- `topPrimary`: `Tottenham - Manchester United`
- `odds`: `⏸`
- `selection`: `Suspended`
- `market`: `Match Result`
