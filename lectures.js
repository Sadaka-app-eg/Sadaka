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

function formatLectureTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderLectures() {
    const listEl = document.getElementById('lecturesList');
    if (!listEl) return;

    let filtered = window.currentLectureFilter === 'all'
        ? [...window.lecturesData]
        : window.lecturesData.filter(l => l.category === window.currentLectureFilter);

    const pinnedList = JSON.parse(localStorage.getItem('pinned_lectures') || '[]');
    filtered.sort((a, b) => {
        const aPinned = pinnedList.includes(a.title) ? 1 : 0;
        const bPinned = pinnedList.includes(b.title) ? 1 : 0;
        return bPinned - aPinned;
    });

    listEl.innerHTML = filtered.map((lecture, index) => {
        const isPinned = pinnedList.includes(lecture.title);
        return `
        <div style="background: var(--card); border-radius: 16px; padding: 14px; border: 1px solid var(--border); direction: rtl; margin-bottom:10px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px; flex:1;">
              <button onclick="window.togglePinLecture('${lecture.title}')" style="background:transparent; border:none; color:${isPinned ? 'var(--gold)' : 'var(--text2)'}; font-size:16px; cursor:pointer; padding:0; margin-left:4px;">${isPinned ? '📌' : '📍'}</button>
              <span style="font-family:'Amiri',serif; font-size:15px; color:var(--text); line-height:1.6;">${lecture.title}</span>
            </div>
            <button class="play-btn" id="lectureBtn_${index}" onclick="window.toggleLectureAudio(${index})" style="background:var(--gold); color:#111; border:none; width:34px; height:34px; border-radius:50%; font-size:14px; cursor:pointer;">▶</button>
            <button id="lectureDlBtn_${index}" onclick="window.downloadLectureAudio(${index})" style="background:var(--bg2); color:var(--gold); border:1px solid var(--border); width:34px; height:34px; border-radius:50%; font-size:14px; cursor:pointer;">⬇️</button>
          </div>
          <div style="margin-top:10px;">
            <input type="range" id="lectureSeek_${index}" value="0" min="0" max="100" step="0.1" oninput="window.seekLectureAudio(${index}, this.value)" style="width:100%; accent-color:var(--gold); cursor:pointer; height:4px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text2); direction:ltr; margin-top:4px;">
              <span id="lectureCurTime_${index}">0:00</span>
              <span id="lectureTotalTime_${index}">--:--</span>
            </div>
          </div>
          <div id="lectureDlStatus_${index}" style="font-size:10px; color:var(--text2); margin-top:6px; text-align:center;"></div>
<audio id="lectureAudio_${index}" src="${lecture.src}" preload="metadata" onended="window.onLectureAudioEnded(${index})" onloadedmetadata="window.onLectureMetaLoaded(${index})" ontimeupdate="window.onLectureTimeUpdate(${index})"></audio>
</div>`;
    }).join('');
}

window.togglePinLecture = function(title) {
    let pinned = JSON.parse(localStorage.getItem('pinned_lectures') || '[]');
    if (pinned.includes(title)) pinned = pinned.filter(t => t !== title);
    else pinned.push(title);
    localStorage.setItem('pinned_lectures', JSON.stringify(pinned));
    renderLectures();
};

window.toggleLectureAudio = function(index) {
    const audio = document.getElementById('lectureAudio_' + index);
    const btn = document.getElementById('lectureBtn_' + index);
    if (!audio || !btn) return;
    if (window.currentPlayingLectureAudio && window.currentPlayingLectureAudio !== audio) {
        window.currentPlayingLectureAudio.pause();
        if (window.currentPlayingLectureBtn) window.currentPlayingLectureBtn.textContent = '▶';
    }
    if (audio.paused) {
        audio.play().then(() => {
            btn.textContent = '⏸';
            window.currentPlayingLectureAudio = audio;
            window.currentPlayingLectureBtn = btn;
        });
    } else {
        audio.pause();
        btn.textContent = '▶';
    }
};

window.downloadLectureAudio = function(index) {
    const lecture = window.lecturesData[index];
    const statusEl = document.getElementById('lectureDlStatus_' + index);
    if (!lecture || !navigator.serviceWorker.controller) return;
    statusEl.textContent = 'جاري التحميل...';
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_AUDIO_URL', url: lecture.src, label: 'rare_' + lecture.src });
};

navigator.serviceWorker.addEventListener('message', (event) => {
    const d = event.data;
    if (!d || !d.label || !d.label.startsWith('rare_')) return;
    const url = d.label.replace('rare_', '');
    const idx = window.lecturesData.findIndex(l => l.src === url);
    const statusEl = document.getElementById('lectureDlStatus_' + idx);
    if (statusEl) statusEl.textContent = d.type === 'AUDIO_CACHED' ? '✅ تم التحميل أوفلاين' : '⚠️ فشل التحميل';
});

// تايمر النوم
window.startLecturesSleepTimer = function() {
    if (window.lecturesSleepTimeout) clearTimeout(window.lecturesSleepTimeout);
    const minutes = parseInt(document.getElementById('lecturesSleepInput').value) || 20;
    window.lecturesSleepTimeout = setTimeout(() => {
        if (window.currentPlayingLectureAudio) {
            window.currentPlayingLectureAudio.pause();
            if (window.currentPlayingLectureBtn) window.currentPlayingLectureBtn.textContent = '▶';
        }
    }, minutes * 60 * 1000);
    alert(`✅ تم ضبط التايمر على ${minutes} دقيقة`);
};

document.addEventListener('DOMContentLoaded', () => { renderLectures(); });
