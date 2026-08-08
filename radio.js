// =========================================================
// خريطة الإذاعات الإسلامية المضمونة والشغالة 100% مع الصور
// =========================================================
window.islamicRadioStations = [
  { id: "cairo", name: "إذاعة القرآن من القاهرة 🇪🇬", url: "https://stream.radiojar.com/8s5u5tpdtwzuv", image: "image/mwa.png" },
  { id: "makkah", name: "إذاعة القرآن من مكة المكرمة 🕋", url: "https://stream.radiojar.com/0tpy1h0kxtzuv", image: "https://qurango.net/radio/makkah/icon.png" },
  { id: "riyadh", name: "إذاعة القرآن من الرياض 🇸🇦", url: "https://stream.radiojar.com/4wqre23fytzuv", image: "https://qurango.net/radio/riyadh/icon.png" },
  
  { id: "roqia", name: "إذاعة الرقية الشرعية 🌿", url: "https://qurango.net/radio/roqiah", image: "https://qurango.net/radio/roqiah/icon.png" },
  { id: "tafseer_all", name: "إذاعة تفسير القرآن الكريم (ابن عثيمين) 📖", url: "https://qurango.net/radio/tafseer", image: "https://qurango.net/radio/tafseer/icon.png" },
  { id: "sakina", name: "إذاعة آيات السكينة 🕊️", url: "https://qurango.net/radio/sakeenah", image: "https://qurango.net/radio/sakeenah/icon.png" },
  { id: "mukhtasar_tafseer", name: "المختصر في تفسير القرآن 📚", url: "https://qurango.net/radio/mukhtasartafsir", image: "https://qurango.net/radio/mukhtasartafsir/icon.png" },
  { id: "tabari", name: "تفسير الطبري (الخلاصة) 📝", url: "https://qurango.net/radio/tabri", image: "https://qurango.net/radio/tabri/icon.png" },

  { id: "seerah", name: "المختصر في السيرة النبوية 🕋", url: "https://qurango.net/radio/almukhtasar_fi_alsiyra", image: "https://qurango.net/radio/almukhtasar_fi_alsiyra/icon.png" },
  { id: "ikhtiyarat", name: "كتاب الاختيارات الفقهية 🏛️", url: "https://qurango.net/radio/alaikhtiarat_alfiqhayh_bin_baz", image: "https://qurango.net/radio/alaikhtiarat_alfiqhayh_bin_baz/icon.png" },
  { id: "muslim", name: "إذاعة صحيح مسلم 📜", url: "https://qurango.net/radio/saheh-muslim", image: "https://qurango.net/radio/saheh-muslim/icon.png" },
  { id: "bukhari", name: "إذاعة صحيح البخاري 📜", url: "https://qurango.net/radio/saheh-bokharee", image: "https://qurango.net/radio/saheh-bokharee/icon.png" },
  { id: "salheen", name: "إذاعة رياض الصالحين 🌿", url: "https://qurango.net/radio/riyad", image: "https://qurango.net/radio/riyad/icon.png" },
  { id: "fatawa", name: "إذاعة الفتاوى العامة ❓", url: "https://qurango.net/radio/fatwa", image: "https://qurango.net/radio/fatwa/icon.png" },
  { id: "zilal_seerah", name: "في ظلال السيرة النبوية 💎", url: "https://qurango.net/radio/fi_zilal_alsiyra", image: "https://qurango.net/radio/fi_zilal_alsiyra/icon.png" }
];

window.getRadioImage = function(station) {
  return (station && station.image) ? station.image : "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=500&auto=format&fit=crop";
};

window.currentActiveRadioUrl = "";

// دالة رندرة وضخ أزرار الإذاعات في شبكة الكروت
// ==========================================
// 📱 دالة عرض شبكة كروت الإذاعات المنسقة مع الصور
// ==========================================
window.renderRadioStationsGrid = function() {
  const grid = document.getElementById('radioCardsGrid');
  if (!grid) return;

  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3, 1fr)";
  grid.style.gap = "12px";
  grid.style.direction = "rtl";

  const audioPlayer = document.getElementById('globalRadioAudioPlayer');

  grid.innerHTML = window.islamicRadioStations.map(station => {
    const isCurrent = (window.currentActiveRadioUrl === station.url);
    const isPlaying = isCurrent && audioPlayer && !audioPlayer.paused;
    const imgUrl = window.getRadioImage(station);

    return `
      <div onclick="window.openRadioNowPlaying('${station.url}', '${station.name}')" 
           style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--card, #121813); border: 1px solid ${isPlaying ? 'var(--gold, #d4af37)' : 'var(--border, #222)'}; border-radius: 16px; padding: 14px 6px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; text-align: center; ${isPlaying ? 'box-shadow: 0 0 15px rgba(212,175,55,0.25); background: rgba(212,175,55,0.06);' : ''}">
        
        <div style="position: relative;">
          <img src="${imgUrl}" alt="${station.name}" style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; border: 2.5px solid var(--gold, #d4af37); box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
          ${isPlaying ? '<span style="position:absolute; bottom:0; left:0; font-size:12px; background:var(--gold); color:#111; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-weight:bold;">🔊</span>' : ''}
        </div>

        <div style="font-weight: bold; color: ${isPlaying ? 'var(--gold)' : 'var(--text)'}; font-family: 'Amiri', serif; font-size: 12px; margin-top: 8px; line-height: 1.3; height: 32px; display: flex; align-items: center; justify-content: center;">
          ${station.name}
        </div>

        <div style="font-size: 10px; color: var(--gold, #d4af37); margin-top: 2px; font-family: 'Amiri', serif;">
          ${isPlaying ? 'بَثٌّ حَيٌّ شَغَّالٌ 🎧' : 'بَثٌّ مُبَاشِرٌ 📻'}
        </div>
      </div>
    `;
  }).join('');

  window.updateRadioNowPlayingUI();
};

// دالة اختيار وتشغيل الإذاعة بمرونة وأمان كاملين
window.selectAndPlayRadio = function(url, name) {
  const player = document.getElementById('globalRadioAudioPlayer');
  const btn = document.getElementById('globalRadioPlayBtn');
  const title = document.getElementById('currentRadioTitle');
  const status = document.getElementById('currentRadioStatus');
  const statusNp = document.getElementById('radioNowPlayingStatus');

  if (typeof stopAudio === 'function') stopAudio();

  // لو ضغطنا تاني على نفس المحطة الشغالة نوقفها
  if (window.currentActiveRadioUrl === url && url !== "DYNAMIC_SEARCH") {
    if (player && !player.paused) {
      player.pause();
      if (btn) btn.textContent = "▶";
      if (status) status.textContent = "تم الإيقاف المؤقت للبث";
      if (statusNp) statusNp.textContent = "تم الإيقاف المؤقت للبث";
    } else if (player) {
      if (status) status.textContent = "جاري الاتصال بالبث الحي...";
      if (statusNp) statusNp.textContent = "جاري الاتصال بالبث الحي...";
      player.play().then(() => { 
        if (btn) btn.textContent = "⏸"; 
      }).catch(e => console.log(e));
    }
    window.renderRadioStationsGrid();
    window.updateRadioNowPlayingUI();
    return;
  }

  // تشغيل باقي الإذاعات الثابتة بشكل طبيعي
  if (player) {
    player.pause();
    player.src = url;
  }
  
  window.currentActiveRadioUrl = url;
  if (title) title.textContent = name;
  if (status) status.textContent = "جاري الاتصال بمصدر البث الحي...";
  if (statusNp) statusNp.textContent = "جاري الاتصال بمصدر البث الحي...";
  if (btn) btn.textContent = "⏳";

  if (player) {
    player.play()
    .then(() => { 
      if (btn) btn.textContent = "⏸"; 
      if (status) status.textContent = "بث حي مباشر 🔴";
      if (statusNp) statusNp.textContent = "بث حي مباشر 🔴";

      // تحديث صورة واسم الإذاعة في شاشة "يُشغّل الآن"
      window.updateRadioNowPlayingUI();

      // 🌟 تحديث لوحة الإشعارات بستارة الجوال (MediaSession)
      if ('mediaSession' in navigator) {
        const station = window.islamicRadioStations.find(s => s.url === url);
        const iconUrl = window.getRadioImage ? window.getRadioImage(station) : '';

        navigator.mediaSession.metadata = new MediaMetadata({
          title: name,
          artist: 'أثر',
          album: 'الإذاعات الإسلامية',
          artwork: [
            { src: iconUrl, sizes: '192x192', type: 'image/png' },
            { src: iconUrl, sizes: '512x512', type: 'image/png' }
          ]
        });
      }
    })
    .catch(err => {
      console.error("Radio play failed:", err);
      if (status) status.textContent = "جاري إعادة الاتصال بالبث الاحتياطي...";
      if (statusNp) statusNp.textContent = "جاري إعادة الاتصال بالبث الاحتياطي...";
      setTimeout(() => {
        player.src = url;
        player.play().then(() => { 
          if (btn) btn.textContent = "⏸"; 
          window.updateRadioNowPlayingUI();
        }).catch(() => {
          if (status) status.textContent = "السيرفر تحت الصيانة حالياً، جرب إذاعة أخرى 🙏";
          if (statusNp) statusNp.textContent = "السيرفر تحت الصيانة حالياً، جرب إذاعة أخرى 🙏";
          if (btn) btn.textContent = "▶";
          window.updateRadioNowPlayingUI();
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
// ==========================================
// 🎨 واجهة "يُشغّل الآن" المبهجة الخاصة بالإذاعات
// ==========================================
window.ensureRadioNowPlayingOverlay = function() {
  if (document.getElementById('radioNowPlayingOverlay')) return;

  const overlayHTML = `
    <div id="radioNowPlayingOverlay" style="display:none; position:fixed; inset:0; background:#080d09; z-index:99999999; flex-direction:column; align-items:center; justify-content:space-between; padding:20px 20px calc(20px + env(safe-area-inset-bottom)); direction:rtl; overflow:hidden;">
      
      <div id="radioNpAmbientBg" class="now-playing-bg"></div>

      <!-- أعلى الشاشة -->
      <div style="width:100%; display:flex; justify-content:space-between; align-items:center; z-index:2;">
        <button onclick="window.closeRadioNowPlaying()" style="background:rgba(255,255,255,0.1); border:none; color:var(--text); width:38px; height:38px; border-radius:50%; font-size:20px; cursor:pointer;">⌄</button>
        <span style="color:var(--gold); font-family:'Amiri',serif; font-size:14px; font-weight:bold;">📻 البَثُّ الحَيُّ المُمَازُ</span>
        <span style="width:38px;"></span>
      </div>

      <!-- منتصف الشاشة (الصورة والعنوان وزر الحالة) -->
      <div id="radioNpSwipeZone" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; width:100%; z-index:2;">
        <div style="width:180px; height:180px; display:flex; align-items:center; justify-content:center; position:relative;">
          <img id="radioNowPlayingAvatar" src="" alt="الإذاعة" style="width:170px; height:170px; border-radius:24px; object-fit:cover; border:3px solid var(--gold); transition: all 0.3s ease;" />
        </div>
        
        <div style="width:100%; max-width:380px; text-align:center; padding:0 10px; direction:rtl;">
          <div id="radioNowPlayingTitle" style="color:var(--gold); font-size:22px; font-weight:bold; font-family:'Amiri',serif; line-height:1.4;"></div>
          <div id="radioNowPlayingStatus" style="color:var(--text2); font-size:13px; margin-top:6px; font-family:'Amiri',serif;">جاري الاتصال بالبث الحي...</div>
        </div>
      </div>

      <!-- أسفل الشاشة (زر التشغيل والإيقاف الكبير) -->
      <div style="width:100%; max-width:420px; z-index:2; display:flex; flex-direction:column; align-items:center; margin-bottom:20px;">
        <button id="radioNowPlayingPlayBtn" onclick="window.toggleRadioPlayback()" style="background:var(--gold); color:#111; border:none; width:70px; height:70px; border-radius:50%; font-size:28px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(212,175,55,0.4);">⏸</button>
      </div>

    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', overlayHTML);
};

window.openRadioNowPlaying = function(url, name) {
  window.ensureRadioNowPlayingOverlay();
  document.getElementById('radioNowPlayingOverlay').style.display = 'flex';
  window.selectAndPlayRadio(url, name);
};

window.closeRadioNowPlaying = function() {
  const overlay = document.getElementById('radioNowPlayingOverlay');
  if (overlay) overlay.style.display = 'none';
};

window.updateRadioNowPlayingUI = function() {
  const overlay = document.getElementById('radioNowPlayingOverlay');
  if (!overlay || overlay.style.display !== 'flex') return;

  const player = document.getElementById('globalRadioAudioPlayer');
  const station = window.islamicRadioStations.find(s => s.url === window.currentActiveRadioUrl);
  if (!station) return;

  const avatarUrl = window.getRadioImage(station);

  document.getElementById('radioNowPlayingTitle').textContent = station.name;
  
  const avatarImg = document.getElementById('radioNowPlayingAvatar');
  if (avatarImg) {
    avatarImg.src = avatarUrl;
    avatarImg.style.boxShadow = (player && !player.paused) ? `0 0 40px 10px var(--gold)` : 'none';
  }

  const playBtn = document.getElementById('radioNowPlayingPlayBtn');
  if (playBtn) {
    playBtn.textContent = (player && !player.paused) ? '⏸' : '▶';
  }

  const ambientBg = document.getElementById('radioNpAmbientBg');
  if (ambientBg) ambientBg.style.backgroundImage = `url('${avatarUrl}')`;
};
