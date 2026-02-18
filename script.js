/* ═══════════════════════════════════════════════════════════════
   MICHAEL KIPLANGAT — PORTFOLIO SCRIPTS
   Retro-Modern Cyber Theme | Pure Vanilla JS
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── UTILITY ──────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const raf = requestAnimationFrame;

// ─── CUSTOM CURSOR ────────────────────────────────────────────────
(function initCursor() {
  const glow = $('#cursor-glow');
  const dot  = $('#cursor-dot');
  if (!glow || !dot) return;

  let mx = -999, my = -999;
  let glowX = -999, glowY = -999;
  const LERP = 0.12;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateGlow() {
    glowX += (mx - glowX) * LERP;
    glowY += (my - glowY) * LERP;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    raf(animateGlow);
  }
  raf(animateGlow);

  // Cursor hover state on interactive elements
  const hoverEls = 'a, button, .project-card, .service-card, .skill-category, input, textarea, .gaming-link, .tag';
  $$(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

// ─── NAVBAR SCROLL ────────────────────────────────────────────────
(function initNavbar() {
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// ─── HAMBURGER MOBILE MENU ────────────────────────────────────────
(function initMobileMenu() {
  const btn  = $('#hamburger');
  const menu = $('#mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

// ─── DARK / LIGHT THEME TOGGLE ────────────────────────────────────
(function initTheme() {
  const toggle = $('#theme-toggle');
  const label  = toggle?.querySelector('.toggle-label');
  const stored = localStorage.getItem('mk-theme') || 'dark';

  const applyTheme = theme => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mk-theme', theme);
    if (label) label.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
  };

  applyTheme(stored);

  toggle?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
})();

// ─── ANIMATED GRID CANVAS ─────────────────────────────────────────
(function initGridCanvas() {
  const canvas = $('#grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let mouseX = 0.5, mouseY = 0.5;
  let particles = [];
  const GRID_SPACING = 60;
  const PARTICLE_COUNT = 35;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.45 + 0.1
    }));
  }

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / W;
    mouseY = (e.clientY - rect.top)  / H;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)';

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += GRID_SPACING) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += GRID_SPACING) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Grid intersection dots with mouse proximity glow
    for (let x = 0; x <= W; x += GRID_SPACING) {
      for (let y = 0; y <= H; y += GRID_SPACING) {
        const dx = x / W - mouseX;
        const dy = y / H - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 0.22);
        const alpha = 0.04 + proximity * 0.45;
        ctx.beginPath();
        ctx.arc(x, y, proximity > 0 ? 2 + proximity * 2 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,45,58,${alpha})`;
        ctx.fill();
      }
    }

    // Floating particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,45,58,${p.alpha})`;
      ctx.fill();
    });

    // Mouse cursor ambient glow on canvas
    const grad = ctx.createRadialGradient(
      mouseX * W, mouseY * H, 0,
      mouseX * W, mouseY * H, 200
    );
    grad.addColorStop(0, isDark ? 'rgba(124,45,58,0.12)' : 'rgba(124,45,58,0.05)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    raf(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();

// ─── HERO TYPED ROLES ─────────────────────────────────────────────
(function initTypedRoles() {
  const el = $('#typed-role');
  if (!el) return;

  const roles = [
    'Junior Developer',
    'Cyber Security Aspirant',
    'Graphic Designer',
    'Hardware Enthusiast',
    'Gamer & Philosopher',
    'Lifelong Learner',
  ];

  let rIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = roles[rIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 70);
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 900);
})();

// ─── TERMINAL ANIMATION ───────────────────────────────────────────
(function initTerminal() {
  const body = $('#terminal-body');
  if (!body) return;

  // Real Michael Kiplangat data
  const lines = [
    { text: '$ whoami', cls: 't-prompt t-cmd', delay: 200 },
    { text: 'michael_kiplangat', cls: 't-out', delay: 600 },
    { text: '$ cat profile.json', cls: 't-prompt t-cmd', delay: 1100 },
    { text: '{', cls: 't-out', delay: 1500 },
    { text: '  "role": "Junior Developer",', cls: 't-string', delay: 1750 },
    { text: '  "education": "Computer Science",', cls: 't-string', delay: 2000 },
    { text: '  "graduated": "2024 — 3 months ago",', cls: 't-string', delay: 2250 },
    { text: '  "target": "Cyber Security",', cls: 't-string', delay: 2500 },
    { text: '  "skills": ["Python","JS","Java","HTML/CSS"],', cls: 't-string', delay: 2750 },
    { text: '  "hobbies": ["Gaming","Philosophy","Design"],', cls: 't-string', delay: 3000 },
    { text: '  "hardware": "Yes, I build PCs.",', cls: 't-string', delay: 3250 },
    { text: '  "seeking": "Experience & Connections",', cls: 't-warn', delay: 3500 },
    { text: '}', cls: 't-out', delay: 4000 },
    { text: '$ cat philosophy.txt', cls: 't-prompt t-cmd', delay: 4500 },
    { text: '# Question everything.', cls: 't-comment', delay: 4900 },
    { text: '# Build with intention.', cls: 't-comment', delay: 5150 },
    { text: '# The grind is the point. ▋', cls: 't-comment', delay: 5400 },
    { text: '# I seek freedom. ▋', cls: 't-comment', delay: 5650 },
  ];

  lines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 't-line ' + cls;
      span.textContent = text;
      body.appendChild(span);
      body.scrollTop = body.scrollHeight;
    }, delay);
  });
})();

// ─── COUNTER ANIMATION ────────────────────────────────────────────
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = Math.max(1, target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) { el.textContent = target; clearInterval(timer); }
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ─── XP BARS ON SCROLL ────────────────────────────────────────────
(function initXPBars() {
  const fills = $$('.xp-fill, .oxp-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const pct = el.dataset.fill || '0';
      setTimeout(() => { el.style.width = pct + '%'; }, 200);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();

// ─── SCROLL REVEAL ────────────────────────────────────────────────
(function initReveal() {
  const revealTargets = [
    '.terminal-card', '.about-text', '.skill-category', '.overall-xp',
    '.project-card', '.service-card', '.timeline-item',
    '.contact-info', '.contact-form', '.section-header',
    '.achievement-badge.center-badge', '.hero-stats', '.gaming-links', '.coffee-block'
  ];

  revealTargets.forEach(sel => {
    $$(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => observer.observe(el));
})();

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────────
(function initMagnetic() {
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();

// ─── PROJECT CARD TILT ────────────────────────────────────────────
(function initCardTilt() {
  $$('.project-card:not(.project-locked)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── CONTACT FORM (simulated — wire up Netlify or Formspree in production) ──
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn      = form.querySelector('button[type="submit"]');
    const feedback = $('#form-feedback');
    const txt      = $('#submit-text');

    // Validate
    const name    = $('#cf-name').value.trim();
    const email   = $('#cf-email').value.trim();
    const message = $('#cf-message').value.trim();

    if (!name || !email || !message) {
      feedback.className = 'form-feedback error';
      feedback.textContent = '⚠ Please fill in name, email, and message.';
      return;
    }

    btn.disabled = true;
    txt.textContent = 'TRANSMITTING...';
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    // Simulated send — in production replace with Netlify Forms or Formspree
    setTimeout(() => {
      feedback.className = 'form-feedback success';
      feedback.textContent = '✓ MESSAGE RECEIVED — I\'ll reply within 24h. Thank you!';
      txt.textContent = 'SEND MESSAGE ⟶';
      btn.disabled = false;
      form.reset();
      setTimeout(() => { feedback.textContent = ''; }, 8000);
    }, 1800);
  });
})();

// ─── DOWNLOAD CV BUTTON ───────────────────────────────────────────
(function initDownload() {
  const btn = $('#download-cv');
  if (!btn) return;
  // If href is resume.pdf and file doesn't exist yet, show a friendly note
  btn.addEventListener('click', e => {
    // Remove this handler once you have an actual resume.pdf in the folder
    const href = btn.getAttribute('href');
    if (href === 'resume.pdf') {
      e.preventDefault();
      const flash = document.createElement('div');
      flash.style.cssText = `
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
        background:var(--wine); color:#fff; font-family:'Source Code Pro',monospace;
        font-size:0.8rem; letter-spacing:0.1em; padding:14px 28px;
        z-index:9999; pointer-events:none;
        clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);
        animation:flash-fade 2.5s forwards;
      `;
      flash.textContent = '[ ADD resume.pdf TO FOLDER TO ENABLE DOWNLOAD ]';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 2600);

      if (!document.querySelector('#ff-kf')) {
        const s = document.createElement('style');
        s.id = 'ff-kf';
        s.textContent = `@keyframes flash-fade{0%{opacity:0;transform:translate(-50%,-60%)}10%{opacity:1;transform:translate(-50%,-50%)}80%{opacity:1}100%{opacity:0}}`;
        document.head.appendChild(s);
      }
    }
    // If you add a real resume.pdf, the download attribute on the link handles it automatically
  });
})();

// ─── KONAMI CODE EASTER EGG ───────────────────────────────────────
(function initEasterEgg() {
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let progress = 0;
  const overlay  = $('#easter-egg');
  const closeBtn = $('#ee-close');
  if (!overlay || !closeBtn) return;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[progress]) {
      progress++;
      if (progress === KONAMI.length) {
        progress = 0;
        overlay.classList.remove('hidden');
        overlay.classList.add('visible');
      }
    } else {
      progress = 0;
    }
  });

  const close = () => {
    overlay.classList.remove('visible');
    overlay.classList.add('hidden');
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
})();

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────────────
(function initSmoothScroll() {
  const NAV_H = 64;
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── LEVEL BADGE HOVER GLOW ───────────────────────────────────────
(function initLevelBadge() {
  const badge = $('#level-badge');
  if (!badge) return;
  badge.style.transition = 'box-shadow 0.3s, transform 0.3s';
  badge.addEventListener('mouseenter', () => {
    badge.style.boxShadow = '0 0 40px rgba(124,45,58,0.7)';
    badge.style.transform = 'scale(1.04)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.boxShadow = '';
    badge.style.transform = '';
  });
})();

// ─── NAV ACTIVE LINK HIGHLIGHT ────────────────────────────────────
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id
            ? 'var(--wine-light)' : '';
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-64px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ─── COFFEE BUTTON PULSE ──────────────────────────────────────────
(function initCoffeePulse() {
  const coffeeNavBtn = $('.btn-coffee-nav');
  if (!coffeeNavBtn) return;

  // Gentle pulse after 10 seconds on page
  setTimeout(() => {
    coffeeNavBtn.style.transition = 'box-shadow 0.5s';
    let pulseCount = 0;
    const interval = setInterval(() => {
      coffeeNavBtn.style.boxShadow = pulseCount % 2 === 0
        ? '0 0 18px rgba(196,123,43,0.6)'
        : '';
      pulseCount++;
      if (pulseCount >= 6) clearInterval(interval);
    }, 600);
  }, 10000);
})();

// ─── TOUCH: DISABLE CUSTOM CURSOR ─────────────────────────────────
(function touchCheck() {
  window.addEventListener('touchstart', () => {
    const glow = $('#cursor-glow');
    const dot  = $('#cursor-dot');
    if (glow) glow.style.display = 'none';
    if (dot)  dot.style.display  = 'none';
    document.body.style.cursor = 'auto';
  }, { once: true });
})();

// ─── CONSOLE MESSAGE ──────────────────────────────────────────────
console.log('%c[ MK ] PORTFOLIO v1.0', 'color:#a83848; font-size:18px; font-family:monospace; font-weight:bold;');
console.log('%cHey, inspector! 👋  Michael Kiplangat here.', 'color:#aaa; font-family:monospace;');
console.log('%cI\'m a junior dev looking for experience & connections.', 'color:#888; font-family:monospace;');
console.log('%cTry the Konami code on the page: ↑ ↑ ↓ ↓ ← → ← → B A', 'color:#c47b2b; font-family:monospace;');
console.log('%c☕ If you like what you see, buy me a coffee!', 'color:#c47b2b; font-family:monospace;');
