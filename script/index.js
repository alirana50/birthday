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
  // Disable automatic browser scroll restoration so experience always starts at top
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) bgMusic.src = CONTENT.MUSIC_PATH;

  // Set hero photo
  setHeroPhoto();

  // Populate dynamic content
  buildHerLines();
  init3DCarousel();
  buildLoveDots();
  buildEightPoem();
  buildGiftMessage();
  buildLetter();
  buildFireworksText();
  buildFinalSurprise();
  buildHeroTaglines();

  // Start ambient canvas layers & floating hearts
  initStarfield();
  initParticleCanvas();
  initFloatingHearts();

  // Music control wiring
  initMusicControl();

  // Begin button wiring
  const beginBtn = document.getElementById('begin-btn');
  if (beginBtn) {
    beginBtn.addEventListener('click', startExperience);
    beginBtn.addEventListener('keydown', e => { if (e.key === 'Enter') startExperience(); });
  }

  // Build birthday cake candles
  buildCandles();

  // Initialize Cake & Mic blow controls
  initCakeInteraction();

  // Start Gate Flow (Countdown -> Secrecy -> Hero)
  initAppGateFlow();
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

// ================================================================
//  GATE FLOW CONTROLLER — COUNTDOWN -> SECRECY -> HERO
// ================================================================
function initAppGateFlow() {
  const cdOverlay  = document.getElementById('countdown-overlay');
  const secOverlay = document.getElementById('secrecy-overlay');
  const cfgCD      = CONTENT.COUNTDOWN || {};
  const cfgSec     = CONTENT.SECRECY_CHECK || {};

  // Setup secrecy elements, text & listeners in advance
  setupSecrecyCheck();

  const now = new Date().getTime();
  const targetTime = cfgCD.targetDate ? new Date(cfgCD.targetDate).getTime() : 0;
  const isCountdownActive = Boolean(cfgCD.enabled && targetTime && targetTime > now);

  if (isCountdownActive) {
    // Show countdown ONLY; explicitly keep secrecy overlay hidden
    if (cdOverlay)  cdOverlay.style.display  = 'flex';
    if (secOverlay) secOverlay.style.display = 'none';

    initCountdownGate(() => {
      // Countdown finished and celebration ended!
      if (cfgSec.enabled && secOverlay) {
        secOverlay.style.display = 'flex';
        gsap.fromTo(secOverlay,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
        );
      } else {
        if (secOverlay) secOverlay.style.display = 'none';
        startHeroFireworks();
        runHeroAnimation();
      }
    });
  } else {
    // Countdown not active (disabled or target time already passed)
    if (cdOverlay) cdOverlay.style.display = 'none';

    if (cfgSec.enabled && secOverlay) {
      secOverlay.style.display = 'flex';
    } else {
      if (secOverlay) secOverlay.style.display = 'none';
      startHeroFireworks();
      runHeroAnimation();
    }
  }
}

// ================================================================
//  COUNTDOWN TIMER GATE (Pre-Authentication Layer)
// ================================================================
function initCountdownGate(onCompleteCallback) {
  const overlay        = document.getElementById('countdown-overlay');
  const cdContent      = document.getElementById('countdownContent');
  const cdPreTitle     = document.getElementById('cdPreTitle');
  const cdTitleMain    = document.getElementById('cdTitleMain');
  const cdTitleHighlight = document.getElementById('cdTitleHighlight');
  const cdDesc         = document.getElementById('cdDesc');
  const cdStayHint     = document.getElementById('cdStayHint');
  const cdCelebScreen  = document.getElementById('cdCelebrationScreen');
  const cdGrafTitle    = document.getElementById('cdGraffitiTitle');
  const cdGrafSub      = document.getElementById('cdGraffitiSub');

  const daysEl  = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl  = document.getElementById('cdMinutes');
  const secsEl  = document.getElementById('cdSeconds');

  const cfg = CONTENT.COUNTDOWN || {};

  function proceedToNext() {
    if (overlay) {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.style.display = 'none';
        if (typeof onCompleteCallback === 'function') onCompleteCallback();
      }, 850);
    } else {
      if (typeof onCompleteCallback === 'function') onCompleteCallback();
    }
  }

  if (!cfg.enabled || !cfg.targetDate || !overlay) {
    if (overlay) overlay.style.display = 'none';
    if (typeof onCompleteCallback === 'function') onCompleteCallback();
    return;
  }

  const targetTime = new Date(cfg.targetDate).getTime();
  if (isNaN(targetTime)) {
    proceedToNext();
    return;
  }

  // Populate static UI text
  if (cdPreTitle)       cdPreTitle.textContent       = cfg.preTitle       || "NOT YET, MY LOVE";
  if (cdTitleMain)      cdTitleMain.textContent      = cfg.titleMain      || "The stars are still";
  if (cdTitleHighlight) cdTitleHighlight.textContent = cfg.titleHighlight || "getting ready";
  if (cdDesc)           cdDesc.textContent           = cfg.description    || "";
  if (cdStayHint)       cdStayHint.textContent       = cfg.stayHint       || "stay right here";
  if (cdGrafTitle)      cdGrafTitle.textContent      = cfg.unlockedGraffiti || "Happy Birthday Amna! 🎉";
  if (cdGrafSub)        cdGrafSub.textContent        = cfg.unlockedSub      || "The whole sky just opened up for you. ❤️";

  let timerInterval = null;
  let hasUnlocked = false;

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
      if (hasUnlocked) return;
      hasUnlocked = true;
      clearInterval(timerInterval);

      if (daysEl)  daysEl.textContent  = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl)  minsEl.textContent  = "00";
      if (secsEl)  secsEl.textContent  = "00";

      // Heart burst celebration
      floatingHeartsBurst(overlay);

      // Launch dynamic celebration fireworks behind graffiti text
      const fwInstance = launchCountdownCelebrationFireworks();

      // Transition to Graffiti Celebration Screen
      if (cdContent) {
        gsap.to(cdContent, {
          opacity: 0,
          scale: 0.92,
          y: -20,
          duration: 0.45,
          ease: 'power2.in',
          onComplete: () => {
            cdContent.style.display = 'none';
            if (cdCelebScreen) {
              cdCelebScreen.style.display = 'flex';
              gsap.fromTo(cdCelebScreen,
                { opacity: 0, scale: 0.7 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }
              );
            }

            // Hold Graffiti + Fireworks celebration for 4.5s
            setTimeout(() => {
              proceedToNext();
              setTimeout(() => {
                if (fwInstance && typeof fwInstance.stop === 'function') {
                  fwInstance.stop();
                }
              }, 900);
            }, 4500);
          }
        });
      } else {
        proceedToNext();
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl)  daysEl.textContent  = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl)  minsEl.textContent  = String(m).padStart(2, '0');
    if (secsEl)  secsEl.textContent  = String(s).padStart(2, '0');
  }

  updateTimer();
  if (!hasUnlocked) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

// ================================================================
//  COUNTDOWN CELEBRATION FIREWORKS ENGINE
// ================================================================
function launchCountdownCelebrationFireworks() {
  const canvas = document.getElementById('cd-fireworks-canvas');
  if (!canvas) return { stop: () => {} };
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop: () => {} };

  let running = true;
  let rafId = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = [
    '#ff1493', '#ff69b4', '#e8638c', '#ffd700',
    '#ffb74d', '#00e5ff', '#ffffff', '#b388ff', '#ff4081'
  ];

  class FireworkParticle {
    constructor(x, y) {
      const angle   = Math.random() * Math.PI * 2;
      const speed   = 2.5 + Math.random() * 6.5;
      this.x        = x;
      this.y        = y;
      this.vx       = Math.cos(angle) * speed;
      this.vy       = Math.sin(angle) * speed;
      this.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha    = 1;
      this.decay    = 0.012 + Math.random() * 0.014;
      this.size     = 1.8 + Math.random() * 2.8;
      this.gravity  = 0.065;
    }
    update() {
      this.vy += this.gravity;
      this.vx *= 0.985;
      this.vy *= 0.985;
      this.x   += this.vx;
      this.y   += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];

  function burst(x, y, count = 65) {
    for (let i = 0; i < count; i++) {
      particles.push(new FireworkParticle(x, y));
    }
  }

  // Rapid burst sequence across screen
  let burstTimer = setInterval(() => {
    if (!running) return;
    const x = canvas.width * (0.15 + Math.random() * 0.7);
    const y = canvas.height * (0.15 + Math.random() * 0.55);
    burst(x, y, 70 + Math.floor(Math.random() * 40));
  }, 260);

  // Initial immediate explosion of bursts
  burst(canvas.width * 0.5, canvas.height * 0.35, 95);
  burst(canvas.width * 0.25, canvas.height * 0.45, 65);
  burst(canvas.width * 0.75, canvas.height * 0.45, 65);

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  loop();

  return {
    stop: () => {
      running = false;
      clearInterval(burstTimer);
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener('resize', resize);
    }
  };
}

// ================================================================
//  SECRECY CHECK (Love Gate)
// ================================================================
function setupSecrecyCheck() {
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

  // Populate content
  if (title)    title.textContent    = cfg.title || "A Little Secret Between Us...";
  if (sub)      sub.textContent      = cfg.subtitle || "Before I show you what I made, I need to make sure it's really you. ❤️";
  if (question) question.textContent = cfg.question || "Where did we meet for the first time?";
  if (input)    input.placeholder    = cfg.placeholder || "Type your answer here...";
  if (btn)      btn.textContent      = cfg.buttonText || "Unlock My Surprise →";

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
        if (overlay) {
          overlay.classList.add('fade-out');
          setTimeout(() => {
            overlay.style.display = 'none';
            startHeroFireworks();
            runHeroAnimation();
          }, 650);
        } else {
          startHeroFireworks();
          runHeroAnimation();
        }
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

function init3DCarousel() {
  const ring  = document.getElementById('carousel3DRing');
  const stage = document.getElementById('carousel3DStage');
  if (!ring || !stage) return;

  const photos = CONTENT.MEMORIES || [];
  if (photos.length === 0) return;

  let angle = 0;
  let radius = 360;
  let cardW = 240;
  let dragging = false;
  let lastX = 0;
  let velocity = -0.06;

  function measure() {
    const w = window.innerWidth;
    cardW = w < 640 ? 170 : w < 1024 ? 220 : 260;
    const cardH = Math.round(cardW * 1.33);
    radius = Math.round(cardW / (2 * Math.tan(Math.PI / photos.length)) + 40);

    const cards = ring.querySelectorAll('.carousel-3d-card');
    const step = 360 / photos.length;

    cards.forEach((card, i) => {
      card.style.width = `${cardW}px`;
      card.style.height = `${cardH}px`;
      card.style.left = `${-cardW / 2}px`;
      card.style.top = `${-cardH / 2}px`;
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
  }

  // Build card figures
  ring.innerHTML = '';
  const step = 360 / photos.length;

  photos.forEach((p, i) => {
    const card = document.createElement('figure');
    card.className = 'carousel-3d-card';

    const photoHTML = p.photoPath
      ? `<img src="${p.photoPath}" alt="${p.caption || p.title}" loading="lazy" draggable="false" />`
      : `<div class="carousel-3d-placeholder">🌸</div>`;

    card.innerHTML = `
      ${photoHTML}
      <figcaption class="carousel-3d-caption">
        ${p.caption || p.title}
      </figcaption>
    `;

    ring.appendChild(card);
  });

  measure();
  window.addEventListener('resize', measure, { passive: true });

  // Pointer drag interactions with velocity & inertia
  function onDown(e) {
    dragging = true;
    lastX = e.clientX;
    if (stage.setPointerCapture) {
      try { stage.setPointerCapture(e.pointerId); } catch {}
    }
  }

  function onMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    velocity = dx * 0.22;
    angle += dx * 0.22;
  }

  function onUp() {
    dragging = false;
  }

  stage.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointermove', onMove);
  stage.addEventListener('pointerup', onUp);
  stage.addEventListener('pointerleave', onUp);
  stage.addEventListener('pointercancel', onUp);

  // Animation loop
  function tick() {
    if (!dragging) {
      angle += velocity;
      velocity += (-0.06 - velocity) * 0.02;
    }
    ring.style.transform = `translate(-50%, -50%) rotateX(-6deg) rotateY(${angle}deg)`;
    requestAnimationFrame(tick);
  }

  tick();
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

  const lines = CONTENT.TWENTYFOUR_YEARS_LINES || CONTENT.EIGHT_YEARS_LINES || [];
  lines.forEach((text, i) => {
    const p = document.createElement('p');
    let cls = 'eight-line ';
    if (i === 0)                      cls += 'eight-line--title';
    else if (i === 1)                 cls += 'eight-line--sub';
    else if (i === 2)                 cls += 'eight-line--pause';
    else if (i === lines.length - 1)  cls += 'eight-line--closing';
    else                              cls += 'eight-line--focal';

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
  const salutation = document.getElementById('letterSalutation');
  const body = document.getElementById('letterBody');
  const valediction = document.getElementById('letterValediction');
  const cfg = CONTENT.LOVE_LETTER || {};

  if (salutation) {
    salutation.textContent = cfg.salutation || "My love,";
  }

  if (body) {
    body.innerHTML = '';
    const paras = Array.isArray(cfg.paragraphs) ? cfg.paragraphs : [cfg || ''];
    paras.forEach(text => {
      const p = document.createElement('p');
      p.className = 'letter-line';
      p.textContent = text;
      body.appendChild(p);
    });
  }

  if (valediction) {
    valediction.textContent = cfg.valediction || "Always yours.";
  }
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
//  STARFIELD CANVAS — parallax, twinkling stars & shooting stars
// ================================================================
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let raf = 0;
  let w = 0, h = 0, dpr = 1;
  let stars = [];
  const shooting = [];
  const pointer = { x: 0, y: 0 };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(280, Math.floor((w * h) / 5500));
    stars = Array.from({ length: Math.max(80, count) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.8 + 0.5,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.25 ? 350 : Math.random() < 0.5 ? 30 : 220,
    }));
  }

  function onPointerMove(e) {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  let t = 0;
  function render() {
    t += 0.012;
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      s.tw += 0.02 + s.z * 0.03;
      const alpha = (0.35 + Math.abs(Math.sin(s.tw)) * 0.65) * s.z;
      const px = s.x + pointer.x * 18 * s.z;
      const py = s.y + pointer.y * 18 * s.z + Math.sin(t * 0.4 + s.x * 0.01) * 2 * s.z;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${s.hue}, 95%, ${s.hue === 220 ? 94 : 82}%, ${alpha.toFixed(3)})`;
      ctx.arc(px, py, s.r * (0.7 + s.z * 0.5), 0, Math.PI * 2);
      ctx.fill();

      if (s.r > 1.3) {
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.arc(px, py, s.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    if (!reduce && Math.random() < 0.008 && shooting.length < 3) {
      shooting.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.4,
        vx: 6 + Math.random() * 4,
        vy: 1.8 + Math.random() * 1.5,
        life: 1,
      });
    }

    for (let i = shooting.length - 1; i >= 0; i--) {
      const sh = shooting[i];
      if (!sh) continue;
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= 0.014;

      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 18, sh.y - sh.vy * 18);
      grad.addColorStop(0, `rgba(255, 230, 240, ${Math.max(sh.life, 0)})`);
      grad.addColorStop(1, "rgba(255, 120, 160, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 18, sh.y - sh.vy * 18);
      ctx.stroke();

      if (sh.life <= 0 || sh.x > w + 200) shooting.splice(i, 1);
    }

    raf = requestAnimationFrame(render);
  }

  build();
  render();
  window.addEventListener('resize', build, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
}

// ================================================================
//  FLOATING HEARTS — ambient rose hearts drifting upward
// ================================================================
function initFloatingHearts() {
  const container = document.getElementById('floating-hearts-layer');
  if (!container) return;

  container.innerHTML = '';
  const count = 20;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'floating-heart-svg');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
    svg.appendChild(path);

    const left = Math.random() * 100;
    const size = Math.floor(14 + Math.random() * 24);
    const delay = (Math.random() * 16).toFixed(2);
    const duration = (14 + Math.random() * 16).toFixed(2);
    const drift = Math.floor((Math.random() - 0.5) * 140);
    const opacity = (0.35 + Math.random() * 0.4).toFixed(2);

    svg.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      --drift: ${drift}px;
      --max-opacity: ${opacity};
      color: #e8638c;
    `;

    frag.appendChild(svg);
  }

  container.appendChild(frag);
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
        y:        -18,
        xPercent: -50,
        yPercent: -50,
        duration: 0.45,
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
      { opacity: 0, y: 24, xPercent: -50, yPercent: -50 },
      {
        opacity: 1,
        y:       0,
        xPercent: -50,
        yPercent: -50,
        duration: 0.8,
        ease:    'power3.out',
        delay:   0.35,
        onComplete: () => setTimeout(showNext, 2600),
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
  // 3D Carousel is initialized and runs on its own animation loop
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

  if (!wrap || wrap.dataset.bound) return;
  wrap.dataset.bound = 'true';

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
  if (!cake) return;

  // Clear any existing candles
  const existing = cake.querySelectorAll('.candle');
  existing.forEach(c => c.remove());
  state.candles = [];

  // 8 candles arranged in a natural 3D curved perspective arc on the cake surface
  const count = 8;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1); // 0.0 to 1.0
    const x = 32 + t * 196;     // 32px to 228px across 260px cake
    const y = 34 + Math.sin(t * Math.PI) * 22; // natural curved arc on the icing

    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.style.left = `${x}px`;
    candle.style.top  = `${y}px`;

    const wick = document.createElement('div');
    wick.className = 'candle-wick';
    candle.appendChild(wick);

    const flame = document.createElement('div');
    flame.className = 'flame';
    flame.style.animationDelay = `${(Math.random() * 0.65).toFixed(2)}s`;
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

function initCakeInteraction() {
  const micBtn = document.getElementById('blowMicBtn');

  if (micBtn && !micBtn.dataset.bound) {
    micBtn.dataset.bound = 'true';
    micBtn.addEventListener('click', () => {
      requestMicAccess();
    });
  }
}

function startMicDetection() {
  initCakeInteraction();
}

function requestMicAccess() {
  const micBtn     = document.getElementById('blowMicBtn');
  const micBtnText = document.getElementById('blowMicBtnText');
  const instr      = document.getElementById('blowInstruction');

  if (micBtnText) micBtnText.textContent = 'Connecting to mic...';
  if (instr)      instr.textContent      = '🎙️ Please allow microphone access in your browser prompt';

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (micBtnText) micBtnText.textContent = '❌ Mic Not Supported';
    if (instr)      instr.textContent      = 'Your browser does not support microphone input.';
    return;
  }

  navigator.mediaDevices.getUserMedia({
    audio: {
      noiseSuppression: false,
      echoCancellation: false,
      autoGainControl: false,
      channelCount: 1
    }
  })
    .then(stream => {
      state.micStream = stream;
      if (micBtn)     micBtn.classList.add('listening');
      if (micBtnText) micBtnText.textContent = '🎙️ Mic Active — Blow Candles!';
      setupAudioAnalysis(stream);
    })
    .catch(err => {
      if (micBtn)     micBtn.classList.remove('listening');
      if (micBtnText) micBtnText.textContent = '⚠️ Mic Blocked — Click to Retry';
      if (instr)      instr.textContent      = 'Microphone access was blocked. Tap the button to try again.';
    });
}

function relightCandles(autoRestartMic = false) {
  state.candlesBlown = false;

  // 1. Relight all candles and clean up smoke / embers
  let candles = document.querySelectorAll('.candle');
  if (candles.length === 0) {
    buildCandles();
    candles = document.querySelectorAll('.candle');
  }
  candles.forEach((c) => {
    c.classList.remove('out');

    const wick = c.querySelector('.candle-wick');
    if (wick) wick.classList.remove('ember');

    c.querySelectorAll('.smoke-particle').forEach(s => s.remove());

    const flame = c.querySelector('.flame');
    if (flame) {
      flame.style.transform = '';
      flame.style.filter = '';
    }
  });

  // 2. Hide wish granted message
  const msg = document.getElementById('blownMessage');
  if (msg) msg.classList.remove('show');

  // 3. Reset button and instructions
  const micBtn     = document.getElementById('blowMicBtn');
  const micBtnText = document.getElementById('blowMicBtnText');
  const instr      = document.getElementById('blowInstruction');

  if (micBtn)     micBtn.classList.remove('listening');
  if (micBtnText) micBtnText.textContent = 'Enable Mic to Blow Candles';
  if (instr)      instr.textContent      = 'Click the button above to enable your mic, then blow to blow them out';

  if (autoRestartMic) {
    if (micBtnText) micBtnText.textContent = 'Connecting to mic...';
    if (instr)      instr.textContent      = '🎙️ Relighting candles and connecting mic...';
    requestMicAccess();
  }
}

function spawnCandleSmoke(candle) {
  const wick = candle.querySelector('.candle-wick');
  if (wick) wick.classList.add('ember');

  // Spawn 5 wisps of curling smoke
  const count = 5;
  for (let j = 0; j < count; j++) {
    setTimeout(() => {
      if (!state.candlesBlown) return;
      const smoke = document.createElement('div');
      smoke.className = 'smoke-particle';
      candle.appendChild(smoke);

      const driftX   = (Math.random() - 0.5) * 28 + (j % 2 === 0 ? 8 : -8);
      const riseY    = -34 - Math.random() * 45;
      const duration = 1.7 + Math.random() * 0.7;

      gsap.fromTo(smoke,
        { 
          x: (Math.random() - 0.5) * 4, 
          y: 0, 
          scale: 0.35, 
          opacity: 0.85 
        },
        { 
          x: driftX, 
          y: riseY, 
          scale: 2.2 + Math.random() * 1.0, 
          opacity: 0, 
          duration: duration, 
          ease: 'power1.out',
          onComplete: () => smoke.remove()
        }
      );
    }, j * 140);
  }
}

function setupAudioAnalysis(stream) {
  const instr = document.getElementById('blowInstruction');
  if (instr) instr.textContent = '🎙️ Calibrating...';

  try {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    state.analyser = state.audioCtx.createAnalyser();
    state.analyser.fftSize = 1024;
    state.analyser.smoothingTimeConstant = 0.1;

    const mic = state.audioCtx.createMediaStreamSource(stream);
    mic.connect(state.analyser);
    state.audioCtx.resume(); // Chrome sometimes suspends until interaction

    const buf    = new Uint8Array(state.analyser.fftSize);
    const flames = document.querySelectorAll('.flame');

    let blowAccum = 0;
    let sustained = 0;
    const NEEDED  = 1.0;

    let warmup   = 60;
    let rmsSum   = 0;
    let rmsFloor = 0.015;

    state.isListening = true;

    function getRMS() {
      state.analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const s = (buf[i] - 128) / 128;
        sum += s * s;
      }
      return Math.sqrt(sum / buf.length);
    }

    function detect() {
      if (!state.isListening || state.candlesBlown) return;
      const rms = getRMS();

      // Warmup: measure ambient noise floor
      if (warmup > 0) {
        rmsSum += rms;
        warmup--;
        if (warmup === 0) {
          // Cap floor at 0.040 — a normal blow produces rms 0.05–0.30,
          // so this is always detectable even in noisy rooms.
          rmsFloor = Math.min(0.040, Math.max(0.012, (rmsSum / 60) * 1.3));
          if (instr) instr.textContent = '🌬️ Blow gently onto your microphone to make a wish!';
        }
        requestAnimationFrame(detect);
        return;
      }

      // With AGC OFF: blow into mic → rms 0.05–0.40, speech at distance → rms 0.003–0.020
      const isBlowing = rms > rmsFloor;

      if (isBlowing) {
        sustained++;
        if (sustained >= 8) {
          const intensity = Math.min(2.0, (rms - rmsFloor) / 0.08);

          flames.forEach((flame, idx) => {
            flame.classList.add('blowing');
            const bend    = (idx % 2 === 0 ? 1 : -1) * (16 + intensity * 20);
            const spreadX = (1 + intensity * 0.7).toFixed(2);
            const squishY = Math.max(0.35, 1 - intensity * 0.4).toFixed(2);
            const shiftX  = ((idx % 2 === 0 ? 1 : -1) * intensity * 6).toFixed(1);
            flame.style.transform = `translate3d(${shiftX}px,0,0) skewX(${bend}deg) scale(${spreadX},${squishY})`;
          });

          blowAccum += 0.06 * Math.max(0.5, intensity);

          if (instr && blowAccum > 0.3 && !state.candlesBlown) {
            instr.textContent = '🌬️ Keep blowing! Fire is spreading... 💨';
            instr.style.color = 'var(--pink-light)';
          }

          if (blowAccum >= NEEDED) {
            flames.forEach(f => { f.classList.remove('blowing'); f.style.transform = ''; });
            stopMicDetection();
            blowCandles();
            return;
          }
        }
      } else {
        sustained = 0;
        blowAccum = Math.max(0, blowAccum - 0.07);
        flames.forEach(f => { f.classList.remove('blowing'); if (f.style.transform) f.style.transform = ''; });
        if (instr && blowAccum === 0 && !state.candlesBlown) {
          instr.textContent = '🌬️ Blow gently onto your microphone to make a wish!';
          instr.style.color = '';
        }
      }

      requestAnimationFrame(detect);
    }

    detect();

  } catch (e) {
    console.error('Audio setup error:', e);
    stopMicDetection();
    showFallbackButton();
  }
}



function blowCandles() {
  if (state.candlesBlown) return;
  state.candlesBlown = true;
  stopMicDetection();

  const micBtn     = document.getElementById('blowMicBtn');
  const micBtnText = document.getElementById('blowMicBtnText');
  const instr      = document.getElementById('blowInstruction');
  const msg        = document.getElementById('blownMessage');

  if (micBtn)     micBtn.classList.remove('listening');
  if (micBtnText) micBtnText.textContent = '✨ Candles Blown Out!';
  if (instr)      instr.textContent = 'All 24 candles extinguished! 🎂 Make a wish ❤️';

  // Extinguish candles staggered with realistic smoke wisps rising
  const candles = document.querySelectorAll('.candle');
  candles.forEach((c, i) => {
    setTimeout(() => {
      c.classList.add('out');
      spawnCandleSmoke(c);
    }, i * 90);
  });

  // Show wish granted
  setTimeout(() => {
    if (msg) msg.classList.add('show');
    // Auto-scroll to fireworks climax after 3.5s
    setTimeout(() => {
      if (state.candlesBlown) {
        const fw = document.getElementById('sec-fireworks');
        if (fw) fw.scrollIntoView({ behavior: 'smooth' });
      }
    }, 3500);
  }, 900);
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
  const btn = document.getElementById('letterEnvelopeBtn');
  const paper = document.getElementById('letterPaper');

  if (!btn || !paper || btn.dataset.bound) return;
  btn.dataset.bound = 'true';

  function openLetter() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;

    // Fade out button
    gsap.to(btn, {
      opacity: 0,
      scale: 0.94,
      y: -20,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => {
        btn.style.display = 'none';
        paper.style.display = 'block';

        // 3D fold out animation for letter paper card
        gsap.fromTo(paper,
          { y: 40, opacity: 0, rotateX: -25 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.1, ease: 'power3.out' }
        );

        // Staggered line animation
        const lines = paper.querySelectorAll('.letter-line');
        gsap.fromTo(lines,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.18, duration: 0.9, delay: 0.35, ease: 'power2.out' }
        );
      }
    });
  }

  btn.addEventListener('click', openLetter);
  btn.addEventListener('keydown', e => { if (e.key === 'Enter') openLetter(); });
}

// ================================================================
//  SECTION 10 — FINAL
// ================================================================
function initFinalButton() {
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn && !replayBtn.dataset.bound) {
    replayBtn.dataset.bound = 'true';
    replayBtn.addEventListener('click', replayExperience);
  }
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
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) replayBtn.style.pointerEvents = 'none';

  // Elegant dark transition curtain
  let curtain = document.getElementById('replayCurtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.id = 'replayCurtain';
    curtain.style.cssText = `
      position: fixed;
      inset: 0;
      background: #08040d;
      z-index: 999999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.45s ease;
    `;
    document.body.appendChild(curtain);
  }

  // 1. Fade smoothly to dark
  curtain.style.pointerEvents = 'all';
  curtain.style.opacity = '1';

  setTimeout(() => {
    // 2. Stop ongoing animations & detection
    state.fireworksBig = false;
    if (state.fireworksBigId) cancelAnimationFrame(state.fireworksBigId);
    stopMicDetection();
    if (state.loveTimer) clearTimeout(state.loveTimer);

    // 3. Reset state flags
    state.herPlayed      = false;
    state.lovePlayed     = false;
    state.eightPlayed    = false;
    state.giftOpened     = false;
    state.envelopeOpened = false;
    state.cakeReady      = false;

    // 4. Reset DOM elements & sections
    // --- Section 2: Her lines ---
    document.querySelectorAll('.her-line').forEach(l => gsap.set(l, { opacity: 0, y: 22 }));

    // --- Section 4: Love points ---
    const loveDisplay = document.getElementById('loveDisplay');
    if (loveDisplay) loveDisplay.innerHTML = '';
    const loveTitle = document.getElementById('loveTitle');
    if (loveTitle) gsap.set(loveTitle, { opacity: 0 });
    document.querySelectorAll('.love-dot').forEach((d, i) => d.classList.toggle('active', i === 0));

    // --- Section 5: Eight poem ---
    document.querySelectorAll('.eight-line').forEach(l => gsap.set(l, { opacity: 0, y: 14 }));

    // --- Section 6: Gift box ---
    const lid = document.getElementById('giftLid');
    if (lid) lid.classList.remove('open');
    const giftReveal = document.getElementById('giftReveal');
    if (giftReveal) { giftReveal.style.display = 'none'; gsap.set(giftReveal, { opacity: 0, y: 24 }); }
    const giftWrap = document.getElementById('gift-wrap');
    if (giftWrap) gsap.set(giftWrap, { filter: 'none' });
    const giftHint = document.getElementById('giftHint');
    if (giftHint) gsap.set(giftHint, { opacity: 1 });

    // --- Section 7: Cake & Candles ---
    relightCandles(false);

    // --- Section 8: Fireworks ---
    const amnaName = document.getElementById('fwAmnaName');
    if (amnaName) gsap.set(amnaName, { opacity: 0, scale: 0.88 });
    document.querySelectorAll('.fw-line').forEach(l => gsap.set(l, { opacity: 0, y: 16 }));
    const fwCanvas = document.getElementById('fireworks-canvas');
    if (fwCanvas) {
      const ctx = fwCanvas.getContext('2d');
      ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    }

    // --- Section 9: Envelope ---
    const letterBtn = document.getElementById('letterEnvelopeBtn');
    if (letterBtn) {
      letterBtn.style.display = '';
      gsap.set(letterBtn, { opacity: 1, scale: 1, y: 0 });
    }
    const letterPaper = document.getElementById('letterPaper');
    if (letterPaper) {
      letterPaper.style.display = 'none';
      gsap.set(letterPaper, { opacity: 0, y: 40 });
    }

    // --- Section 10: Final ---
    const finalHeadline = document.querySelector('.final-headline');
    const finalSubline  = document.querySelector('.final-subline');
    const finalClosing  = document.querySelector('.final-closing');
    const finalPhoto    = document.querySelector('.final-photo');
    if (finalHeadline) gsap.set(finalHeadline, { opacity: 0, scale: 0.88, y: 20 });
    if (finalSubline)  gsap.set(finalSubline,  { opacity: 0, y: 18 });
    if (finalClosing)  gsap.set(finalClosing,  { opacity: 0, y: 18 });
    if (finalPhoto)    gsap.set(finalPhoto,    { opacity: 0, y: 30 });
    if (replayBtn) {
      gsap.set(replayBtn, { opacity: 0 });
      replayBtn.style.pointerEvents = '';
    }
    document.querySelectorAll('.final-pre, .final-pre2').forEach(el => el.classList.remove('revealed'));

    // Reset all scroll reveals
    document.querySelectorAll('.reveal-scroll.revealed').forEach(el => el.classList.remove('revealed'));
    document.querySelectorAll('.gift-intro-line.revealed').forEach(el => el.classList.remove('revealed'));

    // --- Music restart ---
    const music = document.getElementById('bgMusic');
    if (music) {
      music.currentTime = 0;
      music.play()
        .then(() => { state.musicPlaying = true; setMusicIcon(true); })
        .catch(() => {});
    }

    // 5. Instantly jump scroll position to top while curtain is solid
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 6. Re-init observers now that scroll is firmly at top
    initScrollObservers();

    // 7. Fade curtain out smoothly
    setTimeout(() => {
      curtain.style.opacity = '0';
      curtain.style.pointerEvents = 'none';
    }, 200);

  }, 480);
}
