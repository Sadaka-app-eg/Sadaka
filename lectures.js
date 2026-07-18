// 1️⃣ مصفوفة المواعظ والدروس مشاورة على مجلد audio2 بالترتيب
window.lecturesData = [
    { title: "سلم نفسك للوحي ، والقرآن كفيل أن يصلح كل شيء في حياتك", src: "audio/audio2/le_1.mp3" },
    { title: "اسمع بقلبك", src: "audio/audio2/le_2.mp3" },
    { title: "وصايا للشباب _ الشيخ عبدالرزاق البدر", src: "audio/audio2/le_3.mp3" },
    { title: "انت مِبتِحظش قرآن ليه ؟", src: "audio/audio2/le_4.mp3" },
    { title: "كيف يرضى الله عنك ؟", src: "audio/audio2/le_5.mp3" },
    { title: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", src: "audio/audio2/le_6.mp3" }, // 👈 الآية الكريمة فقط هي المشكلة
    { title: "لا تلوم نفسك", src: "audio/audio2/le_7.mp3" },
    { title: "لا تحزن إن الله يدبر أمرك", src: "audio/audio2/le_8.mp3" },
    { title: "من مهالك الرجال .. احذر المهلكة الأولى", src: "audio/audio2/le_9.mp3" },
    { title: "الراحة الحقيقية... أين نجدها ؟", src: "audio/audio2/le_10.mp3" }
];

// 2️⃣ فانكشن ضخ الصوتيات جوة صفحة الـ HTML
function renderLectures() {
    const listEl = document.getElementById('lecturesList');
    if (!listEl || !window.lecturesData) return;
    
    listEl.innerHTML = window.lecturesData.map((lecture, index) => {
        return `
            <div class="audio-item">
                <div class="audio-info">
                    <h4 style="font-family: 'Amiri', serif; font-size: 18px; line-height: 1.6; margin: 0; padding-left: 10px;">${lecture.title}</h4>
                </div>
              <button class="play-btn" onclick="window.playRare('${lecture.src}')">▶️ تشغيل</button>
            </div>
        `;
    }).join('');
}

// 3️⃣ التشغيل التلقائي فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderLectures();
});
