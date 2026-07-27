// =========================================================================
// الختمة الشاملة المدمجة - الحفظ + الختمة بالصفحات + الميزات الخرافية
// =========================================================================

(function () {
  "use strict";

  // 1. التعريفات الأساسية (محمية داخل نطاق مغلق لمنع أخطاء التكرار)
  var TOTAL_PAGES = 604;

  var surahStartPagesArray = [
    1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267,
    282, 293, 305, 312, 322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415,
    418, 428, 434, 440, 446, 453, 458, 467, 477, 483, 489, 496, 499, 502, 507, 511,
    515, 518, 523, 526, 528, 531, 534, 537, 542, 545, 549, 553, 554, 556, 558, 560,
    562, 564, 566, 568, 570, 572, 574, 575, 577, 579, 582, 583, 585, 586, 587, 589,
    590, 591, 592, 593, 594, 595, 596, 596, 597, 598, 598, 599, 599, 600, 600, 601,
    601, 601, 602, 602, 602, 602, 603, 603, 603, 603, 604, 604, 604, 604, 604, 604, 604, 604
  ];

  var mutashabihatData = {
    2: "💡 متشابهات البقرة: انتبه لفاصلة «وَاعْلَمُوا أَنَّ اللَّهَ...» مع «عَزِيزٌ حَكِيمٌ» أو «غَفُورٌ حَلِيمٌ».",
    3: "💡 متشابهات آل عمران: تشابه بين نهايات آيات الاستغفار والجزاء مع سورة النساء.",
    7: "💡 متشابهات الأعراف: انتبه لقصص الأنبياء وتباديل «قَالَ الْمَلَأُ» بين الأعراف وهود.",
    18: "💡 سورة الكهف: «وَقُلِ الْحَقُّ مِن رَّبِّكُمْ...» تتشابه مع ختام الفواصل المرفوعة."
  };

  var memoTipsAndVirtues = [
    "💡 نصيحة للحفظ: خصص وقتاً ثابتاً كل يوم (مثل بعد الفجر) فالعقل يكون أصفى والبركة أعم، وثبت مصحفاً واحداً لترتبط ذاكرتك البصرية بأماكن الآيات.",
    "✨ فضل القرآن: يُقال لصاحب القرآن اقرأ وارتقِ ورتل كما كنت ترتل في الدنيا، فإن منزلك عند آخر آية تقرؤها. (حديث صحيح)",
    "💡 نصيحة للمراجعة: مقدار المراجعة يجب أن يكون أكبر من مقدار الحفظ الجديد حتى لا يتفلت ما حفظته.. المراجعة هي سر التثبيت.",
    "✨ فضل القرآن: خيركم من تعلم القرآن وعلمه.. فكل حرف تحفظه وتتلوه لك به عشر حسنات.",
    "💡 خطوة عملية: استمع للورد الذي ستحفظه بصوت قارئ متقن عدة مرات قبل البدء في الحفظ لتصحيح النطق وتسهيل الترديد.",
    "✨ فضل القرآن: القرآن يشفع لأصحابه يوم القيامة، قال ﷺ: «اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه»."
  ];

  var khatmaData = JSON.parse(localStorage.getItem('khatma_data_v2') || 'null');

  function toAr(num) {
    if (num === undefined || num === null) return '';
    if (typeof window.toArabicDigits === 'function') return window.toArabicDigits(num);
    return String(num).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; });
  }

  function saveKhatma() {
    localStorage.setItem('khatma_data_v2', JSON.stringify(khatmaData));
  }

  // -------------------------------------------------------------------------
  // 2. دوال الختمة الرئيسية المربوطة بـ window للأزرار
  // -------------------------------------------------------------------------
  window.startKhatma = function (days) {
    try {
      var startDate = new Date();
      var endDate = new Date();
      endDate.setDate(startDate.getDate() + days);

      var pagesPerDay = Math.ceil(TOTAL_PAGES / days);

      khatmaData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDays: days,
        pagesPerDay: pagesPerDay,
        readPages: [],
        completedPrayers: {},
        insights: {},
        lastUpdate: new Date().toISOString()
      };

      saveKhatma();
      window.renderKhatma();
      alert(`✅ تم إنشاء خطتك بنجاح!\nوردك اليومي: ${toAr(pagesPerDay)} صفحة\nتكتمل خلال: ${toAr(days)} يومًا`);
    } catch (e) {
      console.error("خطأ في بدء الختمة:", e);
    }
  };

  window.startCustomKhatma = function () {
    var input = document.getElementById('customDaysInput');
    if (!input) return;
    var days = parseInt(input.value);
    if (!days || days < 1) {
      alert('من فضلك اكتب عدد أيام صحيح');
      return;
    }
    window.startKhatma(days);
  };

  window.togglePageRead = function (pageNo) {
    if (!khatmaData) return;
    var idx = khatmaData.readPages.indexOf(pageNo);
    if (idx > -1) {
      khatmaData.readPages.splice(idx, 1);
    } else {
      khatmaData.readPages.push(pageNo);
      if (navigator.vibrate) navigator.vibrate(20);
    }
    saveKhatma();
    window.renderKhatma();
  };

  window.markPagesRange = function (startPage, endPage, isRead) {
    if (isRead === undefined) isRead = true;
    if (!khatmaData) return;
    for (var p = startPage; p <= endPage; p++) {
      var idx = khatmaData.readPages.indexOf(p);
      if (isRead && idx === -1) khatmaData.readPages.push(p);
      else if (!isRead && idx > -1) khatmaData.readPages.splice(idx, 1);
    }
    saveKhatma();
    window.renderKhatma();
  };

  window.renderKhatma = function () {
    try {
      var setupEl = document.getElementById('khatmaSetup');
      var displayEl = document.getElementById('khatmaDisplay');
      if (!setupEl || !displayEl) return;

      if (!khatmaData) {
        setupEl.style.display = 'block';
        displayEl.style.display = 'none';
        window.showRandomMemoTip();
        return;
      }

      setupEl.style.display = 'none';
      displayEl.style.display = 'block';

      var totalRead = khatmaData.readPages.length;
      var progressPercent = Math.min(100, (totalRead / TOTAL_PAGES) * 100);

      var txtEl = document.getElementById('khatmaProgressText');
      var barEl = document.getElementById('khatmaProgressBar');
      if (txtEl) txtEl.textContent = toAr(Math.round(progressPercent)) + '%';
      if (barEl) barEl.style.width = progressPercent + '%';

      var startDate = new Date(khatmaData.startDate);
      var endDate = new Date(khatmaData.endDate);
      var today = new Date();

      var diffTime = endDate - today;
      var daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      var todayIndex = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));

      var statsEl = document.getElementById('khatmaStats');
      if (statsEl) {
        statsEl.innerHTML = `
          📖 الصفحات المكتملة: <b>${toAr(totalRead)}</b> / ٦٠٤ صفحة<br>
          ⏳ المتبقي: <b>${toAr(TOTAL_PAGES - totalRead)}</b> صفحة (${toAr(daysLeft)} يومًا)<br>
          🎯 الورد اليومي المستهدف: <b>${toAr(khatmaData.pagesPerDay)}</b> صفحة
        `;
      }

      renderTodayWird(todayIndex);
      checkCatchupStatus(todayIndex);
      renderVisualHeatmap();
      checkSunnahMode();

    } catch (err) {
      console.error("خطأ أثناء رندرة الختمة:", err);
    }
  };

  function renderTodayWird(todayIndex) {
    var wirdEl = document.getElementById('todayWird');
    if (!wirdEl) return;

    var startPage = Math.min(604, (todayIndex * khatmaData.pagesPerDay) + 1);
    var endPage = Math.min(604, (todayIndex + 1) * khatmaData.pagesPerDay);
    var totalWirdPages = (endPage - startPage) + 1;

    var pagesPerSalat = Math.max(1, Math.ceil(totalWirdPages / 5));
    var todayKey = new Date().toISOString().split('T')[0];
    var prayers = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
    var pKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    var salatHtml = prayers.map(function (pName, idx) {
      var key = pKeys[idx];
      var isDone = (khatmaData.completedPrayers[todayKey] || []).includes(key);
      var pStart = Math.min(endPage, startPage + (idx * pagesPerSalat));
      var pEnd = Math.min(endPage, pStart + pagesPerSalat - 1);

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
        
        <div class="focus-timer-box" style="margin-top:10px;">
          ⏱️ الوقت المقدر للقراءة: <b>${toAr(totalWirdPages * 2)}</b> دقيقة
          <button onclick="startFocusTimer(${totalWirdPages * 2})">▶ بدء جلسة تركيز</button>
        </div>
      </div>
    `;
  }

  window.toggleSalat = function (todayKey, salatKey, pStart, pEnd) {
    if (!khatmaData.completedPrayers[todayKey]) {
      khatmaData.completedPrayers[todayKey] = [];
    }
    var arr = khatmaData.completedPrayers[todayKey];
    var idx = arr.indexOf(salatKey);
    if (idx > -1) {
      arr.splice(idx, 1);
      window.markPagesRange(pStart, pEnd, false);
    } else {
      arr.push(salatKey);
      window.markPagesRange(pStart, pEnd, true);
    }
    saveKhatma();
    window.renderKhatma();
  };

  function checkCatchupStatus(todayIndex) {
    var catchupEl = document.getElementById('catchupNotice');
    if (!catchupEl) return;

    var expectedRead = Math.min(604, (todayIndex + 1) * khatmaData.pagesPerDay);
    var actualRead = khatmaData.readPages.length;

    if (expectedRead - actualRead >= 10) {
      var delayPages = expectedRead - actualRead;
      var remainingDays = Math.max(1, khatmaData.totalDays - todayIndex);
      var newDailyPages = Math.ceil((604 - actualRead) / remainingDays);

      catchupEl.style.display = 'block';
      catchupEl.innerHTML = `
        <div class="catchup-card">
          ⚠️ <b>متأخر بـ ${toAr(delayPages)} صفحة عن جدولك!</b>
          <p style="margin:5px 0;">لا تقلق، يمكنك إعادة التوازن بسهولة:</p>
          <button onclick="applyRescuePlan(${newDailyPages})">⚡ خيار الإنقاذ: تعديل الورد لـ ${toAr(newDailyPages)} صفحة/يوم</button>
          <button onclick="extendKhatmaDays(${Math.ceil(delayPages / khatmaData.pagesPerDay)})">🗓️ خيار التمديد: إضافة أيام للخطة</button>
        </div>
      `;
    } else {
      catchupEl.style.display = 'none';
    }
  }

  window.applyRescuePlan = function (newDaily) {
    khatmaData.pagesPerDay = newDaily;
    saveKhatma();
    window.renderKhatma();
    alert("✅ تم تعديل خطتك اليومية بنجاح لتناسب تقدمك الحقيقي!");
  };

  window.extendKhatmaDays = function (extraDays) {
    var endDate = new Date(khatmaData.endDate);
    endDate.setDate(endDate.getDate() + extraDays);
    khatmaData.endDate = endDate.toISOString();
    khatmaData.totalDays += extraDays;
    saveKhatma();
    window.renderKhatma();
    alert(`✅ تم تمديد الخطة بـ ${toAr(extraDays)} أيام إضافية!`);
  };

  function renderVisualHeatmap() {
    var gridEl = document.getElementById('heatmapGrid');
    if (!gridEl) return;

    var gridHtml = '';
    for (var p = 1; p <= TOTAL_PAGES; p++) {
      var isRead = khatmaData.readPages.includes(p);
      gridHtml += `<div class="heatmap-page ${isRead ? 'read' : ''}" title="صفحة ${toAr(p)}" onclick="togglePageRead(${p})">${p % 10 === 0 ? toAr(p) : ''}</div>`;
    }
    gridEl.innerHTML = gridHtml;
  }

  function checkSunnahMode() {
    var sunnahEl = document.getElementById('sunnahNotice');
    if (!sunnahEl) return;

    var isFriday = new Date().getDay() === 5;
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

  window.addInsight = function (pageNo) {
    var text = prompt(`✍️ اكتب تدبراً أو آية أثرت فيك في الصفحة (${toAr(pageNo)}):`);
    if (text) {
      khatmaData.insights[pageNo] = text;
      saveKhatma();
      alert("✨ تم حفظ تدبرك بنجاح في دفترك القرآني!");
    }
  };

  var timerInterval = null;
  window.startFocusTimer = function (minutes) {
    var seconds = minutes * 60;
    alert(`⏱️ بدأت جلسة التلاوة والتركيز لمدة ${toAr(minutes)} دقيقة. استعن بالله وابدأ!`);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timerInterval);
        alert("🎉 انتهت جلسة التركيز! تقبل الله منك.");
      }
    }, 1000);
  };

  window.generateGroupKhatmaShare = function () {
    var text = `🤲 شارك معنا في الختمة الجماعية!\nاختر جزءاً لقرائته اليوم:\n` +
      `https://wa.me/?text=${encodeURIComponent('نرجو المشاركة في ختم القرآن الكريم، اختر جزءك الآن!')}`;
    window.open(text, '_blank');
  };

  // -------------------------------------------------------------------------
  // 3. قسم خطة الحفظ والمراجعة + النصائح المتجددة (كامل بجمالياته)
  // -------------------------------------------------------------------------
  window.showRandomMemoTip = function () {
    var tipEl = document.getElementById('memoTipText');
    if (tipEl) {
      var randomTip = memoTipsAndVirtues[Math.floor(Math.random() * memoTipsAndVirtues.length)];
      tipEl.innerHTML = randomTip.replace(/^(.*?:)/, '<strong style="color:var(--gold)">$1</strong>');
    }
  };

  window.calculateMemoPlan = function () {
    try {
      var totalDays = parseInt(document.getElementById('memoTotalDays').value);
      var offDaysPerWeek = parseInt(document.getElementById('memoOffDays').value) || 0;

      if (!totalDays || totalDays < 30) {
        alert("يرجى إدخال مدة لا تقل عن شهر (30 يوم) لتوزيع الحفظ بشكل منطقي.");
        return;
      }
      if (offDaysPerWeek >= 7) {
        alert("عدد أيام الإجازة غير منطقي يا هندسة!");
        return;
      }

      var weeks = totalDays / 7;
      var totalOffDays = Math.floor(weeks * offDaysPerWeek);
      var activeDays = totalDays - totalOffDays;
      var pagesPerDay = (604 / activeDays);

      var targetText = "";
      if (pagesPerDay <= 0.5) targetText = "نصف صفحة يومياً";
      else if (pagesPerDay <= 1) targetText = "صفحة واحدة يومياً";
      else if (pagesPerDay <= 2) targetText = "صفحتين (وجهين) يومياً";
      else if (pagesPerDay <= 5) targetText = "ربع حزب (5 صفحات) يومياً";
      else if (pagesPerDay <= 10) targetText = "نصف جزء (10 صفحات) يومياً";
      else if (pagesPerDay <= 20) targetText = "جزء كامل (20 صفحة) يومياً";
      else targetText = Math.ceil(pagesPerDay) + " صفحات يومياً";

      var setupForm = document.getElementById('memoSetupForm');
      if (setupForm) setupForm.style.display = 'none';

      var resultDiv = document.getElementById('memoPlanResult');
      if (resultDiv) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
          <div style="color:var(--gold); font-weight:bold; font-size: 15px; margin-bottom: 12px;">✅ خطتك جاهزة للبدء!</div>
          <div style="color:var(--text); font-size: 13px; line-height: 2.2; text-align: right; direction: rtl;">
            ⏱️ المدة الكلية: <b>${totalDays}</b> يوم<br>
            🏖️ إجمالي الإجازات: <b>${totalOffDays}</b> يوم<br>
            📖 أيام الحفظ الفعلية: <b>${activeDays}</b> يوم<br>
            🎯 هدفك اليومي للحفظ: <b style="color:var(--green); font-size:15px;">${targetText}</b>
          </div>
          <button onclick="resetMemoPlan()" class="cat-btn" style="margin-top: 14px; background:transparent; border: 1px solid #ff6b6b; color: #ff6b6b; padding: 8px 16px; border-radius: 12px; cursor: pointer; font-family:'Amiri',serif; width: 100%;">تعديل الخطة ↺</button>
        `;
      }
    } catch (e) {
      console.error("خطأ في حساب خطة الحفظ:", e);
    }
  };

  window.resetMemoPlan = function () {
    var setupForm = document.getElementById('memoSetupForm');
    var resultDiv = document.getElementById('memoPlanResult');
    if (setupForm) setupForm.style.display = 'block';
    if (resultDiv) {
      resultDiv.style.display = 'none';
      resultDiv.innerHTML = '';
    }
  };

  // -------------------------------------------------------------------------
  // 4. التشغيل عند تحميل الصفحة
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    window.renderKhatma();
    window.showRandomMemoTip();

    try {
      var memoForm = document.getElementById('memoSetupForm');
      if (memoForm) {
        var row = memoForm.querySelector('div[style*="display:flex"]');
        if (row) {
          row.style.flexDirection = 'column';
          row.style.gap = '10px';
          var inputs = row.querySelectorAll('input');
          inputs.forEach(function (input) {
            input.style.width = '100%';
            input.style.maxWidth = '100%';
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

})();
