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

  // Identify zones by scanning rows for their content type
  let bgImgRow = null;
  let eyebrowRow = null;
  let headlineRow = null;
  let bodyTextRow = null;
  let statsRow = null;
  const ctaRows = [];

  rows.forEach((row) => {
    const hasImg = row.querySelector('img');
    const hasHeading = row.querySelector('h1, h2, h3');
    const hasLink = row.querySelector('a');

    if (hasImg && !hasHeading && !hasLink) {
      bgImgRow = row;
      return;
    }

    if (hasHeading) {
      headlineRow = row;
      return;
    }

    if (hasLink) {
      ctaRows.push(row);
      return;
    }

    // Distinguish eyebrow vs body-text vs stats by content characteristics
    const text = row.textContent.trim();
    const hasMultipleStats = text.includes('|') || (row.querySelectorAll('p, div').length > 1 && !hasHeading && !hasLink);

    if (!eyebrowRow && !headlineRow && !hasImg) {
      // First non-image, non-heading, non-link row before headline is eyebrow
      eyebrowRow = row;
      return;
    }

    if (headlineRow && !bodyTextRow && !hasImg && !hasLink) {
      // First text row after headline is body text
      bodyTextRow = row;
      return;
    }

    if (headlineRow && bodyTextRow && !hasImg && !hasLink) {
      // Subsequent text rows after body are stats
      statsRow = row;
      return;
    }

    // Fallback: if we haven't assigned eyebrow yet
    if (!eyebrowRow) {
      eyebrowRow = row;
    }
  });

  // Re-scan in order to correctly assign zones based on document order
  bgImgRow = null;
  eyebrowRow = null;
  headlineRow = null;
  bodyTextRow = null;
  statsRow = null;
  ctaRows.length = 0;

  rows.forEach((row) => {
    const hasImg = !!row.querySelector('img');
    const hasHeading = !!row.querySelector('h1, h2, h3');
    const hasLink = !!row.querySelector('a');
    const textContent = row.textContent.trim();

    if (hasImg && !hasHeading && !hasLink) {
      bgImgRow = row;
      return;
    }

    if (hasHeading && !headlineRow) {
      headlineRow = row;
      return;
    }

    if (hasLink) {
      ctaRows.push(row);
      return;
    }

    if (!headlineRow && !eyebrowRow && textContent) {
      eyebrowRow = row;
      return;
    }

    if (headlineRow && !bodyTextRow && textContent) {
      bodyTextRow = row;
      return;
    }

    if (headlineRow && bodyTextRow && textContent) {
      statsRow = row;
    }
  });

  // --- Build background layer ---
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-banner-background';
  bgLayer.setAttribute('aria-hidden', 'true');

  if (bgImgRow) {
    const bgImg = bgImgRow.querySelector('img');
    if (bgImg) {
      bgImg.setAttribute('loading', 'eager');
      bgImg.setAttribute('fetchpriority', 'high');
      bgImg.setAttribute('alt', '');
      bgImg.removeAttribute('width');
      bgImg.removeAttribute('height');
      bgLayer.append(bgImg);
    }
  }

  // --- Build content layer ---
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  // Eyebrow
  if (eyebrowRow) {
    const eyebrowEl = eyebrowRow.querySelector('p') || eyebrowRow.firstElementChild;
    if (eyebrowEl) {
      eyebrowEl.className = 'hero-banner-eyebrow';
      eyebrowEl.setAttribute('aria-label', eyebrowEl.textContent.trim());
      content.append(eyebrowEl);
    }
  }

  // Headline
  if (headlineRow) {
    const headingEl = headlineRow.querySelector('h1, h2, h3');
    if (headingEl) {
      content.append(headingEl);
    }
  }

  // Body text
  if (bodyTextRow) {
    const bodyEl = bodyTextRow.querySelector('p') || bodyTextRow.firstElementChild;
    if (bodyEl) {
      bodyEl.className = 'hero-banner-body';
      content.append(bodyEl);
    }
  }

  // CTAs
  if (ctaRows.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'hero-banner-cta-group';
    ctaRows.forEach((row) => {
      while (row.firstElementChild) {
        ctaContainer.append(row.firstElementChild);
      }
    });
    content.append(ctaContainer);
  }

  // Stats
  if (statsRow) {
    const statsEl = document.createElement('dl');
    statsEl.className = 'hero-banner-stats';
    statsEl.setAttribute('aria-label', 'Key statistics');

    // Try to find individual stat items — look for pipe-separated text or multiple child elements
    const statCells = [...statsRow.querySelectorAll('p, div')].filter((el) => el.textContent.trim());

    if (statCells.length > 1) {
      statCells.forEach((cell) => {
        const text = cell.textContent.trim();
        // Try to split number from label (e.g. "12,400+" and "Test cases managed")
        const match = text.match(/^([0-9,+.%]+\+?)\s+(.+)$/);
        if (match) {
          const dt = document.createElement('dt');
          dt.textContent = match[1];
          const dd = document.createElement('dd');
          dd.textContent = match[2];
          const statItem = document.createElement('div');
          statItem.className = 'hero-banner-stat';
          statItem.append(dt, dd);
          statsEl.append(statItem);
        } else {
          const dt = document.createElement('dt');
          dt.textContent = text;
          const statItem = document.createElement('div');
          statItem.className = 'hero-banner-stat';
          statItem.append(dt);
          statsEl.append(statItem);
        }
      });
    } else {
      // Single cell with pipe-separated stats
      const rawText = statsRow.textContent.trim();
      const parts = rawText.split('|').map((s) => s.trim()).filter(Boolean);
      parts.forEach((part) => {
        const match = part.match(/^([0-9,+.%]+\+?)\s+(.+)$/);
        const statItem = document.createElement('div');
        statItem.className = 'hero-banner-stat';
        if (match) {
          const dt = document.createElement('dt');
          dt.textContent = match[1];
          const dd = document.createElement('dd');
          dd.textContent = match[2];
          statItem.append(dt, dd);
        } else {
          const dt = document.createElement('dt');
          dt.textContent = part;
          statItem.append(dt);
        }
        statsEl.append(statItem);
      });
    }

    content.append(statsEl);
  }

  // Set ARIA role on block
  block.setAttribute('role', 'banner');
  const headlineText = headlineRow?.querySelector('h1, h2, h3')?.textContent?.trim() || 'Hero banner';
  block.setAttribute('aria-label', `Hero banner — ${headlineText}`);

  block.replaceChildren(bgLayer, content);
  decorateButtons(content);
}