/* ==========================================================================
   Águas Clara Resort · interações e animações
   - Tudo que é essencial (links, menu, acordeão) funciona sem GSAP.
   - Animações só rodam com prefers-reduced-motion: no-preference.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var cfg = window.AGUAS_CLARA || {};
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceMQ.matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  clearTimeout(window.__acFailsafe);
  if (!hasGSAP || reduce) root.classList.remove('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Links centralizados (js/config.js) ---------- */
  function setupLinks() {
    if (cfg.whatsappLink) {
      $$('[data-whatsapp]').forEach(function (a) { a.href = cfg.whatsappLink; });
    }
    if (cfg.instagram) $$('[data-instagram]').forEach(function (a) { a.href = cfg.instagram; });
  }

  /* ---------- Rolagem até âncoras ---------- */
  function scrollToHash(hash) {
    var target = hash === '#inicio' ? document.body : $(hash);
    if (!target) return;
    if (lenis) lenis.scrollTo(hash === '#inicio' ? 0 : target, { duration: 1.4 });
    else (hash === '#inicio' ? window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }) : target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
    var focusEl = hash === '#inicio' ? $('#inicio') : target;
    if (focusEl) {
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    }
    if (history.replaceState) history.replaceState(null, '', hash);
  }
  function setupAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var hash = a.getAttribute('href');
      if (hash.length < 2 || hash === '#conteudo') return;
      if (!$(hash)) return;
      e.preventDefault();
      if (menuIsOpen()) closeMenu(false);
      scrollToHash(hash);
    });
  }

  /* ---------- Header flutuante ---------- */
  function setupHeader() {
    var hdr = $('[data-hdr]');
    var hero = $('#inicio');
    var lastY = window.scrollY;
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      var heroH = hero ? hero.offsetHeight * 0.6 : 400;
      hdr.classList.toggle('is-scrolled', y > heroH);
      if (!menuIsOpen()) {
        if (y > lastY + 6 && y > 240) hdr.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 240) hdr.classList.remove('is-hidden');
      }
      lastY = y;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    hdr.addEventListener('focusin', function () { hdr.classList.remove('is-hidden'); });
    requestAnimationFrame(update);
  }

  /* ---------- Indicador da seção ativa ---------- */
  function setupActiveNav() {
    var nav = $('.hdr__nav');
    var links = $$('[data-nav]');
    var indicator = $('.hdr__indicator');
    var current = null;
    function moveTo(link) {
      if (!link) return;
      nav.style.setProperty('--x', link.offsetLeft + 'px');
      nav.style.setProperty('--w', link.offsetWidth + 'px');
      indicator.style.top = link.offsetTop + 'px';
    }
    function setActive(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (l) {
        var on = l.dataset.nav === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        if (on) moveTo(l);
      });
      nav.classList.toggle('has-active', !!id);
    }
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -54% 0px' });
    links.forEach(function (l) { var s = document.getElementById(l.dataset.nav); if (s) io.observe(s); });
    window.addEventListener('resize', function () {
      var a = links.filter(function (l) { return l.classList.contains('is-active'); })[0];
      moveTo(a);
    });
  }

  /* ---------- Menu mobile ---------- */
  var menu, burger, lastFocus;
  function menuIsOpen() { return burger && burger.getAttribute('aria-expanded') === 'true'; }
  function focusables() {
    return [burger].concat($$('a[href], button:not([disabled])', menu));
  }
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    root.classList.add('menu-open');
    $('[data-hdr]').classList.remove('is-hidden');
    if (lenis) lenis.stop();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
    });
    setTimeout(function () { var f = $('a', menu); if (f) f.focus({ preventScroll: true }); }, 350);
  }
  function closeMenu(returnFocus) {
    if (!menuIsOpen()) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    root.classList.remove('menu-open');
    if (lenis) lenis.start();
    var done = false;
    var finish = function () { if (done) return; done = true; if (!menuIsOpen()) menu.hidden = true; };
    $('.menu__sheet', menu).addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, reduce ? 0 : 900);
    if (returnFocus !== false) burger.focus({ preventScroll: true });
  }
  function setupMenu() {
    menu = $('[data-menu]');
    burger = $('[data-burger]');
    if (!menu || !burger) return;
    burger.addEventListener('click', function () { menuIsOpen() ? closeMenu() : openMenu(); });
    document.addEventListener('keydown', function (e) {
      if (!menuIsOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        var first = f[0], last = f[f.length - 1];
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && (document.activeElement === first || i === -1)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || i === -1)) { e.preventDefault(); first.focus(); }
      }
    });
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && !a.hasAttribute('href')) return;
      if (a && a.getAttribute('href').charAt(0) !== '#') closeMenu(false);
    });
    window.matchMedia('(min-width: 1180px)').addEventListener('change', function (m) { if (m.matches) closeMenu(false); });
  }

  /* ---------- Botão flutuante de WhatsApp ---------- */
  function setupFloat() {
    var wrap = $('[data-wa-float]');
    var bubble = $('[data-wa-bubble]');
    if (!wrap) return;
    var hideTimer;
    function hideBubble() {
      if (bubble.hidden) return;
      clearTimeout(hideTimer);
      bubble.classList.add('is-out');
      setTimeout(function () { bubble.hidden = true; bubble.classList.remove('is-out'); }, reduce ? 0 : 360);
    }
    function showBubble() {
      bubble.hidden = false;
      hideTimer = setTimeout(hideBubble, 7000);
    }
    var seen = false;
    try { seen = sessionStorage.getItem('ac-balao') === '1'; } catch (e) { seen = false; }
    if (!seen) {
      setTimeout(function () {
        try { sessionStorage.setItem('ac-balao', '1'); } catch (e) { /* sem storage: segue */ }
        if (!menuIsOpen()) showBubble();
      }, 3500);
    }
    bubble.addEventListener('click', hideBubble);
    $('.wa-float__btn', wrap).addEventListener('click', hideBubble);

    // Nunca cobre os botões de CTA: some quando um deles passa pela zona do botão.
    var ctas = $$('[data-cta]');
    var ticking = false;
    function check() {
      ticking = false;
      var h = window.innerHeight, w = window.innerWidth;
      var zoneTop = h - 120;
      var overlap = ctas.some(function (el) {
        var r = el.getBoundingClientRect();
        return r.bottom > zoneTop && r.top < h && r.right > w - 110;
      });
      wrap.classList.toggle('is-hidden', overlap);
    }
    var req = function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    setTimeout(req, 1200);
  }

  /* ---------- Respingo nos botões ---------- */
  function setupRipple() {
    if (reduce) return;
    document.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest && e.target.closest('.btn');
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height) * 2.2;
      var s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px';
      s.style.top = (e.clientY - r.top - size / 2) + 'px';
      btn.appendChild(s);
      s.addEventListener('animationend', function () { s.remove(); });
    });
  }

  /* ---------- Textura de cáusticas (gerada uma vez, tileável) ---------- */
  function makeCaustics() {
    var N = 160;
    var c = document.createElement('canvas');
    c.width = c.height = N;
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(N, N);
    var pts = [];
    var seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (var k = 0; k < 9; k++) pts.push([rnd(), rnd()]);
    var TAU = Math.PI * 2;
    var row = 0;
    function slice(deadline) {
      // poucas linhas por vez: nunca vira tarefa longa
      var until = row + 12;
      for (; row < N && row < until; row++) {
        var v = row / N;
        for (var x = 0; x < N; x++) {
          var u = x / N;
          // distorção periódica: mantém a textura sem emendas
          var wu = u + 0.035 * Math.sin(TAU * (2 * v + 0.3)) + 0.02 * Math.sin(TAU * (3 * u + 2 * v));
          var wv = v + 0.035 * Math.sin(TAU * (2 * u + 0.7)) + 0.02 * Math.cos(TAU * (2 * u - 3 * v));
          var f1 = 9, f2 = 9;
          for (var p = 0; p < pts.length; p++) {
            var dx = wu - pts[p][0]; dx = Math.abs(dx - Math.round(dx));
            var dy = wv - pts[p][1]; dy = Math.abs(dy - Math.round(dy));
            var d = dx * dx + dy * dy;
            if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
          }
          var e = Math.sqrt(f2) - Math.sqrt(f1);
          var a = Math.max(0, 1 - e / 0.05);
          var i = (row * N + x) * 4;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
          img.data[i + 3] = Math.round(a * a * 235);
        }
      }
      if (row < N) { idle(slice); return; }
      ctx.putImageData(img, 0, 0);
      // Aplica só nas camadas de cáustica (no :root forçaria o recálculo do documento inteiro)
      var bg = 'url(' + c.toDataURL('image/png') + ')';
      $$('.caustics i').forEach(function (el) { el.style.backgroundImage = bg; });
    }
    idle(slice);
  }
  var idle = window.requestIdleCallback
    ? function (fn) { return window.requestIdleCallback(fn, { timeout: 1500 }); }
    : function (fn) { return setTimeout(fn, 32); };

  /* ---------- Bolhas (canvas, só quando visível) ---------- */
  function Bubbles(canvas) {
    var ctx = canvas.getContext('2d');
    var count = parseInt(canvas.dataset.bubbles, 10) || 16;
    if (window.innerWidth < 768) count = Math.round(count * 0.6);
    var light = canvas.hasAttribute('data-bubbles-light');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, list = [], running = false, raf = 0, last = 0;
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 20,
        r: 2 + Math.random() * 6,
        s: 18 + Math.random() * 40,
        ph: Math.random() * 6.28,
        w: 6 + Math.random() * 14
      };
    }
    function frame(t) {
      var dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < list.length; i++) {
        var b = list[i];
        b.y -= b.s * dt;
        b.ph += dt * 1.6;
        if (b.y < -20) list[i] = b = spawn(false);
        var x = b.x + Math.sin(b.ph) * b.w;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, 6.283);
        ctx.fillStyle = light ? 'rgba(255,255,255,.35)' : 'rgba(191,239,255,.12)';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = light ? 'rgba(255,255,255,.85)' : 'rgba(191,239,255,.5)';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.28, 0, 6.283);
        ctx.fillStyle = 'rgba(255,255,255,.8)';
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    resize();
    for (var i = 0; i < count; i++) list.push(spawn(true));
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!vis && running) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  }

  /* ---------- Pausa loops CSS fora da tela ---------- */
  function pauseOffscreen() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
    }, { rootMargin: '100px 0px' });
    $$('main > section, .ftr').forEach(function (s) { io.observe(s); });
  }

  /* ---------- Ondinhas do cursor (desktop) ---------- */
  function cursorRipples() {
    var c = document.createElement('canvas');
    c.className = 'cursor-fx';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rings = [], raf = 0, lx = -999, ly = -999, lt = 0;
    function resize() { c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    resize();
    window.addEventListener('resize', resize);
    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      rings = rings.filter(function (r) { return r.a > 0.01; });
      rings.forEach(function (r) {
        r.r += 1.6; r.a *= 0.93;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, 6.283);
        ctx.strokeStyle = 'rgba(46,190,239,' + r.a + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      raf = rings.length ? requestAnimationFrame(loop) : 0;
    }
    window.addEventListener('pointermove', function (e) {
      var now = performance.now();
      var d = Math.hypot(e.clientX - lx, e.clientY - ly);
      if (d < 46 || now - lt < 70) return;
      lx = e.clientX; ly = e.clientY; lt = now;
      rings.push({ x: lx, y: ly, r: 4, a: 0.55 });
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ==========================================================================
     GSAP
     - ScrollTrigger só para o que acompanha o scroll (pin e scrub).
     - Entradas únicas usam IntersectionObserver: nenhum custo de refresh.
     ========================================================================== */
  function onEnter(targets, fn, margin) {
    var els = typeof targets === 'string' ? $$(targets) : [].concat(targets);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        fn(en.target);
      });
    }, { rootMargin: margin || '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function setupMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);
    // Imagens têm width/height: não precisa recalcular no load (é o refresh mais caro)
    ST.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });

    // Lenis: scroll suave só com mouse/trackpad (no toque, o nativo é melhor)
    if (window.Lenis && finePointer) {
      lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    var mm = gsap.matchMedia();
    var isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    var steps = [];

    /* ----- HERO: a entrada é CSS; aqui só o parallax ----- */
    steps.push(function hero() {
      var pars = $$('.hero [data-par]');
      var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      pars.forEach(function (el) { tl.to(el, { y: parseFloat(el.dataset.par) * 160 }, 0); });
      tl.to('.hero__copy', { y: -60, opacity: 0.2 }, 0.3);

      var layers = pars.map(function (el) {
        return { d: parseFloat(el.dataset.par), x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }) };
      });
      var move = function (nx) { layers.forEach(function (l) { l.x(nx * l.d * -40); }); };
      if (finePointer) {
        $('.hero').addEventListener('pointermove', function (e) { move(e.clientX / innerWidth - 0.5); });
      } else {
        window.addEventListener('deviceorientation', function (e) {
          if (e.gamma == null) return;
          move(gsap.utils.clamp(-0.5, 0.5, e.gamma / 50));
        }, { passive: true });
      }
    });

    /* ----- PISCINA DE ONDAS: palco fixado, a água invade a tela ----- */
    steps.push(function piscina() {
      var stage = $('[data-po-stage]');
      var waves = $$('[data-po-wave]', stage);
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: function () { return '+=' + Math.round(innerHeight * (isDesktop ? 1.5 : 1.15)); },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      tl.fromTo('[data-po-photo]', { scale: 0.56, rotate: -4, yPercent: -6 }, { scale: 1, rotate: 0, yPercent: 0, duration: 1 }, 0)
        .fromTo(waves[0], { yPercent: 118 }, { yPercent: 0, duration: 0.9, ease: 'power1.out' }, 0.2)
        .fromTo(waves[1], { yPercent: 125 }, { yPercent: 0, duration: 0.9, ease: 'power1.out' }, 0.35)
        .fromTo(waves[2], { yPercent: 130 }, { yPercent: 0, duration: 0.9, ease: 'power1.out' }, 0.5)
        .fromTo('[data-po-pill]', { scale: 0, rotate: -25, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, 1.15)
        .fromTo('[data-po-title] span', { clipPath: 'inset(-30% 100% -30% 0%)' }, { clipPath: 'inset(-30% 0% -30% 0%)', duration: 0.8, ease: 'power1.inOut' }, 1.25)
        .fromTo('[data-po-title]', { scale: 0.86 }, { scale: 1, duration: 0.8, ease: 'power2.out' }, 1.25)
        .to({}, { duration: 0.3 });

      // Benefícios entram surfando
      $$('[data-surf]').forEach(function (el, i) {
        var dir = i % 2 ? -1 : 1;
        gsap.set(el, { opacity: 0, xPercent: 70 * dir, rotate: 8 * dir, y: 40 });
        onEnter(el, function () {
          gsap.to(el, { opacity: 1, xPercent: 0, rotate: 0, y: 0, duration: 1.1, ease: 'power3.out', delay: isDesktop ? i * 0.12 : 0, clearProps: 'transform' });
        }, '0px 0px -6% 0px');
      });
      var rib = $('[data-ribbon] p');
      gsap.set(rib, { opacity: 0, scale: 0.5, rotate: -14 });
      onEnter(rib, function () { gsap.to(rib, { opacity: 1, scale: 1, rotate: -2, duration: 1.2, ease: 'elastic.out(1, .6)' }); });
    });

    /* ----- O PARQUE ----- */
    steps.push(function parque() {
      var title = $('.parque__title');
      // A divisão em linhas espera as fontes, senão as quebras ficam erradas
      if (window.SplitText && document.fonts) document.fonts.ready.then(function () {
        var split = window.SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'line' });
        gsap.set(split.lines, { yPercent: 105 });
        onEnter(title, function () {
          gsap.to(split.lines, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12, onComplete: function () { split.revert(); } });
        });
      });
      var brush = $('[data-brush]');
      var path = $('.brush__line path', brush);
      var len = path.getTotalLength();
      var bspan = $('span', brush);
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(bspan, { clipPath: 'inset(-20% 100% -20% 0)' });
      onEnter(brush, function () {
        gsap.timeline()
          .to(bspan, { clipPath: 'inset(-20% 0% -20% 0)', duration: 1.3, ease: 'power2.inOut' })
          .to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
      });

      var blob = $('.parque__photo .blob');
      gsap.set(blob, { scale: 0.8, rotate: -6, opacity: 0 });
      onEnter(blob, function () { gsap.to(blob, { scale: 1, rotate: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.4)' }); });

      // Um único trigger com scrub para o mascote espiando e as camadas de profundidade
      var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.parque', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      tl.fromTo('[data-parque-mascot]', { xPercent: -70, rotate: -6 }, { xPercent: 0, rotate: 12, duration: 0.45 }, 0.15);
      $$('.parque [data-depth]').forEach(function (el) { tl.to(el, { y: parseFloat(el.dataset.depth) * 220, duration: 1 }, 0); });

      var pillars = $$('[data-pillar]');
      gsap.set(pillars, { opacity: 0, y: 60, scale: 0.85 });
      onEnter('.pillars', function (list) {
        gsap.to(pillars, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.1 });
        gsap.from($$('.boia', list), { rotate: -200, duration: 1.4, ease: 'power3.out', stagger: 0.1 });
      }, '0px 0px -5% 0px');
    });

    /* ----- ATRAÇÕES ----- */
    steps.push(function atracoes() {
      var section = $('[data-atr]');
      var pinEl = $('[data-atr-pin]');
      var track = $('[data-atr-track]');
      var boia = $('[data-atr-boia]');
      var bar = $('[data-atr-bar]');
      var setProgress = function (p) {
        gsap.set(boia, { rotate: p * 540 });
        gsap.set(bar, { scaleX: 0.12 + p * 0.88 });
      };

      mm.add('(min-width: 1024px)', function () {
        section.classList.add('is-horizontal');
        var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
        var tween = gsap.to(track, {
          x: function () { return -dist(); },
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: function () { return '+=' + dist(); },
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: function (self) { setProgress(self.progress); }
          }
        });
        $$('.card', track).forEach(function (card) {
          gsap.from($('.card__img img', card), {
            scale: 1.25, ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
          });
        });
        return function () { section.classList.remove('is-horizontal'); };
      });

      mm.add('(max-width: 1023px)', function () {
        var onScroll = function () {
          var max = track.scrollWidth - track.clientWidth;
          setProgress(max > 0 ? track.scrollLeft / max : 0);
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        var cards = $$('.card', track);
        gsap.set(cards, { opacity: 0, x: 80, rotate: 3 });
        onEnter(track, function () { gsap.to(cards, { opacity: 1, x: 0, rotate: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }); });
        return function () { track.removeEventListener('scroll', onScroll); gsap.set(cards, { clearProps: 'all' }); };
      });
    });

    /* ----- ACESSO VIP: cartão de sócio ----- */
    steps.push(function vip() {
      var card = $('[data-vcard]');
      var shine = $('.vcard__shine', card);
      var perks = $$('.vcard__perks li', card);
      var ready = false;
      gsap.set(card, { rotateX: 32, rotateY: -26, y: 120, scale: 0.88, opacity: 0, transformPerspective: 1400 });
      gsap.set(perks, { opacity: 0, y: 30 });
      onEnter(card, function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out', onComplete: function () { ready = true; } });
        gsap.to(perks, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.8)', delay: 0.6 });
      }, '0px 0px -5% 0px');
      var rx = gsap.quickTo(card, 'rotateX', { duration: 0.8, ease: 'power3.out' });
      var ry = gsap.quickTo(card, 'rotateY', { duration: 0.8, ease: 'power3.out' });
      var sx = gsap.quickTo(shine, 'x', { duration: 0.8, ease: 'power3.out' });
      var tilt = function (nx, ny) {
        if (!ready) return;
        rx(ny * -7); ry(nx * 9); sx(nx * 160);
      };
      if (finePointer) {
        var stage = $('[data-vip-stage]');
        stage.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          tilt((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
        });
        stage.addEventListener('pointerleave', function () { tilt(0, 0); });
      } else {
        window.addEventListener('deviceorientation', function (e) {
          if (e.gamma == null || e.beta == null) return;
          tilt(gsap.utils.clamp(-0.5, 0.5, e.gamma / 60), gsap.utils.clamp(-0.5, 0.5, (e.beta - 45) / 60));
        }, { passive: true });
      }

      // Como funciona: o caminho dourado liga os passos (scrub)
      gsap.fromTo('[data-steps-line]', { scaleX: isDesktop ? 0 : 1, scaleY: isDesktop ? 1 : 0 }, {
        scaleX: 1, scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.steps__track', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 }
      });
      $$('[data-step]').forEach(function (st) {
        var num = $('.step__num', st), txt = $('p', st);
        gsap.set(num, { scale: 0, rotate: -180 });
        gsap.set(txt, { opacity: 0, x: isDesktop ? 0 : 30, y: isDesktop ? 20 : 0 });
        onEnter(st, function () {
          gsap.timeline()
            .to(num, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)' })
            .to(txt, { opacity: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
        }, '0px 0px -15% 0px');
      });
    });

    /* ----- LOCALIZAÇÃO: mascote espia por cima do mapa ----- */
    steps.push(function loc() {
    var locM = $('[data-loc-mascot]');
    gsap.set(locM, { yPercent: 60, rotate: -4 });
    onEnter('.loc__map', function () { gsap.to(locM, { yPercent: 0, rotate: 8, duration: 1.1, ease: 'back.out(1.8)' }); }, '0px 0px -20% 0px');
    });

    /* ----- CTA FINAL: o mascote salta da água ----- */
    steps.push(function cta() {
      var m = $('[data-cta-mascot]');
      var drops = $$('[data-splash] i');
      gsap.set(m, { yPercent: 70, rotate: -14, opacity: 0 });
      onEnter(m, function () {
        var tl = gsap.timeline();
        tl.to(m, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.6)' });
        drops.forEach(function (d, i) {
          var rad = (-160 + (140 / (drops.length - 1)) * i) * Math.PI / 180;
          var dist = gsap.utils.random(90, 170);
          tl.fromTo(d, { x: 0, y: 0, scale: gsap.utils.random(0.6, 1.4), opacity: 1 },
            { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0, duration: 1.1, ease: 'power2.out' }, 0.15);
        });
      }, '0px');
      gsap.to('.cta__sun', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    });

    /* ----- Revelações genéricas (vizinhos que entram juntos ganham stagger) ----- */
    steps.push(function reveals() {
    var queue = [], flushing = false;
    onEnter('[data-reveal]', function (el) {
      queue.push(el);
      if (flushing) return;
      flushing = true;
      requestAnimationFrame(function () {
        gsap.fromTo(queue, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 });
        queue = []; flushing = false;
      });
    }, '0px 0px -8% 0px');
    });

    // Uma seção por fatia ociosa, em ordem: nenhuma tarefa longa e os pins somam na ordem certa
    (function runNext() {
      var fn = steps.shift();
      if (!fn) return;
      try { fn(); } catch (err) { if (window.console) console.error(err); }
      if (steps.length) idle(runNext);
    })();

    // Recalcula se as fontes chegarem depois da montagem
    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(function () { ST.refresh(); });
  }

  /* ---------- Início ---------- */
  setupLinks();
  setupAnchors();
  setupHeader();
  setupActiveNav();
  setupMenu();
  setupFloat();
  setupRipple();

  if (!hasGSAP || reduce) return;

  // As animações de scroll são montadas logo após o primeiro paint, fora do caminho crítico
  idle(function () {
    try {
      setupMotion();
    } catch (err) {
      // Qualquer falha nas animações: o conteúdo volta ao estado final
      root.classList.remove('js');
      if (window.console) console.error(err);
    }
    pauseOffscreen();
    $$('canvas[data-bubbles]').forEach(function (c) { new Bubbles(c); });
    setTimeout(makeCaustics, 600);
    if (finePointer) cursorRipples();
  });
})();
