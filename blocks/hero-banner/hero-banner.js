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

const STAT_PATTERN = /^([\d.,]+\s*[%×xXkKmMbB]*\+?)\s+(.+)$/;

function buildStats(statsRow) {
  const dl = document.createElement('dl');
  dl.className = 'hero-banner-stats';

  const addStat = (text) => {
    const item = document.createElement('div');
    item.className = 'hero-banner-stat';
    const match = text.match(STAT_PATTERN);
    if (match) {
      const dt = document.createElement('dt');
      dt.textContent = match[1].trim();
      const dd = document.createElement('dd');
      dd.textContent = match[2].trim();
      item.append(dt, dd);
    } else {
      const dt = document.createElement('dt');
      dt.textContent = text;
      item.append(dt);
    }
    dl.append(item);
  };

  const directCells = [...statsRow.children].filter((el) => el.textContent.trim());

  if (directCells.length > 1) {
    directCells.forEach((cell) => addStat(cell.textContent.trim()));
  } else {
    statsRow.textContent.trim().split('|').map((s) => s.trim()).filter(Boolean).forEach(addStat);
  }

  return dl;
}

export default function decorate(block) {
  const rows = [...block.children];

  // Determine row indices based on content zones:
  // Row 0: background-image (optional)
  // Row 1: eyebrow
  // Row 2: headline
  // Row 3: body-text
  // Row 4: cta-primary
  // Row 5: cta-secondary
  // Row 6: stats-row
  // Handle optional background-image: check if first row contains an img
  let rowIndex = 0;
  let bgRow = null;
  const firstRowImg = rows[0]?.querySelector('img');
  if (firstRowImg) {
    bgRow = rows[rowIndex];
    rowIndex += 1;
  }

  const eyebrowRow = rows[rowIndex];
  rowIndex += 1;
  const headlineRow = rows[rowIndex];
  rowIndex += 1;
  const bodyRow = rows[rowIndex];
  rowIndex += 1;
  const ctaPrimaryRow = rows[rowIndex];
  rowIndex += 1;
  const ctaSecondaryRow = rows[rowIndex];
  rowIndex += 1;
  const statsRow = rows[rowIndex];

  // --- Background layer ---
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-banner-background';
  bgLayer.setAttribute('aria-hidden', 'true');

  if (bgRow) {
    const bgImg = bgRow.querySelector('img');
    if (bgImg) {
      bgImg.setAttribute('loading', 'eager');
      bgImg.setAttribute('fetchpriority', 'high');
      bgImg.setAttribute('alt', '');
      bgImg.removeAttribute('width');
      bgImg.removeAttribute('height');
      bgLayer.append(bgImg);
    }
  }

  // --- Content layer ---
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  // Eyebrow
  if (eyebrowRow) {
    const eyebrowEl = eyebrowRow.querySelector('p, h2, h3, h4, h5, h6') || eyebrowRow.firstElementChild;
    if (eyebrowEl) {
      eyebrowEl.className = 'hero-banner-eyebrow';
      // Add a visually hidden prefix for screen readers if the dot is decorative
      const dotSpan = document.createElement('span');
      dotSpan.className = 'hero-banner-eyebrow-dot';
      dotSpan.setAttribute('aria-hidden', 'true');
      dotSpan.textContent = '● ';
      eyebrowEl.prepend(dotSpan);
      content.append(eyebrowEl);
    }
  }

  // Headline
  if (headlineRow) {
    const headlineEl = headlineRow.querySelector('h1, h2, h3') || headlineRow.firstElementChild;
    if (headlineEl) {
      headlineEl.className = 'hero-banner-headline';
      content.append(headlineEl);
    }
  }

  // Body text
  if (bodyRow) {
    const bodyEl = bodyRow.querySelector('p') || bodyRow.firstElementChild;
    if (bodyEl) {
      bodyEl.className = 'hero-banner-body';
      content.append(bodyEl);
    }
  }

  // CTA buttons wrapper
  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'hero-banner-cta';

  if (ctaPrimaryRow) {
    while (ctaPrimaryRow.firstElementChild) {
      ctaWrapper.append(ctaPrimaryRow.firstElementChild);
    }
  }
  if (ctaSecondaryRow) {
    while (ctaSecondaryRow.firstElementChild) {
      ctaWrapper.append(ctaSecondaryRow.firstElementChild);
    }
  }

  if (ctaWrapper.children.length > 0) {
    content.append(ctaWrapper);
  }

  // Stats row
  if (statsRow) {
    const divider = document.createElement('hr');
    divider.className = 'hero-banner-divider';
    divider.setAttribute('aria-hidden', 'true');
    content.append(divider);

    const statsEl = buildStats(statsRow);
    content.append(statsEl);
  }

  // Set accessibility attributes on the block
  block.setAttribute('role', 'banner');
  const headlineText = block.querySelector('h1, h2, h3')?.textContent?.trim()
    || 'Hero banner';
  block.setAttribute('aria-label', headlineText);

  block.replaceChildren(bgLayer, content);

  // Classify all CTAs
  decorateButtons(content);
}