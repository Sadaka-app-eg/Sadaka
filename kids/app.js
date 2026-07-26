// =========================================================================
// 👶 محرك وقواعد بيانات أطفال الإسلام (Kids App Engine Mapped)
// =========================================================================

// 📖 1. بيانات الحديقة القرآنية
const kidsQuranData = [
    { name: "سُورَةُ الْفَاتِحَةِ 📖", count: "7 آيَاتٍ", src: "https://server8.mp3quran.net/afs/001.mp3" },
    { name: "سُورَةُ الإِخْلَاصِ 🌟", count: "4 آيَاتٍ", src: "https://server8.mp3quran.net/afs/112.mp3" },
    { name: "سُورَةُ الْفَلَقِ 🛡️", count: "5 آيَاتٍ", src: "https://server8.mp3quran.net/afs/113.mp3" },
    { name: "سُورَةُ النَّاسِ 🤍", count: "6 آيَاتٍ", src: "https://server8.mp3quran.net/afs/114.mp3" },
    { name: "سُورَةُ الْكَوْثَرِ 🌊", count: "3 آيَاتٍ", src: "https://server8.mp3quran.net/afs/108.mp3" },
    { name: "سُورَةُ النَّصْرِ 🚩", count: "3 آيَاتٍ", src: "https://server8.mp3quran.net/afs/110.mp3" }
];

// 🌳 2. بيانات شجرة الصلاة
const kidsTreeItems = [
    { id: 'fajr', title: 'صَلَاةُ الْفَجْرِ 🌅' },
    { id: 'dhuhr', title: 'صَلَاةُ الظُّهْرِ ☀️' },
    { id: 'asr', title: 'صَلَاةُ الْعَصْرِ 🌤️' },
    { id: 'maghrib', title: 'صَلَاةُ الْمَغْرِبِ 🌅' },
    { id: 'isha', title: 'صَلَاةُ الْعِشَاءِ 🌙' },
    { id: 'quran', title: 'قِرَاءَةُ الْقُرْآنِ 📖' },
    { id: 'parents', title: 'بِرُّ الْوَالِدَيْنِ 💖' },
    { id: 'adhkar', title: 'أَذْكَارُ الصَّبَاحِ/الْمَسَاءِ 📿' }
];

// 📻 3. الصوتيات وحكايات قبل النوم
const kidsAudioData = [
    { title: "قصة أصحاب الفيل للأطفال 🐘", src: "https://archive.org/download/Children_Stories_Islam/Elephant.mp3" },
    { title: "قصة النملة مع سيدنا سليمان 🐜", src: "https://archive.org/download/Children_Stories_Islam/Ant_Solomon.mp3" },
    { title: "أنشودة أركان الإسلام الخمسة 🎵", src: "https://archive.org/download/Children_Stories_Islam/Arkan_Islam.mp3" },
    { title: "دعاء قبل النوم المضيء 🌙", src: "https://archive.org/download/Children_Stories_Islam/Sleeping_Dua.mp3" }
];

// 🌟 4. كروت الأخلاق
const kidsMannersData = [
    { id: 'manner_1', title: "الأَكْلُ بِالْيَدِ الْيُمْنَى 🍽️", desc: "أَقُولُ بِسْمِ اللهِ وَآكُلُ بِيَمِينِي وَمِمَّا يَلِينِي." },
    { id: 'manner_2', title: "إِفْشَاءُ السَّلَامِ 🖐️", desc: "أَبْتَسِمُ وَأَقُولُ: السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ." },
    { id: 'manner_3', title: "الصِّدْقُ فِي الْقَوْلِ 🕊️", desc: "أَقُولُ الْحَقَّ دَائِمًا وَلَا أَكْذِبُ أَبَدًا." },
    { id: 'manner_4', title: "مُسَاعَدَةُ الأُمِّ وَالأَبِ 🧹", desc: "أُرَتِّبُ غُرْفَتِي وَأُسَاعِدُ أُسْرَتِي بِحُبٍّ." }
];

// 🧩 5. بنك أسئلة المسابقة
const kidsQuizData = [
    { q: "مَا هُوَ الْكِتَابُ الَّذِي أَنْزَلَهُ اللهُ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ؟", os: ["الْقُرْآنُ الْكَرِيمُ", "التَّوْرَاةُ", "الإِنْجِيلُ"], a: 0 },
    { q: "كَمْ عَدَدُ أَرْكَانِ الإِسْلَامِ؟", os: ["3 أَرْكَانٍ", "5 أَرْكَانٍ", "7 أَرْكَانٍ"], a: 1 },
    { q: "مَاذَا نَقُولُ قَبْلَ بَدْءِ الأَكْلِ؟", os: ["الْحَمْدُ لِلَّهِ", "بِسْمِ اللَّهِ", "سُبْحَانَ اللَّهِ"], a: 1 }
];

// التنقل بين التبويبات الداخلية
function switchKidsTab(tabName) {
    document.querySelectorAll('.kids-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.kids-sub-btn').forEach(btn => btn.classList.remove('active'));

    const activeContent = document.getElementById('kidsContent_' + tabName);
    const activeBtn = document.getElementById('kidsTab_' + tabName);

    if (activeContent) activeContent.classList.add('active');
    if (activeBtn) activeBtn.classList.add('active');
}

// 1. عرض المصحف المعلم
function renderKidsQuran() {
    const container = document.getElementById('kidsQuranContainer');
    if (!container) return;

    container.innerHTML = kidsQuranData.map(item => `
        <div class="surah-card">
            <h3>${item.name}</h3>
            <p>${item.count}</p>
            <button onclick="playKidsAudio('${item.src}')" class="play-surah-btn">▶ اسْتَمِعْ وَكَرِّرْ</button>
        </div>
    `).join('');
}

// 2. شجرة العبادات
function renderKidsTree() {
    const container = document.getElementById('kidsTreeLeavesContainer');
    if (!container) return;

    const savedLeaves = JSON.parse(localStorage.getItem('kids_tree_leaves') || '{}');
    let activeCount = 0;

    container.innerHTML = kidsTreeItems.map(item => {
        const isDone = savedLeaves[item.id] === true;
        if (isDone) activeCount++;

        return `
        <div onclick="toggleKidsLeaf('${item.id}')" class="leaf-card ${isDone ? 'done' : ''}">
            <div style="font-size: 26px; margin-bottom: 4px;">${isDone ? '🌸' : '🍃'}</div>
            <strong style="font-size: 13px; color: #2d3436; display: block;">${item.title}</strong>
            <span style="font-size: 11px; color: ${isDone ? '#10ac84' : '#b2bec3'}; font-weight: bold;">
                ${isDone ? 'مُزْهِرَةٌ! ✨' : 'اضْغَطْ لِتُزْهِرَ'}
            </span>
        </div>`;
    }).join('');

    const progressEl = document.getElementById('treeProgressText');
    const visualEl = document.getElementById('treeVisualStatus');
    if (progressEl) progressEl.textContent = `مَجْمُوعُ الْأَوْرَاقِ الْمُزْهِرَةِ: ${activeCount} مِـنْ 8`;
    if (visualEl) {
        if (activeCount === 0) visualEl.textContent = '🌱';
        else if (activeCount < 5) visualEl.textContent = '🌿';
        else if (activeCount < 8) visualEl.textContent = '🌳';
        else visualEl.textContent = '🌳🌸✨';
    }
}

function toggleKidsLeaf(id) {
    let saved = JSON.parse(localStorage.getItem('kids_tree_leaves') || '{}');
    saved[id] = !saved[id];
    localStorage.setItem('kids_tree_leaves', JSON.stringify(saved));
    renderKidsTree();
}

// 3. بالونة الأذكار
let zikrCount = 0;
function popKidsZikr() {
    zikrCount++;
    const counterEl = document.getElementById('kidsZikrCounter');
    const balloonEl = document.getElementById('kidsBalloon');
    if (counterEl) counterEl.textContent = zikrCount;

    // تكبير حجم البالونة تدريجياً
    const scaleVal = 1 + (zikrCount % 10) * 0.05;
    if (balloonEl) balloonEl.style.transform = `scale(${scaleVal})`;

    if (zikrCount % 10 === 0) {
        alert("🎉 مَاشَاءَ اللَّهُ! أَكْمَلْتَ 10 تَسْبِيحَاتٍ كَامِلَةٍ! بَطَلٌ حَقِيقِيٌّ! ✨");
    }
}

function setKidsZikr(text) {
    zikrCount = 0;
    document.getElementById('kidsZikrText').textContent = text;
    document.getElementById('kidsZikrCounter').textContent = 0;
    document.getElementById('kidsBalloon').style.transform = 'scale(1)';
}

// 4. لعبة الذاكرة الإسلامية
const gameIcons = ['🕋', '📖', '🕌', '🌙', '⭐', '📿'];
let gameCards = [];
let flippedCards = [];
let moves = 0;

function initMemoryGame() {
    const board = document.getElementById('memoryBoard');
    if (!board) return;

    moves = 0;
    document.getElementById('gameMoves').textContent = moves;
    flippedCards = [];

    // مضاعفة الصور وخلطها
    gameCards = [...gameIcons, ...gameIcons].sort(() => Math.random() - 0.5);

    board.innerHTML = gameCards.map((imgSrc, idx) => `
        <div class="memory-card" id="mCard_${idx}" onclick="flipCard(${idx})">
            <img src="${imgSrc}" id="mIcon_${idx}" style="display:none; width:70%; height:70%; object-fit:contain;" />
            <span id="mCover_${idx}" style="font-size:30px;">❓</span>
        </div>
    `).join('');
}

function flipCard(idx) {
    const card = document.getElementById(`mCard_${idx}`);
    const icon = document.getElementById(`mIcon_${idx}`);
    const cover = document.getElementById(`mCover_${idx}`);

    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        icon.style.display = 'block';
        cover.style.display = 'none';
        flippedCards.push({ idx, src: icon.src });

        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('gameMoves').textContent = moves;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.src === c2.src) {
        flippedCards = [];
    } else {
        setTimeout(() => {
            document.getElementById(`mCard_${c1.idx}`).classList.remove('flipped');
            document.getElementById(`mIcon_${c1.idx}`).style.display = 'none';
            document.getElementById(`mCover_${c1.idx}`).style.display = 'inline';

            document.getElementById(`mCard_${c2.idx}`).classList.remove('flipped');
            document.getElementById(`mIcon_${c2.idx}`).style.display = 'none';
            document.getElementById(`mCover_${c2.idx}`).style.display = 'inline';
            flippedCards = [];
        }, 800);
    }
}

// 5. الراديو وكروت الأخلاق والمسابقة
function renderKidsRadio() {
    const list = document.getElementById('kidsRadioList');
    if (!list) return;

    list.innerHTML = kidsAudioData.map(item => `
        <div class="radio-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🎧</span>
                <strong style="font-size: 14px; color: #2d3436;">${item.title}</strong>
            </div>
            <button onclick="playKidsAudio('${item.src}')" style="background: #fd79a8; color: #fff; border: none; padding: 8px 18px; border-radius: 20px; font-weight: bold; font-size: 12px; cursor: pointer;">▶ تشغيل</button>
        </div>
    `).join('');
}

function playKidsAudio(src) {
    const audio = document.getElementById('kidsAudioEngine');
    if (audio) {
        audio.src = src;
        audio.play().catch(() => alert("🎵 جاري تحميل المحتوى الصوتي..."));
    }
}

function renderKidsManners() {
    const container = document.getElementById('kidsMannersContainer');
    if (!container) return;

    const savedBadges = JSON.parse(localStorage.getItem('kids_manners_badges') || '{}');

    container.innerHTML = kidsMannersData.map(item => {
        const hasBadge = savedBadges[item.id] === true;

        return `
        <div class="manner-card ${hasBadge ? 'has-badge' : ''}">
            <div style="font-size: 32px; margin-bottom: 8px;">${hasBadge ? '👑' : '⭐'}</div>
            <strong style="color: #2d3436; font-size: 15px; display: block; margin-bottom: 6px;">${item.title}</strong>
            <p style="color: #636e72; font-size: 12px; line-height: 1.5; margin-bottom: 12px;">${item.desc}</p>
            <button onclick="toggleKidsBadge('${item.id}')" style="background: ${hasBadge ? '#fdcb6e' : '#00b894'}; color: #fff; border: none; padding: 10px 15px; border-radius: 16px; font-weight: bold; font-size: 12px; cursor: pointer; width: 100%;">
                ${hasBadge ? '🏅 حصلت على الوسام!' : 'أَنَا عَمِلْتُ كَذَا النَّهَارَدَةَ!'}
            </button>
        </div>`;
    }).join('');
}

function toggleKidsBadge(id) {
    let saved = JSON.parse(localStorage.getItem('kids_manners_badges') || '{}');
    saved[id] = !saved[id];
    localStorage.setItem('kids_manners_badges', JSON.stringify(saved));
    renderKidsManners();
}

let currentQuizIdx = 0;
function renderKidsQuiz() {
    const box = document.getElementById('kidsQuizBox');
    if (!box) return;

    const qItem = kidsQuizData[currentQuizIdx];
    if (!qItem) {
        box.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <div style="font-size: 50px; margin-bottom:10px;">🎉</div>
            <h3 style="color:#00b894; margin-bottom:15px;">أَحْسَنْتَ يَا بَطَلُ! قَفَّلْتَ المَسَابَقَةَ بِنَجَاحٍ!</h3>
            <button onclick="currentQuizIdx=0; renderKidsQuiz();" style="background:#0984e3; color:#fff; border:none; padding:10px 20px; border-radius:15px; font-weight:bold; cursor:pointer;">إِعَادَةُ التَّحَدِّي 🔄</button>
        </div>`;
        return;
    }

    box.innerHTML = `
    <div>
        <strong style="color:#d63031; font-size:15px; display:block; margin-bottom:12px;">سُؤَالُ ${currentQuizIdx + 1}: ${qItem.q}</strong>
        <div>
            ${qItem.os.map((opt, oIdx) => `
                <button onclick="answerKidsQuiz(${oIdx})" class="quiz-btn">${opt}</button>
            `).join('')}
        </div>
    </div>`;
}

function answerKidsQuiz(selectedIdx) {
    const qItem = kidsQuizData[currentQuizIdx];
    if (selectedIdx === qItem.a) {
        alert("🎉 إِجَابَةٌ صَحِيحَةٌ يَا بَطَلُ! 👏✨");
        currentQuizIdx++;
        renderKidsQuiz();
    } else {
        alert("⚠️ حَاوِلْ مَرَّةً أُخْرَى يَا بَطَلُ!");
    }
}

// التشغيل الابتدائي
document.addEventListener('DOMContentLoaded', () => {
    renderKidsQuran();
    renderKidsTree();
    renderKidsRadio();
    renderKidsManners();
    renderKidsQuiz();
    initMemoryGame();
});
