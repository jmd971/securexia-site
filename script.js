/**
 * SECUREXIA — script.js
 * SPA navigation with URL routing, mobile menu, GHL iframe resize,
 * email anti-obfuscation Cloudflare, scroll reveal animations.
 */

// ── URL ROUTING ────────────────────────────────────────────
// Map clean URLs ↔ page IDs. Used for direct deep-linking and
// keeping the address bar in sync as the user navigates.
var routes = {
  '/': 'home',
  '/collectivites': 'collectivites',
  '/etablissements': 'etablissements',
  '/programme-commerce': 'programme',
  '/audit-flash': 'audit',
  '/service': 'service',
  '/ressources': 'ressources',
  '/ressources/avis-defavorable-commission': 'article-avis',
  '/ressources/audit-erp-7-points': 'article-audit-7',
  '/ressources/categories-erp': 'article-categories',
  '/a-propos': 'apropos',
  '/cgv': 'cgv',
  '/mentions-legales': 'mentions',
  '/confidentialite': 'confidentialite'
};
var reverseRoutes = {};
Object.keys(routes).forEach(function(k) { reverseRoutes[routes[k]] = k; });

function pageIdFromPath(path) {
  if (routes[path]) return routes[path];
  // Strip trailing slash and retry
  var trimmed = path.replace(/\/$/, '');
  if (routes[trimmed]) return routes[trimmed];
  return '404';
}

function pathFromPageId(id) {
  return reverseRoutes[id] || ('/' + id);
}

// ── NAVIGATION SPA ──────────────────────────────────────────
function showPage(id, opts) {
  opts = opts || {};
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });
  var el = document.getElementById('page-' + id);
  if (!el) {
    el = document.getElementById('page-404');
    id = '404';
  }
  if (el) el.classList.add('active');

  // Reset active state on nav links
  document.querySelectorAll('.nav-link').forEach(function(l) {
    l.classList.remove('active');
  });

  // Sync URL unless we're responding to popstate (browser back/forward)
  // or unless we're on the same URL already.
  if (!opts.fromHistory) {
    var path = pathFromPageId(id);
    if (window.location.pathname !== path) {
      try {
        history.pushState({ pageId: id }, '', path);
      } catch (e) {
        // pushState fails in file:// — silently ignore for local previews
      }
    }
  }

  // Update document title for better history / shareable URLs
  setDocumentTitle(id);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: opts.silentScroll ? 'auto' : 'smooth' });

  // Close mobile menu
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('open');
  resetHamburger();

  // Re-bind reveals for the page that just appeared
  bindReveals();
}

function setDocumentTitle(id) {
  var titles = {
    'home': 'SECUREXIA — Conformité ERP Guadeloupe | Audit Flash gratuit',
    'collectivites': 'SECUREXIA — Conformité ERP pour collectivités',
    'etablissements': 'SECUREXIA — Conformité ERP pour établissements privés',
    'programme': 'SECUREXIA — Programme Mairies & commerçants',
    'audit': 'SECUREXIA — Demander mon Audit Flash gratuit',
    'service': 'SECUREXIA — Notre service managé',
    'ressources': 'SECUREXIA — Ressources & analyses conformité ERP',
    'article-avis': 'Avis défavorable de commission : que faire dans les 48h — SECUREXIA',
    'article-audit-7': 'Les 7 points qui font basculer une commission de sécurité — SECUREXIA',
    'article-categories': 'Catégories ERP : comprendre le classement de votre établissement — SECUREXIA',
    'apropos': 'SECUREXIA — À propos',
    'cgv': 'SECUREXIA — Conditions générales de vente',
    'mentions': 'SECUREXIA — Mentions légales',
    'confidentialite': 'SECUREXIA — Politique de confidentialité',
    '404': 'Page introuvable — SECUREXIA'
  };
  if (titles[id]) document.title = titles[id];
}

window.addEventListener('popstate', function(e) {
  var id = (e.state && e.state.pageId) || pageIdFromPath(window.location.pathname);
  showPage(id, { fromHistory: true, silentScroll: true });
});

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
var revealObserver = null;

function initRevealObserver() {
  if (revealObserver) return;
  if (!('IntersectionObserver' in window)) {
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
    var page = el.closest('.page');
    if (page && !page.classList.contains('active')) {
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

  // Resolve URL → page on load
  var initialId = pageIdFromPath(window.location.pathname);
  // Only re-show if it's not the default home page
  if (initialId !== 'home') {
    showPage(initialId, { fromHistory: true, silentScroll: true });
  } else {
    // Replace state so back button works correctly
    try { history.replaceState({ pageId: 'home' }, '', '/'); } catch (e) {}
    bindReveals();
  }
});
