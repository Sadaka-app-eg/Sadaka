// ===========================
// الختمة - الدوال (محسوبة بالصفحات)
// ===========================
let khatmaData = JSON.parse(localStorage.getItem('khatma_data') || 'null');
const TOTAL_PAGES = 604;
// رقم الصفحة الحقيقي اللي تبدأ فيها كل سورة (مصحف المدينة 604 صفحة)
const surahStartPages = [1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,496,499,502,507,511,515,518,520,523,526,528,531,534,537,542,545,547,549,551,553,554,556,558,560,562,564,566,568,570,572,574,575,577,578,580,582,583,585,586,587,587,589,590,591,591,592,593,594,595,596,597,598,599,600,600,601,601,602,602,602,603,603,603,604,604,604,604];
function startKhatma(days) {
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
}
function startCustomKhatma() {
  const input = document.getElementById('customDaysInput');
  const days = parseInt(input.value);
  if(!days || days < 1) {
    alert('من فضلك اكتب عدد أيام صحيح');
    return;
  }
  startKhatma(days);
}
function saveKhatma() {
  localStorage.setItem('khatma_data', JSON.stringify(khatmaData));
}

function estimateSurahPages(ayatCount, surahNum) {
  const start = surahStartPages[surahNum - 1];
  const end = surahNum < 114 ? surahStartPages[surahNum] : 605;
  return Math.max(1, end - start);
}

function renderKhatma() {
  const setupEl = document.getElementById('khatmaSetup');
  const displayEl = document.getElementById('khatmaDisplay');
  if (!setupEl || !displayEl) return;

  if(!khatmaData) {
    setupEl.style.display = 'block';
    displayEl.style.display = 'none';
    return;
  }

  setupEl.style.display = 'none';
  displayEl.style.display = 'block';

  const progress = (khatmaData.completedSurahs.length / 114) * 100;
  document.getElementById('khatmaProgressText').textContent = toAr(Math.round(progress)) + '%';
  document.getElementById('khatmaProgressBar').style.width = progress + '%';

  const startDate = new Date(khatmaData.startDate);
  const endDate = new Date(khatmaData.endDate);
  const today = new Date();
  const daysLeft = Math.ceil((endDate - today) / (1000*60*60*24));

  document.getElementById('khatmaStats').innerHTML = `
    📅 بدأت: ${startDate.toLocaleDateString('ar-EG')}<br>
    🎯 تنتهي: ${endDate.toLocaleDateString('ar-EG')}<br>
    ⏳ باقي: ${toAr(Math.max(0, daysLeft))} يوم<br>
    ✅ مكتمل: ${toAr(khatmaData.completedSurahs.length)} / 114 سورة
  `;

  const todayIndex = Math.floor((today - startDate) / (1000*60*60*24));

  let cumulativePages = 0;
  let targetPages = khatmaData.pagesPerDay * (todayIndex + 1);
  let prevTargetPages = khatmaData.pagesPerDay * todayIndex;
  let todaySurahs = [];

  for(let i = 0; i < surahs.length; i++) {
    const sPages = estimateSurahPages(surahs[i].ayat, surahs[i].n);
    const sStart = cumulativePages;
    const sEnd = cumulativePages + sPages;

    if(sEnd > prevTargetPages && sStart < targetPages) {
      todaySurahs.push(surahs[i].name);
    }
    cumulativePages += sPages;
    if(cumulativePages >= targetPages) break;
  }

  if(todaySurahs.length === 0 && todayIndex < khatmaData.days) {
    todaySurahs.push('لا يوجد ورد جديد اليوم — استمر فيما سبق');
  }

  document.getElementById('todayWird').innerHTML = `
    <div class="wird-card">
      <div class="wird-title">📖 ورد اليوم (اليوم ${toAr(todayIndex + 1)} من ${toAr(khatmaData.days)})</div>
      <div class="wird-surahs">${todaySurahs.join(' • ')}</div>
      <div class="wird-pages">تقريباً ${toAr(khatmaData.pagesPerDay)} صفحة يومياً</div>
    </div>
  `;

  let allSurahsHtml = surahs.map(s => {
    const isCompleted = khatmaData.completedSurahs.includes(s.n);
    const sPages = estimateSurahPages(s.ayat);
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

  document.getElementById('completedSurahs').innerHTML = allSurahsHtml;
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

document.addEventListener('DOMContentLoaded', () => {
  renderKhatma();
});
