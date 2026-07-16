# cards-block

A responsive grid block that displays a collection of benefit cards arranged in three columns on desktop. Each card features a full-width photo with rounded top corners, a small emoji icon badge, a bold title, and a short descriptive paragraph. The block supports an optional eyebrow label and a centered section heading displayed above the card grid. Authors can add or remove card rows to control how many cards appear.

---

## Content Model

| Field | Description |
| ----- | ----- |
| **Row 1** | `eyebrow` — Short section label displayed in orange uppercase text above the main heading *(optional)* |
| **Row 2** | `heading` — Main section heading displayed in large bold centered text above the card grid |
| **Rows 3 +** | One card per row — four fields per card: image, emoji icon, title, and description |

### Per-Card Fields (4 columns)

| Column 1 | Column 2 | Column 3 | Column 4 |
| ----- | ----- | ----- | ----- |
| `card-image` — Full-width photo | `card-icon` — Emoji icon badge | `card-title` — Bold card title (h3) | `card-description` — Short paragraph |

---

## Usage Example

| cards-block | | | |
| ----- | ----- | ----- | ----- |
| Our Key Benefits | | | |
| Everything You Need to Succeed | | | |
| ![Team collaborating in office](/images/collaboration.jpg) | 🤝 | **Seamless Collaboration** | Work together in real time with tools built for modern teams. |
| ![Developer at laptop](/images/speed.jpg) | ⚡ | **Blazing Fast Performance** | Optimized delivery ensures your users never wait. |
| ![Shield icon on screen](/images/security.jpg) | 🔒 | **Enterprise-Grade Security** | Your data is protected with industry-leading standards. |
| ![Analytics dashboard](/images/insights.jpg) | 📊 | **Actionable Insights** | Make smarter decisions with real-time analytics and reporting. |
| ![Support team on call](/images/support.jpg) | 🎧 | **24/7 Expert Support** | Our team is always on hand to help you succeed. |
| ![Puzzle pieces connecting](/images/integrations.jpg) | 🔗 | **Flexible Integrations** | Connect with the tools your team already loves. |

> **Note:** Add or remove card rows (rows 3 and beyond) to add or remove cards from the grid. The eyebrow label in Row 1 is optional — leave the cell empty or remove the row if no eyebrow is needed.

---

## Authoring Notes

### Eyebrow Label (Row 1)
The eyebrow is optional. If you do not want a section label, leave the first cell empty or omit the row entirely. When present, it renders in orange uppercase text above the heading.

### Section Heading (Row 2)
Write the heading as plain text. The block renders it as an `<h2>` element automatically. Keep it concise — one line is ideal.

### Card Images (Column 1)
Insert an image directly into the cell. Write a meaningful, descriptive alt text for every image so screen readers can convey the card's visual content to users who cannot see it.

### Emoji Icons (Column 2)
Paste a single emoji character into the cell. The block renders it inside a soft rounded square badge. In the rendered output, emoji icons receive `aria-hidden="true"` automatically; the card title provides the accessible label for the card.

### Card Titles (Column 3)
Write the title as plain text. The block renders each title as an `<h3>` element, maintaining a correct heading hierarchy beneath the section `<h2>`.

### Card Descriptions (Column 4)
Keep descriptions short — one to two sentences is ideal. Avoid redundant phrasing already covered by the title.

---

## Variants

This block has no variants.

---

## Accessibility Notes

| Concern | Guidance |
| ----- | ----- |
| **Image alt text** | Every card image must have a descriptive `alt` attribute. Write alt text that describes the image content in context, not just "photo" or "image." |
| **Emoji icons** | Emoji icons are decorative in this context. The block applies `aria-hidden="true"` to the icon badge so screen readers skip it and rely on the card title instead. If the emoji conveys meaning not captured by the title, add an `aria-label` to the badge element in the block's markup. |
| **Heading hierarchy** | Card titles render as `<h3>` elements nested within a section introduced by the `<h2>` heading. Do not skip heading levels or place the block in a context where this hierarchy would be broken. |
| **Color contrast** | Body text in card descriptions must meet a minimum contrast ratio of 4.5:1 against the white card background (WCAG 2.1 AA). Avoid light gray text colors for descriptions. |
| **Keyboard navigation** | If cards contain interactive elements (links or buttons), ensure they are reachable and operable via keyboard in a logical tab order. |