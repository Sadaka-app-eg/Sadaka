// =========================================================================
// 🎮 محرك الألعاب المجمع الشامل (ALL GAMES ENGINE)
// =========================================================================

// 1️⃣ بناء المدينة والمسجد
function renderCity() {
    const canvas = document.getElementById('cityCanvas');
    if (!canvas) return;

    if (!window.kidsState.cityBuildings || window.kidsState.cityBuildings.length === 0) {
        canvas.innerHTML = `<p style="color:#b2bec3; font-size:13px; text-align:center; width:100%;">الأرض خالية، ابدأ ببناء المعالم والتبرع بالطوب 🧱!</p>`;
        return;
    }

    const buildingIcons = { mosque: '🕌', school: '🏫', library: '📚', well: '💧' };
    canvas.innerHTML = window.kidsState.cityBuildings.map(type => `
        <span class="building-item" style="font-size:45px;">${buildingIcons[type] || '🏛️'}</span>
    `).join('');
}

function buyBuilding(type, cost) {
    if (window.kidsState.bricks >= cost) {
        window.kidsState.bricks -= cost;
        window.kidsState.cityBuildings.push(type);
        saveKidsState();
        renderCity();
        alert("🎉 تم بناء المعلم بنجاح في مدينتك!");
    } else {
        alert("⚠️ لا تملك طوبًا كافيًا! أنجز مهاماً وألعاباً لتكسب المزيد من الطوب.");
    }
}

// 2️⃣ لعبة ترتيب الوضوء
const wuduSteps = ["النِّيَّةُ وَالتَّسْمِيَةُ 🤲", "غَسْلُ الكَفَّيْنِ 💧", "المَضْمَضَةُ وَالاِسْتِنْشَاقُ 👄", "غَسْلُ الوَجْهِ 🧼", "غَسْلُ اليَدَيْنِ لِلْمِرْفَقَيْنِ 💪", "مَسْحُ الرَّأْسِ وَالأُذُنَيْنِ 🧑", "غَسْلُ الرِّجْلَيْنِ 🦶"];
let currentWuduIdx = 0;

function renderWuduGame() {
    const box = document.getElementById('wuduGameBox');
    if (!box) return;

    if (currentWuduIdx >= wuduSteps.length) {
        box.innerHTML = `<div style="text-align:center;"><h3>🎉 أحسنت! أتممت الوضوء بشكل صحيح مئة بالمئة! ✨</h3><button onclick="currentWuduIdx=0; renderWuduGame();" class="start-btn">إعادة اللعبة 🔄</button></div>`;
        return;
    }

    const shuffled = [...wuduSteps].sort(() => Math.random() - 0.5);
    box.innerHTML = `
        <strong style="display:block; margin-bottom:10px; color:#0984e3;">اختر الخطوة رقم (${currentWuduIdx + 1}) في الوضوء:</strong>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
            ${shuffled.map(step => `<button onclick="checkWuduStep('${step}')" class="who-opt-btn">${step}</button>`).join('')}
        </div>
    `;
}

const gameIcons = [
    'kaaba.png.jpg',
    'quran.png.jpg',
    'mosque.png.jpg',
    'crescent.png.jpg',
    'star.png.png',
    'rosary.png.jpg'
];

function checkWuduStep(selectedStep) {
    if (selectedStep === wuduSteps[currentWuduIdx]) {
        currentWuduIdx++;
        window.kidsState.stars += 5;
        saveKidsState();
        renderWuduGame();
    } else {
        alert("⚠️ ليست هذه الخطوة التالية، ركز يا بطل!");
    }
}

// 3️⃣ لعبة التوصيل (وصل النبي بالمعجزة/الحيوان)
const matchData = [
    { prophet: "سيدنا يونس عليه السلام", target: "الحوت 🐳" },
    { prophet: "سيدنا صالح عليه السلام", target: "الناقة 🐪" },
    { prophet: "سيدنا سليمان عليه السلام", target: "النملة والهدهد 🐜" },
    { prophet: "سيدنا موسى عليه السلام", target: "العصا واليد البيضاء 🪄" }
];
let selectedProphet = null;

function renderMatchGame() {
    const box = document.getElementById('matchGameBox');
    if (!box) return;

    box.innerHTML = `
        <p style="margin-bottom:10px; font-weight:bold;">اضغط على النبي ثم اضغط المعجزة المطابقة له:</p>
        <div style="display:flex; justify-content:space-between; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:8px; flex:1;">
                ${matchData.map(item => `<button onclick="selectedProphet='${item.prophet}'; alert('اخترت: ${item.prophet}، اختر المعجزة الآن!');" class="who-opt-btn">${item.prophet}</button>`).join('')}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; flex:1;">
                ${matchData.map(item => `<button onclick="checkMatchAns('${item.target}')" class="who-opt-btn">${item.target}</button>`).join('')}
            </div>
        </div>
    `;
}

function checkMatchAns(target) {
    if (!selectedProphet) { alert("اختر النبي أولاً!"); return; }
    const match = matchData.find(m => m.prophet === selectedProphet && m.target === target);
    if (match) {
        window.kidsState.stars += 10;
        window.kidsState.bricks += 2;
        saveKidsState();
        alert("🎉 توصيل صحيح وممتاز! كسبت 10 نجوم و 2 طوب!");
        selectedProphet = null;
    } else {
        alert("⚠️ غير متطابقين، حاول مرة أخرى!");
    }
}

// 4️⃣ لعبة من هو؟
// 4️⃣ بنك أسئلة لعبة من هو؟ (مستويات متعددة)
const whoList = [
    {
        hints: ["نَبِيٌّ ابْتَلَعَهُ الحُوتُ 🐋", "دَعَا رَبَّهُ فِي الظُّلُمَاتِ 🌙", "قَوْمُهُ كَانُوا فِي نِينُوَى 🕌"],
        opts: ["يُونُسُ عَلَيْهِ السَّلَامُ", "مُوسَى عَلَيْهِ السَّلَامُ", "صَالِحٌ عَلَيْهِ السَّلَامُ"],
        ans: 0
    },
    {
        hints: ["صَحَابِيٌّ جَلِيلٌ يُلَقَّبُ بِـ (الفَارُوق) ⚔️", "ثَانِي الخُلَفَاءِ الرَّاشِدِينَ 🕌", "أَعَزَّ اللَّهُ بِهِ الإِسْلَامَ ✨"],
        opts: ["عُمَرُ بْنُ الخَطَّابِ", "أَبُو بَكْرٍ الصِّدِّيقُ", "عُثْمَانُ بْنُ عَفَّانَ"],
        ans: 0
    },
    {
        hints: ["نَبِيٌّ أَعْطَاهُ اللَّهُ المُلْكَ وَعَلَّمَهُ لُغَةَ الطَّيْرِ 🕊️", "بَنَى مَعْبَدًا قَوِيًّا وَتَكَلَّمَ مَعَ النَّمْلَةِ 🐜", "ابْنُ نَبِيِّ اللَّهِ دَاوُدَ 👑"],
        opts: ["سُلَيْمَانُ عَلَيْهِ السَّلَامُ", "يُوسُفُ عَلَيْهِ السَّلَامُ", "إِبْرَاهِيمُ عَلَيْهِ السَّلَامُ"],
        ans: 0
    },
    {
        hints: ["صَحَابِيٌّ وَهُوَ أَوَّلُ مَنْ أَذَّنَ فِي الإِسْلَامِ 🎙️", "صَوْتُهُ كَانَ جَمِيلًا وَعَذْبًا 🕌", "كَانَ عَبْدًا فَأَعْتَقَهُ أَبُو بَكْرٍ 🕊️"],
        opts: ["بِلَالُ بْنُ رَبَاحٍ", "خَالِدُ بْنُ الوَلِيدِ", "عَمَّارُ بْنُ يَاسِرٍ"],
        ans: 0
    },
    {
        hints: ["نَبِيٌّ كَلَّمَهُ اللَّهُ عِنْدَ الطُّورِ ⛰️", "شَقَّ اللَّهُ لَهُ البَحْرَ بِالعَصَا 🌊", "أُنْزِلَتْ عَلَيْهِ التَّوْرَاةُ 📖"],
        opts: ["مُوسَى عَلَيْهِ السَّلَامُ", "عِيسَى عَلَيْهِ السَّلَامُ", "هَارُونُ عَلَيْهِ السَّلَامُ"],
        ans: 0
    }
];
let currentWhoIdx = 0;

function renderWhoGame() {
    const box = document.getElementById('whoGameBox');
    if (!box) return;

    box.innerHTML = `
        <div style="background:#f1f2f6; padding:12px; border-radius:12px; margin-bottom:12px;">
            ${whoData.hints.map(h => `<div style="font-weight:bold; margin-top:4px;">💡 ${h}</div>`).join('')}
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:8px;">
            ${whoData.opts.map((opt, idx) => `<button onclick="checkWhoAns(${idx})" class="who-opt-btn">${opt}</button>`).join('')}
        </div>
    `;
}

function checkWhoAns(idx) {
    if (idx === whoData.ans) {
        window.kidsState.stars += 15;
        saveKidsState();
        alert("🎉 إجابة صحيحة! أحسنت يا بطل!");
    } else {
        alert("⚠️ حاول مرة أخرى!");
    }
}

// 5️⃣ بنك قضايا المحقق الإسلامي
const detectivePuzzles = [
    {
        q: "🕵️‍♂️ القَضِيَّةُ 1: وَجَدَ المَحَقِّقُ طِفْلًا نَسِيَ غَسْلَ وَجْهِهِ فِي الوُضُوءِ وَذَهَبَ لِلصَّلَاةِ، مَا الحُكْمُ؟",
        opts: ["صَلَاتُهُ صَحِيحَةٌ وَلا شَيْءَ عَلَيْهِ", "يُعِيدُ الوُضُوءَ كَامِلًا وَيُعِيدُ الصَّلَاةَ", "يَغْسِلُ وَجْهَهُ فَقَطْ وَهُوَ فِي الصَّلَاةِ"],
        ans: 1
    },
    {
        q: "🕵️‍♂️ القَضِيَّةُ 2: طِفْلٌ قَامَ لِصَلَاةِ الظُّهْرِ وَصَلَّى 3 رَكَعَاتٍ فَقَطْ ثُمَّ سَلَّمَ وَهُوَ يَعْلَمُ، مَاذَا يَفْعَلُ؟",
        opts: ["يَكْمُلُ رَكْعَةً وَيَسْجُدُ لِلسَّهْوِ", "صَلَاتُهُ بَاطِلَةٌ وَيُعِيدُ الأَرْبَعَ رَكَعَاتٍ", "صَلَاتُهُ المَغْرِبُ وَلَيْسَتِ الظُّهْرَ"],
        ans: 1
    },
    {
        q: "🕵️‍♂️ القَضِيَّةُ 3: رَأَى المَحَقِّقُ وَرَقَةً مَكْتُوبًا فِيهَا: (سُبْحَانَ اللَّهِ 33، الحَمْدُ لِلَّهِ 33، اللَّهُ أَكْبَرُ 33، لا إِلَهَ إِلا اللَّهُ 1)، مَتَى يُقَالُ هَذَا الذِّكْرُ؟",
        opts: ["قَبْلَ دُخُولِ المَسْجِدِ", "دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ", "عِنْدَ رُكُوبِ السَّيَّارَةِ"],
        ans: 1
    },
    {
        q: "🕵️‍♂️ القَضِيَّةُ 4: شخص شَرِبَ المَاءَ فِي نَهَارِ رَمَضَانَ نَاسِيًا، مَا الحُكْمُ؟",
        opts: ["يُفْطِرُ وَيَقْضِي اليَوْمَ", "يُتِمُّ صَوْمَهُ فَإِنَّمَا أَطْعَمَهُ اللَّهُ وَسَقَاهُ", "يَدْفَعُ كَفَّارَةً"],
        ans: 1
    }
];
let currentDetectiveIdx = 0;

// 5️⃣ لعبة المحقق
function renderDetective() {
    const box = document.getElementById('detectiveBox');
    if (!box) return;

    box.innerHTML = `
        <strong style="font-size:15px; color:#d63031; display:block; margin-bottom:10px;">🕵️‍♂️ القضية: وجد المحقق طفلاً نسي غسل وجهه في الوضوء وذهب للصلاة، ما الحكم؟</strong>
        <button onclick="checkDetectiveAns(0)" class="who-opt-btn" style="width:100%; margin-top:6px;">صلاته صحيحة ولا شيء عليه</button>
        <button onclick="checkDetectiveAns(1)" class="who-opt-btn" style="width:100%; margin-top:6px;">يعيد الوضوء والاهتمام به ثم يعيد الصلاة</button>
    `;
}

function checkDetectiveAns(idx) {
    if (idx === 1) {
        window.kidsState.stars += 20;
        window.kidsState.bricks += 5;
        saveKidsState();
        alert("🎉 إجابة عبقرية يا محقق! كسبت 20 نجمة و 5 طوبات!");
    } else {
        alert("⚠️ حاول مرة أخرى يا بطل!");
    }
}

// 6️⃣ أكمل الآية
// 6️⃣ بنك آيات السور القصيرة
const verseList = [
    { q: "قُلْ هُوَ اللَّهُ ...", opts: ["أَحَدٌ ✨", "وَاحِدٌ 🌸", "الأَوَّلُ ☀️"], ans: 0 },
    { q: "إِنَّا أَعْطَيْنَاكَ ...", opts: ["الكَوْثَرَ 🌊", "النَّصْرَ 🚩", "الفَتْحَ 🌟"], ans: 0 },
    { q: "قُلْ أَعُوذُ بِرَبِّ ...", opts: ["الفَلَقِ 🛡️", "النَّاسِ 🤍", "السَّمَاءِ 🌌"], ans: 0 },
    { q: "إِذَا جَاءَ نَصْرُ اللَّهِ وَ ...", opts: ["الفَتْحُ 🚩", "الفَرْحُ 🎈", "الخَيْرُ ✨"], ans: 0 },
    { q: "وَالعَصْرِ ۧ إِنَّ الإِنْسَانَ لَفِي ...", opts: ["خُسْرٍ ⚠️", "نُورٍ 🌟", "جَنَّةٍ 🌿"], ans: 0 }
];
let currentVerseIdx = 0;
function renderVerseGame() {
    const box = document.getElementById('verseGameBox');
    if (!box) return;

    box.innerHTML = `
        <strong style="font-size:18px; color:#0984e3; display:block; margin-bottom:12px;">${verseData.q}</strong>
        <div style="display:flex; gap:10px;">
            ${verseData.opts.map((opt, idx) => `<button onclick="checkVerseAns(${idx})" class="who-opt-btn" style="flex:1;">${opt}</button>`).join('')}
        </div>
    `;
}

function checkVerseAns(idx) {
    if (idx === verseData.ans) {
        window.kidsState.stars += 10;
        saveKidsState();
        alert("🎉 إجابة صحيحة بارك الله فيك!");
    } else {
        alert("⚠️ اختر الكلمة الصحيحة المطابقة للآية!");
    }
}

// 7️⃣ فرقعة البلالين
let balloonScore = 0;
function startBalloonGame() {
    const area = document.getElementById('balloonArea');
    if (!area) return;

    area.innerHTML = '';
    const balloons = ['🎈 سُبْحَانَ اللَّهِ', '🎈 الحَمْدُ لِلَّهِ', '🎈 اللَّهُ أَكْبَرُ'];

    for (let i = 0; i < 6; i++) {
        const b = document.createElement('div');
        b.className = 'flying-balloon';
        b.textContent = balloons[i % balloons.length];
        b.style.left = (i * 15 + 5) + '%';
        b.style.animationDelay = (i * 0.6) + 's';
        b.onclick = () => {
            balloonScore += 5;
            window.kidsState.stars += 2;
            saveKidsState();
            document.getElementById('balloonScore').textContent = balloonScore;
            b.remove();
        };
        area.appendChild(b);
    }
}

// 8️⃣ بنك أسئلة السرعة الـ 60 ثانية (مطور وشامل)
const speedQuestionsBank = [
    // --- الأسئلة الأصلية ---
    { q: "كَمْ عَدَدُ صَلَوَاتِ اليَوْمِ وَاللَّيْلَةِ المَفْرُوضَةِ؟", opts: ["5 صَلَوَاتٍ", "3 صَلَوَاتٍ", "7 صَلَوَاتٍ"], a: 0 },
    { q: "مَا هِيَ أَطْوَلُ سُورَةٍ فِي القُرْآنِ الكَرِيمِ؟", opts: ["سُورَةُ البَقَرَةِ", "سُورَةُ آلِ عِمْرَانَ", "سُورَةُ النِّسَاءِ"], a: 0 },
    { q: "مَا هُوَ الرَّكْنُ الأَوَّلُ مِنْ أَرْكَانِ الإِسْلَامِ؟", opts: ["الشَّهَادَتَانِ", "الصَّلَاةُ", "الصَّوْمُ"], a: 0 },
    { q: "مَنْ هُوَ خَاتَمُ الأَنْبِيَاءِ وَالمُرْسَلِينَ؟", opts: ["مُحَمَّدٌ ﷺ", "إِبْرَاهِيمُ ؑ", "عِيسَى ؑ"], a: 0 },
    { q: "مَا هِيَ السُّورَةُ الَّتِي تُعَادِلُ ثُلُثَ القُرْآنِ؟", opts: ["سُورَةُ الإِخْلَاصِ", "سُورَةُ الفَاتِحَةِ", "سُورَةُ الكَوْثَرِ"], a: 0 },
    { q: "كَمْ عَدَدُ أَجْزَاءِ القُرْآنِ الكَرِيمِ؟", opts: ["30 جُزْءًا", "60 جُزْءًا", "114 جُزْءًا"], a: 0 },
    { q: "مَا هِيَ أَعْظَمُ آيَةٍ فِي القُرْآنِ الكَرِيمِ؟", opts: ["آيَةُ الكُرْسِيِّ", "آيَةُ الدَّيْنِ", "آيَةُ النُّورِ"], a: 0 },

    // --- أسئلة علوم القرآن والتفسير (متوسطة إلى صعبة) ---
    { q: "مَا هِيَ السُّورَةُ الَّتِي تُسَمَّى «عَرُوسَ القُرْآنِ»؟", opts: ["سُورَةُ الرَّحْمَنِ", "سُورَةُ يٰسٓ", "سُورَةُ المَلِكِ"], a: 0 },
    { q: "سُورَةٌ فِي القُرْآنِ لاَ تَبْدَأُ بِالبَسْمَلَةِ، فَمَا هِيَ؟", opts: ["سُورَةُ يُونُسَ", "سُورَةُ التَّوْبَةِ", "سُورَةُ الأَنْفَالِ"], a: 1 },
    { q: "كَمْ سُورَةً فِي القُرْآنِ الكَرِيمِ تَبْدَأُ بِـ «الحَمْدُ لِلَّهِ»؟", opts: ["4 سُوَرٍ", "5 سُوَرٍ", "6 سُوَرٍ"], a: 1 },
    { q: "مَا هِيَ السُّورَةُ الَّتِي احْتَوَتْ عَلَى بَسْمَلَتَيْنِ؟", opts: ["سُورَةُ النَّمْلِ", "سُورَةُ النَّحْلِ", "سُورَةُ القَصَصِ"], a: 0 },
    { q: "مَا أَقْصَرُ سُورَةٍ فِي القُرْآنِ الكَرِيمِ؟", opts: ["سُورَةُ النَّصْرِ", "سُورَةُ الفَلَقِ", "سُورَةُ الكَوْثَرِ"], a: 2 },
    { q: "مَا هِيَ السُّورَةُ الَّتِي كَانَتْ سَبَبًا فِي إِسْلَامِ عُمَرَ بْنِ الخَطَّابِ؟", opts: ["سُورَةُ طٰهٰ", "سُورَةُ يٰسٓ", "سُورَةُ الفَتْحِ"], a: 0 },
    { q: "سُورَةٌ تُسَمَّى «المُنْجِيَةَ» مِنْ عَذَابِ القَبْرِ، فَمَا هِيَ؟", opts: ["سُورَةُ المُلْكِ", "سُورَةُ السَّجْدَةِ", "سُورَةُ الدُّخَانِ"], a: 0 },
    { q: "مَا هِيَ أَكْبَرُ كَلِمَةٍ فِي القُرْآنِ الكَرِيمِ عَدَدًا لِلْحُرُوفِ؟", opts: ["فَأَسْقَيْنَاكُمُوهُ", "أَنُلْزِمُكُمُوهَا", "فَسَيَكْفِيكَهُمُ"], a: 1 },
    { q: "كَمْ عَدَدُ السُّوَرِ المَكِّيَّةِ فِي القُرْآنِ الكَرِيمِ؟", opts: ["86 سُورَةً", "28 سُورَةً", "90 سُورَةً"], a: 0 },
    { q: "مَا هِيَ السُّورَةُ الَّتِي تُسَمَّى «سُورَةَ المَلاَئِكَةِ»؟", opts: ["سُورَةُ فَاطِرٍ", "سُورَةُ الصَّافَّاتِ", "سُورَةُ الزُّمَرِ"], a: 0 },
    { q: "أَيُّ سُورَةٍ تُسَمَّى «سُورَةَ بَنِي إِسْرَائِيلَ»؟", opts: ["سُورَةُ الإِسْرَاءِ", "سُورَةُ الأَنْبِيَاءِ", "سُورَةُ يُوسُفَ"], a: 0 },
    { q: "مَا هِيَ السُّورَةُ الَّتِي تَنْتَهِي كُلُّ آيَاتِهَا بِحَرْفِ الدَّالِ؟", opts: ["سُورَةُ الإِخْلاَصِ", "سُورَةُ المَسَدِ", "سُورَةُ الفَلَقِ"], a: 0 },

    // --- أسئلة السيرة النبوية والغزوات (صعبة ومتقدمة) ---
    { q: "فِي أَيِّ عَامٍ هِجْرِيٍّ وَقَعَتْ غَزْوَةُ بَدْرٍ الكُبْرَى؟", opts: ["السَّنَةَ 2 هـ", "السَّنَةَ 3 هـ", "السَّنَةَ 4 هـ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ الَّذِي أَشَارَ عَلَى النَّبِيِّ ﷺ بِحَفْرِ الخَنْدَقِ؟", opts: ["عَمْرُو بْنُ العَاصِ", "سَلْمَانُ الفَارِسِيُّ", "أَبُو ذَرٍّ الغِفَارِيُّ"], a: 1 },
    { q: "مَا هِيَ آخِرُ غَزْوَةٍ خَاضَهَا الرَّسُولُ ﷺ؟", opts: ["غَزْوَةُ تَبُوكَ", "غَزْوَةُ حُنَيْنٍ", "غَزْوَةُ خَيْبَرَ"], a: 0 },
    { q: "مَا اسْمُ حَاضِنَةِ النَّبِيِّ ﷺ فِي صِغَرِهِ؟", opts: ["أُمُّ أَيْمَنَ", "حَلِيمَةُ السَّعْدِيَّةُ", "فَاطِمَةُ بِنْتُ أَسَدٍ"], a: 0 },
    { q: "مَنْ هِيَ بَكْرُ زَوْجَاتِ النَّبِيِّ ﷺ وَالوِحِيدَةُ الَّتِي لَمْ يَتَزَوَّجْ ثَيِّبًا غَيْرَهَا؟", opts: ["عَائِشَةُ بِنْتُ أَبِي بَكْرٍ", "خَدِيجَةُ بِنْتُ خُوَيْلِدٍ", "حَفْصَةُ بِنْتُ عُمَرَ"], a: 0 },
    { q: "كَمْ كَانَ عُمْرُ النَّبِيِّ ﷺ عِنْدَمَا بَعَثَهُ اللهُ ثَلاَثًا وَرَسُولاً؟", opts: ["40 سَنَةً", "35 سَنَةً", "50 سَنَةً"], a: 0 },
    { q: "مَنْ هُوَ الشَّاعِرُ الَّذِي كَانَ يُدَافِعُ عَنِ الإِسْلاَمِ بِلِسَانِهِ بِأَمْرِ النَّبِيِّ ﷺ؟", opts: ["حَسَّانُ بْنُ ثَابِتٍ", "كَعْبُ بْنُ زُهَيْرٍ", "عَبْدُ اللهِ بْنُ رَوَاحَةَ"], a: 0 },
    { q: "مَا هُوَ اسْمُ السَّيْفِ الَّذِي كَانَ يَمْتَلِكُهُ النَّبِيُّ ﷺ وَاشْتُهِرَ بِهِ؟", opts: ["ذُو الفَقَارِ", "الَبَتَّارُ", "الصَّارِمُ"], a: 0 },
    { q: "فِي أَيِّ مَكَانٍ تُوُفِّيَ النَّبِيُّ ﷺ وَدُفِنَ؟", opts: ["حُجْرَةِ عَائِشَةَ بالْمَدِينَةِ", "المَسْجِدِ النَّبَوِيِّ", "مَكَّةَ المُكَرَّمَةِ"], a: 0 },

    // --- أسئلة الصحابة وآل البيت (صعبة ودقيقة) ---
    { q: "مَنْ هُوَ الصَّحَابِيُّ الَّذِي اهْتَزَّ لِمَوْتِهِ عَرْشُ الرَّحْمَنِ؟", opts: ["سَعْدُ بْنُ مُعَاذٍ", "مُصْعَبُ بْنُ عُمَيْرٍ", "حَمْزَةُ بْنُ عَبْدِ المُطَّلِبِ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ المُلَقَّبُ بِـ «أَمِينِ هَذِهِ الأُمَّةِ»؟", opts: ["أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ", "مُعَاذُ بْنُ جَبَلٍ", "حُذَيْفَةُ بْنُ اليَمَانِ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ الَّذِي تُوُفِّيَ وَغَسَّلَتْهُ المَلاَئِكَةُ؟", opts: ["حَنْظَلَةُ بْنُ أَبِي عَامِرٍ", "زَيْدُ بْنُ حَارِثَةَ", "جَعْفَرُ بْنُ أَبِي طَالِبٍ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ الوَحِيدُ الَّذِي ذُكِرَ اسْمُهُ صَرِيحًا فِي القُرْآنِ؟", opts: ["زَيْدُ بْنُ حَارِثَةَ", "أَبُو بَكْرٍ الصِّدِّيقُ", "عُثْمَانُ بْنُ عَفَّانَ"], a: 0 },
    { q: "مَنْ هُوَ حَبْرُ الأُمَّةِ وَتَرْجُمَانُ القُرْآنِ؟", opts: ["عَبْدُ اللهِ بْنُ عَبَّاسٍ", "عَبْدُ اللهِ بْنُ مَسْعُودٍ", "عَبْدُ اللهِ بْنُ عُمَرَ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ المُلَقَّبُ بِـ «ذِي النُّورَيْنِ»؟", opts: ["عُثْمَانُ بْنُ عَفَّانَ", "عليُّ بْنُ أَبِي طَالِبٍ", "طَلْحَةُ بْنُ عُبَيْدِ اللهِ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ الَّذِي يُعْتَبَرُ أَوَّلَ مَنْ أَلْقَى تَحِيَّةَ الإِسْلاَمِ؟", opts: ["أَبُو ذَرٍّ الغِفَارِيُّ", "المِقْدَادُ بْنُ عَمْرٍو", "سَعْدُ بْنُ أَبِي وَقَّاصٍ"], a: 0 },
    { q: "مَنْ هُوَ الصَّحَابِيُّ الَّذِي كَانَ يُسَمَّى «سَيِّدَ القُرَّاءِ»؟", opts: ["أُبَيُّ بْنُ كَعْبٍ", "زَيْدُ بْنُ ثَابِتٍ", "مُعَاذُ بْنُ جَبَلٍ"], a: 0 },

    // --- أسئلة الأنبياء والقصص القرآني ---
    { q: "مَنْ هُوَ النَّبِيُّ الَّذِي أُوتِيَ شَطْرَ الحُسْنِ (نِصْفَ الجَمَالِ)؟", opts: ["يُوسُفُ ؑ", "سُلَيْمَانُ ؑ", "آدَمُ ؑ"], a: 0 },
    { q: "مَنْ هُوَ النَّبِيُّ الَّذِي سُخِّرَتْ لَهُ الرِّيَاحُ وَالجِنُّ؟", opts: ["سُلَيْمَانُ ؑ", "دَاوُدُ ؑ", "مُوسَى ؑ"], a: 0 },
    { q: "مَنْ هُوَ النَّبِيُّ الَّذِي ابتُلاَهُ اللهُ بِالمَرَضِ وَالصَّبْرِ لِسَنَوَاتٍ؟", opts: ["أَيُّوبُ ؑ", "يُونُسُ ؑ", "يَعْقُوبُ ؑ"], a: 0 },
    { q: "مَا هُوَ اللَّقَبُ الَّذِي أُطْلِقَ عَلَى نَبِيِّ اللهِ إِبْرَاهِيمَ ؑ؟", opts: ["خَلِيلُ اللهِ", "كَلِيمُ اللهِ", "رُوحُ اللهِ"], a: 0 },
    { q: "مَنْ هُوَ النَّبِيُّ الَّذِي لَقَبُهُ «ذُو النُّونِ»؟", opts: ["يُونُسُ ؑ", "إِدْرِيسُ ؑ", "صَالِحٌ ؑ"], a: 0 },
    { q: "كَمْ لَبِثَ نُوحٌ ؑ فِي قَوْمِهِ يَدْعُوهُمْ إِلَى اللهِ؟", opts: ["950 سَنَةً", "1000 سَنَةً", "500 سَنَةً"], a: 0 },

    // --- أسئلة فقهية وعقائدية وتاريخية (صعبة) ---
    { q: "مَا هِيَ الصَّلاَةُ الَّتِي لاَ رُكُوعَ فِيهَا وَلاَ سُجُودَ؟", opts: ["صَلاَةُ الجَنَازَةِ", "صَلاَةُ العِيدِ", "صَلاَةُ الاِسْتِسْقَاءِ"], a: 0 },
    { q: "مَا هُوَ المِيقَاتُ المَكَانِيُّ لأَهْلِ المَدِينَةِ المُنَوَّرَةِ لِلإِحْرَامِ؟", opts: ["ذُو الحُلَيْفَةِ", "يَلَمْلَمُ", "قَرْنُ المَنَازِلِ"], a: 0 },
    { q: "مَا هُوَ أَوَّلُ مَسْجِدٍ بُنِيَ فِي الإِسْلاَمِ؟", opts: ["مَسْجِدُ قُبَاءٍ", "المَسْجِدُ النَّبَوِيُّ", "المَسْجِدُ الحَرَامُ"], a: 0 },
    { q: "مَنْ هُوَ القَائِدُ المُسْلِمُ الَّذِي فَتَحَ الأَنْدَلُسَ؟", opts: ["طَارِقُ بْنُ زِيَادٍ", "قُتَيْبَةُ بْنُ مُسْلِمٍ", "عُقْبَةُ بْنُ نَافِعٍ"], a: 0 },
    { q: "مَنْ هُوَ المَلَكُ المَؤْكُولُ بِالنَّفْخِ فِي الصُّورِ؟", opts: ["إِسْرَافِيلُ ؑ", "مِيكَائِيلُ ؑ", "جِبْرِيلُ ؑ"], a: 0 },
    { q: "مَا هُوَ اليَوْمُ الَّذِي يُسَمَّى «يَوْمَ الحَجِّ الأَكْبَرِ»؟", opts: ["يَوْمُ النَّحْرِ (10 ذُو الحِجَّةِ)", "يَوْمُ عَرَفَةَ (9 ذُو الحِجَّةِ)", "يَوْمُ القَرِّ (11 ذُو الحِجَّةِ)"], a: 0 },
    { q: "مَنْ هُوَ أَّوَّلُ مَنْ أَمَرَ بِجَمْعِ القُرْآنِ الكَرِيمِ فِي مُصْحَفٍ وَاحِدٍ؟", opts: ["أَبُو بَكْرٍ الصِّدِّيقُ", "عُثْمَانُ بْنُ عَفَّانَ", "عُمَرُ بْنُ الخَطَّابِ"], a: 0 },
    { q: "مَا هُوَ الحَرَمُ الثَّالِثُ الَّذِي تُشَدُّ إِلَيْهِ الرِّحَالُ؟", opts: ["المَسْجِدُ الأَقْصَى", "المَسْجِدُ الأُمَوِيُّ", "مَسْجِدُ القِبْلَتَيْنِ"], a: 0 }
];

let speedTimer = 60, speedScore = 0, speedInterval = null;
function startSpeedChallenge() {
    speedTimer = 60; speedScore = 0;
    document.getElementById('speedTimer').textContent = speedTimer;
    document.getElementById('speedScore').textContent = speedScore;

    if (speedInterval) clearInterval(speedInterval);
    speedInterval = setInterval(() => {
        speedTimer--;
        document.getElementById('speedTimer').textContent = speedTimer;
        if (speedTimer <= 0) {
            clearInterval(speedInterval);
            alert(`🎉 انتهى الوقت! مجموع نقاطك في السرعة: ${speedScore}`);
        }
    }, 1000);

    renderSpeedQuestion();
}

let currentSpeedQ = null;

function renderSpeedQuestion() {
    const qArea = document.getElementById('speedQuestionArea');
    if (!qArea) return;

    // اختيار سؤال عشوائي من البنك
    currentSpeedQ = speedQuestionsBank[Math.floor(Math.random() * speedQuestionsBank.length)];

    qArea.innerHTML = `
        <p style="font-weight:bold; font-size:16px; margin-bottom:10px;">${currentSpeedQ.q}</p>
        <div style="display:flex; flex-direction:column; gap:6px;">
            ${currentSpeedQ.opts.map((opt, idx) => `
                <button onclick="answerSpeed(${idx})" class="who-opt-btn">${opt}</button>
            `).join('')}
        </div>
    `;
}

function answerSpeed(selectedIdx) {
    if (currentSpeedQ && selectedIdx === currentSpeedQ.a) {
        speedScore += 10;
        document.getElementById('speedScore').textContent = speedScore;
        window.kidsState.stars += 5;
        saveKidsState();
    }
    renderSpeedQuestion(); // الانتقال للسؤال التالي فوراً
}

// 9️⃣ المزرعة والشجرة
function feedPet() {
    window.kidsState.petFeedCount = (window.kidsState.petFeedCount || 0) + 1;
    if (window.kidsState.petFeedCount >= 3) {
        document.getElementById('petStage').textContent = '🐪';
        document.getElementById('petName').textContent = 'الجمل الصبور';
        document.getElementById('petStatus').textContent = 'كبر خروفك وأصبح جملاً كبيراً!';
    }
    saveKidsState();
}

function waterTree() {
    document.getElementById('treeStage').textContent = '🌳🌸';
    document.getElementById('treeStatus').textContent = 'أزهرت شجرتك بالثمار والعصافير!';
    window.kidsState.stars += 10;
    saveKidsState();
}

// التنشيط المباشر
document.addEventListener('DOMContentLoaded', () => {
    renderCity();
    renderWuduGame();
    renderMatchGame();
    renderWhoGame();
    renderDetective();
    renderVerseGame();
});
// 🌀 محرك لعبة المتاهة
let playerPos = { r: 0, c: 0 };
const targetPos = { r: 4, c: 4 };
const mazeGrid = [
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0]
]; // 0 طريق، 1 جدار

function renderMaze() {
    const board = document.getElementById('mazeBoard');
    if (!board) return;
    board.innerHTML = '';

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.style.width = '50px'; cell.style.height = '50px';
            cell.style.borderRadius = '10px';
            cell.style.display = 'flex'; cell.style.alignItems = 'center'; cell.style.justifyContent = 'center';
            cell.style.fontSize = '24px';

            if (r === playerPos.r && c === playerPos.c) {
                cell.textContent = '🧒'; cell.style.background = '#ffeaa7';
            } else if (r === targetPos.r && c === targetPos.c) {
                cell.textContent = '🕋'; cell.style.background = '#55efc4';
            } else if (mazeGrid[r][c] === 1) {
                cell.textContent = '🧱'; cell.style.background = '#b2bec3';
            } else {
                cell.style.background = '#f1f2f6';
            }
            board.appendChild(cell);
        }
    }
}

function moveMaze(dir) {
    let nr = playerPos.r, nc = playerPos.c;
    if (dir === 'up') nr--;
    if (dir === 'down') nr++;
    if (dir === 'left') nc--;
    if (dir === 'right') nc++;

    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && mazeGrid[nr][nc] !== 1) {
        playerPos = { r: nr, c: nc };
        renderMaze();
        if (nr === targetPos.r && nc === targetPos.c) {
            window.kidsState.stars += 20;
            window.kidsState.bricks += 5;
            saveKidsState();
            alert("🎉 العَفْوُ وَالنَّصْرُ! وَصَلْتَ إِلَى الكَعْبَةِ بِنَجَاحٍ وَكَسَبْتَ 20 نَجْمَةً!");
            playerPos = { r: 0, c: 0 };
            renderMaze();
        }
    }
}

// ضيف الدالة دي جوه أحداث التشغيل في آخر الملف
document.addEventListener('DOMContentLoaded', () => {
    // باقي ألعابك ...
    renderMaze();
});
