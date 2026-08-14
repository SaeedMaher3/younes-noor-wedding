const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;
let autoScrollActive = false;


// ============================
// Music
// ============================

function updateMusicButton(isPlaying) {
  if (isPlaying) {
    musicText.textContent = 'إيقاف الموسيقى';
    musicIcon.textContent = '❚❚';
  } else {
    musicText.textContent = 'تشغيل الموسيقى';
    musicIcon.textContent = '♪';
  }
}


async function startMusic() {
  try {
    music.volume = 0.45;

    await music.play();

    updateMusicButton(true);
  } catch (error) {
    console.log('المتصفح منع تشغيل الموسيقى تلقائيًا');

    updateMusicButton(false);
  }
}


function stopMusic() {
  music.pause();
  updateMusicButton(false);
}


musicButton.addEventListener('click', async () => {

  if (music.paused) {
    await startMusic();
  } else {
    stopMusic();
  }

});


// ============================
// Open invitation automatically
// ============================

function openInvitation() {

  if (opened) return;

  opened = true;

  // حركة فتح الظرف
  opening.classList.add('is-opening');

  // نحاول تشغيل الموسيقى
  startMusic();

  setTimeout(() => {

    opening.classList.add('is-hidden');

    site.setAttribute('aria-hidden', 'false');
    site.classList.add('is-visible');

    document.body.classList.add('invitation-open');

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });

  }, 1800);


  // نبدأ النزول التلقائي
  setTimeout(() => {

    startAutoScroll();

  }, 3200);

}


// ============================
// Auto Scroll
// ============================

function startAutoScroll() {

  if (autoScrollActive) return;

  autoScrollActive = true;

  const scrollSpeed = 0.65;

  function scrollFrame() {

    if (!autoScrollActive) return;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (window.scrollY >= maxScroll - 2) {

      autoScrollActive = false;

      return;

    }

    window.scrollBy({
      top: scrollSpeed,
      left: 0
    });

    requestAnimationFrame(scrollFrame);
  }

  requestAnimationFrame(scrollFrame);
}


// ============================
// Start automatically
// ============================

window.addEventListener('load', () => {

  window.scrollTo(0, 0);

  setTimeout(() => {

    openInvitation();

  }, 1800);

});


// ============================
// Countdown
// ============================

const weddingDate =
  new Date('2026-09-08T20:30:00+03:00').getTime();


function updateCountdown() {

  const now = new Date().getTime();

  const distance = weddingDate - now;

  if (distance <= 0) {

    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';

    return;
  }


  const days =
    Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours =
    Math.floor(
      (distance % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (distance % (1000 * 60 * 60)) /
      (1000 * 60)
    );

  const seconds =
    Math.floor(
      (distance % (1000 * 60)) /
      1000
    );


  document.getElementById('days').textContent =
    String(days).padStart(2, '0');

  document.getElementById('hours').textContent =
    String(hours).padStart(2, '0');

  document.getElementById('minutes').textContent =
    String(minutes).padStart(2, '0');

  document.getElementById('seconds').textContent =
    String(seconds).padStart(2, '0');

}


updateCountdown();

setInterval(updateCountdown, 1000);