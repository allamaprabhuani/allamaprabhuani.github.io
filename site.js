(function(){
  var BGS = ['aurora','grid','contours','constellation','sunrise','linen','shooting-stars','neural-net'];
  var ACCENTS = ['wine','burgundy-rose','magenta','eggplant','forest','olive','steel','slate','navy','graphite'];

  function reveal(){ document.body.classList.remove('landing'); }

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
      a.addEventListener('click', function(){ reveal(); });
    });

    function revealOnScroll(){
      if (!document.body.classList.contains('landing')) return;
      reveal();
    }
    window.addEventListener('wheel',     revealOnScroll, { passive: true, once: true });
    window.addEventListener('touchmove', revealOnScroll, { passive: true, once: true });
    window.addEventListener('keydown', function(e){
      if (!document.body.classList.contains('landing')) return;
      if (['ArrowDown','PageDown','End',' ','Spacebar'].indexOf(e.key) !== -1) reveal();
    });

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(){
        var cur = document.documentElement.getAttribute('data-theme') || 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch(e) {}
      });
    }

    // ---- Custom site cursor (desktop only, respects reduced motion) ----
    var prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!prm && !coarse) {
      var cursor = document.createElement('div');
      cursor.className = 'site-cursor';
      document.body.appendChild(cursor);
      var x = 0, y = 0, raf = null;
      function paint(){
        cursor.style.left = x + 'px';
        cursor.style.top  = y + 'px';
        raf = null;
      }
      document.addEventListener('mousemove', function(e){
        x = e.clientX; y = e.clientY;
        cursor.classList.add('active');
        if (!raf) raf = requestAnimationFrame(paint);
      }, { passive: true });
      document.addEventListener('mouseleave', function(){ cursor.classList.remove('active'); });
      document.addEventListener('mouseover', function(e){
        if (e.target.closest && e.target.closest('a, button, .photo, .upvote, .nav-btn')) cursor.classList.add('hover');
      });
      document.addEventListener('mouseout', function(e){
        if (e.target.closest && e.target.closest('a, button, .photo, .upvote, .nav-btn')) cursor.classList.remove('hover');
      });
    }

    // shuffle button now steps to the next bg + accent in sequence
    // (matches the per-refresh cycling behaviour, but without reload)
    var shuffleBtn = document.getElementById('shuffle-bg');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', function(){
        var curBg = document.documentElement.getAttribute('data-bg');
        var bi = BGS.indexOf(curBg); if (bi < 0) bi = -1;
        var nextBg = BGS[(bi + 1) % BGS.length];
        document.documentElement.setAttribute('data-bg', nextBg);
        try { localStorage.setItem('bg-i', BGS.indexOf(nextBg)); } catch(e) {}

        var curA = document.documentElement.getAttribute('data-accent');
        var ai = ACCENTS.indexOf(curA); if (ai < 0) ai = -1;
        var nextA = ACCENTS[(ai + 1) % ACCENTS.length];
        document.documentElement.setAttribute('data-accent', nextA);
        try { localStorage.setItem('accent-i', ACCENTS.indexOf(nextA)); } catch(e) {}
      });
    }

    var visitEl = document.getElementById('visit-count');
    var visitTally = document.querySelector('.visit-tally');
    if (visitEl && visitTally) {
      visitTally.style.opacity = '0'; // hide until we know the count
      var bumped = sessionStorage.getItem('site-visit-bumped') === '1';
      var endpoint = bumped
        ? 'https://api.counterapi.dev/v1/allamaprabhu-site/visits'
        : 'https://api.counterapi.dev/v1/allamaprabhu-site/visits/up';
      fetch(endpoint)
        .then(function(r){ return r.json(); })
        .then(function(d){
          if (d && typeof d.count === 'number') {
            visitEl.textContent = d.count;
            visitTally.style.opacity = '';   // restore stylesheet opacity
            if (!bumped) sessionStorage.setItem('site-visit-bumped', '1');
          }
        })
        .catch(function(){ /* keep tally hidden on failure */ });
    }

    var tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length) {
      var tocMap = {};
      tocLinks.forEach(function(a, i){
        tocMap[a.getAttribute('href').slice(1)] = { link: a, index: i };
      });
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

      fetch('https://api.counterapi.dev/v1/' + ns + '/' + key)
        .then(function(r){ return r.json(); })
        .then(function(d){ if (d && d.count !== undefined) countEl.textContent = d.count; })
        .catch(function(){ countEl.textContent = '—'; });

      btn.addEventListener('click', function(){
        if (btn.classList.contains('voted')) return;
        btn.classList.add('voted');
        localStorage.setItem('voted-' + key, '1');
        var current = parseInt(countEl.textContent, 10);
        if (!isNaN(current)) countEl.textContent = current + 1;
        fetch('https://api.counterapi.dev/v1/' + ns + '/' + key + '/up')
          .then(function(r){ return r.json(); })
          .then(function(d){ if (d && d.count !== undefined) countEl.textContent = d.count; })
          .catch(function(){});
      });
    });
  });
})();
