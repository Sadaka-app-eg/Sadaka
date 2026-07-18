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
      
      // 🌟 إرسال التنبيه لنواة نظام التشغيل فوراً ليعمل في الخلفية وأوفلاين وغصب عن التليفون
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const targetTimeMs = new Date().setHours(now.getHours(), now.getMinutes(), 0, 0);
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_LOCAL_ADHAN',
          prayerName: adhanPrayerNamesAr[prayerKey],
          targetTimeMs: targetTimeMs,
          muathinAudioUrl: getAdhanFileForPrayer(prayerKey)
        });
      }

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
  
  adhanAudioEl.play()
    .then(() => {
      // 🌟 حيلة الـ MediaSession لمخادعة إشعارات الأندرويد وقت الأذان الفعلي
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `حان الآن وقت أذان ${adhanPrayerNamesAr[prayerKey]} 🕌`,
          artist: 'تطبيق كُن ذا أثر',
          album: ' ', // مسافة مخفية تمنع المتصفح من وضع روابطه تلقائياً
          artwork: [
            { src: 'icon.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon.png', sizes: '512x512', type: 'image/png' }
          ]
        });
      }
    })
    .catch(err => console.error('تعذر تشغيل الأذان:', err));

  // 🌟 استبدلنا البنر القديم واستدعينا واجهة الرن الكاملة ملء الشاشة بالخلفيات الإسلامية الفخمة
  if (typeof showFullAdhanScreen === 'function') {
    showFullAdhanScreen(prayerKey); 
  }
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

 // متغير عالمي للتحكم في صوت المعاينة المباشر
let adhanPreviewAudioObj = new Audio();

function renderAdhanCardsUI() {
  const settings = getAdhanSettings();
  
  // 1. رندرة كروت الفجر
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

  // 2. رندرة كروت باقي الصلوات
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

  

// دالة تشغيل وإيقاف المعاينة وتغيير شكل الأزرار تلقائياً
window.previewAdhanAudioFile = function(filePath) {
  
  // 1. لو نفس الملف شغال وضغطت عليه تاني -> وقفه ورجع الأزرار لطبيعتها
  if (adhanPreviewAudioObj && !adhanPreviewAudioObj.paused && adhanPreviewAudioObj.src.endsWith(filePath)) {
    adhanPreviewAudioObj.pause();
    adhanPreviewAudioObj.currentTime = 0;
    resetAllPreviewButtons(); // دالة هترجع كل الزراير لـ "▶ استماع"
    return;
  }

  // 2. لو في صوت تاني شغال (مؤذن آخر) -> وقفه الأول
  if (adhanPreviewAudioObj && !adhanPreviewAudioObj.paused) {
    adhanPreviewAudioObj.pause();
  }

  // 3. إيقاف الأذان الأساسي لو شغال
  if (typeof stopAdhanPlayback === 'function') {
    stopAdhanPlayback();
  }
  
  // 4. تشغيل الملف الجديد
  adhanPreviewAudioObj.src = filePath;
  const settings = getAdhanSettings();
  adhanPreviewAudioObj.volume = settings.volume !== undefined ? parseFloat(settings.volume) : 1;

    adhanPreviewAudioObj.play()
    .then(() => {
      updatePreviewButtonsUI(filePath);

      // 🌟 حيلة الـ MediaSession لمخادعة إشعارات الأندرويد أثناء الاستماع للمعاينة
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'معاينة صوت الأذان الشريف 📢',
          artist: 'تطبيق كُن ذا أثر',
          album: ' ', // مسافة مخفية
          artwork: [
            { src: 'icon.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon.png', sizes: '512x512', type: 'image/png' }
          ]
        });
      }
    })
    .catch(e => console.error("عطل تشغيل المعاينة:", e));

  // 6. لما الصوت يخلص لوحده، رجع الأزرار لطبيعتها تلقائياً
  adhanPreviewAudioObj.onended = function() {
    resetAllPreviewButtons();
  };
};

// دالة مساعدة لتحديث نصوص الأزرار على الشاشة
function updatePreviewButtonsUI(activePath) {
  const buttons = document.querySelectorAll('#azanSettingsPage button');
  buttons.forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    const isPreviewBtn = onclickAttr.includes('previewAdhanAudioFile');
    if (isPreviewBtn && onclickAttr.includes(activePath)) {
      // الزرار اللي شغال حالياً
      btn.innerHTML = '⏸ إيقاف';
      btn.style.background = 'var(--gold)';
      btn.style.color = '#111';
    } else if (isPreviewBtn && btn.innerHTML === '⏸ إيقاف') {
      // رجع أي زرار استماع تاني كان شغال
      btn.innerHTML = '▶ استماع';
      btn.style.background = 'var(--bg3)';
      btn.style.color = 'var(--gold)';
    }
  });
}

// دالة مساعدة لإعادة تعيين كل الأزرار لـ "▶ استماع"
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

// تحديث الواجهة والـ UI للصفحة المستقلة بشكل متناسق ومضمون
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

  // السحر هنا: لو الأذان الأساسي شغال، خليه يوطى أو يعلى فوراً بالملي
  if (adhanAudioEl) {
    adhanAudioEl.volume = vol;
  }
  
  // ولو صوت المعاينة (زرار استماع) شغال، خليه يتأثر برضه لحظياً
  if (adhanPreviewAudioObj) {
    adhanPreviewAudioObj.volume = vol;
  }
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
  // السطر السحري لتشغيل الكروت فوراً عند الإقلاع
  if(typeof renderAdhanCardsUI === 'function') renderAdhanCardsUI();
});
// ==========================================================
// 📥 تحميل ملفات الأذان أوفلاين (تخزين دائم عبر Service Worker)
// ==========================================================
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

  if (d.type === 'AUDIO_CACHE_FAILED' && d.label && d.label.startsWith('adhan_')) {
    const id = d.label.replace('adhan_', '');
    const btn = document.getElementById('download_azan_' + id);
    if (btn) {
      btn.disabled = false;
      btn.textContent = '⚠️ فشل، حاول تاني';
    }
  }
});

// تحديث شكل الأزرار عند فتح الصفحة: لو الملف متخزن بالفعل، بنعرض ✅ فوراً
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

// نستدعيها بعد كل رندرة للكروت
const _originalRenderAdhanCardsUI = renderAdhanCardsUI;
renderAdhanCardsUI = function() {
  _originalRenderAdhanCardsUI();
  setTimeout(markAlreadyDownloadedAdhanButtons, 100);
};
function showFullAdhanScreen(prayerKey) {
  // إخفاء أي بنر قديم
  const existing = document.getElementById('fullAdhanScreen');
  if (existing) existing.remove();

  // مصفوفة خلفيات إسلامية فخمة ومتحركة تملأ الشاشة بروقان
  const adhanBgs = [
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1080&auto=format&fit=crop', // المسجد النبوي ليلًا
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1080&auto=format&fit=crop', // الكعبة المشرفة
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1080&auto=format&fit=crop'  // المسجد الأزرق
  ];
  const randomBg = adhanBgs[Math.floor(Math.random() * adhanBgs.length)];

  // بناء كونتينر الشاشة الكاملة العابرة لكل شيء
  const fullScreen = document.createElement('div');
  fullScreen.id = 'fullAdhanScreen';
  fullScreen.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999999999;
    background-image: url('${randomBg}'); background-size: cover; background-position: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'Amiri', serif; direction: rtl; text-align: center; padding: 20px;
  `;

  fullScreen.innerHTML = `
    <!-- طبقة تعتيم ناعمة تبرز الكلام والذهب -->
    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.65); z-index: 1;"></div>
    
    <!-- محتوى الأذان الروحاني المعلق -->
    <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <div style="font-size: 80px; animation: pulse 2s infinite;">🕌</div>
      <h1 style="color: #d4af37; font-size: 32px; font-weight: bold; text-shadow: 0 4px 15px rgba(0,0,0,0.8);">حَانَ الآنَ وَقْتُ صَلَاةِ ${adhanPrayerNamesAr[prayerKey]}</h1>
      <p style="color: #f4f6f4; font-size: 20px; font-style: italic; max-width: 300px; line-height: 1.8;">
        ${prayerKey === 'Fajr' ? 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ' : 'أرِحْنَا بِهَا يَا بِلَالُ.. حَيَّ عَلَى الصَّلَاةِ'}
      </p>
      
      <!-- زر الإيقاف الفخم الدائري المندمج -->
      <button onclick="stopFullAdhanPlayback()" style="margin-top: 40px; background: transparent; border: 2px solid #ff6b6b; color: #ff6b6b; padding: 12px 45px; border-radius: 30px; font-size: 16px; font-weight: bold; cursor: pointer; font-family: 'Amiri', serif; transition: all 0.3s; box-shadow: 0 0 15px rgba(255,107,107,0.3);">
        🛑 إيقاف صوت الأذان
      </button>
    </div>
  `;

  document.body.appendChild(fullScreen);

  // حقن أنيميشن النبض الروحي للهلال أو المسجد
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

// دالة الإغلاق الكامل لشاشة الرن
window.stopFullAdhanPlayback = function() {
  stopAdhanPlayback();
  const fullScreen = document.getElementById('fullAdhanScreen');
  if (fullScreen) fullScreen.remove();
};
