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

function optimizeImages(container, eager = false) {
  container.querySelectorAll('img').forEach((img) => {
    const picture = createOptimizedPicture(img.src, img.alt || '', eager, [{ width: '2000' }]);
    const original = img.closest('picture') ?? img;
    original.replaceWith(picture);
  });
}

const STAT_PATTERN = /^([\d.,]+\s*[%×xXkKmMbB]*\+?)\s+(.+)$/;

function buildStats(statsRows) {
  const statsSection = document.createElement('div');
  statsSection.className = 'hero-banner-stats';
  statsSection.setAttribute('aria-label', 'Key metrics');

  const dl = document.createElement('dl');
  dl.className = 'hero-banner-stats-list';

  const addStat = (valueText, labelText) => {
    const item = document.createElement('div');
    item.className = 'hero-banner-stat';

    const dt = document.createElement('dt');
    dt.className = 'hero-banner-stat-value';
    dt.textContent = valueText.trim();

    const dd = document.createElement('dd');
    dd.className = 'hero-banner-stat-label';
    dd.textContent = labelText.trim();

    item.append(dt, dd);
    dl.append(item);
  };

  statsRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      // Two-cell row: first cell is value, second is label
      const valueText = cells[0].textContent.trim();
      const labelText = cells[1].textContent.trim();
      addStat(valueText, labelText);
    } else if (cells.length === 1) {
      // Single cell — try to split by pipe or match pattern
      const text = cells[0].textContent.trim();
      const parts = text.split('|').map((s) => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        parts.forEach((part) => {
          const match = part.match(STAT_PATTERN);
          if (match) {
            addStat(match[1], match[2]);
          } else {
            const dt = document.createElement('dt');
            dt.className = 'hero-banner-stat-value';
            dt.textContent = part;
            const item = document.createElement('div');
            item.className = 'hero-banner-stat';
            item.append(dt);
            dl.append(item);
          }
        });
      } else {
        const match = text.match(STAT_PATTERN);
        if (match) {
          addStat(match[1], match[2]);
        }
      }
    }
  });

  statsSection.append(dl);
  return statsSection;
}

export default function decorate(block) {
  block.setAttribute('role', 'banner');
  block.setAttribute('aria-label', 'Hero banner — Quality Engineering Platform');

  const rows = [...block.children];

  // Identify zones by scanning rows for their content type
  let bgRow = null;
  let eyebrowRow = null;
  let headlineRow = null;
  let bodyRow = null;
  const ctaRows = [];
  const statRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCell = cells[0];
    if (!firstCell) return;

    // Background image row: contains an img element
    if (!bgRow && firstCell.querySelector('img')) {
      bgRow = row;
      return;
    }

    // Headline row: contains h1
    if (!headlineRow && firstCell.querySelector('h1')) {
      headlineRow = row;
      return;
    }

    // CTA row: contains an anchor link
    if (firstCell.querySelector('a')) {
      ctaRows.push(row);
      return;
    }

    // Stats row: multiple cells each containing short text (value + label pattern)
    // Detect by: multiple cells OR single cell with pipe-separated content
    if (cells.length >= 2) {
      const allShortText = cells.every((c) => c.textContent.trim().length < 80 && !c.querySelector('a, img'));
      if (allShortText) {
        statRows.push(row);
        return;
      }
    }

    // Eyebrow: short paragraph, no link, no heading, appears before headline
    if (!headlineRow && !eyebrowRow && firstCell.querySelector('p') && !firstCell.querySelector('a, h1, h2, h3')) {
      const text = firstCell.textContent.trim();
      if (text.length < 100) {
        eyebrowRow = row;
        return;
      }
    }

    // Body text: paragraph after headline
    if (headlineRow && !bodyRow && firstCell.querySelector('p') && !firstCell.querySelector('a')) {
      bodyRow = row;
      return;
    }

    // Fallback: if we haven't assigned eyebrow yet and it's a short paragraph
    if (!eyebrowRow && firstCell.querySelector('p') && !firstCell.querySelector('a, h1, h2, h3')) {
      const text = firstCell.textContent.trim();
      if (text.length < 100) {
        eyebrowRow = row;
        return;
      }
    }

    // Remaining short-text rows after CTAs could be stats
    if (ctaRows.length > 0) {
      statRows.push(row);
    }
  });

  // --- Background layer ---
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-banner-background';
  bgLayer.setAttribute('aria-hidden', 'true');

  if (bgRow) {
    const bgImg = bgRow.querySelector('img');
    if (bgImg) {
      const picture = createOptimizedPicture(bgImg.src, '', true, [
        { media: '(min-width: 1024px)', width: '2000' },
        { media: '(min-width: 768px)', width: '1200' },
        { width: '750' },
      ]);
      bgLayer.append(picture);
    }
  }

  // Decorative arc graphic placeholder (aria-hidden)
  const arcDecor = document.createElement('div');
  arcDecor.className = 'hero-banner-decor';
  arcDecor.setAttribute('aria-hidden', 'true');
  bgLayer.append(arcDecor);

  // --- Content layer ---
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  // Eyebrow
  if (eyebrowRow) {
    const eyebrowEl = eyebrowRow.querySelector('p') || document.createElement('p');
    eyebrowEl.className = 'hero-banner-eyebrow';
    // Accessibility: add visually-hidden span for screen readers if text is all-caps
    const eyebrowText = eyebrowEl.textContent.trim();
    if (eyebrowText === eyebrowText.toUpperCase() && eyebrowText.length > 0) {
      const srSpan = document.createElement('span');
      srSpan.className = 'visually-hidden';
      srSpan.textContent = eyebrowText;
      srSpan.setAttribute('aria-label', eyebrowText.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()));
      eyebrowEl.setAttribute('aria-hidden', 'true');
      eyebrowEl.after(srSpan);
    }
    content.append(eyebrowEl);
    if (eyebrowEl.parentElement && eyebrowEl.parentElement !== content) {
      content.append(eyebrowEl);
    }
  }

  // Headline
  if (headlineRow) {
    const headlineEl = headlineRow.querySelector('h1');
    if (headlineEl) content.append(headlineEl);
  }

  // Body text
  if (bodyRow) {
    const bodyEl = bodyRow.querySelector('p');
    if (bodyEl) {
      bodyEl.className = 'hero-banner-body';
      content.append(bodyEl);
    }
  }

  // CTAs
  if (ctaRows.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'hero-banner-ctas';
    ctaRows.forEach((row) => {
      while (row.firstElementChild) ctaContainer.append(row.firstElementChild);
    });
    content.append(ctaContainer);
    decorateButtons(ctaContainer);
  }

  // Stats
  if (statRows.length > 0) {
    const divider = document.createElement('hr');
    divider.className = 'hero-banner-divider';
    divider.setAttribute('aria-hidden', 'true');
    content.append(divider);

    const statsEl = buildStats(statRows);
    content.append(statsEl);
  }

  // Assemble block
  block.replaceChildren(bgLayer, content);

  // Optimize background image (already handled above with createOptimizedPicture directly)
  // Optimize any remaining images in content layer
  content.querySelectorAll('img').forEach((img) => {
    const picture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
    const original = img.closest('picture') ?? img;
    original.replaceWith(picture);
  });

  // Variant handling
  if (block.classList.contains('dark') || block.classList.contains('hero-banner--dark')) {
    block.classList.add('hero-banner--dark');
  }

  // Lazy-load / intersection observer for below-fold enhancement
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('hero-banner--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px' }
  );
  observer.observe(block);
}