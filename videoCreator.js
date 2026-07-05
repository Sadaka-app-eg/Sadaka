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

// المتغيرات الحيوية للتحكم في اللووب والحفظ والمعاينة
let vcIsPlaying = false;
let vcAnimationId = null;
let vcCurrentAyahText = "﴿ اضغط تشغيل لمعاينة الآيات والنصوص هنا ﴾";
let vcSurahName = "الفاتحة";
let vcReciterName = "المنشاوي";
let vcUserUploadedAudio = null;

// ==========================================
// دالة مساعدة: تجيب رابط صوت القارئ المختار للسورة الحالية
// ==========================================
function vcGetReciterAudioUrl(surahNum) {
  const num3 = String(surahNum).padStart(3, '0');
  const reciterEl = document.getElementById('vcReciterSelect');
  const key = reciterEl ? reciterEl.value : 'minsh';
  const map = {
    minsh: `https://server10.mp3quran.net/minsh/${num3}.mp3`,
    husary: `https://server13.mp3quran.net/husr/${num3}.mp3`,
    afs: `https://server8.mp3quran.net/afs/${num3}.mp3`,
    basit: `https://server7.mp3quran.net/basit/${num3}.mp3`
  };
  return map[key] || map.minsh;
}

// ==========================================
// 1. دالة تهيئة النظام وبناء الواجهة برمجياً فور تحميل الصفحة
// ==========================================
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

  // جلب آيات السورة الافتراضية الأولى فور التحميل
  loadVcAyahs();
}

// ==========================================
// 2. دالة اختيار الفيديو وتحديث مصدر تشغيله صامتاً في الخلفية
// ==========================================
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
    if (vcIsPlaying) video.play().catch(e => console.log(e));
    setTimeout(updateVideoPreview, 300);
  }
}

// ==========================================
// 3. دالة الرسم المستمر وتحديث شاشة المعاينة الفورية (Live Rendering)
// ==========================================
function updateVideoPreview() {
  const canvas = document.getElementById('videoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('bgVideoSource');

  // أ. تنظيف الكانفاس ورسم لون أسود كخلفية احتياطية
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // ب. لو الفيديو شغال وجاهز، ارسم الفريم الحالي ليغطي الكانفاس بالكامل
  if (video && !video.paused && video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  } else {
    // خلفية داكنة تجميلية في حالة التوقف
    ctx.fillStyle = "rgba(11, 18, 12, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ج. طبقة تعتيم سينمائية ناعمة (Overlay) عشان النصوص تنطق وتبان بوضوح
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // د. قراءة التخصيصات الحالية من عناصر الـ HTML
  const fontChoice = document.getElementById('vcFontSelect').value;
  const textColor = document.getElementById('vcTextColor').value;
  const hasLogo = document.getElementById('vcLogoToggle').checked;

  const surahEl = document.getElementById('vcSurahSelect');
  if (surahEl && surahEl.options[surahEl.selectedIndex]) {
    vcSurahName = surahEl.options[surahEl.selectedIndex].text.split('سورة ')[1];
  }
  
  if (!vcUserUploadedAudio) {
    const reciterEl = document.getElementById('vcReciterSelect');
    vcReciterName = reciterEl.options[reciterEl.selectedIndex].text;

    // 🔊 تحديث مصدر صوت القارئ تلقائياً لو اتغير القارئ أو السورة
    const surahEl2 = document.getElementById('vcSurahSelect');
    const surahNum2 = surahEl2 ? parseInt(surahEl2.value) : 1;
    const newAudioUrl = vcGetReciterAudioUrl(surahNum2);
    const audioEl = document.getElementById('audioTrackSource');
    if (audioEl && audioEl.src !== newAudioUrl) {
      const wasPlaying = !audioEl.paused;
      audioEl.src = newAudioUrl;
      audioEl.load();
      if (wasPlaying) audioEl.play().catch(e => console.log(e));
    }
  }

  // هـ. رسم اسم السورة أعلى اليمين بخط ذهبي وقور
  ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
  ctx.font = "bold 32px 'Amiri', serif";
  ctx.textAlign = "right";
  ctx.direction = "rtl";
  ctx.fillText(`📊 سورة ${vcSurahName}`, canvas.width - 40, 70);

  // و. رسم اسم القارئ أسفل اليسار بخفوت مريح للعين
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "28px 'Amiri', serif";
  ctx.textAlign = "left";
  ctx.direction = "ltr";
  ctx.fillText(`🎙️ ${vcReciterName}`, 40, canvas.height - 70);

  // ز. رسم شعار "أثر" الصغير في زاوية الفيديو اختيارياً
  if (hasLogo) {
    ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
    ctx.font = "bold 24px 'Amiri', serif";
    ctx.textAlign = "left";
    ctx.direction = "rtl";
    ctx.fillText("✨ أثر", 40, 65);
  }

  // ح. رسم وتأطير الآيات الكريمة في منتصف الشاشة مع ميزة تفنيط الأسطر تلقائياً
  ctx.fillStyle = textColor;
  ctx.font = `bold 42px ${fontChoice}`;
  ctx.textAlign = "center";
  ctx.direction = "rtl";
  
  wrapText(ctx, vcCurrentAyahText, canvas.width / 2, canvas.height / 2 - 40, 640, 65);
}

// ==========================================
// 4. دالة مساعدة لتقطيع النصوص لأسطر (Auto-Wrap) وضبطها في المنتصف العمودي
// ==========================================
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // حساب الارتفاع الكلي للأسطر لسنترتها عمودياً بالملي
  y = y - ((lines.length - 1) * lineHeight) / 2;

  for (let k = 0; k < lines.length; k++) {
    ctx.fillText(lines[k], x, y);
    y += lineHeight;
  }
}

// ==========================================
// 5. دالة مفتاح تشغيل وإيقاف حلقة الأنيميشن (Animation Loop) للمعاينة
// ==========================================
function toggleVideoPreviewPlay() {
  const video = document.getElementById('bgVideoSource');
  const btn = document.getElementById('vcPlayBtn');
  const audioEl = document.getElementById('audioTrackSource');

  if (vcIsPlaying) {
    vcIsPlaying = false;
    if (video) video.pause();
    if (audioEl) audioEl.pause();
    if (btn) btn.textContent = "▶ تشغيل المعاينة";
    cancelAnimationFrame(vcAnimationId);
  } else {
    vcIsPlaying = true;
    if (video) video.play().catch(e => console.log(e));
    if (audioEl) {
      if (!audioEl.src) updateVideoPreview();
      audioEl.play().catch(e => console.log(e));
    }
    if (btn) btn.textContent = "⏸ إيقاف المعاينة";
    
    // إطلاق اللووب الرندري لطلب الفريمات باستمرار من المتصفح دون تهنيج
    function renderLoop() {
      if (!vcIsPlaying) return;
      updateVideoPreview();
      vcAnimationId = requestAnimationFrame(renderLoop);
    }
    vcAnimationId = requestAnimationFrame(renderLoop);
  }
}

// دالة معالجة رفع الصوت الخارجي لتجهيز المسار
function handleUserAudioUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  vcUserUploadedAudio = URL.createObjectURL(file);
  document.getElementById('userAudioStatus').style.display = 'flex';
  document.getElementById('vcReciterSelect').disabled = true;
  vcReciterName = "صوت خارجي مخصص";
  
  const audio = document.getElementById('audioTrackSource');
  if (audio) {
    audio.src = vcUserUploadedAudio;
    audio.load();
  }
  updateVideoPreview();
}

// دالة إلغاء الصوت المخصص والرجوع لاختيار القارئ من القائمة
function clearVcUserAudio() {
  vcUserUploadedAudio = null;
  document.getElementById('userAudioStatus').style.display = 'none';
  document.getElementById('vcReciterSelect').disabled = false;
  document.getElementById('vcUserAudioInput').value = '';
  updateVideoPreview();
}

// ==========================================
// 6. دالة جلب نصوص الآيات الحقيقية المحددة من الـ API وتحديث النطاق
// ==========================================
async function loadVcAyahs() {
  const surahNum = parseInt(document.getElementById('vcSurahSelect').value);
  const startAyah = parseInt(document.getElementById('vcAyahStart').value) || 1;
  const endAyah = parseInt(document.getElementById('vcAyahEnd').value) || 5;
  
  if (!surahNum) return;

  try {
    // جلب نص السورة عثماني نظيف من الـ API المشترك عندك
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
    const data = await res.json();
    
    if (data.code === 200 && data.data && data.data.ayahs) {
      const ayahsArray = data.data.ayahs;
      
      // فلترة الآيات بناءً على النطاق المطلوب (من .. إلى)
      const selectedAyahs = ayahsArray.filter(a => a.numberInSurah >= startAyah && a.numberInSurah <= endAyah);
      
      if (selectedAyahs.length > 0) {
        // دمج الآيات المختارة في نص واحد مجمع ليظهر داخل كادر الفيديو
        vcCurrentAyahText = selectedAyahs.map(a => `${a.text} ﴿${toAr(a.numberInSurah)}﴾`).join(' ');
      } else {
        vcCurrentAyahText = "﴿ نطاق الآيات المختار غير موجود في هذه السورة ﴾";
      }
    }
  } catch (error) {
    console.error("خطأ أثناء جلب آيات صانع الفيديو:", error);
    vcCurrentAyahText = "﴿ تحتاج اتصال بالإنترنت لجلب نصوص الآيات 🌐 ﴾";
  }
  updateVideoPreview();
}

// ==========================================
// 7. الدالة العملاقة لدمج التراكات وتصدير وحفظ فيديو الريلز النهائي (MP4)
// ==========================================
function generateFinalVideo() {
  const canvas = document.getElementById('videoCanvas');
  const videoSource = document.getElementById('bgVideoSource');
  const statusEl = document.getElementById('vcExportStatus');
  
  if (!canvas || !videoSource) return;
  
  // أ. ضبط أبعاد التصدير الحقيقية بناءً على اختيار الدقة (720p أو 1080p)
  const targetRes = parseInt(document.getElementById('vcResolutionSelect').value);
  if (targetRes === 1080) {
    canvas.width = 1080;
    canvas.height = 1920;
  } else {
    canvas.width = 720;
    canvas.height = 1280;
  }

  // إظهار شريط التحميل والـ Loader للمستخدم
  statusEl.style.display = "block";
  updateVideoPreview();

  // ب. التقاط البث المباشر من لوحة الكانفاس بمعدل 30 فريم ثابت
  const videoStream = canvas.captureStream(30);
  let recordedChunks = [];

  // 🔊 دمج صوت القارئ/الملف المرفوع في نفس تيار التسجيل
  const audioEl = document.getElementById('audioTrackSource');
  if (audioEl && typeof audioEl.captureStream === 'function') {
    try {
      const audioStream = audioEl.captureStream();
      audioStream.getAudioTracks().forEach(track => videoStream.addTrack(track));
    } catch (audioErr) {
      console.warn("تعذر دمج الصوت:", audioErr);
    }
  }
  
  // تظبيط الميم تايب المتوافق مع المواصفات لأعلى جودة وضغط خفيف
  let options = { mimeType: 'video/webm;codecs=vp9,opus' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/webm;codecs=vp8,opus' };
  }
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/mp4' };
  }

  try {
    const mediaRecorder = new MediaRecorder(videoStream, options);
    
    mediaRecorder.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function() {
      // إيقاف حلقة الرندر والصوت بعد انتهاء التسجيل مباشرة
      vcIsPlaying = false;
      cancelAnimationFrame(vcAnimationId);
      if (audioEl) audioEl.pause();

      // ج. تحويل البيانات المسجلة إلى ملف فيديو حقيقي قابل للتحميل والدفق
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      const videoURL = URL.createObjectURL(blob);
      
      // د. إنشاء رابط تحميل وهمي وضغط زر التحميل صامتاً في جهاز المستخدم
      const downloadLink = document.createElement('a');
      downloadLink.href = videoURL;
      downloadLink.download = `Athar_Reels_${vcSurahName || 'Quran'}.mp4`;
      downloadLink.click();
      
      // إخفاء الـ Loader وإرجاع الأبعاد الأصلية لشاشة المعاينة المستقرة
      statusEl.style.display = "none";
      alert("🎉 ألف مبروك يا هندسة! تم إنشاء مقطع الريلز الإسلامي الاحترافي وحفظه في معرض الصور بجهازك بنجاح كلي! ✨");
      
      canvas.width = 720;
      canvas.height = 1280;
      updateVideoPreview();
    };

    // هـ. بدء المحرك الفعلي للتسجيل وتشغيل الفيديو والصوت بشكل تزامني
    mediaRecorder.start();
    if (videoSource.paused) videoSource.play().catch(e => console.log(e));
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play().catch(e => console.log(e));
    }

    // و. تشغيل حلقة رسم مستمرة أثناء التسجيل لضمان تحديث الكانفاس فريم بفريم
    vcIsPlaying = true;
    (function exportRenderLoop() {
      if (!vcIsPlaying) return;
      updateVideoPreview();
      vcAnimationId = requestAnimationFrame(exportRenderLoop);
    })();
    
    // ز. مدة دقيقة ونصف كحد أقصى للريلز (90 ثانية) ومن ثم الإغلاق الآمن والتصدير
    // وضعنا هنا 15 ثانية للتجربة السريعة الفورية، وتقدر ترفع الرقم يدوياً حسب الرغبة
    setTimeout(() => {
      mediaRecorder.stop();
    }, 15000); 

  } catch (error) {
    console.error("أزمة في معالج تصدير وتركيب الفيديو:", error);
    statusEl.style.display = "none";
    alert("عذراً، المتصفح يحتاج إذن تحديث لتصدير واستخراج ملفات الفيديو مباشرة على جهازك 😔");
  }
}

// تشغيل التهيئة بنعومة بعد ثانية ونصف من فتح التطبيق لضمان استقرار العناصر
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initVideoCreatorSystem, 1500);
});
