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
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Benefits');

  const rows = [...block.children];

  // Detect optional one-off header rows (eyebrow and/or section-headline)
  // that appear BEFORE the repeating card rows.
  // A header row has a single cell containing a <p> (eyebrow) or <h2> (section headline)
  // and does NOT contain an <img> (which would mark it as a card row).
  let headerRowCount = 0;
  let eyebrowEl = null;
  let headlineEl = null;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    // If this row contains an image it's a card row — stop scanning for header rows
    if (row.querySelector('img, picture')) break;

    const h2 = row.querySelector('h2');
    const p = row.querySelector('p');

    if (h2) {
      headlineEl = h2;
      headerRowCount = i + 1;
    } else if (p && !h2) {
      eyebrowEl = p;
      headerRowCount = i + 1;
    } else {
      break;
    }
  }

  // Build the optional header section
  let header = null;
  if (eyebrowEl || headlineEl) {
    header = document.createElement('div');
    header.className = 'cards-block-header';
    if (eyebrowEl) {
      eyebrowEl.className = 'cards-block-eyebrow';
      header.append(eyebrowEl);
    }
    if (headlineEl) {
      headlineEl.className = 'cards-block-section-headline';
      header.append(headlineEl);
    }
  }

  // Build the repeating card grid from remaining rows
  const cardRows = rows.slice(headerRowCount);
  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    const article = document.createElement('article');
    article.className = 'cards-block-article';

    // Move all cells from the row into the li first
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — classify image cells
    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture, img');
      const isImageOnly = hasPicture && cell.children.length === 1 && !cell.querySelector('h1,h2,h3,h4,h5,h6,p');
      if (isImageOnly) {
        cell.className = 'cards-block-item-image';
        // Ensure the img has loading="lazy" for below-fold cards
        const img = cell.querySelector('img');
        if (img) {
          img.loading = 'lazy';
          // Preserve existing alt; if empty, leave it (author should supply descriptive alt)
        }
      }
    });

    // Step 2 — merge all non-image cells into one shared body wrapper
    const body = document.createElement('div');
    body.className = 'cards-block-item-body';

    [...li.children].forEach((cell) => {
      if (cell.classList.contains('cards-block-item-image')) return;
      while (cell.firstChild) body.append(cell.firstChild);
      cell.remove();
    });

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

    // Assemble: image cell first (if present), then article with body content
    const imageCell = li.querySelector('.cards-block-item-image');
    if (imageCell) article.append(imageCell);
    article.append(body);
    li.replaceChildren(article);

    ul.append(li);
  });

  // Compose final block content
  const fragments = [];
  if (header) fragments.push(header);
  fragments.push(ul);

  block.replaceChildren(...fragments);
  decorateButtons(block);
}