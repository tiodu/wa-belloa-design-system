# Belloa Design Tokens & Brand Theming

> Part of the Belloa Sportsbook context. See also: [BELLOA_SPORTSBOOK_CONTEXT.md](BELLOA_SPORTSBOOK_CONTEXT.md)

**Token source:** WA Design System Foundation — exported from Figma as W3C Design Token format
**Token file location:** `src/tokens/` — one JSON per brand mode
**CSS variable convention:** `var(--token-name)` in all components. Never hardcode hex values.
**Theme switching:** Apply brand tokens by swapping a `data-theme` attribute on `<body>` or a root wrapper. Each brand overrides the same semantic variable names.

---

## 4.1 Semantic token schema

Every brand exposes the same token names. Components only reference semantic names — never brand-specific primitives.

```
surface/page          → base page background
surface/layer-1       → card / panel (first elevation)
surface/layer-2       → floating elements (modals, drawers)
surface/overlay       → scrim behind drawers
surface/accent        → brand-tinted background area

content/primary       → primary text & icons
content/secondary     → secondary labels, metadata
content/subtle        → placeholders, disabled, decorative
content/accent        → interactive accent (links, active states, odds values)
content/on-action     → text on top of action/CTA backgrounds
content/inverse       → text on inverted surfaces (tooltips)

action/primary        → CTA button background (Place Bet, etc.)
action/secondary      → secondary action background
action/neutral        → neutral chip / ghost button
action/disabled       → disabled state background

border/default        → standard card/component border
border/subtle         → low-emphasis divider
border/active         → selected / toggled-on border
border/accent         → brand-highlighted container border
border/focus          → keyboard focus ring

state/layer-hover     → hover overlay on interactive elements
state/layer-pressed   → press/active overlay

brand/gd-start        → brand gradient start (logo, hero elements)
brand/gd-end          → brand gradient end

live/gd-start         → live badge gradient start (#E5484D across all brands)
live/gd-end           → live badge gradient end

status/critical-foreground  → error text/icon
status/critical-background  → error container fill
status/success-foreground   → success text/icon
status/success-background   → success container fill
status/warning-foreground   → warning text/icon
status/warning-background   → warning container fill
```

---

## 4.2 Brand token values

### Belloa Default (dark teal — base platform theme)
```css
[data-theme="belloa-default"] {
  --surface-page:        #101211;
  --surface-layer-1:     #171918;
  --surface-layer-2:     #202221;
  --surface-overlay:     rgba(0,0,0,0.85);
  --surface-accent:      #0D2D2A;

  --content-primary:     #EDEEF0;
  --content-secondary:   #B0B4BA;
  --content-subtle:      #717D79;
  --content-accent:      #0BD8B6;   /* Belloa teal — odds, active states */
  --content-on-action:   #EDEEF0;
  --content-inverse:     #101211;

  --action-primary:      #145750;
  --action-secondary:    rgba(0,255,230,0.118);
  --action-neutral:      rgba(249,250,251,0.07);
  --action-disabled:     #373B39;

  --border-default:      rgba(249,250,251,0.11);
  --border-subtle:       rgba(249,250,251,0.07);
  --border-active:       #207E73;
  --border-accent:       #084843;
  --border-focus:        rgba(0,255,230,0.118);

  --state-hover:         rgba(249,250,251,0.05);
  --state-pressed:       rgba(0,0,0,0.20);

  --brand-gd-start:      #0BD8B6;
  --brand-gd-end:        #12A594;

  --live-gd-start:       #E5484D;
  --live-gd-end:         #8C333A;

  --status-critical-fg:  #FF9592;
  --status-critical-bg:  #611623;
  --status-success-fg:   #4CC38A;
  --status-success-bg:   #133929;
  --status-warning-fg:   #F5E147;
  --status-warning-bg:   rgba(255,170,0,0.118);
}
```

### Betsat (dark purple/cyan — deep violet backgrounds, cyan CTAs, yellow accent)
```css
[data-theme="betsat"] {
  --surface-page:        #1A1129;   /* deep purple */
  --surface-layer-1:     #25173B;
  --surface-layer-2:     #2D1B4A;
  --surface-overlay:     rgba(0,0,0,0.75);
  --surface-accent:      #1A1129;

  --content-primary:     #FFFFFF;
  --content-secondary:   #E1D7F5;
  --content-subtle:      #B3AFBB;
  --content-accent:      #F6E545;   /* yellow — odds, active states */
  --content-on-action:   #1A1129;   /* dark text on cyan CTA */
  --content-inverse:     #0B1A1C;

  --action-primary:      #34ABBC;   /* cyan CTA */
  --action-secondary:    rgba(246,229,69,0.15);
  --action-neutral:      rgba(249,250,251,0.07);
  --action-disabled:     #0B1A1C;

  --border-default:      rgba(249,250,251,0.11);
  --border-subtle:       rgba(249,250,251,0.07);
  --border-active:       #34ABBC;
  --border-accent:       #112E32;
  --border-focus:        rgba(76,194,209,0.10);

  --state-hover:         rgba(249,250,251,0.05);
  --state-pressed:       rgba(0,0,0,0.20);

  --brand-gd-start:      #FAF29E;
  --brand-gd-end:        #4CC2D1;

  --live-gd-start:       #E5484D;
  --live-gd-end:         #F3AEAF;

  --status-critical-fg:  #FF9592;
  --status-critical-bg:  #611623;
  --status-success-fg:   #30A46C;
  --status-success-bg:   #133929;
  --status-warning-fg:   #946800;
  --status-warning-bg:   rgba(255,224,0,0.18);
}
```

### Superbetin (light mode — grey backgrounds, deep blue CTAs, green secondary)
> ⚠️ **Light theme** — the only brand on a light surface. `surface/page` is near-white. Components must not assume dark backgrounds.

```css
[data-theme="superbetin"] {
  --surface-page:        #F1F1F1;
  --surface-layer-1:     #E9E9E9;
  --surface-layer-2:     #E1E1E1;
  --surface-overlay:     rgba(0,0,0,0.75);
  --surface-accent:      #CFE1FF;

  --content-primary:     #050505;
  --content-secondary:   #222222;
  --content-subtle:      #444444;
  --content-accent:      #1717C5;   /* deep blue — odds, active states */
  --content-on-action:   #F1F1F1;
  --content-inverse:     #F1F1F1;

  --action-primary:      #181FC9;
  --action-secondary:    #3CF490;
  --action-neutral:      #D9D9D9;
  --action-disabled:     #BBBBBB;

  --border-default:      rgba(0,0,0,0.15);
  --border-subtle:       rgba(0,0,0,0.10);
  --border-active:       #1E2AE6;
  --border-accent:       #252FFF;
  --border-focus:        rgba(23,23,197,0.50);

  --state-hover:         rgba(249,250,251,0.05);
  --state-pressed:       rgba(0,0,0,0.20);

  --brand-gd-start:      #90B3FF;
  --brand-gd-end:        #1717C5;

  --live-gd-start:       #E5484D;
  --live-gd-end:         #F3AEAF;

  --status-critical-fg:  #DC3D43;
  --status-critical-bg:  #DC3D43;
  --status-success-fg:   #30A46C;
  --status-success-bg:   #18794E;
  --status-warning-fg:   #946800;
  --status-warning-bg:   rgba(255,224,0,0.18);
}
```

### Turkbet (dark charcoal/red — near-black backgrounds, red CTAs)
```css
[data-theme="turkbet"] {
  --surface-page:        #0F0F12;
  --surface-layer-1:     #16161A;
  --surface-layer-2:     #1C1C21;
  --surface-overlay:     rgba(0,0,0,0.75);
  --surface-accent:      #2E2E36;

  --content-primary:     #EEEEEF;
  --content-secondary:   #B0B0BC;
  --content-subtle:      #727280;
  --content-accent:      #FF2E2E;   /* red — odds, active states */
  --content-on-action:   #EEEEEF;
  --content-inverse:     #101211;

  --action-primary:      #FF0000;
  --action-secondary:    rgba(255,0,0,0.10);
  --action-neutral:      rgba(249,250,251,0.07);
  --action-disabled:     #2E2E36;

  --border-default:      rgba(249,250,251,0.11);
  --border-subtle:       rgba(249,250,251,0.07);
  --border-active:       #B32321;
  --border-accent:       #5C100F;
  --border-focus:        rgba(255,0,0,0.10);

  --state-hover:         rgba(249,250,251,0.05);
  --state-pressed:       rgba(0,0,0,0.20);

  --brand-gd-start:      #FF9595;
  --brand-gd-end:        #FF0000;

  --live-gd-start:       #E5484D;
  --live-gd-end:         #F3AEAF;

  --status-critical-fg:  #FF9592;
  --status-critical-bg:  #611623;
  --status-success-fg:   #30A46C;
  --status-success-bg:   #133929;
  --status-warning-fg:   #946800;
  --status-warning-bg:   rgba(255,224,0,0.18);
}
```

---

## 4.3 How to implement theme switching in React

```tsx
// themes.ts — maps brand ID to data-theme attribute value
export const BRAND_THEMES = {
  belloa:     'belloa-default',
  betsat:     'betsat',
  superbetin: 'superbetin',
  turkbet:    'turkbet',
} as const;

export type BrandId = keyof typeof BRAND_THEMES;

// ThemeProvider.tsx
import { BRAND_THEMES, BrandId } from './themes';

export function ThemeProvider({ brand, children }: { brand: BrandId; children: React.ReactNode }) {
  return (
    <div data-theme={BRAND_THEMES[brand]} style={{ height: '100%' }}>
      {children}
    </div>
  );
}

// Usage — wraps the entire app or a single widget
<ThemeProvider brand="betsat">
  <BetslipWidget />
</ThemeProvider>
```

```tsx
// Component usage — always semantic variables, never hardcoded hex
<button style={{ background: 'var(--action-primary)', color: 'var(--content-on-action)' }}>
  Place Bet
</button>

// Odds value — always uses content/accent
<span style={{ color: 'var(--content-accent)', fontFamily: 'var(--font-mono)' }}>
  {odds.toFixed(2)}
</span>
```

---

## 4.4 Critical theming notes

**Superbetin is light mode** — the only brand on `#F1F1F1` page background. Any component that hardcodes a dark `background` or assumes white text will break on Superbetin. Always use `var(--surface-page)` and `var(--content-primary)`.

**Odds accent colour differs per brand** — `--content-accent` is the correct token for odds values and interactive highlights. It is `#0BD8B6` (teal) on Belloa, `#F6E545` (yellow) on Betsat, `#1717C5` (blue) on Superbetin, and `#FF2E2E` (red) on Turkbet. Never use a hardcoded colour for odds.

**CTA (`action/primary`) text colour is `content/on-action`** — not white, not primary. On Betsat, `content/on-action` is `#1A1129` (dark purple) because the CTA is cyan. Always pair these together.

**Live gradient is consistent across all brands** — `#E5484D` → varies. The live dot and LIVE badge should use `--live-gd-start` for consistency.

---

## 4.5 Typography (all brands)
```css
--font-sans: 'DM Sans', system-ui, sans-serif;  /* UI text, labels, CTAs */
--font-mono: 'DM Mono', monospace;               /* odds, scores, stakes, references */
```

## 4.6 Spacing & radius (all brands)
```css
/* 4px base grid */
--radius-sm:  6px;    /* chips, badges */
--radius-md:  8px;    /* buttons, inputs, odds buttons */
--radius-lg:  10px;   /* cards, market rows */
--radius-xl:  12px;   /* mini betslip strip */
--radius-2xl: 16px;   /* full betslip drawer top corners */
```
