/* ══════════════════════════════════════════════════
   1. FLOATING PARTICLES (Hearts & Stars) — dual layer
══════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let small = [];   // Small symbols
  let large = [];   // Large glowing orbs

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── SMALL SYMBOL PARTICLES ── */
  const SYMBOLS = ['♥', '✦', '·', '✧', '♡', '★', '✿'];
  const COLORS  = [
    'rgba(244,63,94,',
    'rgba(251,113,133,',
    'rgba(212,175,110,',
    'rgba(253,162,188,',
    'rgba(255,255,255,',
    'rgba(232,208,158,',
  ];

  class SmallParticle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 30;
      this.size  = Math.random() * 16 + 5;
      this.speed = Math.random() * 0.55 + 0.2;
      this.drift = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.6 + 0.15;
      this.fade  = Math.random() * 0.004 + 0.0008;
      this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rot    = Math.random() * Math.PI * 2;
      this.rotSpd = (Math.random() - 0.5) * 0.015;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleV= Math.random() * 0.04 + 0.01;
    }
    update() {
      this.y      -= this.speed;
      this.wobble += this.wobbleV;
      this.x      += this.drift + Math.sin(this.wobble) * 0.4;
      this.rot    += this.rotSpd;
      this.alpha  -= this.fade;
      if (this.y < -30 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle   = this.color + this.alpha + ')';
      ctx.font        = `${this.size}px 'Cormorant Garamond', serif`;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  /* ── LARGE GLOWING ORB PARTICLES ── */
  const ORB_COLORS = [
    [244, 63,  94],   // rose
    [251, 113, 133],  // rose-light
    [212, 175, 110],  // gold
    [159, 18,  57],   // burgundy
    [253, 162, 188],  // blush
  ];

  class LargeOrb {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 60;
      this.r     = Math.random() * 40 + 18;
      this.speed = Math.random() * 0.25 + 0.08;
      this.drift = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.18 + 0.06;
      this.fade  = Math.random() * 0.0006 + 0.0002;
      this.col   = ORB_COLORS[Math.floor(Math.random() * ORB_COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseV= Math.random() * 0.03 + 0.01;
    }
    update() {
      this.y     -= this.speed;
      this.x     += this.drift;
      this.pulse += this.pulseV;
      this.alpha -= this.fade;
      if (this.y < -80 || this.alpha <= 0) this.reset();
    }
    draw() {
      const [r,g,b] = this.col;
      const a = Math.max(0, this.alpha) * (0.9 + Math.sin(this.pulse) * 0.1);
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.4})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnAll() {
    const smallCount = Math.floor((W * H) / 18000);
    const largeCount = Math.floor((W * H) / 40000);
    for (let i = 0; i < smallCount; i++) small.push(new SmallParticle());
    for (let i = 0; i < largeCount; i++) large.push(new LargeOrb());
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    // Draw large orbs first (behind)
    large.forEach(p => { p.update(); p.draw(); });
    // Then small symbols on top
    small.forEach(p => { p.update(); p.draw(); });

    // Refill
    const targetSmall = Math.floor((W * H) / 18000);
    const targetLarge = Math.floor((W * H) / 40000);
    if (small.length < targetSmall) small.push(new SmallParticle());
    if (large.length < targetLarge) large.push(new LargeOrb());

    requestAnimationFrame(frame);
  }

  resize();
  spawnAll();
  frame();
  window.addEventListener('resize', () => {
    resize();
    small = []; large = [];
    spawnAll();
  });
})();




/* ══════════════════════════════════════════════════
   2. SCROLL REVEAL (directional)
══════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════════════
   3. CURSOR GLOW + HEART TRAIL (desktop)
══════════════════════════════════════════════════ */
(function initCursorFX() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  // ── Large ambient glow ──
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,63,94,0.07) 0%, transparent 70%);
    pointer-events: none; transform: translate(-50%,-50%); z-index: 0;
    transition: opacity 0.4s ease; opacity: 0;
  `;
  document.body.appendChild(glow);

  let cx = -999, cy = -999, tx = -999, ty = -999;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  // ── Heart trail ──
  const trailHearts = [];
  const MAX_TRAIL = 8;
  let lastTrail = 0;

  function spawnTrailHeart(x, y) {
    const h = document.createElement('div');
    const size = Math.random() * 10 + 8;
    h.textContent = Math.random() > 0.5 ? '♥' : '✦';
    h.style.cssText = `
      position: fixed; left:${x}px; top:${y}px;
      font-size: ${size}px;
      color: rgba(244,63,94,${0.4 + Math.random() * 0.4});
      pointer-events: none; z-index: 9999;
      transform: translate(-50%,-50%);
      transition: opacity 0.8s ease, transform 0.8s ease;
      opacity: 1;
    `;
    document.body.appendChild(h);
    trailHearts.push(h);
    if (trailHearts.length > MAX_TRAIL) {
      const old = trailHearts.shift();
      old.remove();
    }
    requestAnimationFrame(() => {
      h.style.opacity = '0';
      h.style.transform = `translate(-50%, calc(-50% - ${20 + Math.random()*30}px)) scale(0.3)`;
    });
    setTimeout(() => h.remove(), 900);
  }

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTrail > 80) {
      lastTrail = now;
      spawnTrailHeart(e.clientX, e.clientY);
    }
  });

  function animateGlow() {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();


/* ══════════════════════════════════════════════════
   4. 3D CARD TILT (desktop)
══════════════════════════════════════════════════ */
(function initCardTilt() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  const MAX_TILT = 10; // degrees

  document.querySelectorAll('.tilt-card').forEach(card => {
    const glowEl = card.querySelector('.card-glow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0→1
      const y = (e.clientY - rect.top)  / rect.height;  // 0→1

      const rotX = (y - 0.5) * -MAX_TILT * 2;
      const rotY = (x - 0.5) *  MAX_TILT * 2;

      card.style.transition = 'transform 0.1s linear, box-shadow 0.1s ease';
      card.style.transform  = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      card.style.boxShadow  = `
        ${-rotY * 1.5}px ${rotX * 1.5}px 50px rgba(0,0,0,0.7),
        0 0 40px rgba(244,63,94,${0.1 + Math.abs(rotY) / MAX_TILT * 0.3})
      `;

      if (glowEl) {
        glowEl.style.setProperty('--mouse-x', `${x * 100}%`);
        glowEl.style.setProperty('--mouse-y', `${y * 100}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease';
      card.style.transform  = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.boxShadow  = '';
    });
  });
})();


/* ══════════════════════════════════════════════════
   5. TOUCH RIPPLE (mobile)
══════════════════════════════════════════════════ */
(function initTouchRipple() {
  const isTouchDevice = ('ontouchstart' in window);
  if (!isTouchDevice) return;

  document.querySelectorAll('.moment-card').forEach(card => {
    card.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      const rect  = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.5;

      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${x - size / 2}px; top: ${y - size / 2}px;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    }, { passive: true });
  });
})();


/* ══════════════════════════════════════════════════
   6. SCROLL PARALLAX ON CARD IMAGES
══════════════════════════════════════════════════ */
(function initScrollParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.card-image-wrap');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    cards.forEach(wrap => {
      const rect   = wrap.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const vh     = window.innerHeight;
      // Only animate when in viewport
      if (rect.bottom < 0 || rect.top > vh) return;
      const offset = (center - vh / 2) / vh;   // -0.5 → 0.5
      const shift  = offset * 28;               // ±14px shift
      const img = wrap.querySelector('img');
      if (img) img.style.transform = `scale(1.07) translateY(${shift}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });

  // Override card hover transform to keep parallax
  document.querySelectorAll('.moment-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.card-image-wrap img');
      if (img) img.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease';
    });
    card.addEventListener('mouseleave', () => {
      // Let parallax handle the transform again
      updateParallax();
    });
  });
})();


/* ══════════════════════════════════════════════════
   7. HERO PARALLAX
══════════════════════════════════════════════════ */
(function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero    = document.getElementById('hero');
  const content = hero.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > window.innerHeight) return;
    const factor = scroll / window.innerHeight;
    content.style.transform = `translateY(${scroll * 0.28}px)`;
    content.style.opacity   = 1 - factor * 1.5;
  }, { passive: true });
})();


/* ══════════════════════════════════════════════════
   8. TOUCH SWIPE — BURST HEARTS on mobile
══════════════════════════════════════════════════ */
(function initTouchHearts() {
  if (!('ontouchstart' in window)) return;

  let lastBurst = 0;

  document.addEventListener('touchmove', e => {
    const now = Date.now();
    if (now - lastBurst < 120) return;
    lastBurst = now;

    const touch = e.touches[0];
    const h = document.createElement('div');
    const sym = Math.random() > 0.5 ? '♥' : '✦';
    const size = Math.random() * 14 + 10;

    h.textContent = sym;
    h.style.cssText = `
      position: fixed;
      left: ${touch.clientX}px;
      top:  ${touch.clientY}px;
      font-size: ${size}px;
      color: rgba(244,63,94,0.8);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%,-50%);
      transition: opacity 0.8s ease, transform 0.8s ease;
    `;
    document.body.appendChild(h);
    requestAnimationFrame(() => {
      h.style.opacity = '0';
      h.style.transform = `translate(calc(-50% + ${(Math.random()-0.5)*60}px), calc(-50% - ${40+Math.random()*40}px)) scale(0.2)`;
    });
    setTimeout(() => h.remove(), 900);
  }, { passive: true });
})();


/* ══════════════════════════════════════════════════
   9. CARD CLICK SPARKLE
══════════════════════════════════════════════════ */
(function initSparkle() {
  // Inject keyframe once
  const s = document.createElement('style');
  s.textContent = `@keyframes sparkle-out { 0%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(calc(-50% + var(--sx)),calc(-50% + var(--sy))) scale(0.2)} }`;
  document.head.appendChild(s);

  document.querySelectorAll('.moment-card').forEach(card => {
    card.addEventListener('click', e => {
      for (let i = 0; i < 12; i++) burst(e.clientX, e.clientY);
    });
  });

  function burst(cx, cy) {
    const el    = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 80 + 30;
    const size  = Math.random() * 14 + 8;
    const dur   = Math.random() * 500 + 400;

    el.textContent = ['♥','✦','·','♡','✧'][Math.floor(Math.random()*5)];
    el.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      font-size:${size}px;
      color:${Math.random() > 0.5 ? '#f43f5e' : '#d4af6e'};
      pointer-events:none; z-index:99999; user-select:none;
      --sx:${Math.cos(angle)*dist}px; --sy:${Math.sin(angle)*dist}px;
      animation: sparkle-out ${dur}ms cubic-bezier(0.22,1,0.36,1) forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur + 50);
  }
})();


/* ══════════════════════════════════════════════════
   10. TIMELINE PROGRESS LINE
══════════════════════════════════════════════════ */
(function initTimelineFill() {
  const line  = document.querySelector('.timeline-line');
  if (!line) return;
  const track = document.querySelector('.timeline-track');

  function update() {
    const rect = track.getBoundingClientRect();
    const vh   = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
    line.style.background = `linear-gradient(to bottom,
      transparent 0%,
      var(--rose-600) ${progress * 8}%,
      var(--rose-500) ${progress * 100}%,
      transparent ${progress * 100}%)`;
    line.style.opacity = 0.4 + progress * 0.4;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ══════════════════════════════════════════════════
   11. SMOOTH ANCHOR SCROLL
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


/* ══════════════════════════════════════════════════
   12. FOOTER EASTER EGG — Flying hearts on click
══════════════════════════════════════════════════ */
(function initFooterEgg() {
  const footer = document.querySelector('#footer');
  if (!footer) return;
  let shown = false;
  footer.style.cursor = 'pointer';
  footer.title = 'Haz clic 🤍';

  footer.addEventListener('click', () => {
    if (shown) { launchHearts(); return; }
    shown = true;
    const div = document.createElement('div');
    div.style.cssText = `margin-top:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;color:#fda4af;animation:fadeUpFooter 1s ease both;`;
    div.innerHTML = `<span style="color:#d4af6e">✦</span> Cada día contigo es mi día favorito. <span style="color:#d4af6e">✦</span>`;
    const ks = document.createElement('style');
    ks.textContent = `@keyframes fadeUpFooter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`;
    document.head.appendChild(ks);
    footer.appendChild(div);
    launchHearts();
  });

  function launchHearts() {
    if (!document.getElementById('fly-heart-kf')) {
      const s = document.createElement('style');
      s.id = 'fly-heart-kf';
      s.textContent = `@keyframes flyHeart{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-280px) scale(0.4);opacity:0}}`;
      document.head.appendChild(s);
    }
    for (let i = 0; i < 14; i++) setTimeout(() => {
      const h = document.createElement('div');
      h.textContent = Math.random() > 0.5 ? '♥' : '✦';
      h.style.cssText = `position:fixed;bottom:2rem;left:${20+Math.random()*60}%;font-size:${14+Math.random()*18}px;color:rgba(244,63,94,${0.5+Math.random()*0.5});pointer-events:none;z-index:9999;animation:flyHeart ${1.5+Math.random()*0.8}s ease-out forwards;`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2500);
    }, i * 70);
  }
})();


/* ══════════════════════════════════════════════════
   13. CONFETTI ENGINE — auto-fires on closing section
══════════════════════════════════════════════════ */
(function initConfetti() {
  const canvas  = document.getElementById('confetti-canvas');
  const section = document.getElementById('closing');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let W, H, pieces = [], animId = null, fired = false;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  // Shapes: heart, star, circle, petal
  const SHAPES  = ['heart', 'star', 'circle', 'petal'];
  const PALETTE = [
    '#f43f5e', '#fb7185', '#fda4af', '#d4af6e',
    '#e8d09e', '#fde8ec', '#fff0f3', '#f9c3cc',
    '#be123c', '#fecdd3', '#ffffff',
  ];

  class Piece {
    constructor(burst) {
      this.reset(burst);
    }
    reset(burst = false) {
      this.x     = Math.random() * W;
      this.y     = burst ? (Math.random() * H * 0.3 - H * 0.1) : -20;
      this.size  = Math.random() * 14 + 6;
      this.rot   = Math.random() * Math.PI * 2;
      this.rotV  = (Math.random() - 0.5) * 0.12;
      this.vx    = (Math.random() - 0.5) * 3.5;
      this.vy    = Math.random() * 2.5 + 1.2;
      this.alpha = 0.85 + Math.random() * 0.15;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleV = Math.random() * 0.08 + 0.03;
    }
    update() {
      this.y       += this.vy;
      this.x       += this.vx;
      this.rot     += this.rotV;
      this.wobble  += this.wobbleV;
      this.vx      += Math.sin(this.wobble) * 0.07;
      this.alpha   -= 0.0018;
      if (this.y > H + 30 || this.alpha <= 0) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle   = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);

      const s = this.size;
      if (this.shape === 'heart') {
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.3);
        ctx.bezierCurveTo( s * 0.5, -s * 0.9,  s,  s * 0.1,  0,  s * 0.7);
        ctx.bezierCurveTo(-s,  s * 0.1, -s * 0.5, -s * 0.9,  0, -s * 0.3);
        ctx.fill();
      } else if (this.shape === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? s * 0.9 : s * 0.38;
          ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else { // petal
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.28, s * 0.72, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function burst() {
    resize();
    pieces = [];
    // Initial dense burst
    for (let i = 0; i < 200; i++) pieces.push(new Piece(true));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    pieces.forEach(p => { p.update(); p.draw(); });
    // Keep refilling for a sustained shower
    if (pieces.filter(p => p.alpha > 0).length < 120) {
      for (let i = 0; i < 5; i++) pieces.push(new Piece(false));
    }
    animId = requestAnimationFrame(frame);
    // Auto-stop after 12 seconds
    if (pieces.every(p => p.y > H + 30)) {
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, W, H);
    }
  }

  // IntersectionObserver fires confetti when section enters view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !fired) {
        fired = true;
        io.unobserve(section);
        // Reveal banner
        setTimeout(() => {
          const banner = document.getElementById('anniversary-banner');
          if (banner) banner.classList.add('show');
        }, 400);
        // Start confetti
        burst();
        frame();
        // Stop after 12s and clear
        setTimeout(() => {
          cancelAnimationFrame(animId);
          // Fade out canvas
          canvas.style.transition = 'opacity 2s ease';
          canvas.style.opacity = '0';
          setTimeout(() => ctx.clearRect(0, 0, W, H), 2000);
        }, 12000);
      }
    });
  }, { threshold: 0.35 });

  io.observe(section);
  window.addEventListener('resize', resize);
})();


/* ══════════════════════════════════════════════════
   14. BACKGROUND MUSIC — autoplay on first interaction
══════════════════════════════════════════════════ */
(function initMusic() {
  const audio  = document.getElementById('bg-music');
  const btn    = document.getElementById('music-btn');
  const iconOn = document.getElementById('music-icon-on');
  const iconOff= document.getElementById('music-icon-off');
  if (!audio || !btn) return;

  audio.volume = 0;
  let playing  = false;
  let unlocked = false;

  function fadeIn() {
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(v + 0.02, 0.55);
      audio.volume = v;
      if (v >= 0.55) clearInterval(t);
    }, 80);
  }

  function fadeOut(cb) {
    let v = audio.volume;
    const t = setInterval(() => {
      v = Math.max(v - 0.03, 0);
      audio.volume = v;
      if (v <= 0) { clearInterval(t); if (cb) cb(); }
    }, 60);
  }

  function setPlaying(state) {
    playing = state;
    if (state) {
      iconOn.style.display  = 'block';
      iconOff.style.display = 'none';
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Pausar música');
    } else {
      iconOn.style.display  = 'none';
      iconOff.style.display = 'block';
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Reproducir música');
    }
  }

  function startMusic() {
    if (unlocked) return;
    unlocked = true;
    audio.play().then(() => {
      setPlaying(true);
      fadeIn();
    }).catch(() => {
      // Autoplay blocked — wait for btn
      unlocked = false;
    });
  }

  // Try autoplay on first scroll or tap (bypasses autoplay policy)
  const unlockEvents = ['scroll', 'touchstart', 'click', 'keydown'];
  function tryAutoplay() {
    startMusic();
    unlockEvents.forEach(ev => document.removeEventListener(ev, tryAutoplay));
  }
  unlockEvents.forEach(ev => document.addEventListener(ev, tryAutoplay, { once: true, passive: true }));

  // Manual toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // don't trigger unlock twice
    if (!unlocked) {
      // Force unlock via button click
      audio.play().then(() => {
        unlocked = true;
        setPlaying(true);
        fadeIn();
      });
    } else if (playing) {
      fadeOut(() => { audio.pause(); setPlaying(false); });
    } else {
      audio.play().then(() => { setPlaying(true); fadeIn(); });
    }
  });
})();

/* ══════════════════════════════════════════════════
   15. PWA SERVICE WORKER REGISTRATION
══════════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker registered!', reg.scope))
      .catch(err => console.log('Service Worker registration failed: ', err));
  });
}
