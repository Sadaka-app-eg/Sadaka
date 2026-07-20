// =========================================================================
// 🎬 استوديو أثر الشامل لمعالجة المقاطع وتنقية الصوت (النسخة الاحترافية الكاملة)
// =========================================================================

window.studioEngine = {
    audioCtx: null,
    sourceNode: null,
    voiceFilter: null,
    bassFilter: null,
    trebleFilter: null,
    noiseFilter: null,
    compressorNode: null,
    gainNode: null,
    analyserNode: null,
    isOriginal: false,
    recordedChunks: [],
    mediaRecorder: null
};

window.renderStudioUI = function() {
    const container = document.getElementById('studioContainer');
    if (!container) return;

    container.innerHTML = `
    <div class="comm-card" style="background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; direction: rtl; text-align: right;">
        
        <!-- 📁 منطقة رفع الفيديو -->
        <div style="border: 2px dashed var(--gold); border-radius: 14px; padding: 25px; text-align: center; background: var(--bg2); margin-bottom: 20px;">
            <span style="font-size: 45px; display: block; margin-bottom: 10px;">🎥</span>
            <label for="videoStudioInput" style="background: var(--gold); color: #111; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; font-family: 'Amiri', serif; font-size: 15px; display: inline-block; box-shadow: 0 4px 15px rgba(212,175,55,0.2);">
                اختر مقطع فيديو / موعظة لمعالجته
            </label>
            <input type="file" id="videoStudioInput" accept="video/*,audio/*" onchange="window.handleStudioFileUpload(event)" style="display: none;" />
            <span id="studioFileName" style="display: block; color: var(--text2); font-size: 12px; margin-top: 10px;">لم يتم اختيار مقطع بعد</span>
        </div>

        <!-- 📺 منطقة معاينة المقطع ورسم الموجات (Visualizer) -->
        <div id="studioWorkArea" style="display: none;">
            
            <div style="position: relative; text-align: center; margin-bottom: 15px;">
                <video id="studioVideoPlayer" controls style="width: 100%; max-height: 360px; border-radius: 12px; background: #000; border: 1px solid var(--border);"></video>
                <!-- 📊 المخطط المباشر للموجات الصوتية -->
                <canvas id="waveformCanvas" width="800" height="80" style="width: 100%; height: 60px; background: rgba(0,0,0,0.6); border-radius: 0 0 12px 12px; margin-top: -65px; position: relative; pointer-events: none;"></canvas>
            </div>

            <!-- 🔘 الأوضاع الجاهزة بنقرة واحدة (Presets) -->
            <div style="margin-bottom: 20px;">
                <strong style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px;">⚡ الأوضاع السريعة الجاهزة (Presets):</strong>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px;">
                    <button onclick="window.applyStudioPreset('music')" style="background: var(--bg2); border: 1px solid var(--gold); color: var(--gold); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: bold;">🎬 عزل الموسيقى</button>
                    <button onclick="window.applyStudioPreset('mosque')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🕌 تسجيلات المساجد</button>
                    <button onclick="window.applyStudioPreset('mic')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🎙️ تقوية المايك</button>
                    <button onclick="window.applyStudioPreset('clear')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text2); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🔄 إعادة ضبط</button>
                </div>
            </div>

            <!-- 🎛️ معادل الصوت التفاعلي والسلايدرات -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 20px;">
                <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 12px;">🎛️ لوحة معالجة الترددات والترميم الدقيق:</strong>
                
                <div style="display: flex; flex-direction: column; gap: 12px; font-size: 12px; color: var(--text);">
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
                        <div style="display:flex; justify-content:space-between;"><span>💨 فلتر إزالة الوش والنويز (Noise Reduction):</span> <span id="valNoise">إيقاف</span></div>
                        <input type="range" id="sliderNoise" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between;"><span>⚡ سرعة المقطع بدون تغيير النبرة (Smart Speed):</span> <span id="valSpeed">1.0x</span></div>
                        <input type="range" id="sliderSpeed" min="0.75" max="2.0" step="0.05" value="1.0" oninput="window.updateStudioSpeed()" style="width:100%; accent-color:var(--gold);">
                    </div>
                </div>

                <!-- خيارات إضافية -->
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border);">
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

            <!-- ⚙️ لوحة خيارات التصدير المخصصة للمستخدم (ميزات دقة الصورة ومعدل الإطارات) -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 20px; direction: rtl; text-align: right;">
                <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 12px;">⚙️ خيارات جودة ودقة التصدير المخصصة:</strong>
                <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px;">
                    <div>
                        <label style="display: block; margin-bottom: 4px; color: var(--text);">🎞️ جودة ومعدل البث للفيديو (Bitrate):</label>
                        <select id="exportVideoQuality" style="width: 100%; background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 8px; border-radius: 8px; outline: none;">
                            <option value="2000000">جودة منخفضة (2 Mbps) - مناسبة للواتساب ومساحة صغيرة</option>
                            <option value="5000000" selected>جودة متوسطة (5 Mbps) - جودة متوازنة HD</option>
                            <option value="10000000">جودة عالية (10 Mbps) - دقة ممتازة FHD</option>
                            <option value="18000000">جودة فائقة (18 Mbps) - دقة سينمائية بدون بكسلة</option>
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px; color: var(--text);">🔄 سلاسة الحركة (FPS):</label>
                            <select id="exportVideoFps" style="width: 100%; background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 8px; border-radius: 8px; outline: none;">
                                <option value="24">24 إطار/ثانية (سينمائي)</option>
                                <option value="30" selected>30 إطار/ثانية (افتراضي سلس)</option>
                                <option value="60">60 إطار/ثانية (فائق النعومة والسرعة)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; color: var(--text);">🎵 نقاوة هندسة الصوت:</label>
                            <select id="exportAudioBitrate" style="width: 100%; background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 8px; border-radius: 8px; outline: none;">
                                <option value="128000">128 kbps (اقتصادي)</option>
                                <option value="192000" selected>192 kbps (نقي جداً)</option>
                                <option value="320000">320 kbps (ستوديو فائق النقاوة)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📥 أزرار التصدير والتنزيل أوفلاين -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="window.exportStudioPureAudio()" style="background: #005485; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: bold; font-family: 'Amiri', serif; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    🎵 استخراج الصوت المنقى (MP3/WAV)
                </button>
                <button onclick="window.exportStudioFilteredVideo()" style="background: #4caf50; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: bold; font-family: 'Amiri', serif; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    🎬 تصدير الفيديو بالخيارات المحددة
                </button>
            </div>

            <div id="studioStatusLog" style="text-align: center; color: var(--gold); font-size: 12px; margin-top: 12px; font-family: sans-serif;"></div>
        </div>
    </div>`;
};

// 📂 معالجة رفع الفيديو وتهيئته
window.handleStudioFileUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('studioFileName').textContent = `📹 الملف: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    const videoURL = URL.createObjectURL(file);
    const video = document.getElementById('studioVideoPlayer');
    
    video.src = videoURL;
    document.getElementById('studioWorkArea').style.display = 'block';

    video.onplay = () => {
        window.initStudioAudioEngine();
        window.drawAudioWaveform();
    };
};

// ⚙️ محرك الصوت الرئيسي للـ Web Audio API
window.initStudioAudioEngine = function() {
    if (window.studioEngine.audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const video = document.getElementById('studioVideoPlayer');

    const source = ctx.createMediaElementSource(video);

    // 1. فلتر تضخيم الصوت البشري
    const voiceFilter = ctx.createBiquadFilter();
    voiceFilter.type = 'peaking';
    voiceFilter.frequency.value = 1200; 
    voiceFilter.Q.value = 1.0;

    // 2. فلتر كتم الموسيقى الحادة
    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 3500;

    // 3. فلتر كتم الإيقاعات
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 250;

    // 4. فلتر إزالة النويز والوش
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'notch';
    noiseFilter.frequency.value = 60; 

    // 5. ضاغط الصوت وموازن الجودة
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;

    // 6. التحكم بالصوت العام ورسام الموجات
    const gainNode = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

    source.connect(voiceFilter);
    voiceFilter.connect(trebleFilter);
    trebleFilter.connect(bassFilter);
    bassFilter.connect(noiseFilter);
    noiseFilter.connect(compressor);
    compressor.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(ctx.destination);

    window.studioEngine = {
        audioCtx: ctx,
        sourceNode: source,
        voiceFilter,
        trebleFilter,
        bassFilter,
        noiseFilter,
        compressorNode: compressor,
        gainNode,
        analyserNode: analyser,
        isOriginal: false
    };

    window.updateStudioAudioFilters();
};

// 🎛️ تحديث القيم فور تحريك السلايدرات
window.updateStudioAudioFilters = function() {
    const e = window.studioEngine;
    if (!e.audioCtx) return;

    const voice = parseFloat(document.getElementById('sliderVoice').value);
    const treble = parseFloat(document.getElementById('sliderTreble').value);
    const bass = parseFloat(document.getElementById('sliderBass').value);
    const noise = parseFloat(document.getElementById('sliderNoise').value);

    document.getElementById('valVoice').textContent = `${voice}%`;
    document.getElementById('valTreble').textContent = `${treble}%`;
    document.getElementById('valBass').textContent = `${bass}%`;
    document.getElementById('valNoise').textContent = noise > 0 ? `${noise}%` : 'إيقاف';

    if (!e.isOriginal) {
        e.voiceFilter.gain.value = (voice - 100) / 10; 
        e.trebleFilter.gain.value = -(treble / 2.5); 
        e.bassFilter.gain.value = -(bass / 2.5);     
        e.noiseFilter.Q.value = noise > 0 ? (noise / 10) : 0.001;
    }
};

// ⚡ التسريع الذكي بدون تغيير نبرة الصوت
window.updateStudioSpeed = function() {
    const video = document.getElementById('studioVideoPlayer');
    const speed = parseFloat(document.getElementById('sliderSpeed').value);
    document.getElementById('valSpeed').textContent = `${speed}x`;
    if (video) {
        video.playbackRate = speed;
        video.preservesPitch = true; 
    }
};

// 🔘 تطبيق البريسيتس الجاهزة
window.applyStudioPreset = function(type) {
    if (type === 'music') {
        document.getElementById('sliderVoice').value = 140;
        document.getElementById('sliderTreble').value = 85;
        document.getElementById('sliderBass').value = 90;
        document.getElementById('sliderNoise').value = 30;
    } else if (type === 'mosque') {
        document.getElementById('sliderVoice').value = 120;
        document.getElementById('sliderTreble').value = 40;
        document.getElementById('sliderBass').value = 70;
        document.getElementById('sliderNoise').value = 60;
    } else if (type === 'mic') {
        document.getElementById('sliderVoice').value = 180;
        document.getElementById('sliderTreble').value = 10;
        document.getElementById('sliderBass').value = 20;
        document.getElementById('sliderNoise').value = 40;
    } else {
        document.getElementById('sliderVoice').value = 100;
        document.getElementById('sliderTreble').value = 0;
        document.getElementById('sliderBass').value = 0;
        document.getElementById('sliderNoise').value = 0;
    }
    window.updateStudioAudioFilters();
};

// 🔄 المقارنة اللحظية (قبل / بعد)
window.toggleStudioLiveCompare = function() {
    const e = window.studioEngine;
    const btn = document.getElementById('toggleCompareBtn');
    if (!e.audioCtx) return;

    e.isOriginal = !e.isOriginal;

    if (e.isOriginal) {
        e.voiceFilter.gain.value = 0;
        e.trebleFilter.gain.value = 0;
        e.bassFilter.gain.value = 0;
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
    document.getElementById('studioStatusLog').textContent = "✅ تم دمج وتوسيع الصوت ليخرج من السماعتين بكفاءة!";
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
        requestAnimationFrame(draw);
        e.analyserNode.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            ctx.fillStyle = i > bufferLength / 2 ? '#8b6914' : '#4caf50';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    draw();
};

// 📸 التقاط صورة غلاف للمقطع (Snapshot)
window.captureVideoSnapshot = function() {
    const video = document.getElementById('studioVideoPlayer');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = `غلاف_موعظة_أثر_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    document.getElementById('studioStatusLog').textContent = "📸 تم حفظ غلاف المقطع كصورة PNG دقيقة!";
};

// 🎵 تصدير واستخراج الصوت الصافي فقط
window.exportStudioPureAudio = function() {
    const video = document.getElementById('studioVideoPlayer');
    const log = document.getElementById('studioStatusLog');
    if (!video || !video.src) return;

    log.textContent = "⏳ جاري تسجيل واستخراج الملف الصوتي المنقى...";
    const stream = window.studioEngine.gainNode.context.createMediaStreamDestination();
    window.studioEngine.gainNode.connect(stream);

    const recorder = new MediaRecorder(stream.stream);
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `صوت_منقى_منصة_أثر_${Date.now()}.mp3`;
        link.click();
        log.textContent = "✅ تم استخراج التلاوة/الموعظة الصوتية بنجاح أوفلاين!";
    };

    video.currentTime = 0;
    video.play();
    recorder.start();

    video.onended = () => {
        recorder.stop();
    };
};

// 🎬 تصدير الفيديو النهائي بالصوت المنقى والميزات المختارة
window.exportStudioFilteredVideo = function() {
    const video = document.getElementById('studioVideoPlayer');
    const log = document.getElementById('studioStatusLog');
    if (!video) return;

    // 🎯 قراءة الخيارات المختارة حركياً من الواجهة الرسومية
    const targetFps = parseInt(document.getElementById('exportVideoFps').value) || 30;
    const targetVideoBitrate = parseInt(document.getElementById('exportVideoQuality').value) || 5000000;
    const targetAudioBitrate = parseInt(document.getElementById('exportAudioBitrate').value) || 192000;

    log.textContent = `⏳ جاري التصدير بمعدل ${targetFps} إطار وبث ${targetVideoBitrate / 1000000} Mbps...`;

    const audioStream = window.studioEngine.gainNode.context.createMediaStreamDestination().stream;
    
    // التقاط الـ Video Stream بالـ FPS المختار من قبل المستخدم
    const videoStream = video.captureStream ? video.captureStream(targetFps) : video.mozCaptureStream(targetFps);

    const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ]);

    const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: targetVideoBitrate,
        audioBitsPerSecond: targetAudioBitrate
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
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `فيديو_منقى_منصة_أثر_${Date.now()}.mp4`;
        link.click();
        log.textContent = "🎉 تم تصدير المقطع بنجاح وإعداداته المخصصة بالملي!";
    };

    video.currentTime = 0;
    video.play();
    recorder.start();

    video.onended = () => {
        recorder.stop();
    };
};

// 🎯 تشغيل واستدعاء الاستوديو فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('studioContainer')) {
        window.renderStudioUI();
    }
});
