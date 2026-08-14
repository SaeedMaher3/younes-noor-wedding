const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;

let autoScrollActive = false;
let autoScrollFrame = null;


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


  // بعد حركة الظرف نظهر الدعوة
  setTimeout(() => {

    if (opening) {
      opening.classList.add('is-gone');
    }


    if (site) {
      site.setAttribute('aria-hidden', 'false');
      site.classList.add('is-visible');

      // مهم:
      // نتأكد إنه ما ضل transform من النسخة القديمة
      site.style.transform = 'none';
    }


    document.body.classList.add('invitation-open');


    const scroller =
      document.scrollingElement ||
      document.documentElement;


    scroller.scrollTop = 0;

  }, 1800);


  // بداية النزول التلقائي
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


  const scroller =
    document.scrollingElement ||
    document.documentElement;


  /*
    السرعة

    0.4 = بطيء جدًا
    0.7 = هادئ
    1.0 = متوسط
    1.4 = أسرع
  */
  const speed = 0.8;


  let lastTime =
    performance.now();


  function scrollFrame(currentTime) {

    if (!autoScrollActive) {
      return;
    }


    const delta =
      Math.min(
        currentTime - lastTime,
        40
      );


    lastTime =
      currentTime;


    const maxScroll =
      Math.max(
        0,
        scroller.scrollHeight -
        window.innerHeight
      );


    // وصلنا للنهاية
    if (scroller.scrollTop >= maxScroll - 3) {

      scroller.scrollTop =
        maxScroll;

      stopAutoScroll();

      return;
    }


    // حركة ثابتة على الجوال والكمبيوتر
    const movement =
      speed * (delta / 16.67);


    scroller.scrollTop =
      Math.min(
        scroller.scrollTop + movement,
        maxScroll
      );


    autoScrollFrame =
      requestAnimationFrame(scrollFrame);
  }


  autoScrollFrame =
    requestAnimationFrame(scrollFrame);
}


// ============================
// Stop Auto Scroll
// ============================

function stopAutoScroll() {

  autoScrollActive = false;


  if (autoScrollFrame !== null) {

    cancelAnimationFrame(
      autoScrollFrame
    );

    autoScrollFrame = null;
  }
}


// ============================
// Manual Control
// ============================

function userTookControl() {

  // أول ما المستخدم يلمس أو يسحب
  // نوقف النزول التلقائي

  if (autoScrollActive) {
    stopAutoScroll();
  }
}


// iPhone / Android
window.addEventListener(
  'touchstart',
  userTookControl,
  {
    passive: true
  }
);


window.addEventListener(
  'touchmove',
  userTookControl,
  {
    passive: true
  }
);


// Mouse wheel
window.addEventListener(
  'wheel',
  userTookControl,
  {
    passive: true
  }
);


// إذا ضغط وسحب بالماوس
window.addEventListener(
  'mousedown',
  userTookControl,
  {
    passive: true
  }
);


// ============================
// Start Automatically
// ============================

window.addEventListener('load', () => {

  const scroller =
    document.scrollingElement ||
    document.documentElement;


  scroller.scrollTop = 0;


  // يظهر الغلاف بالبداية
  setTimeout(() => {

    openInvitation();

  }, 1200);
});


// ============================
// Countdown
// ============================

const weddingDate =
  new Date(
    '2026-09-08T20:30:00+03:00'
  ).getTime();


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


  // إذا خلص موعد العرس
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


// تشغيل العداد
updateCountdown();


setInterval(
  updateCountdown,
  1000
);