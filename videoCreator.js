// ==========================================
// 🎬 ملف صانع مقاطع الريلز والفيديوهات (videoCreator.js)
// ==========================================

// 🌊 مكتبة الفيديوهات الخلفية الثابتة (20 فيديو خالي من الحقوق جاهز للتصميم)
const vcBackgroundVideos = [
  { id: 'sea_calm', name: 'بحر هادئ', url: 'https://vjs.zencdn.net/v/oceans.mp4', thumb: '🌊' },
  { id: 'rain_window', name: 'مطر على النافذة', url: 'https://assets.mixkit.co/videos/preview/mixkit-rain-drops-on-window-water-43034-large.mp4', thumb: '🌧️' },
  { id: 'night_stars', name: 'سماء ونجوم', url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-11603-large.mp4', thumb: '✨' },
  { id: 'fast_clouds', name: 'غيوم سريعة', url: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-moving-fast-in-the-sky-34201-large.mp4', thumb: '☁️' },
  { id: 'forest_river', name: 'نهر في الغابة', url: 'https://assets.mixkit.co/videos/preview/mixkit-river-flowing-through-a-green-forest-42253-large.mp4', thumb: '🌲' },
  { id: 'foggy_mountains', name: 'جبال وضباب', url: 'https://assets.mixkit.co/videos/preview/mixkit-foggy-mountains-landscape-43257-large.mp4', thumb: '⛰️' },
  { id: 'sunset_beach', name: 'غروب البحر', url: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-a-calm-beach-42316-large.mp4', thumb: '🌅' },
  { id: 'candle_light', name: 'شموع هادئة', url: 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-flickering-in-the-dark-42211-large.mp4', thumb: '🕯️' },
  { id: 'snow_fall', name: 'تساقط الثلوج', url: 'https://assets.mixkit.co/videos/preview/mixkit-snow-falling-on-forest-trees-42352-large.mp4', thumb: '❄️' },
  { id: 'deep_space', name: 'فضاء ومجرات', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-space-background-with-nebula-43015-large.mp4', thumb: '🌌' },
  { id: 'waterfall', name: 'شلال متدفق', url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-41617-large.mp4', thumb: '🌊' },
  { id: 'desert_dunes', name: 'رمال الصحراء', url: 'https://assets.mixkit.co/videos/preview/mixkit-desert-dunes-under-a-clear-sky-42388-large.mp4', thumb: '🏜️' },
  { id: 'autumn_leaves', name: 'أوراق الخريف', url: 'https://assets.mixkit.co/videos/preview/mixkit-autumn-leaves-falling-from-trees-42410-large.mp4', thumb: '🍁' },
  { id: 'abstract_wave', name: 'تموجات ناعمة', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-blue-wave-background-43105-large.mp4', thumb: '🌀' },
  { id: 'vintage_texture', name: 'خلفية كلاسيكية', url: 'https://assets.mixkit.co/videos/preview/mixkit-vintage-film-grain-texture-42998-large.mp4', thumb: '🎞️' },
  { id: 'ocean_waves', name: 'أمواج قوية', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-42299-large.mp4', thumb: '🌊' },
  { id: 'cozy_fireplace', name: 'نار المدفأة', url: 'https://assets.mixkit.co/videos/preview/mixkit-cozy-fireplace-burning-brightly-42560-large.mp4', thumb: '🔥' },
  { id: 'underwater', name: 'تحت أعماق البحر', url: 'https://assets.mixkit.co/videos/preview/mixkit-underwater-light-beams-42880-large.mp4', thumb: '🤿' },
  { id: 'green_nature', name: 'طبيعة خضراء', url: 'https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-through-green-leaves-42650-large.mp4', thumb: '🌿' },
  { id: 'sun_rays', name: 'أشعة الشمس', url: 'https://assets.mixkit.co/videos/preview/mixkit-sun-rays-piercing-through-clouds-42710-large.mp4', thumb: '☀️' }
];

// المتغيرات الحيوية للتحكم في اللووب والحفظ
let vcIsPlaying = false;
let vcAnimationId = null;
let vcCurrentAyahText = "﴿ اضغط تشغيل لمعاينة الآيات والنصوص هنا ﴾";
let vcSurahName = "الفاتحة";
let vcReciterName = "المنشاوي";
let vcUserUploadedAudio = null;

// 🛠️ دالة تهيئة النظام وبناء الواجهة برمجياً فور تحميل الصفحة
function initVideoCreatorSystem() {
  console.log("🎬 جاري بدء تهيئة سياق نظام صانع مقاطع الريلز المخصص...");

  // بناء أزرار الفيديوهات الخلفية الـ 20 تلقائياً
  const grid = document.getElementById('videoTemplateGrid');
  if (grid) {
    grid.innerHTML = vcBackgroundVideos.map((v, idx) => `
      <div onclick="selectVcVideo('${v.url}', this)" class="cat-btn ${idx === 0 ? 'active' : ''}" style="padding: 14px 20px; font-size: 16px; text-align:center; cursor:pointer;">
        <div>${v.thumb}</div>
        <div style="font-size:10px; margin-top:4px; white-space: nowrap;">${v.name}</div>
      </div>
    `).join('');
  }

  // تعبئة قائمة السور المتوفرة بالتطبيق بالتزامن مع مصفوفة "surahs" الأساسية
  const surahSelect = document.getElementById('vcSurahSelect');
  if (surahSelect && typeof surahs !== 'undefined') {
    surahSelect.innerHTML = surahs.map(s => `<option value="${s.n}">${s.n}. سورة ${s.name}</option>`).join('');
  }

  // اختيار وتثبيت الفيديو الافتراضي الأول لبدء الإعداد
  if (vcBackgroundVideos.length > 0) {
    selectVcVideo(vcBackgroundVideos[0].url, null);
  }
}

// دالة اختيار الفيديو وتحديث مصدر تشغيله صامتاً في الخلفية
function selectVcVideo(url, element) {
  if (element) {
    document.querySelectorAll('#videoTemplateGrid .cat-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
  }
  const video = document.getElementById('bgVideoSource');
  if (video) {
    video.src = url;
    video.load();
    video.currentTime = 0;
  }
}

// تشغيل التهيئة بنعومة بعد ثانية ونصف من فتح التطبيق لضمان استقرار العناصر
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initVideoCreatorSystem, 1500);
});
