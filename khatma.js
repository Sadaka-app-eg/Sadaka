// =========================================================================
// محرك الختمات المتعددة والمركبة الشامل - المحرك الكامل (v3.0)
// =========================================================================

(function () {
  "use strict";

  var TOTAL_PAGES = 604;
  var CHARS_PER_PAGE = 5250;

  // مخزن البيانات الرئيسي
  var storeData = JSON.parse(localStorage.getItem('multi_khatma_store_v3') || 'null') || {
    activeId: null,
    list: []
  };

  function toAr(num) {
    if (num === undefined || num === null) return '';
    if (typeof window.toArabicDigits === 'function') return window.toArabicDigits(num);
    return String(num).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; });
  }

  function saveStore() {
    localStorage.setItem('multi_khatma_store_v3', JSON.stringify(storeData));
  }

  function getActiveKhatma() {
    if (!storeData.activeId && storeData.list.length > 0) {
      storeData.activeId = storeData.list[0].id;
    }
    return storeData.list.find(function (k) { return k.id === storeData.activeId; }) || null;
  }

  // -------------------------------------------------------------------------
  // 1. نظام المعالج (Wizard) لإنشاء ختمة مخصصة وعميقة
  // -------------------------------------------------------------------------
  window.showKhatmaWizard = function () {
    document.getElementById('khatmaWizard').style.display = 'block';
    document.getElementById('khatmaDisplay').style.display = 'none';
    window.goToWizardStep(1);
  };

  window.goToWizardStep = function (step) {
    document.getElementById('wizardStep1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('wizardStep2').style.display = step === 2 ? 'block' : 'none';
  };

  window.finishKhatmaWizard = function () {
    var title = document.getElementById('khatmaTitleInput').value.trim();
    var days = parseInt(document.getElementById('khatmaDaysInput').value);
    var offDays = parseInt(document.getElementById('khatmaOffDaysInput')?.value || 0);

    var types = [];
    if (document.getElementById('chk_reading')?.checked) types.push('reading');
    if (document.getElementById('chk_memo')?.checked) types.push('memo');
    if (document.getElementById('chk_tadabbur')?.checked) types.push('tadabbur');
    if (document.getElementById('chk_tafsir')?.checked) types.push('tafsir');
    if (document.getElementById('chk_listening')?.checked) types.push('listening');

    if (types.length === 0) {
      alert('من فضلك اختر نوعاً واحداً على الأقل للختمة!');
      return;
    }
    if (!title) title = 'ختمة قرآنية';
    if (!days || days < 1) {
      alert('من فضلك اكتب عدد أيام صحيح');
      return;
    }

    // حساب الأيام الفعلية مع خصم الإجازات
    var totalWeeks = days / 7;
    var totalOffDays = Math.floor(totalWeeks * offDays);
    var activeDays = Math.max(1, days - totalOffDays);

    var newKhatma = {
      id: 'khatma_' + Date.now(),
      title: title,
      types: types,
      totalDays: days,
      offDaysPerWeek: offDays,
      activeDays: activeDays,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      pagesPerDay: Math.ceil(TOTAL_PAGES / activeDays),
      
      // تقدم الأنواع المختلفة
      readPages: [],
      memoPages: [], // للحفظ
      completedPrayers: {},
      tafsirDonePages: [],
      listeningDonePages: [],
      insights: {}, // {pageNo: "نص التدبر"}
      
      streak: 0,
      lastReadDate: null
    };

    storeData.list.push(newKhatma);
    storeData.activeId = newKhatma.id;
    saveStore();

    document.getElementById('khatmaWizard').style.display = 'none';
    window.renderKhatma();
    alert(`🎉 تم إنشاء "${title}" بنجاح!`);
  };

  // -------------------------------------------------------------------------
  // 2. إدارة وتنقل الختمات
  // -------------------------------------------------------------------------
  window.switchKhatma = function (id) {
    storeData.activeId = id;
    saveStore();
    window.renderKhatma();
  };

  window.deleteActiveKhatma = function () {
    var active = getActiveKhatma();
    if (!active) return;
    if (confirm(`هل أنت متأكد من حذف "${active.title}"؟`)) {
      storeData.list = storeData.list.filter(function (k) { return k.id !== active.id; });
      storeData.activeId = storeData.list.length > 0 ? storeData.list[0].id : null;
      saveStore();
      window.renderKhatma();
    }
  };

  // -------------------------------------------------------------------------
  // 3. التفاعل مع الصفحات والسلسلة 🔥
  // -------------------------------------------------------------------------
  window.togglePageRead = function (pageNo) {
    var active = getActiveKhatma();
    if (!active) return;

    var idx = active.readPages.indexOf(pageNo);
    if (idx > -1) {
      active.readPages.splice(idx, 1);
    } else {
      active.readPages.push(pageNo);
      updateStreak(active);
      if (navigator.vibrate) navigator.vibrate(25);
    }
    saveStore();
    window.renderKhatma();
  };

  function updateStreak(active) {
    var todayStr = new Date().toDateString();
    if (active.lastReadDate !== todayStr) {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (active.lastReadDate === yesterday.toDateString()) {
        active.streak = (active.streak || 0) + 1;
      } else if (!active.lastReadDate) {
        active.streak = 1;
      }
      active.lastReadDate = todayStr;
    }
  }

  window.markPagesRange = function (startPage, endPage, isRead) {
    if (isRead === undefined) isRead = true;
    var active = getActiveKhatma();
    if (!active) return;

    for (var p = startPage; p <= endPage; p++) {
      var idx = active.readPages.indexOf(p);
      if (isRead && idx === -1) {
        active.readPages.push(p);
        updateStreak(active);
      } else if (!isRead && idx > -1) {
        active.readPages.splice(idx, 1);
      }
    }
    saveStore();
    window.renderKhatma();
  };

  // -------------------------------------------------------------------------
  // 4. المحرك الرئيسي للعرض (Render Engine)
  // -------------------------------------------------------------------------
  window.renderKhatma = function () {
    renderTabs();

    var active = getActiveKhatma();
    var wizardEl = document.getElementById('khatmaWizard');
    var displayEl = document.getElementById('khatmaDisplay');

    if (!active) {
      if (wizardEl) wizardEl.style.display = 'block';
      if (displayEl) displayEl.style.display = 'none';
      return;
    }

    if (wizardEl) wizardEl.style.display = 'none';
    if (displayEl) displayEl.style.display = 'block';

    // الإحصائيات العامة
    document.getElementById('activeKhatmaTitle').textContent = active.title;
    
    var totalRead = active.readPages.length;
    var progressPercent = Math.min(100, (totalRead / TOTAL_PAGES) * 100);

    document.getElementById('khatmaProgressText').textContent = toAr(Math.round(progressPercent)) + '%';
    document.getElementById('khatmaProgressBar').style.width = progressPercent + '%';
    document.getElementById('khatmaStreak').textContent = `🔥 السلسلة: ${toAr(active.streak || 0)} يوم`;

    var approxHasanat = totalRead * CHARS_PER_PAGE * 10;
    var hasanatEl = document.getElementById('hasanatCounter');
    if (hasanatEl) {
      hasanatEl.innerHTML = `✨ الحسنات التقديرية: <b style="font-size:14px;color:var(--gold);">${toAr(approxHasanat.toLocaleString('ar-EG'))}</b> حسنة`;
    }

    var startDate = new Date(active.startDate);
    var endDate = new Date(active.endDate);
    var today = new Date();

    var daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
    var todayIndex = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));

    document.getElementById('khatmaStats').innerHTML = `
      📖 الصفحات المكتملة: <b>${toAr(totalRead)}</b> / ٦٠٤ صفحة<br>
      ⏳ المتبقي: <b>${toAr(TOTAL_PAGES - totalRead)}</b> صفحة (${toAr(daysLeft)} يومًا)<br>
      🎯 الورد اليومي المستهدف: <b>${toAr(active.pagesPerDay)}</b> صفحة
    `;

    renderTodayWird(active, todayIndex);
    renderVisualHeatmap(active);
  };

  function renderTabs() {
    var tabsEl = document.getElementById('khatmaTabs');
    if (!tabsEl) return;

    if (storeData.list.length === 0) {
      tabsEl.innerHTML = '<span style="font-size:12px; color:var(--text2);">لا توجد ختمات قائمة</span>';
      return;
    }

    var html = storeData.list.map(function (k) {
      var isActive = k.id === storeData.activeId;
      return `<button onclick="switchKhatma('${k.id}')" class="cat-btn" style="padding:6px 12px; font-size:12px; border-radius:10px; background:${isActive ? 'var(--gold)' : 'var(--card)'}; color:${isActive ? '#111' : 'var(--text)'}; font-weight:${isActive ? 'bold' : 'normal'}; border:1px solid var(--border);">${k.title}</button>`;
    }).join('');

    tabsEl.innerHTML = html;
  }

  // -------------------------------------------------------------------------
  // 5. بناء ورد اليوم الديناميكي بناءً على أنواع الختمة المحددة
  // -------------------------------------------------------------------------
  function renderTodayWird(active, todayIndex) {
    var wirdEl = document.getElementById('todayWird');
    if (!wirdEl) return;

    var startPage = Math.min(604, (todayIndex * active.pagesPerDay) + 1);
    var endPage = Math.min(604, (todayIndex + 1) * active.pagesPerDay);
    var totalWirdPages = (endPage - startPage) + 1;

    var todayKey = new Date().toISOString().split('T')[0];

    // أ) مكون موزع الصلوات الخمس (لختمة القراءة)
    var salatHtml = '';
    if (active.types.includes('reading')) {
      var pagesPerSalat = Math.max(1, Math.ceil(totalWirdPages / 5));
      var prayers = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
      var pKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

      salatHtml = `<div style="margin:10px 0 6px 0; font-size:13px; font-weight:bold;">🕌 توزيع القراءة على الصلوات الخمس:</div>
      <div class="salat-grid">` +
        prayers.map(function (pName, idx) {
          var key = pKeys[idx];
          var isDone = (active.completedPrayers[todayKey] || []).includes(key);
          var pStart = Math.min(endPage, startPage + (idx * pagesPerSalat));
          var pEnd = Math.min(endPage, pStart + pagesPerSalat - 1);

          if (pStart > endPage) return '';

          return `
            <div class="salat-box ${isDone ? 'done' : ''}" onclick="toggleSalat('${todayKey}', '${key}', ${pStart}, ${pEnd})">
              <span>${isDone ? '✓' : '◯'} صلاة ${pName}</span>
              <small>(ص ${toAr(pStart)} : ${toAr(pEnd)})</small>
            </div>
          `;
        }).join('') + `</div>`;
    }

    // ب) مكون ختمة الحفظ والمراجعة (Hifz Module)
    var hifzHtml = '';
    if (active.types.includes('memo')) {
      var revStart = Math.max(1, startPage - 20); // مراجعة جزء سابق
      hifzHtml = `
        <div style="margin-top:12px; padding:12px; background:rgba(46,125,50,0.1); border-right:4px solid var(--green); border-radius:10px; font-size:12px; line-height:1.8;">
          🧠 <b>جدول الحفظ والمراجعة اليومي:</b><br>
          🌱 <b>الحفظ الجديد:</b> الصفحات (${toAr(startPage)} إلى ${toAr(endPage)})<br>
          🔄 <b>المراجعة القريبة:</b> الصفحات (${toAr(revStart)} إلى ${toAr(Math.max(1, startPage - 1))})
        </div>
      `;
    }

    // ج) مكون ختمة التدبر (Tadabbur Module)
    var tadabburHtml = '';
    if (active.types.includes('tadabbur')) {
      var savedInsight = active.insights[startPage] || '';
      tadabburHtml = `
        <div style="margin-top:12px; padding:12px; background:rgba(212,175,55,0.1); border-right:4px solid var(--gold); border-radius:10px; font-size:12px;">
          💡 <b>سجل تدبر ورد اليوم:</b>
          <div style="margin-top:6px; display:flex; gap:6px;">
            <input type="text" id="insightInput_${startPage}" value="${savedInsight}" placeholder="آية لمست قلبك اليوم في وردك..." style="flex:1; padding:8px; border-radius:8px; background:var(--bg2); color:var(--text); border:1px solid var(--border); font-size:12px;">
            <button onclick="saveInsight(${startPage})" class="cat-btn" style="padding:8px 12px; background:var(--gold); color:#111; font-weight:bold;">حفظ 💾</button>
          </div>
        </div>
      `;
    }

    // د) مكون ختمة الاستماع والتفسير
    var audioTafsirHtml = '';
    if (active.types.includes('listening') || active.types.includes('tafsir')) {
      audioTafsirHtml = `
        <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
          ${active.types.includes('listening') ? `<button onclick="startFocusTimer(${totalWirdPages * 2})" class="cat-btn" style="flex:1; padding:8px; font-size:12px; background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--text);">🎧 بدء مؤقت الاستماع المركز (${toAr(totalWirdPages * 2)} دقيقة)</button>` : ''}
          ${active.types.includes('tafsir') ? `<button onclick="toggleTafsirRange(${startPage}, ${endPage})" class="cat-btn" style="flex:1; padding:8px; font-size:12px; background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--text);">📚 تأكيد قراءة تفسير الورد</button>` : ''}
        </div>
      `;
    }

    wirdEl.innerHTML = `
      <div class="wird-card" style="background:var(--card); padding:16px; border-radius:20px; border:1px solid var(--border); margin-top:10px;">
        <div class="wird-title" style="color:var(--gold); font-weight:bold; margin-bottom:8px;">📖 ورد اليوم ${toAr(todayIndex + 1)} من ${toAr(active.totalDays)}</div>
        <div class="wird-pages-range" style="margin-bottom:10px; font-size:13px;">المطالعة المقررة: من الصفحة <b>${toAr(startPage)}</b> إلى الصفحة <b>${toAr(endPage)}</b> (${toAr(totalWirdPages)} صفحة)</div>
        
        ${salatHtml}
        ${hifzHtml}
        ${tadabburHtml}
        ${audioTafsirHtml}

        <button class="cat-btn" style="width:100%; margin-top:14px; padding:12px; background:var(--green); color:#fff; border-color:var(--green); border-radius:12px; font-weight:bold;" onclick="markPagesRange(${startPage}, ${endPage}, true)">✅ تعليم ورد اليوم كاملاً كمكتمَل</button>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // 6. دوال مساعدة لحفظ التدبر والتفسير والمؤقت
  // -------------------------------------------------------------------------
  window.saveInsight = function (pageNo) {
    var active = getActiveKhatma();
    if (!active) return;
    var input = document.getElementById('insightInput_' + pageNo);
    if (input && input.value.trim()) {
      active.insights[pageNo] = input.value.trim();
      saveStore();
      alert("✨ تم حفظ تدبرك بنجاح في سجل الختمة!");
    }
  };

  window.toggleTafsirRange = function (startPage, endPage) {
    var active = getActiveKhatma();
    if (!active) return;
    for (var p = startPage; p <= endPage; p++) {
      if (!active.tafsirDonePages.includes(p)) active.tafsirDonePages.push(p);
    }
    saveStore();
    alert("📚 تم تسجيل إتمام تفسير ورد اليوم!");
  };

  var timerInterval = null;
  window.startFocusTimer = function (minutes) {
    var seconds = minutes * 60;
    alert(`⏱️ بدأت جلسة الاستماع والتركيز لمدة ${toAr(minutes)} دقيقة. استعن بالله وابدأ!`);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timerInterval);
        alert("🎉 انتهت جلسة الاستماع والتركيز! تقبل الله منك.");
      }
    }, 1000);
  };

  window.toggleSalat = function (todayKey, salatKey, pStart, pEnd) {
    var active = getActiveKhatma();
    if (!active) return;

    if (!active.completedPrayers[todayKey]) active.completedPrayers[todayKey] = [];
    var arr = active.completedPrayers[todayKey];
    var idx = arr.indexOf(salatKey);

    if (idx > -1) {
      arr.splice(idx, 1);
      window.markPagesRange(pStart, pEnd, false);
    } else {
      arr.push(salatKey);
      window.markPagesRange(pStart, pEnd, true);
    }
    saveStore();
    window.renderKhatma();
  };

  function renderVisualHeatmap(active) {
    var gridEl = document.getElementById('heatmapGrid');
    if (!gridEl) return;

    var gridHtml = '';
    for (var p = 1; p <= TOTAL_PAGES; p++) {
      var isRead = active.readPages.includes(p);
      gridHtml += `<div class="heatmap-page ${isRead ? 'read' : ''}" title="صفحة ${toAr(p)}" onclick="togglePageRead(${p})">${p % 10 === 0 ? toAr(p) : ''}</div>`;
    }
    gridEl.innerHTML = gridHtml;
  }

  // التحميل الأولي
  document.addEventListener('DOMContentLoaded', function () {
    window.renderKhatma();
  });

  // =========================================================================
  // دوال الميزات الخرافية الإضافية (رادار المتشابهات، الأرشيف، النسخ الاحتياطي)
  // =========================================================================

  // 1. قاعدة بيانات المتشابهات البارزة حسب الصفحات والسور
  var mutashabihatPageData = {
    2: "💡 البقرة (ص 2): انتبه لفاصلة «وَاعْلَمُوا أَنَّ اللَّهَ عَزِيزٌ حَكِيمٌ» ومواضع «غَفُورٌ حَلِيمٌ».",
    50: "💡 آل عمران (ص 50): تشابه بداية السورة مع ختام سورة البقرة في توحيد الإلهية والقيومية.",
    293: "💡 الكهف (ص 293): بداية السورة تتشابه مع الفاتحة والإسراء في الحمد والتنزيل.",
    582: "💡 النبأ (ص 582): انتبه لختام الفواصل المرفوعة «إِنَّ لِلْمُتَّقِينَ مَفَازًا»."
  };

  // 2. دالة رادار المتشابهات والتدبر للصفحة
  window.showPageMutashabihat = function(pageNo) {
    var active = getActiveKhatma();
    var note = mutashabihatPageData[pageNo] || "💡 لا توجد ملاحظات متشابهات مسجلة لهذه الصفحة، ركز في ضبط الفواصل الأخيرة.";
    var userInsight = (active && active.insights && active.insights[pageNo]) ? active.insights[pageNo] : "لم تدون تدبراً لهذه الصفحة بعد.";

    alert(`📖 معومات الصفحة (${toAr(pageNo)}):\n\n${note}\n\n✍️ تدبرك الشخصي:\n"${userInsight}"`);
  };

  // 3. دالة استعراض أرشيف التدبرات كاملاً
  window.showInsightsArchive = function() {
    var active = getActiveKhatma();
    if (!active || !active.insights || Object.keys(active.insights).length === 0) {
      alert("✍️ لا توجد تدبرات مسجلة في هذه الختمة حتى الآن. اكتب خواطرك عند قراءة الورد!");
      return;
    }

    var text = `📜 أرشيف تدبرات "${active.title}":\n\n`;
    for (var page in active.insights) {
      text += `• صفحة (${toAr(page)}): ${active.insights[page]}\n`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(text + "\n\n✅ تم نسخ السجل إلى الحافظة بنجاح!");
    } else {
      alert(text);
    }
  };

  // 4. دالة تصدير نسخة احتياطية من البيانات (Export)
  window.exportKhatmaData = function() {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem('multi_khatma_store_v3') || '{}');
    var downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `khatma_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 5. دالة استرجاع النسخة الاحتياطية (Import)
  window.importKhatmaData = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
        try {
          JSON.parse(event.target.result); // فحص الأمان
          localStorage.setItem('multi_khatma_store_v3', event.target.result);
          location.reload();
        } catch(err) {
          alert("❌ الملف غير صالح أو معطوب!");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // 6. دالة إنشاء نص الختمة الجماعية للتواصل الاجتماعي
  window.generateGroupKhatmaShare = function() {
    var active = getActiveKhatma();
    var title = active ? active.title : "الختمة الجماعية";
    var shareText = `🤲 شارك معنا في ${title}!\n\nاختر جزءك اليوم وشاركه معنا لختم القرآن الكريم:\nhttps://wa.me/?text=${encodeURIComponent('انضم إلينا في ختم القرآن الكريم، شاركنا اليوم!')}`;
    window.open(shareText, '_blank');
  };
})();
