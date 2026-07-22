// =========================================================================
// 📖 تطبيق أثر - محرك المصحف الشريف الشامل (QCF V2)
// =========================================================================

(function() {
  const TOTAL_PAGES = 604;
  const numeralsAr = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];

  function toArNum(n) {
    return String(n).split("").map(d => numeralsAr[+d] ?? d).join("");
  }

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

  // تحميل خط الصفحة العثماني
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

  // برقع السورة الفاخر
  function getSurahBannerHTML(surahName) {
    return `
      <div style="width:100%; margin:8px 0; display:flex; align-items:center; justify-content:center;">
        <div style="position:relative; width:100%; max-width:480px; height:48px; display:flex; align-items:center; justify-content:center;">
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
          <span style="position:relative; z-index:10; color:#fce788; font-weight:bold; font-size:18px; font-family:'Amiri', serif;">
            سُورَةُ ${surahName}
          </span>
        </div>
      </div>
    `;
  }

  // الدالة الرئيسية لعرض الصفحة
  window.renderQcfPage = async function(pNum) {
    const container = document.getElementById('quran');
    if (!container) return;

    // حفظ رقم آخر صفحة
    localStorage.setItem('last_quran_page', pNum);

    container.innerHTML = `
      <div style="width:100%; height:100vh; background:#0b1411; color:#e2e8f0; display:flex; flex-direction:column; justify-content:space-between; padding:10px 14px; position:fixed; top:0; left:0; z-index:99999;">
        <div style="text-align:center; margin:auto; color:#d4af37; font-size:16px;">
          ⏳ جاري تحميل الصفحة (${toArNum(pNum)}) بالرسم العثماني...
        </div>
      </div>
    `;

    try {
      await loadPageFont(pNum);

      const surahRes = await fetch("https://api.quran.com/api/v4/chapters");
      const surahJson = await surahRes.json();

      const response = await fetch(
        `https://api.quran.com/api/v4/verses/by_page/${pNum}?words=true&word_fields=code_v2,line_number,page_number,text_uthmani&fields=chapter_id,juz_number`
      );
      const json = await response.json();

      if (!json.verses || json.verses.length === 0) return;

      const first = json.verses[0];
      const chapter = surahJson.chapters.find(c => c.id === first.chapter_id);
      const surahName = chapter?.name_arabic || "المصحف الشريف";
      const juzNum = first.juz_number;

      // تجميع الكلمات حسب الأسطر الـ 15
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

      const isOdd = pNum % 2 !== 0; // قاعدة فردي يمين / زوجي شمال
      const isSpecialPage = pNum === 1 || pNum === 2;

      let linesHTML = '';
      const lineNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

      lineNumbers.forEach(line => {
        const lineWords = groupedLines[line] || [];
        const firstWordOfAyahOne = lineWords.find(w => w.ayahKey && w.ayahKey.endsWith(':1'));
        const isSurahStart = !!firstWordOfAyahOne;

        if (isSurahStart) {
          linesHTML += getSurahBannerHTML(surahName);
          if (!firstWordOfAyahOne.ayahKey.startsWith('1:') && !firstWordOfAyahOne.ayahKey.startsWith('9:')) {
            linesHTML += `<div style="width:100%; text-align:center; color:#d4af37; font-size:13px; font-weight:bold; margin:2px 0;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
          }
        }

        linesHTML += `<div style="display:flex; justify-content:${isSpecialPage ? 'center' : 'space-between'}; align-items:center; width:100%; gap:${isSpecialPage ? '8px' : '0'};">`;
        lineWords.forEach(w => {
          linesHTML += `<span style="font-family:'QCF_V2_P${pNum}'; font-size:clamp(18px, 4.3vw, 27px); cursor:pointer; line-height:1; display:inline-flex; align-items:center;" 
            onclick="alert('الآية: ${w.text}')">${w.code}</span>`;
        });
        linesHTML += `</div>`;
      });

      // رسم الشاشة الكلية للمصحف
      container.innerHTML = `
        <div id="mushafContainerView" style="width:100%; height:100vh; background:#0b1411; color:#e2e8f0; display:flex; flex-direction:column; justify-content:space-between; padding:12px 16px; position:fixed; top:0; left:0; z-index:99999;">
          
          {/* 1. الهيدر العلوي الثابت */}
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.15); padding-bottom:6px; font-size:13px; font-weight:bold;">
            <span style="color:#6fbf73;">${getJuzText(juzNum)}</span>
            <span style="color:#d4af37; font-family:'Amiri', serif;">${surahName}</span>
          </div>

          {/* 2. الأسطر الـ 15 للمصحف */}
          <div style="flex:1; display:flex; flex-direction:column; justify-content:${isSpecialPage ? 'center' : 'space-between'}; padding:8px 0;">
            ${linesHTML}
          </div>

          {/* 3. الفوتر السكني بـ قاعدة اليمين للشمال */}
          <div style="display:flex; justify-content:${isOdd ? 'flex-end' : 'flex-start'}; align-items:center; border-top:1px solid rgba(212,175,55,0.15); padding-top:6px;">
            <div style="background:linear-gradient(135deg, #12281e, #0a1712); border:1px solid #3d5e4a; border-radius:12px; padding:2px 14px; color:#e2d1a4; font-weight:bold; font-size:13px;">
              ❖ ${toArNum(pNum)}
            </div>
          </div>

        </div>
      `;

      // إضافة التمرير بلمس الشاشة (سحب يمين وشمال)
      setupSwipeEvents(pNum);

      // تحميل الصفحات المجاورة كاش
      if (pNum + 1 <= TOTAL_PAGES) loadPageFont(pNum + 1);
      if (pNum - 1 >= 1) loadPageFont(pNum - 1);

    } catch (e) {
      console.error(e);
      container.innerHTML = `<div style="text-align:center; padding:50px; color:#ff6b6b;">تحتاج اتصال بالإنترنت لمزامنة المصحف العثماني 🌐</div>`;
    }
  };

  function setupSwipeEvents(currentPage) {
    const el = document.getElementById('mushafContainerView');
    if (!el) return;

    let startX = 0;
    el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
    el.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const dist = startX - endX;

      if (dist > 40 && currentPage < TOTAL_PAGES) {
        // سحب من اليمين للشمال -> الصفحة التالية
        window.renderQcfPage(currentPage + 1);
      } else if (dist < -40 && currentPage > 1) {
        // سحب من الشمال لليمين -> الصفحة السابقة
        window.renderQcfPage(currentPage - 1);
      }
    }, {passive: true});
  }

})();
