---
name: Artisan Concierge
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
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#4d4c47'
  on-tertiary: '#ffffff'
  tertiary-container: '#65645f'
  on-tertiary-container: '#e4e1da'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2eca2'
  primary-fixed-dim: '#b6d088'
  on-primary-fixed: '#131f00'
  on-primary-fixed-variant: '#394d14'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2db'
  tertiary-fixed-dim: '#c9c6c0'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474742'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system for the AI Shopping Assistant is centered on the persona of a **Digital Concierge**. It avoids the common "high-tech" tropes of glowing blue orbs and neon gradients, opting instead for a **Sophisticated Minimalism** that feels like an extension of a high-end physical atelier.

The aesthetic is grounded in heritage and craftsmanship. It utilizes heavy whitespace, intentional editorial layouts, and subtle transitions to evoke a sense of calm, curated luxury. The goal is to provide an unobtrusive "human-in-the-loop" feel where the AI acts as a knowledgeable guide rather than a robotic tool.

## Colors
The palette is rooted in nature and prestige. 
- **Forest Green (#556B2F)**: The primary anchor, used for headers, primary actions, and branding elements to represent stability and organic quality.
- **Antique Gold (#D4AF37)**: The "Intelligence Accent." This color is used sparingly to denote AI-driven insights, recommendations, and the presence of the Concierge. It provides a warm, vibrant contrast to the green without appearing synthetic.
- **Parchment (#F4F1EA)**: The background neutral, softer than pure white, providing a gallery-like backdrop for product photography.
- **Carbon (#1A1A1A)**: Used for body text and high-contrast iconography to ensure absolute legibility.

## Typography
The system employs a classic serif/sans-serif pairing. **EB Garamond** provides the authoritative, literary voice required for a luxury concierge, used for all headlines and the AI's "spoken" dialogue. 

**Source Sans 3** provides functional clarity for product details, labels, and user inputs. The use of uppercase tracking for labels (`label-caps`) adds an extra layer of refinement and organizational structure to the interface.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to maintain a premium feel. The AI Concierge interface should never feel cramped; it utilizes a centered column for conversational threads to mimic the focus of a one-on-one consultation.

- **Desktop**: 12-column grid with 64px outer margins. Chat modules occupy the central 8 columns.
- **Mobile**: Single column with 16px margins. 
- **Rhythm**: Use an 8px base unit for all padding and margins to ensure mathematical harmony.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and extremely soft **Ambient Shadows**. 

- **Surface 0 (Parchment)**: The base canvas.
- **Surface 1 (White)**: Used for cards and chat bubbles. These elements feature a `0px 4px 20px rgba(85, 107, 47, 0.05)` shadow—a very faint green-tinted shadow that feels more natural than grey.
- **The Golden Glow**: AI-suggested items or the "active" concierge state utilize a subtle 1px border of **Antique Gold** or a soft outer glow to distinguish them from standard marketplace content.

## Shapes
The design system uses a **Soft (0.25rem)** roundedness. This minimal radius maintains a structured, professional appearance while removing the harshness of sharp corners. Large components like Product Cards or the Chat Container use `rounded-lg` (0.5rem) to feel more approachable.

## Components
### Conversational Interface
- **Concierge Bubbles**: Aligned left, using Forest Green text on a transparent background with a 1px Antique Gold left-border. Typography: `body-lg` in EB Garamond.
- **User Bubbles**: Aligned right, Parchment background with Forest Green text.
- **Input Field**: A single, elegant line with an "Ask the Concierge..." placeholder. No heavy boxes; just a thin Forest Green baseline.

### Suggested Product Cards
- **Structure**: Vertical layout. Large imagery, `headline-md` for the product title, and a `label-caps` price tag in Antique Gold.
- **Discovery Module**: A horizontal scroll of "Artisan Stories"—circular avatars of makers with a subtle gold ring indicating the AI's reason for the recommendation (e.g., "Matches your preference for sustainable oak").

### Interactive Elements
- **Buttons**: Primary buttons are solid Forest Green with White text. Secondary buttons are outlined in Forest Green.
- **Chips**: Small, `label-caps` style tags used for "Styles" or "Materials." When the AI suggests a tag, it transitions from Forest Green to Antique Gold.
- **Selection State**: High-contrast Forest Green checkmarks for checkboxes; radio buttons use a nested Antique Gold dot.