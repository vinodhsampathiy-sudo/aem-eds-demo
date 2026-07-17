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

  // Detect optional one-off header rows (eyebrow and/or headline) that appear
  // BEFORE the repeating card rows. A header row has exactly one cell whose
  // content is a <p> (eyebrow) or an <h1>–<h6> (headline) and contains no
  // image — distinguishing it from a card row which always has an image cell.
  let headerRowCount = 0;
  for (const row of rows) {
    const cells = [...row.children];
    const hasImage = row.querySelector('img, picture');
    const isSingleCell = cells.length === 1;
    const firstCellEl = cells[0]?.firstElementChild;
    const isEyebrowOrHeadline =
      isSingleCell &&
      !hasImage &&
      firstCellEl &&
      (firstCellEl.tagName === 'P' || /^H[1-6]$/.test(firstCellEl.tagName));
    if (isEyebrowOrHeadline) {
      headerRowCount += 1;
    } else {
      break; // once we hit a card row, stop looking for header rows
    }
  }

  const headerRows = rows.slice(0, headerRowCount);
  const cardRows = rows.slice(headerRowCount);

  // --- Build the section header (eyebrow + headline) ---
  const header = document.createElement('div');
  header.className = 'cards-block-header';

  headerRows.forEach((row) => {
    const cell = row.children[0];
    if (!cell) return;
    const el = cell.firstElementChild;
    if (!el) return;
    if (el.tagName === 'P') {
      el.className = 'cards-block-eyebrow';
      header.append(el);
    } else if (/^H[1-6]$/.test(el.tagName)) {
      el.className = 'cards-block-headline';
      header.append(el);
    }
  });

  // --- Build the card grid ---
  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';
  ul.setAttribute('role', 'list');

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    // Move all cells from the row into the li
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — identify and classify the image cell
    [...li.children].forEach((cell) => {
      const isImageCell =
        cell.querySelector('img, picture') &&
        !cell.querySelector('h1, h2, h3, h4, h5, h6');
      if (isImageCell) {
        cell.className = 'cards-block-item-image';
      }
    });

    // Step 2 — merge every non-image cell into one shared body wrapper
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
      } else if (el.tagName === 'P') {
        el.className = 'cards-block-item-description';
      }
    });

    // Decorate any links inside the card body
    decorateButtons(body);

    ul.append(li);
  });

  // --- Assemble the block ---
  const section = document.createElement('div');
  section.className = 'cards-block-section';
  section.setAttribute('role', 'region');
  section.setAttribute('aria-label', 'Benefits');

  if (header.children.length > 0) section.append(header);
  section.append(ul);

  block.replaceChildren(section);

  // Optimize images — first card image is eager (potential LCP), rest are lazy
  let firstImage = true;
  ul.querySelectorAll('.cards-block-item-image img').forEach((img) => {
    const picture = createOptimizedPicture(
      img.src,
      img.alt || '',
      firstImage,
      [{ width: '750' }]
    );
    const original = img.closest('picture') ?? img;
    original.replaceWith(picture);
    firstImage = false;
  });
}