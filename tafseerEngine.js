// =========================================================================
// 📖 محرك التفاسير الشامل والمطوّر - تطبيق أثر
// =========================================================================

const TAFSIR_TARGETS = [
  { key: 'muyassar',   slug: 'ar-tafsir-muyassar',          label: 'التفسير الميسر' },
  { key: 'saadi',      slug: 'ar-tafseer-al-saddi',         label: 'تفسير السعدي' },
  { key: 'mukhtasar',  slug: 'ar-tafsir-almukhtasar',       label: 'المختصر في التفسير' },
  { key: 'ibnkathir',  slug: 'ar-tafsir-ibn-kathir',        label: 'تفسير ابن كثير' },
  { key: 'baghawi',    slug: 'ar-tafsir-al-baghawi',        label: 'تفسير البغوي' },
  { key: 'qurtubi',    slug: 'ar-tafseer-al-qurtubi',       label: 'تفسير القرطبي' },
  { key: 'tabari',     slug: 'ar-tafsir-al-tabari',         label: 'تفسير الطبري' },
  { key: 'wasit',      slug: 'ar-tafseer-tanweer-al-miqbas', label: 'تنوير المقباس' }
];

window.currentTafseerBookKey = 'muyassar';
window.isAyahTextVisibleInTafseer = localStorage.getItem('athr_show_ayah_tafseer') !== '0';
window.currentTafseerAyahIndex = 0;
window.isDownloadingTafseer = false;

// 1️⃣ جلب نص التفسير من السيرفر
async function fetchTafsirTextByKey(key, surahNum, ayahNum) {
  const cacheKey = `tafseer_${key}_${surahNum}_${ayahNum}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  const target = TAFSIR_TARGETS.find(t => t.key === key) || TAFSIR_TARGETS[0];
  const slug = target.slug;

  try {
    const res = await fetch(`https://api.qurancdn.com/api/v4/tafsirs/${slug}/by_ayah/${surahNum}:${ayahNum}`);
    if (res.ok) {
      const data = await res.json();
      const rawText = data?.tafsir?.text || data?.tafsirs?.[0]?.text;
      if (rawText) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawText;
        const cleanText = (tempDiv.textContent || tempDiv.innerText || "").trim();
        try { localStorage.setItem(cacheKey, cleanText); } catch (e) {}
        return cleanText;
      }
    }
  } catch (err) {}

  // محاولة عبر السيرفر الاحتياطي
  try {
    const res2 = await fetch(`https://api.quran.com/api/v4/quran/tafsirs/${slug}?verse_key=${surahNum}:${ayahNum}`);
    if (res2.ok) {
      const data2 = await res2.json();
      const rawText2 = data2?.tafsirs?.[0]?.text || data2?.tafsir?.text;
      if (rawText2) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawText2;
        const cleanText2 = (tempDiv.textContent || tempDiv.innerText || "").trim();
        try { localStorage.setItem(cacheKey, cleanText2); } catch (e) {}
        return cleanText2;
      }
    }
  } catch (e) {}

  return null;
}

// 2️⃣ فتح نافذة التفسير للآية المحددة
window.actionTafseer = function () {
  if (typeof closeActionMenu === 'function') closeActionMenu();

  let idx = 0;
  if (typeof activeAyahIndex !== 'undefined' && activeAyahIndex !== null) {
    idx = activeAyahIndex;
  } else if (typeof window.activeAyahIndex !== 'undefined' && window.activeAyahIndex !== null) {
    idx = window.activeAyahIndex;
  }

  window.currentTafseerAyahIndex = idx;
  window.ensureTafseerModalDOM();
  window.renderTafseerContent();
};

// 3️⃣ بناء هيكل النافذة بدون الفوتر وبمساحة عرض واسعة
window.ensureTafseerModalDOM = function () {
  const existing = document.getElementById('athrTafseerModal');
  if (existing) existing.remove();

  const optionsHtml = TAFSIR_TARGETS.map(t =>
    `<option value="${t.key}" ${t.key === window.currentTafseerBookKey ? 'selected' : ''}>📖 ${t.label}</option>`
  ).join('');

  const modalHTML = `
    <div id="athrTafseerModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:10000005; align-items:center; justify-content:center; padding:12px; direction:rtl; font-family:'Amiri', serif;">
      <div style="width:100%; max-width:520px; height:88vh; max-height:800px; background:#0e1510; border:1.5px solid var(--gold, #d4af37); border-radius:20px; display:flex; flex-direction:column; padding:14px; box-shadow:0 20px 60px rgba(0,0,0,0.9); overflow:hidden; box-sizing:border-box; gap:10px;">

        <!-- الهيدر العلوي المتجاوب -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:10px; gap:8px; flex-shrink:0;">
          <select id="tafseerBookSelect" onchange="window.changeTafseerBook(this.value)" style="flex:1; min-width:120px; background:#000; color:var(--gold, #d4af37); border:1px solid var(--gold, #d4af37); padding:6px 10px; border-radius:12px; font-family:'Amiri',serif; font-size:13px; font-weight:bold; outline:none; cursor:pointer;">
            ${optionsHtml}
          </select>
          
          <button onclick="window.downloadFullTafseerBook()" id="downloadTafseerBtn" style="background:rgba(212,175,55,0.12); border:1px solid var(--gold, #d4af37); color:var(--gold, #d4af37); padding:6px 12px; border-radius:12px; font-size:12px; font-weight:bold; font-family:'Amiri',serif; cursor:pointer; display:flex; align-items:center; gap:4px; white-space:nowrap;">
            <span>📥</span> تحميل
          </button>
          
          <button id="toggleAyahEyeBtn" onclick="window.toggleAyahVisibilityInTafseer()" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; width:36px; height:36px; border-radius:50%; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ${window.isAyahTextVisibleInTafseer ? '👁️' : '🙈'}
          </button>
          
          <button onclick="window.closeTafseerModal()" style="background:rgba(255,77,77,0.2); border:1px solid #ff4d4d; color:#ff4d4d; width:36px; height:36px; border-radius:50%; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ✕
          </button>
        </div>

        <!-- شريط تقدم التحميل -->
        <div id="tafseerDownloadProgressWrap" style="display:none; background:rgba(0,0,0,0.5); padding:8px 12px; border-radius:10px; border:1px dashed var(--gold, #d4af37);">
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--gold, #d4af37); margin-bottom:4px;">
            <span id="tafseerProgressLabel">جاري التحميل...</span>
            <span id="tafseerProgressPct">0%</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
            <div id="tafseerProgressBar" style="width:0%; height:100%; background:var(--gold, #d4af37); transition:width 0.2s;"></div>
          </div>
        </div>

        <!-- مساحة عرض الآية والتفسير -->
        <div id="tafseerSwipeZone" style="flex:1; overflow-y:auto; padding:4px 2px; display:flex; flex-direction:column; gap:10px;">
          
          <!-- صندوق الآية الكريمة بدون أرقام مكررة -->
          <div id="tafseerAyahContainer" style="display:${window.isAyahTextVisibleInTafseer ? 'block' : 'none'}; background:rgba(212,175,55,0.08); border-right:3px solid var(--gold, #d4af37); border-radius:14px; padding:12px 14px; text-align:justify; line-height:2.1; font-family:'Amiri Quran', serif; font-size:18px; color:#fff;">
            <span id="tafseerAyahText">جاري تحميل الآية...</span>
          </div>

          <!-- صندوق التفسير -->
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:14px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.1); padding-bottom:6px;">
              <span id="tafseerHeadingInfo" style="color:var(--gold, #d4af37); font-size:13px; font-weight:bold;"></span>
              <button onclick="window.copyCurrentTafseer()" style="background:none; border:none; color:var(--text2, #9aa79c); font-size:12px; cursor:pointer; font-family:'Amiri',serif;">📋 نسخ التفسير</button>
            </div>
            <div id="tafseerBodyText" style="color:#f4f6f4; font-size:16px; line-height:2; text-align:justify; font-family:'Amiri', serif; white-space:pre-wrap;">⏳ جاري جلب التفسير...</div>
          </div>

        </div>

      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  window.attachTafseerSwipeEvents();
};

// 4️⃣ عرض نص الآية والتفسير
window.renderTafseerContent = async function () {
  const modal = document.getElementById('athrTafseerModal');
  if (!modal) return;
  modal.style.display = 'flex';

  const allAyahs = window.currentAyahsData || (typeof currentAyahsData !== 'undefined' ? currentAyahsData : []);
  const activeIdx = (typeof window.currentTafseerAyahIndex === 'number') ? window.currentTafseerAyahIndex : (window.activeAyahIndex || 0);

  let ayahData = allAyahs[activeIdx];
  if (!ayahData && allAyahs.length > 0) {
    ayahData = allAyahs[0];
    window.currentTafseerAyahIndex = 0;
  }

  if (!ayahData) {
    document.getElementById('tafseerBodyText').textContent = '⚠️ الرجاء فتح سورة أولاً ثم تحديد الآية.';
    return;
  }

  const activeSurahObj = window.currentSurah || (typeof currentSurah !== 'undefined' ? currentSurah : null);
  const surahNum = ayahData.surahNumber || (activeSurahObj ? activeSurahObj.n : 1);
  const ayahNum = ayahData.numberInSurah;
  const surahName = activeSurahObj ? activeSurahObj.name : (ayahData.surahName || '');

  let cleanAyah = ayahData.text || '';
  if (surahNum !== 1 && surahNum !== 9 && ayahNum === 1) {
    cleanAyah = cleanAyah.replace(/^بِسْمِ[\s\S]+?رَّحِيمِ\s*/, '').replace(/^بِسْمِ[\s\S]+?الرَّحِيمِ\s*/, '');
  }

  // وضع نص الآية فقط دون إلحاق رقم إضافي بالقوسين
  const ayahTextEl = document.getElementById('tafseerAyahText');
  if (ayahTextEl) ayahTextEl.textContent = cleanAyah;

  const headingInfoEl = document.getElementById('tafseerHeadingInfo');
  if (headingInfoEl) headingInfoEl.textContent = `سورة ${surahName} — الآية (${ayahNum})`;

  const bodyEl = document.getElementById('tafseerBodyText');
  if (bodyEl) bodyEl.textContent = '⏳ جاري جلب التفسير...';

  const text = await fetchTafsirTextByKey(window.currentTafseerBookKey, surahNum, ayahNum);
  if (bodyEl) {
    bodyEl.textContent = text || 'التفسير غير متوفر لهذه الآية حاليًا، يرجى اختيار تفسير آخر من القائمة أعلاه.';
  }
};

// 5️⃣ السحب الأفقي فقط للتنقل (يمين = الآية التالية)
window.attachTafseerSwipeEvents = function () {
  const zone = document.getElementById('athrTafseerModal');
  if (!zone) return;
  let startX = 0;
  let startY = 0;

  zone.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  zone.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    // الشرط: حركة أفقية صريحة أكبر من 40px وتتجاوز الحركة الرأسية لمنع القلب عند التمرير
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // سحب لليمين (dx > 0) = الآية التالية (+1)
      // سحب لليسار (dx < 0) = الآية السابقة (-1)
      window.navTafseerSwipe(dx > 0 ? 1 : -1);
    }
  }, { passive: true });
};

window.navTafseerSwipe = function (direction) {
  const allAyahs = window.currentAyahsData || (typeof currentAyahsData !== 'undefined' ? currentAyahsData : []);
  const max = allAyahs.length;
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
  localStorage.setItem('athr_show_ayah_tafseer', window.isAyahTextVisibleInTafseer ? '1' : '0');

  const box = document.getElementById('tafseerAyahContainer');
  const eyeBtn = document.getElementById('toggleAyahEyeBtn');
  if (box) box.style.display = window.isAyahTextVisibleInTafseer ? 'block' : 'none';
  if (eyeBtn) eyeBtn.textContent = window.isAyahTextVisibleInTafseer ? '👁️' : '🙈';
};

window.downloadFullTafseerBook = async function () {
  if (window.isDownloadingTafseer || !window.currentSurah) return;

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

  const allAyahs = window.currentAyahsData || (typeof currentAyahsData !== 'undefined' ? currentAyahsData : []);
  const ayahsOfSurah = allAyahs.filter(a => a.surahNumber === surahNum);
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
    alert('⚠️ حدث خطأ أثناء التحميل، تأكد من الاتصال بالإنترنت.');
  } finally {
    window.isDownloadingTafseer = false;
    if (btn) btn.disabled = false;
  }
};

window.copyCurrentTafseer = function () {
  const aText = document.getElementById('tafseerAyahText')?.textContent || '';
  const tText = document.getElementById('tafseerBodyText')?.textContent || '';
  const target = TAFSIR_TARGETS.find(t => t.key === window.currentTafseerBookKey);
  const bookName = target ? target.label : 'التفسير';

  navigator.clipboard.writeText(`${aText}\n\n📖 [${bookName}]:\n${tText}\n\n• تطبيق أثر •`);
  alert('✅ تم نسخ نص الآية والتفسير بنجاح!');
};

window.closeTafseerModal = function () {
  const modal = document.getElementById('athrTafseerModal');
  if (modal) modal.style.display = 'none';
};
