// =========================================================
// محرك إدارة وتوليد إعلانات الجنائز الذكي بالتنسيق المظبوط بالملي
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
  const relation = document.getElementById('jRelation').value.trim();
  const time = document.getElementById('jTime').value.trim() || "لَمْ يُحَدَّدْ بَعْدُ";

  // جلب أيام وتواريخ اليوم تلقائياً بالملي
  const today = new Date();
  const weekday = today.toLocaleDateString('ar-EG', { weekday: 'long' });
  const gregorian = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  const isMale = (window.currentJanazaGender === "ذكر");

  return {
    title: "﴿ إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴾",
    header: "🕊️ إِعْلَانُ جَنَازَةٍ",
    intro: isMale ? "تُوُفِّيَ إِلَى رَحْمَةِ اللَّهِ تَعَالَى" : "تُوُفِّيَتْ إِلَى رَحْمَةِ اللَّهِ تَعَالَى",
    labelName: isMale ? `المَرْحُوم: ${name}` : `المَرْحُومَة: ${name}`,
    nameOnly: name,
    location: location,
    relation: relation, // ستكون نصاً أو فارغة تماماً
    time: time,
    day: weekday,
    gregorian: gregorian,
    hadithText: "«مَنِ اتَّبَعَ جَنَازَةَ مُسْلِمٍ إِيمَانًا وَاحْتِسَابًا، وَكَانَ مَعَهُ حَتَّى يُصَلَّى عَلَيْهَا وَيُفْرَغَ مِنْ دَفْنِهَا، فَإِنَّهُ يَرْجِعُ مِنَ الْأَجْرِ بِقِيرَاطَيْنِ، كُلُّ قِيرَاطٍ مِثْلُ أُحُدٍ، وَمَنْ صَلَّى عَلَيْهَا ثُمَّ رَجَعَ قَبْلَ أَنْ تُدْفَنَ فَإِنَّهُ يَرْجِعُ بِقِيرَاطٍ»",
    hadithSource: "📚 رَوَاهُ الْبُخَارِيُّ.",
    dua: isMale ? 
      "نَسْأَلُ اللَّهَ أَنْ يَغْفِرَ لَهُ وَيَرْحَمَهُ، وَيُكْرِمَ نُزُلَهُ، وَيُوَسِّعَ مَدْخَلَهُ، وَيُسْكِنَهُ الْفِرْدَوْسَ الْأَعْلَى." : 
      "نَسْأَلُ اللَّهَ أَنْ يَغْفِرَ لَهَا وَيَرْحَمَهَا، وَيُكْرِمَ نُزُلَهَا، وَيُوَسِّعَ مَدْخَلَهَا، وَيُسْكِنَهَا الْفِرْدَوْسَ الْأَعْلَى.",
    footer: "اذهب للجنازة، وصلِّ عليها، واشهد دفنها، ولك الأجر إن شاء الله."
  };
}

// ١. نظام المشاركة كنص منسق ومبرمج بالملي
window.shareJanazaAsText = function() {
  const d = compileJanazaData();
  
  let textBlock = `${d.title}\n${d.header}\n\n${d.intro}\n${d.labelName}\n📍 المِنْطَقَة: ${d.location}\n`;
  
  // شرط ذكي: لو الصلة مكتوبة تظهر، لو مش مكتوبة تختفي تماماً من السطر
  if (d.relation) {
    textBlock += `👨‍👩‍👧‍👦 الصِّلَة: ${d.relation}\n`;
  }
  
  textBlock += `🕌 صَلَاةُ الجَنَازَةِ: ${d.time}\n📅 اليَوْم: ${d.day}\n📅 التَّارِيخُ المِيلَادِيُّ: ${d.gregorian}\n\nقَالَ رَسُولُ اللَّهِ ﷺ:\n${d.hadithText}\n${d.hadithSource}\n\n${d.dua}\n\n${d.footer}\n\n• تَمَّ النَّشْرُ عَبْرَ تَطْبِيقِ كُنْ ذَا أَثَرٍ •`;

  if (navigator.share) {
    navigator.share({ title: "إعلان جنازة", text: textBlock }).then(() => window.closeJanazaSheet());
  } else {
    navigator.clipboard.writeText(textBlock);
    alert("✓ تم نسخ نص إعلان الجنازة المنسق والمشكل بنجاح!");
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

  // خلفية التطبيق الداكنة الملكية
  const grad = ctx.createLinearGradient(0, 0, 0, 1400);
  grad.addColorStop(0, '#0b120c');
  grad.addColorStop(1, '#121e14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 1400);

  // إطار داخلي ذهبي
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 840, 1340);

  // أيقونة حمامة السلام 🕊️
  ctx.fillStyle = "#ffffff";
  ctx.font = "60px sans-serif";
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  ctx.fillText("🕊️", 450, 110);

  // العنوان الرئيسي
  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 34px 'Amiri', 'Cairo', serif";
  ctx.fillText(d.title, 450, 190);

  ctx.fillStyle = "#9aa79c";
  ctx.font = "24px 'Amiri', serif";
  ctx.fillText(d.intro, 450, 270);

  // اسم المتوفى بارز وضخم
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px 'Amiri', 'Cairo', serif";
  ctx.fillText(d.nameOnly, 450, 350);

  // خط فاصل ذهبي ناعم
  ctx.strokeStyle = 'rgba(212,175,55,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(250, 390); ctx.lineTo(650, 390); ctx.stroke();

  // ضخ حقول البيانات المنظمة
  ctx.fillStyle = "#f4f6f4";
  ctx.font = "24px 'Amiri', serif";
  
  let currentY = 440;
  ctx.fillText(`📍 المِنْطَقَة: ${d.location}`, 450, currentY);
  
  // شرط عرض الصلة في الصورة: لو موجودة ارسمها وزود المساحة، لو مش موجودة متظهرش
  if (d.relation) {
    currentY += 50;
    ctx.fillText(`👨‍👩‍👧‍👦 الصِّلَة: ${d.relation}`, 450, currentY);
  }
  
  currentY += 50;
  ctx.fillText(`🕌 صَلَاةُ الجَنَازَةِ: ${d.time}`, 450, currentY);
  currentY += 50;
  ctx.fillText(`📅 اليَوْم: ${d.day}`, 450, currentY);
  currentY += 50;
  ctx.fillText(`📅 التَّارِيخُ المِيلَادِيُّ: ${d.gregorian}`, 450, currentY);

  currentY += 50;
  ctx.strokeStyle = 'rgba(212,175,55,0.3)';
  ctx.beginPath(); ctx.moveTo(150, currentY); ctx.lineTo(750, currentY); ctx.stroke();

  // صندوق الحديث الشريف
  currentY += 30;
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  ctx.fillRect(80, currentY, 740, 260);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
  ctx.strokeRect(80, currentY, 740, 260);

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 22px 'Amiri', serif";
  ctx.fillText("قَالَ رَسُولُ اللَّهِ ﷺ:", 450, currentY + 45);

  ctx.fillStyle = "#9aa79c";
  ctx.font = "21px 'Amiri', serif";
  
  // رسم نص الحديث بالتشكيل
  wrapTextOnCanvas(ctx, d.hadithText, 450, currentY + 95, 38, 660);

  // مصدر الدليل بخط صغير بالأسفل
  ctx.fillStyle = "rgba(212,175,55,0.6)";
  ctx.font = "bold 16px 'Amiri', serif";
  ctx.fillText(d.hadithSource, 450, currentY + 235);

  // دعاء الميت والعبارة النهائية
  ctx.fillStyle = "#6fbf73";
  ctx.font = "bold 24px 'Amiri', serif";
  ctx.fillText(d.dua, 450, currentY + 320);

  ctx.fillStyle = "#d4af37";
  ctx.font = "bold 24px 'Amiri', serif";
  wrapTextOnCanvas(ctx, d.footer, 450, currentY + 390, 35, 700);

  // تحويل الرسمة لملف ومشاركتها
  canvas.toBlob((blob) => {
    const file = new File([blob], "Janaza_Card.png", { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: "إعلان جنازة" });
    } else {
      const link = document.createElement('a');
      link.download = 'Janaza_Card.png';
      link.href = canvas.toDataURL();
      link.click();
      alert("✓ تم حفظ صورة بطاقة الجنازة المحدثة في الاستوديو الخاص بك.");
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
