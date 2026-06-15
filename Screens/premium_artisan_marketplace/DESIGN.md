---
name: Premium Artisan Marketplace
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#45483c'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#75796b'
  outline-variant: '#c5c8b8'
  surface-tint: '#50652a'
  primary: '#3e5219'
  on-primary: '#ffffff'
  primary-container: '#556b2f'
  on-primary-container: '#d0eba1'
  inverse-primary: '#b6d088'
  secondary: '#625e52'
  on-secondary: '#ffffff'
  secondary-container: '#e9e2d2'
  on-secondary-container: '#686457'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2eca2'
  primary-fixed-dim: '#b6d088'
  on-primary-fixed: '#131f00'
  on-primary-fixed-variant: '#394d14'
  secondary-fixed: '#e9e2d2'
  secondary-fixed-dim: '#ccc6b7'
  on-secondary-fixed: '#1e1c12'
  on-secondary-fixed-variant: '#4a473b'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-lg: 48px
  stack-md: 24px
  stack-sm: 12px
---

## Brand & Style

The design system is anchored in the concept of "Handcrafted Luxury." It bridges the gap between raw, organic craftsmanship and high-end editorial sophistication. The brand personality is rooted in authenticity, heritage, and the tactile nature of artisan goods, evoking a sense of warmth and quiet confidence.

The design style is a blend of **Editorial Minimalism** and **Tactile Sophistication**. It prioritizes high-quality, large-scale imagery and intentional whitespace to allow individual products to breathe, treating each item as a piece of art rather than a commodity. Transitions should be fluid and paced, mirroring the slow, deliberate nature of the craft itself.

## Colors

The palette is derived from natural, earthy materials to reinforce the "Roots" narrative.

*   **Primary (Forest Green):** Used for primary actions, success states, and key brand moments. It represents growth and sustainability.
*   **Secondary (Soft Beige):** Used as a subtle surface color to soften the UI, moving away from "clinical" white to a more parchment-like warmth.
*   **Accent (Gold):** Reserved for highlights, luxury indicators (like "Limited Edition" badges), and delicate interactive states.
*   **Neutral:** A deep charcoal (#1A1A1A) is used for typography instead of pure black to maintain a softer, premium contrast.
*   **Background:** A very light off-white (#FCFAF7) serves as the canvas for the entire experience.

## Typography

This design system utilizes a high-contrast typographic pairing to signal luxury. 

**EB Garamond** (a classic Garamond alternative) is used for all headlines and display text. It should be set with generous line height and tight letter-spacing for large sizes to maintain an editorial feel.

**Inter** provides a clean, functional counterpoint for body copy and UI elements. Use "Regular" weight for most body text to ensure legibility against the warm background. All labels and overlines should use Inter in uppercase with slight letter-spacing to create a clear structural hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to ensure large-format photography remains framed and composed like a gallery.

*   **Grid:** 12-column grid with 24px gutters. 
*   **Margins:** Generous side margins (64px+) on desktop to emphasize the minimalist luxury aesthetic.
*   **Rhythm:** Vertical spacing should be ample. Use `stack-lg` (48px) between major sections to prevent visual clutter.
*   **Mobile:** Transition to a 4-column grid with 20px margins. Headlines should scale down significantly while body text remains legible.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. 

*   **Shadows:** Use extremely soft, low-opacity shadows (Opacity 4-8%) with a large blur radius (20px-40px). This creates a "lifted" effect rather than a harsh drop-shadow. Shadows should have a slight tint of the primary color (#556B2F) to keep them warm and organic.
*   **Surfaces:** Elements like cards or modals should sit on the secondary color (#EDE6D6) or a pure white surface to distinguish them from the base background.
*   **Glassmorphism:** Use subtle backdrop blurs (8px-12px) on navigation bars and floating action buttons to maintain context of the rich imagery beneath.

## Shapes

The shape language is approachable yet refined. 

*   **Base (8px):** Used for small interactive elements like checkboxes and small buttons.
*   **Standard (12px):** Default for input fields and smaller product cards.
*   **Large (24px):** Used for hero sections, large product containers, and imagery to create a soft, inviting frame.
*   **Interactive States:** Hovering over a card should slightly increase its elevation and scale (1.02x) rather than changing its border weight.

## Components

### Buttons
Primary buttons use the Forest Green background with white Inter Medium text. They should have a 12px corner radius. Secondary buttons use an outline of the primary color or the Gold accent for a "High Luxury" call to action.

### Product Cards
Cards are the centerpiece of the design system. They feature a full-width image with 24px top rounded corners. Below the image, the artisan's name is displayed in a `label-md` format, followed by the product title in `headline-sm`. The price should be subtle, never aggressive.

### Story-driven Sections
Full-bleed or wide-margin sections featuring a large image on one side and a text block on the other. The text block should utilize `display-lg` and `body-lg` to create a narrative feel.

### Input Fields
Inputs should be minimalist: a 1px border using a lightened version of the Forest Green, with 12px rounded corners. The focus state uses a 2px Gold border.

### Navigation
The top navigation is centered and spacious. Use the secondary color for the background with a backdrop blur. Icons should be thin-stroke (1.5px) to match the refinement of the typography.