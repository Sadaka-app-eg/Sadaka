// =========================================================================
// 📖 محرك التفاسير العشرة الموحّد - تطبيق أثر
// =========================================================================

const TAFSIR_TARGETS = [
  { key: 'muyassar',   id: 16,  label: 'الميسر' },
  { key: 'mukhtasar', id: 817, label: 'المختصر' },
  { key: 'saadi',     id: 91,  label: 'السعدي' },
  { key: 'ibnkathir', id: 14,  label: 'ابن كثير' },
  { key: 'baghawi',   id: 90,  label: 'البغوي' },
  { key: 'qurtubi',   id: 15,  label: 'القرطبي' },
  { key: 'tabari',    id: 93,  label: 'الطبري' },
  { key: 'jalalayn',  id: 94,  label: 'الجلالين' },
  { key: 'ibnashur',  id: 95,  label: 'ابن عاشور' },
  { key: 'wasit',     id: 92,  label: 'الوسيط' }
];

window.currentTafseerBookKey = 'muyassar';
window.isAyahTextVisibleInTafseer = true;
window.currentTafseerAyahIndex = 0;

// 1️⃣ جلب التفسير من السيرفر المباشر
async function fetchTafsirTextByKey(key, surahNum, ayahNum) {
  const cacheKey = `tafseer_${key}_${surahNum}_${ayahNum}`;
  
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  const target = TAFSIR_TARGETS.find(t => t.key === key) || TAFSIR_TARGETS[0];
  const resourceId = target.id;

  try {
    const res = await fetch(`https://api.qurancdn.com/api/v4/tafsirs/${resourceId}/by_ayah/${surahNum}:${ayahNum}`);
    if (res.ok) {
      const data = await res.json();
      const raw = data?.tafsir?.text || data?.tafsirs?.[0]?.text;
      if (raw) {
        const clean = raw.replace(/<[^>]*>?/gm, '').trim();
        try { localStorage.setItem(cacheKey, clean); } catch (e) {}
        return clean;
      }
    }
  } catch (e) {}

  // محاولة عبر السيرفر الاحتياطي
  try {
    const res2 = await fetch(`https://api.quran.com/api/v4/quran/tafsirs/${resourceId}?verse_key=${surahNum}:${ayahNum}`);
    if (res2.ok) {
      const data2 = await res2.json();
      const raw2 = data2?.tafsirs?.[0]?.text || data2?.tafsir?.text;
      if (raw2) {
        const clean2 = raw2.replace(/<[^>]*>?/gm, '').trim();
        try { localStorage.setItem(cacheKey, clean2); } catch (e) {}
        return clean2;
      }
    }
  } catch (err) {}

  return null;
}

// 2️⃣ فتح المودال مع فحص وتأكيد بيانات الآية
window.actionTafseer = function () {
  if (typeof closeActionMenu === 'function') closeActionMenu();
  
  // التأكد من جلب الـ index الصحيح للآية
  let idx = (typeof activeAyahIndex !== 'undefined' && activeAyahIndex !== null) ? activeAyahIndex : (window.activeAyahIndex || 0);
  window.currentTafseerAyahIndex = idx;

  window.ensureTafseerModalDOM();
  window.renderTafseerContent();
};

// 3️⃣ بناء هيكل النافذة بتصميم مرن ومنع خروج الأزرار
window.ensureTafseerModalDOM = function () {
  const oldModal = document.getElementById('athrTafseerModal');
  if (oldModal) oldModal.remove(); // إعادة إنشاء الهيكل لضمان تحديث الـ CSS

  const optionsHtml = TAFSIR_TARGETS.map(t =>
    `<option value="${t.key}" ${t.key === window.currentTafseerBookKey ? 'selected' : ''}>📖 ${t.label}</option>`
  ).join('');

  const modalHTML = `
    <div id="athrTafseerModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:10000005; align-items:center; justify-content:center; padding:12px; direction:rtl; font-family:'Amiri', serif;">
      <div style="width:100%; max-width:500px; height:88vh; max-height:780px; background:#0e1510; border:1.5px solid var(--gold, #d4af37); border-radius:20px; display:flex; flex-direction:column; justify-content:space-between; padding:14px; box-shadow:0 20px 60px rgba(0,0,0,0.9); overflow:hidden; box-sizing:border-box;">

        <!-- هيدر متجاوب يمنع خروج زرار القفل -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:10px; gap:6px; flex-shrink:0;">
          <select id="tafseerBookSelect" onchange="window.changeTafseerBook(this.value)" style="flex:1; min-width:110px; max-width:170px; background:#000; color:var(--gold, #d4af37); border:1px solid var(--gold, #d4af37); padding:6px 8px; border-radius:10px; font-family:'Amiri',serif; font-size:12px; font-weight:bold; outline:none;">
            ${optionsHtml}
          </select>
          
          <button onclick="window.downloadFullTafseerBook()" id="downloadTafseerBtn" style="background:rgba(212,175,55,0.12); border:1px solid var(--gold, #d4af37); color:var(--gold, #d4af37); padding:6px 10px; border-radius:10px; font-size:11px; font-weight:bold; cursor:pointer; white-space:nowrap;">
            📥 تحميل
          </button>
          
          <button id="toggleAyahEyeBtn" onclick="window.toggleAyahVisibilityInTafseer()" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; width:34px; height:34px; border-radius:50%; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            👁️
          </button>
          
          <button onclick="window.closeTafseerModal()" style="background:rgba(255,77,77,0.2); border:1px solid #ff4d4d; color:#ff4d4d; width:34px; height:34px; border-radius:50%; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ✕
          </button>
        </div>

        <!-- وعاء نص الآية والتفسير -->
        <div id="tafseerSwipeZone" style="flex:1; overflow-y:auto; padding:10px 2px; display:flex; flex-direction:column; gap:10px;">
          
          <div id="tafseerAyahContainer" style="background:rgba(212,175,55,0.08); border-right:3px solid var(--gold, #d4af37); border-radius:12px; padding:10px 12px; text-align:justify; line-height:2; font-family:'Amiri Quran', serif; font-size:17px; color:#fff;">
            <span id="tafseerAyahText">جاري تحميل الآية...</span>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.1); padding-bottom:6px;">
              <span id="tafseerHeadingInfo" style="color:var(--gold, #d4af37); font-size:12px; font-weight:bold;"></span>
              <button onclick="window.copyCurrentTafseer()" style="background:none; border:none; color:var(--text2, #9aa79c); font-size:11px; cursor:pointer;">📋 نسخ</button>
            </div>
            <div id="tafseerBodyText" style="color:#f4f6f4; font-size:15px; line-height:1.9; text-align:justify; font-family:'Amiri', serif; white-space:pre-wrap;">⏳ جاري جلب التفسير...</div>
          </div>

        </div>

        <!-- الفوتر للتنقل -->
        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-size:12px; flex-shrink:0;">
          <button onclick="window.navTafseerSwipe(-1)" style="background:none; border:none; color:var(--gold, #d4af37); font-size:13px; cursor:pointer; font-weight:bold; font-family:'Amiri',serif;">→ السابقة</button>
          <span style="font-size:11px; color:var(--text2); opacity:0.7;">👈 اسحب للتنقل 👉</span>
          <button onclick="window.navTafseerSwipe(1)" style="background:none; border:none; color:var(--gold, #d4af37); font-size:13px; cursor:pointer; font-weight:bold; font-family:'Amiri',serif;">التالية ←</button>
        </div>

      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  window.attachTafseerSwipeEvents();
};

// 4️⃣ عرض المحتوى الفعلي
window.renderTafseerContent = async function () {
  const modal = document.getElementById('athrTafseerModal');
  if (!modal) return;
  modal.style.display = 'flex';

  let ayahData = (window.currentAyahsData && window.currentAyahsData[window.currentTafseerAyahIndex]) ? window.currentAyahsData[window.currentTafseerAyahIndex] : null;

  // Fallback ذكي لو الـ index مش موجود
  if (!ayahData && window.currentAyahsData && window.currentAyahsData.length > 0) {
    ayahData = window.currentAyahsData[0];
    window.currentTafseerAyahIndex = 0;
  }

  if (!ayahData) {
    document.getElementById('tafseerBodyText').textContent = '⚠️ الرجاء فتح سورة أولاً ثم اختيار الآية.';
    return;
  }

  const surahNum = ayahData.surahNumber || (window.currentSurah ? window.currentSurah.n : 1);
  const ayahNum = ayahData.numberInSurah;
  const surahName = window.currentSurah ? window.currentSurah.name : '';

  let cleanAyah = ayahData.text || '';
  if (surahNum !== 1 && surahNum !== 9 && ayahNum === 1) {
    cleanAyah = cleanAyah.replace(/^بِسْمِ[\s\S]+?رَّحِيمِ\s*/, '').replace(/^بِسْمِ[\s\S]+?الرَّحِيمِ\s*/, '');
  }

  document.getElementById('tafseerAyahText').textContent = `﴿ ${cleanAyah} ﴾ [${ayahNum}]`;
  document.getElementById('tafseerHeadingInfo').textContent = `سورة ${surahName} — الآية (${ayahNum})`;

  const bodyEl = document.getElementById('tafseerBodyText');
  bodyEl.textContent = '⏳ جاري جلب التفسير...';

  const text = await fetchTafsirTextByKey(window.currentTafseerBookKey, surahNum, ayahNum);
  bodyEl.textContent = text || 'التفسير غير متوفر لهذه الآية حاليًا، يرجى اختيار تفسير آخر من القائمة أعلاه.';
};

// 5️⃣ أحداث اللمس والتنقل
window.attachTafseerSwipeEvents = function () {
  const zone = document.getElementById('tafseerSwipeZone');
  if (!zone) return;
  let startX = 0;

  zone.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  zone.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) window.navTafseerSwipe(dx > 0 ? -1 : 1);
  }, { passive: true });
};

window.navTafseerSwipe = function (direction) {
  const max = window.currentAyahsData ? window.currentAyahsData.length : 0;
  const next = window.currentTafseerAyahIndex + direction;
  if (next >= 0 && next < max) {
    window.currentTafseerAyahIndex = next;
    window.renderTafseerContent();
  }
};

window.changeTafseerBook = function (newKey) {
  window.currentTafseerBookKey = newKey;
  window.renderTafseerContent();
};

window.toggleAyahVisibilityInTafseer = function () {
  window.isAyahTextVisibleInTafseer = !window.isAyahTextVisibleInTafseer;
  const box = document.getElementById('tafseerAyahContainer');
  const eyeBtn = document.getElementById('toggleAyahEyeBtn');
  if (box) box.style.display = window.isAyahTextVisibleInTafseer ? 'block' : 'none';
  if (eyeBtn) eyeBtn.textContent = window.isAyahTextVisibleInTafseer ? '👁️' : '🙈';
};

window.copyCurrentTafseer = function () {
  const aText = document.getElementById('tafseerAyahText').textContent;
  const tText = document.getElementById('tafseerBodyText').textContent;
  const target = TAFSIR_TARGETS.find(t => t.key === window.currentTafseerBookKey);
  navigator.clipboard.writeText(`${aText}\n\n📖 [تفسير ${target.label}]:\n${tText}\n\n• تطبيق أثر •`);
  alert('✅ تم نسخ الآية والتفسير بنجاح!');
};

window.closeTafseerModal = function () {
  const modal = document.getElementById('athrTafseerModal');
  if (modal) modal.style.display = 'none';
};
