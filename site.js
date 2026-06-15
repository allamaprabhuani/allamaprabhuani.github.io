(function(){
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
    window.addEventListener('focusin', function(e){
      if (document.body.classList.contains('landing') && e.target !== photo) reveal();
    });

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

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      }
    }

    function storedTheme() {
      var theme;
      try { theme = localStorage.getItem('theme-preference'); } catch(e) {}
      return theme === 'light' || theme === 'dark' ? theme : null;
    }

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
      themeBtn.addEventListener('click', function(){
        var cur = document.documentElement.getAttribute('data-theme') || 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        setTheme(next);
        void document.body.offsetWidth;
        try { localStorage.setItem('theme-preference', next); } catch(e) {}
      });
    }
    document.documentElement.style.colorScheme = document.documentElement.getAttribute('data-theme') || 'light';

    var schemeQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (schemeQuery) {
      var syncSystemTheme = function(e){
        if (!storedTheme()) setTheme(e.matches ? 'dark' : 'light');
      };
      if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', syncSystemTheme);
      else if (schemeQuery.addListener) schemeQuery.addListener(syncSystemTheme);
    }

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

    var visitEl = document.getElementById('visit-count');
    var visitTally = document.querySelector('.visit-tally');
    if (visitEl && visitTally) {
      var CACHE_KEY = 'visit-count-cache';
      var TTL_MS = 6 * 60 * 60 * 1000;
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
        .catch(function(){ });
    }

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

    var ns = 'allamaprabhu-bucket';
    document.querySelectorAll('.upvote').forEach(function(btn){
      var key = btn.getAttribute('data-key');
      var countEl = btn.querySelector('.up-count');
      var voted = localStorage.getItem('voted-' + key) === '1';
      if (voted) btn.classList.add('voted');
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
            countEl.textContent = prevText;
            btn.classList.remove('voted');
            btn.disabled = false;
          });
      });
    });

    var CITE_CACHE_KEY = 'openalex-cites-v1';
    var CITE_TTL_MS = 24 * 60 * 60 * 1000;
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
