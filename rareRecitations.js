// ==========================================
// مصفوفة التلاوات النادرة الـ 20 الكاملة والمؤمنة Global
// ==========================================
window.rareRecitations = [
  { name: "المنشاوي: سورة الحشر (نادرة جداً)", url: "https://archive.org/download/minshawi_rare/minshawi_hashr_rare.mp3", desc: "تلاوة خاشعة من الخمسينات" },
  { name: "عبد الباسط: سورة مريم (استوديو)", url: "https://archive.org/download/abdulbasit_studio/abdulbasit_maryam_studio.mp3", desc: "تسجيل بجودة استوديو فائقة" },
  { name: "الحصري: سورة النور (نادرة)", url: "https://archive.org/download/husary_rare/husary_noor_rare.mp3", desc: "تلاوة من المسجد الأقصى" },
  { name: "مصطفى إسماعيل: سورة الواقعة", url: "https://archive.org/download/mustafa_ismail_rare/mustafa_waqiah.mp3", desc: "تلاوة فريدة بمقامات نادرة" },
  { name: "المنشاوي: سورة ق (نادرة)", url: "https://archive.org/download/minshawi_rare/minshawi_qaf.mp3", desc: "تلاوة باكية" },
  { name: "عبد الباسط: سورة التوبة", url: "https://archive.org/download/abdulbasit_rare/abdulbasit_tawbah.mp3", desc: "تسجيل إذاعي نادر" },
  { name: "محمد رفعت: سورة الإسراء", url: "https://archive.org/download/mohamed_rifaat_rare/rifaat_israa.mp3", desc: "من أندر تسجيلات قيثارة السماء" },
  { name: "كامل يوسف البهتيمي: سورة الرحمن", url: "https://archive.org/download/bahtimi_rare/bahtimi_rahman.mp3", desc: "أداء سلطاني" },
  { name: "محمود علي البنا: سورة الإنسان", url: "https://archive.org/download/banna_rare/banna_insan.mp3", desc: "تلاوة هادئة ومؤثرة" },
  { name: "المنشاوي: سورة يس", url: "https://archive.org/download/minshawi_rare/minshawi_yaseen.mp3", desc: "تلاوة إذاعية نادرة" },
  { name: "عبد الباسط: سورة القمر", url: "https://archive.org/download/abdulbasit_rare/abdulbasit_qamar.mp3", desc: "تسجيل من حفلات الستينات" },
  { name: "مصطفى إسماعيل: سورة الفرقان", url: "https://archive.org/download/mustafa_ismail_rare/mustafa_furqan.mp3", desc: "تلاوة عالمية" },
  { name: "الحصري: سورة الملك", url: "https://archive.org/download/husary_rare/husary_mulk.mp3", desc: "تلاوة بالرواية النادرة" },
  { name: "محمد صديق المنشاوي: سورة الضحى والشرح", url: "https://archive.org/download/minshawi_rare/minshawi_duha.mp3", desc: "تلاوة خاشعة" },
  { name: "عبد الباسط: سورة إبراهيم", url: "https://archive.org/download/abdulbasit_rare/abdulbasit_ibrahim.mp3", desc: "تلاوة مؤثرة" },
  { name: "مصطفى إسماعيل: سورة الأحزاب", url: "https://archive.org/download/mustafa_ismail_rare/mustafa_ahzab.mp3", desc: "تسجيل نادر من القاهرة" },
  { name: "محمد رفعت: سورة مريم", url: "https://archive.org/download/mohamed_rifaat_rare/rifaat_maryam.mp3", desc: "تسجيل قديم جداً" },
  { name: "كامل يوسف البهتيمي: سورة الحاقة", url: "https://archive.org/download/bahtimi_rare/bahtimi_haqqah.mp3", desc: "تلاوة قوية" },
  { name: "محمود علي البنا: سورة الملك", url: "https://archive.org/download/banna_rare/banna_mulk.mp3", desc: "تسجيل من السبعينات" },
  { name: "المنشاوي: سورة الرحمن", url: "https://archive.org/download/minshawi_rare/minshawi_rahman.mp3", desc: "تلاوة نادرة جداً" }
];

// ==========================================
// دالة الرسم العالمية المحدثة لضخ الكروت
// ==========================================
window.renderRareRecitations = function() {
  const container = document.getElementById('rareList');
  if (!container) return;
  
  if (!window.rareRecitations || window.rareRecitations.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">⏳ جاري تحميل قائمة التلاوات...</div>';
    return;
  }

  container.innerHTML = window.rareRecitations.map((item, index) => `
    <div style="background:var(--card); border-radius:15px; padding:15px; border:1px solid var(--border); display:flex; align-items:center; gap:15px; margin-bottom:10px;">
      <button onclick="playRare('${item.url}')" style="background:var(--gold); border:none; width:45px; height:45px; border-radius:50%; color:#111; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▶</button>
      <div style="flex:1; text-align:right; direction:rtl;">
        <div style="font-weight:bold; color:var(--text); font-family:'Amiri',serif; font-size:16px;">${item.name}</div>
        <div style="font-size:12px; color:var(--text2); font-family:'Amiri',serif; margin-top:4px;">${item.desc}</div>
      </div>
    </div>
  `).join('');
};
