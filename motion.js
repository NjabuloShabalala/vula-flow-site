// Scroll reveal for the buyer and supplier pages. Without JavaScript, or when the visitor
// has asked for reduced motion, nothing is hidden and nothing moves.
(function () {
  var root = document.documentElement;
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  root.classList.add('js-motion');
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.doors')) return; // home page uses its own entrance
    var els = document.querySelectorAll('section:not(#top) > div:first-child');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  });
})();

// Tells the stylesheet when a page opens through a view transition, and whether it was Back.
// Browsers without the feature never fire this, and nothing changes for them.
(function () {
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    var el = document.documentElement;
    el.setAttribute('data-vt', '');
    var a = window.navigation && navigation.activation;
    if (a && a.navigationType === 'traverse') el.setAttribute('data-vt-dir', 'back');
    e.viewTransition.finished.then(function () {
      el.removeAttribute('data-vt'); el.removeAttribute('data-vt-dir');
    }, function () {
      el.removeAttribute('data-vt'); el.removeAttribute('data-vt-dir');
    });
  });
})();

// Arrival after the home-page door animation. The home page leaves a short-lived note in
// sessionStorage; this page then starts as the same warm light and clears it. If the note is
// old (someone came back to this tab much later) it is ignored. Nothing runs for reduced motion.
(function () {
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var t = 0;
  try { t = +sessionStorage.getItem('vf-door') || 0; sessionStorage.removeItem('vf-door'); } catch (e) {}
  if (!t || Date.now() - t > 8000) return;
  var el = document.documentElement;
  el.classList.add('door-arrive');
  setTimeout(function () { el.classList.remove('door-arrive'); }, 1200);   // safety: never leave it on
})();
