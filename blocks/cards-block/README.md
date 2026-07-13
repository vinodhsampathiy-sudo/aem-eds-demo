# Cards Block

A repeating grid of benefit cards used to highlight key product or service benefits. Each card displays a photo, a small emoji icon in a rounded badge, a bold title, and a one-sentence description. Cards are arranged three columns wide on desktop and reflow to fewer columns on smaller viewports. An optional eyebrow label and a section heading can be placed above the grid to introduce the benefits.

## Content Model

| cards-block |  |
| ----- | ----- |
| Benefits |  |
| ## Why Teams Choose Us |  |
| image-1.jpg | 🚀 |
| **Fast Setup** | Get up and running in minutes, not days. |
| image-2.jpg | 🔒 |
| **Secure by Default** | Enterprise-grade security built into every layer. |
| image-3.jpg | 📈 |
| **Scales With You** | Grows effortlessly from startup to enterprise. |

- **Row 1**: Block name — `cards-block`
- **Row 2**: Eyebrow — small orange uppercase label above the heading (optional; leave blank/omit row to hide)
- **Row 3**: Heading — the bold section headline (use `##` for an h2)
- **Row 4 onward**: One row per card, each with the same 2 columns: `image` and `icon` in the first cell/row pairing, followed by `title` and `description`

> **Note:** Add or remove card rows to add or remove cards. Each card row must contain exactly its two fields (image + icon), immediately followed by the title + description row for that same card.

## Usage Example

```markdown
| cards-block |  |
| ----- | ----- |
| Benefits |  |
| ## Why Teams Choose Us |  |
| image-1.jpg | 🚀 |
| **Fast Setup** | Get up and running in minutes, not days. |
| image-2.jpg | 🔒 |
| **Secure by Default** | Enterprise-grade security built into every layer. |
| image-3.jpg | 📈 |
| **Scales With You** | Grows effortlessly from startup to enterprise. |
| image-4.jpg | 💡 |
| **Smart Insights** | Actionable analytics surfaced automatically. |
```

Add or remove card row-pairs to add or remove cards — six are shown in the reference design, but any number is supported.

## Variants

None. This block has a single visual treatment.

## Accessibility

- Provide **descriptive alt text** for every card image (e.g., `alt="Team collaborating around a laptop"`), not decorative filler text.
- Emoji icons are decorative accents — mark them `aria-hidden="true"` in the rendered markup, or supply a `title` attribute with an accessible label (e.g., `title="Rocket icon representing speed"`) if the emoji conveys meaning not captured elsewhere in the card.
- The section heading must render as a semantic `<h2>`, with the eyebrow rendered as a preceding label (e.g., a `<p>` styled as a small caption) so screen reader users get correct document structure and context before the heading.
- Ensure sufficient color contrast between the eyebrow text (orange) and its background per WCAG AA.