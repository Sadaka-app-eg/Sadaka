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

// 🔊 حالة قائمة تشغيل الآيات المحددة (Ayah Queue)
let vcSelectedAyahsData = [];   // [{ numberInSurah, globalNumber }, ...] للنطاق المختار فقط
let vcAyahQueueUrls = [];       // روابط صوت كل آية بالترتيب
let vcAyahQueueIndex = 0;
let vcQueueOnComplete = null;

// 🎧 متغيرات الـ AudioContext لضمان التقاط جودة صوت حقيقية وبدون مشاكل متصفحات
let vcAudioCtx = null;
let vcAudioSourceNode = null;
let vcAudioDestinationNode = null;

// ==========================================
// دالة مساعدة: تجيب رابط صوت آية واحدة بعينها حسب القارئ المختار
// ==========================================
function vcGetAyahAudioUrl(globalAyahNumber) {
  const reciterEl = document.getElementById('vcReciterSelect');
  const key = reciterEl ? reciterEl.value : 'minsh';
  const map = {
    minsh: 'ar.minshawi',
    husary: 'ar.husary',
    afs: 'ar.alafasy',
    basit: 'ar.abdulbasitmurattal'
  };
  const apiId = map[key] || map.minsh;
  const originalUrl = `https://cdn.islamic.network/quran/audio/128/${apiId}/${globalAyahNumber}.mp3`;
  
  // 🔗 نمرر الرابط عبر الـ proxy بتاعنا عشان يضيفله هيدر CORS
  return `https://quran-audio-proxy.ahmedmohamedhosny100.workers.dev/?url=${encodeURIComponent(originalUrl)}`;
}

// ==========================================
// بناء قائمة روابط الآيات المحددة (من - إلى) بالقارئ الحالي
// ==========================================
function vcBuildAyahQueue() {
  vcAyahQueueUrls = vcSelectedAyahsData.map(a => vcGetAyahAudioUrl(a.globalNumber));
  vcAyahQueueIndex = 0;
}

// ==========================================
// تشغيل قائمة الآيات المحددة واحدة ورا التانية، والتوقف تلقائياً بعد آخر آية
// ==========================================
function vcStartAyahPlayback(onComplete) {
  const audioEl = document.getElementById('audioTrackSource');
  if (!audioEl) return;

  // ✅ تفعيل الـ CORS برمجياً على عنصر الـ Audio ليتوافق مع الـ Proxy
  audioEl.crossOrigin = "anonymous";

  vcBuildAyahQueue();
  vcQueueOnComplete = onComplete || null;

  if (vcAyahQueueUrls.length === 0) {
    if (vcQueueOnComplete) vcQueueOnComplete();
    return;
  }

  audioEl.onended = vcPlayNextQueuedAyah;

  function playAyahAtCurrentIndex() {
    if (vcAyahQueueIndex >= vcAyahQueueUrls.length) {
      if (vcQueueOnComplete) vcQueueOnComplete();
      return;
    }
    audioEl.src = vcAyahQueueUrls[vcAyahQueueIndex];
    audioEl.load();
    audioEl.play().catch(e => console.log("خطأ تشغيل الصوت:", e));
  }

  // نخزنها عالمياً عشان onended يقدر يستدعيها تاني
  window.__vcPlayAyahAtCurrentIndex = playAyahAtCurrentIndex;
  playAyahAtCurrentIndex();
}

function vcPlayNextQueuedAyah() {
  vcAyahQueueIndex++;
  if (typeof window.__vcPlayAyahAtCurrentIndex === 'function') {
    window.__vcPlayAyahAtCurrentIndex();
  }
}

function vcStopAyahPlayback() {
  const audioEl = document.getElementById('audioTrackSource');
  if (audioEl) {
    audioEl.onended = null;
    audioEl.pause();
  }
  vcAyahQueueIndex = 0;
  vcQueueOnComplete = null;
}

// ==========================================
// 1. دالة تهيئة النظام وبناء الواجهة برمجياً فور تحميل الصفحة
// ==========================================
function initVideoCreatorSystem() {
  console.log("🎬 جاري بدء تهيئة سياق نظام صانع مقاطع الريلز المخصص...");

  const grid = document.getElementById('videoTemplateGrid');
  if (grid) {
    grid.innerHTML = vcBackgroundVideos.map((v, idx) => `
      <div onclick="selectVcVideo('${v.url}', this)" class="cat-btn ${idx === 0 ? 'active' : ''}" style="padding: 14px 20px; font-size: 16px; text-align:center; cursor:pointer;">
        <div>${v.thumb}</div>
        <div style="font-size:10px; margin-top:4px; white-space: nowrap;">${v.name}</div>
      </div>
    `).join('');
  }

  const surahSelect = document.getElementById('vcSurahSelect');
  if (surahSelect && typeof surahs !== 'undefined') {
    surahSelect.innerHTML = surahs.map(s => `<option value="${s.n}">${s.n}. سورة ${s.name}</option>`).join('');
  }

  if (vcBackgroundVideos.length > 0) {
    selectVcVideo(vcBackgroundVideos[0].url, null);
  }

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

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (video && !video.paused && video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "rgba(11, 18, 12, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  }

  ctx.fillStyle = "rgba(212, 175, 55, 0.9)";
  ctx.font = "bold 32px 'Amiri', serif";
  ctx.textAlign = "right";
  ctx.direction = "rtl";
  ctx.fillText(`📊 سورة ${vcSurahName}`, canvas.width - 40, 70);

  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "28px 'Amiri', serif";
  ctx.textAlign = "left";
  ctx.direction = "ltr";
  ctx.fillText(`🎙️ ${vcReciterName}`, 40, canvas.height - 70);

  if (hasLogo) {
    ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
    ctx.font = "bold 24px 'Amiri', serif";
    ctx.textAlign = "left";
    ctx.direction = "rtl";
    ctx.fillText("✨ أثر", 40, 65);
  }

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
    vcStopAyahPlayback();
    if (audioEl) audioEl.pause();
    if (btn) btn.textContent = "▶ تشغيل المعاينة";
    cancelAnimationFrame(vcAnimationId);
  } else {
    vcIsPlaying = true;
    if (video) video.play().catch(e => console.log(e));
    if (btn) btn.textContent = "⏸ إيقاف المعاينة";

    if (vcUserUploadedAudio) {
      if (audioEl) {
        audioEl.crossOrigin = "anonymous";
        audioEl.onended = null;
        audioEl.play().catch(e => console.log(e));
      }
    } else {
      vcStartAyahPlayback(() => {
        vcIsPlaying = false;
        if (video) video.pause();
        if (btn) btn.textContent = "▶ تشغيل المعاينة";
        cancelAnimationFrame(vcAnimationId);
      });
    }
    
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
    audio.crossOrigin = "anonymous";
    audio.onended = null;
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

  if (vcIsPlaying) {
    toggleVideoPreviewPlay();
  }

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
    const data = await res.json();
    
    if (data.code === 200 && data.data && data.data.ayahs) {
      const ayahsArray = data.data.ayahs;
      const selectedAyahs = ayahsArray.filter(a => a.numberInSurah >= startAyah && a.numberInSurah <= endAyah);
      
      if (selectedAyahs.length > 0) {
        vcCurrentAyahText = selectedAyahs.map(a => `${a.text} ﴿${a.numberInSurah}﴾`).join(' ');

        vcSelectedAyahsData = selectedAyahs.map(a => ({
          numberInSurah: a.numberInSurah,
          globalNumber: a.number
        }));
      } else {
        vcCurrentAyahText = "﴿ نطاق الآيات المختار غير موجود في هذه السورة ﴾";
        vcSelectedAyahsData = [];
      }
    }
  } catch (error) {
    console.error("خطأ أثناء جلب آيات صانع الفيديو:", error);
    vcCurrentAyahText = "﴿ تحتاج اتصال بالإنترنت لجلب نصوص الآيات 🌐 ﴾";
    vcSelectedAyahsData = [];
  }
  updateVideoPreview();
}

// ==========================================
// 7. 🌟 الدالة العملاقة للتصدير مضافاً إليها محرك الـ AudioContext لحل أزمة كتم الصوت
// ==========================================
function generateFinalVideo() {
  const canvas = document.getElementById('videoCanvas');
  const videoSource = document.getElementById('bgVideoSource');
  const statusEl = document.getElementById('vcExportStatus');
  const audioEl = document.getElementById('audioTrackSource');
  
  if (!canvas || !videoSource || !audioEl) return;
  
  // ضبط أبعاد التصدير
  const targetRes = parseInt(document.getElementById('vcResolutionSelect').value);
  if (targetRes === 1080) {
    canvas.width = 1080;
    canvas.height = 1920;
  } else {
    canvas.width = 720;
    canvas.height = 1280;
  }

  statusEl.style.display = "block";
  updateVideoPreview();

  // تأكيد تفعيل CORS على الصوت قبل أي معالجة لتفادي غلق الكانفاس أمنياً
  audioEl.crossOrigin = "anonymous";

  // أ. التقاط بث الكانفاس الصوري
  const videoStream = canvas.captureStream(30);
  const finalStream = new MediaStream();

  // تمرير تراكات الصور للبث النهائي
  videoStream.getVideoTracks().forEach(track => finalStream.addTrack(track));

  // ب. 🌟 استخدام Web Audio API لالتقاط وتوجيه مسار الصوت بأمان للتسجيل
  try {
    if (!vcAudioCtx) {
      vcAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      vcAudioSourceNode = vcAudioCtx.createMediaElementSource(audioEl);
      vcAudioDestinationNode = vcAudioCtx.createMediaStreamDestination();
      
      // ربط المسار: المصدر يذهب لوجهة التسجيل + يذهب لسماعات الكمبيوتر/الموبايل معاً
      vcAudioSourceNode.connect(vcAudioDestinationNode);
      vcAudioSourceNode.connect(vcAudioCtx.destination);
    }
    
    // استخراج تراك الصوت الفعلي ودمجه مع تيار التسجيل
    const destStream = vcAudioDestinationNode.stream;
    destStream.getAudioTracks().forEach(track => finalStream.addTrack(track));
    
    if (vcAudioCtx.state === 'suspended') {
      vcAudioCtx.resume();
    }
  } catch (audioContextErr) {
    console.warn("تنبيه الـ AudioContext (قد يكون تم إنشاؤه مسبقاً):", audioContextErr);
    // حل احتياطي سريع في حال حدوث خطأ
    if (typeof audioEl.captureStream === 'function') {
      try {
        const fallbackStream = audioEl.captureStream();
        fallbackStream.getAudioTracks().forEach(track => finalStream.addTrack(track));
      } catch (e) { console.error(e); }
    }
  }

  let recordedChunks = [];
  
  // صيغ دمج وفك ضغط الفيديو المتوفرة بالمتصفح
  let options = { mimeType: 'video/webm;codecs=vp9,opus' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/webm;codecs=vp8,opus' };
  }
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/mp4;codecs=h264,aac' };
  }
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    options = { mimeType: 'video/mp4' };
  }

  try {
    const mediaRecorder = new MediaRecorder(finalStream, options);
    let safetyTimeoutId = null;
    
    mediaRecorder.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function() {
      vcIsPlaying = false;
      cancelAnimationFrame(vcAnimationId);
      vcStopAyahPlayback();
      if (audioEl) audioEl.pause();
      if (safetyTimeoutId) clearTimeout(safetyTimeoutId);

      const actualMime = mediaRecorder.mimeType || options.mimeType;
      const isWebm = actualMime.includes('webm');
      const blob = new Blob(recordedChunks, { type: actualMime });
      const videoURL = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = videoURL;
      downloadLink.download = `Athar_Reels_${vcSurahName || 'Quran'}.${isWebm ? 'webm' : 'mp4'}`;
      downloadLink.click();

      statusEl.style.display = "none";
      alert("🎉 ألف مبروك ! تم إنشاء مقطع الريلز الإسلامي وحفظه بنجاح مع الصوت ! ✨");

      canvas.width = 720;
      canvas.height = 1280;
      updateVideoPreview();
    };
    
    mediaRecorder.start();
    if (videoSource.paused) videoSource.play().catch(e => console.log(e));

    if (vcUserUploadedAudio) {
      audioEl.currentTime = 0;
      audioEl.onended = () => { if (mediaRecorder.state !== 'inactive') mediaRecorder.stop(); };
      audioEl.play().catch(e => console.log(e));
    } else {
      vcStartAyahPlayback(() => {
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      });
    }

    vcIsPlaying = true;
    (function exportRenderLoop() {
      if (!vcIsPlaying) return;
      updateVideoPreview();
      vcAnimationId = requestAnimationFrame(exportRenderLoop);
    })();
    
    safetyTimeoutId = setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    }, 90000);

  } catch (error) {
    console.error("أزمة في معالج تصدير وتركيب الفيديو:", error);
    statusEl.style.display = "none";
    alert("عذراً، المتصفح واجه مشكلة أثناء التصدير المباشر للفيديو 😔");
  }
}

// تشغيل التهيئة بنعومة بعد ثانية ونصف من فتح التطبيق لضمان استقرار العناصر
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initVideoCreatorSystem, 1500);
});
