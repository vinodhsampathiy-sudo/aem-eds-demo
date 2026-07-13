import { getMetadata } from '../../scripts/aem.js';

// Mirrors adobe/aem-boilerplate scripts.js decorateButtons()
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

// Stats are authored as a single cell: "value / label | value / label | value / label"
function buildStats(statsRow) {
  const dl = document.createElement('dl');
  dl.className = 'hero-banner-stats';

  const text = statsRow.textContent.trim();
  text.split('|').map((s) => s.trim()).filter(Boolean).forEach((statText) => {
    const [value, label] = statText.split('/').map((s) => s.trim());

    const item = document.createElement('div');
    item.className = 'hero-banner-stat';

    const dt = document.createElement('dt');
    dt.textContent = value || statText;
    item.append(dt);

    if (label) {
      const dd = document.createElement('dd');
      dd.textContent = label;
      item.append(dd);
    }

    dl.append(item);
  });

  return dl;
}

export default function decorate(block) {
  const rows = [...block.children];

  // First row is always the background image
  const bgRow = rows[0];
  const bgImg = bgRow?.querySelector('img');

  const contentRows = rows.slice(1);

  let eyebrow = null;
  let headline = null;
  let body = null;
  const ctaRows = [];
  let statsRow = null;

  contentRows.forEach((row) => {
    const link = row.querySelector('a');
    const heading = row.querySelector('h1, h2, h3, h4');

    if (link) {
      ctaRows.push(row);
      return;
    }

    if (heading && !headline) {
      headline = heading;
      return;
    }

    const text = row.textContent.trim();
    if (text.includes('|')) {
      statsRow = row;
      return;
    }

    if (!headline && !eyebrow) {
      eyebrow = row.querySelector('p') || row;
      return;
    }

    if (!body) {
      body = row.querySelector('p') || row;
    }
  });

  // --- Background layer ---
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-banner-background';
  if (bgImg) {
    bgImg.setAttribute('loading', 'eager');
    bgImg.setAttribute('fetchpriority', 'high');
    bgImg.setAttribute('alt', '');
    bgImg.removeAttribute('width');
    bgImg.removeAttribute('height');
    bgLayer.append(bgImg);
  }

  // --- Content layer ---
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  if (eyebrow) {
    eyebrow.className = 'hero-banner-eyebrow';
    content.append(eyebrow);
  }

  if (headline) {
    headline.className = 'hero-banner-headline';
    content.append(headline);
  }

  if (body) {
    body.className = 'hero-banner-body';
    content.append(body);
  }

  if (ctaRows.length) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-banner-ctas';
    ctaRows.forEach((row) => {
      while (row.firstElementChild) ctas.append(row.firstElementChild);
    });
    content.append(ctas);
  }

  if (statsRow) {
    const divider = document.createElement('div');
    divider.className = 'hero-banner-divider';
    content.append(divider);
    content.append(buildStats(statsRow));
  }

  block.replaceChildren(bgLayer, content);

  decorateButtons(content);
}