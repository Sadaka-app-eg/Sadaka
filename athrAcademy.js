// =========================================================
// 🌿 أكاديمية أثر الإيمانية - خطط التعلم الممنهجة
// =========================================================

const athrAcademyData = {
  // المستوى المبتدئ 🟢
  beginner: {
    title: "🟢 المستوى المبتدئ (تأسيس البناء الإيماني)",
    desc: "خطة مخصصة لتأسيس المسلم في أساسيات دينه وفرائض أعيانه بأسلوب ميسر.",
    steps: [
      {
        title: "1. ركيزة العقيدة والتوحيد",
        body: "دراسة وضبط متن 'الأصول الثلاثة' ومعرفة العبد ربه، ودينه، ونبيه محمد ﷺ بالدليل، وفهم شروط 'لا إله إلا الله' السبعة.",
        action: "احفظ الأصول الثلاثة واقرأ شرحها الميسر 10 دقائق يومياً."
      },
      {
        title: "2. فقه الطهارة والصلاة",
        body: "تعلّم الأحكام العملية للوضوء الصحيح، الغسل، وإتقان صفة صلاة النبي ﷺ بأركانها وواجباتها لتفادي الأخطاء الشائعة.",
        action: "شاهد فيديو تطبيقي لصفة الصلاة وراجع أركانها الـ 14."
      },
      {
        title: "3. الحديث والأخلاق",
        body: "حفظ ومدارسة متن 'الأربعين النووية' التي تجمع جوامع كلم النبي ﷺ وقواعد الدين الأساسية، والتحلي بخلق الصدق والأمانة.",
        action: "احفظ حديثاً واحداً كل يومين من الأربعين النووية مع شرحه."
      },
      {
        title: "4. القرآن والذكر اليومي",
        body: "تصحيح قراءة سورة الفاتحة وقصار السور (جزء عم) مع ضبط مخارج الحروف، والمواظبة الصارمة على أذكار الصباح والمساء.",
        action: "قراءة صفحتين بتدبر يومياً والمحافظة على المهام اليومية الـ 9."
      }
    ]
  },

  // المستوى المتوسط 🟡
  intermediate: {
    title: "🟡 المستوى المتوسط (التأصيل وتعميق الفهم)",
    desc: "خطة مخصصة لتعميق الفهم الفقهي والعقائدي وبناء ملكة الاستدلال الشرعي.",
    steps: [
      {
        title: "1. تأصيل العقيدة والرد على الشبهات",
        body: "دراسة متن 'كتاب التوحيد' وضبط تفاصيل توحيد الألوهية والأسماء والصفات، وتعلّم الرد الشرعي والعقلي على الشبهات الفكرية الشائعة.",
        action: "اقرأ باباً واحداً من كتاب التوحيد مع مراجعة فصول الشبهات."
      },
      {
        title: "2. الفقه الموسع وأصول الفقه",
        body: "تعلّم أحكام المعاملات المالية الحلال والحرام (الربا، البيوع، المعاملات الحديثة) ودراسة 'أصول الفقه الميسر' لفهم طرق استنباط الأحكام.",
        action: "راجع أحكام زكاة مالك ومعاملاتك التجارية اليومية على ضوء الشرع."
      },
      {
        title: "3. مصطلح الحديث وسير العلماء",
        body: "دراسة مقدمة في علم مصطلح الحديث لمعرفة الفرق بين الصحيح والضعيف، ومدارسة سير أئمة السلف (كالأئمة الأربعة وبقية الثقات).",
        action: "اقرأ سيرة إمام واحد أسبوعياً وافهم قاعدة قبول خبر الواحد."
      },
      {
        title: "4. التزكية وأعمال القلوب",
        body: "علاج أمراض القلوب (الرياء، العجب، الحسد) عبر التواضع، ومحاسبة النفس اليومية، ولزوم جناح الخوف والرجاء والتوكل الحقيقي.",
        action: "خصص 15 دقيقة يومياً لدفتر النعم ومراجعة خبايا السر."
      }
    ]
  },

  // المستوى المتقدم 🔴
  advanced: {
    title: "🔴 المستوى المتقدم (البناء العلمي والدعوي)",
    desc: "خطة مخصصة لإعداد طالب العلم المتمكن وبناء القدرة على الدعوة ونفع الأمة.",
    steps: [
      {
        title: "1. التبحر في العقائد المقارنة",
        body: "دراسة المتون العقائدية المتقدمة (كـ 'العقيدة الواسطية' وشروح الطحاوية)، وتفكيك مقالات الفرق وتأصيل منهج أهل الحديث بالأدلة.",
        action: "مدارسة الشروح التأصيلية الكبرى لشيخ الإسلام ابن تيمية وابن القيم."
      },
      {
        title: "2. فقه الخلاف العالي والأصول",
        body: "دراسة الفقه المقارن ومعرفة مآخذ الأدلة ومواطن الخلاف بين المذاهب الأربعة (الحنفية، المالكية، الشافعية، الحنابلة) في المسائل النوازل.",
        action: "بحث المسائل الفقهية المعاصرة من خلال المجامع الفقهية المعتمدة."
      },
      {
        title: "3. علوم القرآن والتدبر العميق",
        body: "دراسة أصول التفسير (كتفسير ابن كثير) وأسباب النزول والسياق التاريخي، وبناء ملكة استخراج الهدايات والتدبر العميق للآيات.",
        action: "ربط القراءة العادية بالمصحف مع مراجعة أسباب نزول السور."
      },
      {
        title: "4. القيادة التربوية والدعوة",
        body: "تعلّم مهارات التربية الإسلامية (للكبار وللصغار) وأدبيات حوار الخصوم، وتطبيق العلم الشرعي عسكرياً ودعوياً لنشر الخير ونفع الأمة.",
        action: "وضع خطة تربوية أسبوعية لأهل بيتك أو مجتمعك الصغير."
      }
    ]
  }
};

// --- دوال التحكم والعرض التفاعلي للأكاديمية ---
function renderAcademyMain() {
  const container = document.getElementById('academyLevelsGrid');
  if (!container) return;

  const levels = [
    { id: 'beginner', key: 'beginner', color: '#6fbf73', icon: '🟢' },
    { id: 'intermediate', key: 'intermediate', color: '#d4af37', icon: '🟡' },
    { id: 'advanced', key: 'advanced', color: '#ff6b6b', icon: '🔴' }
  ];

  container.innerHTML = levels.map(lvl => {
    const data = athrAcademyData[lvl.key];
    return `
      <div class="abwab-main-card" onclick="openAcademyLevel('${lvl.key}')" style="border-right: 4px solid ${lvl.color}; margin-bottom: 10px;">
        <div class="abwab-main-icon">${lvl.icon}</div>
        <div class="abwab-main-info">
          <div class="abwab-main-name" style="color: ${lvl.color};">${data.title}</div>
          <div class="abwab-main-desc">${data.desc}</div>
        </div>
      </div>
    `;
  }).join('');
}

function openAcademyLevel(levelKey) {
  showPage('academyDisplayPage', null);
  const data = athrAcademyData[levelKey];
  if (!data) return;

  document.getElementById('academyPageTitle').textContent = data.title;
  const stepsContainer = document.getElementById('academyStepsContainer');
  
  stepsContainer.innerHTML = data.steps.map((step, i) => `
    <div class="zekr-card" style="border-right: 3px solid var(--gold); padding: 16px; margin-bottom: 12px; background: var(--card); border-radius: 14px;">
      <div class="zekr-title" style="font-size: 15px; color: var(--gold); font-weight: 700; margin-bottom: 6px;">${step.title}</div>
      <p style="font-size: 14px; line-height: 1.8; color: var(--text); text-align: justify; margin-bottom: 10px;">${step.body}</p>
      <div style="background: rgba(212, 175, 55, 0.05); padding: 10px; border-radius: 8px; font-size: 12.5px; color: var(--text2); border-left: 2px dashed var(--gold);">
        🎯 **الخطوة العملية المقترحة اليوم:** ${step.action}
      </div>
      
      <!-- نظام التقييم وتتبع الإنجاز الذكي لكل خطوة -->
      <div style="text-align: left; margin-top: 12px;">
        <button onclick="toggleAcademyStepCheck('${levelKey}', ${i}, this)" class="mode-btn" style="padding: 4px 14px; font-size: 12px; border-radius: 6px; width: auto; display: inline-block;">
          ${checkAcademyStepState(levelKey, i) ? '✅ تم إنجازها' : '⬜ تحديد كـ منجزة'}
        </button>
      </div>
    </div>
  `).join('');
}

function toggleAcademyStepCheck(levelKey, index, btn) {
  let state = JSON.parse(localStorage.getItem('athr_academy_' + levelKey) || '{}');
  state[index] = !state[index];
  localStorage.setItem('athr_academy_' + levelKey, JSON.stringify(state));
  
  if (state[index]) {
    btn.textContent = '✅ تم إنجازها';
    if (typeof boostFlame === 'function') boostFlame(2); // إنعاش الشعلة بـ 2 نقطة كاملة تعزيزاً للأثر
  } else {
    btn.textContent = '⬜ تحديد كـ منجزة';
  }
}

function checkAcademyStepState(levelKey, index) {
  let state = JSON.parse(localStorage.getItem('athr_academy_' + levelKey) || '{}');
  return !!state[index];
}
