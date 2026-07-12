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
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Benefits');

  const rows = [...block.children];

  // Detect and extract one-off header zones (eyebrow and section-headline)
  // These appear as single-cell rows before the repeating card rows.
  // A card row will have multiple cells (image, icon, title, description).
  // We identify header rows as rows with a single cell containing no img and no h3.
  let eyebrowEl = null;
  let headlineEl = null;
  let cardStartIndex = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = [...row.children];

    // A header row has exactly one cell and contains either a p (eyebrow) or h2 (headline)
    // but NOT an h3 (which would be a card title in a single-cell card row)
    if (cells.length === 1) {
      const cell = cells[0];
      const h2 = cell.querySelector('h2');
      const h3 = cell.querySelector('h3');
      const img = cell.querySelector('img, picture');

      if (h2 && !h3 && !img) {
        headlineEl = h2;
        cardStartIndex = i + 1;
        continue;
      }

      // Check for eyebrow: a p element with short uppercase-ish text, no h2/h3/img
      if (!h2 && !h3 && !img) {
        const p = cell.querySelector('p');
        if (p && !headlineEl) {
          eyebrowEl = p;
          cardStartIndex = i + 1;
          continue;
        }
      }
    }

    // Once we hit a multi-cell row or a row that looks like a card, stop scanning for headers
    break;
  }

  // Build the header section
  const header = document.createElement('div');
  header.className = 'cards-block-header';

  if (eyebrowEl) {
    eyebrowEl.className = 'cards-block-eyebrow';
    header.append(eyebrowEl);
  }

  if (headlineEl) {
    headlineEl.className = 'cards-block-section-headline';
    header.append(headlineEl);
  }

  // Build the repeating card list
  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  const cardRows = rows.slice(cardStartIndex);

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    const cells = [...row.children];

    cells.forEach((cell) => {
      const hasPicture = cell.querySelector('picture, img');
      const hasH3 = cell.querySelector('h3');

      if (hasPicture && !hasH3) {
        // Card image cell
        cell.className = 'cards-block-item-image';

        // Ensure images have proper attributes
        cell.querySelectorAll('img').forEach((img) => {
          img.loading = 'lazy';
          if (!img.alt) {
            // Try to find a nearby title for alt text context
            img.alt = '';
          }
        });

        li.append(cell);
      } else {
        // Card body cell — contains icon, title, description
        cell.className = 'cards-block-item-body';

        // Classify inner elements
        const children = [...cell.children];
        children.forEach((child) => {
          const tag = child.tagName;

          if (tag === 'H3') {
            child.className = 'cards-block-item-title';
          } else if (tag === 'P' || tag === 'DIV') {
            const text = child.textContent.trim();
            // Detect emoji-only paragraphs as icon
            // An emoji paragraph is short (≤ 4 chars) or contains only emoji characters
            const isEmoji = text.length <= 4 && /\p{Emoji}/u.test(text);
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

    // If the row had only one cell (all content in one cell), re-classify inner elements
    if (cells.length === 1) {
      const bodyCell = li.querySelector('.cards-block-item-body');
      if (bodyCell) {
        const innerChildren = [...bodyCell.children];
        innerChildren.forEach((child) => {
          const tag = child.tagName;
          if (tag === 'H3') {
            child.className = 'cards-block-item-title';
          } else if (tag === 'P' || tag === 'DIV') {
            const text = child.textContent.trim();
            const isEmoji = text.length <= 4 && /\p{Emoji}/u.test(text);
            if (isEmoji) {
              child.className = 'cards-block-item-icon';
              child.setAttribute('aria-hidden', 'true');
            } else if (!child.className || child.className === '') {
              child.className = 'cards-block-item-description';
            }
          }
        });
      }
    }

    // Post-process: link card image alt text to card title if image alt is empty
    const cardImg = li.querySelector('.cards-block-item-image img');
    const cardTitle = li.querySelector('.cards-block-item-title');
    if (cardImg && cardTitle && !cardImg.alt) {
      cardImg.alt = cardTitle.textContent.trim();
    }

    ul.append(li);
  });

  // Assemble the block
  const hasHeader = eyebrowEl || headlineEl;
  if (hasHeader) {
    block.replaceChildren(header, ul);
  } else {
    block.replaceChildren(ul);
  }

  decorateButtons(block);
}