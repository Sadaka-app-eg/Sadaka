// 1️⃣ مصفوفة الداتا الخاصة بالمواعظ والدروس من مجلد audio2
window.lecturesData = [
    {
        title: "الموعظة الأولى",
        speaker: "اسم الشيخ",
        src: "audio/audio2/mo3za1.mp3"
    }
];

// 2️⃣ فانكشن ضخ الصوتيات جوة حاوية الصفحة الجديدة
function renderLectures() {
    const listEl = document.getElementById('lecturesList');
    if (!listEl || !window.lecturesData) return;
    
    listEl.innerHTML = window.lecturesData.map((lecture, index) => {
        return `
            <div class="audio-item">
                <div class="audio-info">
                    <h4>${lecture.title}</h4>
                    <p>${lecture.speaker}</p>
                </div>
                <button class="play-btn" onclick="playAudioSystem('${lecture.src}', this)">▶️ تشغيل</button>
            </div>
        `;
    }).join('');
}

// 3️⃣ تشغيل الضخ تلقائياً بعد تحميل هيكل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderLectures();
});
