const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;
let autoScrollTimer = null;


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
    }

    document.body.classList.add('invitation-open');

    const scroller =
      document.scrollingElement ||
      document.documentElement;

    scroller.scrollTop = 0;

  }, 1800);

  // بدء النزول بعد ظهور الدعوة
  setTimeout(() => {
    startAutoScroll();
  }, 3200);
}


// ============================
// Auto Scroll
// iPhone + Android + Desktop
// ============================

function startAutoScroll() {
  if (autoScrollTimer !== null) return;

  const scroller =
    document.scrollingElement ||
    document.documentElement;

  /*
    السرعة
    1 = بطيء
    2 = متوسط
    3 = أسرع
  */
  const speed = 2;

  /*
    كل كم ملي ثانية يتحرك
  */
  const interval = 28;

  // حركة بسيطة بالبداية للجوال
  scroller.scrollTop = 1;

  autoScrollTimer = setInterval(() => {

    const maxScroll =
      scroller.scrollHeight -
      window.innerHeight;

    // وصلنا للنهاية
    if (scroller.scrollTop >= maxScroll - 5) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;

      scroller.scrollTop = maxScroll;

      return;
    }

    // النزول الفعلي
    scroller.scrollTop =
      scroller.scrollTop + speed;

  }, interval);
}


// ============================
// Start Automatically
// ============================

window.addEventListener('load', () => {
  const scroller =
    document.scrollingElement ||
    document.documentElement;

  scroller.scrollTop = 0;

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

setInterval(updateCountdown, 1000);