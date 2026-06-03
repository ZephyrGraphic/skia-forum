---
name: SKIA Hangout
colors:
  surface: '#f5fbf5'
  surface-dim: '#d5dcd6'
  surface-bright: '#f5fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5ef'
  surface-container: '#e9efe9'
  surface-container-high: '#e4eae4'
  surface-container-highest: '#dee4de'
  on-surface: '#171d19'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2c322e'
  inverse-on-surface: '#ecf2ec'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f5fbf5'
  on-background: '#171d19'
  surface-variant: '#dee4de'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system for this gaming community balances the tactical precision of a high-end RPG with the inviting atmosphere of a premium social lounge. It targets a dedicated player base that appreciates clarity, performance, and a polished aesthetic. 

The visual style is **Modern-Premium Gaming**. It departs from the "dark mode" cliches of gaming platforms by using a sophisticated "light-elevated" palette. The aesthetic leverages subtle glassmorphism for navigation, high-contrast typography, and multi-layered depth to create a sense of digital craftsmanship. The tone is professional and tactical yet vibrant, mirroring the strategic depth and colorful character art of the game.

## Colors

The palette is anchored by **Soft Slate (#f8fafc)** for the canvas, providing a low-strain, clean backdrop. **Emerald Forest (#059669)** serves as the primary action color, symbolizing growth and high-tier rarity. 

- **Primary (Emerald Forest):** Used for primary buttons, success states, and active navigation indicators.
- **Secondary (Deep Navy):** Reserved for high-priority typography and structural borders.
- **Tertiary (Electric Indigo):** Used for interactive states, badges, and level-up indicators to provide a "high-tech" spark.
- **Accent (Amber Gold):** Utilized sparingly for legendary status, pinned threads, or notification alerts.
- **Neutrals:** Crisp white surfaces ensure content readability against the slate background.

## Typography

This design system uses a dual-font strategy to balance character with utility. **Plus Jakarta Sans** is the voice of the brand, used for headlines and display text to provide a modern, geometric, and friendly "gamer" aesthetic. Its tight tracking and bold weights create an impactful hierarchy.

**Inter** is the workhorse for all forum discussions, guide content, and UI labels. It ensures maximum readability for long-form community posts and complex data tables (like hero stats). Letter spacing is slightly increased for labels to maintain a technical, clean appearance.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop, transitioning to a single-column stack for mobile devices. 

- **Desktop (1280px+):** 24px gutters and 40px outer margins. Content containers are centered with a maximum width of 1280px.
- **Tablet (768px - 1279px):** 16px gutters and 24px margins. Sidebars typically collapse or move to a bottom-sheet.
- **Mobile (<767px):** 12px gutters and 16px margins. Headlines scale down to the defined `-mobile` sizes.

Spacing follows a strict 4px base unit, with a preference for generous white space (xl/2xl) between major content blocks to avoid the cluttered feel typical of legacy forums.

## Elevation & Depth

Visual hierarchy is established through a combination of **Tonal Layering** and **Multi-layered Shadows**. 

1.  **The Canvas (Level 0):** Background (#f8fafc) remains static.
2.  **The Container (Level 1):** White containers use a subtle, 1px border (#e2e8f0) and a soft ambient shadow (0px 4px 20px rgba(15, 23, 42, 0.05)).
3.  **The Interactive (Level 2):** Hovered cards or active modals use a more pronounced, diffused shadow (0px 12px 32px rgba(15, 23, 42, 0.12)) to appear "lifted."
4.  **Glassmorphism:** The global navigation bar uses a backdrop blur (12px) with a semi-transparent white fill (80% opacity) and a thin Emerald Forest bottom border (2px) to signify its persistence and premium feel.

## Shapes

The shape language is defined by a **12px (0.75rem) standard radius**, which strikes a balance between professional geometry and modern softness.

- **Base Radius (rounded-md):** 12px for standard cards, input fields, and buttons.
- **Large Radius (rounded-lg):** 16px for main content containers and hero sections.
- **Extra Large (rounded-xl):** 24px for promotional banners or special "Legendary" hero cards.
- **Pill:** Reserved exclusively for tags, status chips, and search bars to differentiate them from actionable buttons.

## Components

### Buttons
Primary buttons use the Emerald Forest fill with white text. They feature a subtle transition: on hover, the background shifts slightly toward Electric Indigo, and the shadow deepens. Secondary buttons are outlined in Deep Navy with a transparent background.

### Cards
Cards are the primary content vessel. They must have a white background, 12px border radius, and the Level 1 shadow. Headers within cards should use Plus Jakarta Sans Bold.

### Input Fields
Inputs use a Soft Slate fill (#f1f5f9) with a 1px border. Upon focus, the border transitions to Emerald Forest and gains a subtle 2px glow.

### Chips & Badges
Chips for categories (e.g., "Guide", "Meta", "Showcase") use a desaturated version of the primary colors with a slightly darker text for accessibility. Active/Online indicators use a pulsing Emerald Forest dot.

### Navigation
The Top Bar is glassmorphic. Links use Deep Navy text, shifting to Emerald Forest with an underline transition on hover.

### Outlined Icons
All icons should be 2px stroke weight, outlined, and consistent in their geometric rounding to match the UI's 12px radius.