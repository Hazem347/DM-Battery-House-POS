---
name: Industrial Vitality
colors:
  surface: '#f7f9ff'
  surface-dim: '#c9dcf3'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf4ff'
  surface-container: '#e3efff'
  surface-container-high: '#d9eaff'
  surface-container-highest: '#d1e4fb'
  on-surface: '#091d2e'
  on-surface-variant: '#42474f'
  inverse-surface: '#203243'
  inverse-on-surface: '#e8f2ff'
  outline: '#727780'
  outline-variant: '#c2c7d1'
  surface-tint: '#2d6197'
  primary: '#00355f'
  on-primary: '#ffffff'
  primary-container: '#0f4c81'
  on-primary-container: '#8ebdf9'
  inverse-primary: '#a0c9ff'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#4b2d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a4100'
  on-tertiary-container: '#ffa725'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#07497d'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#ffb961'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#663e00'
  background: '#f7f9ff'
  on-background: '#091d2e'
  surface-variant: '#d1e4fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered to convey **Technical Precision** and **Reliable Energy**. It targets both retail consumers looking for automotive solutions and industrial partners managing solar or UPS infrastructure. The brand personality is authoritative yet accessible, positioning the company as an expert in power storage.

The aesthetic follows a **Corporate / Modern** direction with **Glassmorphism** accents. It utilizes high-fidelity layouts characterized by generous white space, subtle depth, and a systematic approach to information density. The goal is to evoke a sense of stability (Deep Blue) and renewable future (Battery Green), ensuring the user feels their critical power needs are in professional hands.

## Colors

The palette is rooted in industry-standard signals for trust and energy. 

- **Primary (Deep Blue):** Used for headers, primary actions, and brand-heavy backgrounds. It establishes the "anchor" of the interface.
- **Secondary (Battery Green):** Reserved for status indicators (Full/Healthy), sustainability-related metrics, and success states.
- **Accent (Orange):** Used sparingly for "Order Now" CTAs, low-battery alerts, or critical maintenance warnings.
- **Neutrals:** Dark Slate is the primary text color in light mode to ensure high legibility without the harshness of pure black.

**Mode Handling:**
- **Light Mode:** Uses the Light Gray (#F8F9FA) for page backgrounds with white cards to create a subtle layered effect.
- **Dark Mode:** Transitions to a deep Navy/Slate background (#0B1117) with semi-transparent card overlays to maintain the glassmorphic feel.

## Typography

The design system utilizes **Inter** exclusively to maintain a functional, systematic, and utilitarian appearance. The typeface is chosen for its exceptional legibility in data-heavy environments like POS interfaces and analytics dashboards.

- **Scale:** High contrast between display titles and body text to guide users through technical specifications.
- **Micro-copy:** Small labels use an increased letter spacing and semi-bold weight to remain legible on hardware status chips.
- **Data Visualization:** Tabular numbers should be used for battery voltage, capacity, and pricing to ensure vertical alignment in tables.

## Layout & Spacing

The layout follows a **12-column Fluid Grid** system for web and a **4-column grid** for mobile. 

- **Spacing Rhythm:** Based on an 8px baseline grid to ensure mathematical consistency across components.
- **Safe Zones:** Use 24px gutters to allow technical data in tables and cards to "breathe," preventing visual clutter in dense POS screens.
- **Breakpoints:** 
  - Mobile: < 600px (Margins: 16px)
  - Tablet: 600px - 1024px (Margins: 32px)
  - Desktop: > 1024px (Margins: 48px, Max-width: 1280px)

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** supplemented by **Glassmorphism** for temporary overlays.

- **Base Layer:** The page background (Light Gray or Deep Navy).
- **Surface Layer:** White or Dark Slate cards with a very soft, 1px border (#E9ECEF) and no shadow for a flat, modern look.
- **Elevated Layer (Hover/Active):** Subtle, extra-diffused shadows (e.g., `box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05)`) to indicate interactivity.
- **Glassmorphism:** Navigation bars and modal backdrops use a `backdrop-filter: blur(12px)` with a 70% opacity fill of the surface color. This maintains context while focusing the user on the task at hand.

## Shapes

The design system uses **Rounded** geometry (8px / 0.5rem base) to balance the industrial nature of the products with a modern, approachable software feel.

- **Standard Components:** Buttons, Input fields, and Cards use the 8px radius.
- **Contextual Shapes:** Progress bars for battery life and small status tags use **Pill-shaped** (rounded-xl) geometry to distinguish them from structural layout elements.
- **Icons:** Use a 1.5pt stroke weight with slightly rounded caps to match the typography.

## Components

### Buttons
- **Primary:** Deep Blue background, white text. Solid, high-contrast.
- **Secondary:** Transparent with a Battery Green border and text. Used for "Download Specs" or "View Details."
- **Ghost:** Minimal padding, subtle hover background for utility actions in the POS.

### Product Cards
Cards feature a top-aligned image area, followed by a semi-bold title and a dedicated "Status Bar" at the bottom showing stock availability using the Secondary (Green) or Accent (Orange) colors.

### Input Fields
Clean, outlined inputs. On focus, the border shifts to Primary Blue with a subtle 2px outer glow. Labels are always persistent (never hidden by placeholders) to assist in professional data entry.

### Analytics & Data Visualization
- **Charts:** Use a mix of Primary Blue and Secondary Green gradients.
- **Data Tables:** Stripped rows with zero borders except for a header separator. High-density row heights (40px) for POS efficiency.

### Navigation
A top-fixed glassmorphic bar. On scroll, the opacity increases. Brand logo is placed on the far left, with high-priority links like "Product Catalog" and "Solar Solutions" emphasized with weight rather than color.