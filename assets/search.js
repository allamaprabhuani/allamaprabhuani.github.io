/* Lightweight client-side search: fetches /search.json, opens modal on ⌘K. */
(function () {
  let index = null;
  let suggestions = [];
  let modal, input, results, hint;
  let activeIdx = -1;
  let lastResults = [];

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Search');
    modal.innerHTML = `
      <div class="search-backdrop" data-close></div>
      <div class="search-panel">
        <div class="search-input-row">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input type="search" class="search-input" placeholder="Search tutorials and posts…" autocomplete="off" spellcheck="false" />
          <kbd class="search-esc">esc</kbd>
        </div>
        <div class="search-results" role="listbox"></div>
        <div class="search-hint">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>`;
    document.body.appendChild(modal);
    input = modal.querySelector('.search-input');
    results = modal.querySelector('.search-results');
    hint = modal.querySelector('.search-hint');
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close !== undefined) close();
    });
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', onKey);
  }

  function open() {
    if (!modal) buildModal();
    document.documentElement.classList.add('search-open');
    modal.classList.add('open');
    input.value = '';
    activeIdx = -1;
    render('');
    setTimeout(() => input.focus(), 30);
    ensureIndex();
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    document.documentElement.classList.remove('search-open');
  }

  function ensureIndex() {
    if (index) return Promise.resolve();
    return fetch('/search.json', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((j) => {
        index = j.items || [];
        suggestions = j.suggestions || [];
        if (!input.value) render('');
      })
      .catch(() => {
        results.innerHTML = '<div class="search-empty">Search index unavailable. Refresh and try again.</div>';
      });
  }

  /* score: title hit > tag hit > subtitle hit > body hit. */
  function score(item, q) {
    const ql = q.toLowerCase();
    const t  = (item.title    || '').toLowerCase();
    const st = (item.subtitle || '').toLowerCase();
    const b  = (item.body     || '').toLowerCase();
    const tags = (item.tags || []).join(' ').toLowerCase();
    let s = 0;
    if (t.startsWith(ql)) s += 100;
    if (t.includes(ql))   s += 50;
    if (tags.split(/\s+/).some((x) => x === ql)) s += 40;
    if (tags.includes(ql)) s += 15;
    if (st.includes(ql))   s += 10;
    if (b.includes(ql))    s += 3;
    return s;
  }

  function render(q) {
    if (!index) {
      results.innerHTML = '<div class="search-empty">Loading…</div>';
      return;
    }
    if (!q.trim()) {
      const pillsHtml = suggestions.map(
        (s) => `<button class="search-pill" data-pill="${escapeAttr(s)}">${escapeHtml(s)}</button>`
      ).join('');
      results.innerHTML = `
        <div class="search-empty">
          <p class="search-section-label">try a search</p>
          <div class="search-pills">${pillsHtml}</div>
          <p class="search-section-label">recent</p>
          <div class="search-recent">${renderRecentList()}</div>
        </div>`;
      results.querySelectorAll('.search-pill').forEach((b) => {
        b.addEventListener('click', () => { input.value = b.dataset.pill; render(b.dataset.pill); input.focus(); });
      });
      bindRowClicks();
      return;
    }
    const hits = index
      .map((it) => ({ it, s: score(it, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.it);
    lastResults = hits;
    activeIdx = hits.length ? 0 : -1;
    if (!hits.length) {
      results.innerHTML = `<div class="search-empty">No results for <strong>${escapeHtml(q)}</strong>. Try one of: ${suggestions.slice(0, 3).map(escapeHtml).join(', ')}.</div>`;
      return;
    }
    results.innerHTML = hits.map((it, i) => renderRow(it, i, q)).join('');
    bindRowClicks();
    updateActive();
  }

  function renderRecentList() {
    if (!index || !index.length) return '';
    return index.slice(0, 3).map((it, i) => renderRow(it, i)).join('');
  }

  function renderRow(it, i, q) {
    const kindBadge = `<span class="search-kind search-kind-${it.kind}">${it.kind}</span>`;
    const subtitle = it.subtitle ? `<p class="search-row-sub">${escapeHtml(it.subtitle)}</p>` : '';
    return `
      <a class="search-row" href="${escapeAttr(it.url)}" role="option" data-idx="${i}">
        <div class="search-row-head">
          ${kindBadge}
          <span class="search-row-title">${escapeHtml(it.title)}</span>
        </div>
        ${subtitle}
      </a>`;
  }

  function bindRowClicks() {
    results.querySelectorAll('.search-row').forEach((r) => {
      r.addEventListener('mouseenter', () => {
        activeIdx = +r.dataset.idx;
        updateActive();
      });
    });
  }

  function updateActive() {
    results.querySelectorAll('.search-row').forEach((r) => {
      r.classList.toggle('active', +r.dataset.idx === activeIdx);
    });
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (!lastResults.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % lastResults.length;
      updateActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + lastResults.length) % lastResults.length;
      updateActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = results.querySelector('.search-row[data-idx="' + activeIdx + '"]');
      if (row) window.location.href = row.getAttribute('href');
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* Global keyboard shortcut: ⌘K / Ctrl+K toggles. / focuses (Karpathy/GitHub feel). */
  document.addEventListener('keydown', (e) => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal && modal.classList.contains('open')) close(); else open();
    } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });

  /* Click on the nav search button. */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-search-open]');
    if (btn) { e.preventDefault(); open(); }
  });
})();
