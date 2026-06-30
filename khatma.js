// ===========================
// الختمة - الدوال
// ===========================
let khatmaData = JSON.parse(localStorage.getItem('khatma_data') || 'null');

function startKhatma(days) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + days);

  const totalSurahs = 114;
  const surahsPerDay = Math.ceil(totalSurahs / days);

  khatmaData = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    days: days,
    surahsPerDay: surahsPerDay,
    completedSurahs: [],
    lastUpdate: new Date().toDateString()
  };

  saveKhatma();
  renderKhatma();
  alert(`✅ تم إنشاء خطتك!\nستختم القرآن في ${days} يوم\nوردك اليومي: ${surahsPerDay} سورة تقريباً`);
}

function saveKhatma() {
  localStorage.setItem('khatma_data', JSON.stringify(khatmaData));
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
  const startIdx = todayIndex * khatmaData.surahsPerDay;
  const endIdx = Math.min(startIdx + khatmaData.surahsPerDay, 114);

  let todaySurahs = [];
  let todayPages = 0;
  for(let i = startIdx; i < endIdx; i++) {
    if(surahs[i]) {
      todaySurahs.push(surahs[i].name);
      todayPages += Math.ceil(surahs[i].ayat / 15);
    }
  }

  document.getElementById('todayWird').innerHTML = `
    <div class="wird-card">
      <div class="wird-title">📖 ورد اليوم (اليوم ${toAr(todayIndex + 1)} من ${toAr(khatmaData.days)})</div>
      <div class="wird-surahs">${todaySurahs.join(' • ')}</div>
      <div class="wird-pages">تقريباً ${toAr(todayPages)} صفحة</div>
    </div>
  `;

  let allSurahsHtml = surahs.map(s => {
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
