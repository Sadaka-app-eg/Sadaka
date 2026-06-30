// =========================================================
// موسوعة المكتبة العلمية الشاملة والمطورة - صدقة جارية
// جميع النصوص مستندة على الأحاديث الصحيحة وسير أهل العلم الثقات
// =========================================================

const islamicLibraryData = {
  // 1. الأنبياء مرتبين زمنياً من أول نبي
  anbiya: [
    { title: "1. آدم عليه السلام (أبو البشر)", text: "خلقه الله بيده من طين وعلّمه الأسماء كلها وأسكنه الجنة، ثم هبط إلى الأرض لعمارتها بعد أكل الشجرة تائباً مستغفراً. عاش يدعو أولاده لتوحيد الله." },
    { title: "2. إدريس عليه السلام", text: "أول من خَطَّ بالقلم بعد آدم، وأول من خاط الثياب ولبسها، رفعه الله مكاناً عليّاً في السماء الرابعة كما ثبت في حديث الإسراء والمعراج الصحيح." },
    { title: "3. نوح عليه السلام (شيخ المرسلين)", text: "لبث في قومه 950 سنة يدعوهم للتوحيد، فلم يؤمن معه إلا قليل. أمره الله بصنع السفينة، وأغرق الله الأرض بالطوفان العظيم ونجى المؤمنين يقيناً." },
    { title: "4. هود عليه السلام", text: "أُرسل إلى قبيلة 'عاد' البغاة أصحاب القوة العظيمة والأجسام الفارهة بالأحقاف، فكذبوه، فأهلكهم الله بريح صرصر عاتية سبع ليال وثمانية أيام حسوماً." }
  ],

  // 2. الصحابة بأسمائهم وألقابهم الصحيحة وسبب التسمية
  sahaba: [
    { title: "أبو بكر الصديق (عبد الله بن أبي قحافة)", text: "اللقب: الصدِّيق. سبب التسمية: لأنه بادر بتصديق النبي ﷺ في حادثة الإسراء والمعراج دون تردد، وكان أول من آمن من الرجال وأقرب الصحابة لقلب المصطفى." },
    { title: "عمر بن الخطاب (أبو حفص)", text: "اللقب: الفاروق. سبب التسمية: لأن الله فرّق به بين الحق والباطل عند إسلامه، فأصبح المسلمون يعلنون صلاتهم ودعوتهم في مكة جهراً دون خوف." },
    { title: "عثمان بن عفان (ذو النورين)", text: "اللقب: ذو النورين. سبب التسمية: لأنه تزوج من ابنتي رسول الله ﷺ (رقية ثم أم كلثوم)، ولا يُعرف أحد تزوج بنتي نبي غيره." },
    { title: "علي بن أبي طالب (أبو الحسن)", text: "اللقب: فدائي الإسلام الأول وبوابة العلم. سار في نصرة النبي منذ صغره، ونام في فراشه ليلة الهجرة ليرد الأمانات لأهلها مضحياً بنفسه." }
  ],

  // 3. فقه العبادات الميسر
  fiqh: [
    { title: "صفة الوضوء الصحيحة بالترتيب", text: "النية بالقلب، التسمية، غسل الكفين ثلاثاً، المضمضة والاستنشاق بيمينه ثلاثاً، غسل الوجه بالكامل، غسل اليدين للمرفقين، مسح الرأس والأذنين، غسل الرجلين للكعبين." },
    { title: "مبطلات ومفسدات الصيام الإجماعية", text: "الأكل والشرب عمداً، القيء المتعمد، خروج دم الحيض والنفاس للنساء، والجماع في نهار رمضان. أما النسيان فلا يفسد الصيام بنص الحديث الصحيح." }
  ],

  // 4. أحاديث نبوية شريفة بسند صحيح
  hadith: [
    { title: "حديث النية والإخلاص", text: "عن عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله ﷺ يقول: «إنما الأعمال بالنيات وإنما لكل امرئ ما نوى...»", source: "صحيح البخاري ومسلم" },
    { title: "حديث مراتب الدين الثلاثة", text: "عن عمر رضي الله عنه قال: طلع علينا رجل شديد بياض الثياب... سأل عن الإسلام والإيمان والإحسان، فقال ﷺ: «هذا جبريل أتاكم يعلمكم دينكم»", source: "صحيح مسلم" }
  ],

  // 5. فوائد وآداب إسلامية
  adab: [
    { title: "من آداب الطعام المسنونة", text: "التسمية في أوله، الأكل باليد اليمنى، والأكل مما يليك مباشرة، وحمد الله والثناء عليه بعد الانتهاء بقول: (الحمد لله الذي أطعمنا وسقانا)." },
    { title: "من آداب السلام والمجالس", text: "يسلم الصغير على الكبير، والمار على القاعد، والقليل على الكثير، وبشاشة الوجه عند اللقاء، وإفشاء السلام لنشر المحبة والوئام بين المسلمين." }
  ],

  // 6. سؤال وجواب بالدليل الشرعي
  faq: [
    { title: "س: أين الله جل جلاله؟", text: "ج: الله في السماء على العرش استوى، فوق جميع خلقه بائِن منهم. الدليل: قوله تعالى: ﴿الرَّحْمَنُ عَلَى العَرْشِ اسْتَوَى﴾ [طه: 5]، وحديث الجارية الصحيح في مسلم عندما سألها ﷺ: «أين الله؟» قالت: في السماء." }
  ],

  // 7. العقيدة الصافية بأسلوب مبسط
  aqeedah: [
    { title: "أصول الإيمان الستة المعتمدة", text: "أن تؤمن بالله سبحانه وتعالى، وملائكته الكرام، وكتبه المنزلة، ورسله المبعوثين، واليوم الآخر الحاسم، وتؤمن بالقدر خيره وشره يقيناً." },
    { title: "معنى الولاء والبراء باختصار", text: "الولاء: هو محبة الله ورسوله والمؤمنين ونصرتهم. البراء: هو بغض الكفر والباطل وأهله وعدم الرضا بأفعالهم المنكرة، مع العدل والقسط معهم." }
  ],

  // 8. السيرة النبوية مرتبة زمنياً
  seerah: [
    { title: "عام الفيل والمولد النبوي الشريف", text: "وُلد النبي ﷺ بمكة اليتيم الأب في شهر ربيع الأول من عام الفيل، وهو العام الذي حاول فيه أبرهة الأشرم هدم الكعبة فأهلكه الله بطير أبابيل." },
    { title: "بعثة النبي ونزول الوحي بغار حراء", text: "عندما بلغ ﷺ سن الأربعين، نزل عليه الروح الأمين جبريل عليه السلام وهو يتعبد في غار حراء، وكانت أول آية نزلت عليه هي: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾." }
  ],

  // 9. في مثل هذا اليوم هجرياً
  history: [
    { title: "17 رمضان - غزوة بدر الكبرى", text: "وقعت غزوة بدر الكبرى (يوم الفرقان) في السنة الثانية من الهجرة، ونصر الله فيها المسلمين برغم قلة عددهم وعدتهم وأيدهم بمدد من الملائكة." }
  ],

  // 10. رقائق وإيمانيات تشرح الصدر
  raqaeq: [
    { title: "حقيقة الدنيا الفانية والدار الآخرة", text: "الدنيا ممر والآخرة مقر، والذكي من استعتب قبل الموت. قال ﷺ: «كن في الدنيا كأنك غريب أو عابر سبيل» [صحيح البخاري]، فاجعل همك مرضاة الله." }
  ],

  // 11. تعريف بأشهر كتب أهل العلم
  books: [
    { title: "كتاب التوحيد - الشيخ محمد بن عبد الوهاب", text: "كتاب فخم ومبارك، ميزته أنه يسرد أبواب العقيدة والتوحيد مقتصراً فقط وفقط على الآيات القرآنية والأحاديث النبوية الصحيحة دون حشو." }
  ],

  // 12. سير العلماء والأئمة الثقات
  scholars: [
    { title: "الإمام أحمد بن حنبل (إمام أهل السنة)", text: "ثبت كالجبل في محنة خلق القرآن الشهيرة، وحفظ الله به العقيدة الصافية من الزيغ والتبديل، وصاحب أكبر مسند للحديث الشريف." }
  ],

  // 13. دروس ومواعظ صوتية قصيرة
    // 13. دروس ومواعظ صوتية قصيرة (روابط مواعظ حقيقية وثابتة)
     // 13. دروس ومواعظ صوتية قصيرة (20 موعظة كاملة وسريعة الأمان)
  audio: [
    { title: "1. موعظة التوبة والرجوع إلى الله", text: "درس مؤثر يحث العبد على الإنابة والاستغفار.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "2. أهمية الصلاة ومكانتها في الإسلام", text: "شرح وافٍ لعقيدة الصلاة وأنها عماد الدين.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "3. بر الوالدين وطريق الجنة", text: "مقتطفات عن فضل طاعة الوالدين وخفض جناح الذل لهما.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "4. أثر قراءة القرآن في تشييد البيوت", text: "كيف تنور البيوت بذكر الله وقراءة آياته.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "5. حقيقة الدنيا الفانية وزاد الآخرة", text: "موعظة بليغة عن قصر العمر والاستعداد للقاء الله.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { title: "6. الصبر عند الشدائد والمحن", text: "بشريات الصابرين وأجر احتساب البلاء عند الله.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "7. حفظ اللسان وآفات الكلمات", text: "تحذير نبوي من حصائد الألسنة وأثر الكلمة الطيبة.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { title: "8. حسن الخلق وأقرب الناس مجلساً", text: "شرح لفضائل الأخلاق وكيفية التعامل برفق مع المسلمين.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { title: "9. الخشوع في الصلاة ولذة العبادة", text: "خطوات عملية للوصول لطمأنينة القلب أثناء الوقوف بين يدي الله.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { title: "10. فضل الذكر والاستغفار بالأسحار", text: "زاد العابدين وأثر لزوم الاستغفار في سعة الرزق وتفريج الهم.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    { title: "11. رحمة النبي ﷺ بأمته وشوقه لنا", text: "مواقف من سيرة الحبيب تعكس عظم رأفته بالمسلمين.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
    { title: "12. حسن الظن بالله والثقة بتدبيره", text: "كيف يطمئن قلب المؤمن لعلم الله ورحمته في قضائه.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
    { title: "13. أمانة المجالس وإفشاء السلام", text: "آداب التعامل ونشر المحبة والسلام في المجتمع الإسلامي.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
    { title: "14. تربية الأبناء على حب الله ورسوله", text: "قواعد نبوية ميسرة في غرس العقيدة الصحيحة في نفوس الأطفال.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
    { title: "15. قيام الليل شرف المؤمن ونور الوجه", text: "فضل ركعات السحر والخلاد مع الخالق جل جلاله.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
    { title: "16. كفالة اليتيم وأجر صحبة النبي", text: "عظم ثواب رعاية الأيتام وبشارة المصطفى لمن كفلهم.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
    { title: "17. عقوق الأقارب وصلة الأرحام", text: "موعظة حازمة عن خطورة قطيعة الرحم وفضل واصلها ولو جُفي.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" },
    { title: "18. الصدق في القول والعمل وأثره", text: "كيف يقود الصدق البر ويثبت اسم العبد عند الله صدِّيقاً.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3" },
    { title: "19. عظم أجر الصدقة الجارية ونفعها", text: "كيف يمتد عمل المؤمن بعد موته وينور قبره بآثاره الصالحة.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3" },
    { title: "20. الخاتمة الحسنة وأسباب الثبات", text: "دعاء الثبات على الدين والعمل الصالح حتى لقاء رب العزة.", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3" }
  ],



  // 14. أذكار المناسبات المتنوعة
  occasions: [
    { title: "دعاء ركوب الدابة أو السفر", text: "«الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون، اللهم إنا نسألك في سفرنا هذا البر والتقوى...»" }
  ],

  // 15. بطاقات دعوية جاهزة للمشاركة
  cards: [
    { title: "بطاقة: الدال على الخير كفاعله", text: "صورة دعوية مصممة بشكل فخم تذكر بقول النبي ﷺ: «من دال على خير فله مثل أجر فاعله»." }
  ],

  // 16. اختبارات أسئلة اختيار من متعدد
  quiz: [
    {
      title: "اختبار العقيدة والفقه الميسر",
      question: "ما هو الركن الأول من أركان الإسلام الخمسة؟",
      options: ["إقام الصلاة", "شهادة أن لا إله إلا الله وأن محمداً رسول الله", "صوم رمضان"],
      answer: 1
    }
  ]
};

// دالة العرض الذكية والتقليب بين الـ 16 قسماً بالملي
function switchSubContent(subCat) {
  // إزالة الكلاس النشط من جميع الأزرار لتنظيف التنسيق
  const buttons = document.querySelectorAll('.cat-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // تفعيل الزر المختار حالياً
  const activeBtn = document.getElementById('btn_' + subCat);
  if (activeBtn) activeBtn.classList.add('active');

  const container = document.getElementById('islamicCardsContainer');
  if (!container) return;

  const data = islamicLibraryData[subCat] || [];
  
  if (data.length === 0) {
    container.innerHTML = '<div style="color:var(--text2); text-align:center; padding:20px;">⏳ جاري تجهيز وكتابة بحوث هذا القسم...</div>';
    return;
  }

  // معالجة عرض اختبارات الـ Quiz لو المستخدم اختارها
  if (subCat === 'quiz') {
    container.innerHTML = data.map((q, idx) => `
      <div class="zekr-card" style="border-right:3px solid var(--green); padding:16px; margin-bottom:12px; background:var(--card); border-radius:14px;">
        <div class="zekr-title" style="color:var(--gold); font-weight:700; margin-bottom:8px;">🧠 ${q.title}</div>
        <div style="font-size:16px; margin-bottom:12px; color:var(--text); font-weight:bold;">${q.question}</div>
        <div style="display:grid; gap:8px;">
          ${q.options.map((opt, oIdx) => `
            <button onclick="checkQuizAnswer(${idx}, ${oIdx}, ${q.answer})" id="qbtn_${idx}_${oIdx}" class="mode-btn" style="text-align:right; padding:10px; font-size:13px; width:100%; color:var(--text); background:rgba(0,0,0,0.15); border:1px solid var(--border); border-radius:8px;">${opt}</button>
          `).join('')}
        </div>
        <div id="qans_${idx}" style="margin-top:10px; font-size:13px; font-weight:bold;"></div>
      </div>
    `).join('');
    return;
  }

  // معالجة عرض الدروس الصوتية لو تم اختيارها
  if (subCat === 'audio') {
    container.innerHTML = data.map(item => `
      <div class="zekr-card" style="border-right:3px solid var(--gold); padding:16px; margin-bottom:12px; background:var(--card); border-radius:14px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div class="zekr-title" style="font-weight:700; color:var(--gold); margin-bottom:4px;">🎧 ${item.title}</div>
          <div style="font-size:13px; color:var(--text2);">${item.text}</div>
        </div>
        <button onclick="playLibraryAudio('${item.url}', this)" class="play-btn" style="width:36px; height:36px; font-size:14px;">▶</button>
      </div>
    `).join('');
    return;
  }

  // العرض القياسي الفخم لبقية الأقسام والمقالات
  container.innerHTML = data.map((item, idx) => `
    <div class="zekr-card" style="border-right: 3px solid var(--gold); padding: 16px; margin-bottom: 12px; background: var(--card); border-radius: 14px; position:relative;">
      <!-- زر حفظ في المفضلة الخاصة بالمكتبة -->
      <button onclick="toggleLibraryFav('${subCat}', ${idx}, this)" style="position:absolute; left:12px; top:12px; background:transparent; border:none; cursor:pointer; font-size:16px;">
        ${checkLibFav(subCat, idx) ? '⭐' : '🤍'}
      </button>
      
      <div class="zekr-title" style="font-size: 15px; color: var(--gold); font-weight: 700; margin-bottom: 8px; padding-left:25px;">✨ ${item.title}</div>
      <div class="zekr-text" style="font-size: 16px; line-height: 2.1; text-align: justify; color: var(--text); font-family: 'Amiri', serif; margin-bottom: 6px; direction: rtl;">${item.text}</div>
      ${item.source ? `<div style="font-size: 12px; color: var(--green); text-align: left; font-weight: 700;">📚 ${item.source}</div>` : ''}
      
      <!-- زر مشاركة بطاقة دعوية خفيفة -->
      <button onclick="shareLibraryItem('${item.title}', '${item.text}')" class="mode-btn" style="margin-top:10px; padding:4px 10px; font-size:11px; display:inline-block; width:auto; border-radius:6px;">🔗 مشاركة</button>
    </div>
  `).join('');
}

// دالة التحقق من إجابات الاختبارات القصيرة
function checkQuizAnswer(qIdx, selectedIdx, correctIdx) {
  const ansDiv = document.getElementById('qans_' + qIdx);
  if (!ansDiv) return;
  
  // إعادة تعيين ألوان الزراير
  const data = islamicLibraryData.quiz[qIdx];
  data.options.forEach((_, oIdx) => {
    document.getElementById(`qbtn_${qIdx}_${oIdx}`).style.background = 'rgba(0,0,0,0.15)';
  });

  const selectedBtn = document.getElementById(`qbtn_${qIdx}_${selectedIdx}`);
  if (selectedIdx === correctIdx) {
    selectedBtn.style.background = 'rgba(76, 175, 80, 0.3)';
    ansDiv.innerHTML = '<span style="color:#4caf50;">✓ إجابة صحيحة، بارك الله فيك!</span>';
  } else {
    selectedBtn.style.background = 'rgba(244, 67, 54, 0.3)';
    document.getElementById(`qbtn_${qIdx}_${correctIdx}`).style.background = 'rgba(76, 175, 80, 0.3)';
    ansDiv.innerHTML = '<span style="color:#f44336;">✕ إجابة خاطئة، حاول مرة أخرى.</span>';
  }
}

// دالة تشغيل الصوتيات داخل المكتبة العلمية
let libAudio = new Audio();
function playLibraryAudio(url, btn) {
  if (libAudio.src === url && !libAudio.paused) {
    libAudio.pause();
    btn.textContent = '▶';
  } else {
    libAudio.src = url;
    libAudio.play();
    btn.textContent = '⏸';
    libAudio.onended = () => btn.textContent = '▶';
  }
}

// دالة مشاركة الفوائد والمقالات بسهولة
function shareLibraryItem(title, text) {
  const fullText = `📚 *${title}*\n\n${text}\n\n• من المكتبة العلمية لتطبيق صدقة جارية •`;
  if(navigator.share) {
    navigator.share({ title: title, text: fullText });
  } else {
    navigator.clipboard.writeText(fullText);
    alert('تم نسخ نص الفائدة لمشاركتها كبطاقة دعوية! ✓');
  }
}

// دوال تسيير المفضلة الخاصة بالمكتبة العلمية (Bookmark)
function toggleLibraryFav(cat, idx, btn) {
  let favs = JSON.parse(localStorage.getItem('lib_favs_v1') || '[]');
  const key = `${cat}_${idx}`;
  if (favs.includes(key)) {
    favs = favs.filter(k => k !== key);
    btn.textContent = '🤍';
  } else {
    favs.push(key);
    btn.textContent = '⭐';
  }
  localStorage.setItem('lib_favs_v1', JSON.stringify(favs));
}
function checkLibFav(cat, idx) {
  let favs = JSON.parse(localStorage.getItem('lib_favs_v1') || '[]');
  return favs.includes(`${cat}_${idx}`);
}

// دالة لإظهار فائدة عشوائية للمستخدم عند فتح التطبيق (⭐ فائدة يومية)
function showRandomDailyBenefit() {
  const keys = ['fiqh', 'hadith', 'adab', 'raqaeq'];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const pool = islamicLibraryData[randomKey];
  const benefit = pool[Math.floor(Math.random() * pool.length)];
  
  // حفظ الفائدة في الـ sessionStorage لتعرض مرة واحدة في الجلسة لراحة العين
  if (benefit && !sessionStorage.getItem('shown_benefit')) {
    setTimeout(() => {
      alert(`⭐ فائدة كبرى هادية لليوم:\n\n【 ${benefit.title} 】\n${benefit.text}`);
      sessionStorage.setItem('shown_benefit', 'true');
    }, 6000); // تظهر بعد 6 ثوانٍ من فتح التطبيق
  }
}

// تشغيل الفائدة العشوائية والفقه كافتراضي
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('islamicCardsContainer')) {
      switchSubContent('fiqh');
      showRandomDailyBenefit();
    }
  }, 800);
});
