---
name: UNAL Recreation Identity
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
  on-surface-variant: '#42474f'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737780'
  outline-variant: '#c2c6d0'
  surface-tint: '#376090'
  primary: '#002241'
  on-primary: '#ffffff'
  primary-container: '#003865'
  on-primary-container: '#7ba2d5'
  inverse-primary: '#a1c9ff'
  secondary: '#436900'
  on-secondary: '#ffffff'
  secondary-container: '#bcf46d'
  on-secondary-container: '#486f00'
  tertiary: '#3b1800'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b2901'
  on-tertiary-container: '#d98f5f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a1c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#1b4876'
  secondary-fixed: '#bcf46d'
  secondary-fixed-dim: '#a1d754'
  on-secondary-fixed: '#111f00'
  on-secondary-fixed-variant: '#324f00'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#ffb689'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#6f380f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  unal-blue-dark: '#00213B'
  unal-green-muted: '#A5D165'
  status-error: '#C62828'
  status-warning: '#EF6C00'
  status-info: '#0277BD'
typography:
  display-lg:
    fontFamily: Arimo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Arimo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Arimo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Arimo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Arimo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Arimo
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Arimo
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Arimo
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system establishes a visual language that balances the prestigious, institutional heritage of the Universidad Nacional de Colombia with the dynamic energy of sports and recreation. The aesthetic is **Corporate Modern**, prioritizing clarity, accessibility, and functional efficiency. 

The personality is authoritative yet welcoming—evoking the reliability of a national institution while providing an approachable interface for student and faculty wellness. The style utilizes a structured layout, high-contrast typography, and a "clean card" approach to organize diverse recreational services into a cohesive digital ecosystem.

## Colors

The palette is anchored by **Institutional Blue**, representing stability and academic rigor. **UNAL Green** serves as the primary functional accent, symbolizing growth, health, and vitality—essential for a recreation platform.

- **Primary (Institutional Blue):** Used for navigation, headers, and primary actions to reinforce the university's presence.
- **Secondary (UNAL Green):** Used for success states, highlights, and health-related CTA buttons.
- **Neutral:** A clean, cool gray-white background ensures content readability and a spacious feel.
- **Semantic Colors:** Error and Warning states are derived from the same saturation levels as the brand colors to ensure a harmonious look even during alerts.

## Typography

The design system utilizes **Arimo** for all textual hierarchies. Its neutral, functional, and highly legible characteristics reflect the university's institutional standards.

- **Scale:** A mathematical scale ensures clear hierarchy from large display banners to dense data tables.
- **Weight:** Headlines use Bold (700) or Semi-Bold (600) to command attention. Body text is kept at Regular (400) for maximum legibility in long-form content.
- **Responsiveness:** Large headlines transition to mobile-specific sizes to prevent layout breaking on smaller devices while maintaining impact.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is centered within a 1280px container on desktop, while margins and gutters adapt fluidly on smaller viewports.

- **Grid:** A 12-column grid is standard for desktop, collapsing to 4 columns for mobile.
- **Rhythm:** Spacing is strictly based on an 8px base unit. Component padding should favor `16px` (2x) and `24px` (3x) to create a clean, organized breathing space.
- **Alignment:** Consistent use of horizontal margins ensures that the institutional logo and primary content always align perfectly, reinforcing the professional structure.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layers** and **Ambient Shadows**. This approach keeps the UI modern and clean without the clutter of heavy skeuomorphism.

- **Surface Levels:** The primary background uses the neutral off-white. Secondary surfaces (like sidebars) use pure white to pop forward.
- **Shadows:** Use extra-diffused, low-opacity shadows (Blur: 12px, Y: 4px, Opacity: 6% Black) for interactive cards. This creates a subtle "lift" that indicates clickability.
- **Interactive States:** On hover, cards should increase their elevation slightly (Blur: 20px, Y: 8px) to provide immediate tactile feedback.

## Shapes

The design system employs a **Soft** shape language. This subtly rounds the edges of functional elements to make the interface feel more modern and less rigid, without losing its institutional character.

- **Base Radius:** 0.25rem (4px) for small components like checkboxes and input fields.
- **Component Radius:** 0.5rem (8px) for buttons and cards, striking a balance between precision and approachability.
- **Large Radius:** 0.75rem (12px) for featured promotional banners or modal containers.

## Components

### Buttons
- **Primary:** Solid Institutional Blue with white text. High-contrast and authoritative.
- **Secondary:** Outlined Blue or Solid Green for specific "Positive Action" items (e.g., "Book Now").
- **Ghost:** Transparent background with Blue text for secondary navigation or "Cancel" actions.

### Cards
- **Structure:** Pure white background, subtle border (#E0E0E0), and the defined ambient shadow.
- **Content:** Information is grouped logically with `label-lg` for categories and `headline-md` for activity titles.

### Forms & Inputs
- **Fields:** Subtle gray background (#F1F3F4) with a 1px border. Focus states use a 2px Institutional Blue outline.
- **Feedback:** Error messages appear in `status-error` red with a corresponding icon for accessibility.

### Universal Icons
- Use a single-weight, geometric icon set (e.g., Material Symbols Outlined). Icons must be used consistently: 24px for standard UI and 32px for featured category blocks.

### Chips & Badges
- Used for sports categories (e.g., "Tennis", "Pool"). These should use light tints of the primary colors with dark text to maintain legibility while categorizing content.