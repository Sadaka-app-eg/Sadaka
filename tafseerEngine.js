// =========================================================================
// 📖 محرك التفاسير العشرة الشامل - تطبيق أثر (إصدار متطور 2026)
// =========================================================================

window.TAFSEER_BOOKS = [
  { id: 16, key: "ar-tafsir-muyassar", name: "التفسير الميسر" },
  { id: 172, key: "ar-mukhtasar-fi-al-tafsir", name: "المختصر في التفسير" },
  { id: 14, key: "ar-tafseer-ibn-kathir", name: "تفسير ابن كثير" },
  { id: 15, key: "ar-tafseer-al-qurtubi", name: "تفسير القرطبي" },
  { id: 91, key: "ar-tafsir-al-tabari", name: "تفسير الطبري" },
  { id: 17, key: "ar-tafseer-al-saddi", name: "تفسير السعدي (تيسير الكريم الرحمن)" },
  { id: 93, key: "ar-tafsir-al-baghawi", name: "تفسير البغوي (معالم التنزيل)" },
  { id: 171, key: "ar-tafsir-jalalayn", name: "تفسير الجلالين" },
  { id: 90, key: "ar-tafsir-ibn-ashur", name: "التحرير والتنوير (ابن عاشور)" },
  { id: 92, key: "ar-eerab-al-quran", name: "إعراب القرآن الكريم (الدرويش)" }
];

window.currentTafseerBookId = 16; // الافتراضي: الميسر
window.isAyahTextVisibleInTafseer = localStorage.getItem('athr_show_ayah_tafseer') !== '0';
window.currentTafseerAyahIndex = 0;
window.isDownloadingTafseer = false;

// 1️⃣ فتح نافذة التفسير الشاملة
window.actionTafseer = function() {
  if (typeof closeActionMenu === 'function') closeActionMenu();
  window.currentTafseerAyahIndex = window.activeAyahIndex || 0;
  window.ensureTafseerModalDOM();
  window.renderTafseerContent();
};

// 2️⃣ بناء واجهة التفسير بالكامل
window.ensureTafseerModalDOM = function() {
  let modal = document.getElementById('athrTafseerModal');
  if (modal) return;

  const modalHTML = `
    <div id="athrTafseerModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:10000005; align-items:center; justify-content:center; padding:15px; direction:rtl; font-family:'Amiri', serif;">
      <div id="tafseerCardBox" style="width:100%; max-width:550px; height:88vh; max-height:800px; background:#0e1510; border:1.5px solid var(--gold, #d4af37); border-radius:24px; display:flex; flex-direction:column; justify-content:space-between; padding:18px 20px; box-shadow:0 20px 60px rgba(0,0,0,0.9); overflow:hidden; position:relative;">
        
        <!-- الهيدر العلوي -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:12px; gap:6px;">
          <select id="tafseerBookSelect" onchange="window.changeTafseerBook(this.value)" style="flex:1; background:#000; color:var(--gold, #d4af37); border:1px solid var(--gold, #d4af37); padding:8px 10px; border-radius:12px; font-family:'Amiri',serif; font-size:13px; font-weight:bold; outline:none; cursor:pointer;">
            ${window.TAFSEER_BOOKS.map(b => `<option value="${b.id}" ${b.id === window.currentTafseerBookId ? 'selected' : ''}>📖 ${b.name}</option>`).join('')}
          </select>

          <!-- زر تحميل الكتاب بالكامل أوفلاين -->
          <button id="downloadTafseerBtn" onclick="window.downloadFullTafseerBook()" style="background:rgba(212,175,55,0.12); border:1px solid var(--gold, #d4af37); color:var(--gold, #d4af37); padding:0 10px; height:38px; border-radius:12px; font-size:12px; font-weight:bold; font-family:'Amiri',serif; cursor:pointer; display:flex; align-items:center; gap:4px; white-space:nowrap;" title="تحميل التفسير بالكامل للعمل أوفلاين">
            <span>📥</span> تحميل أوفلاين
          </button>

          <!-- زر العين لإخفاء/إظهار الآية -->
          <button id="toggleAyahEyeBtn" onclick="window.toggleAyahVisibilityInTafseer()" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:var(--text, #fff); width:38px; height:38px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;" title="إظهار/إخفاء نص الآية">
            ${window.isAyahTextVisibleInTafseer ? '👁️' : '🙈'}
          </button>

          <!-- زر الإغلاق -->
          <button onclick="window.closeTafseerModal()" style="background:rgba(255,77,77,0.15); border:1px solid #ff4d4d; color:#ff4d4d; width:38px; height:38px; border-radius:50%; font-size:18px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0;">✕</button>
        </div>

        <!-- شريط التقدم للتحميل الأوفلاين (مخفي افتراضياً) -->
        <div id="tafseerDownloadProgressWrap" style="display:none; background:rgba(0,0,0,0.5); padding:8px 12px; border-radius:10px; margin-top:8px; border:1px dashed var(--gold, #d4af37);">
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--gold, #d4af37); margin-bottom:4px;">
            <span id="tafseerProgressLabel">جاري تحميل التفسير...</span>
            <span id="tafseerProgressPct">0%</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
            <div id="tafseerProgressBar" style="width:0%; height:100%; background:var(--gold, #d4af37); transition:width 0.2s;"></div>
          </div>
        </div>

        <!-- المنطقة القابلة للسحب (Touch / Swipe Area) -->
        <div id="tafseerSwipeZone" style="flex:1; overflow-y:auto; padding:14px 4px; display:flex; flex-direction:column; gap:12px; user-select:none;">
          
          <!-- نص الآية -->
          <div id="tafseerAyahContainer" style="display:${window.isAyahTextVisibleInTafseer ? 'block' : 'none'}; background:rgba(212,175,55,0.06); border-right:4px solid var(--gold, #d4af37); border-radius:14px; padding:14px; text-align:justify; line-height:2.1; font-family:'Amiri Quran', serif; font-size:19px; color:var(--text, #fff);">
            <span id="tafseerAyahText"></span>
          </div>

          <!-- بطاقة نص التفسير المنسقة -->
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:16px; flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px dashed rgba(255,255,255,0.1); padding-bottom:6px;">
              <span id="tafseerHeadingInfo" style="color:var(--gold, #d4af37); font-size:13px; font-weight:bold;"></span>
              <button onclick="window.copyCurrentTafseer()" style="background:none; border:none; color:var(--text2, #9aa79c); font-size:12px; cursor:pointer;">📋 نسخ التفسير</button>
            </div>
            
            <div id="tafseerBodyText" style="color:var(--text, #f4f6f4); font-size:16px; line-height:2; text-align:justify; font-family:'Amiri', serif; white-space:pre-wrap;">
              ⏳ جاري جلب التفسير المعتمد...
            </div>
          </div>

        </div>

        <!-- الفوتر السفلي -->
        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:10px; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text2, #9aa79c);">
          <button onclick="window.navTafseerSwipe(-1)" style="background:none; border:none; color:var(--gold, #d4af37); font-size:13px; cursor:pointer; font-weight:bold;">→ الآية السابقة</button>
          <span style="font-size:11px; opacity:0.8;">👈 اسحب بإصبعك للتنقل 👉</span>
          <button onclick="window.navTafseerSwipe(1)" style="background:none; border:none; color:var(--gold, #d4af37); font-size:13px; cursor:pointer; font-weight:bold;">الآية التالية ←</button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  window.attachTafseerSwipeEvents();
};

// 3️⃣ تفعيل السحب باللمس يميناً ويساراً (Swipe)
window.attachTafseerSwipeEvents = function() {
  const zone = document.getElementById('tafseerSwipeZone');
  if (!zone) return;

  let startX = 0;
  let startY = 0;

  zone.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  zone.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 60) {
      if (deltaX > 0) {
        window.navTafseerSwipe(-1);
      } else {
        window.navTafseerSwipe(1);
      }
    }
  }, { passive: true });
};

// 4️⃣ جلب وعرض نص التفسير والآية
window.renderTafseerContent = async function() {
  const modal = document.getElementById('athrTafseerModal');
  if (!modal) return;
  modal.style.display = 'flex';

  const ayahData = window.currentAyahsData[window.currentTafseerAyahIndex];
  if (!ayahData) return;

  const currentSurahObj = window.currentSurah || { n: ayahData.surahNumber, name: "" };
  const surahNum = ayahData.surahNumber || currentSurahObj.n;
  const ayahNum = ayahData.numberInSurah;

  let cleanAyah = ayahData.text;
  if (surahNum !== 1 && surahNum !== 9 && ayahNum === 1) {
    cleanAyah = cleanAyah.replace(/^بِسْمِ[\s\S]+?رَّحِيمِ\s*/, '').replace(/^بِسْمِ[\s\S]+?الرَّحِيمِ\s*/, '');
  }

  document.getElementById('tafseerAyahText').textContent = `﴿ ${cleanAyah} ﴾ [${ayahNum}]`;
  document.getElementById('tafseerHeadingInfo').textContent = `سورة ${currentSurahObj.name || ''} — الآية (${ayahNum})`;

  const bodyEl = document.getElementById('tafseerBodyText');
  bodyEl.textContent = "⏳ جاري تحميل التفسير...";

  const cacheKey = `tafseer_${window.currentTafseerBookId}_${surahNum}_${ayahNum}`;

  // فحص الكاش المحلي أولاً للعمل بدون إنترنت
  if (typeof getAppData === 'function') {
    const cachedText = await getAppData(cacheKey);
    if (cachedText) {
      bodyEl.textContent = cachedText;
      return;
    }
  }

  try {
    const res = await fetch(`https://api.quran.com/api/v4/tafsirs/${window.currentTafseerBookId}/by_ayah/${surahNum}:${ayahNum}`);
    const data = await res.json();

    if (data && data.tafsir && data.tafsir.text) {
      const cleanTafseer = data.tafsir.text.replace(/<[^>]*>?/gm, '').trim();
      bodyEl.textContent = cleanTafseer;
      
      if (typeof setAppData === 'function') {
        setAppData(cacheKey, cleanTafseer);
      }
    } else {
      bodyEl.textContent = "عفواً، لا يتوفر نص لهذا التفسير حالياً لهذه الآية.";
    }
  } catch (err) {
    console.error("Tafseer Fetch Error:", err);
    bodyEl.textContent = "⚠️ تعذر جلب التفسير، تأكد من اتصال الإنترنت أو حمّل التفسير أوفلاين من الزر العلوي 📥.";
  }
};

// 5️⃣ محرك تحميل التفسير الكامل أوفلاين (السورة الحالية أو المصحف كاملاً)
window.downloadFullTafseerBook = async function() {
  if (window.isDownloadingTafseer) return;

  const currentBook = window.TAFSEER_BOOKS.find(b => b.id === window.currentTafseerBookId);
  const bookName = currentBook ? currentBook.name : "التفسير";
  const surahNum = window.currentSurah ? window.currentSurah.n : 1;
  const surahName = window.currentSurah ? window.currentSurah.name : "";

  const choice = confirm(`هل تود تحميل "${bookName}" لـ سورة (${surahName}) بالكامل للعمل أوفلاين بدون نت؟\n\nاضغط OK للبدء.`);
  if (!choice) return;

  window.isDownloadingTafseer = true;
  const progressWrap = document.getElementById('tafseerDownloadProgressWrap');
  const progressBar = document.getElementById('tafseerProgressBar');
  const progressLabel = document.getElementById('tafseerProgressLabel');
  const progressPct = document.getElementById('tafseerProgressPct');
  const downloadBtn = document.getElementById('downloadTafseerBtn');

  if (progressWrap) progressWrap.style.display = 'block';
  if (downloadBtn) downloadBtn.disabled = true;

  try {
    progressLabel.textContent = `جاري جلب تفسير سورة ${surahName}...`;
    const res = await fetch(`https://api.quran.com/api/v4/tafsirs/${window.currentTafseerBookId}/by_chapter/${surahNum}?per_page=300`);
    const data = await res.json();

    if (data && data.tafsirs && data.tafsirs.length > 0) {
      const total = data.tafsirs.length;
      for (let i = 0; i < total; i++) {
        const item = data.tafsirs[i];
        const aNum = item.verse_number || (i + 1);
        const cleanTxt = item.text.replace(/<[^>]*>?/gm, '').trim();
        const cacheKey = `tafseer_${window.currentTafseerBookId}_${surahNum}_${aNum}`;

        if (typeof setAppData === 'function') {
          await setAppData(cacheKey, cleanTxt);
        }

        const pct = Math.round(((i + 1) / total) * 100);
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;
      }

      progressLabel.textContent = `✅ تم حفظ تفسير سورة ${surahName} أوفلاين بنجاح!`;
      setTimeout(() => {
        if (progressWrap) progressWrap.style.display = 'none';
      }, 2000);
    } else {
      alert("⚠️ تعذر جلب بيانات التفسير الكامل، يرجى المحاولة لاحقاً.");
    }
  } catch (err) {
    console.error("Download Tafseer Error:", err);
    alert("⚠️ حدث خطأ في الاتصال أثناء التحميل.");
  } finally {
    window.isDownloadingTafseer = false;
    if (downloadBtn) downloadBtn.disabled = false;
  }
};

// 6️⃣ دوال التنقل والتحكم
window.navTafseerSwipe = function(direction) {
  const newIndex = window.currentTafseerAyahIndex + direction;
  if (newIndex < 0) {
    alert("📢 هذه هي الآية الأولى في السورة.");
    return;
  }
  if (newIndex >= window.currentAyahsData.length) {
    alert("📢 هذه هي الآية الأخيرة في السورة.");
    return;
  }
  window.currentTafseerAyahIndex = newIndex;
  window.renderTafseerContent();
};

window.changeTafseerBook = function(newBookId) {
  window.currentTafseerBookId = parseInt(newBookId);
  window.renderTafseerContent();
};

window.toggleAyahVisibilityInTafseer = function() {
  window.isAyahTextVisibleInTafseer = !window.isAyahTextVisibleInTafseer;
  localStorage.setItem('athr_show_ayah_tafseer', window.isAyahTextVisibleInTafseer ? '1' : '0');
  
  const ayahBox = document.getElementById('tafseerAyahContainer');
  const eyeBtn = document.getElementById('toggleAyahEyeBtn');
  if (ayahBox) ayahBox.style.display = window.isAyahTextVisibleInTafseer ? 'block' : 'none';
  if (eyeBtn) eyeBtn.textContent = window.isAyahTextVisibleInTafseer ? '👁️' : '🙈';
};

window.copyCurrentTafseer = function() {
  const ayahText = document.getElementById('tafseerAyahText').textContent;
  const tafseerText = document.getElementById('tafseerBodyText').textContent;
  const bookName = window.TAFSEER_BOOKS.find(b => b.id === window.currentTafseerBookId)?.name || "التفسير";
  
  const fullText = `${ayahText}\n\n📖 [${bookName}]:\n${tafseerText}\n\n• تطبيق أثر •`;
  navigator.clipboard.writeText(fullText);
  alert("✅ تم نسخ نص الآية والتفسير بنجاح!");
};

window.closeTafseerModal = function() {
  const modal = document.getElementById('athrTafseerModal');
  if (modal) modal.style.display = 'none';
};
