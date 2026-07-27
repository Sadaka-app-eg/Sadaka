
// =========================================================================
// الختمة الاحترافية الشاملة - الميزات الخرافية (محسوبة بالصفحات 604)
// =========================================================================

// =========================================================================
// الختمة الاحترافية الشاملة - الميزات الخرافية
// =========================================================================

var TOTAL_PAGES = 604;

// استخدام var بدلاً من const لتفادي خطأ التكرار إذا كان معرّفاً في ملف آخر
if (typeof surahStartPages === 'undefined') {
  var surahStartPages = [
    1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267,
    282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415,
    418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499, 502, 507, 511,
    515, 518, 523, 526, 528, 531, 534, 537, 542, 545, 549, 553, 554, 556, 558, 560,
    562, 564, 566, 568, 570, 572, 574, 575, 577, 579, 582, 583, 585, 586, 587, 589,
    590, 591, 592, 593, 594, 595, 596, 596, 597, 598, 598, 599, 599, 600, 600, 601,
    601, 601, 602, 602, 602, 602, 603, 603, 603, 603, 604, 604, 604, 604, 604, 604, 604, 604
  ];
}
// قاعدة بيانات المتشابهات البارزة للتنبيه الذكي
const mutashabihatData = {
  2: "💡 متشابهات البقرة: انتبه لفاصلة «وَاعْلَمُوا أَنَّ اللَّهَ...» مع «عَزِيزٌ حَكِيمٌ» أو «غَفُورٌ حَلِيمٌ».",
  3: "💡 متشابهات آل عمران: تشابه بين نهايات آيات الاستغفار والجزاء مع سورة النساء.",
  7: "💡 متشابهات الأعراف: انتبه لقصص الأنبياء وتباديل «قَالَ الْمَلَأُ» بين الأعراف وهود.",
  18: "💡 سورة الكهف: «وَقُلِ الْحَقُّ مِن رَّبِّكُمْ...» تتشابه مع ختام الفواصل المرفوعة."
};

let khatmaData = JSON.parse(localStorage.getItem('khatma_data_v2') || 'null');

// دالة أرقام عربية آمنة
function toAr(num) {
  if (num === undefined || num === null) return '';
  if (typeof toArabicDigits === 'function') return toArabicDigits(num);
  return String(num).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

// -------------------------------------------------------------------------
// 1. بدء وإنشاء الخطة (محسوبة بالصفحات)
// -------------------------------------------------------------------------
function startKhatma(days) {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    const pagesPerDay = Math.ceil(TOTAL_PAGES / days);

    khatmaData = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalDays: days,
      pagesPerDay: pagesPerDay,
      readPages: [], // مصفوفة أرقام الصفحات المكتملة [1, 2, 3...]
      completedPrayers: {}, // متابعة الصلوات لكل يوم: {'YYYY-MM-DD': ['fajr', 'dhuhr']}
      insights: {}, // سجل التدبرات: {pageNumber: "ملاحظة"}
      lastUpdate: new Date().toISOString()
    };

    saveKhatma();
    renderKhatma();
    alert(`✅ تم إنشاء خطتك بنجاح!\nوردك اليومي: ${toAr(pagesPerDay)} صفحة\nتكتمل خلال: ${toAr(days)} يومًا`);
  } catch (e) {
    console.error("خطأ في بدء الختمة:", e);
  }
}

function saveKhatma() {
  localStorage.setItem('khatma_data_v2', JSON.stringify(khatmaData));
}

// -------------------------------------------------------------------------
// 2. تحديث وقراءة الصفحات
// -------------------------------------------------------------------------
function togglePageRead(pageNo) {
  if (!khatmaData) return;
  const idx = khatmaData.readPages.indexOf(pageNo);
  if (idx > -1) {
    khatmaData.readPages.splice(idx, 1);
  } else {
    khatmaData.readPages.push(pageNo);
    if (navigator.vibrate) navigator.vibrate(20);
  }
  saveKhatma();
  renderKhatma();
}

function markPagesRange(startPage, endPage, isRead = true) {
  if (!khatmaData) return;
  for (let p = startPage; p <= endPage; p++) {
    const idx = khatmaData.readPages.indexOf(p);
    if (isRead && idx === -1) khatmaData.readPages.push(p);
    else if (!isRead && idx > -1) khatmaData.readPages.splice(idx, 1);
  }
  saveKhatma();
  renderKhatma();
}

// -------------------------------------------------------------------------
// 3. العرض الرئيسي (Render Main)
// -------------------------------------------------------------------------
function renderKhatma() {
  try {
    const setupEl = document.getElementById('khatmaSetup');
    const displayEl = document.getElementById('khatmaDisplay');
    if (!setupEl || !displayEl) return;

    if (!khatmaData) {
      setupEl.style.display = 'block';
      displayEl.style.display = 'none';
      return;
    }

    setupEl.style.display = 'none';
    displayEl.style.display = 'block';

    // حساب نسبة التقدم بناءً على الصفحات 604
    const totalRead = khatmaData.readPages.length;
    const progressPercent = Math.min(100, (totalRead / TOTAL_PAGES) * 100);

    const txtEl = document.getElementById('khatmaProgressText');
    const barEl = document.getElementById('khatmaProgressBar');
    if (txtEl) txtEl.textContent = toAr(Math.round(progressPercent)) + '%';
    if (barEl) barEl.style.width = progressPercent + '%';

    // التواريخ والأيام
    const startDate = new Date(khatmaData.startDate);
    const endDate = new Date(khatmaData.endDate);
    const today = new Date();
    
    const diffTime = endDate - today;
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const todayIndex = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));

    // الإحصائيات
    const statsEl = document.getElementById('khatmaStats');
    if (statsEl) {
      statsEl.innerHTML = `
        📖 الصفحات المكتملة: <b>${toAr(totalRead)}</b> / ٦٠٤ صفحة<br>
        ⏳ المتبقي: <b>${toAr(TOTAL_PAGES - totalRead)}</b> صفحة (${toAr(daysLeft)} يومًا)<br>
        🎯 الورد اليومي المستهدف: <b>${toAr(khatmaData.pagesPerDay)}</b> صفحة
      `;
    }

    // حساب ورد اليوم
    renderTodayWird(todayIndex);

    // فحص التأخر (Smart Catchup)
    checkCatchupStatus(todayIndex);

    // خريطة الذاكرة البصرية (Visual Heatmap Grid)
    renderVisualHeatmap();

    // وضع السنن والمناسبات (Sunnah Mode)
    checkSunnahMode();

  } catch (err) {
    console.error("خطأ أثناء رندرة الختمة:", err);
  }
}

// -------------------------------------------------------------------------
// 4. ورد اليوم وموزع الصلوات الخمس
// -------------------------------------------------------------------------
function renderTodayWird(todayIndex) {
  const wirdEl = document.getElementById('todayWird');
  if (!wirdEl) return;

  const startPage = Math.min(604, (todayIndex * khatmaData.pagesPerDay) + 1);
  const endPage = Math.min(604, (todayIndex + 1) * khatmaData.pagesPerDay);
  const totalWirdPages = (endPage - startPage) + 1;

  // تقسيم صفحات اليوم على الصلوات الخمس
  const pagesPerSalat = Math.max(1, Math.ceil(totalWirdPages / 5));
  const todayKey = new Date().toISOString().split('T')[0];
  const prayers = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
  const pKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  let salatHtml = prayers.map((pName, idx) => {
    const key = pKeys[idx];
    const isDone = (khatmaData.completedPrayers[todayKey] || []).includes(key);
    const pStart = Math.min(endPage, startPage + (idx * pagesPerSalat));
    const pEnd = Math.min(endPage, pStart + pagesPerSalat - 1);
    
    if (pStart > endPage) return '';

    return `
      <div class="salat-box ${isDone ? 'done' : ''}" onclick="toggleSalat('${todayKey}', '${key}', ${pStart}, ${pEnd})">
        <span>${isDone ? '✓' : '◯'} صلاة ${pName}</span>
        <small>(ص ${toAr(pStart)} : ${toAr(pEnd)})</small>
      </div>
    `;
  }).join('');

  wirdEl.innerHTML = `
    <div class="wird-card">
      <div class="wird-title">📖 ورد اليوم ${toAr(todayIndex + 1)} من ${toAr(khatmaData.totalDays)}</div>
      <div class="wird-pages-range">من الصفحة <b>${toAr(startPage)}</b> إلى الصفحة <b>${toAr(endPage)}</b> (${toAr(totalWirdPages)} صفحة)</div>
      
      <div class="salat-splitter-title">🕌 توزيع الورد على الصلوات الخمس:</div>
      <div class="salat-grid">${salatHtml}</div>

      <button class="btn-mark-all" onclick="markPagesRange(${startPage}, ${endPage}, true)">✅ تعليم ورد اليوم كاملاً كمقروء</button>
      
      <div class="focus-timer-box">
        ⏱️ الوقت المقدر للقراءة: <b>${toAr(totalWirdPages * 2)}</b> دقيقة
        <button onclick="startFocusTimer(${totalWirdPages * 2})">▶ بدء جلسة تركيز</button>
      </div>
    </div>
  `;
}

function toggleSalat(todayKey, salatKey, pStart, pEnd) {
  if (!khatmaData.completedPrayers[todayKey]) {
    khatmaData.completedPrayers[todayKey] = [];
  }
  const arr = khatmaData.completedPrayers[todayKey];
  const idx = arr.indexOf(salatKey);
  if (idx > -1) {
    arr.splice(idx, 1);
    markPagesRange(pStart, pEnd, false);
  } else {
    arr.push(salatKey);
    markPagesRange(pStart, pEnd, true);
  }
  saveKhatma();
  renderKhatma();
}

// -------------------------------------------------------------------------
// 5. ميزة إعادة التوازن الذكي (Smart Auto-Catchup)
// -------------------------------------------------------------------------
function checkCatchupStatus(todayIndex) {
  const catchupEl = document.getElementById('catchupNotice');
  if (!catchupEl) return;

  const expectedRead = Math.min(604, (todayIndex + 1) * khatmaData.pagesPerDay);
  const actualRead = khatmaData.readPages.length;

  if (expectedRead - actualRead >= 10) { // تأخر بأكثر من 10 صفحات
    const delayPages = expectedRead - actualRead;
    const remainingDays = Math.max(1, khatmaData.totalDays - todayIndex);
    const newDailyPages = Math.ceil((604 - actualRead) / remainingDays);

    catchupEl.style.display = 'block';
    catchupEl.innerHTML = `
      <div class="catchup-card">
        ⚠️ <b>متأخر بـ ${toAr(delayPages)} صفحة عن جدولك!</b>
        <p>لا تقلق، يمكنك إعادة التوازن بسهولة:</p>
        <button onclick="applyRescuePlan(${newDailyPages})">⚡ خيار الإنقاذ: تعديل الورد لـ ${toAr(newDailyPages)} صفحة/يوم</button>
        <button onclick="extendKhatmaDays(${Math.ceil(delayPages / khatmaData.pagesPerDay)})">🗓️ خيار التمديد: إضافة أيام للخطة</button>
      </div>
    `;
  } else {
    catchupEl.style.display = 'none';
  }
}

function applyRescuePlan(newDaily) {
  khatmaData.pagesPerDay = newDaily;
  saveKhatma();
  renderKhatma();
  alert("✅ تم تعديل خطتك اليومية بنجاح لتناسب تقدمك الحقيقي!");
}

function extendKhatmaDays(extraDays) {
  const endDate = new Date(khatmaData.endDate);
  endDate.setDate(endDate.getDate() + extraDays);
  khatmaData.endDate = endDate.toISOString();
  khatmaData.totalDays += extraDays;
  saveKhatma();
  renderKhatma();
  alert(`✅ تم تمديد الخطة بـ ${toAr(extraDays)} أيام إضافية!`);
}

// -------------------------------------------------------------------------
// 6. خريطة الذاكرة البصرية (Visual Heatmap Grid - 604 Pages)
// -------------------------------------------------------------------------
function renderVisualHeatmap() {
  const gridEl = document.getElementById('heatmapGrid');
  if (!gridEl) return;

  let gridHtml = '';
  for (let p = 1; p <= TOTAL_PAGES; p++) {
    const isRead = khatmaData.readPages.includes(p);
    gridHtml += `<div class="heatmap-page ${isRead ? 'read' : ''}" title="صفحة ${toAr(p)}" onclick="togglePageRead(${p})">${p % 10 === 0 ? toAr(p) : ''}</div>`;
  }
  gridEl.innerHTML = gridHtml;
}

// -------------------------------------------------------------------------
// 7. وضع السنن والجمعة (Sunnah Mode)
// -------------------------------------------------------------------------
function checkSunnahMode() {
  const sunnahEl = document.getElementById('sunnahNotice');
  if (!sunnahEl) return;

  const isFriday = new Date().getDay() === 5;
  if (isFriday) {
    sunnahEl.style.display = 'block';
    sunnahEl.innerHTML = `
      <div class="sunnah-card">
        ✨ <b>اليوم الجمعة!</b> نور ما بين الجمعتين.
        <br>📖 لا تنسَ قراءة سورة الكهف (الصفحات 293 - 304).
        <button onclick="markPagesRange(293, 304, true)">✅ تعليم سورة الكهف كمقروءة</button>
      </div>
    `;
  } else {
    sunnahEl.style.display = 'none';
  }
}

// -------------------------------------------------------------------------
// 8. سجل التدبر والمشاعر (Aya Insight Logbook)
// -------------------------------------------------------------------------
function addInsight(pageNo) {
  const text = prompt(`✍️ اكتب تدبراً أو آية أثرت فيك في الصفحة (${toAr(pageNo)}):`);
  if (text) {
    khatmaData.insights[pageNo] = text;
    saveKhatma();
    alert("✨ تم حفظ تدبرك بنجاح في دفترك القرآني!");
  }
}

// -------------------------------------------------------------------------
// 9. مؤقت جلسة التركيز (Focus Flow Timer)
// -------------------------------------------------------------------------
let timerInterval = null;
function startFocusTimer(minutes) {
  let seconds = minutes * 60;
  alert(`⏱️ بدأت جلسة التلاوة والتركيز لمدة ${toAr(minutes)} دقيقة. استعن بالله وابدأ!`);
  
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      alert("🎉 انتقت جلسة التركيز! تقبل الله منك.");
    }
  }, 1000);
}

// -------------------------------------------------------------------------
// 10. الختمة الجماعية العائلية (Family/Group Sync)
// -------------------------------------------------------------------------
function generateGroupKhatmaShare() {
  const text = `🤲 شارك معنا في الختمة الجماعية!\nاختر جزءاً لقرائته اليوم:\n` +
    `https://wa.me/?text=${encodeURIComponent('نرجو المشاركة في ختم القرآن الكريم، اختر جزءك الآن!')}`;
  window.open(text, '_blank');
}

// التهيئة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  renderKhatma();
});
function startCustomKhatma() {
  const input = document.getElementById('customDaysInput');
  if (!input) return;
  const days = parseInt(input.value);
  if (!days || days < 1) {
    alert('من فضلك اكتب عدد أيام صحيح');
    return;
  }
  startKhatma(days);
}

// إعادة إضافة دالة خطة الحفظ والمراجعة القديمة لكي لا يظهر خطأ calculateMemoPlan
function calculateMemoPlan() {
  try {
    const totalDays = parseInt(document.getElementById('memoTotalDays').value);
    const offDaysPerWeek = parseInt(document.getElementById('memoOffDays').value) || 0;

    if (!totalDays || totalDays < 30) {
      alert("يرجى إدخال مدة لا تقل عن شهر (30 يوم) لتوزيع الحفظ بشكل منطقي.");
      return;
    }
    
    const activeDays = totalDays - Math.floor((totalDays / 7) * offDaysPerWeek);
    const pagesPerDay = (604 / activeDays);
    
    let targetText = pagesPerDay <= 1 ? "صفحة واحدة يومياً" : Math.ceil(pagesPerDay) + " صفحات يومياً";

    document.getElementById('memoSetupForm').style.display = 'none';
    const resultDiv = document.getElementById('memoPlanResult');
    if(resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `
        <div style="color:var(--gold); font-weight:bold;">✅ خطتك جاهزة للبدء!</div>
        <div>🎯 هدفك اليومي للحفظ: <b>${targetText}</b></div>
      `;
    }
  } catch(e) { console.error(e); }
}
