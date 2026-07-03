// =========================================================================
// obeyPlan.js - محرك إدارة نظام "خطة الطاعة" التفاعلي الشامل لتطبيق "أثر"
// =========================================================================

// هيلكل ومجموعات المهام الجاهزة المصنفة إيمانيًا
const presetObeyTasks = {
  prayers: {
    title: "🕌 الصلوات والسنن",
    items: ["صلاة الفجر", "صلاة الظهر", "صلاة العصر", "صلاة المغرب", "صلاة العشاء", "الصلاة في المسجد", "السنن الرواتب", "صلاة الضحى", "قيام الليل", "الوتر"]
  },
  quran: {
    title: "📖 القرآن الكريم",
    items: ["ورد القرآن", "حفظ القرآن", "مراجعة الحفظ", "تدبر آيات"]
  },
  azkar: {
    title: "📿 الأذكار والأوراد",
    items: ["أذكار الصباح", "أذكار المساء", "أذكار بعد الصلاة", "أذكار النوم", "أذكار الاستيقاظ", "الاستغفار (100 مرة)", "الصلاة على النبي ﷺ", "التسبيح"]
  },
  goodDeeds: {
    title: "❤️ أعمال صالحة",
    items: ["صلة الرحم", "بر الوالدين", "صدقة", "الدعاء", "حضور درس علم", "قراءة حديث", "غض البصر", "حفظ اللسان"]
  }
};

// ترشيحات مستويات الصعوبة الذكية
const difficultyRecommendations = {
  beginner: ["صلاة الفجر", "صلاة الظهر", "صلاة العصر", "صلاة المغرب", "صلاة العشاء", "أذكار الصباح", "ورد القرآن"],
  medium: ["صلاة الفجر", "صلاة الظهر", "صلاة العصر", "صلاة المغرب", "صلاة العشاء", "الصلاة في المسجد", "السنن الرواتب", "أذكار الصباح", "أذكار المساء", "أذكار بعد الصلاة", "ورد القرآن", "صدقة", "بر الوالدين"],
  advanced: ["صلاة الفجر", "صلاة الظهر", "صلاة العصر", "صلاة المغرب", "صلاة العشاء", "الصلاة في المسجد", "السنن الرواتب", "صلاة الضحى", "قيام الليل", "الوتر", "ورد القرآن", "حفظ القرآن", "مراجعة الحفظ", "تدبر آيات", "أذكار الصباح", "أذكار المساء", "أذكار بعد الصلاة", "أذكار النوم", "الاستغفار (100 مرة)", "الصلاة على النبي ﷺ", "التسبيح", "غض البصر", "حفظ اللسان"]
};

let currentObeyPlan = JSON.parse(localStorage.getItem('current_obey_plan') || 'null');
let obeyPlanProgress = JSON.parse(localStorage.getItem('obey_plan_progress') || '{}');

window.initObeyPlanPage = function() {
  const container = document.getElementById('obeyPlanPageContainer');
  if (!container) return;

  if (!currentObeyPlan) {
    renderObeySetupMode(container);
  } else {
    renderObeyFollowUpMode(container);
  }
};

// واجهة إعداد وإنشاء خطة الطاعة لأول مرة
function renderObeySetupMode(container) {
  let html = `
    <div class="obey-welcome-card" style="background:var(--card); border:1px solid var(--border); border-right:4px solid var(--gold); padding:20px; border-radius:16px; margin-bottom:16px; text-align:center;">
      <div style="font-size:32px; margin-bottom:10px;">🌱</div>
      <p style="font-size:15px; line-height:1.8; color:var(--text); font-family:'Amiri', serif;">ابدأ ببناء برنامجك اليومي. اختر من المهام الجاهزة أو أضف مهامك الخاصة، وحدد مدة الخطة، وسيساعدك "أثر" على متابعة تزامك يومًا بعد يوم.</p>
    </div>

    <!-- كارت تحديد مستوى الصعوبة التلقائي -->
    <div style="background:var(--card); border:1px solid var(--border); padding:16px; border-radius:16px; margin-bottom:14px;">
      <div style="font-size:14px; color:var(--gold); font-family:'Amiri', serif; margin-bottom:10px; font-weight:bold;">🌿 اختيار مستوى الخطة (يرشح مهام تلقائية):</div>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
        <button class="mode-btn" id="diff_beginner" onclick="selectObeyDifficulty('beginner')">🌱 مبتدئ</button>
        <button class="mode-btn" id="diff_medium" onclick="selectObeyDifficulty('medium')">🌿 متوسط</button>
        <button class="mode-btn" id="diff_advanced" onclick="selectObeyDifficulty('advanced')">🌳 متقدم</button>
      </div>
    </div>

    <!-- حاويات المهام الجاهزة المقسمة -->
    <div style="background:var(--card); border:1px solid var(--border); padding:16px; border-radius:16px; margin-bottom:14px;">
      <div style="font-size:14px; color:var(--gold); font-family:'Amiri', serif; margin-bottom:12px; font-weight:bold;">📋 تخصيص وتحديد مهام خطتك:</div>
  `;

  for (const [catKey, catData] of Object.entries(presetObeyTasks)) {
    html += `
      <div style="font-size:13px; color:var(--gold); font-weight:bold; margin-top:10px; margin-bottom:8px; border-bottom:1px dashed var(--border); padding-bottom:4px;">${catData.title}</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;">
    `;
    catData.items.forEach((task, idx) => {
      html += `
        <button class="cat-btn obey-task-selector" id="preset_task_${catKey}_${idx}" onclick="toggleSelectPresetTask('${task}', 'preset_task_${catKey}_${idx}')" style="padding:10px 6px; font-size:12px; font-family:'Amiri', serif; text-align:center; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">+ ${task}</button>
      `;
    });
    html += `</div>`;
  }

  html += `
    <!-- إضافة مهمة خاصة مخصصة -->
    <div style="margin-top:14px; border-top:1px solid var(--border); padding-top:12px;">
      <div style="font-size:13px; color:var(--gold); font-weight:bold; margin-bottom:8px;">➕ مهمة خاصة مخصصة:</div>
      <div style="display:flex; gap:8px;">
        <input type="text" id="customObeyTaskInput" placeholder="اكتب اسم المهمة الخاصة..." style="flex:1; padding:10px; border-radius:10px; background:var(--bg2); color:var(--text); border:1px solid var(--border); font-family:'Amiri', serif; font-size:13px; outline:none;">
        <button onclick="addCustomObeyTaskField()" class="cat-btn" style="padding:0 16px; background:var(--gold); color:#111; font-weight:bold; border-color:var(--gold);">إضافة</button>
      </div>
      <div id="customObeyTasksList" style="display:flex; flex-direction:column; gap:6px; margin-top:8px;"></div>
    </div>
  </div>

  <!-- تحديد مدة خطة الطاعة والبداية -->
  <div style="background:var(--card); border:1px solid var(--border); padding:16px; border-radius:16px; margin-bottom:14px;">
    <div style="font-size:14px; color:var(--gold); font-family:'Amiri', serif; margin-bottom:10px; font-weight:bold;">⏱️ مدة خطة الطاعة:</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:10px;">
      <button class="mode-btn" id="dur_7" onclick="selectObeyDuration(7)">7 أيام</button>
      <button class="mode-btn" id="dur_14" onclick="selectObeyDuration(14)">14 يومًا</button>
      <button class="mode-btn" id="dur_30" onclick="selectObeyDuration(30)">30 يومًا</button>
      <button class="mode-btn" id="dur_100" onclick="selectObeyDuration(100)">100 يوم</button>
    </div>
    <div style="display:flex; gap:8px; margin-top:8px; align-items:center;">
      <span style="font-size:12px; color:var(--text2); white-space:nowrap;">مدة مخصصة بالأيام:</span>
      <input type="number" id="customObeyDurationInput" placeholder="أيام" min="1" oninput="selectObeyDuration('custom')" style="width:100%; padding:8px; border-radius:8px; background:var(--bg2); color:var(--text); border:1px solid var(--border); font-family:'Amiri', serif; font-size:14px; text-align:center; outline:none;">
    </div>
  </div>

  <button onclick="compileAndStartObeyPlan()" style="width:100%; background:var(--gold); color:#111; border:none; padding:14px; border-radius:14px; font-family:'Amiri', serif; font-size:16px; font-weight:700; cursor:pointer; margin-bottom:20px; box-shadow:0 4px 15px rgba(212,175,55,0.25);">🚀 اعتماد وبدء خطة الطاعة</button>
  `;

  container.innerHTML = html;
  window.selectedObeyTasks = [];
  window.selectedObeyDuration = 7;
  selectObeyDuration(7);
}

// تشغيل وتحديد مهام خطة الطاعة
window.toggleSelectPresetTask = function(taskName, elementId) {
  const btn = document.getElementById(elementId);
  if (!btn) return;

  if (window.selectedObeyTasks.includes(taskName)) {
    window.selectedObeyTasks = window.selectedObeyTasks.filter(t => t !== taskName);
    btn.classList.remove('active');
    btn.style.borderColor = 'var(--border)';
    btn.style.background = 'var(--card)';
    btn.style.color = 'var(--text2)';
  } else {
    window.selectedObeyTasks.push(taskName);
    btn.classList.add('active');
    btn.style.borderColor = 'var(--gold)';
    btn.style.background = 'rgba(212, 175, 55, 0.12)';
    btn.style.color = 'var(--gold)';
  }
};

window.selectObeyDifficulty = function(level) {
  document.querySelectorAll('[id^="diff_"]').forEach(b => b.classList.remove('active'));
  document.getElementById('diff_' + level).classList.add('active');

  // تصفية الاختيارات السابقة
  window.selectedObeyTasks = [];
  document.querySelectorAll('.obey-task-selector').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderColor = 'var(--border)';
    btn.style.background = 'var(--card)';
    btn.style.color = 'var(--text2)';
  });

  // تنشيط ترشيحات المستوى المختار بالملي
  const recommended = difficultyRecommendations[level];
  for (const catKey of Object.keys(presetObeyTasks)) {
    presetObeyTasks[catKey].items.forEach((task, idx) => {
      if (recommended.includes(task)) {
        const id = `preset_task_${catKey}_${idx}`;
        window.toggleSelectPresetTask(task, id);
      }
    });
  }
};

window.selectObeyDuration = function(days) {
  document.querySelectorAll('[id^="dur_"]').forEach(b => b.classList.remove('active'));
  if (days !== 'custom') {
    document.getElementById('dur_' + days).classList.add('active');
    window.selectedObeyDuration = days;
    document.getElementById('customObeyDurationInput').value = '';
  } else {
    const val = parseInt(document.getElementById('customObeyDurationInput').value);
    window.selectedObeyDuration = isNaN(val) ? 7 : val;
  }
};

window.addCustomObeyTaskField = function() {
  const input = document.getElementById('customObeyTaskInput');
  const txt = input.value.trim();
  if (!txt) return;

  if (!window.selectedObeyTasks.includes(txt)) {
    window.selectedObeyTasks.push(txt);
    const list = document.getElementById('customObeyTasksList');
    const row = document.createElement('div');
    row.className = 'notif-item selected';
    row.style.padding = '8px 12px';
    row.innerHTML = `<div class="notif-txt" style="flex:1; font-size:13px;">✨ ${txt} (مهمة خاصة)</div>`;
    list.appendChild(row);
  }
  input.value = '';
};

// تشغيل واعتماد الخطة النهائية وحفظ التواريخ بالملي
window.compileAndStartObeyPlan = function() {
  if (window.selectedObeyTasks.length === 0) {
    alert("من فضلك اختر مهمة أو طاعة واحدة على الأقل لبناء خطتك ⚠️");
    return;
  }

  currentObeyPlan = {
    tasks: window.selectedObeyTasks,
    duration: window.selectedObeyDuration,
    startDate: new Date().toISOString().split('T')[0]
  };

  localStorage.setItem('current_obey_plan', JSON.stringify(currentObeyPlan));
  obeyPlanProgress = {};
  localStorage.setItem('obey_plan_progress', JSON.stringify(obeyPlanProgress));

  initObeyPlanPage();
};

// واجهة جدول ومتابعة الخطة اليومية والإحصائيات التفاعلية
function renderObeyFollowUpMode(container) {
  const totalDays = currentObeyPlan.duration;
  const tasks = currentObeyPlan.tasks;
  
  // بناء جدول المتابعة التفاعلي الشامل بالملي
  let html = `
    <div style="background:var(--card); border:1px solid var(--border); border-right:4px solid var(--green); padding:14px; border-radius:16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:16px; color:var(--gold); font-weight:bold; font-family:'Amiri', serif;">🌿 جدول متابعة خطة الطاعة</div>
        <div style="font-size:11px; color:var(--text2); margin-top:2px;">اضغط على الخانة: ضغطة أولى (✅) • ثانية (❌) • ثالثة (فارغ)</div>
      </div>
      <div id="obeyTodayMotivateBadge" style="font-size:12px; font-weight:bold; font-family:'Amiri', serif;"></div>
    </div>

    <!-- جدول المتابعة الشامل -->
    <div style="width:100%; overflow-x:auto; background:var(--bg2); border-radius:14px; border:1px solid var(--border); margin-bottom:14px;">
      <table style="width:100%; border-collapse:collapse; font-size:13px; font-family:'Amiri', serif; text-align:center; min-width:400px; direction:rtl;">
        <thead>
          <tr style="background:var(--bg3); border-bottom:1px solid var(--border); color:var(--gold);">
            <th style="padding:12px 10px; text-align:right; font-weight:bold; position:sticky; right:0; background:var(--bg3); z-index:10; min-width:110px;">المهمة</th>
  `;

  // توليد أعمدة الأيام بمرونة
  for (let d = 1; d <= totalDays; d++) {
    html += `<th style="padding:10px; border-left:1px solid rgba(255,255,255,0.03); font-weight:bold; font-size:11px;">يوم ${d}</th>`;
  }
  html += `</tr></thead><tbody>`;

  // ضخ صفوف المهام داخل الجدول
  tasks.forEach((task, tIdx) => {
    html += `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
        <td style="padding:12px 10px; text-align:right; font-weight:bold; color:var(--text); position:sticky; right:0; background:var(--bg2); z-index:9; border-left:1px solid var(--border); white-space:nowrap; text-overflow:ellipsis; overflow:hidden; max-width:130px;">${task}</td>
    `;
    for (let d = 1; d <= totalDays; d++) {
      const cellKey = `d${d}_t${tIdx}`;
      const status = obeyPlanProgress[cellKey] || ''; // '' أو 'Y' أو 'N'
      let displaySymbol = '';
      let cellStyle = "cursor:pointer; font-size:16px; font-weight:bold; transition:all 0.15s; border-left:1px solid rgba(255,255,255,0.03);";
      
      if (status === 'Y') { displaySymbol = '✅'; cellStyle += "background:rgba(76,175,80,0.05);"; }
      else if (status === 'N') { displaySymbol = '❌'; cellStyle += "background:rgba(255,107,107,0.05);"; }

      html += `<td id="cell_${cellKey}" onclick="cycleObeyCellStatus('${cellKey}')" style="${cellStyle}">${displaySymbol}</td>`;
    }
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;

  // ضخ لوحة الإحصائيات الشاملة والمطورة بالملي
  html += `
    <div style="font-size:14px; color:var(--gold); font-family:'Amiri', serif; margin-bottom:10px; font-weight:bold;">📊 إحصائيات الالتزام بالخطة:</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
      <div class="stat-card" style="padding:10px;"><div class="stat-num" id="obey_stat_ratio" style="font-size:26px;">0%</div><div class="stat-label" style="font-size:10px;">نسبة الالتزام الإجمالية</div></div>
      <div class="stat-card" style="padding:10px;"><div class="stat-num" id="obey_stat_done" style="font-size:26px; color:var(--green);">0</div><div class="stat-label" style="font-size:10px;">مهام مكتملة</div></div>
      <div class="stat-card" style="padding:10px;"><div class="stat-num" id="obey_stat_missed" style="font-size:26px; color:#ff6b6b;">0</div><div class="stat-label" style="font-size:10px;">مهام فائتة</div></div>
      <div class="stat-card" style="padding:10px;"><div class="stat-num" id="obey_stat_streak" style="font-size:26px;">0 أيام</div><div class="stat-label" style="font-size:10px;">أطول سلسلة التزام</div></div>
    </div>

    <div style="background:var(--card); border:1px solid var(--border); padding:14px; border-radius:16px; margin-bottom:16px; font-size:13px; font-family:'Amiri', serif; line-height:1.8;">
      📌 <strong style="color:var(--gold);">أكثر مهمة محافظ عليها:</strong> <span id="obey_top_task" style="color:var(--green);">--</span><br>
      ⚠️ <strong style="color:#ff6b6b;">مهمة تحتاج اهتمامًا وعناية:</strong> <span id="obey_need_care_task" style="color:#ff6b6b;">--</span>
    </div>

    <!-- ميزة استنساخ ونسخ الخطة السابقة بضغطة واحدة -->
    <div style="display:flex; gap:8px; margin-bottom:20px;">
      <button onclick="cloneAndRestartObeyPlan()" class="cat-btn" style="flex:1; padding:12px; background:var(--bg3); border-color:var(--gold); color:var(--gold); font-weight:bold; font-size:13px;">🔄 نسخ الخطة الحالية لبدء واحدة جديدة</button>
      <button onclick="resetWholeObeyPlan()" class="cat-btn" style="padding:12px; background:transparent; border-color:rgba(255,100,100,0.3); color:#ff6b6b; font-size:13px;">↺ تصفير بالكامل</button>
    </div>
  `;

  container.innerHTML = html;
  calculateAndRenderObeyStats();
}

// تدوير حالة الخانة عند الضغط عليها تفاعلياً بالملي
window.cycleObeyCellStatus = function(cellKey) {
  const cell = document.getElementById(`cell_${cellKey}`);
  if (!cell) return;

  const currentStatus = obeyPlanProgress[cellKey] || ''; // '' -> 'Y' -> 'N' -> ''
  let newStatus = '';
  
  if (currentStatus === '') {
    newStatus = 'Y';
    cell.textContent = '✅';
    cell.style.background = 'rgba(76,175,80,0.06)';
  } else if (currentStatus === 'Y') {
    newStatus = 'N';
    cell.textContent = '❌';
    cell.style.background = 'rgba(255,107,107,0.06)';
  } else {
    newStatus = '';
    cell.textContent = '';
    cell.style.background = 'transparent';
  }

  obeyPlanProgress[cellKey] = newStatus;
  localStorage.setItem('obey_plan_progress', JSON.stringify(obeyPlanProgress));
  
  calculateAndRenderObeyStats();
};

// محرك حساب الإحصائيات والتحفيز الذكي بالملي
function calculateAndRenderObeyStats() {
  const totalDays = currentObeyPlan.duration;
  const tasks = currentObeyPlan.tasks;
  
  let totalDone = 0;
  let totalMissed = 0;
  
  // تجميع الحسابات لكل خلية في مصفوفة التقدم
  for (let d = 1; d <= totalDays; d++) {
    for (let t = 0; t < tasks.length; t++) {
      const status = obeyPlanProgress[`d${d}_t${t}`] || '';
      if (status === 'Y') totalDone++;
      if (status === 'N') totalMissed++;
    }
  }

  // 1. حساب النسبة المئوية للالتزام
  const totalCells = totalDays * tasks.length;
  const ratio = totalCells > 0 ? Math.round((totalDone / totalCells) * 100) : 0;
  
  document.getElementById('obey_stat_ratio').textContent = `${ratio}%`;
  document.getElementById('obey_stat_done').textContent = totalDone;
  document.getElementById('obey_stat_missed').textContent = totalMissed;

  // 2. حساب أطول سلسلة التزام (الأيام التي اكتملت مهامها بالكامل دون أي خطأ)
  let longestStreak = 0;
  let currentStreak = 0;
  for (let d = 1; d <= totalDays; d++) {
    let dayPerfect = true;
    let dayHasData = false;
    for (let t = 0; t < tasks.length; t++) {
      const status = obeyPlanProgress[`d${d}_t${t}`] || '';
      if (status !== '') dayHasData = true;
      if (status !== 'Y') dayPerfect = false;
    }
    if (dayHasData && dayPerfect) {
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }
  document.getElementById('obey_stat_streak').textContent = `${longestStreak} أيام`;

  // 3. فرز أكثر مهمة محافظ عليها والمهمة التي تحتاج اهتماماً بالملي
  let taskDoneCounts = tasks.map(() => 0);
  let taskMissedCounts = tasks.map(() => 0);

  for (let t = 0; t < tasks.length; t++) {
    for (let d = 1; d <= totalDays; d++) {
      const status = obeyPlanProgress[`d${d}_t${t}`] || '';
      if (status === 'Y') taskDoneCounts[t]++;
      if (status === 'N') taskMissedCounts[t]++;
    }
  }

  let maxDoneIdx = 0, maxMissedIdx = 0;
  for (let t = 1; t < tasks.length; t++) {
    if (taskDoneCounts[t] > taskDoneCounts[maxDoneIdx]) maxDoneIdx = t;
    if (taskMissedCounts[t] > taskMissedCounts[maxMissedIdx]) maxMissedIdx = t;
  }

  document.getElementById('obey_top_task').textContent = taskDoneCounts[maxDoneIdx] > 0 ? tasks[maxDoneIdx] : "--";
  document.getElementById('obey_need_care_task').textContent = taskMissedCounts[maxMissedIdx] > 0 ? tasks[maxMissedIdx] : "--";

  // 4. نظام لوجيك عبارات التحفيز الذكي بناءً على آخر يوم تم تعبئته
  const motivateBadge = document.getElementById('obeyTodayMotivateBadge');
  if (motivateBadge) {
    if (totalMissed > 0 && totalDone > 0) {
      motivateBadge.innerHTML = `<span style="color:var(--gold);">🌿 لا بأس، يوم جديد وفرصة جديدة.</span>`;
    } else if (totalDone > 0 && totalMissed === 0) {
      motivateBadge.innerHTML = `<span style="color:var(--green);">🎉 أحسنت! أتممت جميع مهام اليوم.</span>`;
    } else {
      motivateBadge.innerHTML = `<span style="color:var(--text2);">ثبّت التزامك اليومي 🌿</span>`;
    }
  }
}

// زر استنساخ ونسخ الخطة السابقة وبدء خطة جديدة بنفس المهام بضغطة واحدة
window.cloneAndRestartObeyPlan = function() {
  if (!currentObeyPlan) return;
  if (confirm("هل تريد بدء خطة جديدة مباركة بنفس المهام المحددة حالياً وبأيام مصفّرة بالكامل؟")) {
    currentObeyPlan.startDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('current_obey_plan', JSON.stringify(currentObeyPlan));
    obeyPlanProgress = {};
    localStorage.setItem('obey_plan_progress', JSON.stringify(obeyPlanProgress));
    initObeyPlanPage();
  }
};

window.resetWholeObeyPlan = function() {
  if (confirm("هل أنت متأكد من حذف خطة الطاعة الحالية وتصفير الأيام للبدء من جديد؟")) {
    localStorage.removeItem('current_obey_plan');
    localStorage.removeItem('obey_plan_progress');
    currentObeyPlan = null;
    obeyPlanProgress = {};
    initObeyPlanPage();
  }
};
