// =========================================================================
// 🎬 اسْتُودْيُو أثَرٍ الشَّامِلُ لِتَنْقِيَةِ المَقَاطِعِ وَالمُونْتَاجِ الإِسْلَامِيِّ (أوفلاين 100%)
// =========================================================================

window.studioEngine = {
    audioCtx: null,
    sourceNode: null,
    voiceFilter: null,
    bassFilter: null,
    trebleFilter: null,
    noiseFilter: null,
    reverbDelay: null,
    reverbFeedback: null,
    reverbGain: null,
    compressorNode: null,
    gainNode: null,
    analyserNode: null,
    isOriginal: false,
    
    // عناصر الفيديو والكانفاس
    videoElement: null,
    renderCanvas: null,
    renderCtx: null,
    logoImage: null,
    animFrameId: null,

    // إعدادات النصوص واللوجو
    overlayText: "",
    textFont: "'Amiri', serif",
    textSize: 32,
    textColor: "#ffffff",
    textBgColor: "rgba(0,0,0,0.5)",
    textPosY: 80, // % من الارتفاع

    logoOpacity: 0.9,
    logoSize: 100,
    logoPos: "top-right",

    // إعدادات المظهر والإنتاج
    aspectRatio: "16:9", // '16:9' or '9:16'
    colorFilter: "none", // 'none', 'warm-gold', 'cinematic', 'bw'
    showProgressBar: true,
    showOutroCard: true
};

// 🎨 1. بناء واجهة الاستوديو الشاملة
window.renderStudioUI = function() {
    const container = document.getElementById('studioContainer');
    if (!container) return;

    container.innerHTML = `
    <div class="comm-card" style="background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; direction: rtl; text-align: right;">
        
        <!-- 📁 منطقة رفع الفيديو -->
        <div style="border: 2px dashed var(--gold); border-radius: 14px; padding: 25px; text-align: center; background: var(--bg2); margin-bottom: 20px;">
            <span style="font-size: 45px; display: block; margin-bottom: 10px;">🎥</span>
            <label for="videoStudioInput" style="background: var(--gold); color: #111; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; font-family: 'Amiri', serif; font-size: 15px; display: inline-block; box-shadow: 0 4px 15px rgba(212,175,55,0.25);">
                اختر مقطع فيديو / موعظة لمعالجته
            </label>
            <input type="file" id="videoStudioInput" accept="video/*,audio/*" onchange="window.handleStudioFileUpload(event)" style="display: none;" />
            <span id="studioFileName" style="display: block; color: var(--text2); font-size: 12px; margin-top: 10px;">لم يتم اختيار مقطع بعد</span>
        </div>

        <!-- 📺 مسرح العمل والمعاينة الحية -->
        <div id="studioWorkArea" style="display: none;">
            
            <video id="studioVideoPlayer" controls style="display: none;"></video>

            <!-- الكانفاس الموحد الذي يعرض المونتاج والنصوص حياً -->
            <div style="position: relative; text-align: center; margin-bottom: 15px; background: #000; border-radius: 12px; overflow: hidden; border: 1px solid var(--border);">
                <canvas id="studioCanvas" style="max-width: 100%; max-height: 480px; display: block; margin: 0 auto;"></canvas>
                <!-- 📊 رسم الموجات الصوتية فوق الفيديو -->
                <canvas id="waveformCanvas" width="800" height="60" style="width: 100%; height: 50px; background: rgba(0,0,0,0.5); position: absolute; bottom: 0; left: 0; pointer-events: none;"></canvas>
            </div>

            <!-- 📊 شريط حساب المساحة التقديرية الحية -->
            <div id="estimatedSizeDisplay" style="text-align: center; color: var(--gold); font-size: 13px; font-weight: bold; margin-bottom: 15px; font-family: sans-serif; background: var(--bg2); padding: 10px; border-radius: 10px; border: 1px solid var(--border);">
                📊 المساحة التقديرية المتوقعة: <span id="estVideoMB" style="color: #4caf50; font-size: 15px;">--</span> MB (فيديو) | <span id="estAudioMB" style="color: #005485; font-size: 15px;">--</span> MB (صوت صافي)
            </div>

            <!-- ⚡ الأوضاع السريعة الجاهزة (Presets) -->
            <div style="margin-bottom: 20px;">
                <strong style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px;">⚡ البريسيتس السريعة بنقرة واحدة:</strong>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
                    <button onclick="window.applyStudioPreset('music')" style="background: var(--bg2); border: 1px solid var(--gold); color: var(--gold); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: bold;">🎬 عزل الموسيقى</button>
                    <button onclick="window.applyStudioPreset('mosque')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🕌 صدى المساجد</button>
                    <button onclick="window.applyStudioPreset('mic')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🎙️ تقوية المايك</button>
                    <button onclick="window.applyStudioPreset('clear')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text2); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🔄 إزالة التعديلات</button>
                </div>
            </div>

            <!-- ✍️ لوحة إضافة النصوص والخطوط العربية (Text Overlay) -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px;">
                <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 10px;">✍️ إضافة نص / آية / حديث على الفيديو:</strong>
                
                <input type="text" id="studioTextInput" placeholder="اكتب النص هنا (مثلاً: ﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾)" oninput="window.updateStudioTextConfig()" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--card); color: var(--text); font-size: 14px; font-family: 'Amiri', serif; margin-bottom: 10px; box-sizing: border-box;" />

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; font-size: 12px;">
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">نوع الخط العربي:</label>
                        <select id="studioFontFamily" onchange="window.updateStudioTextConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                            <option value="'Amiri', serif">خط أميري (مصحفي)</option>
                            <option value="'Cairo', sans-serif">خط القاهرة (حديث)</option>
                            <option value="'Tajawal', sans-serif">خط تجوال (ناعم)</option>
                            <option value="'Reem Kufi', sans-serif">خط كوفي (عريق)</option>
                            <option value="'Aref Ruqaa', serif">خط رقعة (تراثي)</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">حجم الخط:</label>
                        <input type="range" id="studioFontSize" min="16" max="64" value="32" oninput="window.updateStudioTextConfig()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">موقع النص رأسيّاً:</label>
                        <input type="range" id="studioTextPosY" min="10" max="90" value="80" oninput="window.updateStudioTextConfig()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">لون النص / الخلفية:</label>
                        <div style="display:flex; gap:6px;">
                            <input type="color" id="studioTextColor" value="#ffffff" onchange="window.updateStudioTextConfig()" style="border:none; width:30px; height:28px; cursor:pointer; background:none;">
                            <input type="color" id="studioTextBgColor" value="#000000" onchange="window.updateStudioTextConfig()" style="border:none; width:30px; height:28px; cursor:pointer; background:none;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🖼️ لوحة إضافة الشعار / اللوجو والأبعاد والنمط السينمائي -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px;">
                <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 10px;">🖼️ الشعار (Watermark) والأبعاد والنمط السينمائي:</strong>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; font-size: 12px;">
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">رفع لوجو (PNG مفرغ):</label>
                        <input type="file" id="logoFileInput" accept="image/*" onchange="window.handleLogoUpload(event)" style="font-size:11px; color:var(--text);" />
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">أبعاد الفيديو:</label>
                        <select id="studioAspectRatio" onchange="window.updateStudioLayoutConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                            <option value="16:9">📺 عريض (16:9 - يوتيوب/فيسبوك)</option>
                            <option value="9:16">📱 طولي (9:16 - Reels / TikTok)</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">الفلتر السينمائي:</label>
                        <select id="studioColorFilter" onchange="window.updateStudioLayoutConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                            <option value="none">طبيعي (بدون فلتر)</option>
                            <option value="warm-gold">📜 ذهبي دافئ (Warm Gold)</option>
                            <option value="cinematic">🎬 سينمائي داكن (Cinematic)</option>
                            <option value="bw">⚪ أبيض وأسود (Classic B&W)</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; gap: 15px; margin-top: 10px; font-size: 12px; color: var(--text);">
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                        <input type="checkbox" id="studioProgressBarCheck" checked onchange="window.updateStudioLayoutConfig()" style="accent-color:var(--gold);" />
                        شريط تقدم المقطع الأسفل
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                        <input type="checkbox" id="studioOutroCardCheck" checked onchange="window.updateStudioLayoutConfig()" style="accent-color:var(--gold);" />
                        كارت ختام "شارك الخير"
                    </label>
                </div>
            </div>

            <!-- 🎛️ معادل الصوت التفاعلي والسلايدرات الصوتية -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 20px;">
                <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 12px;">🎛️ لوحة معالجة الصوت والصدى والترميم:</strong>
                
                <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px; color: var(--text);">
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>🗣️ تضخيم الصوت البشري (Voice Boost):</span> <span id="valVoice">100%</span></div>
                        <input type="range" id="sliderVoice" min="0" max="200" value="100" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>🎼 كتم الترددات الحادة والموسيقى (Treble Cut):</span> <span id="valTreble">0%</span></div>
                        <input type="range" id="sliderTreble" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>🥁 كتم الإيقاعات والبيس (Bass Cut):</span> <span id="valBass">0%</span></div>
                        <input type="range" id="sliderBass" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>🕌 صدى الصوت المسجدي (Spiritual Reverb):</span> <span id="valReverb">إيقاف</span></div>
                        <input type="range" id="sliderReverb" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>💨 فلتر إزالة الوش والنويز (Noise Reduction):</span> <span id="valNoise">إيقاف</span></div>
                        <input type="range" id="sliderNoise" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>⚡ سرعة المقطع بدون تغيير النبرة (Smart Speed):</span> <span id="valSpeed">1.0x</span></div>
                        <input type="range" id="sliderSpeed" min="0.75" max="2.0" step="0.05" value="1.0" oninput="window.updateStudioSpeed()" style="width:100%; accent-color:var(--gold);">
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; pt: 10px; border-top: 1px solid var(--border);">
                    <button id="toggleCompareBtn" onclick="window.toggleStudioLiveCompare()" style="flex: 1; background: rgba(212,175,55,0.15); color: var(--gold); border: 1px solid var(--gold); padding: 8px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">
                        🔄 المقارنة الحية: (الصوت المنقى)
                    </button>
                    <button onclick="window.fixStereoToMono()" style="background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;">
                        🎧 إصلاح السماعة الواحدة
                    </button>
                    <button onclick="window.captureVideoSnapshot()" style="background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;">
                        📸 التقاط غلاف المقطع
                    </button>
                </div>
            </div>

            <!-- ⚙️ إعدادات وخيارات التصدير المخصصة -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px; font-size: 12px;">
                <strong style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px;">⚙️ إعدادات دقة التصدير والجودة:</strong>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:2px;">جودة الفيديو (Bitrate):</label>
                       <select id="exportBitrate" onchange="window.updateEstimatedSize()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
    <option value="1200000">منخفضة / واتساب (1.2 Mbps)</option>
    <option value="2500000" selected>متوسطة HD (2.5 Mbps)</option>
    <option value="4500000">عالية Full HD (4.5 Mbps)</option>
</select>
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:2px;">سلاسة الحركة (FPS):</label>
                        <select id="exportFPS" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                            <option value="30" selected>30 إطار/ثانية</option>
                            <option value="60">60 إطار/ثانية (سلاسة فائقة)</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; color:var(--text2); margin-bottom:2px;">نقاء الصوت:</label>
                        <select id="exportAudioBitrate" onchange="window.updateEstimatedSize()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                            <option value="128000">128 kbps</option>
                            <option value="256000" selected>256 kbps (نقاء عالي)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- 📥 أزرار التصدير والتنزيل أوفلاين -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="window.exportStudioPureAudio()" style="background: #005485; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: bold; font-family: 'Amiri', serif; font-size: 14px; cursor: pointer;">
                    🎵 استخراج الصوت المنقى (MP3)
                </button>
                <button onclick="window.exportStudioFilteredVideo()" style="background: #4caf50; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: bold; font-family: 'Amiri', serif; font-size: 14px; cursor: pointer;">
                    🎬 تصدير الفيديو المعدل بالكامل
                </button>
            </div>

            <div id="studioStatusLog" style="text-align: center; color: var(--gold); font-size: 13px; font-weight: bold; margin-top: 15px; font-family: sans-serif;"></div>
        </div>
    </div>`;
};

// 📂 2. معالجة رفع الفيديو
window.handleStudioFileUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('studioFileName').textContent = `📹 الملف المختار: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    
    const video = document.getElementById('studioVideoPlayer');
    const videoURL = URL.createObjectURL(file);
    video.src = videoURL;
    
    window.studioEngine.videoElement = video;
    window.studioEngine.renderCanvas = document.getElementById('studioCanvas');
    window.studioEngine.renderCtx = window.studioEngine.renderCanvas.getContext('2d');

    document.getElementById('studioWorkArea').style.display = 'block';

    video.onloadeddata = () => {
        window.updateStudioLayoutConfig();
        window.updateEstimatedSize();
        // رسم الكادر الأول فوراً قبل الضغط على تشغيل
        window.drawSingleStudioFrame();
    };

    // تشغيل وإيقاف الفيديو بالضغط المباشر على الكانفاس
    const canvas = document.getElementById('studioCanvas');
    canvas.onclick = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    video.onplay = () => {
        window.initStudioAudioEngine();
        window.startCanvasRenderLoop();
        window.drawAudioWaveform();
    };
};

// 🖼️ معالجة رفع الشعار (Watermark)
window.handleLogoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        window.studioEngine.logoImage = img;
        document.getElementById('studioStatusLog').textContent = "✅ تم إضافة اللوجو بنجاح ودمجه على الشاشة!";
    };
    img.src = URL.createObjectURL(file);
};

// ⚙️ 3. محرك الصوت الرئيسي للـ Web Audio API
window.initStudioAudioEngine = function() {
    if (window.studioEngine.audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const video = window.studioEngine.videoElement;

    const source = ctx.createMediaElementSource(video);

    // 1. فلتر تضخيم الصوت البشري (Peaking)
    const voiceFilter = ctx.createBiquadFilter();
    voiceFilter.type = 'peaking';
    voiceFilter.frequency.value = 1200;
    voiceFilter.Q.value = 1.0;

    // 2. فلتر كتم الموسيقى الحادة (High Shelf)
    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 3200;

    // 3. فلتر كتم الإيقاعات والدف (Low Shelf)
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 250;

    // 4. فلتر إزالة الوش والنويز (Notch)
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'notch';
    noiseFilter.frequency.value = 60;

    // 5. محرك صدى الصوت المسجدي (Delay + Feedback Reverb)
    const reverbDelay = ctx.createDelay();
    reverbDelay.delayTime.value = 0.08; // delay 80ms
    const reverbFeedback = ctx.createGain();
    reverbFeedback.gain.value = 0.3;
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.0; // افتراضياً معطل

    reverbDelay.connect(reverbFeedback);
    reverbFeedback.connect(reverbDelay);
    reverbDelay.connect(reverbGain);

    // 6. ضاغط الصوت وموازن الجودة (Compressor)
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;

    const gainNode = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

    // التوصيل المباشر بين الفلاتر
    source.connect(voiceFilter);
    voiceFilter.connect(trebleFilter);
    trebleFilter.connect(bassFilter);
    bassFilter.connect(noiseFilter);

    // توصيل مسار الصدى المسجدي
    noiseFilter.connect(reverbDelay);

    noiseFilter.connect(compressor);
    reverbGain.connect(compressor);

    compressor.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(ctx.destination);

    window.studioEngine = {
        ...window.studioEngine,
        audioCtx: ctx,
        sourceNode: source,
        voiceFilter,
        trebleFilter,
        bassFilter,
        noiseFilter,
        reverbDelay,
        reverbFeedback,
        reverbGain,
        compressorNode: compressor,
        gainNode,
        analyserNode: analyser
    };

    window.updateStudioAudioFilters();
};

// 🎛️ 4. تحديث الفلاتر عند تحريك السلايدرات
window.updateStudioAudioFilters = function() {
    const e = window.studioEngine;
    if (!e.audioCtx) return;

    const voice = parseFloat(document.getElementById('sliderVoice').value);
    const treble = parseFloat(document.getElementById('sliderTreble').value);
    const bass = parseFloat(document.getElementById('sliderBass').value);
    const reverb = parseFloat(document.getElementById('sliderReverb').value);
    const noise = parseFloat(document.getElementById('sliderNoise').value);

    document.getElementById('valVoice').textContent = `${voice}%`;
    document.getElementById('valTreble').textContent = `${treble}%`;
    document.getElementById('valBass').textContent = `${bass}%`;
    document.getElementById('valReverb').textContent = reverb > 0 ? `${reverb}%` : 'إيقاف';
    document.getElementById('valNoise').textContent = noise > 0 ? `${noise}%` : 'إيقاف';

    if (!e.isOriginal) {
        e.voiceFilter.gain.value = (voice - 100) / 10;
        e.trebleFilter.gain.value = -(treble / 2.5);
        e.bassFilter.gain.value = -(bass / 2.5);
        e.reverbGain.gain.value = (reverb / 100) * 0.6;
        e.noiseFilter.Q.value = noise > 0 ? (noise / 10) : 0.001;
    }
};

// ⚡ التسريع الذكي بدون تغيير نبرة الصوت
window.updateStudioSpeed = function() {
    const video = window.studioEngine.videoElement;
    const speed = parseFloat(document.getElementById('sliderSpeed').value);
    document.getElementById('valSpeed').textContent = `${speed}x`;
    if (video) {
        video.playbackRate = speed;
        video.preservesPitch = true;
    }
    window.updateEstimatedSize();
};

// ✍️ تحديث النص
window.updateStudioTextConfig = function() {
    const e = window.studioEngine;
    e.overlayText = document.getElementById('studioTextInput').value;
    e.textFont = document.getElementById('studioFontFamily').value;
    e.textSize = parseInt(document.getElementById('studioFontSize').value);
    e.textColor = document.getElementById('studioTextColor').value;
    e.textBgColor = document.getElementById('studioTextBgColor').value;
    e.textPosY = parseInt(document.getElementById('studioTextPosY').value);
};

// 🖼️ تحديث أبعاد وتصميم المقطع
window.updateStudioLayoutConfig = function() {
    const e = window.studioEngine;
    e.aspectRatio = document.getElementById('studioAspectRatio').value;
    e.colorFilter = document.getElementById('studioColorFilter').value;
    e.showProgressBar = document.getElementById('studioProgressBarCheck').checked;
    e.showOutroCard = document.getElementById('studioOutroCardCheck').checked;

    const canvas = e.renderCanvas;
    if (!canvas) return;

    if (e.aspectRatio === "9:16") {
        canvas.width = 720;
        canvas.height = 1280;
    } else {
        canvas.width = 1280;
        canvas.height = 720;
    }
    window.updateEstimatedSize();
};

// 🔘 البريسيتس الجاهزة
window.applyStudioPreset = function(type) {
    if (type === 'music') {
        document.getElementById('sliderVoice').value = 140;
        document.getElementById('sliderTreble').value = 85;
        document.getElementById('sliderBass').value = 90;
        document.getElementById('sliderReverb').value = 15;
        document.getElementById('sliderNoise').value = 30;
    } else if (type === 'mosque') {
        document.getElementById('sliderVoice').value = 120;
        document.getElementById('sliderTreble').value = 30;
        document.getElementById('sliderBass').value = 50;
        document.getElementById('sliderReverb').value = 65;
        document.getElementById('sliderNoise').value = 50;
    } else if (type === 'mic') {
        document.getElementById('sliderVoice').value = 180;
        document.getElementById('sliderTreble').value = 10;
        document.getElementById('sliderBass').value = 20;
        document.getElementById('sliderReverb').value = 0;
        document.getElementById('sliderNoise').value = 40;
    } else {
        document.getElementById('sliderVoice').value = 100;
        document.getElementById('sliderTreble').value = 0;
        document.getElementById('sliderBass').value = 0;
        document.getElementById('sliderReverb').value = 0;
        document.getElementById('sliderNoise').value = 0;
    }
    window.updateStudioAudioFilters();
};

// 🔄 المقارنة الحية
window.toggleStudioLiveCompare = function() {
    const e = window.studioEngine;
    const btn = document.getElementById('toggleCompareBtn');
    if (!e.audioCtx) return;

    e.isOriginal = !e.isOriginal;

    if (e.isOriginal) {
        e.voiceFilter.gain.value = 0;
        e.trebleFilter.gain.value = 0;
        e.bassFilter.gain.value = 0;
        e.reverbGain.gain.value = 0;
        btn.textContent = "🔊 المقارنة الحية: (الصوت الأصلي)";
        btn.style.borderColor = "#ff4d4d";
        btn.style.color = "#ff4d4d";
    } else {
        window.updateStudioAudioFilters();
        btn.textContent = "✨ المقارنة الحية: (الصوت المنقى)";
        btn.style.borderColor = "var(--gold)";
        btn.style.color = "var(--gold)";
    }
};

// 🎧 إصلاح الصوت أحادي الجانب
window.fixStereoToMono = function() {
    const e = window.studioEngine;
    if (!e.audioCtx) return;

    const merger = e.audioCtx.createChannelMerger(1);
    e.sourceNode.disconnect();
    e.sourceNode.connect(merger);
    merger.connect(e.voiceFilter);
    document.getElementById('studioStatusLog').textContent = "✅ تم دمج وتوزيع الصوت ليخرج من السماعتين بكفاءة!";
};

// 🎥 5. محرك الرسم والتصميم الحي على الكانفاس (Canvas Render Loop)
window.startCanvasRenderLoop = function() {
    const e = window.studioEngine;
    const video = e.videoElement;
    const canvas = e.renderCanvas;
    const ctx = e.renderCtx;

    if (!video || !canvas || !ctx) return;

    function drawFrame() {
        if (!video.paused && !video.ended) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // تطبيق الفلاتر السينمائية للألوان
            if (e.colorFilter === 'warm-gold') {
                ctx.filter = 'sepia(0.35) contrast(1.1) brightness(1.05)';
            } else if (e.colorFilter === 'cinematic') {
                ctx.filter = 'contrast(1.25) saturate(1.15) brightness(0.95)';
            } else if (e.colorFilter === 'bw') {
                ctx.filter = 'grayscale(1) contrast(1.2)';
            } else {
                ctx.filter = 'none';
            }

            // رسم خلفية الفيديو مع معالجة الأبعاد (9:16 Blur Background)
            if (e.aspectRatio === "9:16") {
                // رسم خلفية ضبابية مموهة تملأ الطول
                ctx.save();
                ctx.filter += ' blur(20px) brightness(0.5)';
                ctx.drawImage(video, -100, 0, canvas.width + 200, canvas.height);
                ctx.restore();

                // رسم الفيديو الأصلي في المنتصف بأبعاده الصحيحة
                const vAspect = video.videoWidth / video.videoHeight;
                const drawW = canvas.width;
                const drawH = drawW / vAspect;
                const drawY = (canvas.height - drawH) / 2;
                ctx.drawImage(video, 0, drawY, drawW, drawH);
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            ctx.filter = 'none'; // إعادة الضبط

            // ✍️ رسم النص والآيات فوق الفيديو
            if (e.overlayText && e.overlayText.trim() !== "") {
                ctx.font = `bold ${e.textSize * (canvas.width / 800)}px ${e.textFont}`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const textY = (e.textPosY / 100) * canvas.height;
                const textMetrics = ctx.measureText(e.overlayText);
                const padding = 16;

                // خلفية النص
                ctx.fillStyle = e.textBgColor;
                ctx.fillRect(
                    (canvas.width - textMetrics.width) / 2 - padding,
                    textY - (e.textSize / 1.5) - padding / 2,
                    textMetrics.width + (padding * 2),
                    e.textSize + padding
                );

                // كتابة النص مع ظل خفيف
                ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                ctx.shadowBlur = 8;
                ctx.fillStyle = e.textColor;
                ctx.fillText(e.overlayText, canvas.width / 2, textY);
                ctx.shadowBlur = 0;
            }

            // 🖼️ رسم الشعار / اللوجو
            if (e.logoImage) {
                ctx.globalAlpha = e.logoOpacity;
                const logoW = e.logoSize * (canvas.width / 1000);
                const logoH = logoW * (e.logoImage.height / e.logoImage.width);
                ctx.drawImage(e.logoImage, canvas.width - logoW - 20, 20, logoW, logoH);
                ctx.globalAlpha = 1.0;
            }

            // 📊 رسم شريط تقدم المقطع
            if (e.showProgressBar && video.duration > 0) {
                const progress = video.currentTime / video.duration;
                ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
                ctx.fillRect(0, canvas.height - 8, canvas.width, 8);
                ctx.fillStyle = "#d4af37";
                ctx.fillRect(0, canvas.height - 8, canvas.width * progress, 8);
            }

            // 📜 كارت الختام الدعوي تلقائياً عند الاقتراب من النهاية
            if (e.showOutroCard && (video.duration - video.currentTime <= 2.5) && video.duration > 3) {
                ctx.fillStyle = "rgba(10, 20, 15, 0.88)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = `bold ${36 * (canvas.width / 800)}px 'Amiri', serif`;
                ctx.fillStyle = "#d4af37";
                ctx.textAlign = "center";
                ctx.fillText("شَارِكِ الخَيْرَ وَكُنْ ذَا أثَرٍ 🕌", canvas.width / 2, canvas.height / 2 - 20);

                ctx.font = `${20 * (canvas.width / 800)}px 'Amiri', serif`;
                ctx.fillStyle = "#ffffff";
                ctx.fillText("لا تنسونا من صالح دعائكم - تطبيق أثر", canvas.width / 2, canvas.height / 2 + 30);
            }
        }
        e.animFrameId = requestAnimationFrame(drawFrame);
    }
    
    if (e.animFrameId) cancelAnimationFrame(e.animFrameId);
    drawFrame();
};

// 🖼️ رسم كادر واحد فوراً حتى لو الفيديو متوقف
window.drawSingleStudioFrame = function() {
    const e = window.studioEngine;
    if (e.videoElement && e.renderCtx && e.renderCanvas) {
        e.renderCtx.drawImage(e.videoElement, 0, 0, e.renderCanvas.width, e.renderCanvas.height);
    }
};



// 📊 6. حساب الحجم التقديري للملف قبل التصدير
// 📊 حساب المساحة التقديرية الحقيقية والمضغوطة
window.updateEstimatedSize = function() {
    const video = window.studioEngine.videoElement;
    const vBitrate = parseInt(document.getElementById('exportBitrate')?.value || 2500000);
    const aBitrate = parseInt(document.getElementById('exportAudioBitrate')?.value || 128000);
    const speed = parseFloat(document.getElementById('sliderSpeed')?.value || 1.0);
    
    const duration = (video?.duration || 0) / speed;

    if (duration > 0 && !isNaN(duration) && duration !== Infinity) {
        // معادلة البث المضغوط المعتدلة
        const videoSizeMB = (((vBitrate + aBitrate) * duration) / (8 * 1024 * 1024)).toFixed(1);
        const audioSizeMB = ((aBitrate * duration) / (8 * 1024 * 1024)).toFixed(1);

        document.getElementById('estVideoMB').textContent = videoSizeMB;
        document.getElementById('estAudioMB').textContent = audioSizeMB;
    }
};

// 📊 رسم الموجات الصوتية الحية (Live Visualizer)
window.drawAudioWaveform = function() {
    const canvas = document.getElementById('waveformCanvas');
    const e = window.studioEngine;
    if (!canvas || !e.analyserNode) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = e.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        if (e.videoElement && !e.videoElement.paused) {
            requestAnimationFrame(draw);
            e.analyserNode.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.2;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                ctx.fillStyle = i > bufferLength / 2 ? '#d4af37' : '#4caf50';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
    }
    draw();
};

// 📸 التقاط صورة غلاف للمقطع (Snapshot)
window.captureVideoSnapshot = function() {
    const canvas = window.studioEngine.renderCanvas;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `غلاف_موعظة_أثر_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    document.getElementById('studioStatusLog').textContent = "📸 تم حفظ غلاف المقطع كصورة PNG عالية الدقة!";
};

// 🎵 7. تصدير واستخرج الملف الصوتي المنقى
window.exportStudioPureAudio = function() {
    const video = window.studioEngine.videoElement;
    const log = document.getElementById('studioStatusLog');
    if (!video || !video.src) return;

    log.textContent = "⏳ جاري تسجِيل واستخراج الصوت الصافي والمنقى...";

    const stream = window.studioEngine.gainNode.context.createMediaStreamDestination();
    window.studioEngine.gainNode.connect(stream);

    const aBitrate = parseInt(document.getElementById('exportAudioBitrate')?.value || 256000);
    const recorder = new MediaRecorder(stream.stream, { audioBitsPerSecond: aBitrate });
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `صوت_منقى_أثر_${Date.now()}.mp3`;
        link.click();

        log.textContent = `✅ تم استخراج الملف الصوتي بنجاح! الحجم الفعلي: (${sizeMB} MB)`;
    };

    video.currentTime = 0;
    video.play();
    recorder.start();

    video.onended = () => {
        recorder.stop();
    };
};

// 🎬 8. تصدير الفيديو النهائي المعدل بالتصميم والصوت المنقى
window.exportStudioFilteredVideo = function() {
    const video = window.studioEngine.videoElement;
    const canvas = window.studioEngine.renderCanvas;
    const log = document.getElementById('studioStatusLog');
    if (!video || !canvas) return;

    log.textContent = "⏳ جاري دمج المونتاج وتصدير الفيديو المنقى...";

    const fps = parseInt(document.getElementById('exportFPS')?.value || 30);
    const vBitrate = parseInt(document.getElementById('exportBitrate')?.value || 5000000);
    const aBitrate = parseInt(document.getElementById('exportAudioBitrate')?.value || 256000);

    // سحب تيار الصوت والفيديو المعدلين
    const audioStream = window.studioEngine.gainNode.context.createMediaStreamDestination().stream;
    const canvasStream = canvas.captureStream(fps);

    const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ]);

    const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: vBitrate,
        audioBitsPerSecond: aBitrate
    };

    let recorder;
    try {
        recorder = new MediaRecorder(combinedStream, options);
    } catch (e) {
        recorder = new MediaRecorder(combinedStream);
    }

    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `فيديو_منقى_أثر_${Date.now()}.mp4`;
        link.click();

        log.textContent = `🎉 تم تصدير الفيديو بنجاح! الحجم الفعلي المستخرج: (${sizeMB} MB)`;
    };

    video.currentTime = 0;
    video.play();
    recorder.start();

    video.onended = () => {
        recorder.stop();
    };
};

// 🎯 تهيئة الاستوديو فور التحميل
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('studioContainer')) {
        window.renderStudioUI();
    }
});
