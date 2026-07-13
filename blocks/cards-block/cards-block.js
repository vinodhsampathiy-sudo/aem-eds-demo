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

  // Locate the heading row (single-instance zone). Everything before it
  // (0 or 1 rows) is the optional eyebrow. Everything after it is a
  // repeating card item row.
  const headingIndex = rows.findIndex((row) => row.querySelector('h2'));
  const headerRows = headingIndex >= 0 ? rows.slice(0, headingIndex + 1) : [];
  const itemRows = headingIndex >= 0 ? rows.slice(headingIndex + 1) : rows;

  const header = document.createElement('div');
  header.className = 'cards-block-header';
  headerRows.forEach((row) => {
    const eyebrow = row.querySelector('h2') ? null : row.querySelector('p');
    const heading = row.querySelector('h2');
    if (eyebrow) {
      eyebrow.className = 'cards-block-eyebrow';
      header.append(eyebrow);
    }
    if (heading) {
      header.append(heading);
    }
  });

  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  itemRows.forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('img')) return;

    const li = document.createElement('li');
    li.className = 'cards-block-item';
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — classify the image cell.
    [...li.children].forEach((cell) => {
      const isImageCell = cell.children.length === 1 && cell.querySelector('picture, img');
      if (isImageCell) {
        cell.className = 'cards-block-item-image';
        const img = cell.querySelector('img');
        if (img) {
          img.loading = 'lazy';
        }
      }
    });

    // Step 2 — merge all remaining (non-image) cells into one shared body.
    const body = document.createElement('div');
    body.className = 'cards-block-item-body';
    [...li.children].forEach((cell) => {
      if (cell.classList.contains('cards-block-item-image')) return;
      while (cell.firstChild) body.append(cell.firstChild);
      cell.remove();
    });
    li.append(body);

    // Step 3 — classify elements inside the body: heading -> title,
    // short emoji/icon text -> icon badge, everything else -> description.
    [...body.children].forEach((el) => {
      if (/^H[1-6]$/.test(el.tagName)) {
        el.className = 'cards-block-item-title';
      } else if (el.tagName === 'P' && el.textContent.trim().length <= 4 && !el.querySelector('a, img')) {
        el.className = 'cards-block-item-icon';
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', el.textContent.trim());
      } else {
        el.className = 'cards-block-item-description';
      }
    });

    ul.append(li);
  });

  block.replaceChildren();
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Benefits');
  if (header.children.length) block.append(header);
  block.append(ul);

  decorateButtons(block);
}