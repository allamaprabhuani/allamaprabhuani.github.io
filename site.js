(function(){
  // Read pools from the bootstrap script (single source of truth).
  var C = window.SITE_CONFIG || { BGS: [], ACCENTS: [], CURSORS: [] };
  var BGS = C.BGS, ACCENTS = C.ACCENTS;
  var INTERACTIVE_SELECTOR = 'a, button, .photo, .upvote, .nav-btn, .btn-action, [tabindex="0"]';

  function reveal(){ document.body.classList.remove('landing'); }

  function persistIndex(qsKey, value, pool) {
    try {
      var idx = pool.indexOf(value);
      if (idx >= 0) localStorage.setItem(qsKey + '-i-' + (C.KEY_VERSION || 'v1'), idx);
    } catch(e) {}
  }

  document.addEventListener('DOMContentLoaded', function(){
    /* ---- Landing-gate reveal ---- */
    var photo = document.querySelector('.hero-photo .photo');
    if (photo) {
      photo.addEventListener('click', function(e){
        if (document.body.classList.contains('landing')) {
          e.preventDefault();
          reveal();
          setTimeout(function(){
            var first = document.getElementById('shipped');
            if (first) first.scrollIntoView({behavior:'smooth', block:'start'});
          }, 220);
        }
      });
    }
    document.querySelectorAll('.topnav a, a[href^="#"]').forEach(function(a){
      a.addEventListener('click', reveal);
    });

    function revealOnce(){
      if (document.body.classList.contains('landing')) reveal();
    }
    window.addEventListener('wheel',     revealOnce, { passive: true, once: true });
    window.addEventListener('touchmove', revealOnce, { passive: true, once: true });
    window.addEventListener('keydown', function(e){
      if (!document.body.classList.contains('landing')) return;
      if (['ArrowDown','PageDown','End',' ','Spacebar','Enter'].indexOf(e.key) !== -1) reveal();
    });
    // a11y: any keyboard focus into the page also reveals
    window.addEventListener('focusin', function(e){
      if (document.body.classList.contains('landing') && e.target !== photo) reveal();
    });

    /* ---- Custom site cursor (desktop only, respects reduced motion) ---- */
    var prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!prm && !coarse) {
      var cursor = document.createElement('div');
      cursor.className = 'site-cursor';
      document.body.appendChild(cursor);
      var x = 0, y = 0, raf = null;
      function paint(){ cursor.style.left = x + 'px'; cursor.style.top = y + 'px'; raf = null; }
      document.addEventListener('mousemove', function(e){
        x = e.clientX; y = e.clientY;
        cursor.classList.add('active');
        if (!raf) raf = requestAnimationFrame(paint);
      }, { passive: true });
      document.addEventListener('mouseleave', function(){ cursor.classList.remove('active'); });
      function isInteractive(t){ return t.closest && t.closest(INTERACTIVE_SELECTOR); }
      document.addEventListener('mouseover', function(e){ if (isInteractive(e.target)) cursor.classList.add('hover'); });
      document.addEventListener('mouseout',  function(e){ if (isInteractive(e.target)) cursor.classList.remove('hover'); });
    }

    /* ---- Theme toggle ---- */
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(){
        var cur = document.documentElement.getAttribute('data-theme') || 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        // iOS Safari: a position-fixed bg-layer prevents the rest of the page
        // from repainting on a CSS-variable swap until the user scrolls.
        // Setting colorScheme + nudging layout forces a synchronous repaint.
        document.documentElement.style.colorScheme = next;
        void document.body.offsetWidth;
        try { localStorage.setItem('theme', next); } catch(e) {}
      });
    }
    // Mirror the bootstrap-set theme onto colorScheme on first paint.
    document.documentElement.style.colorScheme = document.documentElement.getAttribute('data-theme') || 'light';

    /* ---- Shuffle: step bg + accent + cursor each click (matches refresh cycling) ---- */
    var shuffleBtn = document.getElementById('shuffle-bg');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', function(){
        function step(attr, pool, qsKey) {
          var i = pool.indexOf(document.documentElement.getAttribute(attr));
          var next = pool[(i + 1) % pool.length];
          document.documentElement.setAttribute(attr, next);
          persistIndex(qsKey, next, pool);
        }
        step('data-bg',     BGS,     'bg');
        step('data-accent', ACCENTS, 'accent');
        step('data-cursor', C.CURSORS, 'cursor');
      });
    }

    /* ---- Inject neural-net SVG only when active (and remove when not) ---- */
    var bgLayer = document.querySelector('.bg-layer');
    function syncNeuralNet() {
      if (!bgLayer) return;
      var on = document.documentElement.getAttribute('data-bg') === 'neural-net';
      var existing = bgLayer.querySelector('.neural-svg');
      if (on && !existing) {
        var t = document.getElementById('neural-net-template');
        if (t) bgLayer.appendChild(t.content.cloneNode(true));
      } else if (!on && existing) {
        existing.remove();
      }
    }
    syncNeuralNet();
    new MutationObserver(syncNeuralNet).observe(document.documentElement, { attributes: true, attributeFilter: ['data-bg'] });

    /* ---- Visit counter (cached + hidden on failure) ---- */
    var visitEl = document.getElementById('visit-count');
    var visitTally = document.querySelector('.visit-tally');
    if (visitEl && visitTally) {
      var CACHE_KEY = 'visit-count-cache';
      var TTL_MS = 6 * 60 * 60 * 1000;  // 6 hours
      var cached = null;
      try {
        var raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          var obj = JSON.parse(raw);
          if (obj && typeof obj.count === 'number' && (Date.now() - obj.t) < TTL_MS) cached = obj.count;
        }
      } catch(e) {}
      if (cached !== null) {
        visitEl.textContent = cached;
      } else {
        visitTally.style.opacity = '0';
      }
      var bumped = sessionStorage.getItem('site-visit-bumped') === '1';
      // counterapi v1 has opposite slash conventions: GET <key>/ needs the
      // slash; GET <key>/up must NOT have one. Wrong form → 301 without CORS.
      var endpoint = bumped
        ? 'https://api.counterapi.dev/v1/allamaprabhu-site/visits/'
        : 'https://api.counterapi.dev/v1/allamaprabhu-site/visits/up';
      fetch(endpoint)
        .then(function(r){ return r.json(); })
        .then(function(d){
          if (d && typeof d.count === 'number') {
            visitEl.textContent = d.count;
            visitTally.style.opacity = '';
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ count: d.count, t: Date.now() })); } catch(e) {}
            if (!bumped) sessionStorage.setItem('site-visit-bumped', '1');
          }
        })
        .catch(function(){ /* if no cache, tally stays hidden */ });
    }

    /* ---- Sidebar TOC scrollspy ---- */
    var tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length) {
      var tocMap = {};
      tocLinks.forEach(function(a, i){ tocMap[a.getAttribute('href').slice(1)] = { link: a, index: i }; });
      var sections = document.querySelectorAll('main > section[id]');
      var progressEl = document.getElementById('toc-progress');
      var totalSections = tocLinks.length;
      function setActive(id) {
        tocLinks.forEach(function(a){ a.classList.remove('active'); });
        var entry = tocMap[id];
        if (entry) {
          entry.link.classList.add('active');
          if (progressEl) progressEl.textContent = (entry.index + 1) + '/' + totalSections;
        }
      }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if (e.isIntersecting) setActive(e.target.id); });
        }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
        sections.forEach(function(s){ io.observe(s); });
      }
    }

    /* ---- Upvote buttons (rollback UI on API failure) ---- */
    var ns = 'allamaprabhu-bucket';
    document.querySelectorAll('.upvote').forEach(function(btn){
      var key = btn.getAttribute('data-key');
      var countEl = btn.querySelector('.up-count');
      var voted = localStorage.getItem('voted-' + key) === '1';
      if (voted) btn.classList.add('voted');

      // Trailing slash matters — see visit-counter note above.
      // counterapi returns 400 "record not found" until the key is first
      // incremented, so treat any non-numeric response as 0 (not "—" or "·").
      // Show the count only when we have a positive number from the API.
      // 0 / failure / "record not found" → leave the count slot empty.
      countEl.textContent = '';
      fetch('https://api.counterapi.dev/v1/' + ns + '/' + key + '/')
        .then(function(r){ return r.json().catch(function(){ return null; }); })
        .then(function(d){
          if (d && typeof d.count === 'number' && d.count > 0) {
            countEl.textContent = d.count;
          }
        })
        .catch(function(){});

      btn.addEventListener('click', function(){
        if (btn.classList.contains('voted') || btn.disabled) return;
        btn.disabled = true;
        var prevText = countEl.textContent;
        var current = parseInt(prevText, 10);
        if (!isNaN(current)) countEl.textContent = current + 1;
        btn.classList.add('voted');

        fetch('https://api.counterapi.dev/v1/' + ns + '/' + key + '/up')
          .then(function(r){ return r.json(); })
          .then(function(d){
            if (d && typeof d.count === 'number') {
              countEl.textContent = d.count;
              localStorage.setItem('voted-' + key, '1');
            } else {
              throw new Error('bad response');
            }
          })
          .catch(function(){
            // rollback: restore old count, allow retry, don't mark voted
            countEl.textContent = prevText;
            btn.classList.remove('voted');
            btn.disabled = false;
          });
      });
    });

    /* ---- Live citation counts from OpenAlex (CORS-friendly, no auth) ---- */
    var CITE_CACHE_KEY = 'openalex-cites-v1';
    var CITE_TTL_MS = 24 * 60 * 60 * 1000;  // 24 h
    var citeCache = {};
    try {
      var rawCites = localStorage.getItem(CITE_CACHE_KEY);
      if (rawCites) {
        var parsed = JSON.parse(rawCites);
        if (parsed && (Date.now() - parsed.t) < CITE_TTL_MS) citeCache = parsed.data || {};
      }
    } catch(e) {}
    var citeNodes = document.querySelectorAll('.cite-count[data-openalex]');
    function applyCite(el, count){
      // Hide the whole "cited X · OpenAlex" badge if count is 0 or unknown —
      // a "cited 0" badge advertises a weak paper, an empty placeholder
      // ("·") just looks broken. Better to render nothing.
      var badge = el.closest('.cite-badge');
      if (typeof count === 'number' && count > 0) {
        el.textContent = count;
        if (badge) badge.hidden = false;
      } else {
        if (badge) badge.hidden = true;
      }
    }
    citeNodes.forEach(function(el){
      var id = el.getAttribute('data-openalex');
      if (citeCache[id] != null) { applyCite(el, citeCache[id]); return; }
      // Polite-pool email per OpenAlex docs — adds you to the fast queue.
      var url = 'https://api.openalex.org/works/' + id + '?select=cited_by_count&mailto=allamaprabhuani@gmail.com';
      fetch(url)
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(d){
          var n = d && typeof d.cited_by_count === 'number' ? d.cited_by_count : null;
          applyCite(el, n);
          if (n != null) {
            citeCache[id] = n;
            try { localStorage.setItem(CITE_CACHE_KEY, JSON.stringify({ t: Date.now(), data: citeCache })); } catch(e) {}
          }
        })
        .catch(function(){ applyCite(el, null); });
    });

    /* ---- Defer the heavy proof-img screenshot until first hover ---- */
    /* HTML ships the URL as data-src; we promote to src on first interaction. */
    document.querySelectorAll('.proof-hover').forEach(function(span){
      var img = span.querySelector('.proof-img[data-src]');
      if (!img) return;
      function load(){
        if (img.getAttribute('src')) return;
        img.setAttribute('src', img.getAttribute('data-src'));
      }
      span.addEventListener('mouseenter', load, { once: true });
      span.addEventListener('focusin',    load, { once: true });
      span.addEventListener('touchstart', load, { once: true, passive: true });
    });
  });
})();
