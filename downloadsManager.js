// ==========================================================
// 📥 مدير التنزيلات — عرض وحذف وتحميل كل ما هو محفوظ أوفلاين
// ==========================================================

const AUDIO_CACHE_NAME = 'athr-audio-cache-v1';
const MUSHAF_CACHE_NAME = 'athr-mushaf-cache-v1';

const dmReciters = [
  { id: 'minsh',  label: 'المنشاوي',        urlFn: n => `https://server10.mp3quran.net/minsh/${n}.mp3` },
  { id: 'husary', label: 'الحصري',          urlFn: n => `https://server13.mp3quran.net/husr/${n}.mp3` },
  { id: 'afs',    label: 'مشاري العفاسي',   urlFn: n => `https://server8.mp3quran.net/afs/${n}.mp3` },
  { id: 'basit',  label: 'عبد الباسط',      urlFn: n => `https://server7.mp3quran.net/basit/${n}.mp3` },
  { id: 'maher',  label: 'ماهر المعيقلي',   urlFn: n => `https://server12.mp3quran.net/maher/${n}.mp3` },
  { id: 'ajm',    label: 'أحمد العجمي',     urlFn: n => `https://server10.mp3quran.net/ajm/${n}.mp3` },
  { id: 'shrim',  label: 'سعود الشريم',     urlFn: n => `https://server7.mp3quran.net/shur/${n}.mp3` },
  { id: 'dosr',   label: 'ياسر الدوسري',    urlFn: n => `https://server11.mp3quran.net/yasser/${n}.mp3` },
];

let dmActiveReciter = 'minsh';
let dmCachedUrlsSet = new Set();

// ---------- جلب حالة الكاش ----------
async function dmRefreshCachedSet() {
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    const keys = await cache.keys();
    dmCachedUrlsSet = new Set(keys.map(k => k.url));
  } catch (e) { dmCachedUrlsSet = new Set(); }
}

async function dmGetMushafCount() {
  try {
    const cache = await caches.open(MUSHAF_CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch (e) { return 0; }
}

// ---------- الدخول للصفحة ----------
window.initDownloadsManager = async function() {
  const container = document.getElementById('downloadsManagerContainer');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text2); font-family:'Amiri',serif;">⏳ جاري فحص الملفات المحفوظة على جهازك...</div>`;

  await dmRefreshCachedSet();
  const mushafCount = await dmGetMushafCount();
  renderDmMainUI(mushafCount);
};

function renderDmMainUI(mushafCount) {
  const container = document.getElementById('downloadsManagerContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align:center; margin-bottom:18px;">
      <h2 style="color:var(--gold); font-family:'Amiri',serif; font-size:22px;">📥 إدارة التنزيلات</h2>
      <p style="color:var(--text2); font-size:12px;">اعرف إيه المتحمل على جهازك، وحمّل أو احذف بسهولة</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
      <div class="stat-card">
        <div class="stat-num" style="font-size:22px;" id="dmTotalAudioCount">${toAr(dmCachedUrlsSet.size)}</div>
        <div class="stat-label">ملف صوتي محفوظ</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="font-size:22px;" id="dmMushafCountNum">${toAr(mushafCount)}<span style="font-size:12px;">/٦٠٤</span></div>
        <div class="stat-label">صفحة مصحف محفوظة</div>
      </div>
    </div>

    <!-- المصحف -->
    <div style="background:var(--card); border-radius:16px; padding:16px; border:1px solid var(--border); margin-bottom:16px; border-right:4px solid var(--gold);">
      <div style="font-size:14px; color:var(--gold); font-weight:700; margin-bottom:8px;">📖 المصحف المصوّر كامل</div>
      <div id="dmMushafStatusText" style="font-size:12px; color:var(--text2); margin-bottom:10px;">${dmMushafStatusMsg(mushafCount)}</div>
      <div style="display:flex; gap:8px;">
        <button onclick="window.dmDownloadMushaf()" style="flex:1; background:var(--gold); color:#111; border:none; padding:10px; border-radius:10px; font-family:'Amiri',serif; font-weight:700; cursor:pointer; font-size:13px;">⬇️ تحميل المصحف</button>
        <button onclick="window.dmDeleteMushaf()" style="background:transparent; border:1px solid rgba(255,100,100,0.4); color:#ff6b6b; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; font-family:'Amiri',serif; ${mushafCount === 0 ? 'display:none;' : ''}" id="dmDeleteMushafBtn">🗑️ حذف</button>
      </div>
      <div id="dmMushafProgressWrap" style="display:none; margin-top:10px;">
        <div style="width:100%; height:6px; background:var(--border); border-radius:3px; overflow:hidden;">
          <div id="dmMushafProgressBar" style="height:100%; width:0%; background:var(--gold); transition:width 0.2s;"></div>
        </div>
        <div id="dmMushafProgressText" style="font-size:11px; color:var(--text2); margin-top:6px; text-align:center;"></div>
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
      <div style="font-size:14px; color:#8fbf92; font-weight:700; margin-bottom:8px;">🎙️ التلاوات الخاشعة</div>
      <div id="dmRareSummary" style="font-size:12px; color:var(--text2); margin-bottom:10px;"></div>
      <button onclick="window.dmDeleteAllRare()" style="width:100%; background:transparent; border:1px solid rgba(255,100,100,0.4); color:#ff6b6b; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif;">🗑️ حذف كل التلاوات الخاشعة المحفوظة</button>
    </div>

    <!-- الأذان -->
    <div style="background:var(--card); border-radius:16px; padding:16px; border:1px solid var(--border); margin-bottom:16px; border-right:4px solid #e0a45c;">
      <div style="font-size:14px; color:#e0a45c; font-weight:700; margin-bottom:8px;">🕌 أصوات الأذان</div>
      <div id="dmAdhanSummary" style="font-size:12px; color:var(--text2); margin-bottom:10px;"></div>
      <button onclick="window.dmDeleteAllAdhan()" style="width:100%; background:transparent; border:1px solid rgba(255,100,100,0.4); color:#ff6b6b; padding:9px; border-radius:10px; cursor:pointer; font-size:12px; font-family:'Amiri',serif;">🗑️ حذف كل أصوات الأذان المحفوظة</button>
    </div>

    <button onclick="window.dmDeleteEverything()" style="width:100%; background:rgba(255,0,0,0.08); border:1px solid #ff4d4d; color:#ff4d4d; padding:13px; border-radius:14px; font-family:'Amiri',serif; font-weight:700; cursor:pointer; margin-top:6px;">🗑️ حذف كل التنزيلات نهائيًا (تفريغ المساحة)</button>
  `;

  renderDmSurahsList();
  renderDmRareSummary();
  renderDmAdhanSummary();
}

function dmMushafStatusMsg(count) {
  if (count >= 604) return '✅ محفوظ بالكامل ويعمل بدون إنترنت';
  if (count > 0) return `تم حفظ ${toAr(count)} من ٦٠٤ صفحة فقط`;
  return 'لم يتم حفظ أي صفحة بعد';
}

// ---------- قسم السور ----------
window.dmSwitchReciter = function(id) {
  dmActiveReciter = id;
  renderDmMainUI(document.getElementById('dmMushafCountNum') ? parseInt(document.getElementById('dmMushafCountNum').textContent) || 0 : 0);
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
  const downloadedCount = items.filter(i => dmCachedUrlsSet.has(i.url)).length;
  if (summaryEl) summaryEl.textContent = `محمّل ${toAr(downloadedCount)} من ١١٤ سورة`;

  listEl.innerHTML = items.map(i => {
    const isDownloaded = dmCachedUrlsSet.has(i.url);
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
  const isDownloaded = dmCachedUrlsSet.has(url);

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
  const downloaded = urls.filter(u => dmCachedUrlsSet.has(u)).length;
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

// ---------- الأذان ----------
function dmAdhanUrls() {
  const fajr = (typeof fajrAdhanOptions !== 'undefined') ? fajrAdhanOptions.map(o => o.file) : [];
  const reg  = (typeof regularAdhanOptions !== 'undefined') ? regularAdhanOptions.map(o => o.file) : [];
  return [...fajr, ...reg];
}

function renderDmAdhanSummary() {
  const el = document.getElementById('dmAdhanSummary');
  if (!el) return;
  const urls = dmAdhanUrls();
  const downloaded = urls.filter(u => dmCachedUrlsSet.has(u)).length;
  el.textContent = `محمّل ${toAr(downloaded)} من ${toAr(urls.length)} صوت أذان`;
}

window.dmDeleteAllAdhan = async function() {
  if (!confirm('متأكد إنك عايز تحذف كل أصوات الأذان المحفوظة؟')) return;
  const cache = await caches.open(AUDIO_CACHE_NAME);
  for (const u of dmAdhanUrls()) {
    await cache.delete(u);
    dmCachedUrlsSet.delete(u);
  }
  dmUpdateTotalAudioCount();
  renderDmAdhanSummary();
  alert('تم الحذف ✅');
};

// ---------- المصحف ----------
window.dmDownloadMushaf = function() {
  if (!navigator.serviceWorker.controller) { alert('استنى شوية وحاول تاني 🙏'); return; }
  document.getElementById('dmMushafProgressWrap').style.display = 'block';
  navigator.serviceWorker.controller.postMessage({ type: 'DOWNLOAD_MUSHAF' });
};

window.dmDeleteMushaf = async function() {
  if (!confirm('متأكد إنك عايز تحذف المصحف المحفوظ بالكامل؟')) return;
  if (!navigator.serviceWorker.controller) return;
  navigator.serviceWorker.controller.postMessage({ type: 'DELETE_MUSHAF_CACHE' });
};

// ---------- حذف الكل ----------
window.dmDeleteEverything = async function() {
  if (!confirm('هيتم حذف كل الملفات الصوتية وصفحات المصحف المحفوظة نهائيًا، متأكد؟')) return;
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'DELETE_ALL_AUDIO' });
    navigator.serviceWorker.controller.postMessage({ type: 'DELETE_MUSHAF_CACHE' });
  }
  setTimeout(async () => {
    await dmRefreshCachedSet();
    const mushafCount = await dmGetMushafCount();
    renderDmMainUI(mushafCount);
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
    if (text) text.textContent = `جاري التحميل... ${toAr(d.done)} / ${toAr(d.total)}`;
  }
  if (d.type === 'BATCH_DONE') {
    const wrap = document.getElementById('dmReciterBatchProgress');
    if (wrap) wrap.style.display = 'none';
    dmRefreshCachedSet().then(() => { dmUpdateTotalAudioCount(); renderDmSurahsList(); });
    alert(`✅ اكتمل تحميل ${toAr(d.done - d.failed)} سورة${d.failed > 0 ? ` (فشل ${toAr(d.failed)})` : ''}`);
  }

  // المصحف
  if (d.type === 'MUSHAF_PROGRESS') {
    const pct = Math.round((d.done / d.total) * 100);
    const bar = document.getElementById('dmMushafProgressBar');
    const text = document.getElementById('dmMushafProgressText');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = `جاري التحميل... ${toAr(d.done)} / ${toAr(d.total)}`;
  }
  if (d.type === 'MUSHAF_DONE') {
    const wrapEl = document.getElementById('dmMushafProgressWrap');
    if (wrapEl) wrapEl.style.display = 'none';
    dmGetMushafCount().then(count => {
      const numEl = document.getElementById('dmMushafCountNum');
      const statusEl = document.getElementById('dmMushafStatusText');
      const delBtn = document.getElementById('dmDeleteMushafBtn');
      if (numEl) numEl.innerHTML = `${toAr(count)}<span style="font-size:12px;">/٦٠٤</span>`;
      if (statusEl) statusEl.textContent = dmMushafStatusMsg(count);
      if (delBtn) delBtn.style.display = count > 0 ? 'block' : 'none';
    });
    alert(`✅ تم تحميل المصحف (فشل ${toAr(d.failed)} صفحة فقط)`);
  }
  if (d.type === 'MUSHAF_DELETED') {
    const numEl = document.getElementById('dmMushafCountNum');
    const statusEl = document.getElementById('dmMushafStatusText');
    const delBtn = document.getElementById('dmDeleteMushafBtn');
    if (numEl) numEl.innerHTML = `٠<span style="font-size:12px;">/٦٠٤</span>`;
    if (statusEl) statusEl.textContent = dmMushafStatusMsg(0);
    if (delBtn) delBtn.style.display = 'none';
    alert('تم حذف المصحف المحفوظ ✅');
  }

  // حذف كل الصوتيات
  if (d.type === 'AUDIO_CACHE_CLEARED') {
    dmCachedUrlsSet = new Set();
    dmUpdateTotalAudioCount();
    renderDmSurahsList();
    renderDmRareSummary();
    renderDmAdhanSummary();
  }
});
