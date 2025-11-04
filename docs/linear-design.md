Linear Light DaisyUI Theme Configuration
Design Overview
Linear's light theme features a clean, high-contrast look with near-white backgrounds, dark text, and a signature desaturated purple accent
linear.app
. The palette is based on Linear’s brand colors, including Mercury White (#F4F5F8) as a soft, cool-toned background and Nordic Gray (#222326) as a nearly black text color
linear.app
. In the 2023 refresh, Linear increased contrast by using darker text in light mode
linear.app
, so this theme uses very dark gray for base-content to ensure readability. All colors are provided in the OKLCH color space for perceptual uniformity, reflecting Linear’s adoption of LCH for theming
linear.app
.
Color Palette (OKLCH)
Base Colors: Three progressively darker neutrals for backgrounds. --color-base-100 is the lightest, an off-white near Mercury White
linear.app
, with base-200 and base-300 slightly deeper grays for elevated surfaces. --color-base-content is a dark nearly-black for text on base backgrounds, matching Nordic Gray
linear.app
.
Primary & Secondary: The primary brand color is Linear’s “Magic Blue” (a muted purple-blue) used for highlights and primary actions
linear.app
. It appears as --color-primary. A secondary accent is defined as a more blue-leaning variant for optional use. Both primary and secondary have ...-content set to white for contrast on their mid-tone backgrounds.
Accent: A lighter purple accent is included for subtle emphasis (e.g. selection highlights). It has higher lightness and lower chroma, appearing as a pastel lavender. Its ...-content is a dark text color (nearly the same as base-content) to ensure readability on the light accent background.
Neutral: A neutral gray is provided for non-accented UI elements like borders or container backgrounds. In the light theme this is a medium-light gray (--color-neutral) that will be visible against white. Its content color is dark (same as base-content) since the neutral background is light.
Semantic Colors: Informational blue, success green, warning amber, and error red are configured as in Linear’s design. These are fairly vibrant, high-contrast pastel backgrounds with dark content for accessibility. For example, info uses a bright azure blue background with nearly black text
hextoral.com
. Success, warning, and error follow the same pattern (green, gold, and red respectively) with --color-...-content all using dark text for legibility.
Borders, Radius, and Depth
Linear’s interface uses subtle 1px borders and slightly rounded corners for a modern feel. We use a 1px base border (--border: 1px) and apply moderate border-radius values:
Selector elements (like buttons or dropdowns): --radius-selector: 0.75rem (around 12px) for a smoother pill-shaped curve.
Input fields and smaller components: --radius-field: 0.5rem (8px).
Containers/boxes: --radius-box: 0.75rem for consistency with larger interactive elements.
These radii reflect Linear’s soft but defined corner styling. The --depth: 0.1 property provides a light elevation shadow, since Linear favors minimal depth (just enough to distinguish layers). A slight interface noise (--noise: 0.6) is included to mimic the subtle texture in Linear’s backgrounds and shadows, keeping the UI from feeling flat. Below is the complete DaisyUI theme configuration for Linear Light, expressed with the @plugin "daisyui/theme" syntax. All colors are in OKLCH format with lightness (%), chroma, and hue (deg), accurately capturing Linear’s light mode color system:
@plugin "daisyui/theme" {
	name: 'linear-light';
	default: true;
	prefersdark: false;
	color-scheme: 'light';
	--color-base-100: oklch(97% 0.004 271);
	--color-base-200: oklch(95% 0.007 277);
	--color-base-300: oklch(90% 0.008 277);
	--color-base-content: oklch(26% 0.006 271);
	--color-primary: oklch(57% 0.16 275);
	--color-primary-content: oklch(100% 0 0);
	--color-secondary: oklch(55% 0.14 265);
	--color-secondary-content: oklch(100% 0 0);
	--color-accent: oklch(80% 0.08 285);
	--color-accent-content: oklch(26% 0.02 285);
	--color-neutral: oklch(80% 0.01 270);
	--color-neutral-content: oklch(26% 0.006 270);
	--color-info: oklch(67% 0.2 240);
	--color-info-content: oklch(20% 0.05 240);
	--color-success: oklch(65% 0.23 150);
	--color-success-content: oklch(20% 0.05 150);
	--color-warning: oklch(75% 0.22 90);
	--color-warning-content: oklch(20% 0.04 90);
	--color-error: oklch(60% 0.26 25);
	--color-error-content: oklch(20% 0.05 25);
	--radius-selector: 0.75rem;
	--radius-field: 0.5rem;
	--radius-box: 0.75rem;
	--size-selector: 0.25rem;
	--size-field: 0.25rem;
	--border: 1px;
	--depth: 0.1;
	--noise: 0.6;
}
Sources: Linear brand guidelines for color values
linear.app
linear.app
; Linear changelog and design notes on theme design
linear.app
linear.app
; DaisyUI theme structure reference
daisyui.com
daisyui.com
.
Citations

Brand Guidelines – Linear

https://linear.app/brand

Brand Guidelines – Linear

https://linear.app/brand

How we redesigned the Linear UI (part Ⅱ) - Linear

https://linear.app/now/how-we-redesigned-the-linear-ui

How we redesigned the Linear UI (part Ⅱ) - Linear

https://linear.app/now/how-we-redesigned-the-linear-ui

Brand Guidelines – Linear

https://linear.app/brand

Brand Guidelines – Linear

https://linear.app/brand

Color #F4F5F8

https://hextoral.com/hex-colors/color-code-details/f4f5f8/

Custom Themes – Changelog

https://linear.app/changelog/2020-12-04-themes

Colors — daisyUI Tailwind CSS Component UI Library

https://daisyui.com/docs/colors/?lang=en

Colors — daisyUI Tailwind CSS Component UI Library

https://daisyui.com/docs/colors/?lang=en
