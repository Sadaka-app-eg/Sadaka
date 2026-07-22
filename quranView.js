// =========================================================================
// 📖 تطبيق أثر - محرك المصحف الشريف المطور QCF V2 (طراز وحي)
// =========================================================================

const TOTAL_MUSHAF_PAGES = 604;
const numeralsArabic = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];

function toArNum(n) {
  return String(n).split("").map(d => numeralsArabic[+d] ?? d).join("");
}

const JUZ_NAMES_LIST = [
  "", "الجزء الأول", "الجزء الثاني", "الجزء الثالث", "الجزء الرابع", "الجزء الخامس",
  "الجزء السادس", "الجزء السابع", "الجزء الثامن", "الجزء التاسع", "الجزء العاشر",
  "الجزء الحادي عشر", "الجزء الثاني عشر", "الجزء الثالث عشر", "الجزء الرابع عشر", "الجزء الخامس عشر",
  "الجزء السادس عشر", "الجزء السابع عشر", "الجزء الثامن عشر", "الجزء التاسع عشر", "الجزء العشرون",
  "الجزء الحادي والعشرون", "الجزء الثاني والعشرون", "الجزء الثالث والعشرون", "الجزء الرابع والعشرون", "الجزء الخامس والعشرون", "الجزء السادس والعشرون", "الجزء السابع والعشرون", "الجزء الثامن والعشرون", "الجزء التاسع والعشرون", "الجزء الثلاثون"
];

function getJuzTextAr(jNum) {
  return JUZ_NAMES_LIST[jNum] || `الجزء ${toArNum(jNum)}`;
}

// تحميل خطوط صفحات المصحف العثماني في الخلفية
async function loadQcfFontByPage(pageNum) {
  const fontName = `QCF_V2_P${pageNum}`;
  const fontUrl = `https://verses.quran.foundation/fonts/quran/hafs/v2/woff2/p${pageNum}.woff2`;
  try {
    const font = new FontFace(fontName, `url(${fontUrl})`);
    await font.load();
    document.fonts.add(font);
    await document.fonts.ready;
    return true;
  } catch (e) {
    console.error("خطأ تحميل الخط العثماني:", e);
    return false;
  }
}

// مكون برقع/إطار رأس السورة الفاخر
function renderSurahBannerHTML(surahName) {
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

// الدالة الرئيسية المستقلة لفتح وعرض المصحف
window.renderNewQcfMushaf = async function(pNum = 1) {
  const container = document.getElementById('quran');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center; padding:50px; color:var(--gold); font-size:18px;">⏳ جاري تحميل الرسم العثماني بـ QCF V2...</div>`;

  try {
    await loadQcfFontByPage(pNum);

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

    // تجميع الكلمات حسب السطر
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

    const isOdd = pNum % 2 !== 0;

    let pageLinesHTML = '';
    const lineNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

    lineNumbers.forEach(line => {
      const lineWords = groupedLines[line] || [];
      const firstWordOfAyahOne = lineWords.find(w => w.ayahKey && w.ayahKey.endsWith(':1'));
      const isSurahStart = !!firstWordOfAyahOne;

      if (isSurahStart) {
        pageLinesHTML += renderSurahBannerHTML(surahName);
        if (!firstWordOfAyahOne.ayahKey.startsWith('1:') && !firstWordOfAyahOne.ayahKey.startsWith('9:')) {
          pageLinesHTML += `<div style="width:100%; text-align:center; color:#d4af37; font-size:13px; font-weight:bold; margin:4px 0;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
        }
      }

      pageLinesHTML += `<div style="display:flex; justify-content:${pNum <= 2 ? 'center' : 'space-between'}; align-items:center; width:100%; height:calc((100vh - 120px)/15); overflow:hidden;">`;
      lineWords.forEach(w => {
        pageLinesHTML += `<span style="font-family:'QCF_V2_P${pNum}'; font-size:clamp(18px, 4.3vw, 27px); cursor:pointer; line-height:1; display:inline-flex; align-items:center;" 
          onclick="window.showAyahOptionsModal('${w.ayahKey}', '${w.text}')">${w.code}</span>`;
      });
      pageLinesHTML += `</div>`;
    });

    // بناء الهيكل الكامل للشاشة
    container.innerHTML = `
      <div style="width:100%; height:100vh; background:#0b1411; color:#e2e8f0; display:flex; flex-direction:column; justify-content:space-between; padding:10px 14px; position:fixed; top:0; left:0; z-index:99999;">
        
        <!-- الهيدر الثابت: الجزء يمين، السورة شمال -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.15); padding-bottom:6px; font-size:13px; font-weight:bold;">
          <span style="color:#6fbf73;">${getJuzTextAr(juzNum)}</span>
          <span style="color:#d4af37; font-family:'Amiri', serif;">سورة ${surahName}</span>
        </div>

        <!-- أسطر المصحف الـ 15 -->
        <div style="flex:1; display:flex; flex-direction:column; justify-content:${pNum <= 2 ? 'center' : 'space-between'}; padding:6px 0;">
          ${pageLinesHTML}
        </div>

        <!-- الفوتر: فردي يمين / زوجي شمال مع زر العودة -->
        <div style="display:flex; justify-content:${isOdd ? 'flex-end' : 'flex-start'}; align-items:center; border-top:1px solid rgba(212,175,55,0.15); pt:6px;">
          <div style="background:linear-gradient(135deg, #12281e, #0a1712); border:1px solid #3d5e4a; border-radius:12px; padding:2px 14px; color:#e2d1a4; font-weight:bold; font-size:13px;">
            ❖ ${toArNum(pNum)}
          </div>
        </div>

      </div>
    `;

    // تحميل الصفحات المجاورة في الـ Cache
    if (pNum + 1 <= TOTAL_MUSHAF_PAGES) loadQcfFontByPage(pNum + 1);
    if (pNum - 1 >= 1) loadQcfFontByPage(pNum - 1);

  } catch (e) {
    console.error(e);
    container.innerHTML = `<div style="text-align:center; padding:50px; color:#ff6b6b;">تحتاج اتصال بالإنترنت لمزامنة المصحف العثماني 🌐</div>`;
  }
};

window.showAyahOptionsModal = function(key, text) {
  alert(`الآية: ${key}\n${text}`);
};
