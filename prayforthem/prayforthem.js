// =========================================================
// 🚀 محرك قسم "ادعُ لهم" التفاعلي الذكي بالكامل
// =========================================================

// عبارات تشجيعية علوية تتغير عشوائياً عند كل دخول للقسم لدعم المستخدم
const prayEncouragements = [
  "🕊️ «مَا مِنْ عَبْدٍ مُسْلِمٍ يَدْعُو لأَخِيهِ بِظَهْرِ الْغَيْبِ، إِلاَّ قَالَ الْمَلَكُ: وَلَكَ بِمِثْلٍ»",
  "✨ دعاؤك لأخيك في غيبته شرفٌ عظيم، يُسخر الله لك بسببه ملكاً يدعو لك بالخير.",
  "🌱 اذكر أحبابك في صلاتك وخلواتك؛ فربَّ دعوة خفية رفعت بلاءً أو شفت مريضاً.",
  "💖 أعظم الحب دعاء في الخفاء؛ املأ صحيفتك الآن بأثر طيب لأحبائك الأحياء والأموات."
];

let selectedPrayGender = null;
let prayPersonsLog = JSON.parse(localStorage.getItem('athr_pray_persons') || '[]');

// أدعية أساسية مبرمجة بصيغتين (الذكر / الأنثى)
const basePrayersTemplates = [
  {
    male: "اللهم اغفر لـ {name} وارحمه، وعافه واعفُ عنه، وأكرم نزله ووسع مدخله.",
    female: "اللهم اغفر لـ {name} وارحمها، وعافها واعفُ عنها، وأكرم نزلها ووسع مدخلها."
  },
  {
    male: "اللهم اجعل لـ {name} من كل هم فرجاً، ومن كل ضيق مخرجاً، وارزقه من حيث لا يحتسب.",
    female: "اللهم اجعل لـ {name} من كل هم فرجاً، ومن كل ضيق مخرجاً، وارزقها من حيث لا تحتسب."
  },
  {
    male: "اللهم ثبّت قلب {name} على طاعتك، واكتب له التوفيق والسداد في الدنيا والآخرة.",
    female: "اللهم ثبّت قلب {name} على طاعتك، واكتب لها التوفيق والسداد في الدنيا والآخرة."
  }
];

// =========================================================
// 🛠️ فحص التسجيل (أمان وحجب القسم عن الزوار)
// =========================================================
window.initPrayForThemPage = function() {
  const contentArea = document.getElementById('prayForThemPageContainer');
  if (!contentArea) return;

  // فحص أمني: هل المستخدم مسجل دخول بجوجل؟
  const googleUser = localStorage.getItem('user_display_name');
  
  if (!googleUser) {
    contentArea.innerHTML = `
      <div class="comm-card" style="text-align: center; padding: 40px 15px; font-family: 'Amiri', serif; direction: rtl;">
        <div style="font-size: 50px; margin-bottom: 15px;">🔒</div>
        <h3 style="color: var(--gold); margin-bottom: 12px; font-size: 22px;">عذراً، هذا القسم خاص بالمسجلين</h3>
        <p style="color: var(--text2); font-size: 14px; margin-bottom: 25px; line-height: 1.6;">
          لحماية بيانات أحبابك المحفوظة ومزامنتها بأمان، يشترط ربط حسابك بجوجل أولاً لتتمكن من استخدام دفتر "ادعُ لهم".
        </p>
        <button onclick="window.triggerHeaderGoogleLogin()" style="background: var(--gold); color: #111; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-family: 'Amiri', serif; font-size: 15px; cursor: pointer;">
          🔑 ربط الحساب بجوجل الآن
        </button>
      </div>
    `;
    return;
  }

  // إذا كان مسجلاً، يتم تحميل الهيكل والبيانات
  window.renderPrayPageBody();
};

window.renderPrayPageBody = function() {
  // تغيير العبارة التشجيعية العلوية عشوائياً
  const randTxt = prayEncouragements[Math.floor(Math.random() * prayEncouragements.length)];
  const txtEl = document.getElementById('prayEncouragementTxt');
  if (txtEl) txtEl.textContent = randTxt;

  window.setPrayGender('male'); // وضع افتراضي للنوع
  window.renderPrayPersonsList();
};

window.setPrayGender = function(gender) {
  selectedPrayGender = gender;
  const maleBtn = document.getElementById('btnPrayMale');
  const femaleBtn = document.getElementById('btnPrayFemale');
  if (!maleBtn || !femaleBtn) return;

  if (gender === 'male') {
    maleBtn.style.borderColor = 'var(--gold)';
    maleBtn.style.background = 'rgba(212,175,55,0.08)';
    femaleBtn.style.borderColor = 'var(--border)';
    femaleBtn.style.background = 'transparent';
  } else {
    femaleBtn.style.borderColor = 'var(--gold)';
    femaleBtn.style.background = 'rgba(212,175,55,0.08)';
    maleBtn.style.borderColor = 'var(--border)';
    maleBtn.style.background = 'transparent';
  }
};

// =========================================================
// ➕ إضافة وحفظ شخص جديد في الذاكرة المحلية
// =========================================================
window.addNewPrayPerson = function() {
  const nameInput = document.getElementById('prayPersonName');
  if (!nameInput || !nameInput.value.trim()) { alert('فضلاً، اكتب اسم الشخص أولاً.'); return; }

  const newPerson = {
    id: Date.now(),
    name: nameInput.value.trim(),
    gender: selectedPrayGender,
    counts: [0, 0, 0] // عداد الـ 3 مرات للأدعية الثلاثة المخصصة له
  };

  prayPersonsLog.push(newPerson);
  localStorage.setItem('athr_pray_persons', JSON.stringify(prayPersonsLog));
  
  nameInput.value = "";
  window.renderPrayPersonsList();
};

// =========================================================
// 🎨 رندرة وقراءة كروت الدعاء التفاعلية
// =========================================================
window.renderPrayPersonsList = function() {
  const listArea = document.getElementById('prayPersonsList');
  if (!listArea) return;

  if (prayPersonsLog.length === 0) {
    listArea.innerHTML = `
      <div class="comm-card" style="text-align: center; padding: 20px; color: var(--text2); font-size: 13px;">
        سجلك فارغ حالياً.. أضف أباك، والدتك، أو صديقاً لتبدأ أثر الدعاء لهم بظهر الغيب 🤍
      </div>`;
    return;
  }

  let html = "";
  prayPersonsLog.forEach((person, pIdx) => {
    const icon = person.gender === 'male' ? '🧔' : '🧕';
    
    html += `
      <div class="comm-card" style="border-right: 3px solid var(--green); margin-bottom: 15px; background: var(--card);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 6px;">
          <strong style="color: var(--gold); font-size: 15px;">${icon} الدعاء لـ: ${person.name}</strong>
          <button onclick="window.deletePrayPerson(${person.id})" style="background: transparent; border: none; color: #ff6b6b; font-size: 12px; cursor: pointer;">✕ حذف</button>
        </div>
    `;

    // توليد الأدعية الثلاثة وصياغتها بناءً على نوع الشخص
    basePrayersTemplates.forEach((template, prIdx) => {
      const rawText = person.gender === 'male' ? template.male : template.female;
      const formattedText = rawText.replace(/{name}/g, person.name);
      const currentCount = person.counts[prIdx] || 0;
      const isDone = currentCount >= 3;

      html += `
        <div style="margin-bottom: 10px; padding: 8px 0;">
          <p style="color: var(--text); font-size: 15px; line-height: 1.7; text-align: justify; font-family: 'Amiri Quran', serif;">${formattedText}</p>
          <div class="pray-counter-box">
            <span style="font-size: 12px; color: var(--text2);">التكرار المطلوب: ٣ مرات</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="pCountText_${pIdx}_${prIdx}" class="pray-single-count ${isDone ? 'pray-done-text' : ''}">
                ${isDone ? '✓ تم ٣/٣' : window.toArDigits(currentCount) + ' / ٣'}
              </span>
              ${!isDone ? `<button onclick="window.incrementPrayCount(${pIdx}, ${prIdx})" id="pBtn_${pIdx}_${prIdx}" class="pray-click-btn">+ دعوة</button>` : ''}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  listArea.innerHTML = html;
};

// =========================================================
// 🔂 نظام الضغط لـ 3 مرات ومزامنة شعلة الأثر
// =========================================================
window.incrementPrayCount = function(pIdx, prIdx) {
  if (prayPersonsLog[pIdx].counts[prIdx] >= 3) return;

  prayPersonsLog[pIdx].counts[prIdx]++;
  localStorage.setItem('athr_pray_persons', JSON.stringify(prayPersonsLog));

  // تحديث فوري للواجهة
  const currentCount = prayPersonsLog[pIdx].counts[prIdx];
  const countTextEl = document.getElementById(`pCountText_${pIdx}_${prIdx}`);
  
  if (currentCount >= 3) {
    if (countTextEl) {
      countTextEl.textContent = '✓ تم ٣/٣';
      countTextEl.classList.add('pray-done-text');
    }
    const btn = document.getElementById(`pBtn_${pIdx}_${prIdx}`);
    if (btn) btn.remove(); // إخفاء الزرار فور الاكتمال
  } else {
    if (countTextEl) countTextEl.textContent = window.toArDigits(currentCount) + ' / ٣';
  }

  // تزويد شعلة الأثر تشجيعاً للدعاء بظهر الغيب
  if (typeof window.boostFlame === 'function') window.boostFlame(1.5);
};

window.deletePrayPerson = function(id) {
  if (!confirm('هل تريد حذف هذا الشخص من دفتر الدعاء؟')) return;
  prayPersonsLog = prayPersonsLog.filter(p => p.id !== id);
  localStorage.setItem('athr_pray_persons', JSON.stringify(prayPersonsLog));
  window.renderPrayPersonsList();
};

// دالة مساعدة للأرقام العربي الشرقية لثبات العرض
window.toArDigits = function(num) {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, w => arabicDigits[+w]);
};

// تشغيل الفحص التمهيدي
setTimeout(() => { if(typeof window.initPrayForThemPage === 'function') window.initPrayForThemPage(); }, 300);
