// ==========================================
// مصفوفة التلاوات النادرة المظبوطة بالملي حسب شيوخك
// ==========================================
window.rareRecitations = [
  { 
    name: "محمد عباده: سورة هود (تلاوة خاشعة نادرة) 🎙️", 
    url: "audio/Facebook 2205930596219780(MP3)_1.mp3", 
    desc: "تشغيل مباشر محلي بدون إنترنت",
    tag: "محمد عباده"
  },
  { 
    name: "محمد عباده: تلاوة خاشعة 1 🎙️", 
    url: "audio/obada_1.mp3", 
    desc: "تشغيل مباشر محلي بدون إنترنت",
    tag: "محمد عباده"
  },
  { 
    name: "محمد عباده: تلاوة خاشعة 2 🎙️", 
    url: "audio/obada_2.mp3", 
    desc: "تشغيل مباشر محلي بدون إنترنت",
    tag: "محمد عباده"
  },
  { 
    name: "محمد عباده: تلاوة خاشعة 3 🎙️", 
    url: "audio/obada_3.mp3", 
    desc: "تشغيل مباشر محلي بدون إنترنت",
    tag: "محمد عباده"
  },
  { 
    name: "محمد عباده: تلاوة خاشعة 4 🎙️", 
    url: "audio/obada_4.mp3", 
    desc: "تشغيل مباشر محلي بدون إنترنت",
    tag: "محمد عباده"
  },
  { 
    name: "محمد عباده: تلاوة خاشعة 5 🎙️", 
    url: "audio/obada_5.mp3", 
    desc: "تشغيل مباشر محلي بدون إنترنت",
    tag: "محمد عباده"
  },
  { 
    name: "المنشاوي: سورة الحشر 🎙️", 
    url: "audio/minshawi_1.mp3", 
    desc: "تسجيل خارجي باكٍ",
    tag: "منشاوي"
  },
  { 
    name: "ياسر الدوسري: روائع المحافل 🎙️", 
    url: "audio/3.mp3", 
    desc: "تلاوة باكية من صلاة التراويح",
    tag: "الدوسري"
  },
  { 
    name: "عبد الباسط: روائع قصار السور 🎙️", 
    url: "audio/4.mp3", 
    desc: "تسجيل خارجي نادر ونقي",
    tag: "عبد الباسط"
  },
  { 
    name: "الحصري: قراءة متأنية 🎙️", 
    url: "audio/5.mp3", 
    desc: "أداء إعجازي بأحكام التلاوة",
    tag: "حصري"
  },
  { 
    name: "مصطفى إسماعيل: سورة الواقعة 🎙️", 
    url: "audio/6.mp3", 
    desc: "التلاوة الشهيرة بمقامات فريدة",
    tag: "مصطفى إسماعيل"
  }
];

// متغيرات التحكم بالصوت العام
if (!window.rareAudioPlayer) {
  window.rareAudioPlayer = new Audio();
}
window.currentRareUrl = ''; 
window.currentRareFilter = 'all';

// دالة التشغيل والإيقاف الذكية الموحدة
window.playRare = function(url) {
  const player = window.rareAudioPlayer;
  
  // لو ضغط على نفس الملف اللي شغال حالياً
  if (window.currentRareUrl === url) {
    if (!player.paused) {
      player.pause(); // إيقاف مؤقت
    } else {
      player.play().catch(e => console.log("Play error:", e)); // إعادة تشغيل
    }
  } else {
    // لو ملف جديد تماماً
    player.src = url;
    window.currentRareUrl = url;
    player.play().catch(e => console.log("Play error:", e));
  }
  
  // إعادة رسم الكروت لتحديث شكل الأزرار (▶ أو ⏸)
  window.renderRareRecitations();
};

// متابعة أحداث المشغل لتحديث الواجهة تلقائياً عند انتهاء الصوت أو توقفه
window.rareAudioPlayer.onplay = () => window.renderRareRecitations();
window.rareAudioPlayer.onpause = () => window.renderRareRecitations();
window.rareAudioPlayer.onended = () => {
  window.currentRareUrl = '';
  window.renderRareRecitations();
};

// دالة الفلترة وتحديث شكل الأزرار
window.filterRare = function(tag) {
  window.currentRareFilter = tag;
  const buttons = document.querySelectorAll('.sheikh-btn');
  buttons.forEach(btn => {
    btn.style.background = 'var(--card)';
    btn.style.color = 'var(--text)';
    btn.style.border = '1px solid var(--border)';
  });
  
  const activeBtn = event.currentTarget;
  if (activeBtn) {
    activeBtn.style.background = 'var(--gold)';
    activeBtn.style.color = '#111';
    activeBtn.style.border = 'none';
  }
  window.renderRareRecitations();
};

// دالة الرسم العالمية لضخ الكروت وتحديث الأيقونة
window.renderRareRecitations = function() {
  const container = document.getElementById('rareList');
  if (!container) return;
  
  if (!window.rareRecitations || window.rareRecitations.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2);">⏳ جاري تحميل قائمة التلاوات...</div>';
    return;
  }

  const filteredList = window.rareRecitations.filter(item => {
    if (window.currentRareFilter === 'all') return true;
    return item.tag === window.currentRareFilter;
  });

  if (filteredList.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text2); font-family:\'Amiri\',serif;">لا توجد تلاوات مرفوعة لهذا الشيخ بعد.</div>';
    return;
  }

  container.innerHTML = filteredList.map((item, index) => {
    // معرفة هل الملف الحالي هو المشغل ونشط؟
    const isCurrent = (window.currentRareUrl === item.url);
    const isPlaying = isCurrent && !window.rareAudioPlayer.paused;
    
    // اختيار الأيقونة بناءً على الحالة
    const icon = isPlaying ? '⏸' : '▶';

    return `
      <div style="background:var(--card); border-radius:15px; padding:15px; border:1px solid var(--border); display:flex; align-items:center; gap:15px; margin-bottom:10px;">
        <button onclick="window.playRare('${item.url}')" style="background:var(--gold); border:none; width:45px; height:45px; border-radius:50%; color:#111; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center;">${icon}</button>
        <div style="flex:1; text-align:right; direction:rtl;">
          <div style="font-weight:bold; color:var(--text); font-family:'Amiri',serif; font-size:16px;">${item.name}</div>
          <div style="font-size:12px; color:var(--text2); font-family:'Amiri',serif; margin-top:4px;">${item.desc}</div>
        </div>
      </div>
    `;
  }).join('');
};
