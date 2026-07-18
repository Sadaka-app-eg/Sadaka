// 1️⃣ المصفوفة اللي فيها الداتا والأصوات من مجلد audio2
window.lecturesData = [
    {
        title: "الموعظة الأولى",
        speaker: "اسم الشيخ",
        src: "audio/audio2/mo3za1.mp3"
    }
];

// 2️⃣ الفانكشن اللي بتضخ الصوتيات في صفحة الـ HTML
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

// 3️⃣ الأمان: بنقول للمتصفح استنى لما الـ HTML يحمل بالكامل وبعدين ضخ المواعظ
document.addEventListener('DOMContentLoaded', () => {
    renderLectures();
});
