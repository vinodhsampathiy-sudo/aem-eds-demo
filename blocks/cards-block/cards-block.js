import { getMetadata } from '../../scripts/aem.js';

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

  // Detect optional one-off header rows (eyebrow and/or section headline)
  // that appear BEFORE the repeating card rows.
  // A header row has a single cell containing a <p> (eyebrow) or <h2> (section headline).
  // Card rows always have more than one cell OR contain an image.
  let headerRowCount = 0;
  const headerSection = document.createElement('div');
  headerSection.className = 'cards-block-header';

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.children];
    // A header row has exactly one cell and no image inside it
    const isSingleCell = cells.length === 1;
    const hasImage = !!row.querySelector('img');
    const hasHeadingOrEyebrow = !!row.querySelector('h1, h2, h3, h4, h5, h6') ||
      (isSingleCell && cells[0].querySelector('p') && !cells[0].querySelector('a'));

    if (isSingleCell && !hasImage && hasHeadingOrEyebrow) {
      // Could be eyebrow or section headline
      const h2 = row.querySelector('h2');
      const p = row.querySelector('p');
      if (h2) {
        h2.className = 'cards-block-section-headline';
        headerSection.append(h2);
        headerRowCount = i + 1;
      } else if (p && !p.querySelector('a')) {
        p.className = 'cards-block-eyebrow';
        headerSection.append(p);
        headerRowCount = i + 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Build the card list from remaining rows
  const cardRows = rows.slice(headerRowCount);
  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';
  ul.setAttribute('role', 'list');

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    // Move all cells into the li
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — classify image cells
    [...li.children].forEach((cell) => {
      const isImageCell = cell.querySelector('picture, img') &&
        cell.children.length === 1 &&
        !cell.querySelector('h1, h2, h3, h4, h5, h6');
      if (isImageCell) {
        cell.className = 'cards-block-item-image';
        // Ensure img has loading lazy for below-fold cards
        const img = cell.querySelector('img');
        if (img) {
          if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          // Preserve existing alt; if empty, leave it (decorative handled by CSS)
        }
      }
    });

    // Step 2 — merge all non-image cells into one body wrapper
    const body = document.createElement('div');
    body.className = 'cards-block-item-body';
    [...li.children].forEach((cell) => {
      if (cell.classList.contains('cards-block-item-image')) return;
      while (cell.firstChild) body.append(cell.firstChild);
      cell.remove();
    });
    li.append(body);

    // Step 3 — classify elements inside the body
    [...body.children].forEach((el) => {
      if (/^H[1-6]$/.test(el.tagName)) {
        el.className = 'cards-block-item-title';
      } else if (
        el.tagName === 'P' &&
        el.textContent.trim().length <= 4 &&
        !el.querySelector('a')
      ) {
        // Emoji icon — short text, no link
        el.className = 'cards-block-item-icon';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.className = 'cards-block-item-description';
      }
    });

    ul.append(li);
  });

  // Assemble final block structure
  const wrapper = document.createElement('div');
  wrapper.className = 'cards-block-inner';
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Benefits');

  if (headerSection.children.length > 0) {
    wrapper.append(headerSection);
  }
  wrapper.append(ul);

  block.replaceChildren(wrapper);
  decorateButtons(wrapper);
}
