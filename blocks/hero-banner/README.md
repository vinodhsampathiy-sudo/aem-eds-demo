# hero-banner

A full-width hero banner designed for quality engineering platforms. It features a layered composition with an optional full-bleed background image, a pill-shaped eyebrow label, a large bold headline, supporting body copy, dual call-to-action buttons, and an optional stats strip displaying key platform metrics. The block renders over a deep blue-to-purple gradient with decorative radial and arc graphic elements, and is available in a `dark` variant that reinforces the gradient treatment with white text and arc overlays.

---

## Content Model

Authors build this block as a table in Google Docs or Microsoft Word. Each row maps to a distinct content zone. The stats strip at the bottom is a **repeating collection** — add one row per stat, each row containing the stat value and its label in separate columns. Add or remove stat rows to add or remove stats.

| Field | Row | Type | Required | Notes |
|---|---|---|---|---|
| `background-image` | Row 2 | Image | Optional | Full-bleed image; content overlays it |
| `eyebrow` | Row 3 | Text | Optional | Renders as a pill-shaped label above the headline |
| `headline` | Row 4 | Heading (H1) | Required | Large bold primary headline |
| `body-text` | Row 5 | Paragraph | Required | Supporting value proposition copy |
| `cta-primary` | Row 6 | Link | Required | Solid filled button — **bold** the link text |
| `cta-secondary` | Row 7 | Link | Optional | Outlined/ghost button — *italicize* the link text |
| `stat-value` + `stat-label` | Row 8+ | Text \| Text | Optional | One row per stat; repeat rows to add more stats |

---

## Usage Example

### Basic hero-banner (no background image, no stats)

| hero-banner | |
| --- | --- |
| Quality Engineering Platform | |
| Ship faster. Break nothing. | |
| Automate your entire testing lifecycle with AI-powered quality engineering — from unit tests to production monitoring. | |
| **[Get Started Free](/start)** | *[Book a Demo](/demo)* |

---

### Full hero-banner (with background image and stats)

| hero-banner | |
| --- | --- |
| /assets/hero-bg.jpg | |
| Quality Engineering Platform | |
| Ship faster. Break nothing. | |
| Automate your entire testing lifecycle with AI-powered quality engineering — from unit tests to production monitoring. | |
| **[Get Started Free](/start)** | *[Book a Demo](/demo)* |
| 10B+ | Tests Executed Monthly |
| 99.99% | Uptime SLA |
| 3× | Faster Release Cycles |

> **Stats rows:** Each row is one stat. The first column is the large bold value (`10B+`, `99.99%`, `3×`) and the second column is the short caption label. Add or remove rows to add or remove stats.

---

## CTA Button Styling

The block supports two CTA buttons with distinct visual treatments controlled by text formatting in the document:

| Style | How to author | Renders as |
|---|---|---|
| Primary (solid filled) | **Bold** the link text: `**[Get Started Free](/start)**` | Solid filled button |
| Secondary (outlined/ghost) | *Italicize* the link text: `*[Book a Demo](/demo)*` | Outlined ghost button |
| Plain text link | Leave the link unformatted | Unstyled hyperlink |

---

## Variants

### `dark` (default treatment)

The dark variant renders the banner with a deep blue-to-purple gradient background, white text, and decorative radial/arc graphic overlays. This is the primary intended style for the hero-banner block.

To apply, append `dark` to the block name in the first row of the table:

| hero-banner dark | |
| --- | --- |
| Quality Engineering Platform | |
| Ship faster. Break nothing. | |
| Automate your entire testing lifecycle with AI-powered quality engineering — from unit tests to production monitoring. | |
| **[Get Started Free](/start)** | *[Book a Demo](/demo)* |
| 10B+ | Tests Executed Monthly |
| 99.99% | Uptime SLA |
| 3× | Faster Release Cycles |

---

## Accessibility Notes

- **Eyebrow label:** If the eyebrow pill text is rendered in all-uppercase CSS (`text-transform: uppercase`), the underlying HTML should use mixed-case text so screen readers announce it naturally. If the source text is already all-caps, add a visually hidden `aria-label` with the properly cased version.
- **Decorative graphics:** The background gradient, radial glows, and arc overlay elements are purely decorative. They must carry `aria-hidden="true"` so screen readers skip them entirely.
- **Background image:** If a background image is provided and contains meaningful content, supply descriptive `alt` text on the `<img>` element. If it is purely decorative, use `alt=""`.
- **CTA buttons:** Both call-to-action links must have descriptive, self-contained labels. Labels such as "Get Started Free" and "Book a Demo" are already descriptive. Avoid generic labels like "Click here" or "Learn more" without additional context.
- **Stats strip:** The stats section should be implemented using a definition list (`<dl>`) with each stat value in a `<dt>` and its caption in a `<dd>`, or as an unordered list with visually hidden connective text (e.g., "10B+ tests executed monthly"), so screen reader users receive the full meaning of each metric.
- **Color contrast:** White text on the blue-to-purple gradient background must meet WCAG AA minimum contrast ratios — 4.5:1 for normal-weight body text and eyebrow labels, and 3:1 for large bold text (headline and stat values). Validate contrast across the full gradient range, including the lightest purple end.
- **Heading hierarchy:** The hero headline must be an `<h1>`. Ensure only one `<h1>` exists per page when this block is used.