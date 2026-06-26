---
name: Academic Kinetic
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#5a413e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#8e706d'
  outline-variant: '#e2beba'
  surface-tint: '#b22a25'
  primary: '#6e0006'
  on-primary: '#ffffff'
  primary-container: '#941113'
  on-primary-container: '#ffa095'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#00258f'
  on-tertiary: '#ffffff'
  tertiary-container: '#0037c5'
  on-tertiary-container: '#a7b5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#900d10'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c3ff'
  on-tertiary-fixed: '#001356'
  on-tertiary-fixed-variant: '#0035be'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  institutional-red: '#941113'
  electric-blue: '#2E5BFF'
  deep-grey: '#333333'
  success-green: '#28A745'
  warning-yellow: '#FFC107'
  caution-orange: '#FD7E14'
  white: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for the "UNDesparche" platform, serving the vibrant community of the National University of Colombia (UNAL). It bridges the gap between the university's storied institutional heritage and the energetic, fast-paced life of its students and faculty.

The design style is **Corporate / Modern** with a **High-Contrast** edge. It leverages a rigorous grid and structural clarity to ensure accessibility, while injecting "university energy" through sharp typography and a punchy accent palette. The aesthetic is clean, functional, and authoritative, yet feels digitally native and dynamic rather than bureaucratic.

**Target Audience:**
- Students seeking extracurricular engagement and resource management.
- Administrative staff requiring efficient, high-utility oversight tools.
- Faculty members interacting with campus events.

**Emotional Response:**
Reliable, Empowering, Academic, and Efficient.

## Colors

The palette is anchored by the **Institutional Red**, ensuring immediate brand recognition. To modernize the interface and provide clear interactive affordances, a **Vibrant Electric Blue** is introduced as the primary action color.

- **Primary (Institutional Red):** Reserved for brand headers, institutional identity elements, and destructive actions.
- **Secondary (Dark Grey):** Used for primary text and grounding elements to ensure high legibility.
- **Tertiary (Electric Blue):** The "Interactive Engine." This color is used exclusively for primary CTAs, links, and active states to differentiate "Brand" from "Action."
- **Neutral:** A range of cool greys and pure white to maintain a clean, scholarly workspace.

**Status Palette:**
A dedicated semantic palette is used for equipment and event tracking:
- **Available/Ongoing/Active:** Success Green.
- **Reserved:** Warning Yellow.
- **Borrowed:** Caution Orange.
- **Canceled/Unavailable/Sanctioned:** Institutional Red.

## Typography

This design system uses a pairing that reflects both history and modernity. 

- **Headlines (Newsreader):** A sophisticated serif that brings academic authority and literary character. It should be used for all page titles and section headers to provide a "University Press" feel.
- **Body & UI (Hanken Grotesk):** A sharp, contemporary sans-serif chosen for its exceptional readability on screens. It handles data-heavy tables and functional labels with precision.

**Implementation Notes:**
- Use **Display Bold** for page-level titles to create a strong visual anchor.
- Maintain generous line heights (1.5x) for body text to ensure accessibility for long-form academic content.
- Small labels (like status badges) should use the semi-bold or bold weight of Hanken Grotesk for clarity at small scales.

## Layout & Spacing

The system utilizes a **Fixed Grid** approach for desktop to maintain a structured, editorial feel, transitioning to a **Fluid Grid** for mobile devices.

- **Desktop (1280px+):** 12-column grid with 24px gutters. Content is centered with a 40px minimum outer margin.
- **Tablet (768px - 1279px):** 8-column grid with 20px gutters. 24px margins.
- **Mobile (<767px):** 4-column grid with 16px gutters and 16px margins.

**Rhythm:**
A strict 8px spacing scale is enforced. All padding, margins, and component heights must be multiples of 8px (e.g., 8, 16, 24, 32, 48, 64) to maintain mathematical harmony and visual balance across the platform.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** supplemented by **Ambient Shadows**.

1.  **Background (Level 0):** The base surface uses the Neutral White (#FFFFFF) or very light grey (#F8F9FA) for app backgrounds.
2.  **Cards & Containers (Level 1):** Elements like event cards and equipment lists use a white surface with a very soft, diffused shadow (Blur: 12px, Y: 4px, Opacity: 6%, Tinted with the secondary grey).
3.  **Interactive Hover (Level 2):** On hover, cards should slightly lift. The shadow becomes more pronounced (Blur: 20px, Y: 8px, Opacity: 10%), creating a tactile "click-ready" feel.
4.  **Navigation & Overlays (Level 3):** Fixed headers and modals use a medium shadow and a subtle 1px border (#E9ECEF) to separate them from the content beneath.

For administrative sidebars, use a flat **Tonal Layering** approach (a slightly darker neutral background) rather than shadows to emphasize utility and structure.

## Shapes

The shape language is **Soft (0.25rem / 4px)**. This choice reflects a professional, systematic environment where "too round" (pill-shaped) would feel overly casual, and "sharp" (0px) would feel too harsh or dated.

- **Standard Elements:** 4px radius for buttons, input fields, and small badges.
- **Large Elements (Cards/Modals):** 8px (rounded-lg) to provide a gentle container for content.
- **Icons:** Should follow a linear, 2px stroke weight to match the clean lines of the Hanken Grotesk typeface.

## Components

### Buttons
- **Primary:** Electric Blue background, White text. High contrast for key user actions (e.g., "Reserve Now").
- **Secondary:** Transparent background with a 2px stroke in Deep Grey. Used for alternative actions.
- **Destructive:** Institutional Red background or stroke. Reserved for "Cancel" or "Delete" actions.

### Status Badges
Badges are small, rectangular with 4px corners, utilizing a light background tint of the status color with high-contrast dark text (e.g., Light Green background with Dark Green text) to ensure readability and accessibility.
- **Events:** Programmed (Blue), Ongoing (Green), Finished (Grey), Canceled (Red).
- **Equipment:** Available (Green), Reserved (Yellow), Borrowed (Orange), Unavailable (Red).

### Navigation
- **Header:** Features the UNAL institutional shield and wordmark on the left. High-contrast white background with a thin Red accent line at the very top.
- **Admin Sidebar:** Uses a vertical layout with "Deep Grey" text on a "Neutral" light grey background. Active states are indicated by an Electric Blue vertical bar on the left edge of the menu item.

### Cards
Cards for events and equipment must include:
- A clear header using **Headline-md** (Newsreader).
- A dedicated area for the Status Badge.
- Meta-information (Date, Location, User) in **Label-md** (Hanken Grotesk).
- Subtle 1px border and Level 1 elevation.

### Inputs & Forms
Forms should use 4px rounded corners and a 1px Deep Grey border that thickens to 2px Electric Blue on focus. Labels always sit above the input field in **Label-md** for maximum clarity.