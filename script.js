const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;

let autoScrollRunning = false;
let autoScrollFrame = null;
let autoScrollFallback = null;


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


  // إخفاء شاشة البداية وإظهار الموقع
  setTimeout(() => {

    if (opening) {
      opening.classList.add('is-gone');
    }

    if (site) {
      site.setAttribute('aria-hidden', 'false');
      site.classList.add('is-visible');
    }

    document.body.classList.add('invitation-open');


    // نرجع لأول الصفحة
    window.scrollTo(0, 0);

  }, 1800);


  // بعد ظهور الدعوة نبدأ النزول
  setTimeout(() => {

    // حركة صغيرة تساعد Safari / Chrome Mobile
    window.scrollTo(0, 1);

    setTimeout(() => {
      startAutoScroll();
    }, 250);

  }, 3100);
}


// ============================
// Auto Scroll
// Mobile + Desktop
// ============================

function startAutoScroll() {

  if (autoScrollRunning) return;

  autoScrollRunning = true;


  // كل ما زاد الرقم يصير أسرع
  const speed = 1.35;

  let lastPosition = window.scrollY;

  let stuckCounter = 0;


  function getMaxScroll() {

    const bodyHeight =
      document.body.scrollHeight;

    const htmlHeight =
      document.documentElement.scrollHeight;

    const pageHeight =
      Math.max(bodyHeight, htmlHeight);

    return Math.max(
      0,
      pageHeight - window.innerHeight
    );
  }


  function scrollStep() {

    if (!autoScrollRunning) return;


    const maxScroll =
      getMaxScroll();


    // وصلنا للنهاية
    if (window.scrollY >= maxScroll - 4) {

      stopAutoScroll();

      return;
    }


    const nextPosition =
      Math.min(
        window.scrollY + speed,
        maxScroll
      );


    window.scrollTo(
      0,
      nextPosition
    );


    // فحص إذا الجوال علق وما تحرك
    if (Math.abs(window.scrollY - lastPosition) < 0.1) {

      stuckCounter++;

    } else {

      stuckCounter = 0;

      lastPosition =
        window.scrollY;
    }


    /*
      إذا requestAnimationFrame ما حرك الصفحة
      نخلي fallback يكمل
    */
    if (stuckCounter > 40) {

      startScrollFallback();

      return;
    }


    autoScrollFrame =
      requestAnimationFrame(scrollStep);
  }


  autoScrollFrame =
    requestAnimationFrame(scrollStep);
}


// ============================
// Mobile Fallback
// ============================

function startScrollFallback() {

  if (autoScrollFrame) {

    cancelAnimationFrame(autoScrollFrame);

    autoScrollFrame = null;
  }


  if (autoScrollFallback) return;


  autoScrollFallback =
    setInterval(() => {

      const bodyHeight =
        document.body.scrollHeight;

      const htmlHeight =
        document.documentElement.scrollHeight;

      const maxScroll =
        Math.max(
          bodyHeight,
          htmlHeight
        ) - window.innerHeight;


      if (window.scrollY >= maxScroll - 4) {

        stopAutoScroll();

        return;
      }


      window.scrollTo(
        0,
        Math.min(
          window.scrollY + 2,
          maxScroll
        )
      );

    }, 22);
}


// ============================
// Stop Scroll
// ============================

function stopAutoScroll() {

  autoScrollRunning = false;


  if (autoScrollFrame) {

    cancelAnimationFrame(autoScrollFrame);

    autoScrollFrame = null;
  }


  if (autoScrollFallback) {

    clearInterval(autoScrollFallback);

    autoScrollFallback = null;
  }
}


// ============================
// Start Automatically
// ============================

window.addEventListener('load', () => {

  window.scrollTo(0, 0);


  // يبقى الغلاف ظاهر شوي
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


// تشغيل العداد
updateCountdown();

setInterval(
  updateCountdown,
  1000
);