// 1️⃣ مصفوفة المواعظ والدروس (كل عنصر له فئة category لتقدر تصنفها لاحقاً)
window.lecturesData = [
    { title: "سلم نفسك للوحي ، والقرآن كفيل أن يصلح كل شيء في حياتك", src: "audio/audio2/le_1.mp3", category: "مواعظ متنوعة" },
    { title: "اسمع بقلبك", src: "audio/audio2/le_2.mp3", category: "مواعظ متنوعة" },
    { title: "وصايا للشباب _ الشيخ عبدالرزاق البدر", src: "audio/audio2/le_3.mp3", category: "مواعظ متنوعة" },
    { title: "انت مِبتِحظش قرآن ليه ؟", src: "audio/audio2/le_4.mp3", category: "مواعظ متنوعة" },
    { title: "كيف يرضى الله عنك ؟", src: "audio/audio2/le_5.mp3", category: "مواعظ متنوعة" },
    { title: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", src: "audio/audio2/le_6.mp3", category: "مواعظ متنوعة" },
    { title: "لا تلوم نفسك", src: "audio/audio2/le_7.mp3", category: "مواعظ متنوعة" },
    { title: "لا تحزن إن الله يدبر أمرك", src: "audio/audio2/le_8.mp3", category: "مواعظ متنوعة" },
    { title: "من مهالك الرجال .. احذر المهلكة الأولى", src: "audio/audio2/le_9.mp3", category: "مواعظ متنوعة" },
    { title: "الراحة الحقيقية... أين نجدها ؟", src: "audio/audio2/le_10.mp3", category: "مواعظ متنوعة" }
];

window.currentLectureFilter = 'all';
window.currentPlayingLectureAudio = null;
window.currentPlayingLectureBtn = null;

// دالة تنسيق الوقت (00:00)
function formatLectureTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 2️⃣ فانكشن ضخ الصوتيات جوة الصفحة بنفس تنسيق التلاوات الخاشعة
function renderLectures() {
    const listEl = document.getElementById('lecturesList');
    if (!listEl || !window.lecturesData) return;

    const filtered = window.currentLectureFilter === 'all'
        ? window.lecturesData
        : window.lecturesData.filter(l => l.category === window.currentLectureFilter);

    listEl.innerHTML = filtered.map((lecture, index) => {
        return `
        <div style="background: var(--card); border-radius: 16px; padding: 14px; border: 1px solid var(--border); direction: rtl;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px; flex:1;">
              <span style="color:var(--gold); font-size:14px;">📌</span>
              <span style="font-family:'Amiri',serif; font-size:15px; color:var(--text); line-height:1.6;">${lecture.title}</span>
            </div>
            <div style="width:34px; height:34px; border-radius:50%; background:var(--bg2); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid var(--border);">🎙️</div>
            <button class="play-btn" id="lectureBtn_${index}" onclick="window.toggleLectureAudio(${index})" style="background:var(--gold); color:#111; border:none; width:34px; height:34px; border-radius:50%; font-size:14px; cursor:pointer; flex-shrink:0;">▶</button>
            <button id="lectureDlBtn_${index}" onclick="window.downloadLectureAudio(${index})" title="تحميل للاستماع أوفلاين" style="background:var(--bg2); color:var(--gold); border:1px solid var(--border); width:34px; height:34px; border-radius:50%; font-size:14px; cursor:pointer; flex-shrink:0;">⬇️</button>
          </div>
          <div style="margin-top:10px;">
            <input type="range" id="lectureSeek_${index}" value="0" min="0" max="100" step="0.1"
              oninput="window.seekLectureAudio(${index}, this.value)"
              style="width:100%; accent-color:var(--gold); cursor:pointer; height:4px; border-radius:2px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text2); font-family:monospace; direction:ltr; margin-top:4px;">
              <span id="lectureCurTime_${index}">0:00</span>
              <span id="lectureTotalTime_${index}">--:--</span>
            </div>
          </div>
          <div id="lectureDlStatus_${index}" style="font-size:10px; color:var(--text2); margin-top:6px; text-align:center;"></div>
          <audio id="lectureAudio_${index}" src="${lecture.src}"
            onended="window.onLectureAudioEnded(${index})"
            onloadedmetadata="window.onLectureMetaLoaded(${index})"
            ontimeupdate="window.onLectureTimeUpdate(${index})"></audio>
        </div>`;
    }).join('');
}

// 3️⃣ تبديل التشغيل/الإيقاف لأي عنصر
window.toggleLectureAudio = function(index) {
    const audio = document.getElementById('lectureAudio_' + index);
    const btn = document.getElementById('lectureBtn_' + index);
    if (!audio || !btn) return;

    // لو فيه صوت تاني شغال، وقفه الأول
    if (window.currentPlayingLectureAudio && window.currentPlayingLectureAudio !== audio) {
        window.currentPlayingLectureAudio.pause();
        if (window.currentPlayingLectureBtn) window.currentPlayingLectureBtn.textContent = '▶';
    }

    if (audio.paused) {
        audio.play().then(() => {
            btn.textContent = '⏸';
            window.currentPlayingLectureAudio = audio;
            window.currentPlayingLectureBtn = btn;
        }).catch(err => console.error('خطأ تشغيل الموعظة:', err));
    } else {
        audio.pause();
        btn.textContent = '▶';
    }
};

window.seekLectureAudio = function(index, value) {
    const audio = document.getElementById('lectureAudio_' + index);
    if (!audio || isNaN(audio.duration)) return;
    audio.currentTime = (value / 100) * audio.duration;
};

window.onLectureMetaLoaded = function(index) {
    const audio = document.getElementById('lectureAudio_' + index);
    const totalEl = document.getElementById('lectureTotalTime_' + index);
    if (audio && totalEl) totalEl.textContent = formatLectureTime(audio.duration);
};

window.onLectureTimeUpdate = function(index) {
    const audio = document.getElementById('lectureAudio_' + index);
    const seek = document.getElementById('lectureSeek_' + index);
    const curEl = document.getElementById('lectureCurTime_' + index);
    if (!audio || !seek || !curEl) return;
    if (audio.duration > 0) {
        seek.value = (audio.currentTime / audio.duration) * 100;
        curEl.textContent = formatLectureTime(audio.currentTime);
    }
};

window.onLectureAudioEnded = function(index) {
    const btn = document.getElementById('lectureBtn_' + index);
    if (btn) btn.textContent = '▶';
    window.currentPlayingLectureAudio = null;
    window.currentPlayingLectureBtn = null;
};

// 4️⃣ زر التحميل الأوفلاين (بنفس آلية الكاش المستخدمة في القرآن والأذان)
window.downloadLectureAudio = function(index) {
    const filtered = window.currentLectureFilter === 'all'
        ? window.lecturesData
        : window.lecturesData.filter(l => l.category === window.currentLectureFilter);
    const lecture = filtered[index];
    const statusEl = document.getElementById('lectureDlStatus_' + index);

    if (!lecture || !navigator.serviceWorker.controller) {
        if (statusEl) statusEl.textContent = 'استنى شوية وحاول تاني 🙏';
        return;
    }

    if (statusEl) statusEl.textContent = 'جاري التحميل للتخزين الدائم...';
    navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_AUDIO_URL',
        url: lecture.src,
        label: `lecture_${index}`
    });
};

navigator.serviceWorker.addEventListener('message', (event) => {
    const d = event.data;
    if (!d || !d.label || !d.label.startsWith('lecture_')) return;
    const idx = d.label.split('_')[1];
    const statusEl = document.getElementById('lectureDlStatus_' + idx);
    if (!statusEl) return;
    if (d.type === 'AUDIO_CACHED') {
        statusEl.textContent = d.alreadyCached ? '✅ محمّلة بالفعل' : '✅ تم التحميل أوفلاين';
    }
    if (d.type === 'AUDIO_CACHE_FAILED') {
        statusEl.textContent = '⚠️ فشل التحميل، تحتاج نت';
    }
});

// 5️⃣ فلترة حسب الفئة
window.filterLectures = function(category) {
    window.currentLectureFilter = category;
    document.querySelectorAll('#lecturesPage .sheikh-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'var(--card)';
        btn.style.color = 'var(--text)';
        btn.style.border = '1px solid var(--border)';
    });
    const activeBtn = document.getElementById('lectureCatBtn_' + category);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = 'var(--gold)';
        activeBtn.style.color = '#111';
        activeBtn.style.border = 'none';
    }
    renderLectures();
};

// 6️⃣ شريط تايمر النوم (بنفس فكرة التلاوات الخاشعة)
window.lecturesSleepTimeout = null;

function renderLecturesSleepTimerBar() {
    const bar = document.getElementById('lecturesSleepTimerBar');
    if (!bar) return;
    bar.innerHTML = `
      <div style="background: var(--card); border-radius: 14px; padding: 10px 14px; border: 1px solid var(--border); display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; direction:rtl;">
        <span style="font-size:13px; color:var(--text2);">⏱️ تايمر النوم (دقيقة):</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="number" id="lecturesSleepInput" value="20" min="1" max="180" style="width:60px; padding:6px; border-radius:8px; background:var(--bg2); color:var(--text); border:1px solid var(--border); text-align:center;">
          <button onclick="window.startLecturesSleepTimer()" style="background:var(--gold); color:#111; border:none; padding:7px 16px; border-radius:12px; font-family:'Amiri',serif; font-weight:bold; cursor:pointer;">بدء</button>
        </div>
      </div>
    `;
}

window.startLecturesSleepTimer = function() {
    if (window.lecturesSleepTimeout) clearTimeout(window.lecturesSleepTimeout);
    const minutes = parseInt(document.getElementById('lecturesSleepInput').value) || 20;
    window.lecturesSleepTimeout = setTimeout(() => {
        if (window.currentPlayingLectureAudio) {
            window.currentPlayingLectureAudio.pause();
            if (window.currentPlayingLectureBtn) window.currentPlayingLectureBtn.textContent = '▶';
        }
    }, minutes * 60 * 1000);
    alert(`✅ تم ضبط تايمر النوم على ${minutes} دقيقة`);
};

// 7️⃣ التشغيل التلقائي فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderLecturesSleepTimerBar();
    renderLectures();
});
