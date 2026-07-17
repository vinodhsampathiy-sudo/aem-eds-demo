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

function optimizeImages(container, eager) {
  container.querySelectorAll('img').forEach((img) => {
    const picture = createOptimizedPicture(img.src, img.alt || '', eager, [{ width: '750' }]);
    const original = img.closest('picture') ?? img;
    original.replaceWith(picture);
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // Detect optional eyebrow and headline rows that appear before the repeating cards.
  // Strategy: rows that contain an h2 are the headline row; a row immediately before
  // the headline row that contains only a <p> (no img, no h-tag) is the eyebrow row.
  // All remaining rows are card rows.

  let eyebrowRow = null;
  let headlineRow = null;

  rows.forEach((row) => {
    if (!headlineRow && row.querySelector('h2')) {
      headlineRow = row;
    }
  });

  if (headlineRow) {
    const headlineIndex = rows.indexOf(headlineRow);
    if (headlineIndex > 0) {
      const candidate = rows[headlineIndex - 1];
      const hasHeading = candidate.querySelector('h1,h2,h3,h4,h5,h6');
      const hasImage = candidate.querySelector('img');
      if (!hasHeading && !hasImage) {
        eyebrowRow = candidate;
      }
    }
  }

  const introRows = new Set([eyebrowRow, headlineRow].filter(Boolean));
  const cardRows = rows.filter((row) => !introRows.has(row));

  // --- Build intro section (eyebrow + headline) ---
  const intro = document.createElement('div');
  intro.className = 'cards-block-intro';

  if (eyebrowRow) {
    const eyebrowEl = eyebrowRow.querySelector('p') ?? document.createElement('p');
    eyebrowEl.className = 'cards-block-eyebrow';
    intro.append(eyebrowEl);
  }

  if (headlineRow) {
    const headlineEl = headlineRow.querySelector('h2') ?? document.createElement('h2');
    intro.append(headlineEl);
  }

  // --- Build repeating card list ---
  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    // Move all cells from the row into the li
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — identify and classify the image cell
    [...li.children].forEach((cell) => {
      const isImageCell = cell.querySelector('picture, img') &&
        !cell.querySelector('h1,h2,h3,h4,h5,h6') &&
        cell.querySelector('picture, img');
      if (isImageCell) {
        cell.className = 'cards-block-item-image';
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

  // --- Assemble block ---
  const fragment = document.createDocumentFragment();
  if (intro.children.length > 0) fragment.append(intro);
  fragment.append(ul);

  block.replaceChildren(fragment);

  // --- Accessibility: region landmark ---
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Benefits');

  // --- Optimize images (eager=false — cards are below the fold) ---
  optimizeImages(ul, false);

  // --- Decorate any links inside cards ---
  decorateButtons(ul);
}