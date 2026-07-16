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

function isHeaderRow(row) {
  return !!(row.querySelector('h1, h2') || (row.children.length === 1 && !row.querySelector('img, picture')));
}

export default function decorate(block) {
  const rows = [...block.children];

  // Detect optional eyebrow and heading rows that appear before the repeating cards.
  // These are single-cell rows containing a <p> (eyebrow) or <h2> (heading) — NOT card rows.
  let headerEndIndex = 0;
  let eyebrow = null;
  let heading = null;

  // Check first row for eyebrow (p without h2) or heading (h2)
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const hasImage = row.querySelector('img, picture');
    const hasHeading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const cellCount = row.children.length;

    // A header row has no image and is a single cell
    if (!hasImage && cellCount === 1) {
      const h2 = row.querySelector('h2');
      const p = row.querySelector('p');
      if (h2 && !eyebrow && !heading) {
        heading = h2;
        headerEndIndex = i + 1;
      } else if (h2 && eyebrow && !heading) {
        heading = h2;
        headerEndIndex = i + 1;
      } else if (!h2 && p && !eyebrow && !heading) {
        // Could be eyebrow — check if next row is heading
        const nextRow = rows[i + 1];
        if (nextRow && nextRow.querySelector('h2') && !nextRow.querySelector('img, picture')) {
          eyebrow = p;
          headerEndIndex = i + 1;
        } else {
          // Not a header row, stop
          break;
        }
      } else if (!h2 && !hasHeading && eyebrow && !heading) {
        // Still looking for heading
        break;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Build the section header (eyebrow + heading) if present
  const sectionHeader = document.createElement('div');
  sectionHeader.className = 'cards-block-header';

  if (eyebrow) {
    eyebrow.className = 'cards-block-eyebrow';
    sectionHeader.append(eyebrow);
  }
  if (heading) {
    sectionHeader.append(heading);
  }

  // Build the card list from remaining rows
  const cardRows = rows.slice(headerEndIndex);

  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  cardRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';

    // Move all cells from the row into the li
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — classify image cells
    [...li.children].forEach((cell) => {
      const isImageCell = cell.querySelector('picture, img') &&
        cell.children.length >= 1 &&
        !cell.querySelector('h1, h2, h3, h4, h5, h6');
      // Check if the cell is primarily an image (picture/img is the main content)
      const pics = cell.querySelectorAll('picture, img');
      const hasOnlyMedia = pics.length > 0 && cell.textContent.trim().length === 0;
      if (hasOnlyMedia) {
        cell.className = 'cards-block-item-image';
        // Ensure images are lazy-loaded (non-hero)
        cell.querySelectorAll('img').forEach((img) => {
          if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
        });
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
        // Short text with no link → emoji icon
        el.className = 'cards-block-item-icon';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.className = 'cards-block-item-description';
      }
    });

    ul.append(li);
  });

  // Assemble the block
  const fragment = document.createDocumentFragment();
  if (eyebrow || heading) {
    fragment.append(sectionHeader);
  }
  fragment.append(ul);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Benefits');

  block.replaceChildren(fragment);
  decorateButtons(block);
}