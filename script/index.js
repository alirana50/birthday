/* ================================================================
   INDEX.JS — "Happy Birthday, Amna" — Birthday Experience
   ================================================================
   To customize the content, edit script/content.js only.
   Only edit this file to change animation or interaction logic.
================================================================ */

'use strict';

// ================================================================
//  RUNTIME STATE
// ================================================================
const state = {
  musicPlaying:       false,
  candlesBlown:       false,
  candles:            [],
  giftOpened:         false,
  envelopeOpened:     false,
  lovePlayed:         false,
  eightPlayed:        false,
  herPlayed:          false,
  cakeReady:          false,
  fireworksBig:       false,
  fireworksBigId:     null,
  heroFwRunning:      true,
  heroFwAnimId:       null,
  carouselIndex:      0,
  carouselSlides:     0,
  touchStartX:        0,
  audioCtx:           null,
  analyser:           null,
  micStream:          null,
  isListening:        false,
};

// ================================================================
//  BOOT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) bgMusic.src = CONTENT.MUSIC_PATH;

  // Set hero photo
  setHeroPhoto();

  // Populate all dynamic content
  buildHerLines();
  buildMemoryCarousel();
  buildLoveDots();
  buildEightPoem();
  buildGiftMessage();
  buildLetter();
  buildFireworksText();
  buildFinalSurprise();
  buildHeroTaglines();

  // Start ambient particles
  initParticleCanvas();

  // Music control wiring
  initMusicControl();

  // Begin button wiring
  const beginBtn = document.getElementById('begin-btn');
  if (beginBtn) {
    beginBtn.addEventListener('click', startExperience);
    beginBtn.addEventListener('keydown', e => { if (e.key === 'Enter') startExperience(); });
  }

  // Initialize Secrecy Check (Love Gate)
  initSecrecyCheck();
});

// ================================================================
//  HERO PHOTO SETUP
// ================================================================
function setHeroPhoto() {
  const img  = document.getElementById('heroPhoto');
  const ph   = document.getElementById('heroPhotoPlaceholder');
  if (!img || !ph) return;

  if (CONTENT.HER_PHOTO) {
    img.src = CONTENT.HER_PHOTO;
    img.onload  = () => { img.style.display = 'block'; ph.style.display = 'none'; };
    img.onerror = () => { img.style.display = 'none'; ph.style.display = 'flex'; };
  } else {
    img.style.display = 'none';
    ph.style.display  = 'flex';
  }
}

// ================================================================
//  SECRECY CHECK (Love Gate)
// ================================================================
function floatingHeartsBurst(container) {
  if (!container) return;
  const rect   = container.getBoundingClientRect();
  const cx     = rect.left + rect.width / 2;
  const cy     = rect.top  + rect.height / 2;
  const EMOJIS = ['❤️', '✨', '💖', '🌸', '💕'];
  const COUNT  = 12;

  const frag = document.createDocumentFragment();
  const elements = [];

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.textContent = EMOJIS[i % EMOJIS.length];
    const startX = cx + (Math.random() - 0.5) * (rect.width * 0.7);
    const startY = cy + (Math.random() - 0.5) * (rect.height * 0.4);
    const size   = Math.random() * 0.8 + 1.2;

    el.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      font-size: ${size}rem;
      pointer-events: none;
      z-index: 10008;
      opacity: 1;
      will-change: transform, opacity;
      transform: translate3d(-50%, -50%, 0) scale(0.7);
    `;
    frag.appendChild(el);
    elements.push(el);
  }

  document.body.appendChild(frag);

  elements.forEach(el => {
    const targetY = -90 - Math.random() * 140;
    const targetX = (Math.random() - 0.5) * 90;

    gsap.to(el, {
      y: targetY,
      x: targetX,
      opacity: 0,
      scale: 1.3,
      duration: 1.1 + Math.random() * 0.5,
      ease: 'power2.out',
      force3D: true,
      onComplete: () => el.remove(),
    });
  });
}

function initSecrecyCheck() {
  const overlay  = document.getElementById('secrecy-overlay');
  const card     = document.getElementById('secrecyCard');
  const title    = document.getElementById('secrecyTitle');
  const sub      = document.getElementById('secrecySubtitle');
  const question = document.getElementById('secrecyQuestion');
  const input    = document.getElementById('secrecyInput');
  const feedback = document.getElementById('secrecyFeedback');
  const btn      = document.getElementById('secrecyBtn');
  const form     = document.getElementById('secrecyForm');

  const cfg = CONTENT.SECRECY_CHECK || {};

  if (!cfg.enabled || !overlay) {
    if (overlay) overlay.style.display = 'none';
    startHeroFireworks();
    runHeroAnimation();
    return;
  }

  // Populate content
  if (title)    title.textContent    = cfg.title || "A Little Secret...";
  if (sub)      sub.textContent      = cfg.subtitle || "";
  if (question) question.textContent = cfg.question || "Where did we meet?";
  if (input)    input.placeholder    = cfg.placeholder || "Type your answer...";
  if (btn)      btn.textContent      = cfg.buttonText || "Unlock →";

  let unlocked = false;

  function attemptUnlock() {
    if (unlocked || !input) return;
    const val = input.value.trim().toLowerCase();
    const valid = (cfg.validAnswers || ["giga"]).some(ans => val.includes(ans.toLowerCase()));

    if (valid) {
      unlocked = true;

      // Lock input & set success class
      input.disabled = true;
      input.classList.add('success');

      // Card pop animation
      if (card) {
        card.classList.remove('shake');
        card.classList.add('unlocked');
      }

      // Morph icon & button text
      const icon = document.querySelector('.secrecy-icon');
      if (icon) icon.textContent = "🔓💖";
      if (btn) {
        btn.textContent = "Unlocked ✨";
        btn.classList.add('unlocked');
      }

      // Animated feedback text
      if (feedback) {
        feedback.textContent = cfg.successMessage || "I knew it was you. Welcome, my love. ❤️";
        feedback.className = "secrecy-feedback success";
      }

      // Lightweight 60 FPS floating heart burst
      floatingHeartsBurst(card || overlay);

      // Smooth GPU fade into hero screen
      setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.style.display = 'none';
          startHeroFireworks();
          runHeroAnimation();
        }, 650);
      }, 900);
    } else {
      if (feedback) {
        feedback.textContent = cfg.errorMessage || "Try again, my love 💕";
        feedback.className = "secrecy-feedback";
      }
      if (card) {
        card.classList.remove('shake');
        void card.offsetWidth; // Force reflow
        card.classList.add('shake');
      }
    }
  }

  if (form) form.addEventListener('submit', e => { e.preventDefault(); attemptUnlock(); });
  if (btn)  btn.addEventListener('click', e => { e.preventDefault(); attemptUnlock(); });
}

// ================================================================
//  BUILD — populate DOM from CONTENT
// ================================================================
function buildHeroTaglines() {
  const above = document.getElementById('heroTaglineAbove');
  const below = document.getElementById('heroTaglineBelow');
  if (above) above.textContent = CONTENT.HERO_TAGLINE_ABOVE || 'Happy Birthday,';
  if (below) below.textContent = CONTENT.HERO_TAGLINE_BELOW || 'I made this little world for you. ❤️';
}

function buildHerLines() {
  const wrap = document.getElementById('her-lines-wrap');
  if (!wrap) return;

  const lines = CONTENT.HER_BIRTHDAY_LINES || [];
  lines.forEach((text, i) => {
    const p = document.createElement('p');
    const isFocal = i === 1;                        // middle line is focal
    const isFirst = i === 0;
    p.className = 'her-line ' + (isFocal ? 'her-line--focal' : isFirst ? 'her-line--sm' : 'her-line--lg');
    p.textContent = text;
    wrap.appendChild(p);
  });
}

function buildMemoryCarousel() {
  const track = document.getElementById('mcTrack');
  const dotsEl = document.getElementById('mcDots');
  if (!track) return;

  const mems = CONTENT.MEMORIES || [];
  state.carouselSlides = mems.length;

  mems.forEach((mem, i) => {
    const slide = document.createElement('div');
    slide.className = 'mc-slide';
    slide.dataset.index = i;

    // Photo
    const photo = document.createElement('div');
    photo.className = 'mc-photo';

    if (mem.photoPath) {
      const img = document.createElement('img');
      img.src = mem.photoPath;
      img.alt = mem.title;
      img.loading = 'lazy';
      photo.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'mc-placeholder';
      ph.innerHTML = '🌸';
      photo.appendChild(ph);
    }

    // Info
    const info = document.createElement('div');
    info.className = 'mc-info';
    info.innerHTML = `
      <p class="mc-date">${mem.date}</p>
      <h3 class="mc-title">${mem.title}</h3>
      <p class="mc-caption">${mem.caption}</p>
    `;

    slide.appendChild(photo);
    slide.appendChild(info);
    track.appendChild(slide);

    // Dot
    if (dotsEl) {
      const dot = document.createElement('button');
      dot.className = 'mc-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Memory ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsEl.appendChild(dot);
    }
  });

  // Track width
  track.style.width = (mems.length * 100) + '%';
  track.querySelectorAll('.mc-slide').forEach(s => {
    s.style.minWidth = (100 / mems.length) + '%';
  });

  // Smooth transition
  track.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';

  // Arrows
  const prev = document.getElementById('mcPrev');
  const next = document.getElementById('mcNext');
  if (prev) prev.addEventListener('click', () => goToSlide(state.carouselIndex - 1));
  if (next) next.addEventListener('click', () => goToSlide(state.carouselIndex + 1));

  // Touch swipe
  const carousel = document.getElementById('memCarousel');
  if (carousel) {
    carousel.addEventListener('touchstart', e => {
      state.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = state.touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) {
        goToSlide(state.carouselIndex + (diff > 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  // Keyboard support
  document.addEventListener('keydown', e => {
    const sec = document.getElementById('sec-memories');
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const visible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
    if (!visible) return;
    if (e.key === 'ArrowLeft')  goToSlide(state.carouselIndex - 1);
    if (e.key === 'ArrowRight') goToSlide(state.carouselIndex + 1);
  });
}

function goToSlide(index) {
  const n     = state.carouselSlides;
  const track = document.getElementById('mcTrack');
  const dots  = document.querySelectorAll('.mc-dot');
  if (!track || n === 0) return;

  // Clamp with wrap-around
  state.carouselIndex = ((index % n) + n) % n;
  const pct = state.carouselIndex * (100 / n);
  track.style.transform = `translateX(-${pct}%)`;

  dots.forEach((d, i) => d.classList.toggle('active', i === state.carouselIndex));
}

function buildLoveDots() {
  const container = document.getElementById('loveDots');
  if (!container) return;
  (CONTENT.LOVE_POINTS || []).forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'love-dot' + (i === 0 ? ' active' : '');
    container.appendChild(d);
  });
}

function buildEightPoem() {
  const container = document.getElementById('eight-poem');
  if (!container) return;

  const lines = CONTENT.EIGHT_YEARS_LINES || [];
  lines.forEach((text, i) => {
    const p = document.createElement('p');
    // Style assignment: first/last are pause, the big "8 years happened" is main, others are detail
    let cls = 'eight-line ';
    if (i === 0 || i === lines.length - 2) cls += 'eight-line--pause';
    else if (i === 1)                       cls += 'eight-line--main';
    else if (i === lines.length - 1)        cls += 'eight-line--closing';
    else                                    cls += 'eight-line--detail';
    p.className = cls;
    p.textContent = text;
    container.appendChild(p);
  });
}

function buildGiftMessage() {
  const el = document.getElementById('giftRevealText');
  if (el) el.textContent = CONTENT.GIFT_MESSAGE || '';
}

function buildLetter() {
  const el = document.getElementById('letterContent');
  if (el) el.textContent = CONTENT.LOVE_LETTER || '';
}

function buildFireworksText() {
  const container = document.getElementById('fw-lines');
  if (!container) return;
  (CONTENT.FIREWORKS_LINES || []).forEach((text, i) => {
    const el = document.createElement(i === 0 ? 'p' : 'p');
    el.className = 'fw-line ' + (i === 0 ? 'fw-headline' : 'fw-sub');
    el.textContent = text;
    container.appendChild(el);
  });
}

function buildFinalSurprise() {
  const container = document.getElementById('final-content');
  if (!container) return;
  const fs = CONTENT.FINAL_SURPRISE || {};

  let mediaHTML = '';
  if (fs.type === 'photo' && fs.content) {
    mediaHTML = `<div class="final-photo"><img src="${fs.content}" alt="Final surprise" /></div>`;
  } else if (fs.type === 'video' && fs.content) {
    mediaHTML = `<div class="final-photo"><video src="${fs.content}" controls autoplay muted loop playsinline></video></div>`;
  }

  container.innerHTML = `
    <h2 class="final-headline">${fs.headline || '8 years.'}</h2>
    ${mediaHTML}
    <p class="final-subline">${fs.subline || 'Still you.'}</p>
    <p class="final-closing">${fs.closing || 'Happy Birthday, Amna. ❤️'}</p>
  `;
}

// ================================================================
//  PARTICLE CANVAS — soft ambient pink particles
// ================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const isMobile = () => window.innerWidth < 768;
  const MAX_P = () => isMobile() ? 28 : 55;

  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeP() {
    return {
      x:         Math.random() * canvas.width,
      y:         canvas.height + Math.random() * 30,
      size:      Math.random() * 2.5 + 0.8,
      speedY:    -(Math.random() * 0.5 + 0.15),
      speedX:    (Math.random() - 0.5) * 0.3,
      opacity:   0,
      maxOp:     Math.random() * 0.45 + 0.1,
      life:      0,
      maxLife:   Math.random() * 280 + 200,
    };
  }

  function tick() {
    requestAnimationFrame(tick);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < MAX_P() && Math.random() < 0.55)
      particles.push(makeP());

    particles = particles.filter(p => {
      p.life++;
      p.x += p.speedX;
      p.y += p.speedY;

      const r = p.life / p.maxLife;
      if      (r < 0.15)  p.opacity = (r / 0.15)  * p.maxOp;
      else if (r > 0.75)  p.opacity = ((1 - r) / 0.25) * p.maxOp;
      else                p.opacity = p.maxOp;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 99, 140, ${p.opacity})`;
      ctx.fill();

      return p.life < p.maxLife && p.y > -20;
    });
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  tick();
}

// ================================================================
//  HERO FIREWORKS — atmospheric, behind photo
//  Softer, fewer, more spread out than the big climax fireworks
// ================================================================
function startHeroFireworks() {
  const canvas = document.getElementById('hero-fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = [
    'rgba(232, 99, 140,',
    'rgba(248, 192, 212,',
    'rgba(255, 255, 255,',
    'rgba(244, 154, 184,',
    'rgba(194, 24, 91,',
  ];

  class HeroParticle {
    constructor(x, y) {
      const angle  = Math.random() * Math.PI * 2;
      const speed  = 0.8 + Math.random() * 2.5;
      this.x       = x;
      this.y       = y;
      this.vx      = Math.cos(angle) * speed;
      this.vy      = Math.sin(angle) * speed;
      this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha   = 0.7 + Math.random() * 0.3;
      this.decay   = 0.006 + Math.random() * 0.01;
      this.size    = 0.8 + Math.random() * 1.8;
      this.gravity = 0.035;
    }
    update() {
      this.vy += this.gravity;
      this.vx *= 0.992;
      this.vy *= 0.992;
      this.x   += this.vx;
      this.y   += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha.toFixed(2)})`;
      ctx.fill();
    }
  }

  let particles = [];

  function heroBurst() {
    if (!state.heroFwRunning) return;
    // Keep bursts to sides/top so they frame photo, not cover it
    const zones = [
      { x: canvas.width * 0.12, y: canvas.height * 0.15 },
      { x: canvas.width * 0.88, y: canvas.height * 0.18 },
      { x: canvas.width * 0.08, y: canvas.height * 0.45 },
      { x: canvas.width * 0.92, y: canvas.height * 0.42 },
      { x: canvas.width * 0.25, y: canvas.height * 0.08 },
      { x: canvas.width * 0.75, y: canvas.height * 0.10 },
    ];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const jitter = 30;
    const bx = zone.x + (Math.random() - 0.5) * jitter * 2;
    const by = zone.y + (Math.random() - 0.5) * jitter * 2;

    const count = 30 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) particles.push(new HeroParticle(bx, by));
  }

  // First burst almost immediately
  setTimeout(heroBurst, 400);
  setTimeout(heroBurst, 1100);
  // Then every 2-3s
  const interval = setInterval(() => {
    if (!state.heroFwRunning) { clearInterval(interval); return; }
    heroBurst();
    if (Math.random() < 0.5) setTimeout(heroBurst, 550);
  }, 2200);

  function render() {
    if (!state.heroFwRunning) {
      // Fade out remaining particles
      if (particles.length === 0) return;
    }
    state.heroFwAnimId = requestAnimationFrame(render);

    ctx.fillStyle = 'rgba(4, 1, 11, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }
  render();
}

// ================================================================
//  HERO ANIMATION — photo + text entrance
// ================================================================
function runHeroAnimation() {
  const photoWrap  = document.getElementById('heroPhotoWrap');
  const hatWrap    = document.getElementById('heroHatWrap');
  const tagAbove   = document.getElementById('heroTaglineAbove');
  const name       = document.querySelector('.hero-name');
  const tagBelow   = document.getElementById('heroTaglineBelow');
  const beginBtn   = document.getElementById('begin-btn');
  const hintDot    = document.querySelector('.hero-bottom-hint');

  const tl = gsap.timeline({ delay: 0.6 });

  // Photo fades and zooms in
  if (photoWrap) {
    tl.to(photoWrap, {
      opacity: 1,
      scale:   1,
      y:       0,
      duration: 1.2,
      ease: 'power3.out',
    }, 0);
  }

  // Hat drops from above
  if (hatWrap) {
    tl.fromTo(hatWrap,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' },
      0.7
    );
  }

  // "Happy Birthday,"
  if (tagAbove) {
    tl.to(tagAbove, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 1.4);
  }

  // "Amna" — the name
  if (name) {
    tl.to(name, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.85);
  }

  // Tagline below
  if (tagBelow) {
    tl.to(tagBelow, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 2.55);
  }

  // Begin button
  if (beginBtn) {
    tl.to(beginBtn, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 3.15);
  }

  // Hint dot
  if (hintDot) {
    tl.to(hintDot, { opacity: 1, duration: 0.5 }, 3.7);
  }
}

// ================================================================
//  START EXPERIENCE — called when Begin is clicked
// ================================================================
function startExperience() {
  const hero     = document.getElementById('sec-hero');
  const music    = document.getElementById('bgMusic');
  const musicCtrl = document.getElementById('musicControl');

  // Stop hero fireworks gracefully
  state.heroFwRunning = false;

  // Start music (requires user gesture → click = allowed)
  if (music) {
    music.volume = 0;
    music.play()
      .then(() => {
        state.musicPlaying = true;
        setMusicIcon(true);
        gsap.to(music, { volume: 0.75, duration: 3 });
      })
      .catch(() => { state.musicPlaying = false; });
  }

  // Show music control
  if (musicCtrl) musicCtrl.classList.add('active');

  // Fade hero out
  if (hero) hero.classList.add('fade-out');

  // Ensure scroll is at absolute top before transition
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Enable scroll after hero fades
  setTimeout(() => {
    document.body.classList.add('unlocked');
    if (hero) hero.style.display = 'none';

    // Reset scroll position to top of experience
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Set up all scroll-triggered observers
    initScrollObservers();
    // Wire interactive sections
    initInteractiveSections();
    // Set up memory carousel
    initCarouselVisibility();

    // Smoothly ensure Section 2 starts right at top
    const herSec = document.getElementById('sec-her');
    if (herSec) herSec.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, 1400);
}

// ================================================================
//  SCROLL OBSERVERS — everything triggers on scroll
// ================================================================
function initScrollObservers() {

  // -- Generic .reveal-scroll elements --
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal-scroll').forEach(el => revObs.observe(el));

  // -- Her section: auto-play lines when enters viewport --
  observeOnce('sec-her', 0.35, () => {
    if (!state.herPlayed) {
      state.herPlayed = true;
      animateHerLines();
    }
  });

  // -- Memories: fade in section title --
  observeOnce('sec-memories', 0.1, () => {
    const title = document.querySelector('.memories-title');
    if (title) title.classList.add('revealed');
  });

  // -- Love section --
  observeOnce('sec-love', 0.35, () => {
    if (!state.lovePlayed) {
      state.lovePlayed = true;
      runLoveSequence();
    }
  });

  // -- 8 Years poem --
  observeOnce('sec-eight', 0.3, () => {
    if (!state.eightPlayed) {
      state.eightPlayed = true;
      animateEightPoem();
    }
  });

  // -- Gift intro lines --
  observeOnce('sec-gift', 0.15, () => {
    document.querySelectorAll('.gift-intro-line').forEach(el => el.classList.add('revealed'));
  });

  // -- Cake section --
  observeOnce('sec-cake', 0.4, () => {
    if (!state.cakeReady) {
      state.cakeReady = true;
      buildCandles();
      document.querySelectorAll('.cake-section .reveal-scroll').forEach(el => el.classList.add('revealed'));
      setTimeout(startMicDetection, 1100);
    }
  });

  // -- Fireworks section --
  observeOnce('sec-fireworks', 0.25, () => {
    if (!state.fireworksBig) {
      state.fireworksBig = true;
      launchBigFireworks();
      revealFireworksText();
    }
  });

  // -- Final section --
  observeOnce('sec-final', 0.2, () => {
    document.querySelectorAll('.final-pre, .final-pre2').forEach(el => el.classList.add('revealed'));
    setTimeout(animateFinalSection, 600);
  });
}

// Convenience: observe an element once
function observeOnce(id, threshold, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        fn();
        obs.unobserve(e.target);
      }
    });
  }, { threshold });
  obs.observe(el);
}

// ================================================================
//  SECTION 2 — HER BIRTHDAY LINES
// ================================================================
function animateHerLines() {
  const lines = document.querySelectorAll('.her-line');
  lines.forEach((line, i) => {
    gsap.to(line, {
      opacity:  1,
      y:        0,
      duration: 0.85,
      ease:     'power3.out',
      delay:    0.3 + i * 0.5,
    });
  });
}

// ================================================================
//  SECTION 4 — LOVE SEQUENCE
// ================================================================
function runLoveSequence() {
  const title   = document.getElementById('loveTitle');
  const display = document.getElementById('loveDisplay');
  const dots    = document.querySelectorAll('.love-dot');
  if (!display) return;

  const pts = CONTENT.LOVE_POINTS || [];

  // Fade in section title
  if (title) {
    gsap.to(title, { opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 });
  }

  let idx = 0;

  function updateDots(i) {
    dots.forEach((d, di) => d.classList.toggle('active', di === i));
  }

  function showNext() {
    if (idx >= pts.length) {
      // Hold last point, then loop after delay
      setTimeout(() => {
        idx = 0;
        showNext();
      }, 4500);
      return;
    }

    const prev = display.querySelector('.love-word');
    if (prev) {
      gsap.to(prev, {
        opacity:  0,
        y:        -20,
        duration: 0.5,
        ease:     'power2.in',
        onComplete: () => prev.remove(),
      });
    }

    const el = document.createElement('p');
    el.className = 'love-word';
    el.textContent = pts[idx];
    display.appendChild(el);

    updateDots(idx);
    idx++;

    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y:       0,
        duration: 0.8,
        ease:    'power3.out',
        delay:   0.35,
        onComplete: () => setTimeout(showNext, 2500),
      }
    );
  }

  setTimeout(showNext, 900);
}

// ================================================================
//  SECTION 5 — 8 YEARS POEM
// ================================================================
function animateEightPoem() {
  const lines = document.querySelectorAll('.eight-line');
  const tl = gsap.timeline({ delay: 0.4 });
  lines.forEach((line, i) => {
    tl.to(line, {
      opacity:  1,
      y:        0,
      duration: 0.75,
      ease:     'power3.out',
    }, i * 0.75);
  });
}

// ================================================================
//  SECTION 3 — CAROUSEL VISIBILITY INIT
// ================================================================
function initCarouselVisibility() {
  // Ensure first slide is visible
  goToSlide(0);
}

// ================================================================
//  INTERACTIVE SECTIONS
// ================================================================
function initInteractiveSections() {
  initGiftBox();
  initEnvelopeLetter();
  initFinalButton();
}

// ================================================================
//  SECTION 6 — GIFT BOX
// ================================================================
function initGiftBox() {
  const wrap    = document.getElementById('gift-wrap');
  const hint    = document.getElementById('giftHint');
  const reveal  = document.getElementById('giftReveal');

  if (!wrap) return;

  function openGift() {
    if (state.giftOpened) return;
    state.giftOpened = true;

    const lid = document.getElementById('giftLid');
    if (lid) lid.classList.add('open');

    // Pink light burst
    gsap.to(wrap, {
      filter: 'drop-shadow(0 0 60px rgba(232, 99, 140, 0.75))',
      duration: 0.5,
    });

    // Particle burst from gift
    burstParticles(wrap);

    // Fade hint
    if (hint) gsap.to(hint, { opacity: 0, duration: 0.3 });

    // Reveal message
    if (reveal) {
      setTimeout(() => {
        reveal.style.display = 'block';
        gsap.fromTo(reveal,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
        );
      }, 750);
    }
  }

  wrap.addEventListener('click',   openGift);
  wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openGift(); });
  if (hint) hint.addEventListener('click', openGift);
}

// Confetti burst from an element's center
function burstParticles(el) {
  const rect  = el.getBoundingClientRect();
  const cx    = rect.left + rect.width  / 2;
  const cy    = rect.top  + rect.height / 2;
  const COLS  = ['#e8638c', '#f8c0d4', '#ffffff', '#f49ab8', '#c2185b', '#fce4ec', '#f06292'];
  const COUNT = window.innerWidth < 600 ? 28 : 50;

  for (let i = 0; i < COUNT; i++) {
    const dot  = document.createElement('div');
    const size = Math.random() * 8 + 3;
    dot.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;
      width:${size}px;height:${size}px;border-radius:50%;
      background:${COLS[Math.floor(Math.random() * COLS.length)]};
      pointer-events:none;z-index:99999;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(dot);

    const angle = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5) * 0.7;
    const dist  = 80 + Math.random() * 150;

    gsap.to(dot, {
      x:        Math.cos(angle) * dist,
      y:        Math.sin(angle) * dist,
      opacity:  0,
      scale:    0,
      duration: 0.7 + Math.random() * 0.5,
      ease:     'power2.out',
      onComplete: () => dot.remove(),
    });
  }
}

// ================================================================
//  SECTION 7 — CAKE + CANDLES + MICROPHONE
// ================================================================
function buildCandles() {
  const cake = document.getElementById('cake');
  if (!cake || state.candles.length > 0) return;

  // 8 candles, spaced across 260px cake
  for (let i = 0; i < 8; i++) {
    const left   = 10 + i * 30;
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.style.left = left + 'px';
    candle.style.top  = '-32px';

    const flame = document.createElement('div');
    flame.className = 'flame';
    flame.style.animationDelay = (Math.random() * 0.65) + 's';
    candle.appendChild(flame);

    cake.appendChild(candle);
    state.candles.push(candle);
  }
}

// ---- Mic detection ----
function stopMicDetection() {
  if (state.micStream) {
    state.micStream.getTracks().forEach(t => t.stop());
    state.micStream = null;
  }
  if (state.audioCtx) {
    state.audioCtx.close().catch(() => {});
    state.audioCtx = null;
  }
  state.isListening = false;
}

async function checkMicPermission() {
  try {
    const p = await navigator.permissions.query({ name: 'microphone' });
    return p.state === 'granted';
  } catch { return false; }
}

async function startMicDetection() {
  if (state.candlesBlown || state.isListening) return;
  const instr   = document.getElementById('blowInstruction');
  const fallBtn = document.getElementById('blowFallbackBtn');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showFallbackButton();
    return;
  }

  const already = await checkMicPermission();

  if (already) {
    requestMicAccess();
  } else {
    // Show fallback immediately, let her choose mic too
    if (fallBtn) fallBtn.style.display = 'block';
    if (instr) {
      instr.textContent = '🎤 Or tap your mic icon above to use the microphone';
      instr.style.cursor = 'pointer';
      instr.addEventListener('click', requestMicAccess, { once: true });
    }
  }
}

function requestMicAccess() {
  const instr = document.getElementById('blowInstruction');
  if (instr) instr.textContent = '🎤 Waiting for mic access...';
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      state.micStream = stream;
      setupAudioAnalysis(stream);
    })
    .catch(() => showFallbackButton());
}

function showFallbackButton() {
  const instr   = document.getElementById('blowInstruction');
  const fallBtn = document.getElementById('blowFallbackBtn');
  if (instr)   instr.style.display   = 'none';
  if (fallBtn) {
    fallBtn.style.display = 'block';
    fallBtn.addEventListener('click', blowCandles, { once: true });
  }
}

function setupAudioAnalysis(stream) {
  const instr = document.getElementById('blowInstruction');
  if (instr) instr.textContent = '🌬️ Blow into your mic to blow out the candles';

  try {
    state.audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    state.analyser  = state.audioCtx.createAnalyser();
    const mic       = state.audioCtx.createMediaStreamSource(stream);
    state.analyser.smoothingTimeConstant = 0.8;
    state.analyser.fftSize = 512;
    mic.connect(state.analyser);
    const data = new Uint8Array(state.analyser.frequencyBinCount);
    state.isListening = true;

    function detect() {
      if (!state.isListening || state.candlesBlown) { stopMicDetection(); return; }
      state.analyser.getByteFrequencyData(data);
      const avg = data.reduce((s, v) => s + v, 0) / data.length;
      if (avg > 34) { stopMicDetection(); blowCandles(); return; }
      requestAnimationFrame(detect);
    }
    detect();
  } catch {
    stopMicDetection();
    showFallbackButton();
  }
}

function blowCandles() {
  if (state.candlesBlown) return;
  state.candlesBlown = true;
  stopMicDetection();

  const instr   = document.getElementById('blowInstruction');
  const fallBtn = document.getElementById('blowFallbackBtn');
  const msg     = document.getElementById('blownMessage');

  if (instr)   instr.style.display   = 'none';
  if (fallBtn) fallBtn.style.display = 'none';

  // Extinguish candles staggered
  state.candles.forEach((c, i) => setTimeout(() => c.classList.add('out'), i * 100));

  // Show wish granted
  setTimeout(() => {
    if (msg) msg.classList.add('show');
    // Auto-scroll to fireworks climax
    setTimeout(() => {
      const fw = document.getElementById('sec-fireworks');
      if (fw) fw.scrollIntoView({ behavior: 'smooth' });
    }, 2800);
  }, 1000);
}

// ================================================================
//  SECTION 8 — BIG FIREWORKS (celebration climax)
// ================================================================
function launchBigFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = [
    '#e8638c', '#f8c0d4', '#ffffff',
    '#f49ab8', '#c2185b', '#fce4ec', '#f06292', '#ad1457',
  ];

  class BigParticle {
    constructor(x, y) {
      const angle   = Math.random() * Math.PI * 2;
      const speed   = 2.5 + Math.random() * 6;
      this.x        = x;
      this.y        = y;
      this.vx       = Math.cos(angle) * speed;
      this.vy       = Math.sin(angle) * speed;
      this.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha    = 1;
      this.decay    = 0.009 + Math.random() * 0.012;
      this.size     = 1.5 + Math.random() * 2.8;
      this.gravity  = 0.06;
      // Occasional "star" trail
      this.trail = Math.random() < 0.25;
    }
    update() {
      this.vy += this.gravity;
      this.vx *= 0.987;
      this.vy *= 0.987;
      this.x   += this.vx;
      this.y   += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      const a = Math.max(0, this.alpha);
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      // Trail effect
      if (this.trail && a > 0.1) {
        ctx.globalAlpha = a * 0.25;
        ctx.beginPath();
        ctx.arc(this.x - this.vx * 2, this.y - this.vy * 2, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  let particles = [];

  function bigBurst() {
    const x     = canvas.width  * (0.1 + Math.random() * 0.8);
    const y     = canvas.height * (0.05 + Math.random() * 0.55);
    const count = 75 + Math.floor(Math.random() * 55);
    for (let i = 0; i < count; i++) particles.push(new BigParticle(x, y));
  }

  // Rapid opening bursts
  bigBurst();
  setTimeout(bigBurst, 500);
  setTimeout(bigBurst, 1000);
  setTimeout(bigBurst, 1600);

  // Ongoing bursts
  const fwInterval = setInterval(() => {
    if (!state.fireworksBig) { clearInterval(fwInterval); return; }
    bigBurst();
    if (Math.random() < 0.6) setTimeout(bigBurst, 320);
  }, 1500);

  function render() {
    if (!state.fireworksBig && particles.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    state.fireworksBigId = requestAnimationFrame(render);

    // Dramatic dark trail
    ctx.fillStyle = 'rgba(2, 0, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }
  render();
}

function revealFireworksText() {
  const amnaName = document.getElementById('fwAmnaName');
  const lines    = document.querySelectorAll('.fw-line');

  // "Amna" name appears first — big and glowing
  if (amnaName) {
    gsap.to(amnaName, {
      opacity:  1,
      scale:    1,
      duration: 1.3,
      ease:     'power3.out',
      delay:    1.2,
    });
  }

  // Text lines appear below
  lines.forEach((line, i) => {
    gsap.to(line, {
      opacity:  1,
      y:        0,
      duration: 0.9,
      ease:     'power3.out',
      delay:    2.8 + i * 0.9,
    });
  });
}

// ================================================================
//  SECTION 9 — ENVELOPE + LOVE LETTER
// ================================================================
function initEnvelopeLetter() {
  const scene       = document.getElementById('envelopeScene');
  const envelope    = document.getElementById('envelope');
  const letterPaper = document.getElementById('letterPaper');

  if (!scene) return;

  function openEnvelope() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;

    if (envelope) envelope.classList.add('open');

    setTimeout(() => {
      gsap.to(scene, { y: -40, opacity: 0, duration: 0.7, ease: 'power2.in' });

      if (letterPaper) {
        letterPaper.style.display = 'block';
        // Force layout before transition
        requestAnimationFrame(() => requestAnimationFrame(() => {
          letterPaper.classList.add('visible');
        }));
      }
    }, 800);
  }

  scene.addEventListener('click',   openEnvelope);
  scene.addEventListener('keydown', e => { if (e.key === 'Enter') openEnvelope(); });
}

// ================================================================
//  SECTION 10 — FINAL
// ================================================================
function initFinalButton() {
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) replayBtn.addEventListener('click', replayExperience);
}

function animateFinalSection() {
  const headline  = document.querySelector('.final-headline');
  const photo     = document.querySelector('.final-photo');
  const subline   = document.querySelector('.final-subline');
  const closing   = document.querySelector('.final-closing');
  const replayBtn = document.getElementById('replayBtn');

  const tl = gsap.timeline({ delay: 0.2 });

  if (headline) tl.to(headline, { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power3.out' }, 0);
  if (photo)    tl.to(photo,    { opacity: 1, y: 0,          duration: 1.0, ease: 'power3.out' }, 0.9);
  if (subline)  tl.to(subline,  { opacity: 1, y: 0,          duration: 0.9, ease: 'power3.out' }, photo ? 1.5 : 0.9);
  if (closing)  tl.to(closing,  { opacity: 1, y: 0,          duration: 0.9, ease: 'power3.out' }, photo ? 2.2 : 1.6);
  if (replayBtn) tl.to(replayBtn, { opacity: 0.5, duration: 0.7 }, photo ? 3.0 : 2.4);
}

// ================================================================
//  MUSIC CONTROL
// ================================================================
function initMusicControl() {
  const btn   = document.getElementById('musicControl');
  const music = document.getElementById('bgMusic');
  if (btn) btn.addEventListener('click', toggleMusic);

  if (music) {
    music.addEventListener('timeupdate', updateMusicProgress);
    music.addEventListener('loadedmetadata', updateMusicProgress);
  }
  setMusicIcon(false);
}

function updateMusicProgress() {
  const music     = document.getElementById('bgMusic');
  const ring      = document.getElementById('musicProgressRing');
  const timeBadge = document.getElementById('musicTimeBadge');
  if (!music || !ring) return;

  const current  = music.currentTime || 0;
  const duration = music.duration && !isNaN(music.duration) && music.duration > 0 ? music.duration : 1;
  const progress = Math.min(Math.max(current / duration, 0), 1);

  // Circumference of r=25 circle is 2 * Math.PI * 25 = 157.08
  const circumference = 157.08;
  ring.style.strokeDashoffset = circumference * (1 - progress);

  if (timeBadge) {
    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60).toString().padStart(2, '0');
    timeBadge.textContent = `${mins}:${secs}`;
  }
}

function toggleMusic() {
  const music = document.getElementById('bgMusic');
  if (!music) return;
  if (state.musicPlaying) {
    music.pause();
    state.musicPlaying = false;
    setMusicIcon(false);
  } else {
    music.play().catch(() => {});
    state.musicPlaying = true;
    setMusicIcon(true);
  }
}

function setMusicIcon(playing) {
  const btn = document.getElementById('musicControl');
  const on  = document.getElementById('musicIconOn');
  const off = document.getElementById('musicIconOff');
  if (btn) btn.classList.toggle('playing', playing);
  if (on)  on.classList.toggle('hidden',  !playing);
  if (off) off.classList.toggle('hidden', playing);
  updateMusicProgress();
}

// ================================================================
//  REPLAY — full state reset
// ================================================================
function replayExperience() {
  // Stop big fireworks
  state.fireworksBig = false;
  if (state.fireworksBigId) cancelAnimationFrame(state.fireworksBigId);
  stopMicDetection();

  // Reset candles
  state.candles.forEach(c => c.remove());
  state.candles    = [];
  state.candlesBlown = false;
  state.cakeReady  = false;

  // Reset sections
  state.herPlayed    = false;
  state.lovePlayed   = false;
  state.eightPlayed  = false;
  state.giftOpened   = false;
  state.envelopeOpened = false;

  // DOM resets
  const blownMsg = document.getElementById('blownMessage');
  if (blownMsg) blownMsg.classList.remove('show');

  const instr = document.getElementById('blowInstruction');
  if (instr) {
    instr.style.display = '';
    instr.textContent   = '🌬️ Blow into your mic to blow out the candles';
  }

  const fallBtn = document.getElementById('blowFallbackBtn');
  if (fallBtn) fallBtn.style.display = 'none';

  const lid = document.getElementById('giftLid');
  if (lid) lid.classList.remove('open');

  const giftReveal = document.getElementById('giftReveal');
  if (giftReveal) { giftReveal.style.display = 'none'; gsap.set(giftReveal, { opacity: 0 }); }

  const giftWrap = document.getElementById('gift-wrap');
  if (giftWrap) gsap.set(giftWrap, { filter: 'none' });

  const giftHint = document.getElementById('giftHint');
  if (giftHint) gsap.set(giftHint, { opacity: 1 });

  const envelope = document.getElementById('envelope');
  if (envelope) envelope.classList.remove('open');

  const scene = document.getElementById('envelopeScene');
  if (scene) gsap.set(scene, { y: 0, opacity: 1 });

  const letterPaper = document.getElementById('letterPaper');
  if (letterPaper) { letterPaper.style.display = 'none'; letterPaper.classList.remove('visible'); }

  // Reset love display
  const loveDisplay = document.getElementById('loveDisplay');
  if (loveDisplay) loveDisplay.innerHTML = '';
  const loveTitle = document.getElementById('loveTitle');
  if (loveTitle) gsap.set(loveTitle, { opacity: 0 });
  document.querySelectorAll('.love-dot').forEach((d, i) => d.classList.toggle('active', i === 0));

  // Reset her lines
  document.querySelectorAll('.her-line').forEach(l => gsap.set(l, { opacity: 0, y: 22 }));

  // Reset 8 years poem
  document.querySelectorAll('.eight-line').forEach(l => gsap.set(l, { opacity: 0, y: 14 }));

  // Reset fireworks text
  const amnaName = document.getElementById('fwAmnaName');
  if (amnaName) gsap.set(amnaName, { opacity: 0, scale: 0.88 });
  document.querySelectorAll('.fw-line').forEach(l => gsap.set(l, { opacity: 0, y: 16 }));

  // Reset fireworks canvas
  const fwCanvas = document.getElementById('fireworks-canvas');
  if (fwCanvas) {
    const ctx = fwCanvas.getContext('2d');
    ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  }

  // Reset final section
  const finalHeadline = document.querySelector('.final-headline');
  const finalSubline  = document.querySelector('.final-subline');
  const finalClosing  = document.querySelector('.final-closing');
  const finalPhoto    = document.querySelector('.final-photo');
  const replayBtn     = document.getElementById('replayBtn');
  const finalPres     = document.querySelectorAll('.final-pre, .final-pre2');

  if (finalHeadline) gsap.set(finalHeadline, { opacity: 0, scale: 0.88, y: 20 });
  if (finalSubline)  gsap.set(finalSubline,  { opacity: 0, y: 18 });
  if (finalClosing)  gsap.set(finalClosing,  { opacity: 0, y: 18 });
  if (finalPhoto)    gsap.set(finalPhoto,    { opacity: 0, y: 30 });
  if (replayBtn)     gsap.set(replayBtn,     { opacity: 0 });
  finalPres.forEach(el => el.classList.remove('revealed'));

  // Reset .reveal-scroll elements
  document.querySelectorAll('.reveal-scroll.revealed').forEach(el => el.classList.remove('revealed'));

  // Reset gift intro lines
  document.querySelectorAll('.gift-intro-line').forEach(el => el.classList.remove('revealed'));

  // Reset carousel
  goToSlide(0);

  // Restart music
  const music = document.getElementById('bgMusic');
  if (music) {
    music.currentTime = 0;
    music.play()
      .then(() => { state.musicPlaying = true; setMusicIcon(true); })
      .catch(() => {});
  }

  // Scroll back to top of experience
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-init observers after scroll settles
  setTimeout(() => {
    initScrollObservers();
    initInteractiveSections();
  }, 700);
}
