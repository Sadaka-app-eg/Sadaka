// =========================================================
// محرك إدارة وتوليد إعلانات الجنائز الذكي للتطبيق (حفظ ومشاركة)
// =========================================================
window.currentJanazaGender = "ذكر";

// دالة تبديل جيندر المتوفى وتحديث شكل الأزرار التفاعلية
window.setJanazaGender = function(gender) {
  window.currentJanazaGender = gender;
  const maleBtn = document.getElementById('jGenderMale');
  const femaleBtn = document.getElementById('jGenderFemale');
  
  if (gender === 'ذكر') {
    maleBtn.style.background = 'rgba(212,175,55,0.15)'; maleBtn.style.color = 'var(--gold)'; maleBtn.style.borderColor = 'var(--gold)';
    femaleBtn.style.background = 'var(--bg2)'; femaleBtn.style.color = 'var(--text2)'; femaleBtn.style.borderColor = 'var(--border)';
  } else {
    femaleBtn.style.background = 'rgba(212,175,55,0.15)'; femaleBtn.style.color = 'var(--gold)'; femaleBtn.style.borderColor = 'var(--gold)';
    maleBtn.style.background = 'var(--bg2)'; maleBtn.style.color = 'var(--text2)'; maleBtn.style.borderColor = 'var(--border)';
  }
};

// الدالة الأساسية لمعالجة البيانات والتأكد من المدخلات
window.processJanazaData = function() {
  const name = document.getElementById('jName').value.trim();
  const location = document.getElementById('jLocation').value.trim();
  
  if (!name || !location) {
    alert("⚠️ من فضلك ادخل الاسم بالكامل والمنطقة أولاً لتوليد الإعلان.");
    return;
  }

  // فتح الـ Bottom Sheet المخصص للخيارات فوراً
  document.getElementById('janazaDimmer').classList.add('show');
  document.getElementById('janazaSheet').classList.add('show');
};

window.closeJanazaSheet = function() {
  document.getElementById('janazaDimmer').classList.remove('show');
  document.getElementById('janazaSheet').classList.remove('show');
};

// دالة تجميع نصوص الإعلان وضبط الصياغة اللغوية ديناميكياً
function compileJanazaData() {
  const name = document.getElementById('jName').value.trim();
  const location = document.getElementById('jLocation').value.trim();
  const relation = document.getElementById('jRelation').value.trim() || "غير محدد";
  const time = document.getElementById('jTime').value.trim() || "لم يُحدد بعد";

  // جلب أيام وتواريخ اليوم تلقائياً بالملي
  const today = new Date();
  const weekday = today.toLocaleDateString('ar-EG', { weekday: 'long' });
  const gregorian = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // قراءة التاريخ الهجري المكتوب مسبقاً في واجهة المواقيت العليا
  const hijriEl = document.getElementById('hijriDate');
  const hijri = hijriEl ? hijriEl.textContent : "--";

  const isMale = (window.currentJanazaGender === "ذكر");

  return {
    title: "﴿ إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴾",
    header: "🕊️ إِعْلَانُ جَنَازَةٍ",
    intro: isMale ? "توفي إلى رحمة الله تعالى" : "توفيت إلى رحمة الله تعالى",
    labelName: isMale ? `المرحوم: ${name}` : `المرحومة: ${name}`,
    nameOnly: name,
    location: location,
    relation: relation,
    time: time,
    day: weekday,
    hijri: hijri,
    gregorian: gregorian,
    hadith: "قال رسول الله ﷺ:\n«من اتبع جنازة مسلم إيمانًا واحتسابًا، وكان معه حتى يُصلى عليها ويُفرغ من دفنها، فإنه يرجع من الأجر بقيراطين، كل قيراط مثل أحد، ومن صلى عليها ثم رجع قبل أن تدفن فإنه يرجع بقيراط.»\n📚 رواه البخاري.",
    dua: isMale ? 
      "نسأل الله أن يغفر له ويرحمه، ويكرم نزله، ويوسع مدخله، ويسكنه الفردوس الأعلى." : 
      "نسأل الله أن يغفر لها ويرحمها، ويكرم نزلها، ويوسع مدخلها، ويسكنها الفردوس الأعلى.",
    footer: "اذهب للجنازة، وصلِّ عليها، واشهد دفنها، ولك الأجر إن شاء الله."
  };
}

// ١. نظام المشاركة كنص منسق ومبرمج بالملي
window.shareJanazaAsText = function() {
  const d = compileJanazaData();
  
  const textBlock = `${d.title}\n${d.header}\n\n${d.intro}\n${d.labelName}\n📍 المنطقة: ${d.location}\n👨‍👩‍👧‍👦 الصلة: ${d.relation}\nPublic 🕌 صلاة الجنازة: ${d.time}\n📅 اليوم: ${d.day}\n🌙 التاريخ الهجري: ${d.hijri}\n📅 التاريخ الميلادي: ${d.gregorian}\n\n${d.hadith}\n\n${d.dua}\n\n${d.footer}\n\n• تم النشر عبر تطبيق كُن ذا أثر •`;

  if (navigator.share) {
    navigator.share({ title: "إعلان جنازة", text: textBlock }).then(() => window.closeJanazaSheet());
  } else {
    navigator.clipboard.writeText(textBlock);
    alert("✓ تم نسخ نص إعلان الجنازة المنسق بنجاح في جهازك، يمكنك لصقه ومشاركته الآن.");
    window.closeJanazaSheet();
  }
};

// ٢. نظام توليد بطاقة التصميم الفاخر عبر الـ Canvas
window.shareJanazaAsImage = function() {
  const d = compileJanazaData();
  window.closeJanazaSheet();

  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');

  // صب ثيم الخلفية الداكن الفخم للتطبيق (تدرج خضرة الروضة الملكي المريح)
  const grad = ctx.createLinearGradient(0, 0, 0, 1400);
  grad.addColorStop(0, '#0b120c');
  grad.addColorStop(1, '#121e14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 1400);

  // رسم حواف وإطار داخلي ذهبي مرن وراقٍ جداً
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 840, 1340);

  // أعلى البطاقة: أيقونة حمامة السلام الروحية 🕊️
  ctx.fillStyle = "#ffffff";
  ctx.font = "60px sans-serif";
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.fillText("🕊️", 450, 110);

  // عنوان التعزية الرئيسي الكبير
  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 32px 'Amiri', 'Cairo', serif";
  ctx.fillText(d.title, 450, 190);

  ctx.fillStyle = "#9aa79c";
  ctx.font = "24px 'Amiri', serif";
  ctx.fillText(d.intro, 450, 270);

  // اسم المتوفى في منتصف البطاقة بخط بارز وضخم جداً لتفخيم الرؤية
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 46px 'Amiri', 'Cairo', serif";
  ctx.fillText(d.nameOnly, 450, 350);

  // رسم خط فاصل ذهبي ناعم تحت الاسم للترتيب البصري
  ctx.strokeStyle = 'rgba(212,175,55,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(250, 390); ctx.lineTo(650, 390); ctx.stroke();

  // ضخ حقول البيانات المنسقة والمنظمة
  ctx.fillStyle = "#f4f6f4";
  ctx.font = "24px 'Amiri', serif";
  
  ctx.fillText(`📍 المنطقة: ${d.location}`, 450, 440);
  ctx.fillText(`👨‍👩‍👧‍👦 الصلة: ${d.relation}`, 450, 490);
  ctx.fillText(`🕌 صلاة الجنازة: ${d.time}`, 450, 540);
  ctx.fillText(`📅 اليوم: ${d.day}`, 450, 590);
  ctx.fillText(`🌙 التاريخ: ${d.hijri} مِيلَادِيّاً: ${d.gregorian}`, 450, 640);

  ctx.strokeStyle = 'rgba(212,175,55,0.3)';
  ctx.beginPath(); ctx.moveTo(150, 690); ctx.lineTo(750, 690); ctx.stroke();

  // كارت نص الحديث الشريف في الأسفل (داخل صندوق حواف دائرية خفيف)
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  ctx.fillRect(80, 720, 740, 280);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
  ctx.strokeRect(80, 720, 740, 280);

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 20px 'Amiri', serif";
  ctx.fillText("قَالَ رَسُولُ اللَّهِ ﷺ:", 450, 760);

  ctx.fillStyle = "#9aa79c";
  ctx.font = "20px 'Amiri', serif";
  
  // تفتيت أسطر الحديث ميكانيكياً لكي لا تخرج عن الإطار
  const txtHadith = "«من اتبع جنازة مسلم إيمانًا واحتسابًا، وكان معه حتى يُصلى عليها ويُفرغ من دفنها، فإنه يرجع من الأجر بقيراطين، كل قيراط مثل أحد، ومن صلى عليها ثم رجع قبل أن تدفن فإنه يرجع بقيراط.» [رواه البخاري]";
  wrapTextOnCanvas(ctx, txtHadith, 450, 810, 40, 660);

  // دعاء الميت المخصص والعبارة النهائية الحاثة للأجر
  ctx.fillStyle = "#6fbf73";
  ctx.font = "bold 24px 'Amiri', serif";
  ctx.fillText(d.dua, 450, 1070);

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 24px 'Amiri', serif";
  wrapTextOnCanvas(ctx, d.footer, 450, 1160, 35, 700);

  // تحويل الرسمة لملف ومشاركتها فوراً
  canvas.toBlob((blob) => {
    const file = new File([blob], "Janaza_Announcement.png", { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: "إعلان جنازة" });
    } else {
      const link = document.createElement('a');
      link.download = 'Janaza_Announcement.png';
      link.href = canvas.toDataURL();
      link.click();
      alert("✓ تم حفظ صورة بطاقة الجنازة الفاخرة في الاستوديو الخاص بك لمشاركتها يدوياً.");
    }
  }, 'image/png');
};

// دالة مساعدة لتقطيع ونزول الأسطر تلقائياً في الكانفاس
function wrapTextOnCanvas(ctx, text, x, y, lineHeight, maxWidth) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
