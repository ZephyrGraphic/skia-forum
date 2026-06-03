---
name: SKIA Hangout
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1c'
  on-surface-variant: '#414844'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#54000a'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c0516'
  on-tertiary-container: '#ff807d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410006'
  on-tertiary-fixed-variant: '#8c1520'
  background: '#fcf9f8'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  meta-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style

The design system for this community platform prioritizes clarity, strategy, and utility, reflecting the tactical nature of idle RPG gaming. The aesthetic is **Modern Minimalist** with a "Tactical Premium" edge—moving away from the typical neon-heavy "gamer" tropes in favor of an organized, editorial look that feels like a high-end documentation hub or a refined community board.

The target audience consists of dedicated players seeking optimization guides, patch notes, and community discussion. The UI should evoke a sense of calm focus and strategic organization. Every element is intentional, avoiding decorative "blobs" or unnecessary transparency to ensure that information density remains high without feeling cluttered.

## Colors

The palette is grounded in a warm, sophisticated foundation. The primary **Deep Forest Green** (#1B4332) provides an authoritative and premium feel, used for primary actions and navigation headers. 

- **Background:** A soft off-white (#FDFCFB) reduces eye strain during long reading sessions.
- **Surfaces:** Pure white (#FFFFFF) is reserved for cards, thread containers, and input fields to create a clear layer of separation from the canvas.
- **Typography:** Dark charcoal (#1F1F1F) ensures high legibility, while muted gray (#6B7280) is used for metadata, timestamps, and secondary descriptions.
- **Category Accents:** Gold, Coral, Violet, and Emerald are used sparingly as category indicators (labels/pills) to help users scan thread lists quickly without overwhelming the minimal aesthetic.

## Typography

This design system utilizes **Inter** for all roles to maintain a systematic, utilitarian appearance. The type hierarchy is strictly defined to handle information-dense layouts like forum threads and data tables.

- **Headlines:** Use tighter letter-spacing and heavier weights to create a strong visual anchor.
- **Body Text:** Optimized for long-form reading with a generous 1.6x line height for guide content.
- **Labels:** Small caps or bold uppercase are used for category tags and interface actions to distinguish them from editorial content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain the "community board" structure, while transitioning to a fluid model for mobile.

- **Grid:** A 12-column grid is used for the main content area. A typical view consists of a 3-column sidebar (navigation/categories) and a 9-column main feed.
- **Rhythm:** An 8px-based spacing system ensures consistency.
- **Density:** While whitespace is used to separate major sections, internal component padding is kept tight (sm/md) to allow users to see more threads or data points at once, mimicking the efficient layout of tools like Discord.
- **Breakpoints:** 
  - Mobile (< 768px): Single column, hidden sidebar (drawer), reduced margins (16px).
  - Desktop (> 1024px): Multi-column with fixed max-width container (1280px).

## Elevation & Depth

This design system avoids heavy shadows and floating effects, favoring a **Tonal Layering** and **Low-Contrast Outline** approach.

- **Depth:** Content sits on the background (#FDFCFB). Cards and surfaces (#FFFFFF) are visually separated by a 1px solid border (#E5E7EB) rather than drop shadows.
- **State Changes:** Hover states on threads or buttons should result in a subtle background color shift (e.g., White to a very light Gray) or a slight border-color darkening, rather than an increase in elevation.
- **Interaction:** Active navigation items use a vertical 3px accent bar of the Primary Green to denote focus without adding physical depth.

## Shapes

The shape language is "Soft-Tactical." A consistent **6px to 8px radius** is applied to all primary containers, buttons, and input fields. This provides a modern, approachable feel while maintaining the structural integrity of a grid-based information layout.

- **Pills:** Used exclusively for tags and status indicators to contrast against the rectangular nature of the content cards.
- **Avatars:** Circular avatars provide a organic break from the rigid grid, making the community feel more human.

## Components

- **Buttons:** Primary buttons are solid Deep Forest Green with white text. Secondary buttons use a 1px border with the Primary Green text. No gradients.
- **Thread Cards:** Use a flat white background, 1px border, and 8px border radius. Titles use `headline-md`. Metadata (author, time, category) uses `meta-sm` in muted gray.
- **Category Chips:** Small, semi-pill shapes. Use a 10% opacity background of the accent color (Gold, Coral, etc.) with a 100% opacity text color of the same hue for maximum legibility and "tactical" clean look.
- **Input Fields:** Minimalist design with a light gray border that transitions to the Primary Green on focus. Labels sit clearly above the field in `label-md`.
- **List Items:** Community boards should look like "Rows." Each row should have a subtle hover effect and a clear divider line (1px) between items.
- **Navigation Sidebar:** Discord-inspired vertical layout. Icons are paired with text. Active states use a "background-fill" of 5% Forest Green and a bolded text weight.