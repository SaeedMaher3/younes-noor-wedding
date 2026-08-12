
const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');
const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;

function startMusic() {
  music.volume = 0.45;
  const playPromise = music.play();
  if (playPromise) {
    playPromise.then(() => {
      musicText.textContent = 'إيقاف الموسيقى';
      musicIcon.textContent = '❚❚';
    }).catch(() => {
      musicText.textContent = 'تشغيل الموسيقى';
      musicIcon.textContent = '♪';
    });
  }
}

envelope.addEventListener('click', () => {
  if (opened) return;
  opened = true;
  envelope.classList.add('open');

  setTimeout(() => startMusic(), 420);

  setTimeout(() => {
    opening.classList.add('is-gone');
    site.classList.add('is-visible');
    site.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'auto';
  }, 1450);
});

musicButton.addEventListener('click', () => {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    musicText.textContent = 'تشغيل الموسيقى';
    musicIcon.textContent = '♪';
  }
});

// موعد الزفاف حسب توقيت الأردن (+03:00)
const weddingDate = new Date('2026-09-08T20:30:00+03:00').getTime();

function updateCountdown() {
  const now = Date.now();
  let diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div style="grid-column:1/-1"><strong>مبارك للعروسين ♡</strong><span>بدأت ليلة الفرح</span></div>';
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  document.getElementById('days').textContent = Math.floor(diff / day);
  diff %= day;
  document.getElementById('hours').textContent = String(Math.floor(diff / hour)).padStart(2, '0');
  diff %= hour;
  document.getElementById('minutes').textContent = String(Math.floor(diff / minute)).padStart(2, '0');
  diff %= minute;
  document.getElementById('seconds').textContent = String(Math.floor(diff / 1000)).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
