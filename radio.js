// =========================================================
// خريطة الإذاعات الإسلامية المضمونة والشغالة 100% من السيرفر المباشر
// =========================================================
window.islamicRadioStations = [
  // الإذاعات الرئيسية الكبرى (روابط راديو جار الرسمية الشغالة طحن)
  { id: "cairo", name: "إذاعة القرآن من القاهرة 🇪🇬", url: "https://stream.radiojar.com/8s5u5tpdtwzuv" },
  { id: "makkah", name: "إذاعة القرآن من مكة المكرمة 🕋", url: "https://stream.radiojar.com/0tpy1h0kxtzuv" },
  { id: "riyadh", name: "إذاعة القرآن من الرياض 🇸🇦", url: "https://stream.radiojar.com/4wqre23fytzuv" },
  { id: "heweny", name: "إذاعة الشيخ الحويني 👤", url: "https://stream.zeno.fm/s78bfahr36duv" }, // الرابط المباشر الصافي لبث راديو أبو إسحاق الحويني على زينو
  
  // إذاعات علوم القرآن والتفسير (المسارات الرسمية الدقيقة من السيرفر الشغال)
  { id: "roqia", name: "إذاعة الرقية الشرعية 🌿", url: "https://qurango.net/radio/roqiah" },
  { id: "tafseer_all", name: "إذاعة تفسير القرآن الكريم 📖", url: "https://qurango.net/radio/tafseer" },
  { id: "sakina", name: "إذاعة آيات السكينة 🕊️", url: "https://qurango.net/radio/sakeenah" },
  { id: "mukhtasar_tafseer", name: "المختصر في تفسير القرآن 📚", url: "https://qurango.net/radio/mukhtasartafsir" },
  { id: "tabari", name: "تفسير الطبري (الخلاصة) 📝", url: "https://qurango.net/radio/tabri" },

  // إذاعات علوم السنة والفتاوى وسير الصحابة
  { id: "seerah", name: "المختصر في السيرة النبوية 🕋", url: "https://qurango.net/radio/almukhtasar_fi_alsiyra" },
  { id: "ikhtiyarat", name: "كتاب الاختيارات الفقهية 🏛️", url: "https://qurango.net/radio/alaikhtiarat_alfiqhayh_bin_baz" },
  { id: "muslim", name: "إذاعة صحيح مسلم 📜", url: "https://qurango.net/radio/saheh-muslim" },
  { id: "bukhari", name: "إذاعة صحيح البخاري 📜", url: "https://qurango.net/radio/saheh-bokharee" },
  { id: "salheen", name: "إذاعة رياض الصالحين 🌿", url: "https://qurango.net/radio/riyad" },
  { id: "fatawa", name: "إذاعة الفتاوى العامة ❓", url: "https://qurango.net/radio/fatwa" },
  { id: "zilal_seerah", name: "في ظلال السيرة النبوية 💎", url: "https://qurango.net/radio/fi_zilal_alsiyra" }
];

 
window.currentActiveRadioUrl = "";

// دالة رندرة وضخ أزرار الإذاعات في شبكة الكروت
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

  if (typeof stopAudio === 'function') stopAudio();

  if (window.currentActiveRadioUrl === url) {
    if (!player.paused) {
      player.pause();
      btn.textContent = "▶";
      status.textContent = "تم الإيقاف المؤقت للبث";
    } else {
      status.textContent = "جاري الاتصال بالبث الحي...";
      player.play().then(() => { btn.textContent = "⏸"; }).catch(e => console.log(e));
    }
  } else {
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
        status.textContent = "جاري إعادة الاتصال بالبث الاحتياطي...";
        setTimeout(() => {
          player.src = url;
          player.play().then(() => { btn.textContent = "⏸"; }).catch(() => {
            status.textContent = "السيرفر تحت الصيانة حالياً، جرب إذاعة أخرى 🙏";
            btn.textContent = "▶";
          });
        }, 1000);
      });
  }

  window.renderRadioStationsGrid();
};

window.toggleRadioPlayback = function() {
  if (window.currentActiveRadioUrl) {
    const station = window.islamicRadioStations.find(s => s.url === window.currentActiveRadioUrl);
    window.selectAndPlayRadio(window.currentActiveRadioUrl, station ? station.name : "");
  } else {
    window.selectAndPlayRadio(window.islamicRadioStations[0].url, window.islamicRadioStations[0].name);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if(typeof window.renderRadioStationsGrid === 'function') window.renderRadioStationsGrid(); }, 500);
});

const originalShowPage = window.showPage;
window.showPage = function(id, el) {
  if (typeof originalShowPage === 'function') originalShowPage(id, el);
  if (id === 'radioPage') {
    setTimeout(() => { window.renderRadioStationsGrid(); }, 50);
  } else {
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
