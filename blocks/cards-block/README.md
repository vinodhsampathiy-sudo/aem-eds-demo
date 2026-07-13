# Cards Block

The Cards Block presents a shared eyebrow label and section heading above a repeating grid of benefit cards. Each card highlights a single benefit with a photo, a small emoji icon in a rounded badge, a bold title, and a one-sentence description — ideal for feature overviews, product benefits, or "why choose us" sections.

## Content Model

The block starts with two optional/required header rows (eyebrow and section heading), followed by one row per card. Each card row has four fields in four separate columns: image, icon, title, and description.

| cards-block | | | |
| ----- | ----- | ----- | ----- |
| Why Choose Us | | | |
| Built for Modern Teams | | | |
| photo-speed.jpg | 🚀 | **Blazing Fast** | Pages load in milliseconds thanks to edge caching. |
| photo-lock.jpg | 🔒 | **Secure by Default** | Every deployment is protected with enterprise-grade security. |
| photo-globe.jpg | 🌍 | **Global Scale** | Serve content from the edge, close to every user, everywhere. |

**Notes:**
- The **eyebrow** row (first row) is optional — omit it if no small label is needed above the heading.
- The **section heading** row is required and renders as the `h2` for the block.
- Each subsequent row is one card. **Add or remove rows to add or remove cards** — any number of cards is supported (6 shown in the reference design).
- Do not combine the four card fields into a single cell; each field must occupy its own column so authoring tools can split them correctly.

## Usage Examples

### Basic (3 cards, no eyebrow)

| cards-block | | | |
| ----- | ----- | ----- | ----- |
| Our Core Benefits | | | |
| speed.jpg | ⚡ | **Fast Setup** | Get up and running in under five minutes. |
| support.jpg | 💬 | **24/7 Support** | Our team is always available to help. |
| scale.jpg | 📈 | **Scales With You** | Grows effortlessly from startup to enterprise. |

### With eyebrow and 6 cards

| cards-block | | | |
| ----- | ----- | ----- | ----- |
| Why Choose Us | | | |
| Everything You Need to Succeed | | | |
| speed.jpg | 🚀 | **Fast Performance** | Optimized delivery keeps your site quick. |
| lock.jpg | 🔒 | **Secure by Default** | Built-in protections keep data safe. |
| globe.jpg | 🌍 | **Global Reach** | Deliver content from the edge, worldwide. |
| chart.jpg | 📊 | **Actionable Insights** | Real-time analytics guide better decisions. |
| gear.jpg | ⚙️ | **Fully Customizable** | Adapt every block