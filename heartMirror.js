// =========================================================================
// 🪞 مرآة القلب + ⚖️ ميزان يومك - محاسبة يومية شاملة
// كُن ذا أثر 2026
// =========================================================================
// الفكرة: كل ليلة، ميزان سريع (نعم/لا) بيتحرك بصرياً حسب إجاباتك،
// وتحته 3 أسئلة بسيطة (شكر / محاسبة / عزم)، وبمرور الوقت خط زمني
// لمحطات قلبك اليومية، من غير تعقيد ولا أحكام.
// =========================================================================

// ------------------- أدوات مساعدة (استخدام دوال التطبيق الأساسية لو موجودة) -------------------
function hmTodayKey() {
  if (typeof getTodayDateKey === 'function') return getTodayDateKey();
  return new Date().toLocaleDateString('en-CA');
}

function hmToArabicNum(n) {
  if (typeof toAr === 'function') return toAr(n);
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

function hmFormatDate(dateKey) {
  const d = new Date(dateKey);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('ar-EG', options);
}

function hmGetLog() {
  return JSON.parse(localStorage.getItem('heart_mirror_log') || '{}');
}

function hmSaveLog(log) {
  localStorage.setItem('heart_mirror_log', JSON.stringify(log));
}

// حساب عدد الأيام المتتالية اللي كتب فيها المستخدم (استمرارية)
function hmCalculateStreak() {
  const log = hmGetLog();
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = cursor.toLocaleDateString('en-CA');
    if (log[key]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      const todayKey = hmTodayKey();
      if (key === todayKey) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

// ------------------- بنود ميزان يومك -------------------
const hmScaleItems = [
  { id: 's1', text: 'صليت الصلوات في وقتها؟' },
  { id: 's2', text: 'قريت أو استمعت للقرآن؟' },
  { id: 's3', text: 'قلت أو فعلت خير لحد؟' },
  { id: 's4', text: 'ابتعدت عن ذنب بتكرره؟' },
  { id: 's5', text: 'ذكرت الله بقلب حاضر؟' }
];

// حالة مؤقتة لإجابات الميزان قبل الحفظ
window.hmCurrentScaleAnswers = {};

// ------------------- الصفحة الرئيسية -------------------
window.initHeartMirrorPage = function() {
  const container = document.getElementById('heartMirrorContainer');
  if (!container) return;

  const log = hmGetLog();
  const today = hmTodayKey();
  const todayEntry = log[today] || null;
  const streak = hmCalculateStreak();
  const totalEntries = Object.keys(log).length;

  // تجهيز إجابات الميزان: لو فيه إدخال محفوظ النهاردة، استخدمه، وإلا صفّر الحالة
  window.hmCurrentScaleAnswers = (todayEntry && todayEntry.scaleAnswers) ? { ...todayEntry.scaleAnswers } : {};

  container.innerHTML = `
    <div style="direction: rtl; text-align: right; font-family: 'Amiri', serif; display:flex; flex-direction:column; gap:16px;">

      <div style="text-align:center;">
        <div style="font-size:38px; margin-bottom:6px;">🪞</div>
        <p style="color: var(--text2); font-size: 13px; line-height:1.8;">
          كل ليلة، وازن يومك بسرعة، وبعدين خد دقيقة تسأل نفسك 3 أسئلة بسيطة. مفيش صح أو غلط هنا، بس صدق مع نفسك.
        </p>
      </div>

      <div style="display:flex; gap:10px;">
        <div style="flex:1; background: var(--card); border-radius:14px; padding:12px; text-align:center; border:1px solid var(--border);">
          <div style="font-size:22px; font-weight:bold; color:var(--gold);">${hmToArabicNum(streak)}</div>
          <div style="font-size:11px; color:var(--text2); margin-top:4px;">يوم متتالي 🔥</div>
        </div>
        <div style="flex:1; background: var(--card); border-radius:14px; padding:12px; text-align:center; border:1px solid var(--border);">
          <div style="font-size:22px; font-weight:bold; color:var(--gold);">${hmToArabicNum(totalEntries)}</div>
          <div style="font-size:11px; color:var(--text2); margin-top:4px;">محطة مسجلة</div>
        </div>
      </div>

      <!-- ⚖️ قسم ميزان يومك -->
      <div style="background: var(--card); border-radius:20px; padding:20px; border:1px solid var(--border); border-right:4px solid var(--gold);">
        <div style="font-size:14px; color:var(--gold); margin-bottom:14px; font-weight:bold; text-align:center;">⚖️ ميزان يومك</div>

        <div style="display:flex; justify-content:center; margin-bottom:18px;">
          <div id="hmScaleVisual" style="position:relative; width:220px; height:110px;">
            <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:6px; height:55px; background:var(--gold); border-radius:3px;"></div>
            <div style="position:absolute; bottom:52px; left:50%; transform:translateX(-50%); font-size:22px;">⚖️</div>
            <div id="hmScaleBeam" style="position:absolute; bottom:78px; left:50%; width:170px; height:4px; background:var(--gold); border-radius:2px; transform-origin:center center; transform:translateX(-50%) rotate(0deg); transition: transform 0.5s ease;">
              <span id="hmScaleLeftPan" style="position:absolute; right:-10px; top:6px; font-size:20px;">🌑</span>
              <span id="hmScaleRightPan" style="position:absolute; left:-10px; top:6px; font-size:20px;">✨</span>
            </div>
          </div>
        </div>

        <div id="hmScaleQuestions" style="display:flex; flex-direction:column; gap:10px; margin-bottom:14px;"></div>

        <div id="hmScorePercent" style="text-align:center; font-size:13px; color:var(--text2);"></div>
      </div>

      <!-- 📝 قسم الأسئلة الثلاثة -->
      <div style="background: var(--card); border-radius:20px; padding:20px; border:1px solid var(--border); border-right:4px solid var(--green);">
        <div style="font-size:13px; color:var(--green); margin-bottom:14px; font-weight:bold;">
          ${todayEntry ? '✅ كتبت محطة النهاردة — تقدر تعدلها' : '📝 محطة النهاردة'}
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:13px; color:var(--text); display:block; margin-bottom:6px;">💛 إيه اللي فرحت بيه لله النهاردة؟</label>
          <textarea id="hmGratitude" placeholder="نعمة، موقف، توفيق حسيت بيه..." style="width:100%; min-height:60px; padding:10px; border-radius:10px; background:var(--bg2); color:var(--text); border:1px solid var(--border); font-family:'Amiri',serif; font-size:14px; resize:vertical; outline:none;">${todayEntry ? (todayEntry.gratitude || '') : ''}</textarea>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:13px; color:var(--text); display:block; margin-bottom:6px;">🤍 إيه اللي حاسس إنك تحسنه أو ندمت عليه؟</label>
          <textarea id="hmRegret" placeholder="بصدق، من غير قسوة على نفسك..." style="width:100%; min-height:60px; padding:10px; border-radius:10px; background:var(--bg2); color:var(--text); border:1px solid var(--border); font-family:'Amiri',serif; font-size:14px; resize:vertical; outline:none;">${todayEntry ? (todayEntry.regret || '') : ''}</textarea>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:13px; color:var(--text); display:block; margin-bottom:6px;">🌱 إيه نيتك بكرة؟</label>
          <textarea id="hmIntention" placeholder="خطوة بسيطة تنوي تعملها..." style="width:100%; min-height:60px; padding:10px; border-radius:10px; background:var(--bg2); color:var(--text); border:1px solid var(--border); font-family:'Amiri',serif; font-size:14px; resize:vertical; outline:none;">${todayEntry ? (todayEntry.intention || '') : ''}</textarea>
        </div>

        <button onclick="window.saveHeartMirrorEntry()" style="width:100%; background: var(--gold); color:#111; border:none; padding:13px; border-radius:14px; font-family:'Amiri',serif; font-size:15px; font-weight:bold; cursor:pointer;">
          💾 ${todayEntry ? 'تحديث محطة اليوم' : 'احفظ محطة اليوم'}
        </button>
      </div>

      <div>
        <div style="font-size:14px; color:var(--gold); margin-bottom:10px; font-weight:bold;">🕰️ خط سيرك</div>
        <div id="hmTimeline" style="display:flex; flex-direction:column; gap:10px;"></div>
      </div>

    </div>
  `;

  window.hmRenderScaleQuestions();
  window.hmUpdateScaleVisual();
  window.renderHeartMirrorTimeline();
};

// ------------------- رسم أسئلة الميزان (أزرار نعم/لا) -------------------
window.hmRenderScaleQuestions = function() {
  const el = document.getElementById('hmScaleQuestions');
  if (!el) return;

  el.innerHTML = hmScaleItems.map(item => {
    const current = window.hmCurrentScaleAnswers[item.id];
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--bg2); padding:10px 12px; border-radius:12px; border:1px solid var(--border);">
        <span style="font-size:13px; color:var(--text); flex:1;">${item.text}</span>
        <div style="display:flex; gap:6px;">
          <button onclick="window.hmSetScaleAnswer('${item.id}', true)" style="background:${current === true ? '#4caf50' : 'var(--card)'}; color:${current === true ? '#fff' : 'var(--text2)'}; border:1px solid var(--border); padding:6px 14px; border-radius:10px; font-family:'Amiri',serif; font-size:12px; cursor:pointer;">نعم</button>
          <button onclick="window.hmSetScaleAnswer('${item.id}', false)" style="background:${current === false ? '#b04444' : 'var(--card)'}; color:${current === false ? '#fff' : 'var(--text2)'}; border:1px solid var(--border); padding:6px 14px; border-radius:10px; font-family:'Amiri',serif; font-size:12px; cursor:pointer;">لا</button>
        </div>
      </div>
    `;
  }).join('');
};

window.hmSetScaleAnswer = function(id, value) {
  window.hmCurrentScaleAnswers[id] = value;
  window.hmRenderScaleQuestions();
  window.hmUpdateScaleVisual();
};

// ------------------- تحريك الميزان بصرياً حسب الإجابات -------------------
window.hmUpdateScaleVisual = function() {
  const beam = document.getElementById('hmScaleBeam');
  const scoreEl = document.getElementById('hmScorePercent');
  if (!beam) return;

  const answers = Object.values(window.hmCurrentScaleAnswers);
  const answeredCount = answers.length;
  const yesCount = answers.filter(a => a === true).length;

  if (answeredCount === 0) {
    beam.style.transform = 'translateX(-50%) rotate(0deg)';
    if (scoreEl) scoreEl.textContent = 'جاوب على الأسئلة عشان يتحرك ميزانك';
    return;
  }

  const ratio = yesCount / answeredCount; // من 0 لـ 1
  // الميل: من -20 درجة (كله لا) لـ +20 درجة (كله نعم)
  const angle = (ratio - 0.5) * 40;
  beam.style.transform = `translateX(-50%) rotate(${angle}deg)`;

  const pct = Math.round(ratio * 100);
  if (scoreEl) {
    let msg;
    if (ratio >= 0.8) msg = `ميزانك مشرق اليوم — ${hmToArabicNum(pct)}% ✨`;
    else if (ratio >= 0.5) msg = `يوم لا بأس به — ${hmToArabicNum(pct)}%`;
    else msg = `يوم محتاج شوية اهتمام أكتر — ${hmToArabicNum(pct)}%`;
    scoreEl.textContent = msg;
  }
};

// ------------------- حفظ محطة اليوم (الميزان + الأسئلة الثلاثة) -------------------
window.saveHeartMirrorEntry = function() {
  const gratitude = document.getElementById('hmGratitude').value.trim();
  const regret = document.getElementById('hmRegret').value.trim();
  const intention = document.getElementById('hmIntention').value.trim();
  const scaleAnswers = { ...window.hmCurrentScaleAnswers };
  const scaleAnswered = Object.keys(scaleAnswers).length > 0;

  if (!gratitude && !regret && !intention && !scaleAnswered) {
    alert('جاوب على الميزان أو اكتب في حاجة من التلات أسئلة على الأقل 🙏');
    return;
  }

  const log = hmGetLog();
  const today = hmTodayKey();
  log[today] = {
    gratitude,
    regret,
    intention,
    scaleAnswers,
    savedAt: new Date().toISOString()
  };
  hmSaveLog(log);

  // مكافأة صغيرة لو نظام الشعلة موجود في التطبيق الأساسي
  if (typeof boostFlame === 'function') boostFlame(3);

  window.initHeartMirrorPage();
};

// ------------------- عرض الخط الزمني -------------------
window.renderHeartMirrorTimeline = function() {
  const el = document.getElementById('hmTimeline');
  if (!el) return;

  const log = hmGetLog();
  const entries = Object.entries(log).sort((a, b) => new Date(b[0]) - new Date(a[0]));

  if (entries.length === 0) {
    el.innerHTML = `
      <div style="text-align:center; padding:30px 15px; color:var(--text2);">
        <div style="font-size:40px; margin-bottom:10px;">🌱</div>
        <p style="font-size:13px;">لسه مفيش محطات مسجلة<br>ابدأ بأول محطة النهاردة</p>
      </div>
    `;
    return;
  }

  el.innerHTML = entries.map(([dateKey, entry]) => {
    const answers = entry.scaleAnswers ? Object.values(entry.scaleAnswers) : [];
    let scoreLabel = '';
    if (answers.length > 0) {
      const yesCount = answers.filter(a => a === true).length;
      const pct = Math.round((yesCount / answers.length) * 100);
      scoreLabel = `<span style="background:rgba(212,175,55,0.12); color:var(--gold); padding:3px 10px; border-radius:10px; font-size:11px; font-weight:bold;">⚖️ ${hmToArabicNum(pct)}%</span>`;
    }

    return `
      <div style="background: var(--card); border-radius:14px; padding:14px; border:1px solid var(--border); border-right:3px solid var(--green);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:11px; color:var(--gold);">${hmFormatDate(dateKey)}</div>
          ${scoreLabel}
        </div>
        ${entry.gratitude ? `<div style="font-size:13px; color:var(--text); margin-bottom:6px;"><span style="color:#e0b34d;">💛</span> ${entry.gratitude}</div>` : ''}
        ${entry.regret ? `<div style="font-size:13px; color:var(--text); margin-bottom:6px;"><span>🤍</span> ${entry.regret}</div>` : ''}
        ${entry.intention ? `<div style="font-size:13px; color:var(--text);"><span style="color:var(--green);">🌱</span> ${entry.intention}</div>` : ''}
      </div>
    `;
  }).join('');
};

