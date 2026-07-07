// ==========================================================
// 🔊 نظام تشغيل الأذان التلقائي عند دخول وقت كل صلاة
// ==========================================================

// نسخ أذان الفجر المتاحة (فيها "الصلاة خير من النوم")
const fajrAdhanOptions = [
  { id: 'adhan_2', label: 'مؤذن الفجر ١', file: 'audio/adhan_2.mp3' },
  { id: 'adhan_22', label: 'مؤذن الفجر ٢', file: 'audio/adhan_22.mp3' },
  { id: 'adhan_222', label: 'مؤذن الفجر ٣', file: 'audio/adhan_222.mp3' },
  { id: 'adhan_2222', label: 'مؤذن الفجر ٤', file: 'audio/adhan_2222.mp3' },
];


// مؤذنو باقي الصلوات (المسار المباشر الصحيح)
const regularAdhanOptions = [
  { id: 'adhan_1', label: 'مؤذن ١', file: 'audio/adhan_1.mp3' },
  { id: 'adhan_3', label: 'مؤذن ٢', file: 'audio/adhan_3.mp3' },
  { id: 'adhan_4', label: 'مؤذن ٣', file: 'audio/adhan_4.mp3' },
  { id: 'adhan_5', label: 'مؤذن ٤', file: 'audio/adhan_5.mp3' },
  { id: 'adhan_6', label: 'مؤذن ٥', file: 'audio/adhan_6.mp3' },
  { id: 'adhan_7', label: 'مؤذن ٦', file: 'audio/adhan_7.mp3' },
  { id: 'adhan_8', label: 'مؤذن ٧', file: 'audio/adhan_8.mp3' },
  { id: 'adhan_9', label: 'مؤذن ٨', file: 'audio/adhan_9.mp3' },
];


const adhanPrayerNamesAr = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

let adhanAudioEl = null;
let adhanCheckInterval = null;

function getAdhanSettings() {
  const defaults = {
    enabled: false,
    volume: 1,
    fajrMuathin: 'adhan_2',
    regularMuathin: 'adhan_1',
  };
  const saved = JSON.parse(localStorage.getItem('adhan_settings') || 'null');
  return saved ? { ...defaults, ...saved } : defaults;
}

function saveAdhanSettings(settings) {
  localStorage.setItem('adhan_settings', JSON.stringify(settings));
}

function getAdhanFileForPrayer(prayerKey) {
  const settings = getAdhanSettings();
  if (prayerKey === 'Fajr') {
    const found = fajrAdhanOptions.find(o => o.id === settings.fajrMuathin);
    return found ? found.file : fajrAdhanOptions[0].file;
  }
  const found = regularAdhanOptions.find(o => o.id === settings.regularMuathin);
  return found ? found.file : regularAdhanOptions[0].file;
}

function changeFajrMuathin(value) {
  const settings = getAdhanSettings();
  settings.fajrMuathin = value;
  saveAdhanSettings(settings);
}

function changeRegularMuathin(value) {
  const settings = getAdhanSettings();
  settings.regularMuathin = value;
  saveAdhanSettings(settings);
}

function unlockAdhanAudio() {
  if (!adhanAudioEl) {
    adhanAudioEl = document.createElement('audio');
    adhanAudioEl.id = 'adhanAudioPlayer';
    document.body.appendChild(adhanAudioEl);
  }

  adhanAudioEl.src = getAdhanFileForPrayer('Dhuhr');
  adhanAudioEl.volume = 0;
  adhanAudioEl.play().then(() => {
    adhanAudioEl.pause();
    adhanAudioEl.currentTime = 0;

    const settings = getAdhanSettings();
    settings.enabled = true;
    saveAdhanSettings(settings);

    updateAdhanToggleUI();
    startAdhanWatcher();
    alert('✅ تم تفعيل تنبيه الأذان التلقائي، هيرن تلقائيًا في وقت كل صلاة طول ما التطبيق مفتوح 🔔');
  }).catch(() => {
    alert('⚠️ حصلت مشكلة في تفعيل الصوت، جرب تاني أو تأكد إن ملفات الأذان موجودة في المسار الصحيح.');
  });
}

function disableAdhanAudio() {
  const settings = getAdhanSettings();
  settings.enabled = false;
  saveAdhanSettings(settings);
  stopAdhanWatcher();
  updateAdhanToggleUI();
}

function startAdhanWatcher() {
  if (adhanCheckInterval) clearInterval(adhanCheckInterval);
  adhanCheckInterval = setInterval(checkAdhanTime, 20000);
  checkAdhanTime();
}

function stopAdhanWatcher() {
  if (adhanCheckInterval) clearInterval(adhanCheckInterval);
  adhanCheckInterval = null;
}

function checkAdhanTime() {
  const settings = getAdhanSettings();
  if (!settings.enabled) return;
  if (typeof globalPrayerTimings === 'undefined' || !globalPrayerTimings) return;

  const now = new Date();
  const currentHHMM = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const todayKey = now.toLocaleDateString('en-CA');

  const playedToday = JSON.parse(localStorage.getItem('adhan_played_' + todayKey) || '{}');

  Object.keys(adhanPrayerNamesAr).forEach(prayerKey => {
    const prayerTime = globalPrayerTimings[prayerKey];
    if (!prayerTime) return;

    if (prayerTime === currentHHMM && !playedToday[prayerKey]) {
      playAdhan(prayerKey);
      playedToday[prayerKey] = true;
      localStorage.setItem('adhan_played_' + todayKey, JSON.stringify(playedToday));
    }
  });
}

function playAdhan(prayerKey) {
  if (!adhanAudioEl) {
    adhanAudioEl = document.createElement('audio');
    adhanAudioEl.id = 'adhanAudioPlayer';
    document.body.appendChild(adhanAudioEl);
  }

  const settings = getAdhanSettings();
  adhanAudioEl.src = getAdhanFileForPrayer(prayerKey);
  adhanAudioEl.volume = settings.volume !== undefined ? settings.volume : 1;
  adhanAudioEl.play().catch(err => console.error('تعذر تشغيل الأذان:', err));

  showAdhanBanner(prayerKey);
}

function showAdhanBanner(prayerKey) {
  const existing = document.getElementById('adhanBanner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'adhanBanner';
  banner.style.cssText = `
    position:fixed; top:0; left:0; width:100%; z-index:99999999;
    background:linear-gradient(135deg,#123524,#0b120c);
    padding:16px 18px calc(14px + env(safe-area-inset-top));
    display:flex; align-items:center; gap:12px;
    border-bottom:2px solid var(--gold, #d4af37);
    box-shadow:0 4px 20px rgba(0,0,0,0.4);
    font-family:'Amiri',serif; direction:rtl;
    animation: adhanBannerSlide 0.5s ease;
  `;
  banner.innerHTML = `
    <div style="font-size:30px;">🕌</div>
    <div style="flex:1;">
      <div style="color:#d4af37; font-size:15px; font-weight:700;">حان الآن وقت صلاة ${adhanPrayerNamesAr[prayerKey]}</div>
      <div style="color:#9aa79c; font-size:11px; margin-top:2px;">${prayerKey === 'Fajr' ? 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ' : 'حَيَّ عَلَى الصَّلَاةِ، حَيَّ عَلَى الْفَلَاحِ'}</div>
    </div>
    <button onclick="stopAdhanPlayback()" style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; color:#d4af37; padding:8px 14px; border-radius:14px; font-size:12px; cursor:pointer; font-family:'Amiri',serif;">إيقاف</button>
  `;
  document.body.appendChild(banner);

  if (!document.getElementById('adhanBannerStyle')) {
    const style = document.createElement('style');
    style.id = 'adhanBannerStyle';
    style.textContent = `@keyframes adhanBannerSlide{0%{transform:translateY(-100%);}100%{transform:translateY(0);}}`;
    document.head.appendChild(style);
  }

  adhanAudioEl.onended = () => {
    const b = document.getElementById('adhanBanner');
    if (b) b.remove();
  };
}

function stopAdhanPlayback() {
  if (adhanAudioEl) {
    adhanAudioEl.pause();
    adhanAudioEl.currentTime = 0;
  }
  const banner = document.getElementById('adhanBanner');
  if (banner) banner.remove();
}

function renderAdhanSelectors() {
  const settings = getAdhanSettings();

  const fajrSelect = document.getElementById('fajrMuathinSelect');
  if (fajrSelect) {
    fajrSelect.innerHTML = fajrAdhanOptions.map(o =>
      `<option value="${o.id}" ${settings.fajrMuathin === o.id ? 'selected' : ''}>${o.label}</option>`
    ).join('');
  }

  const regularSelect = document.getElementById('regularMuathinSelect');
  if (regularSelect) {
    regularSelect.innerHTML = regularAdhanOptions.map(o =>
      `<option value="${o.id}" ${settings.regularMuathin === o.id ? 'selected' : ''}>${o.label}</option>`
    ).join('');
  }
}

function updateAdhanToggleUI() {
  const settings = getAdhanSettings();
  const btn = document.getElementById('adhanEnableBtn');
  const statusEl = document.getElementById('adhanStatusText');
  const volumeWrap = document.getElementById('adhanVolumeWrap');

  if (!btn) return;

  if (settings.enabled) {
    btn.textContent = '🔕 إيقاف تنبيه الأذان التلقائي';
    btn.onclick = disableAdhanAudio;
    if (statusEl) statusEl.textContent = '✅ الأذان التلقائي مفعّل الآن';
    if (volumeWrap) volumeWrap.style.display = 'block';
  } else {
    btn.textContent = '🔔 تفعيل تنبيه الأذان التلقائي';
    btn.onclick = unlockAdhanAudio;
    if (statusEl) statusEl.textContent = 'الأذان التلقائي متوقف حاليًا';
    if (volumeWrap) volumeWrap.style.display = 'none';
  }

  renderAdhanSelectors();
}

function changeAdhanVolume(value) {
  const settings = getAdhanSettings();
  settings.volume = parseFloat(value);
  saveAdhanSettings(settings);
}

function testAdhanSound() {
  playAdhan('Dhuhr');
}

function testFajrAdhanSound() {
  playAdhan('Fajr');
}

document.addEventListener('DOMContentLoaded', () => {
  const settings = getAdhanSettings();
  if (settings.enabled) {
    startAdhanWatcher();
  }
  updateAdhanToggleUI();
});
