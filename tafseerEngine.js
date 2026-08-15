// =========================================================================
// 📖 محرك التفاسير العشرة الموحّد - تطبيق أثر
// يحلّ أرقام التفاسير ديناميكيًا من API الحقيقي (مش أرقام مخمّنة)
// + عين إخفاء/إظهار الآية + نسخ + تحميل أوفلاين بشريط تقدم + سحب باليد
// =========================================================================

// الأسماء العشرة المطلوبة، وكلمات المطابقة اللي هيدور بيها على الـ ID الصحيح
const TAFSIR_TARGETS = [
  { key: 'muyassar',   label: 'الميسر',             match: ['ميسر'] },
  { key: 'mukhtasar',  label: 'المختصر في التفسير', match: ['مختصر في التفسير'] },
  { key: 'ibnkathir',  label: 'ابن كثير',           match: ['ابن كثير'] },
  { key: 'qurtubi',    label: 'القرطبي',            match: ['قرطبي'] },
  { key: 'tabari',     label: 'الطبري',             match: ['طبري'] },
  { key: 'saadi',      label: 'السعدي',             match: ['سعدي'] },
  { key: 'baghawi',    label: 'البغوي',             match: ['بغوي'] },
  { key: 'jalalayn',   label: 'الجلالين',           match: ['جلالين'] },
  { key: 'ibnashur',   label: 'التحرير والتنوير',   match: ['ابن عاشور', 'التحرير والتنوير'] },
  { key: 'wasit',      label: 'الوسيط',             match: ['وسيط'] }
];

const TAFSIR_IDS_CACHE_KEY = 'tafsir_ids_map_v2';
let tafsirIdsMap = null; // { key: numericResourceId } — بيتحل مرة واحدة من الـ API الحقيقي

window.currentTafseerBookKey = 'muyassar';
window.isAyahTextVisibleInTafseer = localStorage.getItem('athr_show_ayah_tafseer') !== '0';
window.currentTafseerAyahIndex = 0;
window.isDownloadingTafseer = false;

// -------------------------------------------------------------------------
// 1) حلّ أرقام التفاسير الحقيقية من API مرة واحدة (بدل التخمين)
// -------------------------------------------------------------------------
async function resolveTafsirIds() {
  if (tafsirIdsMap) return tafsirIdsMap;

  try {
    const cached = await getAppData(TAFSIR_IDS_CACHE_KEY);
    if (cached && Object.keys(cached).length >= 5) {
      tafsirIdsMap = cached;
      return tafsirIdsMap;
    }
  } catch (e) {}

  const map = {};
  try {
    const res = await fetch('https://api.quran.com/api/v4/resources/tafsirs?language=ar');
    const data = await res.json();
    const list = (data && data.tafsirs) ? data.tafsirs : [];

    TAFSIR_TARGETS.forEach(target => {
      const found = list.find(t => {
        const name = (t.name || '') + ' ' + (t.author_name || '');
        return target.match.some(m => name.includes(m));
      });
      if (found) map[target.key] = found.id;
    });
  } catch (e) {
    console.error('خطأ جلب قائمة التفاسير:', e);
  }

  tafsirIdsMap = map;
  try { await setAppData(TAFSIR_IDS_CACHE_KEY, map); } catch (e) {}
  return map;
}

// -------------------------------------------------------------------------
// 2) جلب نص تفسير معين لآية معينة (بكاش دائم أوفلاين)
// -------------------------------------------------------------------------
async function fetchTafsirTextByKey(key, surahNum, ayahNum) {
  const cacheKey = `tafseer_${key}_${surahNum}_${ayahNum}`;

  const cached = await getAppData(cacheKey).catch(() => null);
  if (cached) return cached;

  const idsMap = await resolveTafsirIds();
  const resourceId = idsMap[key];
  if (!resourceId) return null; // التفسير مش متاح في المصدر حاليًا

  try {
    const res = await fetch(`https://api.quran.com/api/v4/tafsirs/${resourceId}/by_ayah/${surahNum}:${ayahNum}`);
    const data = await res.json();
    const raw = (data && data.tafsir && data.tafsir.text) ? data.tafsir.text : null;
    if (!raw) return null;

    const clean = raw.replace(/<[^>]*>?/gm, '').trim();
    setAppData(cacheKey, clean).catch(() => {});
    return clean;
  } catch (e) {
    console.error('خطأ جلب نص التفسير:', e);
    return null;
  }
}

// -------------------------------------------------------------------------
// 3) فتح نافذة التفسير
// -------------------------------------------------------------------------
window.actionTafseer = function () {
  if (typeof closeActionMenu === 'function') closeActionMenu();
  window.currentTafseerAyahIndex = window.activeAyahIndex || 0;
  window.ensureTafseerModalDOM();
  window.renderTafseerContent();
};

// -------------------------------------------------------------------------
// 4) بناء واجهة المودال (مرة واحدة فقط)
// -------------------------------------------------------------------------
window.ensureTafseerModalDOM = function () {
  if (document.getElementById('athrTafseerModal')) return;

  const optionsHtml = TAFSIR_TARGETS.map(t =>
    `<option value="${t.key}" ${t.key === window.currentTafseerBookKey ? 'selected' : ''}>📖 ${t.label}</option>`
  ).join('');

  const modalHTML = `
    <div id="athrTafseerModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:10000005; align-items:center; justify-content:center; padding:15px; direction:rtl; font-family:'Amiri', serif;">
      <div id="tafseerCardBox" style="width:100%; max-width:550px; height:88vh; max-height:800px; background:#0e1510; border:1.5px solid var(--gold, #d4af37); border-radius:24px; display:flex; flex-direction:column; justify-content:space-between; padding:18px 20px; box-shadow:0 20px 60px rgba(0,0,0,0.9); overflow:hidden; position:relative;">

        <!-- الهيدر -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:12px; gap:6px;">
          <select id="tafseerBookSelect" onchange="window.changeTafseerBook(this.value)" style="flex:1; background:#000; color:var(--gold, #d4af37); border:1px solid var(--gold, #d4af37); padding:8px 10px; border-radius:12px; font-family:'Amiri',serif; font-size:13px; font-weight:bold; outline:none; cursor:pointer;">
            ${optionsHtml}
          </select>
          <button id="downloadTafseerBtn" onclick="window.downloadFullTafseerBook()" style="background:rgba(212,175,55,0.12); border:1px solid var(--gold, #d4af37); color:var(--gold, #d4af37); padding:0 10px; height:38px; border-radius:12px; font-size:12px; font-weight:bold; font-family:'Amiri',serif; cursor:pointer; display:flex; align-items:center; gap:4px; white-space:nowrap;" title="تحميل تفسير السورة كاملة أوفلاين">
            <span>📥</span> تحميل
          </button>
          <button id="toggleAyahEyeBtn" onclick="window.toggleAyahVisibilityInTafseer()" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; width:38px; height:38px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;" title="إظهار/إخفاء نص الآية">
            ${window.isAyahTextVisibleInTafseer ? '👁️' : '🙈'}
          </button>
          <button onclick="window.closeTafseerModal()" style="background:rgba(255,77,77,0.15); border:1px solid #ff4d4d; color:#ff4d4d; width:38px; height:38px; border-radius:50%; font-size:18px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">✕</button>
        </div>

        <!-- شريط تقدم التحميل -->
        <div id="tafseerDownloadProgressWrap" style="display:none; background:rgba(0,0,0,0.5); padding:8px 12px; border-radius:10px; margin-top:8px; border:1px dashed var(--gold, #d4af37);">
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--gold, #d4af37); margin-bottom:4px;">
            <span id="tafseerProgressLabel">جاري التحميل...</span>
            <span id="tafseerProgressPct">0%</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
            <div id="tafseerProgressBar" style="width:0%; height:100%; background:var(--gold, #d4af37); transition:width 0.2s;"></div>
          </div>
        </div>

        <!-- منطقة السحب -->
        <div id="tafseerSwipeZone" style="flex:1; overflow-y:auto; padding:14px 4px; display:flex; flex-direction:column; gap:12px; user-select:none;">
          <div id="tafseerAyahContainer" style="display:${window.isAyahTextVisibleInTafseer ? 'block' : 'none'}; background:rgba(212,175,55,0.06); border-right:4px solid var(--gold, #d4af37); border-radius:14px; padding:14px; text-align:justify; line-height:2.1; font-family:'Amiri Quran', serif; font-size:19px; color:#fff;">
            <span id="tafseerAyahText"></span>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:16px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px dashed rgba(255,255,255,0.1); padding-bottom:6px;">
              <span id="tafseerHeadingInfo" style="color:var(--gold, #d4af37); font-size:13px; font-weight:bold;"></span>
              <button onclick="window.copyCurrentTafseer()" style="background:none; border:none; color:var(--text2, #9aa79c); font-size:12px; cursor:pointer;">📋 نسخ</button>
            </div>
            <div id="tafseerBodyText" style="color:#f4f6f4; font-size:16px; line-height:2; text-align:justify; font-family:'Amiri', serif; white-space:pre-wrap;">⏳ جاري جلب التفسير...</div>
          </div>
        </div>

        <!-- الفوتر -->
        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:10px; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text2, #9aa79c);">
          <button onclick="window.navTafseerSwipe(-1)" style="background:none; border:none; color:var(--gold, #d4af37); font-size:13px; cursor:pointer; font-weight:bold;">→ السابقة</button>
          <span style="font-size:11px; opacity:0.8;">👈 اسحب للتنقل 👉</span>
          <button onclick="window.navTafseerSwipe(1)" style="background:none; border:none; color:var(--gold, #d4af37); font-size:13px; cursor:pointer; font-weight:bold;">التالية ←</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  window.attachTafseerSwipeEvents();
};

// -------------------------------------------------------------------------
// 5) السحب باليد يمين/شمال
// -------------------------------------------------------------------------
window.attachTafseerSwipeEvents = function () {
  const zone = document.getElementById('tafseerSwipeZone');
  if (!zone) return;
  let startX = 0, startY = 0;

  zone.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  zone.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 60) {
      window.navTafseerSwipe(dx > 0 ? -1 : 1);
    }
  }, { passive: true });
};

// -------------------------------------------------------------------------
// 6) عرض التفسير الحالي
// -------------------------------------------------------------------------
window.renderTafseerContent = async function () {
  const modal = document.getElementById('athrTafseerModal');
  if (!modal) return;
  modal.style.display = 'flex';

  const ayahData = window.currentAyahsData[window.currentTafseerAyahIndex];
  if (!ayahData) return;

  const surahObj = window.currentSurah || { n: ayahData.surahNumber, name: '' };
  const surahNum = ayahData.surahNumber || surahObj.n;
  const ayahNum = ayahData.numberInSurah;

  let cleanAyah = ayahData.text;
  if (surahNum !== 1 && surahNum !== 9 && ayahNum === 1) {
    cleanAyah = cleanAyah.replace(/^بِسْمِ[\s\S]+?رَّحِيمِ\s*/, '').replace(/^بِسْمِ[\s\S]+?الرَّحِيمِ\s*/, '');
  }

  document.getElementById('tafseerAyahText').textContent = `﴿ ${cleanAyah} ﴾ [${ayahNum}]`;
  document.getElementById('tafseerHeadingInfo').textContent = `سورة ${surahObj.name || ''} — الآية (${ayahNum})`;

  const bodyEl = document.getElementById('tafseerBodyText');
  bodyEl.textContent = '⏳ جاري جلب التفسير...';

  const text = await fetchTafsirTextByKey(window.currentTafseerBookKey, surahNum, ayahNum);
  bodyEl.textContent = text || 'هذا التفسير غير متوفر لهذه الآية حاليًا، جرّب مصدرًا آخر من القائمة أعلاه 🙏';
};

// -------------------------------------------------------------------------
// 7) تحميل تفسير السورة كاملة أوفلاين (لكل ايات السورة الحالية فقط)
// -------------------------------------------------------------------------
window.downloadFullTafseerBook = async function () {
  if (window.isDownloadingTafseer) return;
  if (!window.currentSurah) return;

  const target = TAFSIR_TARGETS.find(t => t.key === window.currentTafseerBookKey);
  const bookName = target ? target.label : 'التفسير';
  const surahNum = window.currentSurah.n;
  const surahName = window.currentSurah.name;

  if (!confirm(`هل تود تحميل "${bookName}" لسورة (${surahName}) بالكامل للعمل أوفلاين؟`)) return;

  window.isDownloadingTafseer = true;
  const wrap = document.getElementById('tafseerDownloadProgressWrap');
  const bar = document.getElementById('tafseerProgressBar');
  const label = document.getElementById('tafseerProgressLabel');
  const pctEl = document.getElementById('tafseerProgressPct');
  const btn = document.getElementById('downloadTafseerBtn');

  if (wrap) wrap.style.display = 'block';
  if (btn) btn.disabled = true;

  const ayahsOfSurah = window.currentAyahsData.filter(a => a.surahNumber === surahNum);
  const total = ayahsOfSurah.length || 1;

  try {
    for (let i = 0; i < ayahsOfSurah.length; i++) {
      const a = ayahsOfSurah[i];
      await fetchTafsirTextByKey(window.currentTafseerBookKey, surahNum, a.numberInSurah);
      const pct = Math.round(((i + 1) / total) * 100);
      if (bar) bar.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
      if (label) label.textContent = `جاري حفظ آية ${i + 1} من ${total}...`;
    }
    if (label) label.textContent = `✅ تم حفظ تفسير سورة ${surahName} أوفلاين بنجاح!`;
    setTimeout(() => { if (wrap) wrap.style.display = 'none'; }, 2000);
  } catch (e) {
    console.error('Download Tafseer Error:', e);
    alert('⚠️ حدث خطأ أثناء التحميل.');
  } finally {
    window.isDownloadingTafseer = false;
    if (btn) btn.disabled = false;
  }
};

// -------------------------------------------------------------------------
// 8) التنقل والتحكم
// -------------------------------------------------------------------------
window.navTafseerSwipe = function (direction) {
  const newIndex = window.currentTafseerAyahIndex + direction;
  if (newIndex < 0 || newIndex >= window.currentAyahsData.length) return;
  window.currentTafseerAyahIndex = newIndex;
  window.renderTafseerContent();
};

window.changeTafseerBook = function (newKey) {
  window.currentTafseerBookKey = newKey;
  window.renderTafseerContent();
};

window.toggleAyahVisibilityInTafseer = function () {
  window.isAyahTextVisibleInTafseer = !window.isAyahTextVisibleInTafseer;
  localStorage.setItem('athr_show_ayah_tafseer', window.isAyahTextVisibleInTafseer ? '1' : '0');

  const box = document.getElementById('tafseerAyahContainer');
  const eyeBtn = document.getElementById('toggleAyahEyeBtn');
  if (box) box.style.display = window.isAyahTextVisibleInTafseer ? 'block' : 'none';
  if (eyeBtn) eyeBtn.textContent = window.isAyahTextVisibleInTafseer ? '👁️' : '🙈';
};

window.copyCurrentTafseer = function () {
  const ayahText = document.getElementById('tafseerAyahText').textContent;
  const tafseerText = document.getElementById('tafseerBodyText').textContent;
  const target = TAFSIR_TARGETS.find(t => t.key === window.currentTafseerBookKey);
  const bookName = target ? target.label : 'التفسير';

  const fullText = `${ayahText}\n\n📖 [${bookName}]:\n${tafseerText}\n\n• تطبيق أثر •`;
  navigator.clipboard.writeText(fullText);
  alert('✅ تم نسخ نص الآية والتفسير بنجاح!');
};

window.closeTafseerModal = function () {
  const modal = document.getElementById('athrTafseerModal');
  if (modal) modal.style.display = 'none';
};
