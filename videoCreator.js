// ==========================================
// 🎬 ملف صانع مقاطع الريلز والفيديوهات (videoCreator.js)
// ==========================================

// روابط فيديوهات مباشرة وتدعم الـ CORS بالكامل لعدم تلوين الكانفاس بالأسود
const vcBackgroundVideos = [
  { id: 'sea_calm', name: 'بحر هادئ', url: 'https://vjs.zencdn.net/v/oceans.mp4', thumb: '🌊' },
  { id: 'nature_test', name: 'طبيعة غناء', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumb: '🌿' },
  { id: 'clouds_test', name: 'غيوم متحركة', url: 'https://www.w3schools.com/html/movie.mp4', thumb: '☁️' }
];

let vcIsPlaying = false;
let vcAnimationId = null;
let vcCurrentAyahText = "﴿ اضغط تشغيل لمعاينة الآيات والنصوص هنا ﴾";
let vcSurahName = "الفاتحة";
let vcReciterName = "المنشاوي";
let vcUserUploadedAudio = null;

function initVideoCreatorSystem() {
  console.log("🎬 جاري بدء تهيئة سياق نظام صانع مقاطع الريلز المخصص...");

  const grid = document.getElementById('videoTemplateGrid');
  if (grid) {
    grid.innerHTML = vcBackgroundVideos.map((v, idx) => `
      <div onclick="selectVcVideo('${v.url}', this)" class="cat-btn ${idx === 0 ? 'active' : ''}" style="padding: 10px 14px; font-size: 14px; text-align:center; cursor:pointer;">
        <div>${v.thumb}</div>
        <div style="font-size:11px; margin-top:4px; white-space: nowrap;">${v.name}</div>
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

function selectVcVideo(url, element) {
  if (element) {
    document.querySelectorAll('#videoTemplateGrid .cat-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
  }
  const video = document.getElementById('bgVideoSource');
  if (video) {
    video.removeAttribute('src'); 
    video.load();
    video.setAttribute('crossOrigin', 'anonymous'); // كسر الحماية للأمان
    video.src = url;
    video.load();
    video.currentTime = 0;
    video.onprepared = () => { if (vcIsPlaying) video.play(); };
  }
}

function updateVideoPreview() {
  const canvas = document.getElementById('videoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('bgVideoSource');

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  try {
    if (video && !video.paused && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "rgba(20, 30, 22, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } catch(e) {
    // حل بديل في حال رفض المتصفح فريم الفيديو مؤقتاً
    ctx.fillStyle = "#121e14";
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

function toggleVideoPreviewPlay() {
  const video = document.getElementById('bgVideoSource');
  const btn = document.getElementById('vcPlayBtn');
  
  if (vcIsPlaying) {
    vcIsPlaying = false;
    if (video) video.pause();
    if (btn) btn.textContent = "▶ تشغيل المعاينة";
    cancelAnimationFrame(vcAnimationId);
  } else {
    vcIsPlaying = true;
    if (video) video.play().catch(e => console.log(e));
    if (btn) btn.textContent = "⏸ إيقاف المعاينة";
    
    function renderLoop() {
      if (!vcIsPlaying) return;
      updateVideoPreview();
      vcAnimationId = requestAnimationFrame(renderLoop);
    }
    vcAnimationId = requestAnimationFrame(renderLoop);
  }
}

function handleUserAudioUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  vcUserUploadedAudio = URL.createObjectURL(file);
  document.getElementById('userAudioStatus').style.display = 'block';
  document.getElementById('vcReciterSelect').disabled = true;
  vcReciterName = "صوت خارجي مخصص";
  
  const audio = document.getElementById('audioTrackSource');
  if (audio) {
    audio.src = vcUserUploadedAudio;
    audio.load();
  }
  updateVideoPreview();
}

async function loadVcAyahs() {
  const surahSelect = document.getElementById('vcSurahSelect');
  if(!surahSelect || !surahSelect.value) return;
  
  const surahNum = parseInt(surahSelect.value);
  const startAyah = parseInt(document.getElementById('vcAyahStart').value) || 1;
  const endAyah = parseInt(document.getElementById('vcAyahEnd').value) || 5;

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`);
    const data = await res.json();
    
    if (data.code === 200 && data.data && data.data.ayahs) {
      const selectedAyahs = data.data.ayahs.filter(a => a.numberInSurah >= startAyah && a.numberInSurah <= endAyah);
      if (selectedAyahs.length > 0) {
        vcCurrentAyahText = selectedAyahs.map(a => `${a.text} ﴿${toAr(a.numberInSurah)}﴾`).join(' ');
      } else {
        vcCurrentAyahText = "﴿ نطاق الآيات غير صحيح ﴾";
      }
    }
  } catch (error) {
    vcCurrentAyahText = "﴿ خطأ في جلب الآيات، تأكد من الإنترنت 🌐 ﴾";
  }
  updateVideoPreview();
}

function generateFinalVideo() {
  const canvas = document.getElementById('videoCanvas');
  const videoSource = document.getElementById('bgVideoSource');
  const statusEl = document.getElementById('vcExportStatus');
  
  if (!canvas || !videoSource) return;
  
  const targetRes = parseInt(document.getElementById('vcResolutionSelect').value);
  canvas.width = targetRes === 1080 ? 1080 : 720;
  canvas.height = targetRes === 1080 ? 1920 : 1280;

  statusEl.style.display = "block";
  updateVideoPreview();

  // التقاط دفق الفيديو من الكانفاس
  const videoStream = canvas.captureStream(30);
  let recordedChunks = [];
  
  let options = { mimeType: 'video/webm;codecs=vp9,opus' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm;codecs=vp8,opus' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/mp4' };

  try {
    const mediaRecorder = new MediaRecorder(videoStream, options);
    
    mediaRecorder.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = function() {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      const videoURL = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = videoURL;
      downloadLink.download = `Athar_Reels_${vcSurahName || 'Quran'}.mp4`;
      downloadLink.click();
      
      statusEl.style.display = "none";
      alert("🎉 تم إنشاء مقطع الريلز وحفظه بنجاح كامل على جهازك! ✨");
      
      canvas.width = 720;
      canvas.height = 1280;
      updateVideoPreview();
    };

    // تشغيل كود الأنيميشن الإجباري أثناء فترة التسجيل لضمان الحركة
    vcIsPlaying = true;
    videoSource.play().catch(() => {});
    mediaRecorder.start();
    
    function recordRenderLoop() {
      if (!statusEl.style.display || statusEl.style.display === "none") return;
      updateVideoPreview();
      requestAnimationFrame(recordRenderLoop);
    }
    requestAnimationFrame(recordRenderLoop);

    // تسجيل مدة 10 ثوانٍ كاملة ومضمونة للتأكد من ثبات الفيديو وصناعته
    setTimeout(() => {
      mediaRecorder.stop();
    }, 10000); 

  } catch (error) {
    statusEl.style.display = "none";
    alert("المتصفح يحتاج إذن تحديث لتصدير واستخراج ملفات الفيديو 😔");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initVideoCreatorSystem, 1500);
});
// تحديث أمان لتنشيط السيرفر
