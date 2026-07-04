// =========================================================
// خريطة الإذاعات الإسلامية المباشرة (مطابقة للصور عدا الأذكار)
// =========================================================
window.islamicRadioStations = [
  { id: "cairo", name: "إذاعة القرآن من القاهرة 🇪🇬", url: "https://stream.zeno.fm/fkdfw638g98uv" }, // رابط مباشر سريع بديل لفك حظر التضمين
  { id: "makkah", name: "إذاعة القرآن من مكة 🕋", url: "https://stream.zeno.fm/b62asw4u398uv" },
  { id: "riyadh", name: "إذاعة القرآن من الرياض 🇸🇦", url: "https://stream.zeno.fm/cw88264u398uv" },
  { id: "heweny", name: "إذاعة الشيخ الحويني 👤", url: "https://stream.radiojar.com/8s5u5tpdtwzuv" },
  
  // إذاعات علوم القرآن (الصورة 66079.jpg)
  { id: "roqia", name: "إذاعة الرقية الشرعية 🌿", url: "https://backup.quran.com.sa/radio/ruqyah" },
  { id: "tafseer_all", name: "إذاعة تفسير القرآن الكريم 📖", url: "https://backup.quran.com.sa/radio/tafseer" },
  { id: "sakina", name: "إذاعة آيات السكينة 🕊️", url: "https://backup.quran.com.sa/radio/sknah" },
  { id: "mukhtasar_tafseer", name: "المختصر في تفسير القرآن 📚", url: "https://backup.quran.com.sa/radio/mukhtasar_tafseer" },
  { id: "tabari", name: "تفسير الطبري (الخلاصة) 📝", url: "https://backup.quran.com.sa/radio/tabari" },

  // إذاعات علوم السنة والفتاوى (الصورة 66080.jpg و 66077.jpg)
  { id: "seerah", name: "إذاعة السيرة النبوية 🕋", url: "https://backup.quran.com.sa/radio/sira" },
  { id: "ikhtiyarat", name: "كتاب الاختيارات الفقهية 🏛️", url: "https://backup.quran.com.sa/radio/ikhtiyarat_fiqhiyah" },
  { id: "muslim", name: "إذاعة صحيح مسلم 📜", url: "https://backup.quran.com.sa/radio/muslim" },
  { id: "bukhari", name: "إذاعة صحيح البخاري 📜", url: "https://backup.quran.com.sa/radio/bukhari" },
  { id: "salheen", name: "إذاعة رياض الصالحين 🌿", url: "https://backup.quran.com.sa/radio/riyad_salheen" },
  { id: "fatawa", name: "إذاعة الفتاوى العامة ❓", url: "https://backup.quran.com.sa/radio/fatawa" },
  { id: "zilal_seerah", name: "في ظلال السيرة النبوية 💎", url: "https://backup.quran.com.sa/radio/fi_zilal_alsira" }
];

window.currentActiveRadioUrl = "";

// دالة رندرة وضخ أزرار الإذاعات في شبكة الكروت الكرت حتة حتة
window.renderRadioStationsGrid = function() {
  const grid = document.getElementById('radioCardsGrid');
  if (!grid) return;

  grid.innerHTML = window.islamicRadioStations.map(station => {
    const isCurrent = (window.currentActiveRadioUrl === station.url);
    const audioPlayer = document.getElementById('globalRadioAudioPlayer');
    const isPlaying = isCurrent && audioPlayer && !audioPlayer.paused;

    return `
      <div onclick="window.selectAndPlayRadio('${station.url}', '${station.name}')" 
           style="background: var(--card); border-radius: 14px; padding: 14px; border: 1px solid ${isPlaying ? 'var(--gold)' : 'var(--border)'}; text-align: center; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; box-shadow: ${isPlaying ? '0 0 10px rgba(212,175,55,0.15)' : 'none'}">
        <span style="font-size: 20px;">${isPlaying ? '🔊' : '📻'}</span>
        <span style="font-size: 13px; font-weight: bold; color: ${isPlaying ? 'var(--gold)' : 'var(--text)'}; font-family: 'Amiri', serif; line-height: 1.4;">${station.name}</span>
      </div>
    `;
  }).join('');
};

// دالة اختيار وتشغيل الإذاعة بمرونة وأمان كاملين
window.selectAndPlayRadio = function(url, name) {
  const player = document.getElementById('globalRadioAudioPlayer');
  const btn = document.getElementById('globalRadioPlayBtn');
  const title = document.getElementById('currentRadioTitle');
  const status = document.getElementById('currentRadioStatus');

  // إيقاف أي مشغل قرآن خارجي بالتطبيق منعاً للتداخل
  if (typeof stopAudio === 'function') stopAudio();

  if (window.currentActiveRadioUrl === url) {
    // التبديل بين تشغيل وإيقاف نفس الإذاعة
    if (!player.paused) {
      player.pause();
      btn.textContent = "▶";
      status.textContent = "تم الإيقاف المؤقت للبث";
    } else {
      status.textContent = "جاري إعادة الاتصال بالبث الحقيقي...";
      player.play().then(() => { btn.textContent = "⏸"; }).catch(e => console.log(e));
    }
  } else {
    // تشغيل إذاعة جديدة خالص
    player.pause();
    player.src = url;
    window.currentActiveRadioUrl = url;
    title.textContent = name;
    status.textContent = "جاري الاتصال بمصدر البث الحي...";
    btn.textContent = "⏳";

    player.play()
      .then(() => { btn.textContent = "⏸"; })
      .catch(err => {
        console.error("Radio play failed:", err);
        status.textContent = "عفواً، السيرفر ممتلئ حالياً.. أعد المحاولة لاحقاً";
        btn.textContent = "▶";
      });
  }

  window.renderRadioStationsGrid();
};

// تشغيل/إيقاف من الزرار العلوي الكبير للمشغل
window.toggleRadioPlayback = function() {
  if (window.currentActiveRadioUrl) {
    const station = window.islamicRadioStations.find(s => s.url === window.currentActiveRadioUrl);
    window.selectAndPlayRadio(window.currentActiveRadioUrl, station ? station.name : "");
  } else {
    // لو مفيش حاجة متقادة يشغل القاهرة تلقائياً كبداية
    window.selectAndPlayRadio(window.islamicRadioStations[0].url, window.islamicRadioStations[0].name);
  }
};

// التأكد من رندرة الكروت بمجرد فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // رندرة تجهيزية
  setTimeout(() => { if(typeof window.renderRadioStationsGrid === 'function') window.renderRadioStationsGrid(); }, 1000);
});

// ربط تحديث الشبكة بالـ Navigation بتاع التطبيق لمنع تجمد الألوان
const originalShowPage = window.showPage;
window.showPage = function(id, el) {
  if (typeof originalShowPage === 'function') originalShowPage(id, el);
  if (id === 'radioPage') {
    setTimeout(() => { window.renderRadioStationsGrid(); }, 50);
  } else {
    // إيقاف الإذاعة صامتاً لو خرج من الصفحة لعدم استهلاك باقة الإنترنت
    const player = document.getElementById('globalRadioAudioPlayer');
    if (player && !player.paused) {
      player.pause();
      const btn = document.getElementById('globalRadioPlayBtn');
      if(btn) btn.textContent = "▶";
      const title = document.getElementById('currentRadioTitle');
      if(title) title.textContent = "مُتَوَقِّفٌ حَالِيّاً";
      window.currentActiveRadioUrl = "";
    }
  }
};
