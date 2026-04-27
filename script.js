/**
 * SECUREXIA — script.js
 * Navigation SPA, menu mobile, GHL iframe resize,
 * email anti-obfuscation Cloudflare, scroll reveal animations.
 */

// ── NAVIGATION SPA ──────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  var el = document.getElementById('page-' + id);
  if (el) el.classList.add('active');

  // Update active state on nav links
  document.querySelectorAll('.nav-link').forEach(function(l) {
    l.classList.remove('active');
  });

  // Smooth scroll back to top on page change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu on navigation
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  resetHamburger();

  // Re-bind reveals for the page that just appeared
  bindReveals();
}

// ── MENU MOBILE ─────────────────────────────────────────────
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn = document.getElementById('hamburger');
  if (!menu || !btn) return;
  menu.classList.toggle('open');
  var spans = btn.querySelectorAll('span');
  if (menu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    resetHamburger();
  }
}

function resetHamburger() {
  var btn = document.getElementById('hamburger');
  if (!btn) return;
  btn.querySelectorAll('span').forEach(function(s) {
    s.style.transform = '';
    s.style.opacity = '';
  });
}

// ── EMAIL ANTI-OBFUSCATION (Cloudflare) ─────────────────────
// Cloudflare scans static HTML and obfuscates visible emails.
// We build the address at runtime via JS concatenation — never written
// in clear in the HTML source.
function openEmail() {
  window.location.href = 'mai' + 'lto:' + 'contact' + '@' + 'securexia.fr';
}

function activateEmailLinks() {
  document.querySelectorAll('[data-email]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openEmail();
    });
    el.style.cursor = 'pointer';
  });
}

// ── GHL IFRAME RESIZE ──────────────────────────────────────
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'form-height') {
    var iframe = document.getElementById('ghl-audit-flash-form');
    if (iframe) iframe.style.minHeight = (e.data.height + 40) + 'px';
  }
});

// ── SCROLL REVEAL ──────────────────────────────────────────
// Lightweight IntersectionObserver-based reveals for elements
// with the .reveal class (and stagger delays via .reveal-delay-N).
var revealObserver = null;

function initRevealObserver() {
  if (revealObserver) return;
  if (!('IntersectionObserver' in window)) {
    // Fallback: reveal everything at once
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('in-view');
    });
    return;
  }
  revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  });
}

function bindReveals() {
  initRevealObserver();
  document.querySelectorAll('.reveal:not(.in-view)').forEach(function(el) {
    // If element is in the active page only — observe; else mark as visible
    // so it animates when its page becomes active.
    var page = el.closest('.page');
    if (page && !page.classList.contains('active')) {
      // Pre-mark hidden pages as in-view so they don't flicker on first show
      el.classList.add('in-view');
    } else if (revealObserver) {
      revealObserver.observe(el);
    } else {
      el.classList.add('in-view');
    }
  });
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  activateEmailLinks();
  bindReveals();
});
