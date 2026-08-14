const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;

let autoMoveStarted = false;
let autoMoveFrame = null;
let autoMoveY = 0;


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
// Open Invitation
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


  // إخفاء شاشة البداية
  setTimeout(() => {

    if (opening) {
      opening.classList.add('is-gone');
    }

    if (site) {
      site.setAttribute('aria-hidden', 'false');
      site.classList.add('is-visible');

      // نضمن البداية من فوق
      site.style.transform = 'translate3d(0, 0, 0)';
    }

    document.body.classList.add('invitation-open');

  }, 1800);


  // بداية الحركة مثل الفيديو
  setTimeout(() => {
    startAutoMove();
  }, 3200);
}


// ============================
// Auto Move Like Video
// iPhone + Android + Desktop
// ============================

function startAutoMove() {
  if (autoMoveStarted || !site) return;

  autoMoveStarted = true;

  /*
    السرعة:
    0.25 = بطيء
    0.45 = مناسب
    0.70 = أسرع
  */
  const speed = 0.65;

  let lastTime = performance.now();


  function moveFrame(currentTime) {
    if (!autoMoveStarted) return;

    const delta =
      Math.min(currentTime - lastTime, 40);

    lastTime = currentTime;


    const viewportHeight =
      window.innerHeight;

    const siteHeight =
      site.scrollHeight;


    // أقصى مسافة لتحريك الكرت
    const maxMove =
      Math.max(
        0,
        siteHeight - viewportHeight
      );


    // وصلنا للنهاية
    if (autoMoveY >= maxMove) {

      autoMoveY = maxMove;

      site.style.transform =
        `translate3d(0, -${autoMoveY}px, 0)`;

      autoMoveStarted = false;

      return;
    }


    // الحركة
    autoMoveY +=
      speed * (delta / 16.67);


    if (autoMoveY > maxMove) {
      autoMoveY = maxMove;
    }


    site.style.transform =
      `translate3d(0, -${autoMoveY}px, 0)`;


    autoMoveFrame =
      requestAnimationFrame(moveFrame);
  }


  autoMoveFrame =
    requestAnimationFrame(moveFrame);
}


// ============================
// Restart movement if needed
// ============================

function restartAutoMove() {
  if (!site) return;

  if (autoMoveFrame) {
    cancelAnimationFrame(autoMoveFrame);
  }

  autoMoveY = 0;
  autoMoveStarted = false;

  site.style.transform =
    'translate3d(0, 0, 0)';

  startAutoMove();
}


// ============================
// Start Automatically
// ============================

window.addEventListener('load', () => {

  autoMoveY = 0;

  if (site) {
    site.style.transform =
      'translate3d(0, 0, 0)';
  }

  setTimeout(() => {
    openInvitation();
  }, 1200);
});


// ============================
// Fix screen rotation / resize
// ============================

window.addEventListener('resize', () => {

  if (!site) return;

  const maxMove =
    Math.max(
      0,
      site.scrollHeight -
      window.innerHeight
    );

  if (autoMoveY > maxMove) {
    autoMoveY = maxMove;

    site.style.transform =
      `translate3d(0, -${autoMoveY}px, 0)`;
  }

});


// ============================
// Countdown
// ============================

const weddingDate =
  new Date('2026-09-08T20:30:00+03:00').getTime();


function updateCountdown() {

  const now =
    Date.now();

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

setInterval(updateCountdown, 1000);