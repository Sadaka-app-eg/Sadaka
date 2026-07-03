// ===========================
// الختمة - الدوال (محسوبة بالصفحات)
// ===========================
let khatmaData = JSON.parse(localStorage.getItem('khatma_data') || 'null');
const TOTAL_PAGES = 604;

// رقم الصفحة الحقيقي اللي تبدأ فيها كل سورة (مصحف المدينة 604 صفحة)
const surahStartPages = [1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,496,499,502,507,511,515,518,520,523,526,528,531,534,537,542,545,547,549,551,553,554,556,558,560,562,564,566,568,570,572,574,575,577,578,580,582,583,585,586,587,587,589,590,591,591,592,593,594,595,596,597,598,599,600,600,601,601,602,602,602,603,603,603,604,604,604,604];

// مصفوفة احتياطية لأسماء السور لمنع الانهيار إذا كانت المصفوفة الخارجية غائبة
const backupSurahs = [
  {n:1, name:"الفاتحة", ayat:7, type:"مكية"}, {n:2, name:"البقرة", ayat:286, type:"مدنية"},
  {n:3, name:"آل عمران", ayat:200, type:"مدنية"}, {n:4, name:"النساء", ayat:176, type:"مدنية"},
  {n:5, name:"المائدة", ayat:120, type:"مدنية"}, {n:6, name:"الأنعام", ayat:165, type:"مكية"}
  // ملاحظة: يمكنك تركها هكذا، الكود سيتعامل مع المتاح دون أن ينهار
];

// دالة تحويل أرقام آمنة ومحلية تماماً ولا تعتمد على أي ملف خارجي
function toAr(num) {
  if (num === undefined || num === null) return '';
  // إذا كانت الدالة الخارجية الأصلية موجودة نستخدمها، وإلا نحولها محلياً بأمان
  if (typeof toArabicDigits === 'function') {
    return toArabicDigits(num);
  }
  return String(num).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

function startKhatma(days) {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    const pagesPerDay = Math.ceil(TOTAL_PAGES / days);

    khatmaData = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days: days,
      pagesPerDay: pagesPerDay,
      completedSurahs: [],
      lastUpdate: new Date().toDateString()
    };

    saveKhatma();
    renderKhatma();
    
    alert(`✅ تم إنشاء خطتك!\nستختم القرآن في ${days} يوم\nوردك اليومي: ${pagesPerDay} صفحة تقريباً`);
    window.location.reload();
  } catch (error) {
    console.error("خطأ في startKhatma:", error);
    // لو حصلت أي مشكلة امسح البيانات المعطوبة لتفادي بياض الشاشة وعِد التحميل
    localStorage.removeItem('khatma_data');
    window.location.reload();
  }
}

function startCustomKhatma() {
  try {
    const input = document.getElementById('customDaysInput');
    if(!input) {
      alert('لم يتم العثور على خانة إدخال الأيام الكاستم');
      return;
    }
    const days = parseInt(input.value);
    if(!days || days < 1) {
      alert('من فضلك اكتب عدد أيام صحيح');
      return;
    }
    startKhatma(days);
  } catch(e) {
    console.error(e);
    window.location.reload();
  }
}

function saveKhatma() {
  localStorage.setItem('khatma_data', JSON.stringify(khatmaData));
}

function estimateSurahPages(ayatCount, surahNum) {
  const start = surahStartPages[surahNum - 1] || 1;
  const end = surahNum < 114 ? (surahStartPages[surahNum] || 605) : 605;
  return Math.max(1, end - start);
}

function renderKhatma() {
  try {
    const setupEl = document.getElementById('khatmaSetup');
    const displayEl = document.getElementById('khatmaDisplay');
    if (!setupEl || !displayEl) return;

    if(!khatmaData) {
      setupEl.style.display = 'block';
      displayEl.style.display = 'none';
      setTimeout(showRandomMemoTip, 50);
      return;
    }

    setupEl.style.display = 'none';
    displayEl.style.display = 'block';

    // استخدام مصفوفة السور المعرفة بالتطبيق أو الاحتياطية لتجنب (Not Defined Error)
    let currentSurahsArray = [];
    if (typeof surahs !== 'undefined' && Array.isArray(surahs)) {
      currentSurahsArray = surahs;
    } else {
      currentSurahsArray = backupSurahs;
    }

    const progress = currentSurahsArray.length > 0 ? (khatmaData.completedSurahs.length / 114) * 100 : 0;
    
    const txtEl = document.getElementById('khatmaProgressText');
    const barEl = document.getElementById('khatmaProgressBar');
    if(txtEl) txtEl.textContent = toAr(Math.round(progress)) + '%';
    if(barEl) barEl.style.width = progress + '%';

    const startDate = new Date(khatmaData.startDate);
    const endDate = new Date(khatmaData.endDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000*60*60*24));

    const statsEl = document.getElementById('khatmaStats');
    if(statsEl) {
      statsEl.innerHTML = `
        📅 بدأت: ${startDate.toLocaleDateString('ar-EG')}<br>
        🎯 tanتهي: ${endDate.toLocaleDateString('ar-EG')}<br>
        ⏳ باقي: ${toAr(Math.max(0, daysLeft))} يوم<br>
        ✅ مكتمل: ${toAr(khatmaData.completedSurahs.length)} / ١١٤ سورة
      `;
    }

    const todayIndex = Math.floor((today - startDate) / (1000*60*60*24));

    let cumulativePages = 0;
    let targetPages = khatmaData.pagesPerDay * (todayIndex + 1);
    let prevTargetPages = khatmaData.pagesPerDay * todayIndex;
    let todaySurahs = [];

    for(let i = 0; i < currentSurahsArray.length; i++) {
      const sPages = estimateSurahPages(currentSurahsArray[i].ayat, currentSurahsArray[i].n);
      const sStart = cumulativePages;
      const sEnd = cumulativePages + sPages;

      if(sEnd > prevTargetPages && sStart < targetPages) {
        todaySurahs.push(currentSurahsArray[i].name);
      }
      cumulativePages += sPages;
      if(cumulativePages >= targetPages) break;
    }

    if(todaySurahs.length === 0 && todayIndex < khatmaData.days) {
      todaySurahs.push('لا يوجد ورد جديد اليوم — استمر فيما سبق');
    }

    const wirdEl = document.getElementById('todayWird');
    if(wirdEl) {
      wirdEl.innerHTML = `
        <div class="wird-card">
          <div class="wird-title">📖 ورد اليوم (اليوم ${toAr(todayIndex + 1)} من ${toAr(khatmaData.days)})</div>
          <div class="wird-surahs">${todaySurahs.join(' • ')}</div>
          <div class="wird-pages">تقريباً ${toAr(khatmaData.pagesPerDay)} صفحة يومياً</div>
        </div>
      `;
    }

    const compSurahsEl = document.getElementById('completedSurahs');
    if(compSurahsEl && currentSurahsArray.length > 0) {
      let allSurahsHtml = currentSurahsArray.map(s => {
        const isCompleted = khatmaData.completedSurahs.includes(s.n);
        return `<div class="khatma-surah-item ${isCompleted ? 'completed' : ''}">
          <div class="khatma-check ${isCompleted ? 'checked' : ''}" onclick="toggleKhatmaSurah(${s.n})">
            ${isCompleted ? '✓' : ''}
          </div>
          <div class="khatma-surah-info">
            <div class="khatma-surah-name">${s.name}</div>
             <div class="khatma-surah-pages">${toAr(s.ayat)} آية — ${s.type}</div>
          </div>
          <div style="color:var(--gold);font-size:12px;">${toAr(s.n)}</div>
        </div>`;
      }).join('');
      compSurahsEl.innerHTML = allSurahsHtml;
    }
  } catch (err) {
    console.error("خطأ داخلي أثناء رندرة الختمة:", err);
  }
}

function toggleKhatmaSurah(n) {
  if(!khatmaData) return;

  const idx = khatmaData.completedSurahs.indexOf(n);
  if(idx > -1) {
    khatmaData.completedSurahs.splice(idx, 1);
  } else {
    khatmaData.completedSurahs.push(n);
    if(navigator.vibrate) navigator.vibrate(30);
  }

  khatmaData.lastUpdate = new Date().toDateString();
  saveKhatma();
  renderKhatma();

  if(khatmaData.completedSurahs.length === 114) {
    setTimeout(() => {
      alert('🎉 مبروك! لقد ختمت القرآن الكريم!\nتقبل الله منك 🤲');
    }, 300);
  }
}

function resetKhatma() {
  if(!confirm('هل أنت متأكد من إعادة تعيين الختمة؟')) return;
  localStorage.removeItem('khatma_data');
  khatmaData = null;
  renderKhatma();
}

// مصفوفة نصائح وفضائل الحفظ المتجددة
const memoTipsAndVirtues = [
  "💡 نصيحة للحفظ: خصص وقتاً ثابتاً كل يوم (مثل بعد الفجر) فالعقل يكون أصفى والبركة أعم، وثبت مصحفاً واحداً لترتبط ذاكرتك البصرية بأماكن الآيات.",
  "✨ فضل القرآن: يُقال لصاحب القرآن اقرأ وارتقِ ورتل كما كنت ترتل في الدنيا، فإن منزلك عند آخر آية تقرؤها. (حديث صحيح)",
  "💡 نصيحة للمراجعة: مقدار المراجعة يجب أن يكون أكبر من مقدار الحفظ الجديد حتى لا يتفلت ما حفظته.. المراجعة هي سر التثبيت.",
  "✨ فضل القرآن: خيركم من تعلم القرآن وعلمه.. فكل حرف تحفظه وتتلوه لك به عشر حسنات.",
  "💡 خطوة عملية: استمع للورد الذي ستحفظه بصوت قارئ متقن عدة مرات قبل البدء في الحفظ لتصحيح النطق وتسهيل الترديد.",
  "✨ فضل القرآن: القرآن يشفع لأصحابه يوم القيامة، قال ﷺ: «اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه»."
];

function showRandomMemoTip() {
  const tipEl = document.getElementById('memoTipText');
  if (tipEl) {
    const randomTip = memoTipsAndVirtues[Math.floor(Math.random() * memoTipsAndVirtues.length)];
    tipEl.innerHTML = randomTip.replace(/^(.*?:)/, '<strong style="color:var(--gold)">$1</strong>');
  }
}

function calculateMemoPlan() {
  try {
    const totalDays = parseInt(document.getElementById('memoTotalDays').value);
    const offDaysPerWeek = parseInt(document.getElementById('memoOffDays').value) || 0;

    if (!totalDays || totalDays < 30) {
      alert("يرجى إدخال مدة لا تقل عن شهر (30 يوم) لتوزيع الحفظ بشكل منطقي.");
      return;
    }
    if (offDaysPerWeek >= 7) {
      alert("عدد أيام الإجازة غير منطقي يا هندسة!");
      return;
    }

    const weeks = totalDays / 7;
    const totalOffDays = Math.floor(weeks * offDaysPerWeek);
    const activeDays = totalDays - totalOffDays;
    const pagesPerDay = (604 / activeDays);
    
    let targetText = "";
    if (pagesPerDay <= 0.5) targetText = "نصف صفحة يومياً";
    else if (pagesPerDay <= 1) targetText = "صفحة واحدة يومياً";
    else if (pagesPerDay <= 2) targetText = "صفحتين (وجهين) يومياً";
    else if (pagesPerDay <= 5) targetText = "ربع حزب (5 صفحات) يومياً";
    else if (pagesPerDay <= 10) targetText = "نصف جزء (10 صفحات) يومياً";
    else if (pagesPerDay <= 20) targetText = "جزء كامل (20 صفحة) يومياً";
    else targetText = Math.ceil(pagesPerDay) + " صفحات يومياً";

    document.getElementById('memoSetupForm').style.display = 'none';
    const resultDiv = document.getElementById('memoPlanResult');
    resultDiv.style.display = 'block';
    
    resultDiv.innerHTML = `
      <div style="color:var(--gold); font-weight:bold; font-size: 15px; margin-bottom: 12px;">✅ خطتك جاهزة للبدء!</div>
      <div style="color:var(--text); font-size: 13px; line-height: 2.2; text-align: right; direction: rtl;">
        ⏱️ المدة الكلية: <b>${totalDays}</b> يوم<br>
        🏖️ إجمالي الإجازات: <b>${totalOffDays}</b> يوم<br>
        📖 أيام الحفظ الفعلية: <b>${activeDays}</b> يوم<br>
        🎯 هدفك اليومي للحفظ: <b style="color:var(--green); font-size:15px;">${targetText}</b>
      </div>
      <button onclick="resetMemoPlan()" style="margin-top: 14px; background:transparent; border: 1px solid #ff6b6b; color: #ff6b6b; padding: 8px 16px; border-radius: 12px; cursor: pointer; font-family:'Amiri',serif; width: 100%;">تعديل الخطة ↺</button>
    `;
  } catch(e) {
    console.error(e);
  }
}

function resetMemoPlan() {
  document.getElementById('memoSetupForm').style.display = 'block';
  document.getElementById('memoPlanResult').style.display = 'none';
  document.getElementById('memoPlanResult').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderKhatma();
  showRandomMemoTip();
  
  try {
    const memoForm = document.getElementById('memoSetupForm');
    if(memoForm) {
      const row = memoForm.querySelector('div[style*="display:flex"]');
      if(row) {
        row.style.flexDirection = 'column';
        row.style.gap = '10px';
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
          input.style.width = '100%';
          input.style.maxWidth = '100%';
        });
      }
    }
  } catch(e) {
    console.error(e);
  }
});
