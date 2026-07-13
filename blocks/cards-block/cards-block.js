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

  // First two rows are the shared eyebrow + section-heading zones.
  const eyebrowRow = rows[0];
  const headingRow = rows[1];
  const itemRows = rows.slice(2);

  const header = document.createElement('div');
  header.className = 'cards-block-header';

  const eyebrowEl = eyebrowRow?.querySelector('p, h3, h4');
  if (eyebrowEl && eyebrowEl.textContent.trim()) {
    eyebrowEl.className = 'cards-block-eyebrow';
    header.append(eyebrowEl);
  }

  const headingEl = headingRow?.querySelector('h1, h2, h3') ?? headingRow?.querySelector('p');
  if (headingEl) {
    header.append(headingEl);
  }

  const ul = document.createElement('ul');
  ul.className = 'cards-block-list';

  itemRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-block-item';
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Step 1 — classify image cell(s)
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

    // Step 2 — merge remaining cells into one shared body wrapper
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
      } else if (el.tagName === 'P' && el.textContent.trim().length <= 4 && !el.querySelector('a, img')) {
        el.className = 'cards-block-item-icon';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.className = 'cards-block-item-description';
      }
    });

    ul.append(li);
  });

  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Benefits');

  if (header.children.length) wrapper.append(header);
  wrapper.append(ul);

  block.replaceChildren(wrapper);
  decorateButtons(wrapper);
}