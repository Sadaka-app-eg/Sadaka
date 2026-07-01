// ==========================================
// مصفوفة التلاوات النادرة - تجربة الملف المحلي الأول المضمون
// ==========================================
window.rareRecitations = [
  { 
    name: "التلاوة الأولى النادرة (مرفوعة محلياً) 🎙️", 
    url: "audio/Facebook 2205930596219780(MP3)_1.mp3", 
    desc: "تشغيل مباشر من ملفات السيرفر الخاصة بك بدون إنترنت" 
  }
];

// دالة الرسم العالمية المحدثة لضخ الكروت
window.renderRareRecitations = function() {
  const container = document.getElementById('rareList');
  if (!container) return;
  
  if (!window.rareRecitations || window.rareRecitations.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">⏳ جاري تحميل قائمة التلاوات...</div>';
    return;
  }

  container.innerHTML = window.rareRecitations.map((item, index) => `
    <div style="background:var(--card); border-radius:15px; padding:15px; border:1px solid var(--border); display:flex; align-items:center; gap:15px; margin-bottom:10px;">
      <button onclick="window.playRare('${item.url}')" style="background:var(--gold); border:none; width:45px; height:45px; border-radius:50%; color:#111; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center;">▶</button>
      <div style="flex:1; text-align:right; direction:rtl;">
        <div style="font-weight:bold; color:var(--text); font-family:'Amiri',serif; font-size:16px;">${item.name}</div>
        <div style="font-size:12px; color:var(--text2); font-family:'Amiri',serif; margin-top:4px;">${item.desc}</div>
      </div>
    </div>
  `).join('');
};
