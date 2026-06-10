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

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
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
