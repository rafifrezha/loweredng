---
version: alpha
name: "Aston Martin"
website: "https://www.astonmartin.com"
description: >-
  A British luxury-car marque whose marketing entry point is a leather-textured country-selector splash — a 48px AstonMartinFlare display headline in white sits centered over a photographic shot of the brand's winged emblem (deep racing-green centerpiece, polished chrome wings) resting on a warm-brown saddle-leather surface. The rendered chrome carries almost no chromatic load; the page floor is the photograph itself, the heading is light-weight 300, the only interactive elements are a thin white underline input field, a 30px-radius dark pill labelled ENTER, and a row of seven country links separated by hairline rules. Two type families divide labor — AstonMartinFlare for display and label work in tracked uppercase, AstonMartinSans for body and emphasis at weight 400/800.

seo:
  title: "Aston Martin Design System for React — racing green, AstonMartinFlare, 14 components"
  metaDescription: "Aston Martin's country-selector splash captured as a DESIGN.md file. Photographic leather canvas, racing-green wings emblem, AstonMartinFlare display at weight 300, AstonMartinSans for body and emphasis."
  highlights:
    - "Photograph as canvas — the brand emblem rests on a warm saddle-leather backdrop with no chrome panel framing it, no gradient overlay, no second surface"
    - "Two-family typographic split — AstonMartinFlare carries display and tracked uppercase labels, AstonMartinSans carries body and bold emphasis at weight 400/800"
    - "Display weight 300 — the 48px hero h1 sits at light, not bold; the marque trusts the photograph and the wing emblem to carry the visual force"
    - "Pill plus rule — only two radii exist on the page, a 30px ENTER pill and a 2px corner used inside form chrome; everything else is squared"
    - "Hairline-separated country list — seven market entries sit on a single row, divided by 1px vertical rules, type-only, no flags or badges"
  tags:
    - "Automotive"
  lastUpdated: "2026-05-18"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Aston Martin's first marketing surface is not a vehicle hero, not a configurator, not a video reel — it is a country-selector. A high-resolution photograph of the brand's winged emblem rests on a warm saddle-leather surface, dust grain and stitch detail visible at full size, and the 48px display headline "Welcome to Aston Martin" sits over it in white at weight 300. The only interactive elements are a thin white underline input field labelled "Select Your Site," a 30px-radius dark grey pill that reads ENTER, and a hairline-separated row of seven country links below. There is no nav, no logo lockup, no secondary CTA, no marketing copy. The brand trusts the photograph and the wing emblem to do every bit of work a typical luxury-auto hero would assign to a chrome video header.

    The DESIGN.md file packages the system into a machine-readable spec for React tooling. Inside: fourteen color tokens drawn from the photographic surface (the deep racing-green centerpiece of the wings emblem, the warm leather browns, the gold trim accent, three near-blacks used for footer chrome, a chromatic-gold for an unrendered hover state); five typography tokens spanning AstonMartinFlare at display, button-label, and small-caps tiers, and AstonMartinSans at body running text and bold emphasis; two radii — a 30px pill for the ENTER button and a 2px corner reserved for form chrome; eight spacing values clustered around 20-45px; and fourteen component definitions covering the underline input, the squat ENTER pill, the country-link row, the display heading, and the two label tiers.

    Feed this file to an AI coding tool and it reproduces Aston Martin's specific moves: a photograph as the page floor (not a gradient, not a flat fill), a light-weight 300 display tier (the marque never shouts), a single pill radius reserved for the one tappable action, tracked uppercase Flare labels for chrome, and the hairline-separated country list pattern. The one thing worth borrowing only if your brand has the photographic budget to back it: the willingness to ship a splash with no marketing copy whatsoever. Aston Martin gets away with it because the wing emblem and the leather grain do the entire job of brand assertion. Most teams need an interstitial sentence.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.astonmartin.com"
      title: "Aston Martin — official site"
      description: "Aston Martin's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Aston Martin's primary brand color?"
      answer: "Aston Martin's signature voltage is Racing Green, the dark forest-green field that runs across the centerpiece of the winged emblem on every car badge and across the captured country-selector hero. The marketing surface itself does not render the green as a flat token; instead, it lives inside the photograph of the wing emblem at the center of the page. The browser-reported theme color is the same racing green wired as the meta theme value. Chrome accents are warm brown leather tones from the photographic backdrop and a quiet brushed-gold trim. The page floor is the photograph; the brand color comes from the object inside the photograph rather than from a CSS fill."
    - id: "typography"
      title: "What typefaces does Aston Martin use, and what should I use as substitutes?"
      answer: "Aston Martin runs two licensed families. AstonMartinFlare handles display, button labels, small-caps form prompts, and the tracked uppercase footer chrome. AstonMartinSans handles body running text and bold emphasis at weight 400 and 800. The display tier on the splash sits at 48px in weight 300 with normal letter-spacing; the ENTER pill label sits at 14px in weight 500 with 0.55px tracking. There is no separate heading-2 or body-large tier on the captured surface. The closest open-source substitutes are Cormorant Garamond or Spectral for the Flare display tier and Inter or Söhne for the Sans tier. The preserved move is the weight-300 display."
    - id: "canvas-treatment"
      title: "Why is Aston Martin's hero a photograph rather than a flat color?"
      answer: "The captured page is the global country-selector splash. Aston Martin treats the entry-point as a brand-assertion surface rather than as a product-marketing surface, so the photograph of the winged emblem on saddle leather does the work a chrome video hero would do on a category-leader site. The decision aligns with how the brand presents itself on print and in dealership signage — the photograph is the chrome, the wing emblem is the voltage, and the rest of the page reduces to a single underline input, one pill button, and a hairline-separated list of country links. There is no secondary marketing block above the fold."
    - id: "radii-and-pills"
      title: "What corner-radius scale does Aston Martin use?"
      answer: "The captured surface uses exactly two radii. The primary ENTER button is a fully-rounded 30px pill — a squat 32px-tall capsule that reads as one of the warmest, most-tappable elements on an otherwise type-only page. The second radius is 2px, reserved for the inner corners of the form chrome (the search underline carries the corner internally). Every other surface — the country-link cells, the brand emblem container, the footer band — is squared at 0px. The scale is binary on purpose: pill versus right-angle, with no rounded-but-not-pill option to soften the typographic discipline."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own luxury-auto landing page?"
      answer: "Yes — the file feeds cleanly into Claude, Cursor, or any AI tool that consumes structured design tokens. The agent will reproduce Aston Martin's specific moves: photograph as the page floor rather than a gradient or flat fill, light-weight 300 display tier, single pill radius reserved for the one tappable action, tracked-uppercase Flare labels for chrome, and the hairline-separated country list pattern. The token references resolve directly — racing-green and chrome-gold for accent, the leather browns as canvas surfaces, AstonMartinSans equivalents for body. One caveat: the no-marketing-copy splash only works if your photograph and emblem do the job of brand assertion on their own. For most teams that means commissioning the photograph first."

mockups:
  - "marketing-hero"
  - "editorial-article"

colors:
  racing-green: "#1b6157"
  gold: "#b58c67"
  ink: "#111111"
  ink-soft: "#161718"
  ink-deep: "#080b11"
  canvas: "#161a11"
  surface-1: "#161a21"
  surface-2: "#262626"
  surface-3: "#3c4049"
  muted: "#606060"
  muted-soft: "#7b8086"
  hairline: "#c4c4c4"
  hairline-soft: "#e5e5e5"
  cream: "#ffffff"

typography:
  display-xl:
    fontFamily: "\"AstonMartinFlare\", Georgia, serif"
    fontSize: 48px
    fontWeight: 300
    lineHeight: 72px
    letterSpacing: 0
  button-label:
    fontFamily: "\"AstonMartinFlare\", Georgia, serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: "0.55px"
  small-caps:
    fontFamily: "\"AstonMartinSans\", \"Helvetica Neue\", sans-serif"
    fontSize: 15px
    fontWeight: 300
    lineHeight: 15px
    letterSpacing: "0.55px"
  nav-link:
    fontFamily: "\"AstonMartinSans\", \"Helvetica Neue\", sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 39.4px
    letterSpacing: "1.4px"
  emphasis:
    fontFamily: "\"AstonMartinSans\", \"Helvetica Neue\", sans-serif"
    fontSize: 14px
    fontWeight: 800
    lineHeight: 39.4px
    letterSpacing: "1.4px"
  body-md:
    fontFamily: "\"AstonMartinSans\", \"Helvetica Neue\", sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0
  caption:
    fontFamily: "\"AstonMartinFlare\", Georgia, serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 12px
    letterSpacing: "0.55px"
  body-sm:
    fontFamily: "\"AstonMartinSans\", \"Helvetica Neue\", sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0
  heading-md:
    fontFamily: "\"AstonMartinSans\", \"Helvetica Neue\", sans-serif"
    fontSize: 32px
    fontWeight: 300
    lineHeight: 48px
    letterSpacing: 0
  heading-sm:
    fontFamily: "\"AstonMartinFlare\", Georgia, serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: "0.55px"

rounded:
  none: "0px"
  xs: "2px"
  pill: "30px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  base: "16px"
  md: "20px"
  lg: "25px"
  xl: "35px"
  2xl: "45px"
  3xl: "100px"

components:
  button-primary:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.cream}"
    typography: "{typography.button-label}"
    rounded: "{rounded.pill}"
    padding: "4px 16px 8px"
    height: "32px"
    border: "0"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.button-label}"
    rounded: "{rounded.pill}"
    padding: "4px 16px 8px"
    height: "32px"
    borderColor: "{colors.cream}"
  top-nav:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "0px 24px"
    height: "65px"
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.nav-link}"
    padding: "0px 12px"
  hero-heading:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.display-xl}"
    padding: "0px"
  section-heading:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.heading-md}"
  body-paragraph:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.body-md}"
  small-caps-prompt:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.small-caps}"
  text-input:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: "0px 0px 0px 0px"
    height: "32px"
    borderColor: "{colors.cream}"
  card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.cream}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "25px"
  country-link:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.nav-link}"
    padding: "0px 16px"
  country-link-emphasis:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.emphasis}"
  footer:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.cream}"
    typography: "{typography.body-sm}"
    padding: "45px 24px"
  divider:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.cream}"
    typography: "{typography.caption}"
    padding: "0"
    height: "1px"
---

## Overview

Aston Martin's first marketing surface is not a configurator and not a hero film. **Photograph as canvas.** The page floor is a high-resolution shot of the winged emblem resting on warm saddle leather — dust grain, stitch detail, and the dark racing-green centerpiece of the wings are the entire chromatic load. Where Ferrari opens on a video reel of a vehicle in motion and Bentley opens on a chrome-paneled product hero, Aston Martin opens on a still photograph of the badge itself, framed in nothing, surrounded by no marketing copy. The 48px "Welcome to Aston Martin" display sits over the photograph in white weight 300 — the lightest display tier in the luxury-auto category — and the only chromatic interactive element is a 30px-radius dark grey pill labelled ENTER.

The system runs two licensed type families that split labor cleanly. AstonMartinFlare handles every display, button label, and small-caps form prompt; AstonMartinSans handles every body paragraph and tracked uppercase chrome label at weight 400 or 800. There is no third family and no system mono. The display weight tops out at 300 — the same restraint that distinguishes Stripe's `Sohne-var` 300 in fintech, but here the choice is editorial rather than technical: Flare at 48px / 300 reads like the foreword of a coffee-table monograph, not a SaaS hero.

The chromatic palette in the rendered chrome is almost entirely structural. Racing green (`{colors.racing-green}` — #1b6157) lives inside the photograph and as the browser-reported theme color, but never renders as a CSS fill on the captured surface. The chrome-gold trim (`{colors.gold}` — #b58c67) is declared as `--gold` but absent from the rendered page. The page text is white on the photograph; the footer band steps down to a near-black `{colors.ink-deep}` (#080b11) for chrome continuity. Every accent the marque could have used — gold, green, brushed-bronze — is held in reserve for product pages elsewhere in the site.

**Key Characteristics:**
- Photograph as the page floor (warm saddle-leather backdrop, wing emblem centered) — no gradient overlay, no chrome panel, no second surface.
- Racing green (`{colors.racing-green}` — #1b6157) is the brand voltage but lives inside the photographic wing emblem, never rendered as a CSS fill on the captured chrome.
- Two licensed families split cleanly: AstonMartinFlare for display / labels / small-caps; AstonMartinSans for body running text and weight-800 emphasis.
- Display weight 300 at 48px — the lightest display tier in the luxury-auto category, well below Bentley's 500 and Rolls-Royce's 600.
- Binary radius scale: a single 30px pill for the ENTER button, a 2px corner inside form chrome, everything else squared at 0px.
- Hairline-separated country-link row at the page bottom — seven market entries divided by 1px vertical rules, type-only, no flags or badges.
- Footer chrome steps down to near-black `{colors.ink-deep}` (#080b11) wired as `--blackFooter` — the only sub-fold chromatic shift in the captured page.
- 14 declared color tokens drawn entirely from photographic browns, structural near-blacks, and chrome whites; the chromatic accent lives in the photograph, not in the token list.

## Colors

### Brand

- **Racing Green** (`{colors.racing-green}` — #1b6157): the browser-reported `themeColor` from the page meta tags. Lives inside the photographic wing emblem at the center of the splash and across every vehicle badge the marque ships. Never rendered as a CSS fill on the captured chrome; the racing green you see on the page is photographic, not painted. The single brand voltage in the system.
- **Gold** (`{colors.gold}` — #b58c67): declared as `--gold` in the CSS but absent from the rendered splash. Reserved for trim accents on product pages elsewhere in the site.

### Text & Chrome

- **Ink** (`{colors.ink}` — #111111): frequency 66 — used as text (33) and border (33). Wired as `--blackFooter`, `--black-pearl`, `--text-dark`. The footer chrome and dark-on-light text color used outside the splash photograph.
- **Ink Soft** (`{colors.ink-soft}` — #161718): paired with `--text-dark` and `--black-pearl` as the slightly warmer footer text tone. Distinct from pure black by a couple of luminance points.
- **Ink Deep** (`{colors.ink-deep}` — #080b11): wired as `--almostBlack`, `--almostBlack20`, `--almostBlack12`. The deep near-black used for the footer band — the only chromatic shift between the photograph and the page bottom.
- **Cream** (`{colors.cream}` — #ffffff): frequency 55 — used as text (27) and border (27). Pure white on the photograph, no muted variant for body copy. The contrast against the dark leather backdrop is intentional.

### Surface

- **Canvas** (`{colors.canvas}` — #161a11): wired as `--black`. The near-black warm-green-tinted surface used as a configurator background tone on product pages; not rendered on the splash.
- **Surface-1** (`{colors.surface-1}` — #161a21): wired as `--configuratorDarkGray`, `--darkGrey`. The dominant configurator surface tone used elsewhere in the site for dark UI cards.
- **Surface-2** (`{colors.surface-2}` — #262626): wired as `--darkGray`. The secondary configurator chrome tone.
- **Surface-3** (`{colors.surface-3}` — #3c4049): wired as `--configuratorDarkenGray`. The third configurator chrome step.

### Neutrals

- **Muted** (`{colors.muted}` — #606060): frequency 1 — used as the ENTER button background fill. The single rendered grey on the splash; the only chromatic decision the page chrome makes outside the photograph.
- **Muted Soft** (`{colors.muted-soft}` — #7b8086): wired as `--configuratorLightGray`. Reserved for configurator-panel text on product pages.
- **Hairline** (`{colors.hairline}` — #c4c4c4): wired as `--greyLight`, `--gray`. The country-link row separator rule and form chrome border tone.
- **Hairline Soft** (`{colors.hairline-soft}` — #e5e5e5): wired as `--whisperGrey`. The lightest hairline tier, reserved for dropdown chrome on product pages.

## Typography

### Font Families

The system runs two licensed families. **AstonMartinFlare** is the Flare variant — used for the display tier (48px / 300 hero h1), button labels (14px / 500 tracked uppercase), small-caps form prompts (the "Select Your Site" label is Flare-equivalent at 15px), and the tracked uppercase footer chrome. **AstonMartinSans** handles body running text and bold emphasis — country-link labels render in Sans 14px / 400 with 1.4px tracking, and the in-line bold "United Kingdom / United States / Deutschland / Australia / France" emphasis renders in Sans 14px / 800 at the same tracking. Fallbacks walk to `Georgia, serif` for Flare and `Helvetica Neue, sans-serif` for Sans.

The pairing is the typographic signature: a contemporary Flare-style display in tracked uppercase for chrome, paired with a contemporary humanist sans for running text and emphasis. There is no third family and no system mono.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 300 | 72px | 0 | Hero h1 ("Welcome to Aston Martin") |
| `{typography.heading-md}` | 32px | 300 | 48px | 0 | Inferred h2 tier (declared as `--fs-h3` in CSS, not rendered on the splash) |
| `{typography.heading-sm}` | 16px | 500 | 16px | 0.55px | Sub-heading / accordion title tier (declared, not rendered on the splash) |
| `{typography.small-caps}` | 15px | 300 | 15px | 0.55px | Small-caps form prompt ("Select Your Site") |
| `{typography.button-label}` | 14px | 500 | 20px | 0.55px | ENTER pill label and tracked uppercase chrome |
| `{typography.nav-link}` | 14px | 400 | 39.4px | 1.4px | Country-link labels |
| `{typography.emphasis}` | 14px | 800 | 39.4px | 1.4px | Bold market-name emphasis inside country links |
| `{typography.body-md}` | 14px | 400 | 21px | 0 | Default body running text |
| `{typography.body-sm}` | 12px | 400 | 18px | 0 | Footer chrome and metadata |
| `{typography.caption}` | 12px | 500 | 12px | 0.55px | Eyebrow / footnote captions |

### Principles

Display weight tops out at 300. The 48px hero h1 at weight 300 is the entire typographic statement of the splash — the lightest display tier in the luxury-auto category, well below Bentley's 500 and Rolls-Royce's 600. The lightness is the brand confidence signal: the marque does not need typographic muscle when the photograph and the wing emblem are doing the work.

Button labels and small-caps prompts both use 0.55px tracking — a quiet measured space that reads more print-magazine than SaaS. Body emphasis jumps to weight 800 with 1.4px tracking on the country-link row, the single use of the heavy weight on the captured page; the contrast between regular and bold sits at six weight steps rather than the usual three, which lets the bold market-names register clearly without the row needing color or background separation.

### Note on Font Substitutes

AstonMartinFlare and AstonMartinSans are licensed proprietary families. The closest open-source substitutes for Flare are **Cormorant Garamond** or **Spectral** at weight 300 for display, and a tracked **EB Garamond Small Caps** for the chrome labels. For AstonMartinSans, **Inter** or **Söhne** at the same weights transfers cleanly; the 800-weight emphasis tier maps to Inter's ExtraBold. The preserved move is the weight-300 display — substituting in weight 400 or 500 turns the marque foreword into a generic editorial header.

## Layout

### Spacing System

- **Base unit:** 5px — the spacing values cluster at 20 / 25 / 35 / 45px, all multiples of 5.
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 25px · `{spacing.xl}` 35px · `{spacing.2xl}` 45px · `{spacing.3xl}` 100px.
- **Section padding (vertical):** the splash uses the full viewport — the hero stack sits centered, the country-link row sits ~100px from the page bottom.
- **Header height:** 65px (wired as `--headerHeight`), reserved for site chrome on product pages.
- **Footer height:** 204px (wired as `--footerHeight`).
- **Card internal padding:** `{spacing.lg}` (25px) on the configurator surfaces; the splash itself uses no cards.

### Grid & Container

- **Max content width:** ~720px on the centered hero stack (display heading + input + ENTER button), unconstrained on the country-link row.
- **Hero:** the hero stack (heading, input, ENTER pill, visit-international link) sits in a centered ~720px column over the full-bleed photograph.
- **Country-link row:** flush-bottom horizontal row of seven country entries divided by 1px `{colors.hairline}` vertical rules, type-only, no flags or badges.
- **Footer band:** 204px-tall near-black `{colors.ink-deep}` band that holds the legal / corporate links on product pages (absent from the splash, declared in the system).

### Rhythm

The splash holds a single tempo — the photograph is the entire page floor, the hero stack is the only chrome element above the country-link row, and the footer is the only chromatic shift. There is no second editorial band, no scroll-revealed section, no logo wall. The page is the splash, and the splash is the brand assertion.

## Elevation

The system has essentially **no shadow tier** on the captured surface. The ENTER pill sits flat against the photograph with no drop shadow; the underline input has no inset shadow. Depth on the splash comes entirely from the photographic backdrop — the wing emblem casts its own shadow into the leather, and the leather grain provides surface texture. No CSS-rendered shadow is part of the captured chrome.

- **Flat (no shadow):** hero stack, ENTER pill, underline input, country-link row, footer — every rendered surface.
- **Photographic depth:** the wing-emblem-on-leather backdrop provides every bit of visual depth the page carries. The dust grain and stitch detail are the texture layer.
- **No hairline-on-photograph:** the underline input field uses a 1px white rule that reads as photographic detail rather than as a UI border — the photograph and the chrome blur into a single surface.

## Shapes

The radius scale is **binary**: a single pill plus a 2px form-chrome corner.

- `{rounded.none}` 0px — the country-link row cells, the footer band, the hero heading bounding box, every surface that isn't the ENTER button or a form input corner.
- `{rounded.xs}` 2px — reserved for the inner corners of form chrome on configurator pages (declared, not rendered on the splash).
- `{rounded.pill}` 30px — the ENTER button. A squat 32px-tall capsule that reads as the warmest, most-tappable surface on an otherwise type-only page.
- `{rounded.full}` 9999px — declared in the system for fully circular treatment on avatar / icon-button chips that appear on product pages.

There is no 4 / 8 / 12 / 16px middle tier. The scale is deliberately binary — pill versus right-angle — and the pill is reserved for the one action that needs warmth. Adding a soft-rounded middle tier would dilute the discipline that makes the ENTER pill register as the single tappable affordance.

## Components

**`hero-heading`** — White `{colors.cream}` text on the photographic backdrop, `{typography.display-xl}` (48px / 300). The entire typographic load of the splash sits here. 0 padding because the photograph extends edge-to-edge.

**`small-caps-prompt`** — White text in `{typography.small-caps}` (15px / 300 / 0.55px tracking). The "Select Your Site" label that sits above the underline input — Flare-equivalent rendering, the only small-caps prompt on the page.

**`text-input`** — Transparent fill, white text in `{typography.body-md}`, 1px white bottom border, `{rounded.xs}` 2px corner, 32px height. The underline input field — no rounded box, no inset shadow, just a thin white rule that reads as a photographic detail.

**`button-primary`** — The ENTER pill. Muted grey `{colors.muted}` (#606060) fill, white text in `{typography.button-label}` (14px / 500 / 0.55px tracking, uppercase), `{rounded.pill}` 30px radius, 4 / 16 / 8px padding, 32px height. The squat capsule sits below the underline input and reads as the single tappable affordance on the page.

**`button-secondary`** — Transparent fill, white text in the same button-label typography, white-stroked pill border. Used for the "VISIT OUR INTERNATIONAL SITE" link that sits below the ENTER button (rendered as text link on the captured surface, declared as a secondary pill variant for product pages).

**`country-link`** — Transparent fill, white text in `{typography.nav-link}` (14px / 400 / 1.4px tracking, capitalize). The seven country entries that sit in a horizontal row at the page bottom — each cell separated from its sibling by a 1px `{colors.hairline}` vertical rule.

**`country-link-emphasis`** — White text in `{typography.emphasis}` (14px / 800 / 1.4px tracking). The bold market-name segment inside each country link ("Aston Martin **United Kingdom**", "Aston Martin **United States**", etc.) — the six-step weight jump from regular to ExtraBold is the page's only typographic emphasis pattern.

**`divider`** — 1px `{colors.hairline}` rule used as the vertical separator between country links and as form-chrome borders. The only line element rendered on the page.

**`top-nav`** — Declared as a 65px-tall transparent band over the photograph; not rendered on the captured splash (the splash has no nav). Reserved for product pages with a `{typography.nav-link}` link cluster.

**`nav-link`** — White text in `{typography.nav-link}`, transparent fill, 0 / 12px padding. The declared top-nav link style for product pages.

**`section-heading`** — White text in `{typography.heading-md}` (32px / 300). Declared as the h2 tier; not rendered on the splash, used on product pages for section displays.

**`body-paragraph`** — Default white text at `{typography.body-md}`. Declared as the running-text style; not rendered on the splash.

**`card`** — `{colors.surface-1}` (#161a21) fill, white text, 0 radius, 25px padding. Declared as the configurator card surface; absent from the splash.

**`footer`** — `{colors.ink-deep}` (#080b11) fill, white text in `{typography.body-sm}`, 45 / 24px padding. 204px tall on product pages; not rendered on the splash, but the only chromatic step-down declared in the system.

## Do's and Don'ts

**Do** let the photograph be the page floor. The single move that defines this system is the willingness to ship a splash where the photograph carries every bit of visual decoration. Painting a chrome overlay or a gradient mesh on top would compete with the wing emblem and undercut the brand assertion.

**Do** hold display weight at 300. The 48px hero h1 at weight 300 is the entire typographic moment on the page; bumping to weight 500 turns the marque foreword into a generic editorial header and loses the print-monograph treatment.

**Do** keep the country-link row as type-only with hairline separators. No flags, no badges, no surface fills — the row reads as a measured editorial credit line, not as a market chooser.

**Do** reserve the 30px pill radius for the one tappable action. The ENTER pill is the single warm surface on the page; multiplying it to other CTAs would dilute the binary radius discipline.

**Don't** render the racing green (`{colors.racing-green}` — #1b6157) as a CSS background fill on the splash. The brand voltage lives inside the photographic wing emblem; painting it as a chrome surface flattens the photograph-as-canvas move into a typical luxury-auto green-block hero.

**Don't** use `{colors.gold}` (#b58c67) as a button or link accent. The token is declared as `--gold` but absent from the captured render — it is reserved for trim treatments on product pages and reads as decorative bling outside those contexts.

**Don't** introduce a soft-rounded middle radius (8 / 12 / 16px). The scale is binary — pill versus right-angle — and adding a softened middle tier breaks the contrast between the single tappable affordance and the squared editorial chrome around it.

**Don't** add a drop shadow under the ENTER pill or the underline input. The captured chrome carries zero CSS shadows; depth comes from the photograph. A rendered shadow on top of the photographic surface would read as a foreign UI layer and disrupt the single-surface treatment.

## Known Gaps

- **Vehicle hero, configurator chrome, and dealer-locator UI** are not represented — the captured surface is the global country-selector splash only. Product pages, configurator panels, and the dealer locator carry a richer surface ladder using `{colors.surface-1}` through `{colors.surface-3}` that is declared but not rendered on the splash.
- **Hover and focus states:** documented for none of the captured components. The full state matrix (focus rings, active press, hover tints) lives in the configurator surfaces and is not exposed on the splash.
- **Dark / light mode:** the splash is photograph-only; no light variant exists. Configurator pages run a darker chrome that uses `{colors.surface-1}` and `{colors.surface-2}` as the page floor.
- **Motion:** the splash is a static photograph; no scroll-revealed motion or hero animation is rendered. Product pages carry parallax and reveal motion that is not represented in the spec.
- **Marketing nav and product-category chrome:** the splash has no top-nav, no logo lockup, no secondary CTA. The full nav system (Products / Models / Configurator / Owners / About) lives behind the ENTER pill and is declared via `--zi-header-buttons` and `--zi-models-header-text` but not rendered.
- **Form input error states:** `{component.text-input}` carries the resting state only; error / validation styling is not exposed on the splash.
- **Chromatic accent ladder:** the declared `{colors.gold}` and `{colors.racing-green}` are absent from the captured render; both are reserved for product-page surfaces.
