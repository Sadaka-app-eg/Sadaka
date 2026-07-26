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
const whoData = {
    hints: ["نَبِيٌّ ابْتَلَعَهُ الحُوتُ 🐋", "دَعَا رَبَّهُ فِي الظُّلُمَاتِ 🌙", "قَوْمُهُ كَانُوا فِي نِينُوَى 🕌"],
    opts: ["يُونُسُ عَلَيْهِ السَّلَامُ", "مُوسَى عَلَيْهِ السَّلَامُ", "صَالِحٌ عَلَيْهِ السَّلَامُ"],
    ans: 0
};

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
const verseData = { q: "قُلْ هُوَ اللَّهُ ...", opts: ["أَحَدٌ ✨", "وَاحِدٌ 🌸", "الأَوَّلُ ☀️"], ans: 0 };
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

// 8️⃣ تحدي الـ 60 ثانية
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

function renderSpeedQuestion() {
    const qArea = document.getElementById('speedQuestionArea');
    if (!qArea) return;

    qArea.innerHTML = `
        <p style="font-weight:bold; font-size:16px;">كم عدد أركان الإسلام؟</p>
        <button onclick="answerSpeed(true)" class="who-opt-btn" style="margin:5px;">5 أركان</button>
        <button onclick="answerSpeed(false)" class="who-opt-btn" style="margin:5px;">3 أركان</button>
    `;
}

function answerSpeed(isCorrect) {
    if (isCorrect) {
        speedScore += 10;
        document.getElementById('speedScore').textContent = speedScore;
        window.kidsState.stars += 5;
        saveKidsState();
    }
    renderSpeedQuestion();
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
