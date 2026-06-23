# The Brew Lab — Brand Colors (mobile export)

Exported from the website's single source of truth, `assets/css/tokens.css`.
Two themes: **dark** (default) and **light**. The primary accent is **lavender**.

## Core palette

| Token        | Role                          | Dark        | Light       |
|--------------|-------------------------------|-------------|-------------|
| `bg`         | App background                | `#0F1117`   | `#FAFAFC`   |
| `surface`    | Raised surface / sidebar      | `#161A22`   | `#F4F5F8`   |
| `card`       | Card / input fill             | `#1B202B`   | `#FFFFFF`   |
| `accent`     | Primary (lavender)            | `#A78BFA`   | `#7C5CFA`   |
| `accentAlt`  | Secondary (cyan)              | `#7DD3FC`   | `#0891B2`   |
| `champagne`  | Warm tertiary / price text    | `#E9CBA7`   | `#B07B4E`   |
| `rose`       | Tertiary accent               | `#F4A8C5`   | `#DB7093`   |
| `text`       | Primary text                  | `#F5F7FA`   | `#1A1D26`   |
| `textMuted`  | Secondary / muted text        | `#98A1B2`   | `#6B7280`   |
| `onAccent`   | Text/icon on accent fills     | `#0F1117`   | `#FFFFFF`   |

### Alpha tokens (overlays / borders / elevation)

| Token    | Dark                          | Light                          |
|----------|-------------------------------|--------------------------------|
| `line`   | white @ 6%  (`#FFFFFF0F`)     | ink @ 8%  (`#0F111714`)        |
| `glass`  | card @ 55% (`#1B202B8C`)      | white @ 70% (`#FFFFFFB3`)      |
| `glow`   | accent @ 22% (`#A78BFA38`)    | accent @ 16% (`#7C5CFA29`)     |
| `shadow` | black @ 55% (`#0000008C`)     | ink @ 10% (`#0F11171A`)        |

> 8-digit hex above is **#RRGGBBAA**. Android wants **#AARRGGBB** — see
> `colors.android.xml`, where the bytes are already reordered.

## Signature gradient
Linear, ~110°: **accent → rose → champagne** at stops `0 / 0.55 / 1`.
Used on the logo wordmark, hero headlines, and large numbers.

## Status dots (theme-independent)
`red #FF5F57` · `yellow #FEBC2E` · `green #28C840`

## Files
- `colors.tokens.json` — platform-neutral design tokens (import into Figma
  Tokens, Style Dictionary, etc.)
- `colors.android.xml` — Android `values/colors.xml` (#AARRGGBB)
- `BrewLabColors.swift` — SwiftUI `Color` + palette + gradient
- `brew_lab_colors.dart` — Flutter palette + `ColorScheme` + gradient
- `colors.ts` — React Native / Expo / any JS-TS theme object

## Typography (for reference)
The web uses **Sora** (headings, 700/800), **Manrope** (body, 400–800), and
**JetBrains Mono** (code/labels). All three are on Google Fonts and ship for
iOS/Android if you want the app to match.
