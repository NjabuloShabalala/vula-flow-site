/* VulaFlow landing: scroll story.
   1. The wordmark falls in letter by letter.
   2. Scrolling breaks it into three documents that fall behind the opening line.
   3. The documents come back and become the two doors.
   Only movement and fade are animated. If the visitor asks for reduced motion (or this
   script does not run) the page stays as plain stacked sections. */
(function () {
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var html = document.documentElement;
  var story = document.getElementById('story');
  var wordmark = document.getElementById('wordmark');
  var docs = [].slice.call(document.querySelectorAll('.doc'));
  var sheet = document.getElementById('sheet');
  var cue = document.getElementById('cue');
  var stage = document.getElementById('stage');
  var head = document.querySelector('.site-head');
  var dsec = document.getElementById('doors-sec');
  var panel = document.getElementById('panel');
  var doorEls = [].slice.call(document.querySelectorAll('.vdoor'));
  if (!story || !wordmark || !sheet || !dsec || !panel) return;

  html.classList.add('js-story');

  var clamp = function (x, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x)); };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  // ---- Part 1: split the wordmark into letters. Outer span = scroll scatter, inner span = fall-in. ----
  var word = 'VulaFlow';
  var tilts = [-9, 7, -6, 10, -8, 6, -10, 8];     // fixed, so every visit looks the same
  var drift = [-.9, .6, -.4, .8, -.7, .5, -.3, .9];
  var spin  = [-70, 50, -40, 80, -60, 45, -35, 65];
  wordmark.textContent = '';
  var letters = [];
  for (var i = 0; i < word.length; i++) {
    var outer = document.createElement('span');
    outer.className = 'lt' + (i >= 4 ? ' fl' : '');
    outer.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('span');
    inner.className = 'lg';
    inner.textContent = word.charAt(i);
    var d = (150 + i * 60) + 'ms';
    inner.style.animationDelay = d + ', ' + d;   // pop and fade share the same delay
    outer.appendChild(inner);
    wordmark.appendChild(outer);
    letters.push(outer);
  }

  var docTilt = [-8, 5, 9], docSpin = [-34, 22, 40], docSpeed = [1.0, 1.12, .94];
  var doorTilt = [-7, 6, -5], doorStart = [0, 0, 0];

  // distance from the top of the doors section down to an element's natural position
  function offsetIn(el, root) {
    var y = 0;
    while (el && el !== root) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  function update() {
    var vh = window.innerHeight, vw = window.innerWidth;

    /* ---- story progress, 0 at the top to 1 when the pin releases ---- */
    var r = story.getBoundingClientRect();
    // Progress is measured in a fixed scroll distance (1.275 screens), so the early timing stays
    // the same. The pinned area ends just after the navy section lands (P about .77), which
    // leaves no frozen scroll before the page moves on to the doors.
    var P = clamp(-r.top / (vh * 1.275));

    // letters scatter left to right and fall
    for (var i = 0; i < letters.length; i++) {
      var s = clamp((P - (.05 + i * .014)) / .2);
      var e = s * s;
      letters[i].style.transform = s === 0 ? '' :
        'translate3d(' + (drift[i] * s * vw * .08).toFixed(1) + 'px,' + (e * vh * .95).toFixed(1) + 'px,0) rotate(' + (spin[i] * s).toFixed(1) + 'deg)';
      letters[i].style.opacity = s === 0 ? '' : (1 - clamp((s - .25) / .75)).toFixed(3);
    }

    // documents appear where the letters were, then fall away
    var appear = clamp((P - .10) / .06);
    for (var k = 0; k < docs.length; k++) {
      var f = clamp((P - (.12 + k * .035)) / .4);
      var ty = Math.pow(f, 2.1) * vh * 1.45 * docSpeed[k];
      var rot = docTilt[k] * appear + f * docSpin[k];
      var sc = .8 + .2 * appear;
      docs[k].style.opacity = appear.toFixed(3);
      docs[k].style.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0) rotate(' + rot.toFixed(1) + 'deg) scale(' + sc.toFixed(3) + ')';
    }

    // the opening line slides up over everything, so the documents fall behind it
    var m = clamp((P - .36) / .32);
    sheet.style.transform = m >= 1 ? 'translateY(0)' : 'translateY(' + ((1 - smooth(m)) * 100).toFixed(2) + '%)';

    // scroll cue: shown at the top, hidden while the story moves, shown again to point on
    var cueO = P < .06 ? 1 : P < .12 ? 1 - (P - .06) / .06 : P < .68 ? 0 : P < .75 ? (P - .68) / .07 : 1;
    cue.style.setProperty('--cue', cueO.toFixed(3));
    cue.classList.toggle('on-dark', P > .5);

    // top bar goes dark while the navy section is under it
    var st = stage.getBoundingClientRect();
    var sheetTop = st.top + (m >= 1 ? 0 : (1 - smooth(m)) * vh);
    head.classList.toggle('head-dark', sheetTop < 34 && st.bottom > 34);
    if (!html.classList.contains('cue-set') && window.scrollY > 4) html.classList.add('cue-set');

    /* ---- Part 3: documents become the doors ---- */
    var sr = dsec.getBoundingClientRect();
    var items = [panel].concat(doorEls);
    var narrow = vw < 760;              // doors stack in one column on phones
    for (var n = 0; n < items.length; n++) {
      var el = items[n];
      var y0 = offsetIn(el, dsec);
      // Phones: every door animates from its own position with no delay, so one door never
      // moves over its neighbour. Wide screens keep a small stagger between the two doors.
      var delay = narrow || n === 0 ? 0 : .06 + (n - 1) * .06;
      var p = clamp(((vh * .95 - (sr.top + y0)) / (vh * (narrow ? .34 : .5))) - delay);
      var pe = easeOut(p);
      var ty2, rot2, scl;
      if (narrow) {
        // phones: the panel stays put, each door just rises into place
        ty2 = n === 0 ? 0 : (1 - pe) * 40;
        rot2 = 0;
        scl = n === 0 ? 1 : .94 + .06 * pe;
      } else {
        var fall = -(y0 + el.offsetHeight + 80) * (n === 0 ? 1 : .35);
        ty2 = (1 - pe) * fall;
        rot2 = (1 - pe) * doorTilt[n];
        scl = .62 + .38 * pe;
      }
      if (p >= 1) { el.style.transform = ''; }
      else el.style.transform = 'translate3d(0,' + ty2.toFixed(1) + 'px,0) rotate(' + rot2.toFixed(2) + 'deg) scale(' + scl.toFixed(3) + ')';
      if (n === 0) {
        el.style.borderRadius = (8 + 4 * pe).toFixed(1) + 'px';
      } else {
        var top = 6 + 300 * smooth(clamp((p - .1) / .7));
        el.style.borderRadius = top.toFixed(1) + 'px ' + top.toFixed(1) + 'px 6px 6px';
        el.style.setProperty('--c', clamp((p - .5) / .4).toFixed(3));
      }
    }
  }


  /* ---- Door opening: click a door and it centres, swings open, and you walk into the light ----
     The links stay real. Only a plain left click is intercepted, so new-tab, copy-link and keyboard
     Enter behave normally. If anything about the animation is unavailable we just follow the link. */
  var opening = false, openScene = null;

  function prefetch(href) {
    if (prefetch.done[href]) return;
    prefetch.done[href] = 1;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = href; document.head.appendChild(l);
  }
  prefetch.done = {};

  function cleanupDoor() {                       // also used when Back returns to this page
    if (openScene) { openScene.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); openScene = null; }
    html.classList.remove('door-opening');
    doorEls.forEach(function (d) { d.classList.remove('is-chosen'); });
    window.removeEventListener('wheel', stopScroll, { passive: false });
    window.removeEventListener('touchmove', stopScroll, { passive: false });
    opening = false;
  }
  function stopScroll(e) { e.preventDefault(); }

  function openDoor(door, href) {
    if (opening) return;
    if (!door.animate) { window.location.href = href; return; }
    opening = true;
    var vw2 = window.innerWidth, vh2 = window.innerHeight;
    var rc = door.getBoundingClientRect();

    // the scene: a veil over the page, a copy of the door that will move, and the light behind it
    var scrim = document.createElement('div'); scrim.className = 'dr-scrim';
    var dr = document.createElement('div'); dr.className = 'dr'; dr.setAttribute('aria-hidden', 'true');
    dr.style.cssText = 'left:' + rc.left + 'px;top:' + rc.top + 'px;width:' + rc.width + 'px;height:' + rc.height + 'px';
    var light = document.createElement('div'); light.className = 'dr-light';
    var leaf = door.cloneNode(true);
    leaf.className = door.className.replace('is-chosen', '') + ' dr-leaf';
    leaf.removeAttribute('style'); leaf.style.setProperty('--c', '1');
    leaf.style.borderRadius = '999px 999px 6px 6px';
    [].forEach.call(leaf.querySelectorAll('a'), function (a) { a.removeAttribute('href'); a.tabIndex = -1; });
    dr.appendChild(light); dr.appendChild(leaf);
    var veil = document.createElement('div'); veil.className = 'dr-veil';
    document.body.appendChild(scrim); document.body.appendChild(dr); document.body.appendChild(veil);
    openScene = [scrim, dr, veil];
    door.classList.add('is-chosen');
    html.classList.add('door-opening');
    window.addEventListener('wheel', stopScroll, { passive: false });       // hold the page still
    window.addEventListener('touchmove', stopScroll, { passive: false });

    // where the door needs to go: the middle of the screen, a little smaller if it is tall
    var s1 = Math.min(1, vh2 * .8 / rc.height, vw2 * .9 / rc.width);
    var dx = vw2 / 2 - (rc.left + rc.width / 2), dy = vh2 / 2 - (rc.top + rc.height / 2);
    var centred = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s1 + ')';
    var S = Math.max(vw2 / rc.width, vh2 / rc.height) * 2.4;                // big enough to fill the screen

    scrim.animate([{ opacity: 0 }, { opacity: .97 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
    dr.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: centred }],
      { duration: 340, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' });
    leaf.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-104deg)' }],
      { duration: 440, delay: 280, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' });
    dr.animate([{ transform: centred }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + S + ')' }],
      { duration: 300, delay: 660, easing: 'cubic-bezier(.6,0,.9,.4)', fill: 'forwards' });
    veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay: 840, fill: 'forwards' });

    // the next page picks up from the same light (see motion.js)
    try { sessionStorage.setItem('vf-door', String(Date.now())); } catch (e) {}
    prefetch(href);
    setTimeout(function () { window.location.href = href; }, 1000);
  }

  doorEls.forEach(function (d) {
    [].forEach.call(d.querySelectorAll('a[href]'), function (a) {
      var warm = function () { prefetch(a.getAttribute('href')); };
      a.addEventListener('pointerenter', warm); a.addEventListener('focus', warm);
      a.addEventListener('touchstart', warm, { passive: true });
      a.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        openDoor(d, a.getAttribute('href'));
      });
    });
  });
  // coming back with Back: reset the scene so the doors are normal again
  window.addEventListener('pageshow', function (e) { if (e.persisted || opening) cleanupDoor(); });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('pageshow', update);
  update();
})();
