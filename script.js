const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;
let autoScrollStarted = false;


// ============================
// Music
// ============================

function updateMusicButton(isPlaying) {
  if (!musicText || !musicIcon) return;

  if (isPlaying) {
    musicText.textContent = 'إيقاف الموسيقى';
    musicIcon.textContent = '❚❚';
  } else {
    musicText.textContent = 'تشغيل الموسيقى';
    musicIcon.textContent = '♪';
  }
}


async function startMusic() {
  if (!music) return;

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
  if (!music) return;

  music.pause();
  updateMusicButton(false);
}


if (musicButton) {
  musicButton.addEventListener('click', async () => {
    if (!music) return;

    if (music.paused) {
      await startMusic();
    } else {
      stopMusic();
    }
  });
}


// ============================
// Open Invitation Automatically
// ============================

function openInvitation() {

  if (opened) return;

  opened = true;

  // فتح الظرف
  if (envelope) {
    envelope.classList.add('open');
  }

  // محاولة تشغيل الموسيقى
  startMusic();


  // بعد حركة فتح الظرف
  setTimeout(() => {

    if (opening) {
      opening.classList.add('is-gone');
    }

    if (site) {
      site.setAttribute('aria-hidden', 'false');
      site.classList.add('is-visible');
    }

    document.body.classList.add('invitation-open');

    window.scrollTo(0, 0);

  }, 1800);


  // بداية النزول التلقائي
  setTimeout(() => {
    startAutoScroll();
  }, 3000);
}


// ============================
// Auto Scroll
// ============================

function startAutoScroll() {

  if (autoScrollStarted) return;

  autoScrollStarted = true;

  // كل ما الرقم زاد، النزول يصير أسرع
  const scrollSpeed = 0.55;

  let lastTime = performance.now();


  function scrollFrame(currentTime) {

    const maxScroll =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;


    // وصلنا لنهاية الدعوة
    if (window.scrollY >= maxScroll - 3) {
      window.scrollTo(0, maxScroll);
      return;
    }


    // يجعل السرعة ثابتة تقريبًا
    // حتى لو اختلف معدل تحديث الشاشة
    const delta = currentTime - lastTime;

    lastTime = currentTime;

    const movement =
      scrollSpeed * (delta / 16.67);


    window.scrollBy(
      0,
      Math.max(0.1, movement)
    );


    requestAnimationFrame(scrollFrame);
  }


  requestAnimationFrame(scrollFrame);
}


// ============================
// Start Automatically
// ============================

window.addEventListener('load', () => {

  window.scrollTo(0, 0);

  // انتظار بسيط ثم فتح الظرف
  setTimeout(() => {
    openInvitation();
  }, 1200);

});


// ============================
// Countdown
// ============================

const weddingDate =
  new Date('2026-09-08T20:30:00+03:00').getTime();


function updateCountdown() {

  const now = Date.now();

  const distance =
    weddingDate - now;


  const daysElement =
    document.getElementById('days');

  const hoursElement =
    document.getElementById('hours');

  const minutesElement =
    document.getElementById('minutes');

  const secondsElement =
    document.getElementById('seconds');


  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  if (distance <= 0) {

    daysElement.textContent = '00';
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';

    return;
  }


  const days =
    Math.floor(
      distance /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (
        distance %
        (1000 * 60 * 60 * 24)
      ) /
      (1000 * 60 * 60)
    );


  const minutes =
    Math.floor(
      (
        distance %
        (1000 * 60 * 60)
      ) /
      (1000 * 60)
    );


  const seconds =
    Math.floor(
      (
        distance %
        (1000 * 60)
      ) /
      1000
    );


  daysElement.textContent =
    String(days).padStart(2, '0');

  hoursElement.textContent =
    String(hours).padStart(2, '0');

  minutesElement.textContent =
    String(minutes).padStart(2, '0');

  secondsElement.textContent =
    String(seconds).padStart(2, '0');
}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);