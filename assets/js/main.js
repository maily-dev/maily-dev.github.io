/* Mai Ly — portfolio interactions
   Lightweight, dependency-free. */
(function () {
  'use strict';

  /* ---- current year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav: shadow on scroll ---- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', h > 0 ? (window.scrollY / h).toFixed(4) : 0);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu (right drawer + scrim) ---- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  var scrim = document.getElementById('navscrim');
  function setMenu(open) {
    if (!links) return;
    links.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('open', open);
    if (burger) { burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && links) {
    burger.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---- theme toggle (light / dark) ---- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  function applyTheme(t) { root.setAttribute('data-theme', t); }
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  if (stored) applyTheme(stored);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---- scroll-spy: highlight active section in nav ---- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[data-spy]'));
  var spyMap = {};
  spyLinks.forEach(function (a) { spyMap[a.getAttribute('data-spy')] = a; });
  var spyIds = Object.keys(spyMap);
  if ('IntersectionObserver' in window && spyIds.length) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          spyLinks.forEach(function (a) { a.classList.remove('active'); });
          var active = spyMap[e.target.id];
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spyIds.forEach(function (id) { var s = document.getElementById(id); if (s) spyObs.observe(s); });
  }

  /* ---- hero parallax (pointer-fine) ---- */
  var heroGrid = document.querySelector('.hero__grid');
  if (heroGrid && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var hraf = null, hx = 0, hy = 0;
    window.addEventListener('pointermove', function (e) {
      hx = (e.clientX / window.innerWidth - 0.5) * 18;
      hy = (e.clientY / window.innerHeight - 0.5) * 18;
      if (!hraf) hraf = requestAnimationFrame(function () {
        hraf = null;
        heroGrid.style.transform = 'translate3d(' + hx + 'px,' + hy + 'px,0)';
      });
    }, { passive: true });
  }

  /* ---- scroll reveal ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) {
      if (!el.classList.contains('in')) io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- animated count-up for stats ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { el.textContent = target; return; }
    var start = null, dur = 1300;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }

  /* ---- 3D tilt (pointer-fine devices only) ---- */
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function addTilt(el, maxDeg, lift, glare) {
    var raf = null, gx = 50, gy = 0, rx = 0, ry = 0, glareEl = null;
    if (glare) {
      glareEl = document.createElement('div');
      glareEl.className = 'media-card__glare';
      el.appendChild(glareEl);
    }
    function apply() {
      raf = null;
      el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(' + (-lift) + 'px) scale(1.018)';
      if (glareEl) { glareEl.style.setProperty('--gx', gx + '%'); glareEl.style.setProperty('--gy', gy + '%'); }
    }
    el.addEventListener('pointerenter', function () {
      el.style.transition = 'transform .1s ease-out';
      el.classList.add('is-tilting');
    });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      ry = (px * maxDeg).toFixed(2);
      rx = (-py * maxDeg).toFixed(2);
      gx = ((px + 0.5) * 100).toFixed(1);
      gy = ((py + 0.5) * 100).toFixed(1);
      if (!raf) raf = requestAnimationFrame(apply);
    });
    el.addEventListener('pointerleave', function () {
      el.style.transition = '';   // restore CSS transition for smooth return
      el.style.transform = '';
      el.classList.remove('is-tilting');
    });
  }
  if (fine && !reduce) {
    document.querySelectorAll('.media-card').forEach(function (c) { addTilt(c, 11, 8, true); });
    document.querySelectorAll('.skill-card, .mini').forEach(function (c) { addTilt(c, 5, 5, false); });
  }

  /* ---- print / download CV ---- */
  function triggerPrint(e) {
    if (e) e.preventDefault();
    window.print();
  }
  ['print-cv', 'print-cv-2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', triggerPrint);
  });
})();
