/* ==========================================================================
   SynthArt Synergy 2.0 — site behaviour
   --------------------------------------------------------------------------
   ▶ TO CONNECT YOUR GOOGLE FORM
     Create the form, click "Send" → the link icon → copy the link, then paste
     it into CONFIG.formUrl below. Nothing else needs to change.
     Set CONFIG.embedForm to true if you would rather show the form inside the
     page (the iframe is created automatically from the same URL).
   ========================================================================== */

const CONFIG = {
  /* Live SynthArt Synergy 2.0 committee application form */
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeXDl7JTlyifhb_qUkqalZRvsX4BrKHYCaIFA72lyd9ogQ0PA/viewform',

  /* true  → render the form inside the page (registration section)
     false → the buttons open the form in a new tab                      */
  embedForm: false,

  /* Event details shown throughout the page */
  edition: '2.0',
  deadlineISO: '2026-10-29T23:59:59+05:30', // end of 29 October, Sri Lanka time
  venue: 'SLIIT Kandy UNI, Pallekele',
  deadline: '29 October 2026'
};

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.prototype.slice.call(root.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const FORM_URL = String(CONFIG.formUrl || '').trim();
  const HAS_FORM = /^https?:\/\//i.test(FORM_URL);

  /* ------------------------------------------------------------------ *
   * 1. Text that comes from CONFIG
   * ------------------------------------------------------------------ */
  function setText(selector, value) {
    $$(selector).forEach((el) => {
      el.textContent = value;
    });
  }

  setText('[data-venue]', CONFIG.venue);
  setText('[data-deadline]', CONFIG.deadline);

  const yearEl = $('[data-year]');
  if (yearEl) {
    const now = new Date().getFullYear();
    yearEl.textContent = String(now);
  }

  /* ------------------------------------------------------------------ *
   * 2. Toast
   * ------------------------------------------------------------------ */
  const toastEl = $('[data-toast]');
  let toastTimer = 0;

  function toast(message, duration) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(
      () => toastEl.classList.remove('is-visible'),
      duration || 4600
    );
  }

  /* ------------------------------------------------------------------ *
   * 3. Google Form wiring
   * ------------------------------------------------------------------ */
  const formLinks = $$('[data-form-link]');
  const statusText = $('[data-form-status]');
  const statusPill = statusText ? statusText.closest('.status-pill') : null;

  if (HAS_FORM) {
    formLinks.forEach((link) => link.setAttribute('href', FORM_URL));
    if (statusText) statusText.textContent = 'Open';
  } else {
    formLinks.forEach((link) => {
      link.setAttribute('href', '#');
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        toast('The form is not connected yet — add your Google Form link to CONFIG.formUrl in main.js.');
      });
    });
    if (statusText) statusText.textContent = 'Not connected';
    if (statusPill) statusPill.classList.add('is-pending');
  }

  // Copy-to-clipboard
  $$('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!HAS_FORM) {
        toast('Nothing to copy yet — paste your Google Form URL into CONFIG.formUrl in main.js.');
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(FORM_URL).then(
          () => toast('Registration link copied to your clipboard.'),
          () => legacyCopy(FORM_URL)
        );
      } else {
        legacyCopy(FORM_URL);
      }
    });
  });

  function legacyCopy(text) {
    try {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
      toast('Registration link copied to your clipboard.');
    } catch (error) {
      toast('Could not copy automatically — select the link from the button instead.');
    }
  }

  // Optional inline embed
  if (CONFIG.embedForm && HAS_FORM) {
    const holder = $('[data-form-embed]');
    if (holder) {
      let src = FORM_URL;
      if (src.indexOf('docs.google.com/forms') !== -1) {
        src = src.replace(/\/(viewform|formResponse).*$/, '/viewform?embedded=true');
      } else if (src.indexOf('embedded=true') === -1) {
        src += (src.indexOf('?') === -1 ? '?' : '&') + 'embedded=true';
      }
      const frame = document.createElement('iframe');
      frame.src = src;
      frame.title = 'SynthArt Synergy 2.0 committee registration form';
      frame.loading = 'lazy';
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      holder.appendChild(frame);
      holder.hidden = false;
    }
  }

  /* ------------------------------------------------------------------ *
   * 4. Header: sticky state, mobile menu, scroll progress
   * ------------------------------------------------------------------ */
  const header = $('[data-header]');
  const navToggle = $('.nav-toggle');
  const nav = $('#primary-nav');
  const progressBar = $('[data-progress]');

  function closeMenu() {
    if (!header || !navToggle) return;
    header.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    if (nav) {
      nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  let ticking = false;

  function onScrollFrame() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 12);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }
  }

  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  onScrollFrame();

  /* ------------------------------------------------------------------ *
   * 5. Scroll reveal
   * ------------------------------------------------------------------ */
  const revealEls = $$('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * 6. Number counters
   * ------------------------------------------------------------------ */
  const counters = $$('[data-count]');

  function animateCount(el) {
    const target = Number(el.getAttribute('data-count')) || 0;
    const duration = 1100;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
      else el.textContent = String(target);
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        el.textContent = String(Number(el.getAttribute('data-count')) || 0);
      });
    } else {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => countObserver.observe(el));
    }
  }

  /* ------------------------------------------------------------------ *
   * 7. Countdown
   * ------------------------------------------------------------------ */
  const countdown = $('[data-countdown]');

  if (countdown) {
    const target = new Date(CONFIG.deadlineISO).getTime();

    if (!isNaN(target)) {
      const fields = {
        days: $('[data-cd="days"]', countdown),
        hours: $('[data-cd="hours"]', countdown),
        minutes: $('[data-cd="minutes"]', countdown),
        seconds: $('[data-cd="seconds"]', countdown)
      };

      const pad = (value) => (value < 10 ? '0' + value : String(value));

      const paint = () => {
        const diff = target - Date.now();

        if (diff <= 0) {
          if (fields.days) fields.days.textContent = '00';
          if (fields.hours) fields.hours.textContent = '00';
          if (fields.minutes) fields.minutes.textContent = '00';
          if (fields.seconds) fields.seconds.textContent = '00';
          const label = countdown.parentElement;
          if (label && !label.dataset.done) {
            label.dataset.done = 'true';
            const lbl = $('.ticker__label');
            if (lbl) lbl.textContent = 'Registration closed';
          }
          return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor(diff / 3600000) % 24;
        const minutes = Math.floor(diff / 60000) % 60;
        const seconds = Math.floor(diff / 1000) % 60;

        if (fields.days) fields.days.textContent = pad(days);
        if (fields.hours) fields.hours.textContent = pad(hours);
        if (fields.minutes) fields.minutes.textContent = pad(minutes);
        if (fields.seconds) fields.seconds.textContent = pad(seconds);
      };

      paint();
      window.setInterval(paint, 1000);
    }
  }

  /* ------------------------------------------------------------------ *
   * 8. Active nav link
   * ------------------------------------------------------------------ */
  const navLinks = $$('#primary-nav a');

  if (navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const hash = '#' + entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === hash);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    $$('main section[id]').forEach((section) => sectionObserver.observe(section));
  }

  /* ------------------------------------------------------------------ *
   * 9. 3D tilt on cards
   * ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach((card) => {
      let frame = 0;

      const move = (event) => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;

          card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
          card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      };

      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 10. Hero parallax on the 3D scene
   * ------------------------------------------------------------------ */
  const hero = $('.hero');
  const scene = $('[data-scene]');
  const heroArt = $('[data-art]');

  if (hero && scene && finePointer && !reduceMotion) {
    let heroFrame = 0;

    hero.addEventListener('pointermove', (event) => {
      if (heroFrame) return;
      heroFrame = window.requestAnimationFrame(() => {
        heroFrame = 0;
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        // the orbit layer drifts ...
        scene.style.transform =
          'translate3d(' + (x * 18).toFixed(1) + 'px,' + (y * 14).toFixed(1) + 'px,0)';

        // ... and the painting leans toward the cursor
        if (heroArt) {
          heroArt.style.setProperty('--ry', (x * 15).toFixed(2) + 'deg');
          heroArt.style.setProperty('--rx', (-y * 11).toFixed(2) + 'deg');
        }
      });
    });

    hero.addEventListener('pointerleave', () => {
      scene.style.transform = '';
      if (heroArt) {
        heroArt.style.setProperty('--rx', '0deg');
        heroArt.style.setProperty('--ry', '0deg');
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 10b. Before -> lift -> handoff -> the original after artwork
   * ------------------------------------------------------------------ */
  (function heroHandoff() {
    const artwork = $('[data-handoff]');
    const replay = $('[data-handoff-replay]');
    if (!artwork || !replay) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const before = $('[data-handoff-before]', artwork);
    const clean = $('[data-handoff-clean]', artwork);
    const receive = $('[data-handoff-receive]', artwork);
    const brush = $('[data-handoff-brush]', artwork);
    const after = $('[data-handoff-after]', artwork);
    const catchLight = $('[data-handoff-catch]', artwork);
    const DURATION = 5200;
    let animations = [];
    let assetsReady = false;
    let inView = !('IntersectionObserver' in window);
    let preparing;

    // Coordinates are those of the supplied 1672 x 941 images, so resizing
    // never changes where the brush meets either hand.
    const pose = (x, y, angle, scale) =>
      `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale}) translate(-676px, -543px)`;

    function stop(hideReplay = true) {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      if (hideReplay) replay.hidden = true;
      replay.disabled = false;
    }

    function updatePlayback() {
      if (!assetsReady || motion.matches || artwork.dataset.handoffState === 'complete') return;
      if (!animations.length) buildSequence();
      if (inView && !document.hidden) {
        animations.forEach((animation) => {
          if (animation.playState !== 'running') animation.play();
        });
        artwork.dataset.handoffState = 'playing';
      } else {
        animations.forEach((animation) => animation.pause());
      }
    }

    function track(element, keyframes, id) {
      const animation = element.animate(keyframes, {
        duration: DURATION,
        fill: 'both',
        easing: 'linear'
      });
      animation.id = id;
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
      return animation;
    }

    function buildSequence() {
      artwork.dataset.handoffState = 'ready';
      replay.disabled = true;

      track(before, [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.20 },
        { opacity: 0, offset: 0.25 },
        { opacity: 0, offset: 1 }
      ], 'hero-before-pose');

      track(clean, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 0.19 },
        { opacity: 1, offset: 0.20 },
        { opacity: 1, offset: 0.53 },
        { opacity: 0, offset: 0.531 },
        { opacity: 0, offset: 1 }
      ], 'hero-empty-hand');

      track(receive, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 0.48 },
        { opacity: 1, offset: 0.53 },
        { opacity: 1, offset: 0.95 },
        { opacity: 0, offset: 0.951 },
        { opacity: 0, offset: 1 }
      ], 'hero-receiving-hand');

      const flight = track(brush, [
        { transform: pose(384, 509, 9.6, 1.148), opacity: 0, offset: 0 },
        { transform: pose(384, 509, 9.6, 1.148), opacity: 0, offset: 0.20 },
        { transform: pose(384, 509, 9.6, 1.148), opacity: 1, offset: 0.25,
          easing: 'cubic-bezier(.4, 0, .25, 1)' },
        { transform: pose(400, 402, 7, 1.12), opacity: 1, offset: 0.43,
          easing: 'cubic-bezier(.4, 0, .3, 1)' },
        { transform: pose(526, 414, -2, 1.07), opacity: 1, offset: 0.61,
          easing: 'cubic-bezier(.4, 0, .2, 1)' },
        { transform: pose(661, 517, -1.5, 1.015), opacity: 1, offset: 0.80,
          easing: 'cubic-bezier(.2, .7, .3, 1)' },
        { transform: pose(676, 543, 0, 1), opacity: 1, offset: 0.88 },
        { transform: pose(676, 543, 0, 1), opacity: 1, offset: 0.95 },
        { transform: pose(676, 543, 0, 1), opacity: 0, offset: 0.951 },
        { transform: pose(676, 543, 0, 1), opacity: 0, offset: 1 }
      ], 'hero-brush-flight');

      track(after, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 0.88 },
        { opacity: 1, offset: 0.95 },
        { opacity: 1, offset: 1 }
      ], 'hero-after-pose');

      track(catchLight, [
        { opacity: 0, transform: 'scale(.7)', offset: 0 },
        { opacity: 0, transform: 'scale(.7)', offset: 0.85 },
        { opacity: 0.85, transform: 'scale(1)', offset: 0.9 },
        { opacity: 0, transform: 'scale(1.5)', offset: 1 }
      ], 'hero-catch-light');

      flight.onfinish = () => {
        artwork.dataset.handoffState = 'complete';
        replay.hidden = false;
        replay.disabled = false;
      };
    }

    function prepare() {
      if (motion.matches || typeof brush.animate !== 'function') {
        stop();
        artwork.dataset.handoffState = 'static';
        return;
      }

      artwork.dataset.handoffState = 'loading';
      // SVG <image> elements have no decode() method. Decode each unique
      // URL with an Image first, leaving the original before visible.
      if (!preparing) {
        const sources = [...new Set($$('image', artwork).map((image) => image.getAttribute('href')))];
        preparing = Promise.all(sources.map((src) => new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            if (image.decode) image.decode().then(resolve, reject);
            else resolve();
          };
          image.onerror = reject;
          image.src = src;
        })));
      }

      preparing.then(() => {
        assetsReady = true;
        if (motion.matches) return;
        artwork.dataset.handoffState = 'ready';
        updatePlayback();
      }).catch(() => {
        // A missing/failed animation layer must not leave a broken hero.
        stop();
        artwork.dataset.handoffState = 'static';
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        updatePlayback();
      }, { threshold: 0.15 });
      observer.observe(artwork);
    }

    replay.addEventListener('click', () => {
      stop(false);
      artwork.dataset.handoffState = 'ready';
      updatePlayback();
    });

    document.addEventListener('visibilitychange', updatePlayback);
    motion.addEventListener('change', () => {
      stop();
      prepare();
    });
    prepare();
  })();

  /* ------------------------------------------------------------------ *
   * 11. FAQ — one open at a time
   * ------------------------------------------------------------------ */
  const faqItems = $$('.faq__item');

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ------------------------------------------------------------------ *
   * 12. Particle field behind the page
   * ------------------------------------------------------------------ */
  (function particleField() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLORS = ['236,150,66', '84,200,232', '139,123,247'];
    const LINK_DISTANCE = 132;
    const LINK_SQUARED = LINK_DISTANCE * LINK_DISTANCE;
    const POINTER_RADIUS = 190;

    const dots = [];
    const pointer = { x: -9999, y: -9999, active: false };

    let width = 0;
    let height = 0;
    let rafId = 0;
    let visible = !document.hidden;

    function seed() {
      const density = (width * height) / 17000;
      const count = Math.round(Math.min(92, Math.max(30, density)));

      dots.length = 0;
      for (let i = 0; i < count; i += 1) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          r: Math.random() * 1.5 + 0.7,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i += 1) {
        const a = dots[i];

        a.x += a.vx;
        a.y += a.vy;
        a.phase += 0.009;

        if (a.x < -30) a.x = width + 30;
        else if (a.x > width + 30) a.x = -30;
        if (a.y < -30) a.y = height + 30;
        else if (a.y > height + 30) a.y = -30;

        // links to neighbours
        for (let j = i + 1; j < dots.length; j += 1) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;

          if (dist2 > LINK_SQUARED) continue;

          const alpha = (1 - dist2 / LINK_SQUARED) * 0.20;
          ctx.strokeStyle = 'rgba(' + a.c + ',' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // link to the pointer
        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < POINTER_RADIUS) {
            const alpha = (1 - dist / POINTER_RADIUS) * 0.34;
            ctx.strokeStyle = 'rgba(' + a.c + ',' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        const glow = 0.5 + 0.5 * Math.sin(a.phase);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + a.c + ',' + (0.30 + glow * 0.38).toFixed(3) + ')';
        ctx.arc(a.x, a.y, a.r + glow * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      rafId = window.requestAnimationFrame(loop);
      draw();
    }

    function start() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(loop);
    }

    function stop() {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    resize();

    if (reduceMotion) {
      draw(); // one static frame
    } else {
      start();

      document.addEventListener('visibilitychange', () => {
        visible = !document.hidden;
        if (visible) start();
        else stop();
      });

      let resizeFrame = 0;
      window.addEventListener(
        'resize',
        () => {
          if (resizeFrame) return;
          resizeFrame = window.requestAnimationFrame(() => {
            resizeFrame = 0;
            resize();
          });
        },
        { passive: true }
      );

      if (finePointer) {
        window.addEventListener(
          'pointermove',
          (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
          },
          { passive: true }
        );
        window.addEventListener('pointerleave', () => {
          pointer.active = false;
        });
      }
    }
  })();
})();
