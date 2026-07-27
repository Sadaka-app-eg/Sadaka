// ==========================================================
// 📥 مدير التنزيلات — عرض وحذف وتحميل كل ما هو محفوظ أوفلاين
// ==========================================================

const AUDIO_CACHE_NAME = 'athr-audio-cache-v1';
function getAbsUrl(url) {
  if (!url) return '';
  try { return new URL(url, window.location.href).href; } catch(e) { return url; }
}
const dmReciters = [
  { id: 'minsh',  label: 'المنشاوي',          urlFn: n => `https://server10.mp3quran.net/minsh/${n}.mp3` },
  { id: 'husary', label: 'الحصري',          urlFn: n => `https://server13.mp3quran.net/husr/${n}.mp3` },
  { id: 'afs',    label: 'مشاري العفاسي',      urlFn: n => `https://server8.mp3quran.net/afs/${n}.mp3` },
  { id: 'basit',  label: 'عبد الباسط',         urlFn: n => `https://server7.mp3quran.net/basit/${n}.mp3` },
  { id: 'maher',  label: 'ماهر المعيقلي',       urlFn: n => `https://server12.mp3quran.net/maher/${n}.mp3` },
  { id: 'ajm',    label: 'أحمد العجمي',       urlFn: n => `https://server10.mp3quran.net/ajm/${n}.mp3` },
  { id: 'shrim',  label: 'سعود الشريم',       urlFn: n => `https://server7.mp3quran.net/shur/${n}.mp3` },
  { id: 'dosr',   label: 'ياسر الدوسري',      urlFn: n => `https://server11.mp3quran.net/yasser/${n}.mp3` },
];

let dmActiveReciter = 'minsh';
let dmCachedUrlsSet = new Set();
function dmFormatBytes(bytes) {
  if (!bytes || bytes <= 0) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} ميجا` : `${Math.round(bytes / 1024)} كيلوبايت`;
}
// ---------- جلب حالة الكاش ----------
async function dmRefreshCachedSet() {
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    const keys = await cache.keys();
    dmCachedUrlsSet = new Set(keys.map(k => k.url));
  } catch (e) { dmCachedUrlsSet = new Set(); }
}



window.initDownloadsManager = async function() {
  const container = document.getElementById('downloadsManagerContainer');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text2); font-family:'Amiri',serif;">⏳ جاري فحص الملفات المحفوظة على جهازك...</div>`;

  await dmRefreshCachedSet();
  renderDmMainUI();
};

function renderDmMainUI() {
  const container = document.getElementById('downloadsManagerContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align:center; margin-bottom:18px;">
      <h2 style="color:var(--gold); font-family:'Amiri',serif; font-size:22px;">📥 إدارة التنزيلات</h2>
      <p style="color:var(--text2); font-size:12px;">اعرف إيه المتحمل على جهازك، وحمّل أو احذف بسهولة</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr ; gap:10px; margin-bottom:16px;">
      <div class="stat-card">
        <div class="stat-num" style="font-size:22px;" id="dmTotalAudioCount">${toAr(dmCachedUrlsSet.size)}</div>
        <div class="stat-label">ملف صوتي محفوظ</div>
      </div>
  
    </div>

    <!-- تلاوات السور -->
    <div style="background:var(--card); border-radius:16px; padding:16px; border:1px solid var(--border); margin-bottom:16px; border-right:4px solid var(--green);">
      <div style="font-size:14px; color:var(--green); font-weight:700; margin-bottom:10px;">🎧 تلاوات السور (١١٤ سورة)</div>
      <div class="azkar-cats" style="margin-bottom:12px;">
        ${dmReciters.map(r => `<button class="cat-btn ${dmActiveReciter===r.id?'active':''}" onclick="window.dmSwitchReciter('${r.id}')">${r.label}</button>`).join('')}
      </div>
      <div id="dmReciterSummary" style="font-size:12px; color:var(--text2); margin-bottom:10px;"></div>
      <div id="dmReciterBatchProgress" style="display:none; margin-bottom:10px;">
        <div style="width:100%; height:6px; background:var(--border); border-radius:3px; overflow:hidden;">
          <div id="dmReciterBatchBar" style="height:100%; width:0%; background:var(--green); transition:width 0.2s;"></div>
        </div>
        <div id="dmReciterBatchText" style="font-size:11px; color:var(--text2); margin-top:6px; text-align:center;"></div>
      </div>
      <div style="display:flex; gap:8px; margin-bottom:12px;">
        <button onclick="window.dmDownloadAllForReciter()" style="flex:1; background:var(--green); color:#fff; border:none; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif; font-weight:700;">⬇️ تحميل كل سور هذا القارئ</button>
        <button onclick="window.dmDeleteAllForReciter()" style="flex:1; background:transparent; border:1px solid rgba(255,100,100,0.4); color:#ff6b6b; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif;">🗑️ حذف الكل</button>
      </div>
      <div id="dmSurahsList" style="display:grid; gap:6px; max-height:400px; overflow-y:auto;"></div>
    </div>

<!-- التلاوات الخاشعة -->
    <div style="background:var(--card); border-radius:16px; padding:16px; border:1px solid var(--border); margin-bottom:16px; border-right:4px solid #7a9a7d;">
      <div style="font-size:14px; color:#8fbf92; font-weight:700; margin-bottom:10px;">🎙️ التلاوات الخاشعة</div>
      <div class="azkar-cats" style="margin-bottom:12px;">
        ${window.dmRareReciters.map(r => `<button class="cat-btn ${window.dmActiveRareReciter===r?'active':''}" onclick="window.dmSwitchRareReciter('${r}')">${r}</button>`).join('')}
      </div>
      <div id="dmRareSummary" style="font-size:12px; color:var(--text2); margin-bottom:10px;"></div>
      <div style="display:flex; gap:8px; margin-bottom:12px;">
        <button onclick="window.dmDownloadAllForRareReciter()" style="flex:1; background:var(--green); color:#fff; border:none; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif; font-weight:700;">⬇️ تحميل تلاوات هذا القارئ</button>
        <button onclick="window.dmDeleteAllForRareReciter()" style="flex:1; background:transparent; border:1px solid rgba(255,100,100,0.4); color:#ff6b6b; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif;">🗑️ حذف تلاوات هذا القارئ</button>
      </div>
      <div id="dmRareList" style="display:grid; gap:6px; max-height:300px; overflow-y:auto;"></div>
    </div>

<!-- المواعظ والدروس -->
    <div style="background:var(--card); border-radius:16px; padding:16px; border:1px solid var(--border); margin-bottom:16px; border-right:4px solid var(--gold);">
      <div style="font-size:14px; color:var(--gold); font-weight:700; margin-bottom:10px;">🎙️ المواعظ والدروس العلمية</div>
      <div class="azkar-cats" style="margin-bottom:12px;">
        ${window.dmLectureCats.map(c => `<button class="cat-btn ${window.dmActiveLectureCat===c?'active':''}" onclick="window.dmSwitchLectureCat('${c}')">${c}</button>`).join('')}
      </div>
      <div id="dmLecturesSummary" style="font-size:12px; color:var(--text2); margin-bottom:10px;"></div>
      <div style="display:flex; gap:8px; margin-bottom:12px;">
        <button onclick="window.dmDownloadAllForLectureCat()" style="flex:1; background:var(--gold); color:#111; border:none; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif; font-weight:700;">⬇️ تحميل دروس هذا القسم</button>
        <button onclick="window.dmDeleteAllForLectureCat()" style="flex:1; background:transparent; border:1px solid rgba(255,100,100,0.4); color:#ff6b6b; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif;">🗑️ حذف دروس هذا القسم</button>
      </div>
      <div id="dmLecturesList" style="display:grid; gap:6px; max-height:300px; overflow-y:auto;"></div>
    </div>

    <button onclick="window.dmDeleteEverything()" style="width:100%; background:rgba(255,0,0,0.08); border:1px solid #ff4d4d; color:#ff4d4d; padding:13px; border-radius:14px; font-family:'Amiri',serif; font-weight:700; cursor:pointer; margin-top:6px;">🗑️ حذف كل التنزيلات نهائيًا (تفريغ المساحة)</button>
  `;

  renderDmSurahsList();
 renderDmRareList();
  renderDmLecturesList();
}


window.dmSwitchReciter = function(id) {
  dmActiveReciter = id;
  renderDmMainUI();
};

function dmReciterSurahUrls() {
  const reciter = dmReciters.find(r => r.id === dmActiveReciter);
  return surahs.map(s => ({
    n: s.n,
    name: s.name,
    url: reciter.urlFn(String(s.n).padStart(3, '0'))
  }));
}

function renderDmSurahsList() {
  const listEl = document.getElementById('dmSurahsList');
  const summaryEl = document.getElementById('dmReciterSummary');
  if (!listEl) return;

  const items = dmReciterSurahUrls();
const downloadedCount = items.filter(i => dmCachedUrlsSet.has(getAbsUrl(i.url))).length;
  if (summaryEl) summaryEl.textContent = `محمّل ${toAr(downloadedCount)} من ١١٤ سورة`;

  listEl.innerHTML = items.map(i => {
const isDownloaded = dmCachedUrlsSet.has(getAbsUrl(i.url));
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:8px 12px;">
        <span style="font-size:13px; color:var(--text); font-family:'Amiri',serif;">${toAr(i.n)}. ${i.name}</span>
        <button id="dm_surah_${i.n}" onclick="window.dmToggleSurah(${i.n}, '${i.url}')" style="font-size:11px; padding:5px 10px; border-radius:8px; cursor:pointer; font-family:'Amiri',serif; border:1px solid ${isDownloaded ? '#4caf50' : 'var(--border)'}; background:${isDownloaded ? 'rgba(76,175,80,0.12)' : 'var(--bg3)'}; color:${isDownloaded ? '#4caf50' : 'var(--gold)'};">
          ${isDownloaded ? '✅ محمّل' : '⬇️ تحميل'}
        </button>
      </div>
    `;
  }).join('');
}

window.dmToggleSurah = async function(n, url) {
  const btn = document.getElementById('dm_surah_' + n);
const isDownloaded = dmCachedUrlsSet.has(getAbsUrl(url));
  if (isDownloaded) {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    await cache.delete(url);
    dmCachedUrlsSet.delete(url);
    if (btn) { btn.textContent = '⬇️ تحميل'; btn.style.borderColor = 'var(--border)'; btn.style.background = 'var(--bg3)'; btn.style.color = 'var(--gold)'; }
  } else {
    if (btn) btn.textContent = '⏳';
    if (!navigator.serviceWorker.controller) { alert('استنى شوية وحاول تاني 🙏'); return; }
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_AUDIO_URL', url, label: 'dm_surah_' + n });
  }
  dmUpdateTotalAudioCount();
  renderDmSurahsList();
};

window.dmDownloadAllForReciter = async function() {
  if (!confirm('هيتم تحميل ١١٤ سورة، ده هياخد وقت ومساحة، تحب تكمل؟')) return;
  if (!navigator.serviceWorker.controller) { alert('استنى شوية وحاول تاني 🙏'); return; }

  const items = dmReciterSurahUrls()
    .filter(i => !dmCachedUrlsSet.has(i.url))
    .map(i => ({ url: i.url, batchId: 'reciter_' + dmActiveReciter }));

  if (items.length === 0) { alert('كل سور هذا القارئ محمّلة بالفعل ✅'); return; }

  document.getElementById('dmReciterBatchProgress').style.display = 'block';
  navigator.serviceWorker.controller.postMessage({ type: 'CACHE_AUDIO_BATCH', items });
};

window.dmDeleteAllForReciter = async function() {
  if (!confirm('متأكد إنك عايز تحذف كل سور هذا القارئ المحفوظة؟')) return;
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const items = dmReciterSurahUrls();
  for (const i of items) {
    await cache.delete(i.url);
    dmCachedUrlsSet.delete(i.url);
  }
  dmUpdateTotalAudioCount();
  renderDmSurahsList();
  alert('تم الحذف ✅');
};

// ---------- التلاوات الخاشعة ----------
function dmRareUrls() {
  return (window.rareRecitations || []).map(r => r.url);
}

function renderDmRareSummary() {
  const el = document.getElementById('dmRareSummary');
  if (!el) return;
  const urls = dmRareUrls();
const downloaded = urls.filter(u => dmCachedUrlsSet.has(getAbsUrl(u))).length;  
  el.textContent = urls.length === 0 ? 'جاري تحميل القائمة...' : `محمّل ${toAr(downloaded)} من ${toAr(urls.length)} تلاوة`;
}

window.dmDeleteAllRare = async function() {
  if (!confirm('متأكد إنك عايز تحذف كل التلاوات الخاشعة المحفوظة؟')) return;
  const cache = await caches.open(AUDIO_CACHE_NAME);
  for (const u of dmRareUrls()) {
    await cache.delete(u);
    dmCachedUrlsSet.delete(u);
  }
  dmUpdateTotalAudioCount();
  renderDmRareSummary();
  alert('تم الحذف ✅');
};



window.dmDeleteEverything = async function() {
  if (!confirm('هيتم حذف كل الملفات الصوتية والدروس المحفوظة نهائيًا، متأكد؟')) return;
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'DELETE_ALL_AUDIO' });
  }
  setTimeout(async () => {
    await dmRefreshCachedSet();
    renderDmMainUI();
    alert('تم حذف كل التنزيلات ✅');
  }, 600);
};

// ---------- مساعد لتحديث العداد العلوي ----------
function dmUpdateTotalAudioCount() {
  const el = document.getElementById('dmTotalAudioCount');
  if (el) el.textContent = toAr(dmCachedUrlsSet.size);
}

// ---------- استقبال ردود الـ Service Worker ----------
navigator.serviceWorker.addEventListener('message', (event) => {
  const d = event.data;
  if (!d) return;

  // تحميل سورة مفردة
  if (d.type === 'AUDIO_CACHED' && d.label && d.label.startsWith('dm_surah_')) {
    const n = d.label.replace('dm_surah_', '');
    dmCachedUrlsSet.add(d.url);
    dmUpdateTotalAudioCount();
    renderDmSurahsList();
  }
  if (d.type === 'AUDIO_CACHE_FAILED' && d.label && d.label.startsWith('dm_surah_')) {
    renderDmSurahsList();
  }

  // تحميل دفعة (كل سور قارئ)
 if (d.type === 'BATCH_PROGRESS') {
    const bar = document.getElementById('dmReciterBatchBar');
    const text = document.getElementById('dmReciterBatchText');
    if (bar) bar.style.width = Math.round((d.done / d.total) * 100) + '%';
    if (text) text.textContent = `جاري التحميل... ${toAr(d.done)} / ${toAr(d.total)} — ${dmFormatBytes(d.totalBytes)}`;
  }
  if (d.type === 'BATCH_DONE') {
    const wrap = document.getElementById('dmReciterBatchProgress');
    if (wrap) wrap.style.display = 'none';
    dmRefreshCachedSet().then(() => { dmUpdateTotalAudioCount(); renderDmSurahsList(); });
    alert(`✅ اكتمل تحميل ${toAr(d.done - d.failed)} سورة${d.failed > 0 ? ` (فشل ${toAr(d.failed)})` : ''}`);
  }




  // حذف كل الصوتيات
  if (d.type === 'AUDIO_CACHE_CLEARED') {
    dmCachedUrlsSet = new Set();
    dmUpdateTotalAudioCount();
    renderDmSurahsList();
    renderDmRareSummary();
    renderDmLecturesSummary(); // 👈 أضف هذا السطر هنا
  }
});
// ---------- المواعظ والدروس ----------
function dmLecturesUrls() {
  return (window.lecturesData || []).map(l => l.src).filter(Boolean);
}

function renderDmLecturesSummary() {
  const el = document.getElementById('dmLecturesSummary');
  if (!el) return;
  const urls = dmLecturesUrls();
const downloaded = urls.filter(u => dmCachedUrlsSet.has(getAbsUrl(u))).length;  
  el.textContent = urls.length === 0 ? 'لا توجد دروس حالياً' : `محمّل ${toAr(downloaded)} من ${toAr(urls.length)} درس وموعظة أوفلاين`;
}

window.dmDeleteAllLectures = async function() {
  if (!confirm('متأكد إنك عايز تحذف كل المواعظ والدروس المحفوظة؟')) return;
  const cache = await caches.open(AUDIO_CACHE_NAME);
  for (const u of dmLecturesUrls()) {
    const abs = getAbsUrl(u);
    await cache.delete(abs);
    dmCachedUrlsSet.delete(abs);
  }
  dmUpdateTotalAudioCount();
  renderDmLecturesSummary();
  alert('تم حذف الدروس والمواعظ المحفوظة بنجاح ✅');
};
// ==================== التلاوات الخاشعة (بالقراء) ====================
window.dmRareReciters = ["محمد عباده", "منشاوي", "أحمد النفيس", "حسن فهمي", "أسامة عمران", "عبدالرحمن مسعد", "إسلام صبحي", "ياسر الدوسري", "محمود علي البنا", "شعبان الصياد", "أحمد كاسب", "أحمد عبدالرازق نصر", "أحمد بن طالب", "أدعية خاشعة", "أناشيد"];
window.dmActiveRareReciter = "محمد عباده";

window.dmSwitchRareReciter = function(sheikh) {
  window.dmActiveRareReciter = sheikh;
  renderDmMainUI();
};

function renderDmRareList() {
  const listEl = document.getElementById('dmRareList');
  const summaryEl = document.getElementById('dmRareSummary');
  if (!listEl) return;

  const allItems = window.rareRecitations || [];
  const filtered = allItems.filter(r => r.tag === window.dmActiveRareReciter);
  const downloadedCount = filtered.filter(i => dmCachedUrlsSet.has(getAbsUrl(i.url))).length;

  if (summaryEl) summaryEl.textContent = `محمّل ${toAr(downloadedCount)} من ${toAr(filtered.length)} تلاوة لهذا القارئ`;

  listEl.innerHTML = filtered.map(item => {
    const abs = getAbsUrl(item.url);
    const isDownloaded = dmCachedUrlsSet.has(abs);
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:8px 12px; gap:8px;">
        <span style="font-size:12px; color:var(--text); font-family:'Amiri',serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; text-align:right;">${item.name}</span>
        <button onclick="window.dmToggleSingleItem('${item.url}')" style="font-size:11px; padding:5px 12px; border-radius:8px; cursor:pointer; font-family:'Amiri',serif; border:1px solid ${isDownloaded ? '#4caf50' : 'var(--border)'}; background:${isDownloaded ? 'rgba(76,175,80,0.12)' : 'var(--bg3)'}; color:${isDownloaded ? '#4caf50' : 'var(--gold)'}; white-space:nowrap;">
          ${isDownloaded ? '✅ محمّل (حذف)' : '⬇️ تحميل'}
        </button>
      </div>
    `;
  }).join('');
}

window.dmDownloadAllForRareReciter = async function() {
  const filtered = (window.rareRecitations || []).filter(r => r.tag === window.dmActiveRareReciter && !dmCachedUrlsSet.has(getAbsUrl(r.url)));
  if (filtered.length === 0) { alert('كل تلاوات هذا القارئ محمّلة بالفعل ✅'); return; }
  for (const item of filtered) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_AUDIO_URL', url: getAbsUrl(item.url), label: 'dm_rare' });
    }
  }
  alert(`⏳ جاري تحميل ${toAr(filtered.length)} تلاوة في الخلفية...`);
};

window.dmDeleteAllForRareReciter = async function() {
  if (!confirm(`متأكد إنك عايز تحذف تلاوات ${window.dmActiveRareReciter}؟`)) return;
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const filtered = (window.rareRecitations || []).filter(r => r.tag === window.dmActiveRareReciter);
  for (const i of filtered) {
    const abs = getAbsUrl(i.url);
    await cache.delete(abs);
    dmCachedUrlsSet.delete(abs);
  }
  dmUpdateTotalAudioCount();
  renderDmRareList();
  alert('تم الحذف ✅');
};


// ==================== المواعظ والدروس (بالأقسام) ====================
window.dmLectureCats = ["مواعظ متنوعة", "دورة التجويد", "السيرة النبوية", "الفقه الميسر", "رحلة إلى الدار الآخرة", "قصص الأنبياء", "سير الصحابة", "روائع التابعين", "مفسدات القلوب", "أصول الانحراف", "البيت المسلم", "أصول العقيدة", "محاضرات المشايخ"];
window.dmActiveLectureCat = "مواعظ متنوعة";

window.dmSwitchLectureCat = function(cat) {
  window.dmActiveLectureCat = cat;
  renderDmMainUI();
};

function renderDmLecturesList() {
  const listEl = document.getElementById('dmLecturesList');
  const summaryEl = document.getElementById('dmLecturesSummary');
  if (!listEl) return;

  const allItems = window.lecturesData || [];
  const filtered = allItems.filter(l => l.category === window.dmActiveLectureCat);
  const downloadedCount = filtered.filter(i => dmCachedUrlsSet.has(getAbsUrl(i.src))).length;

  if (summaryEl) summaryEl.textContent = `محمّل ${toAr(downloadedCount)} من ${toAr(filtered.length)} درس/موعظة لهذا القسم`;

  listEl.innerHTML = filtered.map(item => {
    const abs = getAbsUrl(item.src);
    const isDownloaded = dmCachedUrlsSet.has(abs);
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:8px 12px; gap:8px;">
        <span style="font-size:12px; color:var(--text); font-family:'Amiri',serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; text-align:right;">${item.title}</span>
        <button onclick="window.dmToggleSingleItem('${item.src}')" style="font-size:11px; padding:5px 12px; border-radius:8px; cursor:pointer; font-family:'Amiri',serif; border:1px solid ${isDownloaded ? '#4caf50' : 'var(--border)'}; background:${isDownloaded ? 'rgba(76,175,80,0.12)' : 'var(--bg3)'}; color:${isDownloaded ? '#4caf50' : 'var(--gold)'}; white-space:nowrap;">
          ${isDownloaded ? '✅ محمّل (حذف)' : '⬇️ تحميل'}
        </button>
      </div>
    `;
  }).join('');
}

window.dmDownloadAllForLectureCat = async function() {
  const filtered = (window.lecturesData || []).filter(l => l.category === window.dmActiveLectureCat && !dmCachedUrlsSet.has(getAbsUrl(l.src)));
  if (filtered.length === 0) { alert('كل دروس هذا القسم محمّلة بالفعل ✅'); return; }
  for (const item of filtered) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_AUDIO_URL', url: getAbsUrl(item.src), label: 'dm_lecture' });
    }
  }
  alert(`⏳ جاري تحميل ${toAr(filtered.length)} درس في الخلفية...`);
};

window.dmDeleteAllForLectureCat = async function() {
  if (!confirm(`متأكد إنك عايز تحذف دروس قسم [${window.dmActiveLectureCat}]؟`)) return;
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const filtered = (window.lecturesData || []).filter(l => l.category === window.dmActiveLectureCat);
  for (const i of filtered) {
    const abs = getAbsUrl(i.src);
    await cache.delete(abs);
    dmCachedUrlsSet.delete(abs);
  }
  dmUpdateTotalAudioCount();
  renderDmLecturesList();
  alert('تم الحذف ✅');
};

// دالة عامة لتبديل تحميل/حذف عنصر مفرد
window.dmToggleSingleItem = async function(url) {
  const abs = getAbsUrl(url);
  const cache = await caches.open(AUDIO_CACHE_NAME);
  if (dmCachedUrlsSet.has(abs)) {
    await cache.delete(abs);
    dmCachedUrlsSet.delete(abs);
  } else {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_AUDIO_URL', url: abs, label: 'dm_single' });
      dmCachedUrlsSet.add(abs);
    }
  }
  dmUpdateTotalAudioCount();
  renderDmRareList();
  renderDmLecturesList();
};
