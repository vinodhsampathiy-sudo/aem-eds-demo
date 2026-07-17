# cards-block

A responsive benefit card grid that displays a collection of cards arranged in three columns on desktop. Each card features a full-width photo, an emoji icon badge, a bold title, and a short descriptive paragraph. The grid is introduced by an optional eyebrow label and a centered section headline, making it well-suited for showcasing product features, service benefits, or key differentiators.

---

## Content Model

Authors build this block by creating a table in Google Docs or Microsoft Word. The first row names the block, the next two rows define the shared section header, and every subsequent row defines one card. Add or remove rows to add or remove cards.

| Field | Type | Description |
|---|---|---|
| `eyebrow` | `p` | *(Optional)* Small uppercase label displayed above the section headline |
| `headline` | `h2` | Large bold section heading centered above the card grid |
| `card-image` | `img` | Full-width photo at the top of the card with rounded top corners — include a descriptive alt text |
| `card-icon` | `p` | Small emoji icon displayed in a soft rounded square badge below the image |
| `card-title` | `h3` | Bold card title identifying the benefit |
| `card-description` | `p` | Short paragraph describing the benefit in one to two sentences |

---

## Table Structure

Each card occupies **one row** with **four columns**: image, icon, title, and description. Add or remove rows to add or remove cards.

| cards-block | | | |
| --- | --- | --- | --- |
| Our Benefits | | | |
| Why Choose Us | | | |
| ![Team collaborating in a modern office](/assets/card-1.jpg) | 🚀 | **Blazing Fast Delivery** | Our global CDN ensures your content reaches users in milliseconds, no matter where they are. |
| ![Developer working at a standing desk](/assets/card-2.jpg) | 🛠️ | **Easy to Customize** | A flexible block library lets your team build and adapt pages without touching core infrastructure. |
| ![Dashboard showing uptime metrics](/assets/card-3.jpg) | 📊 | **Real-Time Analytics** | Monitor performance, traffic, and engagement with built-in dashboards updated in real time. |
| ![Security lock icon on a blue background](/assets/card-4.jpg) | 🔒 | **Enterprise-Grade Security** | End-to-end encryption and automated compliance checks keep your data and users protected. |
| ![Support agent smiling at camera](/assets/card-5.jpg) | 💬 | **24/7 Expert Support** | Our dedicated support team is available around the clock to resolve issues before they impact users. |
| ![Gears representing automated workflows](/assets/card-6.jpg) | ⚙️ | **Automated Workflows** | CI/CD pipelines deploy your changes automatically on every push, reducing manual overhead. |

> **Note:** The eyebrow row (row 2) is optional. If you do not need an eyebrow label, delete that row entirely and start with the headline row.

---

## Authoring Notes

### Section Header Rows
- **Row 2 (eyebrow):** Type a short uppercase label, e.g. `Our Benefits`. This row is optional — omit it if no eyebrow is needed.
- **Row 3 (headline):** Format the text as **Heading 2** in your document. This ensures the rendered `<h2>` is correct for page heading hierarchy.

### Card Rows
- **card-image:** Insert an image directly into the cell. Always fill in the image's alt text field with a meaningful description (e.g., `"Team collaborating in a modern office"`). Do not leave alt text blank.
- **card-icon:** Type the emoji character directly into the cell as plain text (e.g., `🚀`). The block renders it inside a rounded badge.
- **card-title:** Format the text as **Heading 3** in your document so the rendered output produces an `<h3>` element.
- **card-description:** Type one to two sentences of plain paragraph text.

---

## Variants

This block has no variants.

---

## Accessibility

| Concern | Guidance |
|---|---|
| **Card images** | Always provide a descriptive alt attribute when inserting the image in the document. Avoid generic text like `"image"` or `"photo"`. |
| **Emoji icons** | The block automatically adds `aria-hidden="true"` to emoji icon elements so screen readers skip decorative characters. If the emoji conveys meaning not expressed in the card title or description, contact your developer to add an `aria-label` instead. |
| **Heading hierarchy** | The section headline must be styled as **Heading 2** and each card title as **Heading 3** in the authoring document. Do not skip heading levels or use bold paragraph text as a substitute. |
| **Color contrast** | Ensure any text overlaid on card images meets a minimum 4.5:1 contrast ratio (WCAG AA). |
| **Keyboard navigation** | Cards are navigable in source order. If cards contain links, verify focus indicators are visible in the applied theme. |