// ==========================================================
// 🔊 نظام تشغيل الأذان التلقائي المدمج بالنظام (Capacitor Native)
// ==========================================================

// نسخ أذان الفجر المتاحة (فيها "الصلاة خير من النوم")
const fajrAdhanOptions = [
  { id: 'adhan_2', label: 'مؤذن الفجر ١', file: 'audio/adhan_2.mp3' },
  { id: 'adhan_22', label: 'مؤذن الفجر ٢', file: 'audio/adhan_22.mp3' },
  { id: 'adhan_222', label: 'مؤذن الفجر ٣', file: 'audio/adhan_222.mp3' },
  { id: 'adhan_2222', label: 'مؤذن الفجر ٤', file: 'audio/adhan_2222.mp3' },
];

// مؤذنو باقي الصلوات
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

// 🔥 طلب إذن الإشعارات الأصلي من أندرويد عند التفعيل
function unlockAdhanAudio() {
  if (window.Capacitor && window.Capacitor.Plugins.LocalNotifications) {
    window.Capacitor.Plugins.LocalNotifications.requestPermissions();
  }

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
    alert('✅ تم تفعيل تنبيه الأذان الأصلي! سيقوم بالنطق وقت الصلاة حتى والشاشة مغلقة 🔔');
  }).catch(() => {
    alert('⚠️ حصلت مشكلة في تفعيل الصوت، تأكد من إعطاء الصلاحيات.');
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

// 🔥 تشغيل الأذان الأصلي عبر الهاردوير لمنع قفله بالخلفية
async function playAdhan(prayerKey) {
  const fileUrl = getAdhanFileForPrayer(prayerKey);
  const settings = getAdhanSettings();

  // 1. تشغيل الصوت عبر NativeAudio
  if (window.Capacitor && window.Capacitor.Plugins.NativeAudio) {
    try {
      await window.Capacitor.Plugins.NativeAudio.preload({
        assetId: prayerKey,
        assetPath: fileUrl,
        audioChannelNum: 1,
        isUrl: false
      });
      await window.Capacitor.Plugins.NativeAudio.setVolume({
        assetId: prayerKey,
        volume: settings.volume
      });
      await window.Capacitor.Plugins.NativeAudio.play({
        assetId: prayerKey
      });
    } catch(e) {
      console.log("NativeAudio Fallback");
    }
  }

  // 2. إرسال إشعار فوري على شاشة القفل (Push Style)
  if (window.Capacitor && window.Capacitor.Plugins.LocalNotifications) {
    window.Capacitor.Plugins.LocalNotifications.schedule({
      notifications: [
        {
          title: `حان الآن وقت صلاة ${adhanPrayerNamesAr[prayerKey]} 🕌`,
          body: prayerKey === 'Fajr' ? 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ' : 'حَيَّ عَلَى الصَّلَاةِ، حَيَّ عَلَى الْفَلَاحِ',
          id: Date.now(),
          smallIcon: 'res://icon',
          iconColor: '#d4af37'
        }
      ]
    });
  }

  if (typeof showFullAdhanScreen === 'function') {
    showFullAdhanScreen(prayerKey); 
  }
}

// 🔥 دالة الإيقاف الكامل للصوت المحلي والنظام
async function stopAdhanPlayback() {
  Object.keys(adhanPrayerNamesAr).forEach(async (key) => {
    if (window.Capacitor && window.Capacitor.Plugins.NativeAudio) {
      try {
        await window.Capacitor.Plugins.NativeAudio.stop({ assetId: key });
        await window.Capacitor.Plugins.NativeAudio.unload({ assetId: key });
      } catch(e){}
    }
  });

  if (adhanAudioEl) {
    adhanAudioEl.pause();
    adhanAudioEl.currentTime = 0;
  }
  const banner = document.getElementById('adhanBanner');
  if (banner) banner.remove();
}

// متغير عالمي للتحكم في صوت المعاينة المباشر
let adhanPreviewAudioObj = new Audio();

function renderAdhanCardsUI() {
  const settings = getAdhanSettings();
  
  const fajrContainer = document.getElementById('fajrCardsContainer');
  if (fajrContainer) {
    fajrContainer.innerHTML = fajrAdhanOptions.map(o => {
      const isSelected = settings.fajrMuathin === o.id;
      return `
        <div class="surah-item" style="border-right: 3px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}; margin-bottom: 0px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1; min-width: 0;" onclick="window.selectFajrCardMuathin('${o.id}')">
            <div class="surah-num" style="background: ${isSelected ? 'var(--gold)' : 'var(--bg3)'}; color: ${isSelected ? '#111' : 'var(--text2)'}; flex-shrink: 0;">${isSelected ? '✓' : '🌅'}</div>
            <div class="surah-name" style="${isSelected ? 'color: var(--gold); font-weight: bold;' : ''}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${o.label}</div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button onclick="window.previewAdhanAudioFile('${o.file}')" style="background: var(--bg3); border: 1px solid var(--border); color: var(--gold); padding: 6px 10px; border-radius: 10px; font-size: 12px; cursor: pointer; font-family: 'Amiri', serif;">▶ استماع</button>
            <button id="download_azan_${o.id}" onclick="window.downloadAdhanAudio('${o.id}', '${o.file}')" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: var(--gold); padding: 6px 10px; border-radius: 10px; font-size: 12px; font-family: 'Amiri', serif; cursor: pointer;">📥 تحميل</button>
          </div>
        </div>
      `;
    }).join('');
  }

  const regularContainer = document.getElementById('regularCardsContainer');
  if (regularContainer) {
    regularContainer.innerHTML = regularAdhanOptions.map(o => {
      const isSelected = settings.regularMuathin === o.id;
      return `
        <div class="surah-item" style="border-right: 3px solid ${isSelected ? 'var(--green)' : 'var(--border)'}; margin-bottom: 0px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1; min-width: 0;" onclick="window.selectRegularCardMuathin('${o.id}')">
            <div class="surah-num" style="background: ${isSelected ? 'var(--green)' : 'var(--bg3)'}; color: ${isSelected ? '#fff' : 'var(--text2)'}; flex-shrink: 0;">${isSelected ? '✓' : '🕌'}</div>
            <div class="surah-name" style="${isSelected ? 'color: var(--green); font-weight: bold;' : ''}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${o.label}</div>
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button onclick="window.previewAdhanAudioFile('${o.file}')" style="background: var(--bg3); border: 1px solid var(--border); color: var(--gold); padding: 6px 10px; border-radius: 10px; font-size: 12px; cursor: pointer; font-family: 'Amiri', serif;">▶ استماع</button>
            <button id="download_azan_${o.id}" onclick="window.downloadAdhanAudio('${o.id}', '${o.file}')" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: var(--gold); padding: 6px 10px; border-radius: 10px; font-size: 12px; font-family: 'Amiri', serif; cursor: pointer;">📥 تحميل</button>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.previewAdhanAudioFile = function(filePath) {
  if (adhanPreviewAudioObj && !adhanPreviewAudioObj.paused && adhanPreviewAudioObj.src.endsWith(filePath)) {
    adhanPreviewAudioObj.pause();
    adhanPreviewAudioObj.currentTime = 0;
    resetAllPreviewButtons();
    return;
  }

  if (adhanPreviewAudioObj && !adhanPreviewAudioObj.paused) {
    adhanPreviewAudioObj.pause();
  }

  if (typeof stopAdhanPlayback === 'function') {
    stopAdhanPlayback();
  }
  
  adhanPreviewAudioObj.src = filePath;
  const settings = getAdhanSettings();
  adhanPreviewAudioObj.volume = settings.volume !== undefined ? parseFloat(settings.volume) : 1;

  adhanPreviewAudioObj.play()
    .then(() => {
      updatePreviewButtonsUI(filePath);
    })
    .catch(e => console.error("عطل تشغيل المعاينة:", e));

  adhanPreviewAudioObj.onended = function() {
    resetAllPreviewButtons();
  };
};

function updatePreviewButtonsUI(activePath) {
  const buttons = document.querySelectorAll('#azanSettingsPage button');
  buttons.forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    const isPreviewBtn = onclickAttr.includes('previewAdhanAudioFile');
    if (isPreviewBtn && onclickAttr.includes(activePath)) {
      btn.innerHTML = '⏸ إيقاف';
      btn.style.background = 'var(--gold)';
      btn.style.color = '#111';
    } else if (isPreviewBtn && btn.innerHTML === '⏸ إيقاف') {
      btn.innerHTML = '▶ استماع';
      btn.style.background = 'var(--bg3)';
      btn.style.color = 'var(--gold)';
    }
  });
}

function resetAllPreviewButtons() {
  const buttons = document.querySelectorAll('#azanSettingsPage button');
  buttons.forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    if (onclickAttr.includes('previewAdhanAudioFile')) {
      btn.innerHTML = '▶ استماع';
      btn.style.background = 'var(--bg3)';
      btn.style.color = 'var(--gold)';
    }
  });
}

window.selectFajrCardMuathin = function(id) {
  changeFajrMuathin(id);
  renderAdhanCardsUI();
};

window.selectRegularCardMuathin = function(id) {
  changeRegularMuathin(id);
  renderAdhanCardsUI();
};

function updateAdhanToggleUI() {
  const settings = getAdhanSettings();
  const btn = document.getElementById('azanPageEnableBtn');
  const statusEl = document.getElementById('azanPageStatusText');
  const volumeWrap = document.getElementById('azanPageVolumeWrap');

  if (!btn) return;

  if (settings.enabled) {
    btn.textContent = '🔕 إيقاف تنبيه الأذان التلقائي';
    btn.style.background = 'transparent';
    btn.style.border = '1px solid rgba(255,100,100,0.4)';
    btn.style.color = '#ff6b6b';
    btn.onclick = disableAdhanAudio;
    if (statusEl) statusEl.textContent = '✅ الأذان التلقائي مفعّل الآن وسينطلق تلقائياً وقت الصلاة';
    if (volumeWrap) volumeWrap.style.display = 'block';
  } else {
    btn.textContent = '🔔 تفعيل تنبيه الأذان التلقائي';
    btn.style.background = 'var(--gold)';
    btn.style.border = 'none';
    btn.style.color = '#111';
    btn.onclick = unlockAdhanAudio;
    if (statusEl) statusEl.textContent = 'الأذان التلقائي متوقف حاليًا';
    if (volumeWrap) volumeWrap.style.display = 'none';
  }
  renderAdhanCardsUI();
}

function changeAdhanVolume(value) {
  const settings = getAdhanSettings();
  const vol = parseFloat(value);
  settings.volume = vol;
  saveAdhanSettings(settings);

  if (adhanAudioEl) adhanAudioEl.volume = vol;
  if (adhanPreviewAudioObj) adhanPreviewAudioObj.volume = vol;
}

function testAdhanSound() { playAdhan('Dhuhr'); }
function testFajrAdhanSound() { playAdhan('Fajr'); }

document.addEventListener('DOMContentLoaded', () => {
  const settings = getAdhanSettings();
  if (settings.enabled) {
    startAdhanWatcher();
  }
  updateAdhanToggleUI();
  if(typeof renderAdhanCardsUI === 'function') renderAdhanCardsUI();
});

// تحميل الملفات أوفلاين
window.downloadAdhanAudio = function(id, filePath) {
  if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
    alert('⚠️ نظام التخزين لسه بيتجهز، جرب تاني بعد ثانية 🙏');
    return;
  }
  const btn = document.getElementById('download_azan_' + id);
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ جاري التحميل...';
  }
  navigator.serviceWorker.controller.postMessage({
    type: 'CACHE_AUDIO_URL',
    url: filePath,
    label: 'adhan_' + id
  });
};

navigator.serviceWorker.addEventListener('message', (event) => {
  const d = event.data;
  if (!d) return;

  if (d.type === 'AUDIO_CACHED' && d.label && d.label.startsWith('adhan_')) {
    const id = d.label.replace('adhan_', '');
    const btn = document.getElementById('download_azan_' + id);
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✅ محمّل أوفلاين';
      btn.style.background = 'rgba(76,175,80,0.15)';
      btn.style.borderColor = '#4caf50';
      btn.style.color = '#4caf50';
    }
  }
});

async function markAlreadyDownloadedAdhanButtons() {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open('athr-audio-cache-v1');
    const allOptions = [...fajrAdhanOptions, ...regularAdhanOptions];
    for (const o of allOptions) {
      const match = await cache.match(o.file);
      const btn = document.getElementById('download_azan_' + o.id);
      if (match && btn) {
        btn.textContent = '✅ محمّل أوفلاين';
        btn.style.background = 'rgba(76,175,80,0.15)';
        btn.style.borderColor = '#4caf50';
        btn.style.color = '#4caf50';
      }
    }
  } catch (e) {}
}

const _originalRenderAdhanCardsUI = renderAdhanCardsUI;
renderAdhanCardsUI = function() {
  _originalRenderAdhanCardsUI();
  setTimeout(markAlreadyDownloadedAdhanButtons, 100);
};

function showFullAdhanScreen(prayerKey) {
  const existing = document.getElementById('fullAdhanScreen');
  if (existing) existing.remove();

  const adhanBgs = [
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1080&auto=format&fit=crop'
  ];
  const randomBg = adhanBgs[Math.floor(Math.random() * adhanBgs.length)];

  const fullScreen = document.createElement('div');
  fullScreen.id = 'fullAdhanScreen';
  fullScreen.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999999;
    background-image: url('${randomBg}'); background-size: cover; background-position: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'Amiri', serif; direction: rtl; text-align: center; padding: 20px;
  `;

  fullScreen.innerHTML = `
    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.65); z-index: 1;"></div>
    <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <div style="font-size: 80px; animation: pulse 2s infinite;">🕌</div>
      <h1 style="color: #d4af37; font-size: 32px; font-weight: bold; text-shadow: 0 4px 15px rgba(0,0,0,0.8);">حَانَ الآنَ وَقْتُ صَلَاةِ ${adhanPrayerNamesAr[prayerKey]}</h1>
      <p style="color: #f4f6f4; font-size: 20px; font-style: italic; max-width: 300px; line-height: 1.8;">
        ${prayerKey === 'Fajr' ? 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ' : 'أرِحْنَا بِهَا يَا بِلَالُ.. حَيَّ عَلَى الصَّلَاةِ'}
      </p>
      <button onclick="stopFullAdhanPlayback()" style="margin-top: 40px; background: transparent; border: 2px solid #ff6b6b; color: #ff6b6b; padding: 12px 45px; border-radius: 30px; font-size: 16px; font-weight: bold; cursor: pointer; font-family: 'Amiri', serif; transition: all 0.3s; box-shadow: 0 0 15px rgba(255,107,107,0.3);">
        🛑 إيقاف صوت الأذان
      </button>
    </div>
  `;
  document.body.appendChild(fullScreen);

  if (!document.getElementById('fullAdhanStyle')) {
    const style = document.createElement('style');
    style.id = 'fullAdhanStyle';
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(212,175,55,0.4)); }
        50% { transform: scale(1.08); filter: drop-shadow(0 0 30px rgba(212,175,55,0.8)); }
        100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(212,175,55,0.4)); }
      }
    `;
    document.head.appendChild(style);
  }
}

window.stopFullAdhanPlayback = function() {
  stopAdhanPlayback();
  const fullScreen = document.getElementById('fullAdhanScreen');
  if (fullScreen) fullScreen.remove();
};
