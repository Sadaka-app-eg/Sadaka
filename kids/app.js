// =========================================================================
// 🧒 المحرك الشامل الموحد لأطفال الإسلام (المشغل الرئيسي)
// =========================================================================

// 1️⃣ حالة البطل والنقاط
window.kidsState = {
    stars: parseInt(localStorage.getItem('kids_stars') || '10'),
    bricks: parseInt(localStorage.getItem('kids_bricks') || '5'),
    petFeedCount: parseInt(localStorage.getItem('kids_pet_feed') || '0'),
    cityBuildings: JSON.parse(localStorage.getItem('kids_city') || '[]')
};

function updateHeroHeader() {
    const starsEl = document.getElementById('heroStars');
    const bricksEl = document.getElementById('heroBricks');
    const rankEl = document.getElementById('heroRank');

    if (starsEl) starsEl.textContent = window.kidsState.stars;
    if (bricksEl) bricksEl.textContent = window.kidsState.bricks;

    let rank = "بَطَلٌ مُبْتَدِئٌ ⭐";
    if (window.kidsState.stars >= 50) rank = "طَالِبُ عِلْمٍ 📖";
    if (window.kidsState.stars >= 100) rank = "حَافِظٌ صَغِيرٌ 🏅";
    if (window.kidsState.stars >= 200) rank = "بَطَلُ الأُمَّةِ 👑";

    if (rankEl) rankEl.textContent = rank;
}

function saveKidsState() {
    localStorage.setItem('kids_stars', window.kidsState.stars);
    localStorage.setItem('kids_bricks', window.kidsState.bricks);
    localStorage.setItem('kids_pet_feed', window.kidsState.petFeedCount);
    localStorage.setItem('kids_city', JSON.stringify(window.kidsState.cityBuildings));
    updateHeroHeader();
}

// 2️⃣ المُشغّل الرئيسي للتنقل بين التبويبات (قديم وجديد)
function switchKidsTab(tabName) {
    document.querySelectorAll('.kids-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.map-node').forEach(btn => btn.classList.remove('active'));

    const activeContent = document.getElementById('kidsContent_' + tabName);
    const activeBtn = document.getElementById('kidsTab_' + tabName);

    if (activeContent) activeContent.classList.add('active');
    if (activeBtn) activeBtn.classList.add('active');

    // تشغيل دوال الرندر بناءً على التبويب المفتوح
    if (tabName === 'quran') renderKidsQuran();
    if (tabName === 'tree') renderKidsTree();
    if (tabName === 'radio') renderKidsRadio();
    if (tabName === 'manners') renderKidsManners();
    if (tabName === 'city' && typeof renderCity === 'function') renderCity();
    if (tabName === 'maze' && typeof renderMaze === 'function') renderMaze();
    if (tabName === 'memory' && typeof initMemoryGame === 'function') initMemoryGame();
}

// 3️⃣ الصندوق اليومي
function openDailyBox() {
    const modal = document.getElementById('dailyBoxModal');
    if (modal) modal.style.display = 'flex';
}

function claimDailyReward() {
    window.kidsState.stars += 15;
    window.kidsState.bricks += 3;
    saveKidsState();
    alert("🎉 مَبْرُوكٌ! حَصَلْتَ عَلَى 15 نَجْمَةً وَ 3 طُوبَاتٍ!");
    const modal = document.getElementById('dailyBoxModal');
    if (modal) modal.style.display = 'none';
}

// 4️⃣ قواعد بيانات الميزات القديمة (القرآن والشجرة والأخلاق)
// 📖 جزء عم كاملاً بصوت الشيخ مشاري العفاسي
const kidsQuranData = [
    { name: "سُورَةُ الْفَاتِحَةِ 📖", count: "7 آيَاتٍ", src: "https://server8.mp3quran.net/afs/001.mp3" },
    { name: "سُورَةُ النَّبَإِ 🌅", count: "40 آيَةً", src: "https://server8.mp3quran.net/afs/078.mp3" },
    { name: "سُورَةُ النَّازِعَاتِ 🌌", count: "46 آيَةً", src: "https://server8.mp3quran.net/afs/079.mp3" },
    { name: "سُورَةُ عَبَسَ 🌴", count: "42 آيَةً", src: "https://server8.mp3quran.net/afs/080.mp3" },
    { name: "سُورَةُ التَّكْوِيرِ ☀️", count: "29 آيَةً", src: "https://server8.mp3quran.net/afs/081.mp3" },
    { name: "سُورَةُ الإِنْفِطَارِ ☁️", count: "19 آيَةً", src: "https://server8.mp3quran.net/afs/082.mp3" },
    { name: "سُورَةُ المَطَفِّفِينَ ⚖️", count: "36 آيَةً", src: "https://server8.mp3quran.net/afs/083.mp3" },
    { name: "سُورَةُ الإِنْشِقَاقِ ⚡", count: "25 آيَةً", src: "https://server8.mp3quran.net/afs/084.mp3" },
    { name: "سُورَةُ البُرُوجِ 🌌", count: "22 آيَةً", src: "https://server8.mp3quran.net/afs/085.mp3" },
    { name: "سُورَةُ الطَّارِقِ ⭐", count: "17 آيَةً", src: "https://server8.mp3quran.net/afs/086.mp3" },
    { name: "سُورَةُ الأَعْلَى 🌿", count: "19 آيَةً", src: "https://server8.mp3quran.net/afs/087.mp3" },
    { name: "سُورَةُ الغَاشِيَةِ 🏔️", count: "26 آيَةً", src: "https://server8.mp3quran.net/afs/088.mp3" },
    { name: "سُورَةُ الفَجْرِ 🌅", count: "30 آيَةً", src: "https://server8.mp3quran.net/afs/089.mp3" },
    { name: "سُورَةُ البَلَدِ 🕌", count: "20 آيَةً", src: "https://server8.mp3quran.net/afs/090.mp3" },
    { name: "سُورَةُ الشَّمْسِ ☀️", count: "15 آيَةً", src: "https://server8.mp3quran.net/afs/091.mp3" },
    { name: "سُورَةُ اللَّيْلِ 🌙", count: "21 آيَةً", src: "https://server8.mp3quran.net/afs/092.mp3" },
    { name: "سُورَةُ الضُّحَى 🌤️", count: "11 آيَةً", src: "https://server8.mp3quran.net/afs/093.mp3" },
    { name: "سُورَةُ الشَّرْحِ 🤍", count: "8 آيَاتٍ", src: "https://server8.mp3quran.net/afs/094.mp3" },
    { name: "سُورَةُ التِّينِ 🍃", count: "8 آيَاتٍ", src: "https://server8.mp3quran.net/afs/095.mp3" },
    { name: "سُورَةُ العَلَقِ 📖", count: "19 آيَةً", src: "https://server8.mp3quran.net/afs/096.mp3" },
    { name: "سُورَةُ القَدْرِ 🌟", count: "5 آيَاتٍ", src: "https://server8.mp3quran.net/afs/097.mp3" },
    { name: "سُورَةُ البَيِّنَةِ 🕊️", count: "8 آيَاتٍ", src: "https://server8.mp3quran.net/afs/098.mp3" },
    { name: "سُورَةُ الزَّلْزَلَةِ 🌍", count: "8 آيَاتٍ", src: "https://server8.mp3quran.net/afs/099.mp3" },
    { name: "سُورَةُ العَادِيَاتِ 🐎", count: "11 آيَةً", src: "https://server8.mp3quran.net/afs/100.mp3" },
    { name: "سُورَةُ القَارِعَةِ 🔔", count: "11 آيَةً", src: "https://server8.mp3quran.net/afs/101.mp3" },
    { name: "سُورَةُ التَّكَاثُرِ 💎", count: "8 آيَاتٍ", src: "https://server8.mp3quran.net/afs/102.mp3" },
    { name: "سُورَةُ العَصْرِ ⏳", count: "3 آيَاتٍ", src: "https://server8.mp3quran.net/afs/103.mp3" },
    { name: "سُورَةُ الهُمَزَةِ 🗣️", count: "9 آيَاتٍ", src: "https://server8.mp3quran.net/afs/104.mp3" },
    { name: "سُورَةُ الفِيلِ 🐘", count: "5 آيَاتٍ", src: "https://server8.mp3quran.net/afs/105.mp3" },
    { name: "سُورَةُ قُرَيْشٍ 🕌", count: "4 آيَاتٍ", src: "https://server8.mp3quran.net/afs/106.mp3" },
    { name: "سُورَةُ المَاعُونِ 🤝", count: "7 آيَاتٍ", src: "https://server8.mp3quran.net/afs/107.mp3" },
    { name: "سُورَةُ الكَوْثَرِ 🌊", count: "3 آيَاتٍ", src: "https://server8.mp3quran.net/afs/108.mp3" },
    { name: "سُورَةُ الكَافِرُونَ 🛡️", count: "6 آيَاتٍ", src: "https://server8.mp3quran.net/afs/109.mp3" },
    { name: "سُورَةُ النَّصْرِ 🚩", count: "3 آيَاتٍ", src: "https://server8.mp3quran.net/afs/110.mp3" },
    { name: "سُورَةُ المَسَدِ 🪵", count: "5 آيَاتٍ", src: "https://server8.mp3quran.net/afs/111.mp3" },
    { name: "سُورَةُ الإِخْلَاصِ 🌟", count: "4 آيَاتٍ", src: "https://server8.mp3quran.net/afs/112.mp3" },
    { name: "سُورَةُ الفَلَقِ 🛡️", count: "5 آيَاتٍ", src: "https://server8.mp3quran.net/afs/113.mp3" },
    { name: "سُورَةُ النَّاسِ 🤍", count: "6 آيَاتٍ", src: "https://server8.mp3quran.net/afs/114.mp3" }
];

const kidsTreeItems = [
    { id: 'fajr', title: 'صَلَاةُ الْفَجْرِ 🌅' },
    { id: 'dhuhr', title: 'صَلَاةُ الظُّهْرِ ☀️' },
    { id: 'asr', title: 'صَلَاةُ الْعَصْرِ 🌤️' },
    { id: 'maghrib', title: 'صَلَاةُ الْمَغْرِبِ 🌅' },
    { id: 'isha', title: 'صَلَاةُ الْعِشَاءِ 🌙' }
];

// 🌟 4. بنك كروت الأخلاق والآداب الإسلامية
const kidsMannersData = [
    { id: 'm1', title: "الأَكْلُ بِالْيَدِ الْيُمْنَى 🍽️", desc: "أَقُولُ بَسْمِ اللَّهِ وَآكُلُ بِيَمِينِي وَمِمَّا يَلِينِي." },
    { id: 'm2', title: "إِفْشَاءُ السَّلَامِ 🖐️", desc: "أَبْتَسِمُ فِي وَجْهِ مَنْ أَلْقَاهُ وَأَقُولُ: السَّلَامُ عَلَيْكُمْ." },
    { id: 'm3', title: "بِرُّ الوَالِدَيْنِ 💖", desc: "أُطِيعُ أُمِّي وَأَبِي، وَأَقُولُ لَهُمَا كَلَامًا طَيِّبًا وَلَا أَرْفَعُ صَوْتِي." },
    { id: 'm4', title: "الصِّدْقُ فِي القَوْلِ 🕊️", desc: "أَقُولُ الحَقَّ دَائِمًا وَلَا أَكْذِبُ فَالصِّدْقُ يَهْدِي إِلَى الجَنَّةِ." },
    { id: 'm5', title: "إِكْرَامُ الجَارِ 🏡", desc: "أُحْسِنُ إِلَى جِيرَانِي وَلَا أُزْعِجُهُمْ بِالأَصْوَاتِ العَالِيَةِ." },
    { id: 'm6', title: "النَّظَافَةُ مِنَ الإِيمَانِ 🧼", desc: "أُحَافِظُ عَلَى نَظَافَةِ جَسَدِي، مَلَابِسِي، وَغُرْفَتِي دَائِمًا." },
    { id: 'm7', title: "مُسَاعَدَةُ المُحْتَاجِ 🤝", desc: "أُمِدُّ يَدَ العَوْنِ لِلْمُسِنِّينَ وَالمُحْتَاجِينَ بِابْتِسَامَةٍ وَحُبٍّ." },
    { id: 'm8', title: "آدَابُ الدُّعَاءِ وَالتَّسْبِيحِ 📿", desc: "أَذْكُرُ اللَّهَ عِنْدَ الصَّبَاحِ وَالمَسَاءِ وَقَبْلَ النَّوْمِ." },
    { id: 'm9', title: "العَطْفُ عَلَى الحَيَوَانِ 🐱", desc: "أَرْحَمُ الحَيَوَانَاتِ وَلَا أُؤْذِيهَا وَأُقَدِّمُ لَهَا المَاءَ وَالطَّعَامَ." },
    { id: 'm10', title: "حِفْظُ الأمَانَةِ 🎁", desc: "أُعِيدُ الأَشْيَاءَ إِلَى أَصْحَابِهَا وَأَحْفَظُ السِّرَّ." }
];

// 5️⃣ دوال تشغيل ورندر الميزات القديمة
let currentPlayingSrc = null;

// رندر السور مع أزرار التحكم والتحميل
function renderKidsQuran() {
    const container = document.getElementById('kidsQuranContainer');
    if (!container) return;

    container.innerHTML = kidsQuranData.map((item, idx) => `
        <div class="roadmap-card" style="margin-top:10px; display:flex; flex-direction:column; align-items:center;">
            <h3>${item.name}</h3>
            <p style="margin-bottom:10px;">${item.count}</p>
            <div style="display:flex; gap:8px; width:100%; justify-content:center;">
                <button id="qBtn_${idx}" onclick="toggleKidsQuranAudio('${item.src}', ${idx})" class="start-btn" style="flex:1;">
                    ▶ تشغيل
                </button>
                <button onclick="downloadSurahOffline('${item.src}', '${item.name}')" class="map-node" style="padding:8px 12px; background:#e8f5e9 !important; border-color:#2ecc71 !important;">
                    ⬇️ حفظ
                </button>
            </div>
        </div>
    `).join('');
}

// دالة التشغيل والإيقاف المؤقت المتبادلة (Play/Pause Toggle)
function toggleKidsQuranAudio(src, idx) {
    const audio = document.getElementById('kidsAudioEngine');
    const btn = document.getElementById(`qBtn_${idx}`);

    if (!audio) return;

    // إذا كانت نفس السورة شغال حالياً -> اعمل Pause / Resume
    if (currentPlayingSrc === src) {
        if (audio.paused) {
            audio.play();
            if (btn) btn.innerHTML = '⏸️ إيقاف مؤقت';
        } else {
            audio.pause();
            if (btn) btn.innerHTML = '▶ استئناف';
        }
        return;
    }

    // إعادة أزرار السور الأخرى لشكُلها الأصلي
    document.querySelectorAll('[id^="qBtn_"]').forEach(b => b.innerHTML = '▶ تشغيل');

    // تشغيل سورة جديدة
    currentPlayingSrc = src;
    audio.src = src;
    audio.play().then(() => {
        if (btn) btn.innerHTML = '⏸️ إيقاف مؤقت';
    }).catch(() => alert("🎵 جاري التحميل..."));

    // عند انتهاء السورة يرجع الزر لـ Play
    audio.onended = () => {
        if (btn) btn.innerHTML = '▶ تشغيل';
        currentPlayingSrc = null;
    };
}

// دالة التحميل والأوفلاين في الـ Cache المباشر
function downloadSurahOffline(url, name) {
    if ('caches' in window) {
        caches.open('kids-quran-audio-v1').then(cache => {
            cache.add(url).then(() => {
                alert(`✅ تم حفظ ${name} بنجاح! ستعمل معك الآن بدون إنترنت تماماً.`);
            }).catch(err => {
                alert("⚠️ تعذر الحفظ أوفلاين، تأكد من الاتصال بالشبكة أولاً.");
            });
        });
    } else {
        alert("⚠️ متصفحك لا يدعم حفظ الملفات الصوتية أوفلاين.");
    }
}

function renderKidsTree() {
    const container = document.getElementById('kidsTreeLeavesContainer');
    if (!container) return;
    const savedLeaves = JSON.parse(localStorage.getItem('kids_tree_leaves') || '{}');
    
    container.innerHTML = kidsTreeItems.map(item => {
        const isDone = savedLeaves[item.id] === true;
        return `
        <div onclick="toggleKidsLeaf('${item.id}')" class="roadmap-card" style="cursor:pointer; background:${isDone ? '#e8f5e9' : '#fff'};">
            <div style="font-size: 30px;">${isDone ? '🌸' : '🍃'}</div>
            <strong>${item.title}</strong>
        </div>`;
    }).join('');
}

function toggleKidsLeaf(id) {
    let saved = JSON.parse(localStorage.getItem('kids_tree_leaves') || '{}');
    saved[id] = !saved[id];
    localStorage.setItem('kids_tree_leaves', JSON.stringify(saved));
    
    // إضافة نجوم للبطل عند الانتهاء
    if (saved[id]) window.kidsState.stars += 5;
    saveKidsState();
    renderKidsTree();
}

function renderKidsManners() {
    const container = document.getElementById('kidsMannersContainer');
    if (!container) return;

    const savedBadges = JSON.parse(localStorage.getItem('kids_manners_badges') || '{}');

    container.innerHTML = kidsMannersData.map(item => {
        const hasBadge = savedBadges[item.id] === true;
        return `
        <div class="roadmap-card" style="border-color:${hasBadge ? '#fdcb6e' : '#a29bfe'}; background:${hasBadge ? '#fff9e6' : '#fff'};">
            <div style="font-size: 32px; margin-bottom: 8px;">${hasBadge ? '👑' : '⭐'}</div>
            <h3 style="margin-bottom: 6px;">${item.title}</h3>
            <p style="margin-bottom: 12px; font-size: 12.5px; color: #636e72;">${item.desc}</p>
            <button onclick="toggleKidsBadge('${item.id}')" class="start-btn" style="background:${hasBadge ? '#fdcb6e' : '#00b894'}; color:${hasBadge ? '#2d3436' : '#fff'}; width:100%;">
                ${hasBadge ? '🏅 حصلت على الوسام!' : 'أَنَا عَمِلْتُ كَذَا النَّهَارَدَةَ!'}
            </button>
        </div>`;
    }).join('');
}

function toggleKidsBadge(id) {
    let saved = JSON.parse(localStorage.getItem('kids_manners_badges') || '{}');
    saved[id] = !saved[id];
    localStorage.setItem('kids_manners_badges', JSON.stringify(saved));
    
    if (saved[id]) {
        window.kidsState.stars += 10;
        saveKidsState();
    }
    renderKidsManners();
}

function renderKidsRadio() {
    const list = document.getElementById('kidsRadioList');
    if (!list) return;
    list.innerHTML = `<p style="text-align:center;">🎧 اختر قصة أو نشيد من قائمة الراديو للبدء!</p>`;
}

function playKidsAudio(src) {
    const audio = document.getElementById('kidsAudioEngine');
    if (audio) {
        audio.src = src;
        audio.play().catch(() => alert("🎵 جاري التحميل..."));
    }
}

// التشغيل التلقائي عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    updateHeroHeader();
    renderKidsQuran();
});
