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

function buildStatItem(valueText, labelText) {
  const item = document.createElement('div');
  item.className = 'hero-banner-stat';

  const dt = document.createElement('dt');
  dt.className = 'hero-banner-stat-value';
  dt.textContent = valueText;

  const dd = document.createElement('dd');
  dd.className = 'hero-banner-stat-label';
  dd.textContent = labelText;

  item.append(dt, dd);
  return item;
}

function buildStats(statRows) {
  const dl = document.createElement('dl');
  dl.className = 'hero-banner-stats';
  dl.setAttribute('aria-label', 'Key metrics');

  statRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      // Each cell is a separate column: first cell = value, second = label
      const valueText = cells[0]?.textContent.trim();
      const labelText = cells[1]?.textContent.trim();
      if (valueText) {
        dl.append(buildStatItem(valueText, labelText || ''));
      }
    } else if (cells.length === 1) {
      // Single cell — try to parse "value label" pairs from paragraphs or pipe-separated text
      const paragraphs = [...cells[0].querySelectorAll('p')];
      if (paragraphs.length >= 2) {
        // Pairs of paragraphs: p[0]=value, p[1]=label, p[2]=value, p[3]=label, ...
        for (let i = 0; i + 1 < paragraphs.length; i += 2) {
          const valueText = paragraphs[i].textContent.trim();
          const labelText = paragraphs[i + 1].textContent.trim();
          if (valueText) dl.append(buildStatItem(valueText, labelText));
        }
      } else {
        // Pipe-separated fallback
        const rawText = cells[0].textContent.trim();
        rawText.split('|').map((s) => s.trim()).filter(Boolean).forEach((segment) => {
          const match = segment.match(STAT_PATTERN);
          if (match) {
            dl.append(buildStatItem(match[1].trim(), match[2].trim()));
          } else {
            dl.append(buildStatItem(segment, ''));
          }
        });
      }
    }
  });

  return dl;
}

export default function decorate(block) {
  const rows = [...block.children];

  // Identify zones by scanning rows for their content type
  let eyebrowRow = null;
  let headlineRow = null;
  let bodyRow = null;
  const ctaRows = [];
  const statRows = [];

  rows.forEach((row) => {
    const hasH1 = row.querySelector('h1');
    const hasH2 = row.querySelector('h2');
    const hasLink = row.querySelector('a');
    const hasImg = row.querySelector('img, picture');

    if (hasH1 || hasH2) {
      headlineRow = row;
      return;
    }

    if (hasLink) {
      ctaRows.push(row);
      return;
    }

    if (hasImg) {
      // background image row — skip for now, handled separately
      return;
    }

    const paragraphs = [...row.querySelectorAll('p')];
    const directCells = [...row.children];

    // Detect stat rows: multiple cells OR cells with numeric-looking content
    const looksLikeStat = directCells.length > 1 ||
      (paragraphs.length >= 2 && /[\d,]+/.test(paragraphs[0]?.textContent || ''));

    if (looksLikeStat && (eyebrowRow || headlineRow)) {
      statRows.push(row);
      return;
    }

    const text = row.textContent.trim();
    if (!text) return;

    // Short uppercase text with no sentence structure → eyebrow
    if (!eyebrowRow && !headlineRow && text.length < 80 && text === text.toUpperCase()) {
      eyebrowRow = row;
      return;
    }

    // First non-eyebrow, non-headline paragraph block → body text
    if (headlineRow && !bodyRow) {
      bodyRow = row;
      return;
    }

    // Fallback: if we haven't found eyebrow yet and headline not found
    if (!eyebrowRow && !headlineRow) {
      eyebrowRow = row;
    } else if (!bodyRow) {
      bodyRow = row;
    } else {
      statRows.push(row);
    }
  });

  // --- Build decorative background layer (gradient + radial graphic) ---
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-banner-background';
  bgLayer.setAttribute('aria-hidden', 'true');

  // Decorative radial graphic element
  const radial = document.createElement('div');
  radial.className = 'hero-banner-radial';
  radial.setAttribute('aria-hidden', 'true');
  bgLayer.append(radial);

  // --- Build content layer ---
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  // Eyebrow
  if (eyebrowRow) {
    const eyebrowEl = eyebrowRow.querySelector('p') || eyebrowRow.firstElementChild;
    if (eyebrowEl) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'hero-banner-eyebrow';
      eyebrow.textContent = eyebrowEl.textContent.trim();
      // Visually hidden span for screen readers if needed
      const srSpan = document.createElement('span');
      srSpan.className = 'visually-hidden';
      srSpan.textContent = eyebrowEl.textContent.trim();
      eyebrow.setAttribute('aria-hidden', 'true');
      content.append(eyebrow);
      // Add a visually-hidden version for screen readers
      const srEyebrow = document.createElement('p');
      srEyebrow.className = 'hero-banner-eyebrow-sr';
      srEyebrow.textContent = eyebrowEl.textContent.trim();
      content.append(srEyebrow);
    }
  }

  // Headline
  if (headlineRow) {
    const headline = headlineRow.querySelector('h1, h2, h3');
    if (headline) content.append(headline);
  }

  // Body text
  if (bodyRow) {
    const bodyEl = bodyRow.querySelector('p') || bodyRow.firstElementChild;
    if (bodyEl) {
      bodyEl.className = 'hero-banner-body';
      content.append(bodyEl);
    }
  }

  // CTAs
  if (ctaRows.length > 0) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'hero-banner-ctas';
    ctaRows.forEach((row) => {
      while (row.firstElementChild) ctaWrapper.append(row.firstElementChild);
    });
    content.append(ctaWrapper);
  }

  // Stats
  if (statRows.length > 0) {
    const statsSection = document.createElement('div');
    statsSection.className = 'hero-banner-stats-section';

    const divider = document.createElement('hr');
    divider.className = 'hero-banner-stats-divider';
    divider.setAttribute('aria-hidden', 'true');
    statsSection.append(divider);

    const statsDl = buildStats(statRows);
    statsSection.append(statsDl);
    content.append(statsSection);
  }

  // Assemble block
  block.replaceChildren(bgLayer, content);

  // Set ARIA role on block
  block.setAttribute('role', 'banner');
  block.setAttribute('aria-label', 'Hero banner — Quality Engineering Platform');

  // Decorate buttons
  decorateButtons(content);

  // Lazy-load observer for below-fold images (none expected in this block, but future-proof)
  const imgs = block.querySelectorAll('img');
  imgs.forEach((img, i) => {
    if (i === 0) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    } else {
      img.setAttribute('loading', 'lazy');
    }
  });
}