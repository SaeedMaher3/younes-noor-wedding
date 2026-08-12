
const opening = document.getElementById('opening');
const envelope = document.getElementById('openInvite');
const site = document.getElementById('site');

const music = document.getElementById('music');
const musicButton = document.getElementById('musicButton');
const musicText = document.getElementById('musicText');
const musicIcon = document.getElementById('musicIcon');

let opened = false;


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
    console.log('تعذر تشغيل الموسيقى تلقائيًا:', error);
    updateMusicButton(false);
  }
}

function stopMusic() {
  music.pause();
  updateMusicButton(false);
}


// ============================
// Open Invitation
// ============================

envelope.addEventListener('click', async () => {

  if (opened) return;

  opened = true;

  // تشغيل الأغنية مباشرة من نفس ضغطة المستخدم
  startMusic();

  // بدء حركة فتح الظرف
  envelope.classList.add('open');

  // بعد انتهاء حركة الظرف نظهر الموقع
  setTimeout(() => {

    opening.classList.add('is-gone');

    site.classList.add('is-visible');

    site.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'auto';

  }, 1500);

});


// ============================
// Music Button
// ============================

musicButton.addEventListener('click', () => {

  if (music.paused) {
    startMusic();
  } else {
    stopMusic();
  }

});


// ============================
// Wedding Countdown
// ============================

// موعد الزفاف حسب توقيت الأردن
const weddingDate =
  new Date('2026-09-08T20:30:00+03:00').getTime();

function updateCountdown() {

  const now = Date.now();

  let diff = weddingDate - now;

  if (diff <= 0) {

    document.getElementById('countdown').innerHTML = `
      <div style="grid-column:1/-1">
        <strong>مبارك للعروسين ♡</strong>
        <span>بدأت ليلة الفرح</span>
      </div>
    `;

    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  const days = Math.floor(diff / day);

  diff %= day;

  const hours = Math.floor(diff / hour);

  diff %= hour;

  const minutes = Math.floor(diff / minute);

  diff %= minute;

  const seconds = Math.floor(diff / 1000);

  document.getElementById('days').textContent = days;

  document.getElementById('hours').textContent =
    String(hours).padStart(2, '0');

  document.getElementById('minutes').textContent =
    String(minutes).padStart(2, '0');

  document.getElementById('seconds').textContent =
    String(seconds).padStart(2, '0');
}

updateCountdown();

setInterval(updateCountdown, 1000);