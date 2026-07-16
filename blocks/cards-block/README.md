# cards-block

A responsive grid block that displays a collection of benefit cards arranged in 3 columns on desktop. Each card features a full-width photo, an emoji icon badge, a bold title, and a short description. The grid is introduced by an optional eyebrow label and a section headline, making it ideal for showcasing product features, service benefits, or key differentiators in a visually engaging layout.

---

## Content Model

Authors build this block using a table in Google Docs or Microsoft Word. The first row names the block. The next two rows define the shared section header. Every subsequent row defines one card — add or remove rows to add or remove cards.

### Block structure

| Row | Purpose | Notes |
| --- | --- | --- |
| Row 1 | Block name: `cards-block` | Required |
| Row 2 | Eyebrow label | Optional small uppercase label above the headline |
| Row 3 | Section headline | Required `h2` introducing the card grid |
| Row 4+ | One card per row (4 fields per row) | Repeat for each card |

### Per-card fields (4 columns per row)

| Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- |
| Card image | Emoji icon | Card title | Card description |

---

## Usage Example

| cards-block | | | |
| --- | --- | --- | --- |
| Our Benefits | | | |
| Why Choose Us | | | |
| ![A developer working at a standing desk](/assets/cards/remote-work.jpg) | 🏡 | **Flexible Remote Work** | Work from anywhere in the world with full team support and async-friendly processes. |
| ![Two colleagues collaborating on a whiteboard](/assets/cards/collaboration.jpg) | 🤝 | **Team Collaboration** | Dedicated tools and rituals that keep distributed teams aligned and energized. |
| ![A person reviewing a growth chart on a laptop](/assets/cards/growth.jpg) | 📈 | **Career Growth** | Structured mentorship, learning budgets, and clear promotion paths for every role. |
| ![A smiling employee holding a coffee mug](/assets/cards/wellbeing.jpg) | 💚 | **Employee Wellbeing** | Comprehensive health benefits, mental health days, and a culture that puts people first. |
| ![A laptop showing a security dashboard](/assets/cards/security.jpg) | 🔒 | **Enterprise Security** | SOC 2 certified infrastructure with end-to-end encryption and role-based access control. |
| ![A globe with network connection lines](/assets/cards/global.jpg) | 🌍 | **Global Reach** | Serve customers in over 150 countries with localized support and regional data centers. |

> **Tip:** Add or remove rows (Row 4 and beyond) to add or remove cards. The grid will reflow automatically.

---

## Authoring Notes

### Eyebrow label (Row 2)
The eyebrow is optional. If you do not need a small label above the headline, leave Row 2 empty or delete it entirely. Type the label in plain text — it will be styled automatically in uppercase by the block's CSS.

### Section headline (Row 3)
Format the section headline as a **Heading 2** (`h2`) in your document. This provides the correct semantic landmark for the card grid and ensures proper heading hierarchy on the page.

### Card images (Column 1)
Insert an image directly into the cell. Always provide a meaningful **alt text** description when inserting the image — this is critical for screen reader users. The alt text should describe what is shown in the photo, not the benefit name (e.g., *"A developer working at a standing desk"* rather than *"Remote Work"*).

### Emoji icons (Column 2)
Type the emoji character directly into the cell. The block will render it inside a soft rounded square badge. Emoji icons are decorative companions to the card title and will be given `aria-hidden="true"` automatically by the block's JavaScript so screen readers skip them.

### Card titles (Column 3)
Format the card title as **bold text** in your document. The block renders each title as an `h3` element within its card.

### Card descriptions (Column 4)
Write one to two concise sentences. Plain paragraph text — no special formatting required.

---

## Variants

This block has no variants.

---

## Accessibility

| Concern | Implementation |
| --- | --- |
| Card images | Always provide descriptive `alt` text when inserting images. The alt text should describe the photo content meaningfully. |
| Emoji icons | The block automatically applies `aria-hidden="true"` to emoji badges so they are skipped by screen readers. |
| Section heading | The `h2` section headline provides a semantic landmark that gives the card grid context within the page outline. |
| Card grouping | Each card is wrapped in an `<article>` element, semantically grouping the image, icon, title, and description as a single related unit. |
| Heading hierarchy | Card titles render as `h3` elements, maintaining a logical `h2 → h3` heading hierarchy beneath the section headline. |
| Keyboard navigation | Cards are navigable in source order; no interactive elements are present unless a CTA link is added inside a description cell. |