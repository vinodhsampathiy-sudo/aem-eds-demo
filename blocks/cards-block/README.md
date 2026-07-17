# cards-block

A repeating 3-column grid of benefit cards, each featuring a full-width photo, an emoji icon badge, a bold title, and a short description. The block is introduced by an optional eyebrow label and a centered section headline that provide shared context for the entire card collection. Authors can display any number of cards by adding or removing rows in the table — the grid automatically wraps into rows of three.

---

## Content Model

Authors configure this block by creating a table in Google Docs or Microsoft Word. The first row names the block. The next two rows define the shared section header. Every subsequent row represents one card; each card row has four columns — one per field.

| Field | Type | Description |
|---|---|---|
| `eyebrow` | `p` | *(Optional)* Small uppercase label displayed above the section headline |
| `headline` | `h2` | Large bold section heading centered above the card grid |
| `card-image` | `img` | Full-width photo at the top of the card with rounded top corners — include a descriptive alt text |
| `card-icon` | `p` | Small emoji icon displayed in a soft rounded square badge below the image |
| `card-title` | `h3` | Bold card title displayed below the icon |
| `card-description` | `p` | Short descriptive paragraph below the title |

---

## Table Structure

Row 1 names the block. Row 2 is the optional eyebrow label. Row 3 is the section headline. Rows 4 and onward are card items — **add or remove rows to add or remove cards**.

```
| cards-block              |            |                          |                                                      |
|--------------------------|------------|--------------------------|------------------------------------------------------|
| Our Key Benefits         |            |                          |                                                      |
| ## Why Choose Us         |            |                          |                                                      |
| team-photo.jpg           | 🤝         | **Collaborative Culture**| We work together to deliver results that matter.     |
| innovation-lab.jpg       | 💡         | **Innovative Thinking**  | Fresh ideas backed by data and creative exploration. |
| global-reach.jpg         | 🌍         | **Global Reach**         | Serving customers in over 80 countries worldwide.    |
| secure-platform.jpg      | 🔒         | **Enterprise Security**  | Bank-grade encryption and compliance built in.       |
| fast-delivery.jpg        | 🚀         | **Fast Delivery**        | Ship features in days, not months.                   |
| support-team.jpg         | 🎧         | **24/7 Support**         | Round-the-clock help from real human experts.        |
```

### Rendered Markdown Table

| cards-block | | | |
| --- | --- | --- | --- |
| Our Key Benefits | | | |
| ## Why Choose Us | | | |
| team-photo.jpg | 🤝 | **Collaborative Culture** | We work together to deliver results that matter. |
| innovation-lab.jpg | 💡 | **Innovative Thinking** | Fresh ideas backed by data and creative exploration. |
| global-reach.jpg | 🌍 | **Global Reach** | Serving customers in over 80 countries worldwide. |
| secure-platform.jpg | 🔒 | **Enterprise Security** | Bank-grade encryption and compliance built in. |
| fast-delivery.jpg | 🚀 | **Fast Delivery** | Ship features in days, not months. |
| support-team.jpg | 🎧 | **24/7 Support** | Round-the-clock help from real human experts. |

---

## Authoring Notes

- **Eyebrow label (Row 2):** This row is optional. Leave the cell empty or remove the row entirely if no eyebrow label is needed. The block will render the headline alone.
- **Section headline (Row 3):** Use Heading 2 (`##`) formatting in your document so the block's JavaScript correctly identifies this row as the section headline rather than a card item.
- **Card images:** Insert the image directly into the table cell. The image will be rendered full-width at the top of the card with rounded top corners. Always provide a meaningful alt text on the image for accessibility.
- **Card icons:** Type the emoji character directly into the cell. The block wraps it in a soft rounded square badge automatically.
- **Card titles:** Apply **Bold** formatting to the title text in your document to render it as a prominent `h3` heading on the card.
- **Card count:** The grid lays out cards in rows of three. Any number of cards is supported — add or remove rows freely. For visual balance, a multiple of three (e.g., 3, 6, 9) is recommended.

---

## Variants

This block has no variants.

---

## Accessibility

| Concern | Guidance |
|---|---|
| **Card images** | Always provide a descriptive `alt` attribute on each card image. Avoid generic text like "photo" — describe what is shown (e.g., `alt="Two team members collaborating at a whiteboard"`). |
| **Emoji icons** | The block's JavaScript automatically adds `aria-hidden="true"` to the emoji badge so screen readers skip the raw emoji character. If the emoji conveys meaning not captured by the card title or description, add an `aria-label` to the badge element in the block's JS (e.g., `aria-label="Security"`). |
| **Section headline** | The `h2` section headline provides a landmark heading that screen readers use to navigate the page. Ensure the heading text meaningfully describes the card collection. |
| **Color contrast** | Verify that card title and description text meets WCAG AA contrast requirements (4.5:1 for normal text) against the card background color. |
| **Keyboard navigation** | If cards contain interactive elements (links or buttons), ensure they are reachable and operable via keyboard in a logical tab order. |