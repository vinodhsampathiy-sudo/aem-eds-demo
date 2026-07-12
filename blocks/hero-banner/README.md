# hero-banner

A full-width hero banner designed for quality engineering platforms. It features a small eyebrow pill label, a primary headline, supporting body copy, dual call-to-action buttons, and an optional row of key metric stats displayed below the CTAs. The block supports a `dark` variant that renders a dark blue-to-purple gradient background with white text and decorative radial graphic elements, making it well suited for high-impact landing page headers.

---

## Content Model

Authors build this block as a table in Google Docs or Microsoft Word. Each row maps to a distinct content zone. The stats row is a **repeating collection** — add one row per stat, each with two columns (value and label). Add or remove stat rows to add or remove stats.

| Row | Zone | Field | Notes |
|-----|------|-------|-------|
| 1 | Block name | `hero-banner` or `hero-banner dark` | Add `dark` for the gradient variant |
| 2 | `eyebrow` | Short pill label text | Optional |
| 3 | `headline` | Primary `H1` headline | Required |
| 4 | `body-text` | Supporting paragraph | Required |
| 5 | `cta-primary` | Primary CTA link | Bold the link text for a solid button |
| 6 | `cta-secondary` | Secondary CTA link | Italicize the link text for an outlined/ghost button; optional |
| 7+ | `stats` | One row per stat: **stat-value** \| **stat-label** | Repeating; optional. Add or remove rows to add or remove stats |

---

## Usage Example

### Standard (light) variant

| hero-banner | |
| --- | --- |
| Quality Engineering Platform | |
| Ship Faster. Break Nothing. | |
| Automate your entire testing lifecycle — from unit tests to end-to-end coverage — with AI-assisted quality engineering built for modern DevOps teams. | |
| **[Start Free Trial](/start)** | *[See How It Works](/demo)* |
| 10B+ | Tests Executed |
| 99.99% | Uptime SLA |
| 3× | Faster Release Cycles |

---

### Dark gradient variant

Add `dark` to the block name in the first cell to enable the dark blue-to-purple gradient background with decorative radial graphic elements.

| hero-banner dark | |
| --- | --- |
| Quality Engineering Platform | |
| Ship Faster. Break Nothing. | |
| Automate your entire testing lifecycle — from unit tests to end-to-end coverage — with AI-assisted quality engineering built for modern DevOps teams. | |
| **[Start Free Trial](/start)** | *[See How It Works](/demo)* |
| 10B+ | Tests Executed |
| 99.99% | Uptime SLA |
| 3× | Faster Release Cycles |

---

### Minimal (no eyebrow, no stats)

| hero-banner dark | |
| --- | --- |
| Ship Faster. Break Nothing. | |
| Automate your entire testing lifecycle with AI-assisted quality engineering built for modern DevOps teams. | |
| **[Start Free Trial](/start)** | *[See How It Works](/demo)* |

---

## Stats — Repeating Collection

The stats section is a repeating collection. Each row after the CTA rows represents one stat tile, with the large metric value in the **first column** and the short descriptive caption in the **second column**. Add or remove rows to add or remove stat tiles.

| hero-banner dark | |
| --- | --- |
| … (eyebrow, headline, body, CTAs) | |
| 10B+ | Tests Executed |
| 99.99% | Uptime SLA |
| 3× | Faster Release Cycles |
| 500+ | Integrations Supported |

> **Note:** The block's JavaScript identifies stat rows by their position (after the CTA row) and renders each pair as a grouped stat tile. The number of stat rows is flexible — the layout adjusts automatically.

---

## CTA Button Styling

Control the rendered button style by formatting the link text in the document:

| Formatting | Rendered Style | Example |
|---|---|---|
| **Bold** link text | Solid / primary button | `**[Start Free Trial](/start)**` |
| *Italic* link text | Outlined / ghost button | `*[See How It Works](/demo)*` |
| Plain link text | Default unstyled link | `[Learn More](/docs)` |

Always apply bold or italic formatting to the link text itself — not to surrounding text — otherwise the link will render as a plain unstyled anchor.

---

## Variants

### `dark`

**Usage:** Append `dark` to the block name: `hero-banner dark`

Renders the banner with:
- A dark blue-to-purple CSS/SVG gradient background
- White headline, body, eyebrow, and stat text
- Decorative radial graphic elements (purely visual; marked `aria-hidden="true"` in the DOM)
- Adjusted button styles to maintain contrast against the dark background

---

## Accessibility Notes

| Element | Guidance |
|---|---|
| **Eyebrow label** | If the pill label has insufficient contrast against the background, the block applies a visually-hidden `<span>` or `aria-label` to ensure screen readers announce the category context. |
| **CTA buttons** | Both buttons must have descriptive visible text (e.g. "Start Free Trial", not "Click Here"). The visible text is used as the accessible name — no additional `aria-label` is needed when text is descriptive. |
| **Decorative radial graphics** | All decorative SVG and CSS radial elements are marked `aria-hidden="true"` so they are skipped by screen readers. |
| **Stat tiles** | Each stat value and its label are grouped semantically in the DOM (e.g. using `<dl>`/`<dt>`/`<dd>` or a labelled `<div>`) so screen readers announce them as a coherent pair rather than isolated numbers. |
| **Color contrast** | All text — including eyebrow, headline, body copy, stat values, and stat labels — must meet a minimum contrast ratio of **4.5:1** against the gradient background. Verify contrast