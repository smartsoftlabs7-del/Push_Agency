/**
 * PUSH AGENCY - Experiential Marketing & Retail Activations
 * High-Energy Futuristic Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initMagneticCursor();
  initAmbientCanvas();
  initHeaderScroll();
  initMobileMenu();
  initPortfolioGallery();
  init3DCardTilt();
  initDataCaptureFunnel();
  initTelemetryLiveUpdates();
  initWhatsAppWidget();
  initSoundEffects();
  initSmoothScrollLinks();
});

/* ==========================================================================
   1. MAGNETIC CUSTOM CURSOR
   ========================================================================== */
function initMagneticCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  // Track position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp loop
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.9;
    cursorY += (mouseY - cursorY) * 0.9;
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Magnetic attraction on interactive elements
  const targets = document.querySelectorAll('.magnetic-target, a, button, input, select, .option-card, .chip, .kpi-checkbox');
  targets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      playSound('hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      el.style.transform = '';
    });

    // Magnetic pull calculation on specific targets
    el.addEventListener('mousemove', (e) => {
      if (el.classList.contains('magnetic-target')) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    });
  });
}

/* ==========================================================================
   2. AMBIENT CANVAS (NEON PARTICLES & CYBER GRID EFFECT)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width < 768 ? 20 : 45, 60);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(255, 0, 85, 0.4)' : 'rgba(0, 240, 255, 0.35)',
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Render connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0) p1.x = width;
      if (p1.x > width) p1.x = 0;
      if (p1.y < 0) p1.y = height;
      if (p1.y > height) p1.y = 0;

      ctx.fillStyle = p1.color;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.strokeStyle = `rgba(255, 0, 85, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ==========================================================================
   3. HEADER SCROLL & MOBILE MENU
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    playSound('click');
  });

  const links = drawer.querySelectorAll('.mobile-nav-link');
  links.forEach((l) => {
    l.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   4. DYNAMIC 3D HORIZONTALLY SCROLLING PORTFOLIO GALLERY
   WITH HOVER VIDEO PLAYBACK MICRO-INTERACTIONS
   ========================================================================== */
function initPortfolioGallery() {
  const wrapper = document.getElementById('portfolio-scroll-wrapper');
  const track = document.getElementById('portfolio-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const progressBar = document.getElementById('gallery-progress');
  const projectCards = document.querySelectorAll('.project-card');

  if (!wrapper || !track) return;

  // Video hover micro-interaction playback
  projectCards.forEach((card) => {
    const video = card.querySelector('.project-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      // Lazy load video src if not set
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      card.classList.add('video-active');
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback gracefully on autoplay restrictions
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('video-active');
      video.pause();
      video.currentTime = 0;
    });
  });

  // Prev / Next button scrolling
  const scrollAmount = 450;
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      playSound('click');
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      playSound('click');
    });
  }

  // Update Progress Bar
  wrapper.addEventListener('scroll', () => {
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    if (maxScroll > 0 && progressBar) {
      const percentage = (wrapper.scrollLeft / maxScroll) * 100;
      progressBar.style.width = `${Math.min(Math.max(percentage, 15), 100)}%`;
    }
  });

  // Drag-to-scroll feature
  let isDown = false;
  let startX;
  let scrollLeft;

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    wrapper.classList.add('active');
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => {
    isDown = false;
  });
  wrapper.addEventListener('mouseup', () => {
    isDown = false;
  });
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.6;
    wrapper.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   5. 3D CARD TILT EFFECT (CSS TRANSFORM PERSPECTIVE)
   ========================================================================== */
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.3d-tilt');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE DATA-CAPTURE FUNNEL (MOCKUP & INSTANT ESTIMATOR)
   ========================================================================== */
function initDataCaptureFunnel() {
  const steps = document.querySelectorAll('.funnel-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepLines = document.querySelectorAll('.step-line');
  const nextBtns = document.querySelectorAll('.funnel-next-btn');
  const prevBtns = document.querySelectorAll('.funnel-prev-btn');

  // Form elements & inputs
  const staffRange = document.getElementById('staff-range');
  const staffDisplay = document.getElementById('staff-count-display');
  const durationRange = document.getElementById('duration-range');
  const durationDisplay = document.getElementById('duration-display');
  const marketChips = document.querySelectorAll('.chip');
  const kpiCheckboxes = document.querySelectorAll('.kpi-checkbox');
  const previewEngagements = document.getElementById('preview-engagements');
  const summaryText = document.getElementById('summary-text');
  const funnelForm = document.getElementById('funnel-form');
  const successScreen = document.getElementById('funnel-success');
  const resetBtn = document.getElementById('reset-funnel-btn');

  let currentStep = 1;

  // Funnel State Object
  const funnelState = {
    type: 'Retail In-Store Sampling',
    markets: ['New York', 'Los Angeles', 'Chicago'],
    staffPerMarket: 8,
    durationDays: 3,
    kpis: ['High-Volume Sampling', 'Digital Lead & Email Capture', 'Social Media & TikTok UGC'],
  };

  // Step 1: Radio Card Selection
  const optionCards = document.querySelectorAll('.option-card');
  optionCards.forEach((card) => {
    card.addEventListener('click', () => {
      optionCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const title = card.querySelector('h4').textContent;
      funnelState.type = title;
      updateSummary();
      playSound('click');
    });
  });

  // Step 2: Market Chip Selection
  marketChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const market = chip.dataset.market;
      if (chip.classList.contains('active')) {
        if (!funnelState.markets.includes(market)) funnelState.markets.push(market);
      } else {
        funnelState.markets = funnelState.markets.filter((m) => m !== market);
      }
      updateSummary();
      playSound('click');
    });
  });

  // Step 2: Staff & Duration Sliders
  if (staffRange && staffDisplay) {
    staffRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      staffDisplay.textContent = `${val} Ambassador${val > 1 ? 's' : ''}`;
      funnelState.staffPerMarket = val;
      updateSummary();
    });
  }

  if (durationRange && durationDisplay) {
    durationRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      durationDisplay.textContent = `${val} Day${val > 1 ? 's' : ''}`;
      funnelState.durationDays = val;
      updateSummary();
    });
  }

  // Step 3: KPI Selection
  kpiCheckboxes.forEach((kpi) => {
    kpi.addEventListener('click', (e) => {
      const checkbox = kpi.querySelector('input');
      kpi.classList.toggle('active', checkbox.checked);
      playSound('click');
    });
  });

  // Step Navigation
  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next);
      goToStep(nextStep);
      playSound('click');
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev);
      goToStep(prevStep);
      playSound('click');
    });
  });

  function goToStep(stepNum) {
    currentStep = stepNum;

    // Toggle panels
    steps.forEach((step) => step.classList.remove('active'));
    const targetStep = document.getElementById(`step-${stepNum}`);
    if (targetStep) targetStep.classList.add('active');

    // Update indicators
    stepIndicators.forEach((ind) => {
      const stepIdx = parseInt(ind.dataset.step);
      ind.classList.remove('active');
      if (stepIdx === stepNum) {
        ind.classList.add('active');
      } else if (stepIdx < stepNum) {
        ind.classList.add('completed');
      }
    });

    stepLines.forEach((line, idx) => {
      if (idx < stepNum - 1) {
        line.classList.add('active');
      } else {
        line.classList.remove('active');
      }
    });

    updateSummary();
  }

  function updateSummary() {
    const marketCount = Math.max(funnelState.markets.length, 1);
    const totalStaff = marketCount * funnelState.staffPerMarket;
    const estImpressions = totalStaff * funnelState.durationDays * 1850;

    if (previewEngagements) {
      previewEngagements.textContent = `${estImpressions.toLocaleString()}+ Live Engagements`;
    }

    if (summaryText) {
      summaryText.textContent = `${funnelState.type} • ${marketCount} Market${marketCount > 1 ? 's' : ''} • ${totalStaff} Total Brand Ambassadors • ${funnelState.durationDays} Days Duration`;
    }
  }

  // Submit Funnel Form
  if (funnelForm) {
    funnelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      funnelForm.style.display = 'none';
      if (successScreen) {
        successScreen.classList.add('active');
      }
      playSound('success');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successScreen) successScreen.classList.remove('active');
      if (funnelForm) funnelForm.style.display = 'block';
      goToStep(1);
    });
  }
}

/* ==========================================================================
   7. LIVE TELEMETRY COUNTER FLUCTUATIONS
   ========================================================================== */
function initTelemetryLiveUpdates() {
  const metricSamples = document.getElementById('metric-samples');
  let currentSamples = 348920;

  setInterval(() => {
    if (metricSamples) {
      currentSamples += Math.floor(Math.random() * 8) + 2;
      metricSamples.textContent = currentSamples.toLocaleString();
    }
  }, 3200);
}

/* ==========================================================================
   8. WHATSAPP FLOATING WIDGET & AUTO-INVITATION
   ========================================================================== */
function initWhatsAppWidget() {
  const trigger = document.getElementById('whatsapp-trigger');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('wa-close-btn');

  if (!trigger || !popup) return;

  trigger.addEventListener('click', () => {
    popup.classList.toggle('open');
    playSound('click');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.classList.remove('open');
    });
  }

  // Gentle auto-open invitation after 8 seconds
  setTimeout(() => {
    if (!popup.classList.contains('open')) {
      popup.classList.add('open');
    }
  }, 8000);
}

/* ==========================================================================
   9. SOUND EFFECTS MICRO-INTERACTIONS (WEB AUDIO API SYNTHESIZER)
   ========================================================================== */
let soundEnabled = true;

function initSoundEffects() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('active', soundEnabled);
    if (soundIcon) {
      soundIcon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
      lucide.createIcons();
    }
    if (soundEnabled) playSound('click');
  });
}

function playSound(type) {
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.04);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    // Graceful fallback if AudioContext is prevented by autoplay policy
  }
}

/* ==========================================================================
   10. SMOOTH SCROLLING FOR NAVIGATION LINKS
   ========================================================================== */
function initSmoothScrollLinks() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}
