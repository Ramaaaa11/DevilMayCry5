'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Local soundtrack: playback starts only after a deliberate click, as browsers block autoplay.
const backgroundMusic = $('#backgroundMusic');
const musicToggle = $('#musicToggle');
const musicState = $('#musicState');
const musicPower = $('#musicPower');
const musicVolume = $('#musicVolume');
if (backgroundMusic && musicToggle) {
  backgroundMusic.volume = Number(musicVolume?.value ?? 0.45);
  const paintMusicState = (playing) => {
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Matikan musik' : 'Nyalakan musik');
    musicState.textContent = playing ? 'MUSIC ON' : 'MUSIC OFF';
    musicPower.textContent = playing ? '●' : '○';
    document.body.classList.toggle('music-on', playing);
  };
  musicToggle.addEventListener('click', async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        paintMusicState(true);
      } catch (error) {
        musicState.textContent = 'TRY AGAIN';
        musicToggle.setAttribute('aria-pressed', 'false');
        console.warn('Browser tidak mengizinkan pemutaran audio:', error);
      }
    } else {
      backgroundMusic.pause();
      paintMusicState(false);
    }
  });
  musicVolume?.addEventListener('input', () => { backgroundMusic.volume = Number(musicVolume.value); });
  backgroundMusic.addEventListener('play', () => paintMusicState(true));
  backgroundMusic.addEventListener('pause', () => paintMusicState(false));
  backgroundMusic.addEventListener('error', () => { musicState.textContent = 'AUDIO ERROR'; });
  paintMusicState(false);
}

// Impact FX for actions: brief screen flash, slash and decorative crimson splatter.
const screenImpact = $('#screenImpact');
const pulseScreenImpact = (shake = false) => {
  if (screenImpact) {
    screenImpact.classList.remove('active');
    void screenImpact.offsetWidth;
    screenImpact.classList.add('active');
  }
  if (shake && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.remove('screen-shake');
    void document.body.offsetWidth;
    document.body.classList.add('screen-shake');
    window.setTimeout(() => document.body.classList.remove('screen-shake'), 320);
  }
};
const spawnCombatFx = (x, y, heavy = false) => {
  const slash = document.createElement('span');
  slash.className = 'slash-effect';
  slash.style.left = `${x}px`;
  slash.style.top = `${y}px`;
  slash.style.transform = `translate(-50%,-50%) rotate(${Math.random() * 24 - 45}deg) scaleX(.02)`;
  document.body.append(slash);
  window.setTimeout(() => slash.remove(), 480);
  const splatter = document.createElement('span');
  splatter.className = 'blood-splatter';
  splatter.style.left = `${x + (Math.random() * 52 - 26)}px`;
  splatter.style.top = `${y + (Math.random() * 40 - 20)}px`;
  splatter.style.setProperty('--splat-size', `${heavy ? 150 : 85 + Math.random() * 55}px`);
  splatter.style.setProperty('--splat-rotation', `${Math.round(Math.random() * 360)}deg`);
  document.body.append(splatter);
  window.setTimeout(() => splatter.remove(), 760);
  if (heavy) pulseScreenImpact(true);
};

// Preloader
window.addEventListener('load', () => {
  window.setTimeout(() => document.body.classList.remove('is-loading'), 850);
}, { once: true });
window.setTimeout(() => document.body.classList.remove('is-loading'), 2200); // Fallback for slow font/CDN loading.

// Scroll progress bar
const scrollProgress = $('#scrollProgress');
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Reveal elements on scroll; visible by default if IntersectionObserver is unavailable.
const revealElements = $$('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Smooth-scrolling action buttons.
$$('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = $(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});

// Mobile navigation.
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka navigasi');
  mainNav.classList.remove('nav-open');
};
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Tutup navigasi' : 'Buka navigasi');
  mainNav.classList.toggle('nav-open', opening);
});
$$('.nav-link').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

// Active navigation state linked to sections.
const navLinks = $$('.nav-link');
const navSections = navLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-28% 0px -60% 0px', threshold: 0 });
  navSections.forEach((section) => sectionObserver.observe(section));
}

// Devil Trigger: boosts red highlights and the ember field.
const triggerBtn = $('#triggerBtn');
const triggerLabel = $('#triggerLabel');
triggerBtn.setAttribute('aria-pressed', 'false');
triggerBtn.addEventListener('click', () => {
  const active = !document.body.classList.contains('devil-trigger');
  document.body.classList.toggle('devil-trigger', active);
  triggerBtn.setAttribute('aria-pressed', String(active));
  triggerLabel.textContent = active ? 'TRIGGER ACTIVE' : 'DEVIL TRIGGER';
});

// Character dossiers.
const hunters = {
  nero: {
    number: '01', name: 'NERO', letter: 'N', color: '#6dd7ff', category: 'THE DEVIL BREAKER', tagline: 'A rebel with a reason.',
    description: 'Young, brash, and armed with a mechanical arm built to break demons. Nero fights with heart first—and asks questions later.',
    weapon: 'RED QUEEN', specialty: 'AGGRESSIVE / CLOSE', quote: '“I’ll show you what real power looks like.”', stats: [85, 78, 92]
  },
  dante: {
    number: '02', name: 'DANTE', letter: 'D', color: '#f04b4e', category: 'THE LEGENDARY DEVIL HUNTER', tagline: 'The party never ends.',
    description: 'A wisecracking veteran who turns every demon encounter into a performance. A huge arsenal and instinctive combat style make him dangerously unpredictable.',
    weapon: 'DEVIL SWORD DANTE', specialty: 'VERSATILE / COMBO', quote: '“Let’s rock, baby!”', stats: [94, 89, 99]
  },
  v: {
    number: '03', name: 'V', letter: 'V', color: '#bd91ff', category: 'THE MYSTERIOUS POET', tagline: 'Power takes many forms.',
    description: 'A quiet, enigmatic summoner who fights through demonic familiars. He must get close to finish a weakened foe with his cane.',
    weapon: 'CANE & FAMILIARS', specialty: 'TACTICAL / SUMMON', quote: '“The path is clear. We must go.”', stats: [72, 76, 88]
  },
  vergil: {
    number: '04', name: 'VERGIL', letter: 'V', color: '#83a9ff', category: 'THE PURSUIT OF POWER', tagline: 'Cut through everything.',
    description: 'Cold, precise, and relentless. A master swordsman whose control of the Yamato makes every movement feel deliberate—and every strike decisive.',
    weapon: 'YAMATO', specialty: 'PRECISION / SPEED', quote: '“I need more power.”', stats: [96, 98, 95]
  }
};

const hunterButtons = $$('.hunter-option');
const hunterStage = $('#hunterStage');
const hunterFields = {
  code: $('#stageCode'), category: $('#stageCategory'), name: $('#stageName'), tagline: $('#stageTagline'),
  description: $('#stageDescription'), weapon: $('#stageWeapon'), specialty: $('#stageSpecialty'), quote: $('#stageQuote'),
  watermark: $('#stageWatermark'), sigil: $('#hunterSigil'), stats: $$('#stageStats .stat')
};
const portraitSources = {
  nero: 'assets/nero.webp', dante: 'assets/dante.webp', v: 'assets/v.webp', vergil: 'assets/vergil.webp'
};
const renderHunter = (key) => {
  const hunter = hunters[key];
  if (!hunter) return;
  hunterButtons.forEach((button) => {
    const selected = button.dataset.hunter === key;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  hunterStage.style.setProperty('--hunter-color', hunter.color);
  const portrait = $('#hunterPortrait');
  if (portrait) {
    portrait.alt = hunter.name === 'V' ? 'V — Devil May Cry 5' : `${hunter.name} — Devil May Cry 5`;
    portrait.src = portraitSources[key];
    hunterStage.classList.remove('portrait-refresh');
    void hunterStage.offsetWidth;
    hunterStage.classList.add('portrait-refresh');
    window.setTimeout(() => hunterStage.classList.remove('portrait-refresh'), 620);
  }
  hunterFields.code.textContent = `SUBJECT / ${hunter.number}`;
  hunterFields.category.textContent = hunter.category;
  hunterFields.name.innerHTML = `${hunter.name}<span>.</span>`;
  hunterFields.tagline.textContent = hunter.tagline;
  hunterFields.description.textContent = hunter.description;
  hunterFields.weapon.textContent = hunter.weapon;
  hunterFields.specialty.textContent = hunter.specialty;
  hunterFields.quote.textContent = hunter.quote;
  hunterFields.watermark.textContent = hunter.letter;
  hunterFields.sigil.querySelector('b').textContent = hunter.letter;
  hunterFields.stats.forEach((stat, index) => {
    const value = hunter.stats[index];
    stat.querySelector('.stat-label b').textContent = String(value);
    stat.querySelector('.stat-track i').style.setProperty('--value', `${value}%`);
  });
};
hunterButtons.forEach((button, index) => {
  button.addEventListener('click', () => renderHunter(button.dataset.hunter));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + hunterButtons.length) % hunterButtons.length;
    hunterButtons[nextIndex].focus();
    renderHunter(hunterButtons[nextIndex].dataset.hunter);
  });
});

// The four portrait cards jump to the dossier and select the matching hunter.
$$('[data-hunter-link]').forEach((card) => {
  card.addEventListener('click', () => {
    renderHunter(card.dataset.hunterLink);
    $('#hunters').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});

// Combat FX on selected interactive elements, not on every page click.
document.addEventListener('click', (event) => {
  const target = event.target.closest('#comboBtn, #triggerBtn, .hunter-option, .roster-card, [data-open-mission], #dialogEnter');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
  const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;
  const heavy = target.id === 'comboBtn' || target.id === 'triggerBtn';
  spawnCombatFx(x || rect.left + rect.width / 2, y || rect.top + rect.height / 2, heavy);
});

// Combo simulator: build score and rank up from D to SSS.
const rankTiers = [
  { min: 1400, rank: 'SSS', title: 'SSS — SMOKIN’ SEXY STYLE!!', message: 'A flawless storm of style. The city will talk about this one.' },
  { min: 1000, rank: 'SS', title: 'SS — SMOKIN’ STYLE!', message: 'A masterclass in controlled chaos.' },
  { min: 720, rank: 'S', title: 'S — SMOKIN’!', message: 'Sharp, stylish, and seriously dangerous.' },
  { min: 480, rank: 'A', title: 'A — AWESOME!', message: 'You are starting to make this look easy.' },
  { min: 280, rank: 'B', title: 'B — BADASS!', message: 'Good rhythm. Keep the combo alive.' },
  { min: 120, rank: 'C', title: 'C — CRAZY!', message: 'Not bad. Try mixing up your moves.' },
  { min: 0, rank: 'D', title: 'D — DULL', message: 'Every legend starts somewhere.' }
];
let comboScore = 0;
let comboCount = 0;
const rankLetter = $('#rankLetter');
const rankTitle = $('#rankTitle');
const rankMessage = $('#rankMessage');
const scoreValue = $('#scoreValue');
const rankMeterFill = $('#rankMeterFill');
const consoleHint = $('#consoleHint');
const comboBtn = $('#comboBtn');
const resetCombo = $('#resetCombo');
const getRank = (score) => rankTiers.find((tier) => score >= tier.min) || rankTiers[rankTiers.length - 1];
const updateRank = () => {
  const tier = getRank(comboScore);
  rankLetter.textContent = tier.rank;
  rankLetter.classList.toggle('rank-hot', comboScore >= 720);
  rankLetter.classList.remove('rank-pop');
  // Trigger a short rank animation after updating the display.
  void rankLetter.offsetWidth;
  rankLetter.classList.add('rank-pop');
  rankTitle.textContent = tier.title;
  rankMessage.textContent = tier.message;
  scoreValue.textContent = String(comboScore).padStart(4, '0');
  rankMeterFill.style.width = `${Math.min(100, (comboScore / 1400) * 100)}%`;
};
comboBtn.addEventListener('click', () => {
  comboCount += 1;
  const gain = [95, 135, 115, 180, 145, 210][(comboCount - 1) % 6];
  const previousRank = getRank(comboScore).rank;
  comboScore = Math.min(1600, comboScore + gain);
  updateRank();
  const currentRank = getRank(comboScore).rank;
  consoleHint.textContent = comboScore >= 1600
    ? 'MAXIMUM STYLE! Simulation score capped at 1600.'
    : currentRank !== previousRank
      ? `RANK UP! ${previousRank} → ${currentRank} · Combo chain x${comboCount}`
      : `HIT CONFIRMED +${gain} · Combo chain x${comboCount}`;
  if (comboScore >= 1400) rankLetter.classList.add('rank-hot');
});
resetCombo.addEventListener('click', () => {
  comboScore = 0;
  comboCount = 0;
  updateRank();
  consoleHint.textContent = 'Simulation reset. Time to make some noise.';
});
updateRank();

// Mission details dialog.
const missionDialog = $('#missionDialog');
const dialogClose = $('#dialogClose');
const openMissionButtons = $$('[data-open-mission]');
const closeDialog = () => { if (missionDialog.open) missionDialog.close(); };
openMissionButtons.forEach((button) => button.addEventListener('click', () => {
  if (typeof missionDialog.showModal === 'function') missionDialog.showModal();
  else window.alert('MISSION ACCEPTED. Reach the Hellgate and eliminate hostile demons.');
}));
dialogClose.addEventListener('click', closeDialog);
$('#dialogEnter').addEventListener('click', () => {
  closeDialog();
  $('#hunters').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
missionDialog.addEventListener('click', (event) => {
  if (event.target === missionDialog) closeDialog();
});

// Light custom cursor aura for mouse devices.
const cursorAura = $('#cursorAura');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    cursorAura.style.left = `${event.clientX}px`;
    cursorAura.style.top = `${event.clientY}px`;
    document.body.classList.add('cursor-ready');
  }, { passive: true });
  $$('a, button, summary').forEach((element) => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Slight mouse parallax gives the hero artwork depth without affecting touch devices.
const hero = $('.hero');
const heroArt = $('.hero-art');
if (hero && heroArt && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('mousemove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const px = ((event.clientX - bounds.left) / bounds.width - 0.5) * -13;
    const py = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
    heroArt.style.setProperty('--parallax-x', `${px.toFixed(1)}px`);
    heroArt.style.setProperty('--parallax-y', `${py.toFixed(1)}px`);
  }, { passive: true });
  hero.addEventListener('mouseleave', () => {
    heroArt.style.setProperty('--parallax-x', '0px');
    heroArt.style.setProperty('--parallax-y', '0px');
  });
}

// Optional keyboard shortcuts: M toggles the supplied soundtrack, T toggles Devil Trigger.
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
  if (event.key.toLowerCase() === 'm') musicToggle?.click();
  if (event.key.toLowerCase() === 't') triggerBtn?.click();
});

// Canvas embers. Automatically scales to the viewport and respects reduced-motion preferences.
const canvas = $('#embers');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let canvasWidth = 0;
let canvasHeight = 0;
let emberParticles = [];
const randomBetween = (min, max) => Math.random() * (max - min) + min;
const resizeCanvas = () => {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = Math.floor(canvasWidth * pixelRatio);
  canvas.height = Math.floor(canvasHeight * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const amount = Math.min(95, Math.max(28, Math.floor((canvasWidth * canvasHeight) / 18000)));
  emberParticles = Array.from({ length: amount }, () => ({
    x: randomBetween(0, canvasWidth), y: randomBetween(0, canvasHeight),
    size: randomBetween(.5, 2), speed: randomBetween(.15, .75), drift: randomBetween(-.25, .25),
    alpha: randomBetween(.18, .8), phase: randomBetween(0, Math.PI * 2)
  }));
};
const drawEmbers = (time = 0) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const boosted = document.body.classList.contains('devil-trigger');
  emberParticles.forEach((particle) => {
    if (!reducedMotion) {
      particle.y -= particle.speed * (boosted ? 2.2 : 1);
      particle.x += particle.drift * (boosted ? 1.6 : 1);
      particle.phase += .02;
      if (particle.y < -5) { particle.y = canvasHeight + 5; particle.x = randomBetween(0, canvasWidth); }
      if (particle.x < -5) particle.x = canvasWidth + 5;
      if (particle.x > canvasWidth + 5) particle.x = -5;
    }
    const alpha = particle.alpha * (.65 + .35 * Math.sin(particle.phase + time * .0005));
    ctx.beginPath();
    ctx.fillStyle = boosted ? `rgba(255, ${Math.round(56 + alpha * 38)}, ${Math.round(42 + alpha * 18)}, ${Math.min(1, alpha)})` : `rgba(220, ${Math.round(65 + alpha * 35)}, 48, ${Math.min(.9, alpha)})`;
    ctx.arc(particle.x, particle.y, particle.size * (boosted ? 1.25 : 1), 0, Math.PI * 2);
    ctx.fill();
  });
  if (!reducedMotion) window.requestAnimationFrame(drawEmbers);
};
resizeCanvas();
drawEmbers();
window.addEventListener('resize', resizeCanvas, { passive: true });
