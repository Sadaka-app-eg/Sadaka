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
  
  if (window.currentRareUrl === url) {
    if (!player.paused) {
      player.pause();
    } else {
      player.play().catch(e => console.log("Play error:", e));
    }
  } else {
    player.src = url;
    window.currentRareUrl = url;
    player.play().catch(e => console.log("Play error:", e));
  }
  
  window.renderRareRecitations();
};

// تحديث شريط التقدم أثناء تشغيل الصوت بالثانية
window.rareAudioPlayer.ontimeupdate = () => {
  const player = window.rareAudioPlayer;
  if (!player.duration) return;
  
  // البحث عن شريط التقدم الخاص بـ الملف الشغال حالياً وتحديث قيمته
  const activeProgressBar = document.querySelector(`input[data-url="${window.currentRareUrl}"]`);
  if (activeProgressBar) {
    const progress = (player.currentTime / player.duration) * 100;
    activeProgressBar.value = progress;
  }
};

// دالة التحكم اليدوي وتجريع الصوت عند سحب شريط التقدم
window.seekRare = function(element, url) {
  const player = window.rareAudioPlayer;
  // إذا كان المستخدم يحاول تجريع الملف الذي يعمل حالياً
  if (window.currentRareUrl === url && player.duration) {
    const seekTo = (element.value / 100) * player.duration;
    player.currentTime = seekTo;
  } else {
    // لو حاول تجريع ملف مش شغال، نرجعه لـ 0 عشان اللخبطة
    element.value = 0;
  }
};

// متابعة أحداث المشغل لتحديث الواجهة
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
  
  if (event && event.currentTarget) {
    const activeBtn = event.currentTarget;
    activeBtn.style.background = 'var(--gold)';
    activeBtn.style.color = '#111';
    activeBtn.style.border = 'none';
  }
  window.renderRareRecitations();
};

// دالة الرسم العالمية لضخ الكروت مع شريط التقدم وزر التنزيل المباشر
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
    const isCurrent = (window.currentRareUrl === item.url);
    const isPlaying = isCurrent && !window.rareAudioPlayer.paused;
    const icon = isPlaying ? '⏸' : '▶';
    
    // حساب القيمة الحالية للشريط (لو شغال يحسب مكانه، لو مش شغال يبدأ من 0)
    const currentProgress = isCurrent && window.rareAudioPlayer.duration ? (window.rareAudioPlayer.currentTime / window.rareAudioPlayer.duration) * 100 : 0;

    return `
      <div style="background:var(--card); border-radius:15px; padding:15px; border:1px solid var(--border); margin-bottom:12px; display:flex; flex-direction:column; gap:10px;">
        
        <!-- القسم العلوي: أزرار التحكم والبيانات -->
        <div style="display:flex; align-items:center; gap:15px; justify-content:space-between; width:100%;">
          
          <!-- أزرار الاستماع والتنزيل -->
          <div style="display:flex; align-items:center; gap:10px;">
            <!-- زر التشغيل والاستماع -->
            <button onclick="window.playRare('${item.url}')" style="background:var(--gold); border:none; width:42px; height:42px; border-radius:50%; color:#111; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s;">${icon}</button>
            
            <!-- زر التنزيل المباشر للجهاز -->
            <a href="${item.url}" download="${item.name}.mp3" style="background:rgba(255,255,255,0.1); border:1px solid var(--border); width:42px; height:42px; border-radius:50%; color:var(--text); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; text-decoration:none; transition:0.2s;" title="تحميل الملف">📥</a>
          </div>

          <!-- تفاصيل التلاوة والشيخ -->
          <div style="flex:1; text-align:right; direction:rtl;">
            <div style="font-weight:bold; color:var(--text); font-family:'Amiri',serif; font-size:15px; line-height:1.4;">${item.name}</div>
            <div style="font-size:12px; color:var(--text2); font-family:'Amiri',serif; margin-top:2px;">${item.desc}</div>
          </div>

        </div>

        <!-- القسم السفلي: شريط مدة الصوت والتحكم بالتجري -->
        <div style="width:100%; display:flex; align-items:center;">
          <input type="range" 
                 data-url="${item.url}"
                 min="0" max="100" 
                 value="${currentProgress}" 
                 oninput="window.seekRare(this, '${item.url}')"
                 style="width:100%; accent-color:var(--gold); cursor:pointer; height:4px; border-radius:2px; background:rgba(255,255,255,0.2); outline:none;" />
        </div>

      </div>
    `;
  }).join('');
};
