# hero-banner

A full-bleed hero banner designed for page tops, featuring a background image with an overlaid content stack: an optional eyebrow badge, a bold two-line headline, supporting body copy, two call-to-action buttons, and an optional row of three key stats beneath a divider. Use this block to make a strong visual first impression while surfacing primary navigation actions and proof-point metrics.

## Content Model

| Row | Field | Type | Description |
| --- | --- | --- | --- |
| 1 | Block name | — | `hero-banner` |
| 2 | eyebrow | Text | Small uppercase badge text with a leading dot icon *(optional)* |
| 3 | headline | Heading | Two-line bold headline |
| 4 | body | Text | Supporting paragraph copy below the headline |
| 5 | cta-primary | Link | Solid/filled primary call-to-action button |
| 6 | cta-secondary | Link | Outlined secondary call-to-action button *(optional)* |
| 7 | stats | Text | Row of 3 key stats, single cell, pipe-separated *(optional)* |

## Usage Example

| hero-banner |  |
| ----- | ----- |
| background-image.jpg |  |
| New · Now with AI insights |  |
| Ship Faster.<br>Scale Smarter. |  |
| Build, deploy, and monitor your applications with a platform designed for modern teams. |  |
| **[Get Started Free](/start)** |  |
| *[View Documentation](/docs)* |  |
| 10B+ Requests Served \| 99.99% Uptime SLA \| 3× Faster Page Loads |  |

### Minimal example (no eyebrow, no secondary CTA, no stats)

| hero-banner |  |
| ----- | ----- |
| background-image.jpg |  |
| Build Better.<br>Ship Faster. |  |
| The platform trusted by developers worldwide. |  |
| **[Get Started](/start)** |  |

## CTA Styling

The block supports two CTA styles, controlled by text formatting on the link:

- **Bold** the link text for the solid/primary button: `**[Get Started Free](/start)**`
- *Italicize* the link text for the outlined/secondary button: `*[View Documentation](/docs)*`

Both CTAs are optional individually, but at least one primary CTA is recommended. Omit `cta-secondary` entirely if not needed.

## Stats Row

The stats row is authored as a **single row, single cell**, with each of the three stats separated by `|`. Each stat should be written as a bold number followed by a short caption:

| hero-banner |
| ----- |
| **10B+**<br>Requests Served \| **99.99%**<br>Uptime SLA \| **3×**<br>Faster Page Loads |

Omit this row entirely if no stats are needed — the divider and stat row will not render.

## Variants

None. This block has a single fixed layout.

## Accessibility

- The background image is treated as decorative and rendered with an empty `alt` attribute (or `aria-hidden="true"`), since it does not convey content-critical information.
- A gradient/overlay layer is applied between the background image and the text content to maintain sufficient color contrast for readability.
- Both CTA buttons are standard focusable anchor elements, reachable via keyboard tab order, with a visible focus outline/state.
- The stats row uses semantic markup (e.g., `<dl>`/`<dt>`/`<dd>` or paired heading/caption elements) so screen readers correctly associate each stat number with its caption.