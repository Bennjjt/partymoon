---
name: PartyMoon
description: Curated group luxury travel — decadent, exclusive, electric.
colors:
  midnight: "#080808"
  deep: "#0f0f0f"
  elevated: "#1a1a1a"
  gold: "#c9a84c"
  gold-bright: "#f2d878"
  gold-pale: "#f0d080"
  white: "#ffffff"
  white-dim: "#d0d0d0"
  silk-red: "#cc2222"
  silk-bg-start: "#0a0000"
  silk-bg-end: "#160000"
  glass: "rgba(255,255,255,0.07)"
  glass-border: "rgba(255,255,255,0.14)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 6rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "normal"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 0.95
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 300
    lineHeight: 1.2
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 300
    lineHeight: 1.9
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.6rem"
    fontWeight: 500
    letterSpacing: "0.35em"
    textTransform: "uppercase"
rounded:
  sharp: "2px"
spacing:
  section: "6rem"
  inner: "1.5rem"
  tight: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.midnight}"
    rounded: "{rounded.sharp}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
    rounded: "{rounded.sharp}"
    padding: "12px 32px"
  button-ghost-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.midnight}"
  chip:
    backgroundColor: "rgba(201,168,76,0.15)"
    textColor: "{colors.gold}"
    rounded: "9999px"
    padding: "4px 12px"
---

# Design System: PartyMoon

## 1. Overview

**Creative North Star: "The Black Card Experience"**

Everything is handled. Nothing is cheap. The darkness is not a style choice — it is the signal. PartyMoon's visual system is built on the premise that restraint in color and ornamentation, when deployed against a near-void background, reads as authority. The gold does not decorate; it certifies. A single accent bar, a tracked label, a light-weight heading with an italic subordinate clause: these are the gestures of a brand that doesn't need to explain itself.

The system is drenched in darkness and sparse in everything else. The palette is three things: absolute black, pure white, and one grade of gold that shifts between warm (#c9a84c) and bright (#f2d878) depending on the surface. Sections with their own sub-world (Silk Soiree) draw from a deep-red variant, but the structural language — sharp edges, tracked type, full-bleed hierarchy — is consistent throughout.

Motion is Framer Motion–driven, scroll-revealed, never decorative. Typography is Cormorant Garamond (display/heading) and Montserrat (body/labels): one voice that commands, one voice that explains, no redundancy. The system rejects confetti, warmth, accessibility-through-softness, and anything that reads as a group deal.

**Key Characteristics:**
- Near-void black backgrounds (#080808) as the base surface — never warm, never gray
- A single gold accent used sparingly: eyebrows, dividers, borders, CTAs
- Cormorant at large scale (light weight + italic sub-clauses) for all headings
- Tracked all-caps labels (Montserrat, 0.6rem, 0.35–0.5em tracking) as the only section annotation
- Sharp 2px radius throughout — no softness anywhere
- Full-bleed video or photography heroes; imagery leads, copy supports
- Silk Soiree section operates as a distinct visual world within the same structural grammar

## 2. Colors: The Vault Palette

One surface. One metal. Two modes.

### Primary
- **Rich Gold** (#c9a84c / var(--pm-purple), var(--pm-accent)): The primary accent. CTAs, section divider bars, chip borders, eyebrow text, focus rings, and active states. Used at ≤15% of any given screen's total surface area. Its scarcity is what makes it read as gold.
- **Bright Gold** (#f2d878 / var(--pm-gold)): Decorative — star motifs, shimmer effects, gradient tails. Never used as body text color.
- **Pale Gold** (#f0d080 / var(--pm-purple-light)): Muted labels, sub-eyebrows, secondary metadata. Slightly desaturated so it recedes behind Rich Gold.

### Neutral
- **Void** (#080808 / var(--pm-midnight)): Page background. As close to absolute black as sRGB allows. This is the canvas.
- **Deep Surface** (#0f0f0f / var(--pm-deep)): Card and panel backgrounds. Barely distinguishable from Void — depth through tone, not shadow.
- **Elevated Surface** (#1a1a1a / var(--pm-navy)): Input backgrounds, hover states, tertiary surfaces.
- **White** (#ffffff): All primary body text on dark surfaces. Full white — never cream, never light gray.
- **White Dim** (#d0d0d0 / var(--pm-moon-dim)): Secondary text, captions.
- **Body Text** (rgba(232,232,240,0.65)): Long-form prose on dark surfaces. A slight transparency that allows the surface to breathe through — cooler than white, less harsh.
- **Glass Surface** (rgba(255,255,255,0.07)): Frosted panel overlays. Used rarely, only where structural separation is needed and a tonal surface would be too opaque.

### Secondary
- **Silk Red** (#cc2222 / var(--pm-silk-red)): Reserved exclusively for the Silk Soiree section and its sub-world. Never used outside that context.
- **Silk Background** (linear-gradient(135deg, #0a0000 0%, #160000 50%, #0a0000 100%)): The deep-red-black gradient that signals Silk Soiree. Never used outside that section.

### Named Rules
**The One Metal Rule.** Gold appears in exactly one grade per surface — either Rich (#c9a84c) or Bright (#f2d878), never both at the same elevation. Mixing them on the same surface creates noise; the point of the accent is that it's singular.

**The Silk Quarantine Rule.** Silk red (#cc2222) and the Silk gradient background are prohibited outside the Silk Soiree section. They are a deliberate world-within-a-world, not a color available to the rest of the system.

## 3. Typography: Two Voices

**Display / Heading Font:** Cormorant Garamond (local, 300–600, with italic variants)
**Body / Label Font:** Montserrat (local, 300–600)

**Character:** Cormorant commands the headline space with editorial authority — large, light, often italic-subordinated. Montserrat handles all explanatory roles: body copy, tracked labels, CTAs. They pair on a contrast axis (high-stroke-contrast serif vs. geometric neutral sans) that reads as luxury editorial.

Note: Cormorant Garamond appears in the reflex-reject font list. It is retained here because it predates this document and is already committed as the brand identity. Identity-preservation wins; this is not a greenfield choice.

### Hierarchy
- **Display** (Cormorant, 300, clamp(2.5rem, 7vw, 6rem), line-height 0.95): Hero headlines only. Often paired with an italic subordinate clause in pale gold at ~0.75em.
- **Headline** (Cormorant, 300, clamp(2.5rem, 5vw, 4.5rem), line-height 0.95): Section leads. The primary heading scale across trip detail pages.
- **Title** (Cormorant, 300, clamp(2rem, 4vw, 3.5rem), line-height 1.2): Waitlist headings, card titles, smaller section headings.
- **Body** (Montserrat, 300, 0.9–0.95rem, line-height 1.9): All prose. Rendered at rgba(232,232,240,0.65) on dark backgrounds — cooler than white, easier to read at length. Max line length 65ch.
- **Label** (Montserrat, 500, 0.6rem, tracking 0.35–0.5em, all-caps): Section annotations, eyebrows, stat labels, chip text. Rendered in Rich Gold or Pale Gold depending on hierarchy. Never on body copy.

### Named Rules
**The Italic Subordinate Rule.** Display and Headline headings may include an italic clause — always at a smaller em size (0.7–0.8em) and always in a lighter color (Pale Gold or rgba white). This creates the dual-register effect that defines the PartyMoon heading voice. One italic subordinate per heading maximum.

**The No-Serif-Body Rule.** Cormorant is prohibited in body copy roles. It is a display instrument; using it at reading size breaks the system's voice and creates legibility issues at low contrast.

## 4. Elevation

This system uses **tonal layering**, not shadows. Depth is conveyed by surface color stepping from Void (#080808) → Deep (#0f0f0f) → Elevated (#1a1a1a), with gold-tinted borders (rgba(var(--pm-purple-rgb), 0.1–0.3)) providing structural separation. Shadows are not part of the vocabulary.

The exception is ambient glow: `radial-gradient(ellipse at center bottom, rgba(201,168,76,0.08) 0%, transparent 60%)` applied behind signature sections. This reads as warmth emanating from beneath, not as a drop shadow — atmospheric, not structural.

### Named Rules
**The Shadowless Rule.** `box-shadow` and `drop-shadow` are prohibited. Elevation is expressed through color; shadows read as web-default and break the void-darkness illusion the system depends on.

## 5. Components

### Buttons

**Character:** Razor-edged. The button looks expensive before you hover it and answers when you do.

- **Shape:** Sharp — 2px radius (`--pm-radius`). No softness.
- **Primary (solid):** Rich Gold (#c9a84c) background, Midnight (#080808) text, Gold border. Padding: 12px 32px. Text: Montserrat 500, 0.65rem, tracking 0.2em, all-caps, bold.
- **Primary hover:** Background → transparent, text → Rich Gold. The inversion confirms the gold; it doesn't change the shape.
- **Ghost:** Transparent background, Rich Gold text and border. Used in hero overlays where a filled button would compete with photography.
- **Ghost hover:** Background → Rich Gold, text → Midnight. The same inversion in reverse.
- **Transition:** `transition: background 0.2s, color 0.2s` — instantaneous enough to feel responsive, not so fast it's jittery.

### Chips / Tags

- **Style:** Rounded-full pill (border-radius: 9999px — the only component that breaks the sharp-corner system), Rich Gold border (rgba(201,168,76,0.3)), gold-tinted background (rgba(201,168,76,0.15)), Rich Gold text.
- **Use:** Stat tags, trip attributes. Never for navigation.

### Cards / Containers

- **Corner Style:** Sharp (2px radius) — consistent with the system.
- **Background:** Deep Surface (#0f0f0f) for primary cards, Glass (rgba(255,255,255,0.07)) for overlay panels.
- **Shadow Strategy:** None. Borders carry the separation (see Elevation).
- **Border:** rgba(var(--pm-purple-rgb), 0.15) at rest; rgba(var(--pm-purple-rgb), 0.35) on hover.
- **Hover background shift:** rgba(var(--pm-purple-rgb), 0.05) — barely perceptible warmth.
- **Internal Padding:** 24px (inner) / 20px (tight, stat panels).

### Inputs / Fields

- **Style:** Elevated Surface (#1a1a1a) background, rgba(255,255,255,0.15) border, 2px radius.
- **Focus:** Gold ring (`--ring: #c9a84c`). No glow, no blur — just the metal border activating.
- **Placeholder:** rgba(255,255,255,0.4) minimum — never muted gray, never fails the 3:1 contrast test.

### Navigation

- Transparent background by default (over hero video/images). Scrolls to near-black with the body surface as a backdrop.
- Montserrat labels, tracked caps, white text. Active/hover state: Rich Gold.
- Mobile: presumed to collapse to a minimal treatment consistent with the label system.

### Divider Bar (Signature Component)

A 3px horizontal rule, 64px wide, gradient from Rich Gold (#c9a84c) to Bright Gold (#f2d878). Used below every heading block. Not decorative — it closes the heading and opens the body. One per section, never stacked.

### Stats Panel (Signature Component)

A borderless grid container with gold-tinted full border (rgba(201,168,76,0.15)). Each row: label in tracked Pale Gold caps above a light-weight value in dim white. Rows separated by hairline gold dividers. Tag chips appear right-aligned. Used on trip detail pages alongside the signature experience heading.

## 6. Do's and Don'ts

### Do:
- **Do** use `#080808` (Void) as the page background — never warm gray, cream, or tinted neutral.
- **Do** use Cormorant at large scale with light weight (300) and an italic subordinate clause in Pale Gold at ~0.75em.
- **Do** use tracked all-caps Montserrat labels (0.6rem, 0.35–0.5em tracking) as the only section-level annotation.
- **Do** use the 3px gold gradient divider bar (gold-dim → gold) immediately after every major heading.
- **Do** lead with full-bleed photography or video in hero sections — imagery sells the atmosphere before copy can.
- **Do** apply body prose at rgba(232,232,240,0.65) on dark surfaces — cooler and softer than white, readable at length.
- **Do** keep Rich Gold (#c9a84c) scarce: eyebrows, dividers, CTAs, borders. Its power is its rarity.
- **Do** use `text-wrap: balance` on h1–h3 to prevent widow lines in large headings.
- **Do** verify gold-on-black contrast at every weight — Pale Gold (#f0d080) at 0.6rem requires checking.
- **Do** constrain body line length to 65ch maximum.

### Don't:
- **Don't** use warm-neutral backgrounds (cream, sand, beige, bone, linen, paper). The brand's warmth lives in the gold accent and imagery — never in the surface color.
- **Don't** use `box-shadow` or `drop-shadow` anywhere in the system. Elevation is tonal, not shadowed.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Decorative, never meaningful. Use solid gold.
- **Don't** use Silk Red (#cc2222) or the Silk gradient background outside the Silk Soiree section.
- **Don't** use Cormorant at body copy size (below ~1.5rem). It breaks legibility on dark backgrounds.
- **Don't** apply the tracked uppercase label to more than one element per section. One annotation per section — it is a voice, not a scaffold.
- **Don't** add rounded corners beyond 2px except on pill-shaped chips. Sharp edges are a deliberate luxury signal.
- **Don't** use neon gradients, confetti motifs, hot pink, or any color that reads as bachelorette or party-bus aesthetic.
- **Don't** use generic travel-booking UI patterns: search bars as hero elements, card grids of destinations as the primary layout, filter-first interfaces.
- **Don't** use soft wellness aesthetics: linen textures, serif-on-cream, muted sage, spa minimalism.
- **Don't** animate CSS layout properties (width, height, top, left). Use transform and opacity for motion.
- **Don't** gate content visibility behind a class-triggered animation without an already-visible default. Sections must render without JavaScript.
