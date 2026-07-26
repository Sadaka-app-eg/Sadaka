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
const kidsQuranData = [
    { name: "سُورَةُ الْفَاتِحَةِ 📖", count: "7 آيَاتٍ", src: "https://server8.mp3quran.net/afs/001.mp3" },
    { name: "سُورَةُ الإِخْلَاصِ 🌟", count: "4 آيَاتٍ", src: "https://server8.mp3quran.net/afs/112.mp3" },
    { name: "سُورَةُ الْفَلَقِ 🛡️", count: "5 آيَاتٍ", src: "https://server8.mp3quran.net/afs/113.mp3" },
    { name: "سُورَةُ النَّاسِ 🤍", count: "6 آيَاتٍ", src: "https://server8.mp3quran.net/afs/114.mp3" }
];

const kidsTreeItems = [
    { id: 'fajr', title: 'صَلَاةُ الْفَجْرِ 🌅' },
    { id: 'dhuhr', title: 'صَلَاةُ الظُّهْرِ ☀️' },
    { id: 'asr', title: 'صَلَاةُ الْعَصْرِ 🌤️' },
    { id: 'maghrib', title: 'صَلَاةُ الْمَغْرِبِ 🌅' },
    { id: 'isha', title: 'صَلَاةُ الْعِشَاءِ 🌙' }
];

const kidsMannersData = [
    { id: 'm1', title: "الأَكْلُ بِالْيَدِ الْيُمْنَى 🍽️", desc: "أَقُولُ بِسْمِ اللهِ وَآكُلُ بِيَمِينِي." },
    { id: 'm2', title: "إِفْشَاءُ السَّلَامِ 🖐️", desc: "أَبْتَسِمُ وَأَقُولُ: السَّلَامُ عَلَيْكُمْ." }
];

// 5️⃣ دوال تشغيل ورندر الميزات القديمة
function renderKidsQuran() {
    const container = document.getElementById('kidsQuranContainer');
    if (!container) return;
    container.innerHTML = kidsQuranData.map(item => `
        <div class="roadmap-card" style="margin-top:10px;">
            <h3>${item.name}</h3>
            <p>${item.count}</p>
            <button onclick="playKidsAudio('${item.src}')" class="start-btn">▶ اسْتَمِعْ وَكَرِّرْ</button>
        </div>
    `).join('');
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
    container.innerHTML = kidsMannersData.map(item => `
        <div class="roadmap-card">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
        </div>
    `).join('');
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
