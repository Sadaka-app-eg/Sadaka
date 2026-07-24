// =========================================================================
// 📖 تطبيق أثر - المحرك الشامل للمصحف الشريف (QCF V2 + التمرير التلقائي)
// =========================================================================

(function() {
  const TOTAL_PAGES = 604;
  const numeralsAr = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];

  function toArNum(n) {
    return String(n).split("").map(d => numeralsAr[+d] ?? d).join("");
  }

  // خريطة بداية صفحات السور الـ 114
  const SURAH_START_PAGES = [
    0, 1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267, 282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415, 418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499, 502, 507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 545, 549, 551, 553, 554, 556, 558, 560, 562, 564, 566, 568, 570, 572, 574, 575, 577, 579, 580, 582, 583, 585, 586, 587, 587, 589, 590, 591, 591, 592, 593, 594, 595, 595, 596, 596, 597, 597, 598, 598, 599, 599, 600, 600, 601, 601, 601, 602, 602, 602, 603, 603, 603, 604, 604, 604
  ];

  const JUZ_NAMES = [
    "", "الجزء الأول", "الجزء الثاني", "الجزء الثالث", "الجزء الرابع", "الجزء الخامس",
    "الجزء السادس", "الجزء السابع", "الجزء الثامن", "الجزء التاسع", "الجزء العاشر",
    "الجزء الحادي عشر", "الجزء الثاني عشر", "الجزء الثالث عشر", "الجزء الرابع عشر", "الجزء الخامس عشر",
    "الجزء السادس عشر", "الجزء السابع عشر", "الجزء الثامن عشر", "الجزء التاسع عشر", "الجزء العشرون",
    "الجزء الحادي والعشرون", "الجزء الثاني والعشرون", "الجزء الثالث والعشرون", "الجزء الرابع والعشرون", "الجزء الخامس والعشرون",
    "الجزء السادس والعشرون", "الجزء السابع والعشرون", "الجزء الثامن والعشرون", "الجزء التاسع والعشرون", "الجزء الثلاثون"
  ];

  function getJuzText(jNum) {
    return JUZ_NAMES[jNum] || `الجزء ${toArNum(jNum)}`;
  }

  // تحميل خطوط WOFF2 للصفحة
  async function loadPageFont(pNum) {
    const fontName = `QCF_V2_P${pNum}`;
    const fontUrl = `https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p${pNum}.woff2`;
    try {
      const font = new FontFace(fontName, `url(${fontUrl})`);
      await font.load();
      document.fonts.add(font);
      await document.fonts.ready;
      return true;
    } catch (e) {
      console.error("خطأ تحميل الخط:", e);
      return false;
    }
  }

  // برقع إطار رأس السورة الفاخر
  function getSurahBannerHTML(surahName) {
    return `
      <div style="width:100%; margin:6px 0; display:flex; align-items:center; justify-content:center;">
        <div style="position:relative; width:100%; max-width:440px; height:44px; display:flex; align-items:center; justify-content:center;">
          <svg style="position:absolute; inset:0; width:100%; height:100%;" viewBox="0 0 500 55" preserveAspectRatio="none">
            <rect x="2" y="2" width="496" height="51" rx="8" fill="#10251b" stroke="#92702c" stroke-width="2"/>
            <rect x="6" y="6" width="488" height="43" rx="5" fill="none" stroke="#d4af37" stroke-width="1" stroke-opacity="0.45" stroke-dasharray="6 3"/>
            <g fill="#d4af37">
              <path d="M 12 27.5 Q 28 8 50 27.5 Q 28 47 12 27.5 Z" fill="#193826" stroke="#b8862f" stroke-width="1.2"/>
              <circle cx="31" cy="27.5" r="3.5" fill="#fce788"/>
            </g>
            <g fill="#d4af37">
              <path d="M 488 27.5 Q 472 8 450 27.5 Q 472 47 488 27.5 Z" fill="#193826" stroke="#b8862f" stroke-width="1.2"/>
              <circle cx="469" cy="27.5" r="3.5" fill="#fce788"/>
            </g>
          </svg>
          <span style="position:relative; z-index:10; color:#fce788; font-weight:bold; font-size:17px; font-family:'Amiri', serif;">
            سُورَةُ ${surahName}
          </span>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 🔄 محرك التمرير التلقائي (Auto-Scroll Engine)
  // =========================================================================
  let scrollInterval = null;
  let isAutoScrolling = false;
  let scrollSpeed = 30; // السرعة الافتراضية

  window.toggleAutoScrollControls = function() {
    let bar = document.getElementById('autoScrollControlBar');
    if (!bar) return;
    if (bar.style.display === 'flex') {
      bar.style.display = 'none';
      stopAutoScroll();
    } else {
      bar.style.display = 'flex';
      startAutoScroll();
    }
  };

  window.toggleAutoScrollPlay = function() {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  function startAutoScroll() {
    const container = document.getElementById('mushafScrollContainer');
    if (!container) return;

    isAutoScrolling = true;
    const playBtn = document.getElementById('autoScrollPlayBtn');
    if (playBtn) playBtn.innerHTML = '⏸';

    clearInterval(scrollInterval);
    // حساسية السرعة: كل ما زاد الرقم في السلايدر ينزل أسرع
    scrollInterval = setInterval(() => {
      container.scrollTop += 1;
      
      // إذا وصل لآخر الصفحة ينقل للصفحة التالية تلقائياً
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
        stopAutoScroll();
        const currentPage = Number(localStorage.getItem('last_quran_page') || 1);
        if (currentPage < TOTAL_PAGES) {
          window.renderQcfPage(currentPage + 1);
        }
      }
    }, Math.max(10, 100 - scrollSpeed));
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    clearInterval(scrollInterval);
    const playBtn = document.getElementById('autoScrollPlayBtn');
    if (playBtn) playBtn.innerHTML = '▶';
  }

  window.updateScrollSpeed = function(val) {
    scrollSpeed = Number(val);
    document.getElementById('scrollSpeedLabel').textContent = toArNum(scrollSpeed);
    if (isAutoScrolling) {
      startAutoScroll(); // اعادة ضبط التايمر بالسرعة الجديدة
    }
  };

  // الدالة الرئيسية لعرض الصفحة بملء الشاشة
  window.renderQcfPage = async function(pNum) {
    stopAutoScroll(); // إيقاف التمرير عند النقل
    pNum = Math.max(1, Math.min(TOTAL_PAGES, Number(pNum) || 1));
    localStorage.setItem('last_quran_page', pNum);

    let overlay = document.getElementById('mushafFullScreenApp');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mushafFullScreenApp';
      document.body.appendChild(overlay);
    }

    overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: #0b1411 !important;
      color: #e2e8f0 !important;
      z-index: 999999 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
      direction: rtl !important;
      user-select: none !important;
    `;

    overlay.innerHTML = `
      <div style="margin:auto; text-align:center; color:#d4af37; font-size:16px;">
        ⏳ جاري تحميل الصفحة (${toArNum(pNum)}) بالرسم العثماني...
      </div>
    `;

    try {
      await loadPageFont(pNum);

      const surahRes = await fetch("https://api.quran.com/api/v4/chapters");
      const surahJson = await surahRes.json();

    const response = await fetch(
  `https://api.quran.com/api/v4/verses/by_page/${pNum}?words=true&word_fields=code_v2,line_number,page_number,text_uthmani&fields=chapter_id,juz_number,rub_number`
);
const json = await response.json();

if (!json.verses || json.verses.length === 0) return;

// جلب بيانات الصفحة السابقة لمعرفة تغيير الربع
let prevPageFirstVerse = null;
if (pNum > 1) {
  try {
    const prevRes = await fetch(`https://api.quran.com/api/v4/verses/by_page/${pNum - 1}?per_page=1&fields=rub_number`);
    const prevJson = await prevRes.json();
    if (prevJson.verses && prevJson.verses.length > 0) {
      prevPageFirstVerse = prevJson.verses[0];
    }
  } catch (e) { console.error(e); }
}

const first = json.verses[0];
const chapter = surahJson.chapters.find(c => c.id === first.chapter_id);
const surahName = chapter?.name_arabic || "المصحف الشريف";

// نص الهيدر المظبوط (الجزء + الربع/الحزب عند البداية فقط)
const rightHeaderText = getHeaderJuzText(first, prevPageFirstVerse);
      const json = await response.json();

      if (!json.verses || json.verses.length === 0) return;

      const first = json.verses[0];
      const chapter = surahJson.chapters.find(c => c.id === first.chapter_id);
      const surahName = chapter?.name_arabic || "المصحف الشريف";
      const juzNum = first.juz_number;

      const groupedLines = {};
      json.verses.forEach((verse) => {
        verse.words.forEach((word) => {
          (groupedLines[word.line_number] ??= []).push({
            id: word.id,
            code: word.code_v2,
            ayahKey: verse.verse_key,
            text: word.text_uthmani
          });
        });
      });

      const isSpecialPage = pNum === 1 || pNum === 2;

      let linesHTML = '';
      const lineNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

      lineNumbers.forEach(line => {
        const lineWords = groupedLines[line] || [];
        if (lineWords.length === 0) return;

        const firstWordOfAyahOne = lineWords.find(w => w.ayahKey && w.ayahKey.endsWith(':1'));
        const isSurahStart = !!firstWordOfAyahOne;

        if (isSurahStart) {
          linesHTML += getSurahBannerHTML(surahName);
          if (!firstWordOfAyahOne.ayahKey.startsWith('1:') && !firstWordOfAyahOne.ayahKey.startsWith('9:')) {
            linesHTML += `<div style="width:100%; text-align:center; color:#d4af37; font-size:12px; font-weight:bold; margin:2px 0;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
          }
        }

        const justifyStyle = isSpecialPage ? 'center' : 'space-between';
        const gapStyle = isSpecialPage ? '10px' : '0px';
        const fontSizeStyle = isSpecialPage ? 'clamp(20px, 5.5vw, 32px)' : 'clamp(18px, 4.3vw, 27px)';

        linesHTML += `<div style="display:flex; justify-content:${justifyStyle}; align-items:center; width:100%; gap:${gapStyle}; overflow:hidden;">`;
        lineWords.forEach(w => {
          linesHTML += `<span style="font-family:'QCF_V2_P${pNum}'; font-size:${fontSizeStyle}; cursor:pointer; line-height:2.0; display:inline-flex; align-items:center;" 
            onclick="alert('الآية: ${w.text}')">${w.code}</span>`;
        });
        linesHTML += `</div>`;
      });

      // رسم الشاشة الكلية
overlay.innerHTML = `
        <!-- الهيدر العلوي المطور (يمين: الجزء والربع / شمال: اسم السورة) -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px 6px; font-size:13px; font-weight:bold; background:#0b1411; color:#a0aec0; font-family:'Amiri', serif; z-index:10; border-bottom:1px solid rgba(212,175,55,0.1);">
          <span style="color:#e2e8f0; font-size:13px;">${rightHeaderText}</span>
          <span style="color:#e2e8f0; font-size:14px; font-weight:bold;">${surahName}</span>
        </div>

        <!-- وعاء السكرول للمصحف (مفروش ومريح للعين وعكس التصاق الأسطر) -->
        <div id="mushafScrollContainer" style="flex:1; overflow-y:auto; padding:16px 12px 28px; display:flex; flex-direction:column; justify-content:${isSpecialPage ? 'center' : 'space-between'}; gap:6px;">
          ${linesHTML}
        </div>

        <!-- شريط التمرير التلقائي -->
        <div id="autoScrollControlBar" style="display:none; align-items:center; gap:10px; background:rgba(25, 56, 38, 0.95); border-top:1px solid #d4af37; padding:8px 16px; backdrop-filter:blur(8px);">
          <button id="autoScrollPlayBtn" onclick="window.toggleAutoScrollPlay()" style="background:#d4af37; color:#111; border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:16px; font-weight:bold; display:flex; align-items:center; justify-content:center;">⏸</button>
          <input type="range" min="5" max="90" value="${scrollSpeed}" oninput="window.updateScrollSpeed(this.value)" style="flex:1; accent-color:#d4af37; cursor:pointer;">
          <span style="color:#fce788; font-size:12px; font-weight:bold; min-width:30px; text-align:center;" id="scrollSpeedLabel">${toArNum(scrollSpeed)}</span>
          <button onclick="window.toggleAutoScrollControls()" style="background:transparent; border:none; color:#ff6b6b; font-size:16px; cursor:pointer;">✕</button>
        </div>

        <!-- الفوتر السفلي (تنزل رقم الصفحة لتحت وتنسيقه بشكل فخم) -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(212,175,55,0.15); padding:10px 16px 14px; background:#0b1411; z-index:10;">
          <button onclick="window.renderQcfPage(${pNum - 1})" ${pNum <= 1 ? 'disabled style="opacity:0.2"' : ''} style="background:rgba(212,175,55,0.12); border:1px solid #d4af37; color:#d4af37; padding:6px 14px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:bold;">▶ السابقة</button>
          
          <button onclick="window.toggleAutoScrollControls()" title="تمرير تلقائي" style="background:rgba(212,175,55,0.2); border:1px solid #d4af37; color:#fce788; padding:6px 12px; border-radius:12px; cursor:pointer; font-size:15px; display:flex; align-items:center; justify-content:center;">
            ⏬
          </button>

          <!-- رقم الصفحة نزل لتحت في إطار المخطوطة -->
          <div style="background:linear-gradient(135deg, #142a1e, #091510); border:1px solid #d4af37; border-radius:12px; padding:4px 16px; color:#fce788; font-weight:bold; font-size:13px; font-family:'Amiri', serif; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">
            ${toArNum(pNum)}
          </div>

          <button onclick="window.renderQcfPage(${pNum + 1})" ${pNum >= TOTAL_PAGES ? 'disabled style="opacity:0.2"' : ''} style="background:rgba(212,175,55,0.12); border:1px solid #d4af37; color:#d4af37; padding:6px 14px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:bold;">التالية ◀</button>
        </div>
      `;

      setupSwipeEvents(pNum);

      if (pNum + 1 <= TOTAL_PAGES) loadPageFont(pNum + 1);
      if (pNum - 1 >= 1) loadPageFont(pNum - 1);

    } catch (e) {
      console.error(e);
      overlay.innerHTML = `<div style="text-align:center; margin:auto; color:#ff6b6b;">تحتاج اتصال بالإنترنت لمزامنة المصحف العثماني 🌐<br><br><button onclick="document.getElementById('mushafFullScreenApp').remove()" style="background:#d4af37; color:#111; border:none; padding:8px 20px; border-radius:10px; cursor:pointer; font-weight:bold;">رجوع</button></div>`;
    }
  };

  window.openSurahByNumber = function(surahNum) {
    const startPage = SURAH_START_PAGES[surahNum] || 1;
    window.renderQcfPage(startPage);
  };

  function setupSwipeEvents(currentPage) {
    const el = document.getElementById('mushafScrollContainer');
    if (!el) return;

    let startX = 0;
    el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
    el.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const dist = startX - endX;

      if (dist > 55 && currentPage < TOTAL_PAGES) {
        window.renderQcfPage(currentPage + 1);
      } else if (dist < -55 && currentPage > 1) {
        window.renderQcfPage(currentPage - 1);
      }
    }, {passive: true});
  }

})();

// دالة حساب الجزء والحزب/الربع الذكية
function getHeaderJuzText(firstVerse, prevPageFirstVerse) {
  const juzText = getJuzText(firstVerse.juz_number);
  const currentRub = firstVerse.rub_number; // رقم الربع من 1 لـ 240
  const prevRub = prevPageFirstVerse ? prevPageFirstVerse.rub_number : null;

  // لو الربع هو نفسه بتاع الصفحة اللي قبلها -> يعرض اسم الجزء فقط
  if (prevRub && currentRub === prevRub) {
    return juzText;
  }

  // لو الصفحة بداية ربع أو حزب جديد:
  const hizbNum = Math.ceil(currentRub / 4); // رقم الحزب (من 1 لـ 60)
  const rubPos = (currentRub - 1) % 4; // 0=حزب, 1=ربع, 2=نصف, 3=ثلاثة أرباع

  let rubLabel = "";
  if (rubPos === 0) rubLabel = `الحزب ${toArNum(hizbNum)}`;
  else if (rubPos === 1) rubLabel = `ربع الحزب ${toArNum(hizbNum)}`;
  else if (rubPos === 2) rubLabel = `نصف الحزب ${toArNum(hizbNum)}`;
  else if (rubPos === 3) rubLabel = `ثلاثة أرباع الحزب ${toArNum(hizbNum)}`;

  return `${juzText}، ${rubLabel}`;
}
