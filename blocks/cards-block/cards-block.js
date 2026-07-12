import { createOptimizedPicture } from '../../scripts/aem.js';

function decorateButtons(container) {
  container.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    const up = a.parentElement;
    const twoup = up?.parentElement;
    if (up?.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
      a.className = 'button';
      up.classList.add('button-container');
    }
    if (up?.tagName === 'STRONG' && up.childNodes.length === 1 && twoup?.tagName === 'P' && twoup.childNodes.length === 1) {
      a.className = 'button primary';
      twoup.classList.add('button-container');
    }
    if (up?.tagName === 'EM' && up.childNodes.length === 1 && twoup?.tagName === 'P' && twoup.childNodes.length === 1) {
      a.className = 'button secondary';
      twoup.classList.add('button-container');
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // Detect leading non-repeating zones: eyebrow (p) and section-headline (h2)
  // These appear as rows before the repeating card rows.
  // A card row has multiple cells (image, icon, title, description).
  // A header row typically has a single cell with a p or h2.

  let headerEndIndex = 0;
  const headerEl = document.createElement('div');
  headerEl.className = 'cards-block-header';

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.children];

    // If the row has only one cell and contains an h2 or a lone p (eyebrow), treat it as a header row
    if (cells.length === 1) {
      const cell = cells[0];
      const hasH2 = cell.querySelector('h2');
      const hasH1 = cell.querySelector('h1');
      const hasH3 = cell.querySelector('h3');
      const hasImg = cell.querySelector('img, picture');

      if ((hasH2 || hasH1) && !hasImg) {
        // Section headline row
        const headline = hasH2 || hasH1;
        headerEl.append(headline);
        headerEndIndex = i + 1;
        continue;
      }

      if (!hasH2 && !hasH1 && !hasH3 && !hasImg) {
        // Likely an eyebrow paragraph row
        const eyebrow = cell.querySelector('p');
        if (eyebrow) {
          eyebrow.className = 'cards-block-eyebrow';
          headerEl.append(eyebrow);
          headerEndIndex = i + 1;
          continue;
        }
      }
    }

    // Once we hit a row that doesn't match header patterns, stop
    break;
  }

  // Build the cards list from remaining rows
  const cardRows = rows.slice(headerEndIndex);
  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    const cells = [...row.children];

    cells.forEach((cell) => {
      const hasPicture = cell.querySelector('picture');
      const hasImg = cell.querySelector('img');
      const hasH3 = cell.querySelector('h3');
      const hasH2 = cell.querySelector('h2');

      if ((hasPicture || hasImg) && !hasH3 && !hasH2) {
        // Card image cell
        cell.className = 'cards-block-item-image';

        // Ensure lazy loading for card images (below fold)
        const img = cell.querySelector('img');
        if (img) {
          if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          // Preserve existing alt; if empty, leave it (decorative images are fine with empty alt)
        }

        li.append(cell);
      } else {
        // Card body cell: may contain icon (p with emoji), title (h3), description (p)
        cell.className = 'cards-block-item-body';

        // Classify children within the body cell
        [...cell.children].forEach((child) => {
          const tag = child.tagName;

          if (tag === 'H3' || tag === 'H2') {
            child.className = 'cards-block-item-title';
          } else if (tag === 'P' || tag === 'DIV') {
            // Distinguish icon (emoji-only paragraph) from description
            const text = child.textContent.trim();
            // Check if the paragraph contains only emoji characters (no links, no long text)
            const isEmoji = text.length <= 4 && /\p{Emoji}/u.test(text) && !child.querySelector('a, img, picture');

            if (isEmoji) {
              child.className = 'cards-block-item-icon';
              child.setAttribute('aria-hidden', 'true');
            } else {
              child.className = 'cards-block-item-description';
            }
          }
        });

        li.append(cell);
      }
    });

    decorateButtons(li);
    ul.append(li);
  });

  // Set ARIA attributes on the block for accessibility
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Benefits');

  // Compose final DOM
  const fragment = document.createDocumentFragment();

  if (headerEl.children.length > 0) {
    fragment.append(headerEl);
  }

  fragment.append(ul);
  block.replaceChildren(fragment);
}