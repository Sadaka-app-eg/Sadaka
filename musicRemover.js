// =========================================================================
// 🎬 اسْتُودْيُو أثَرٍ الشَّامِلُ - محرر الفيديوهات والتايم لاين الاحترافي (CapCut Style)
// =========================================================================

// =========================================================================
// 🎬 كلاسات المحرك المطور لمشروع أثر - CapCut Modular Architecture
// =========================================================================

class AthrProjectState {
    constructor() {
        this.version = "2.0.0";
        this.projectName = "مشروع_أثر_جديد";
        this.tracks = [
            { id: 'v1', type: 'video', name: '🎥 مسار الفيديو الرئيسي', clips: [], visible: true, locked: false },
            { id: 'ov1', type: 'overlay', name: '🖼️ مسار الطبقات والملصقات', clips: [], visible: true, locked: false },
            { id: 't1', type: 'text', name: '✍️ مسار النصوص والآيات', clips: [], visible: true, locked: false },
            { id: 'a1', type: 'audio', name: '🎙️ مسار الصوت والمؤثرات', clips: [], visible: true, locked: false }
        ];
        this.history = [];
        this.historyIndex = -1;
    }

    pushHistory(snapshot) {
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(JSON.stringify(snapshot));
        this.historyIndex++;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return JSON.parse(this.history[this.historyIndex]);
        }
        return null;
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            return JSON.parse(this.history[this.historyIndex]);
        }
        return null;
    }
}

class AthrKeyframeEngine {
    static interpolate(kf1, kf2, progress, easing = 'linear') {
        let p = progress;
        if (easing === 'easeIn') p = p * p;
        else if (easing === 'easeOut') p = p * (2 - p);
        else if (easing === 'easeInOut') p = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        return kf1 + (kf2 - kf1) * p;
    }

    static getValueAtTime(keyframes, currentTime, defaultValue = 0) {
        if (!keyframes || keyframes.length === 0) return defaultValue;
        if (currentTime <= keyframes[0].time) return keyframes[0].value;
        if (currentTime >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value;

        for (let i = 0; i < keyframes.length - 1; i++) {
            const kf1 = keyframes[i];
            const kf2 = keyframes[i + 1];
            if (currentTime >= kf1.time && currentTime <= kf2.time) {
                const progress = (currentTime - kf1.time) / (kf2.time - kf1.time);
                return this.interpolate(kf1.value, kf2.value, progress, kf2.easing || 'linear');
            }
        }
        return defaultValue;
    }
}





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
    gainNode: null,
    analyserNode: null,
    isOriginal: false,
    originalFileSize: 0,

    // 🆕 خصائص الدفعة الثالثة (Stickers & PiP Overlay)
    stickersList: [], // [{ id, text, img, x, y, size, opacity }]
    pipOverlayImage: null,
    pipX: 50,
    pipY: 50,
    pipSize: 150,
    pipOpacity: 0.9,
    // 🖼️ إعدادات الخلفية المخصصة والقناع
    bgCustomImage: null,
    bgImageOpacity: 1.0,
    bgImageScale: 1.0,
    videoMaskShape: 'none', // 'none' | 'rounded' | 'circle' | 'arch'

    // إحداثيات السحب الحر لشريط اسم الشيخ
    bannerX: 40,
    bannerY: 520,

    // عناصر الكانفاس والفيديو
    videoElement: null,
    renderCanvas: null,
    renderCtx: null,
    logoImage: null,
    animFrameId: null,




// 🥞 التحكم في ظهور وقفل الطبقات (Layers)
    layerSettings: {
        video: { visible: true, locked: false },
        overlayText: { visible: true, locked: false },
        logo: { visible: true, locked: false },
        banner: { visible: true, locked: false },
        pip: { visible: true, locked: false },
        stickers: { visible: true, locked: false }
    },


// 🆕 خصائص CapCut Engine الجديدة
    projectState: new AthrProjectState(),
    timelineZoom: 1.0,
    snapEnabled: true,
    activeTrackId: 'v1',
    colorAdjustments: {
        exposure: 0,
        contrast: 0,
        saturation: 0,
        temperature: 0,
        hue: 0
    },

    // 💾 تصدير المشروع كملف .athr
    exportAthrProject: function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.projectState));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `${this.projectState.projectName}_${Date.now()}.athr`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    },

    // 📂 استيراد مشروع .athr
    importAthrProject: function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                this.projectState = Object.assign(new AthrProjectState(), parsed);
                window.renderTimelineUI();
                alert("✅ تم تحميل مشروع أثر (.athr) بنجاح!");
            } catch (err) {
                alert("⚠️ ملف المشروع غير صالح!");
            }
        };
        reader.readAsText(file);
    },









    
    // نظام المقاطع المتقدم (Multi-Clip Timeline)
    clips: [], // [{ id, start, end, duration }]
    selectedClipIndex: 0,
    transitions: {}, // { clipIndex: 'fade' | 'slide' | 'zoom' | 'rotate' | 'blur' }

    // إعدادات النصوص واللوجو
    overlayText: "",
    textFont: "'Amiri', serif",
    textSize: 32,
    textColor: "#ffffff",
    textBgColor: "rgba(0,0,0,0.5)",
    textX: 360,
    textY: 600,

    logoOpacity: 0.9,
    logoSize: 100,
    logoX: 580,
    logoY: 40,

    // إعدادات المظهر والإنتاج
    aspectRatio: "16:9",
    aspectBgStyle: "dark",
    colorFilter: "none",
    showProgressBar: true,
    showOutroCard: true,
    enableGridLines: false,
    enableIslamicFrame: false,
    enableMirrorFlip: false,

    // التمويه وسحب العناصر
    enableBlurBox: false,
    blurBoxX: 260,
    blurBoxY: 200,
    blurBoxW: 200,
    blurBoxH: 100,
    isDragging: false,
    dragTarget: null,
    dragOffsetX: 0,
    dragOffsetY: 0,

    // الباقة السينمائية
    rotationAngle: 0,
    enableFadeInOut: true,
    enableVignette: false,
    speakerName: "",
    lessonTitle: "",

    // المؤثرات الصوتية أوفلاين
    ambientType: "none",
    ambientNode: null,
    ambientGainNode: null,
    ambientAudioEl: null
};

// 🎨 1. بناء واجهة الاستوديو ومسرح التايم لاين البصري
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
            
            <video id="studioVideoPlayer" controls style="width: 100%; margin-top: 10px; border-radius: 8px;"></video>

            <!-- الكانفاس الموحد -->
            <div style="position: relative; text-align: center; margin-top: 15px; margin-bottom: 15px; background: #000; border-radius: 12px; overflow: hidden; border: 1px solid var(--border);">
                <canvas id="studioCanvas" style="max-width: 100%; max-height: 480px; display: block; margin: 0 auto; cursor: move;"></canvas>
                <canvas id="waveformCanvas" width="800" height="60" style="width: 100%; height: 50px; background: rgba(0,0,0,0.5); position: absolute; bottom: 0; left: 0; pointer-events: none;"></canvas>
            </div>

            <!-- 🎞️ شريط التايم لاين البصري الاحترافي -->
           <!-- 🎞️ شريط التايم لاين المطور متعدد المسارات (CapCut Multitrack Timeline) -->
            <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--gold); margin-bottom: 20px;">
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
    <strong style="color: var(--gold); font-size: 14px;">🎞️ المحرر متعدد المسارات (Multi-Track Timeline):</strong>
    <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
        <button onclick="window.undoStudioState()" style="background: var(--card); color: var(--gold); border: 1px solid var(--gold); padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;" title="تراجع (Ctrl+Z)">↩️ تراجع</button>
        <button onclick="window.redoStudioState()" style="background: var(--card); color: var(--gold); border: 1px solid var(--gold); padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;" title="إعادة (Ctrl+Y)">↪️ تقدم</button>
        <button onclick="window.splitClipAtPlayhead()" style="background: var(--gold); color: #111; border: none; padding: 6px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px;">✂️ تقسيم</button>
        <button onclick="window.deleteSelectedClip()" style="background: #ff4d4d; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px;">🗑️ حذف</button>
        <button onclick="window.studioEngine.exportAthrProject()" style="background: #005485; color: #fff; border: 1px solid var(--border); padding: 6px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px;">💾 حفظ مشروع (.athr)</button>
        <label style="background: var(--card); color: var(--gold); border: 1px solid var(--gold); padding: 6px 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; display: inline-block;">
            📂 فتح مشروع
            <input type="file" accept=".athr" onchange="window.studioEngine.importAthrProject(event)" style="display:none;" />
        </label>
    </div>
</div>

<!-- 🔍 شريط التحكم بزوم التايم لاين -->
<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 11px; color: var(--text2);">
    <span>🔍 زوم التايم لاين:</span>
    <input type="range" id="timelineZoomSlider" min="0.5" max="3.0" step="0.1" value="1.0" oninput="window.updateTimelineZoom(this.value)" style="width: 120px; accent-color: var(--gold);" />
    <span id="zoomValLabel">100%</span>
</div>
                <!-- مسار الكليبات البصرية -->
                <div id="timelineTrack" style="display: flex; flex-direction: column; gap: 8px; overflow-x: auto; padding: 10px; background: #000; border-radius: 8px; min-height: 90px; border: 1px solid var(--border);">
                </div>
            </div>

            <!-- 📊 حساب المساحة -->
            <div id="estimatedSizeDisplay" style="text-align: center; color: var(--gold); font-size: 13px; font-weight: bold; margin-bottom: 15px; font-family: sans-serif; background: var(--bg2); padding: 10px; border-radius: 10px; border: 1px solid var(--border);">
                📊 المساحة التقديرية المتوقعة: <span id="estVideoMB" style="color: #4caf50; font-size: 15px;">--</span> MB (فيديو) | <span id="estAudioMB" style="color: #005485; font-size: 15px;">--</span> MB (صوت صافي)
            </div>

            <!-- 📑 أزرار التابات -->
            <div style="display: flex; gap: 6px; margin-bottom: 15px; border-bottom: 2px solid var(--border); padding-bottom: 10px; overflow-x: auto;">
                <button onclick="window.switchStudioTab('audioTab')" id="tabBtn_audioTab" class="studio-tab-btn active-tab" style="padding: 8px 14px; border-radius: 8px; background: var(--gold); color: #111; font-weight: bold; border: none; cursor: pointer; font-size: 12px;">🎙️ الصوت والمؤثرات</button>
                <button onclick="window.switchStudioTab('textTab')" id="tabBtn_textTab" class="studio-tab-btn" style="padding: 8px 14px; border-radius: 8px; background: var(--bg2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-size: 12px;">✍️ النص والشعار (سحب حر)</button>
                <button onclick="window.switchStudioTab('videoTab')" id="tabBtn_videoTab" class="studio-tab-btn" style="padding: 8px 14px; border-radius: 8px; background: var(--bg2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-size: 12px;">🎬 الأبعاد والأشكال والخلفيات</button>
                <button onclick="window.switchStudioTab('cinematicTab')" id="tabBtn_cinematicTab" class="studio-tab-btn" style="padding: 8px 14px; border-radius: 8px; background: var(--bg2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-size: 12px;">🌟 المؤثرات والإطارات</button>
        <button onclick="window.switchStudioTab('colorGradingTab')" id="tabBtn_colorGradingTab" class="studio-tab-btn" style="padding: 8px 14px; border-radius: 8px; background: var(--bg2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-size: 12px;">🎨 تصحيح الألوان والأنيميشن</button>
            <button onclick="window.switchStudioTab('stickersTab')" id="tabBtn_stickersTab" class="studio-tab-btn" style="padding: 8px 14px; border-radius: 8px; background: var(--bg2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-size: 12px;">🎨 الملصقات والطبقات (PiP)</button>
<button onclick="window.switchStudioTab('layersTab')" id="tabBtn_layersTab" class="studio-tab-btn" style="padding: 8px 14px; border-radius: 8px; background: var(--bg2); color: var(--text); border: 1px solid var(--border); cursor: pointer; font-size: 12px;">🥞 الطبقات والسجل</button>

            
            </div>



<!-- 🎨 6. تبويب الملصقات والـ Picture-in-Picture -->
<div id="tabContent_stickersTab" class="studio-tab-content" style="display: none;">
    <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px; font-size: 12px;">
        
        <!-- 🕌 قسم الملصقات والرموز الإسلامية -->
        <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 8px;">🕌 مكتبة الملصقات والرموز السريعة:</strong>
        <p style="color: var(--text2); margin-bottom: 10px; font-size: 11px;">اضغط على أي رمز لإضافته كطبقة عائمة على الفيديو (يمكنك سحبه بيدك على الشاشة):</p>
        
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">
            <button onclick="window.addTextSticker('﷽')" style="background:var(--card); color:var(--gold); border:1px solid var(--gold); padding:8px 12px; border-radius:8px; font-family:'Amiri',serif; font-size:16px; cursor:pointer;">﷽</button>
            <button onclick="window.addTextSticker('﴿ ۞ ﴾')" style="background:var(--card); color:var(--gold); border:1px solid var(--gold); padding:8px 12px; border-radius:8px; font-family:'Amiri',serif; font-size:16px; cursor:pointer;">﴿ ۞ ﴾</button>
            <button onclick="window.addTextSticker('ﷺ')" style="background:var(--card); color:var(--gold); border:1px solid var(--gold); padding:8px 12px; border-radius:8px; font-family:'Amiri',serif; font-size:16px; cursor:pointer;">ﷺ</button>
            <button onclick="window.addTextSticker('ﷻ')" style="background:var(--card); color:var(--gold); border:1px solid var(--gold); padding:8px 12px; border-radius:8px; font-family:'Amiri',serif; font-size:16px; cursor:pointer;">ﷻ</button>
            <button onclick="window.addTextSticker('🕌')" style="background:var(--card); border:1px solid var(--border); padding:8px 12px; border-radius:8px; font-size:18px; cursor:pointer;">🕌</button>
            <button onclick="window.addTextSticker('🌙')" style="background:var(--card); border:1px solid var(--border); padding:8px 12px; border-radius:8px; font-size:18px; cursor:pointer;">🌙</button>
            <button onclick="window.addTextSticker('📖')" style="background:var(--card); border:1px solid var(--border); padding:8px 12px; border-radius:8px; font-size:18px; cursor:pointer;">📖</button>
            <button onclick="window.addTextSticker('✨')" style="background:var(--card); border:1px solid var(--border); padding:8px 12px; border-radius:8px; font-size:18px; cursor:pointer;">✨</button>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display:block; color:var(--gold); font-weight:bold; margin-bottom:4px;">🖼️ أو ارفع ملصق خاص من جهازك (PNG مفرغ):</label>
            <input type="file" accept="image/*" onchange="window.handleCustomStickerUpload(event)" style="font-size:11px; color:var(--text);" />
        </div>

        <hr style="border:none; border-top:1px solid var(--border); margin: 15px 0;" />

        <!-- 📺 قسم Picture-in-Picture (فيديو/صورة فوق فيديو) -->
        <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 8px;">📺 طبقة عائمة (Picture in Picture):</strong>
        <label style="display:block; color:var(--text2); margin-bottom:4px;">رفع صورة / لوجو ثانوي كـ Overlay فوق الفيديو:</label>
        <input type="file" accept="image/*" onchange="window.handlePipOverlayUpload(event)" style="font-size:11px; color:var(--text); margin-bottom: 10px;" />

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
                <label style="display:block; color:var(--text2); margin-bottom:2px;">🔍 حجم الطبقة العائمة:</label>
                <input type="range" id="pipSizeSlider" min="50" max="500" value="150" oninput="window.updatePipConfig()" style="width:100%; accent-color:var(--gold);" />
            </div>
            <div>
                <label style="display:block; color:var(--text2); margin-bottom:2px;">👁️ الشفافية:</label>
                <input type="range" id="pipOpacitySlider" min="0.1" max="1.0" step="0.05" value="0.9" oninput="window.updatePipConfig()" style="width:100%; accent-color:var(--gold);" />
            </div>
        </div>

        <div style="margin-top: 10px; text-align: left;">
            <button onclick="window.clearAllStickersAndPip()" style="background:#ff4d4d; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px;">🗑️ حظر/حذف جميع الطبقات والملصقات</button>
        </div>
    </div>
</div>


<!-- 🥞 7. تبويب الطبقات والسجل وإدارة الأصول -->
<div id="tabContent_layersTab" class="studio-tab-content" style="display: none;">
    <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px; font-size: 12px;">
        
        <!-- 👁️ لوحة التحكم بالطبقات -->
        <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 10px;">🥞 لوحة إدارة الطبقات (Layers Panel):</strong>
        <div id="layersListContainer" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
            <!-- سيتم توليد أسطر الطبقات تلقائياً بواسطة الجافاسكريبت -->
        </div>

        <hr style="border:none; border-top:1px solid var(--border); margin: 15px 0;" />

        <!-- 📜 لوحة سجل الحركات History -->
        <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 8px;">📜 سجل العمليات (History Log):</strong>
        <div id="historyLogList" style="max-height: 120px; overflow-y: auto; background: #000; border: 1px solid var(--border); border-radius: 8px; padding: 8px; font-size: 11px; color: var(--text2);">
            <div style="color: var(--gold);">• بداية مشروع جديد</div>
        </div>
    </div>
</div>


<!-- 🚀 قسم القوالب الجاهزة السريعة (Templates) -->
            <div style="background: var(--bg2); padding: 12px; border-radius: 10px; border: 1px solid var(--gold); margin-bottom: 15px; font-size: 12px;">
                <strong style="color: var(--gold); display: block; margin-bottom: 8px;">⚡ قوالب المونتاج السريعة (Templates):</strong>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button onclick="window.applyAthrTemplate('dawah')" style="background: var(--card); color: var(--gold); border: 1px solid var(--gold); padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">🕌 قالب دعوي احترافي</button>
                    <button onclick="window.applyAthrTemplate('reels')" style="background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 6px 12px; border-radius: 6px; cursor: pointer;">📱 قالب ريلز / Shorts (9:16)</button>
                    <button onclick="window.applyAthrTemplate('youtube')" style="background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 6px 12px; border-radius: 6px; cursor: pointer;">📺 قالب يوتيوب (16:9)</button>
                </div>
            </div>


<!-- 🎨 5. تبويب تصحيح الألوان والكي فريمز -->
<div id="tabContent_colorGradingTab" class="studio-tab-content" style="display: none;">
    <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px; font-size: 12px;">
        <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 10px;">🎛️ تصحيح الألوان الاحترافي (Color Grading):</strong>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 15px;">
            <div>
                <label style="display:block; color:var(--text2); margin-bottom:2px;">☀️ التعريض / السطوع (Exposure):</label>
                <input type="range" id="adjExposure" min="-100" max="100" value="0" oninput="window.updateColorAdjustments()" style="width:100%; accent-color:var(--gold);">
            </div>
            <div>
                <label style="display:block; color:var(--text2); margin-bottom:2px;">🌓 التباين (Contrast):</label>
                <input type="range" id="adjContrast" min="-100" max="100" value="0" oninput="window.updateColorAdjustments()" style="width:100%; accent-color:var(--gold);">
            </div>
            <div>
                <label style="display:block; color:var(--text2); margin-bottom:2px;">🎨 التشبع (Saturation):</label>
                <input type="range" id="adjSaturation" min="-100" max="100" value="0" oninput="window.updateColorAdjustments()" style="width:100%; accent-color:var(--gold);">
            </div>
            <div>
                <label style="display:block; color:var(--text2); margin-bottom:2px;">🌈 درجة اللون (Hue):</label>
                <input type="range" id="adjHue" min="-180" max="180" value="0" oninput="window.updateColorAdjustments()" style="width:100%; accent-color:var(--gold);">
            </div>
        </div>

        <button onclick="window.resetColorAdjustments()" style="background:var(--card); color:var(--text2); border:1px solid var(--border); padding:6px 12px; border-radius:6px; cursor:pointer; font-size:11px;">🔄 إعادة ضبط الألوان</button>

        <hr style="border:none; border-top:1px solid var(--border); margin: 15px 0;" />

        <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 10px;">🔑 لوحة الكي فريمز (Keyframe Motion):</strong>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button onclick="window.addKeyframeAtPlayhead('logoScale')" style="background:var(--gold); color:#111; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px;">📌 إضافة نقطة زوم للشعار</button>
            <button onclick="window.addKeyframeAtPlayhead('textOpacity')" style="background:var(--gold); color:#111; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px;">📌 إضافة نقطة شفافية للنص</button>
            <button onclick="window.clearAllKeyframes()" style="background:#ff4d4d; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:11px;">🗑️ مسح جميع النقاط</button>
        </div>
    </div>
</div>




            <!-- 🎙️ 1. تبويب الصوت -->
            <div id="tabContent_audioTab" class="studio-tab-content">
                <div style="margin-bottom: 15px;">
                    <strong style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px;">⚡ البريسيتس السريعة بنقرة واحدة:</strong>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
                        <button onclick="window.applyStudioPreset('music')" style="background: var(--bg2); border: 1px solid var(--gold); color: var(--gold); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: bold;">🎬 عزل الموسيقى</button>
                        <button onclick="window.applyStudioPreset('mosque')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🕌 صدى المساجد</button>
                        <button onclick="window.applyStudioPreset('mic')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🎙️ تقوية المايك</button>
                        <button onclick="window.applyStudioPreset('clear')" style="background: var(--bg2); border: 1px solid var(--border); color: var(--text2); padding: 8px; border-radius: 8px; font-size: 12px; cursor: pointer;">🔄 إزالة التعديلات</button>
                    </div>
                </div>

                <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px;">
                    <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 12px;">🎛️ معادل الصوت والصدى والترميم:</strong>
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px; color: var(--text);">
                        <div>
                            <div style="display:flex; justify-content:space-between;"><span>🗣️ تضخيم الصوت البشري:</span> <span id="valVoice">100%</span></div>
                            <input type="range" id="sliderVoice" min="0" max="200" value="100" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between;"><span>🎼 كتم الترددات الحادة:</span> <span id="valTreble">0%</span></div>
                            <input type="range" id="sliderTreble" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between;"><span>🥁 كتم الإيقاعات والبيس:</span> <span id="valBass">0%</span></div>
                            <input type="range" id="sliderBass" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between;"><span>🕌 صدى الصوت المسجدي:</span> <span id="valReverb">إيقاف</span></div>
                            <input type="range" id="sliderReverb" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between;"><span>💨 إزالة النويز والوش:</span> <span id="valNoise">إيقاف</span></div>
                            <input type="range" id="sliderNoise" min="0" max="100" value="0" oninput="window.updateStudioAudioFilters()" style="width:100%; accent-color:var(--gold);">
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between;"><span>⚡ سرعة المقطع بدون تغيير النبرة:</span> <span id="valSpeed">1.0x</span></div>
                            <input type="range" id="sliderSpeed" min="0.75" max="2.0" step="0.05" value="1.0" oninput="window.updateStudioSpeed()" style="width:100%; accent-color:var(--gold);">
                        </div>
                    </div>

                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--border); font-size: 12px;">
                        <label style="display:block; color:var(--gold); font-weight:bold; margin-bottom:6px;">🍃 المؤثرات الصوتية الخلفية (أوفلاين):</label>
                        <select id="ambientSoundSelect" onchange="window.updateAmbientSound()" style="width:100%; padding:8px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border); margin-bottom:8px;">
                            <option value="none">بدون مؤثر خلفي</option>
                            <option value="rain">🌧️ صوت مطر ناعم</option>
                            <option value="birds">🍃 صوت عصافير وزقزقة طبيعة</option>
                            <option value="waves">🌊 صوت أمواج ومحيط هادئ</option>
                            <option value="wind">🍃 صوت هواء مساجد وروحانيات</option>
                        </select>

                        <label style="display:block; color:var(--text2); margin-bottom:4px;">🔊 مستوى صوت المؤثر الخلفي:</label>
                        <input type="range" id="ambientVol" min="0" max="1" step="0.05" value="0.3" oninput="window.updateAmbientVolume(this.value)" style="width:100%; accent-color:var(--gold); margin-bottom:8px;">

                        <label style="display:block; color:var(--text2); margin-bottom:4px;">📂 أو اختر مؤثر من جهازك (MP3/WAV):</label>
                        <input type="file" accept="audio/*" onchange="window.handleUserAmbientAudio(event)" style="font-size:11px; color:var(--text);" />
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; pt: 10px; border-top: 1px solid var(--border);">
                        <button id="toggleCompareBtn" onclick="window.toggleStudioLiveCompare()" style="flex: 1; background: rgba(212,175,55,0.15); color: var(--gold); border: 1px solid var(--gold); padding: 8px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">
                            🔄 المقارنة الحية: (الصوت المنقى)
                        </button>
                        <button onclick="window.fixStereoToMono()" style="background: var(--card); color: var(--text); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;">
                            🎧 إصلاح السماعة الواحدة
                        </button>
                    </div>
                </div>
            </div>

            <!-- ✍️ 2. تبويب النصوص -->
            <div id="tabContent_textTab" class="studio-tab-content" style="display: none;">
                <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px;">
                    <strong style="color: var(--gold); font-size: 14px; display: block; margin-bottom: 8px;">✍️ كتابة النصوص والآيات للشاشة:</strong>
                    <input type="text" id="studioTextInput" placeholder="اكتب النص هنا (مثلاً: ﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾)" oninput="window.updateStudioTextConfig()" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--card); color: var(--text); font-size: 14px; font-family: 'Amiri', serif; margin-bottom: 10px; box-sizing: border-box;" />

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; font-size: 12px; margin-bottom: 15px;">
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">نوع الخط العربي:</label>
                            <select id="studioFontFamily" onchange="window.updateStudioTextConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                                <option value="'Amiri', serif">خط أميري (مصحفي)</option>
                                <option value="'Cairo', sans-serif">خط القاهرة (حديث)</option>
                                <option value="'Tajawal', sans-serif">خط تجوال (ناعم)</option>
                                <option value="'Reem Kufi', sans-serif">خط كوفي (عريق)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">حجم الخط:</label>
                            <input type="range" id="studioFontSize" min="16" max="64" value="32" oninput="window.updateStudioTextConfig()" style="width:100%; accent-color:var(--gold);">
                        </div>
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">لون النص / الخلفية:</label>
                            <div style="display:flex; gap:6px;">
                                <input type="color" id="studioTextColor" value="#ffffff" onchange="window.updateStudioTextConfig()" style="border:none; width:30px; height:28px; cursor:pointer; background:none;">
                                <input type="color" id="studioTextBgColor" value="#000000" onchange="window.updateStudioTextConfig()" style="border:none; width:30px; height:28px; cursor:pointer; background:none;">
                            </div>
                        </div>
                    </div>

                    <div style="padding-top: 10px; border-top: 1px solid var(--border); font-size: 12px;">
                        <label style="display:block; color:var(--gold); font-weight:bold; margin-bottom:4px;">🖼️ الشعار والواترمارك (PNG مفرغ):</label>
                        <input type="file" id="logoFileInput" accept="image/*" onchange="window.handleLogoUpload(event)" style="font-size:11px; color:var(--text); margin-bottom: 8px;" />
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:2px;">حجم الشعار:</label>
                            <input type="range" id="logoSizeSlider" min="40" max="250" value="100" oninput="window.updateLogoSize(this.value)" style="width:100%; accent-color:var(--gold);">
                        </div>
                    </div>
                </div>
            </div>

            <!-- 🎬 3. تبويب الأبعاد والأشكال والخلفيات -->
            <div id="tabContent_videoTab" class="studio-tab-content" style="display: none;">
                <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px; font-size: 12px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">أبعاد الفيديو:</label>
                            <select id="studioAspectRatio" onchange="window.updateStudioLayoutConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                                <option value="16:9">📺 عريض (16:9)</option>
                                <option value="9:16">📱 طولي (9:16 - Reels)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">نمط خلفية الـ 9:16:</label>
                            <select id="aspectBgStyleSelect" onchange="window.updateStudioLayoutConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                                <option value="dark">أسود داكن راقي</option>
                                <option value="blur">خلفية ضبابية مموهة</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">دوران الفيديو:</label>
                            <button onclick="window.rotateStudioVideo()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--gold); border:1px solid var(--gold); cursor:pointer; font-weight:bold;">🔄 تدوير 90°</button>
                        </div>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="display:block; color:var(--text2); margin-bottom:4px;">🎭 شكل كادر الفيديو (Video Mask):</label>
                        <select id="videoMaskSelect" onchange="window.studioEngine.videoMaskShape = this.value" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                            <option value="none">مستطيل عادي (كلاسيكي)</option>
                            <option value="rounded">حواف مدورة ناعمة (Rounded)</option>
                            <option value="circle">شكل دائري / بيضاوي (Circle)</option>
                            <option value="arch">قوس محراب إسلامي (Islamic Arch)</option>
                        </select>
                    </div>

                    <!-- 🖼️ قسم الخلفية المخصصة -->
                    <div style="padding-top: 10px; border-top: 1px solid var(--border); margin-top: 10px;">
                        <label style="display:block; color:var(--gold); font-weight:bold; margin-bottom:6px;">🖼️ رفع صورة خلفية مخصصة من جهازك:</label>
                        <input type="file" accept="image/*" onchange="window.handleStudioBgImageUpload(event)" style="font-size:11px; color:var(--text); margin-bottom:10px;" />

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <label style="display:block; color:var(--text2); margin-bottom:2px;">👁️ شفافية الصورة:</label>
                                <input type="range" id="bgOpacitySlider" min="0.1" max="1.0" step="0.05" value="1.0" oninput="window.updateBgImageConfig()" style="width:100%; accent-color:var(--gold);" />
                            </div>
                            <div>
                                <label style="display:block; color:var(--text2); margin-bottom:2px;">🔍 حجم / زوم الصورة:</label>
                                <input type="range" id="bgScaleSlider" min="0.5" max="3.0" step="0.1" value="1.0" oninput="window.updateBgImageConfig()" style="width:100%; accent-color:var(--gold);" />
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 15px; color: var(--text); margin-top: 15px;">
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="enableMirrorFlipCheck" onchange="window.updateStudioLayoutConfig()" style="accent-color:var(--gold);" />
                            🪞 العكس الأفقي للمشهد (Mirror Flip)
                        </label>
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="enableBlurBoxCheck" onchange="window.updateStudioBlurConfig()" style="accent-color:var(--gold);" />
                            𔲲 مربع التمويه الذكي
                        </label>
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="enableGridLinesCheck" onchange="window.updateStudioLayoutConfig()" style="accent-color:var(--gold);" />
                            📐 شبكة التنسيق والمحاذاة
                        </label>
                    </div>
                </div>
            </div>

            <!-- 🌟 4. تبويب المؤثرات والإطارات -->
            <div id="tabContent_cinematicTab" class="studio-tab-content" style="display: none;">
                <div style="background: var(--bg2); padding: 15px; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 15px; font-size: 12px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">اسم الشيخ / المتحدث:</label>
                            <input type="text" id="speakerNameInput" placeholder="مثلاً: فضيلة الشيخ علاء حامد" oninput="window.updateStudioCinematicConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);" />
                        </div>
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">عنوان الدرس / الموعظة:</label>
                            <input type="text" id="lessonTitleInput" placeholder="مثلاً: أحكام التجويد" oninput="window.updateStudioCinematicConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);" />
                        </div>
                        <div>
                            <label style="display:block; color:var(--text2); margin-bottom:4px;">الفلتر السينمائي:</label>
                            <select id="studioColorFilter" onchange="window.updateStudioLayoutConfig()" style="width:100%; padding:6px; border-radius:6px; background:var(--card); color:var(--text); border:1px solid var(--border);">
                                <option value="none">طبيعي (بدون فلتر)</option>
                                <option value="warm-gold">📜 ذهبي دافئ</option>
                                <option value="cinematic">🎬 سينمائي داكن</option>
                                <option value="bw">⚪ أبيض وأسود</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 15px; color: var(--text); margin-top: 10px;">
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="islamicFrameCheck" onchange="window.updateStudioCinematicConfig()" style="accent-color:var(--gold);" />
                            🖼️ الإطار الذهبي الإسلامي
                        </label>
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="fadeCheck" checked onchange="window.updateStudioCinematicConfig()" style="accent-color:var(--gold);" />
                            🎬 التلاشي السينمائي (Fade In/Out)
                        </label>
                        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                            <input type="checkbox" id="vignetteCheck" onchange="window.updateStudioCinematicConfig()" style="accent-color:var(--gold);" />
                            🎯 التركيز الدائري (Vignette)
                        </label>
                    </div>
                </div>
            </div>

            <!-- ⚙️ إعدادات التصدير -->
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
                </div>
            </div>

            <!-- 📥 أزرار التصدير والتنزيل -->
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

    window.setupCanvasDragAndDrop();
};

// 📑 التنقل بين التابات
window.switchStudioTab = function(tabId) {
    const contents = document.querySelectorAll('.studio-tab-content');
    contents.forEach(c => c.style.display = 'none');

    const btns = document.querySelectorAll('.studio-tab-btn');
    btns.forEach(b => {
        b.style.background = 'var(--bg2)';
        b.style.color = 'var(--text)';
        b.style.border = '1px solid var(--border)';
    });

    const activeContent = document.getElementById(`tabContent_${tabId}`);
    if (activeContent) activeContent.style.display = 'block';

    const activeBtn = document.getElementById(`tabBtn_${tabId}`);
    if (activeBtn) {
        activeBtn.style.background = 'var(--gold)';
        activeBtn.style.color = '#111';
        activeBtn.style.border = 'none';
    }
};

// 🎞️ 2. محرك التايم لاين البصري والتقسيم والحذف
// 🎞️ 2. محرك التايم لاين البصري المطور (Multitrack Engine)

window.updateTimelineZoom = function(val) {
    const e = window.studioEngine;
    e.timelineZoom = parseFloat(val);
    const label = document.getElementById('zoomValLabel');
    if (label) label.textContent = `${Math.round(e.timelineZoom * 100)}%`;
    window.renderTimelineUI();
};

window.renderTimelineUI = function() {
    const track = document.getElementById('timelineTrack');
    if (!track) return;

    const e = window.studioEngine;
    track.innerHTML = '';

    // رسم مسارات المشروع (Tracks)
    e.projectState.tracks.forEach(tr => {
        const trackHeader = document.createElement('div');
        trackHeader.style.cssText = "font-size:11px; color:var(--gold); font-weight:bold; margin-bottom:2px; text-align:right;";
        trackHeader.textContent = tr.name;
        track.appendChild(trackHeader);

        const trackRow = document.createElement('div');
        trackRow.style.cssText = "display: flex; gap: 4px; align-items: center; background: rgba(255,255,255,0.03); padding: 6px; border-radius: 6px; min-height: 45px; border: 1px dashed rgba(212,175,55,0.2);";

        if (tr.type === 'video') {
            e.clips.forEach((clip, idx) => {
                const clipDiv = document.createElement('div');
             const zoomPadding = Math.round(14 * e.timelineZoom);
            clipDiv.style.cssText = `
                background: ${idx === e.selectedClipIndex ? '#d4af37' : '#1a2920'};
                color: ${idx === e.selectedClipIndex ? '#111' : '#fff'};
                padding: 8px ${zoomPadding}px;
                border-radius: 6px;
                cursor: pointer;
                font-size: ${Math.max(10, Math.round(11 * e.timelineZoom))}px;
                font-weight: bold;
                white-space: nowrap;
                border: 1px solid var(--border);
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.1s ease;
            `;
                clipDiv.innerHTML = `🎬 كليب ${idx + 1} (${(clip.end - clip.start).toFixed(1)}s)`;
                clipDiv.onclick = () => {
                    e.selectedClipIndex = idx;
                    e.videoElement.currentTime = clip.start;
                    window.renderTimelineUI();
                };

                trackRow.appendChild(clipDiv);

                if (idx < e.clips.length - 1) {
                    const transBtn = document.createElement('button');
                    const currentTrans = e.transitions[idx] || 'none';
                    transBtn.style.cssText = "background: #005485; color: #fff; border: 1px solid var(--gold); border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 10px; display: flex; align-items: center; justify-content: center;";
                    transBtn.innerHTML = currentTrans !== 'none' ? '✨' : '⧉';
                    transBtn.title = 'تغيير نوع الانتقال بين المقطعين';
                    transBtn.onclick = () => window.openTransitionMenu(idx);
                    trackRow.appendChild(transBtn);
                }
            });
        } else {
            trackRow.innerHTML = `<span style="font-size:10px; color:var(--text2);">لا توجد عناصر في هذا المسار بعد</span>`;
        }

        track.appendChild(trackRow);
    });

// ✂️ إضافة مقابض قص الحواف (Trim Handles) للكليب المحدد
    const trimContainer = document.getElementById('clipTrimControls');
    const selectedClip = e.clips[e.selectedClipIndex];
    if (selectedClip && e.videoElement) {
        if (!trimContainer) {
            const trackParent = document.getElementById('timelineTrack')?.parentElement;
            if (trackParent) {
                const div = document.createElement('div');
                div.id = 'clipTrimControls';
                div.style.cssText = "display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:10px; font-size:11px; color:var(--text2); background:var(--card); padding:8px; border-radius:8px; border:1px solid var(--border);";
                div.innerHTML = `
                    <span>✂️ قص بداية الكليب: <input type="range" id="trimStartSlider" step="0.1" oninput="window.updateClipTrim()" style="accent-color:var(--gold); width:100px;"> <b id="trimStartVal">0s</b></span>
                    <span>✂️ قص نهاية الكليب: <input type="range" id="trimEndSlider" step="0.1" oninput="window.updateClipTrim()" style="accent-color:var(--gold); width:100px;"> <b id="trimEndVal">0s</b></span>
                `;
                trackParent.appendChild(div);
            }
        }

        const startSlider = document.getElementById('trimStartSlider');
        const endSlider = document.getElementById('trimEndSlider');
        if (startSlider && endSlider) {
            startSlider.max = selectedClip.end - 0.5;
            startSlider.value = selectedClip.start;
            endSlider.min = selectedClip.start + 0.5;
            endSlider.max = e.videoElement.duration || 100;
            endSlider.value = selectedClip.end;

            document.getElementById('trimStartVal').textContent = `${selectedClip.start.toFixed(1)}s`;
            document.getElementById('trimEndVal').textContent = `${selectedClip.end.toFixed(1)}s`;
        }
    }
    
};

// ✂️ التقسيم عند المؤشر الحالي
window.splitClipAtPlayhead = function() {
    const e = window.studioEngine;
    const v = e.videoElement;
    if (!v || e.clips.length === 0) return;

    const curTime = v.currentTime;
    const curClip = e.clips[e.selectedClipIndex];

    if (curTime > curClip.start + 0.5 && curTime < curClip.end - 0.5) {
        const newClip1 = { id: Date.now(), start: curClip.start, end: curTime };
        const newClip2 = { id: Date.now() + 1, start: curTime, end: curClip.end };

        e.clips.splice(e.selectedClipIndex, 1, newClip1, newClip2);
        document.getElementById('studioStatusLog').textContent = `✂️ تم تقسيم المقطع بنجاح عند الثانية ${curTime.toFixed(1)}!`;
        window.renderTimelineUI();
    } else {
        alert("ضع مؤشر التشغيل في منتصف الكليب للتمكن من التقسيم!");
    }
};

// 🗑️ حذف الكليب المحدد
window.deleteSelectedClip = function() {
    const e = window.studioEngine;
    if (e.clips.length <= 1) {
        alert("لا يمكن حذف المقطع الوحيد المتبقي!");
        return;
    }

    e.clips.splice(e.selectedClipIndex, 1);
    e.selectedClipIndex = Math.max(0, e.selectedClipIndex - 1);
    e.videoElement.currentTime = e.clips[e.selectedClipIndex].start;
    
    document.getElementById('studioStatusLog').textContent = "🗑️ تم حذف الكليب المحدد بنجاح!";
    window.renderTimelineUI();
};

// 🔄 قائمة انتقالات احترافية
window.openTransitionMenu = function(clipIdx) {
    let menu = document.getElementById('transitionMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'transitionMenu';
        menu.style.cssText = "position:fixed; top:20%; right:20%; width:300px; background:#1a1a1a; border:2px solid var(--gold); border-radius:15px; padding:20px; z-index:9999; color:#fff; font-family:sans-serif; text-align:center;";
        document.body.appendChild(menu);
    }
    
    menu.innerHTML = `
        <h4 style="margin-top:0; color:var(--gold);">اختر التأثير البصري:</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button onclick="window.setTransition(${clipIdx}, 'fade')" style="padding:10px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">1. تلاشي ناعم (Fade)</button>
            <button onclick="window.setTransition(${clipIdx}, 'slide')" style="padding:10px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">2. انزلاق جانبي (Slide)</button>
            <button onclick="window.setTransition(${clipIdx}, 'zoom')" style="padding:10px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">3. زوم خاطف (Zoom)</button>
            <button onclick="window.setTransition(${clipIdx}, 'rotate')" style="padding:10px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer;">4. انقلاب (Rotate)</button>
        </div>
        <button onclick="document.getElementById('transitionMenu').style.display='none'" style="margin-top:15px; width:100%; padding:8px; background:#ff4d4d; color:#fff; border:none; border-radius:5px; cursor:pointer;">إلغاء</button>
    `;
    menu.style.display = 'block';
};

window.setTransition = function(clipIdx, type) {
    window.studioEngine.transitions[clipIdx] = type;
    document.getElementById('transitionMenu').style.display = 'none';
    document.getElementById('studioStatusLog').textContent = `✨ تم تفعيل تأثير (${type}) بنجاح!`;
    window.renderTimelineUI();
};

// 📂 معالجة رفع الفيديو
// 📂 معالجة رفع الفيديو
window.handleStudioFileUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    window.studioEngine.originalFileSize = file.size;
    document.getElementById('studioFileName').textContent = `📹 الملف المختار: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    
    const video = document.getElementById('studioVideoPlayer');
    const videoURL = URL.createObjectURL(file);
    video.src = videoURL;
    
    window.studioEngine.videoElement = video;
    window.studioEngine.renderCanvas = document.getElementById('studioCanvas');
    window.studioEngine.renderCtx = window.studioEngine.renderCanvas.getContext('2d');

    document.getElementById('studioWorkArea').style.display = 'block';

    video.onloadeddata = () => {
        window.studioEngine.clips = [{ id: 1, start: 0, end: video.duration }];
        window.studioEngine.selectedClipIndex = 0;
        window.renderTimelineUI();
        window.updateStudioLayoutConfig();
        window.updateEstimatedSize();
        // 🚀 بدء محرك الرسم فوراً حتى أثناء إيقاف الفيديو لرؤية الملصقات والنصوص لحظياً
        window.startCanvasRenderLoop();
    };

    video.onplay = () => {
        window.initStudioAudioEngine();
        if (window.studioEngine.ambientAudioEl) {
            window.studioEngine.ambientAudioEl.play();
        }
        window.drawAudioWaveform();
    };

    video.onpause = () => {
        if (window.studioEngine.ambientAudioEl) {
            window.studioEngine.ambientAudioEl.pause();
        }
    };
};

// 🖱️ نظام السحب الحر
window.setupCanvasDragAndDrop = function() {
    const canvas = document.getElementById('studioCanvas');
    if (!canvas) return;

    const getCanvasCoords = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrag = (e) => {
        const coords = getCanvasCoords(e);
        const engine = window.studioEngine;

        if (engine.logoImage) {
            const logoW = engine.logoSize * (canvas.width / 1000);
            const logoH = logoW * (engine.logoImage.height / engine.logoImage.width);
            if (coords.x >= engine.logoX && coords.x <= engine.logoX + logoW &&
                coords.y >= engine.logoY && coords.y <= engine.logoY + logoH) {
                engine.isDragging = true;
                engine.dragTarget = 'logo';
                engine.dragOffsetX = coords.x - engine.logoX;
                engine.dragOffsetY = coords.y - engine.logoY;
                return;
            }
        }

        if (engine.speakerName || engine.lessonTitle) {
            const bWidth = canvas.width * 0.55;
            const bHeight = 85;
            if (coords.x >= engine.bannerX && coords.x <= engine.bannerX + bWidth &&
                coords.y >= engine.bannerY && coords.y <= engine.bannerY + bHeight) {
                engine.isDragging = true;
                engine.dragTarget = 'banner';
                engine.dragOffsetX = coords.x - engine.bannerX;
                engine.dragOffsetY = coords.y - engine.bannerY;
                return;
            }
        }

// فحص سحب طبقة الـ PiP
        if (engine.pipOverlayImage) {
            if (coords.x >= engine.pipX && coords.x <= engine.pipX + engine.pipSize &&
                coords.y >= engine.pipY && coords.y <= engine.pipY + engine.pipSize) {
                engine.isDragging = true;
                engine.dragTarget = 'pip';
                engine.dragOffsetX = coords.x - engine.pipX;
                engine.dragOffsetY = coords.y - engine.pipY;
                return;
            }
        }




        
        if (engine.enableBlurBox) {
            if (coords.x >= engine.blurBoxX && coords.x <= engine.blurBoxX + engine.blurBoxW &&
                coords.y >= engine.blurBoxY && coords.y <= engine.blurBoxY + engine.blurBoxH) {
                engine.isDragging = true;
                engine.dragTarget = 'blur';
                engine.dragOffsetX = coords.x - engine.blurBoxX;
                engine.dragOffsetY = coords.y - engine.blurBoxY;
                return;
            }
        }

        if (engine.overlayText) {
            engine.isDragging = true;
            engine.dragTarget = 'text';
            engine.dragOffsetX = coords.x - engine.textX;
            engine.dragOffsetY = coords.y - engine.textY;
        }
    };

    const doDrag = (e) => {
        const engine = window.studioEngine;
        if (!engine.isDragging) return;

        const coords = getCanvasCoords(e);

        if (engine.dragTarget === 'logo') {
            engine.logoX = coords.x - engine.dragOffsetX;
            engine.logoY = coords.y - engine.dragOffsetY;
        } else if (engine.dragTarget === 'text') {
            engine.textX = coords.x - engine.dragOffsetX;
            engine.textY = coords.y - engine.dragOffsetY;
        } else if (engine.dragTarget === 'blur') {
            engine.blurBoxX = coords.x - engine.dragOffsetX;
            engine.blurBoxY = coords.y - engine.dragOffsetY;
        } else if (engine.dragTarget === 'banner') {
            engine.bannerX = coords.x - engine.dragOffsetX;
            engine.bannerY = coords.y - engine.dragOffsetY;
        }
    };

if (engine.dragTarget === 'pip') {
            engine.pipX = coords.x - engine.dragOffsetX;
            engine.pipY = coords.y - engine.dragOffsetY;
        }

    
    const stopDrag = () => {
        window.studioEngine.isDragging = false;
        window.studioEngine.dragTarget = null;
    };

    canvas.onmousedown = startDrag;
    canvas.onmousemove = doDrag;
    canvas.onmouseup = stopDrag;

    canvas.ontouchstart = startDrag;
    canvas.ontouchmove = doDrag;
    canvas.ontouchend = stopDrag;
};

// 🖼️ رفع الشعار
window.handleLogoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        window.studioEngine.logoImage = img;
        window.studioEngine.logoX = window.studioEngine.renderCanvas.width - 150;
        window.studioEngine.logoY = 30;
        document.getElementById('studioStatusLog').textContent = "✅ تم إضافة اللوجو! يمكنك تحريكه بسحبه بيدك.";
    };
    img.src = URL.createObjectURL(file);
};

window.updateLogoSize = function(val) {
    window.studioEngine.logoSize = parseInt(val);
};

// 🍃 المؤثرات الصوتية
window.updateAmbientSound = function() {
    const type = document.getElementById('ambientSoundSelect').value;
    const e = window.studioEngine;
    e.ambientType = type;

    if (!e.audioCtx) return;

    if (e.ambientNode) {
        try { e.ambientNode.stop(); } catch(err){}
        e.ambientNode = null;
    }

    if (type === 'none') return;

    const bufferSize = e.audioCtx.sampleRate * 2;
    const noiseBuffer = e.audioCtx.createBuffer(1, bufferSize, e.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = e.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = e.audioCtx.createBiquadFilter();
    const ambGain = e.audioCtx.createGain();

    if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        ambGain.gain.value = 0.08;
    } else if (type === 'birds') {
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        ambGain.gain.value = 0.04;
    } else if (type === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        ambGain.gain.value = 0.12;
    } else {
        filter.type = 'highpass';
        filter.frequency.value = 800;
        ambGain.gain.value = 0.05;
    }

    whiteNoise.connect(filter);
    filter.connect(ambGain);
    ambGain.connect(e.audioCtx.destination);

    whiteNoise.start();
    e.ambientNode = whiteNoise;
    e.ambientGainNode = ambGain;

    document.getElementById('studioStatusLog').textContent = `🍃 تم تشغيل مؤثر (${type}) أوفلاين بنجاح!`;
};

// ⚙️ محرك الصوت
window.initStudioAudioEngine = function() {
    if (window.studioEngine.audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const video = window.studioEngine.videoElement;

    const source = ctx.createMediaElementSource(video);

    const voiceFilter = ctx.createBiquadFilter();
    voiceFilter.type = 'peaking';
    voiceFilter.frequency.value = 1200;

    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 3200;

    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 250;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'notch';
    noiseFilter.frequency.value = 60;

    const reverbDelay = ctx.createDelay();
    reverbDelay.delayTime.value = 0.08;
    const reverbFeedback = ctx.createGain();
    reverbFeedback.gain.value = 0.3;
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.0;

    reverbDelay.connect(reverbFeedback);
    reverbFeedback.connect(reverbDelay);
    reverbDelay.connect(reverbGain);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;

    const gainNode = ctx.createGain();
    const analyser = ctx.createAnalyser();

    source.connect(voiceFilter);
    voiceFilter.connect(trebleFilter);
    trebleFilter.connect(bassFilter);
    bassFilter.connect(noiseFilter);

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
        gainNode,
        analyserNode: analyser
    };

    window.updateStudioAudioFilters();
};

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

window.updateStudioTextConfig = function() {
    const e = window.studioEngine;
    e.overlayText = document.getElementById('studioTextInput').value;
    e.textFont = document.getElementById('studioFontFamily').value;
    e.textSize = parseInt(document.getElementById('studioFontSize').value);
    e.textColor = document.getElementById('studioTextColor').value;
    e.textBgColor = document.getElementById('studioTextBgColor').value;
};

window.updateStudioLayoutConfig = function() {
    const e = window.studioEngine;
    e.aspectRatio = document.getElementById('studioAspectRatio')?.value || "16:9";
    e.aspectBgStyle = document.getElementById('aspectBgStyleSelect')?.value || "dark";
    e.colorFilter = document.getElementById('studioColorFilter')?.value || "none";
    e.showProgressBar = document.getElementById('studioProgressBarCheck')?.checked ?? true;
    e.showOutroCard = document.getElementById('studioOutroCardCheck')?.checked ?? true;
    e.enableMirrorFlip = document.getElementById('enableMirrorFlipCheck')?.checked ?? false;
    e.enableGridLines = document.getElementById('enableGridLinesCheck')?.checked ?? false;

    const canvas = e.renderCanvas;
    if (!canvas) return;

    if (e.aspectRatio === "9:16") {
        canvas.width = 720;
        canvas.height = 1280;
    } else {
        canvas.width = 1280;
        canvas.height = 720;
    }
    
    e.textX = canvas.width / 2;
    e.textY = canvas.height * 0.8;
    e.logoX = canvas.width - 150;
    e.logoY = 40;

    window.updateEstimatedSize();
};

window.updateStudioBlurConfig = function() {
    window.studioEngine.enableBlurBox = document.getElementById('enableBlurBoxCheck').checked;
};

window.rotateStudioVideo = function() {
    const e = window.studioEngine;
    e.rotationAngle = (e.rotationAngle + 90) % 360;
    document.getElementById('studioStatusLog').textContent = `🔄 تم تدوير الفيديو بـ ${e.rotationAngle} درجة!`;
};

window.updateStudioCinematicConfig = function() {
    const e = window.studioEngine;
    e.speakerName = document.getElementById('speakerNameInput')?.value || "";
    e.lessonTitle = document.getElementById('lessonTitleInput')?.value || "";
    e.enableFadeInOut = document.getElementById('fadeCheck')?.checked || false;
    e.enableVignette = document.getElementById('vignetteCheck')?.checked || false;
    e.enableIslamicFrame = document.getElementById('islamicFrameCheck')?.checked || false;
};

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

window.fixStereoToMono = function() {
    const e = window.studioEngine;
    if (!e.audioCtx) return;

    const merger = e.audioCtx.createChannelMerger(1);
    e.sourceNode.disconnect();
    e.sourceNode.connect(merger);
    merger.connect(e.voiceFilter);
    document.getElementById('studioStatusLog').textContent = "✅ تم دمج وتوزيع الصوت ليخرج من السماعتين بكفاءة!";
};

// 🎥 5. محرك الرسم والتصميم المتقدم بالانتقالات والقناع والخلفيات
// 🎥 5. محرك الرسم والتصميم المتقدم بالانتقالات والقناع والخلفيات (مع حماية وإخفاء الطبقات)
window.startCanvasRenderLoop = function() {
    const e = window.studioEngine;
    const video = e.videoElement;
    const canvas = e.renderCanvas;
    const ctx = e.renderCtx;

    if (!video || !canvas || !ctx) return;

    function drawFrame() {
        // 1. التحكم بحدود الكليب (التايم لاين) فقط أثناء التشغيل
        if (!video.paused && !video.ended) {
            const currentClip = e.clips[e.selectedClipIndex];
            if (currentClip && video.currentTime >= currentClip.end) {
                if (e.selectedClipIndex < e.clips.length - 1) {
                    e.selectedClipIndex++;
                    video.currentTime = e.clips[e.selectedClipIndex].start;
                    window.renderTimelineUI();
                } else {
                    video.currentTime = e.clips[0].start;
                    e.selectedClipIndex = 0;
                    window.renderTimelineUI();
                }
            }
        }

        const currentClip = e.clips[e.selectedClipIndex];
        const timeInClip = video.currentTime - (currentClip ? currentClip.start : 0);
        const transType = e.transitions[e.selectedClipIndex - 1] || 'none';
        const transDuration = 1.0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // 🎨 أ) رسم خلفية الشاشة (صورة مخصصة أو مموهة أو أسود)
        if (e.bgCustomImage) {
            ctx.save();
            ctx.globalAlpha = e.bgImageOpacity;
            const scale = e.bgImageScale || 1.0;
            const imgW = canvas.width * scale;
            const imgH = canvas.height * scale;
            const imgX = (canvas.width - imgW) / 2;
            const imgY = (canvas.height - imgH) / 2;
            ctx.drawImage(e.bgCustomImage, imgX, imgY, imgW, imgH);
            ctx.restore();
        } else if (e.aspectBgStyle === "blur") {
            ctx.save();
            ctx.filter += ' blur(25px) brightness(0.4)';
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        } else {
            ctx.fillStyle = "#0a0f0d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 🎭 ب) تطبيق قناع الشكل على الفيديو (Video Masking)
        const mask = e.videoMaskShape || 'none';
        if (mask !== 'none') {
            ctx.beginPath();
            if (mask === 'rounded') {
                const rx = 0, ry = 0, rw = canvas.width, rh = canvas.height, radius = 40;
                ctx.roundRect(rx + 15, ry + 15, rw - 30, rh - 30, radius);
            } else if (mask === 'circle') {
                ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width * 0.42, canvas.height * 0.42, 0, 0, 2 * Math.PI);
            } else if (mask === 'arch') {
                const w = canvas.width, h = canvas.height;
                ctx.moveTo(w * 0.1, h);
                ctx.lineTo(w * 0.1, h * 0.35);
                ctx.quadraticCurveTo(w * 0.1, h * 0.05, w * 0.5, h * 0.05);
                ctx.quadraticCurveTo(w * 0.9, h * 0.05, w * 0.9, h * 0.35);
                ctx.lineTo(w * 0.9, h);
                ctx.closePath();
            }
            ctx.clip();
        }

        // --- جـ) تطبيق منطق الانتقالات البصرية ---
        if (timeInClip < transDuration && transType !== 'none') {
            const progress = timeInClip / transDuration;
            if (transType === 'fade') {
                ctx.globalAlpha = progress;
            } else if (transType === 'slide') {
                ctx.translate((1 - progress) * canvas.width, 0);
            } else if (transType === 'zoom') {
                const scale = 0.5 + (progress * 0.5);
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.scale(scale, scale);
                ctx.translate(-canvas.width/2, -canvas.height/2);
            } else if (transType === 'rotate') {
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(progress * 2 * Math.PI);
                ctx.translate(-canvas.width/2, -canvas.height/2);
            }
        }

        // د) رسم محتوى الفيديو الرئيسي (مع فحص حالة ظهور طبقة الفيديو)
        const isVideoVisible = e.layerSettings && e.layerSettings.video ? e.layerSettings.video.visible : true;
        
        if (isVideoVisible) {
            if (e.enableMirrorFlip) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            if (e.rotationAngle !== 0) {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((e.rotationAngle * Math.PI) / 180);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
            }

            // 🎨 تطبيق فلاتر الألوان والـ Advanced Color Grading
            let filterStr = "";
            if (e.colorFilter === 'warm-gold') filterStr += 'sepia(0.35) contrast(1.1) brightness(1.05)';
            else if (e.colorFilter === 'cinematic') filterStr += 'contrast(1.25) saturate(1.15) brightness(0.95)';
            else if (e.colorFilter === 'bw') filterStr += 'grayscale(1) contrast(1.2)';

            if (e.colorAdjustments) {
                const ca = e.colorAdjustments;
                if (ca.exposure) filterStr += ` brightness(${1 + ca.exposure / 100})`;
                if (ca.contrast) filterStr += ` contrast(${1 + ca.contrast / 100})`;
                if (ca.saturation) filterStr += ` saturate(${1 + ca.saturation / 100})`;
                if (ca.hue) filterStr += ` hue-rotate(${ca.hue}deg)`;
            }

            if (filterStr.trim() !== "") {
                ctx.filter = filterStr.trim();
            }

            if (e.aspectRatio === "9:16") {
                const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
                const drawW = video.videoWidth * scale;
                const drawH = video.videoHeight * scale;
                ctx.drawImage(video, (canvas.width - drawW) / 2, (canvas.height - drawH) / 2, drawW, drawH);
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        }

        ctx.restore(); // نهاية رسم الفيديو

        // 📺 1. رسم طبقة الـ Picture-in-Picture (مع فحص زر الإظهار 👁️)
        const isPipVisible = e.layerSettings && e.layerSettings.pip ? e.layerSettings.pip.visible : true;
        if (e.pipOverlayImage && isPipVisible) {
            ctx.save();
            ctx.globalAlpha = e.pipOpacity || 0.9;
            const pRatio = e.pipOverlayImage.height / e.pipOverlayImage.width;
            ctx.drawImage(e.pipOverlayImage, e.pipX, e.pipY, e.pipSize, e.pipSize * pRatio);
            ctx.restore();
        }

        // 🕌 2. رسم كافة الملصقات والرموز المضافة (مع فحص زر الإظهار 👁️)
        const isStickersVisible = e.layerSettings && e.layerSettings.stickers ? e.layerSettings.stickers.visible : true;
        if (e.stickersList && e.stickersList.length > 0 && isStickersVisible) {
            e.stickersList.forEach(stk => {
                ctx.save();
                ctx.globalAlpha = stk.opacity || 1.0;
                if (stk.type === 'text') {
                    ctx.font = `${stk.size || 55}px 'Amiri', serif`;
                    ctx.fillStyle = "#d4af37";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(stk.content, stk.x, stk.y);
                } else if (stk.type === 'image' && stk.imgElement) {
                    const imgH = stk.size * (stk.imgElement.height / stk.imgElement.width);
                    ctx.drawImage(stk.imgElement, stk.x, stk.y, stk.size, imgH);
                }
                ctx.restore();
            });
        }

        // 3. العناصر الثابتة (الإطار والـ Vignette)
        if (e.enableVignette) {
            const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.width*0.2, canvas.width/2, canvas.height/2, canvas.width*0.65);
            grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,0.7)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (e.enableIslamicFrame) {
            const pad = canvas.width * 0.03;
            ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 12;
            ctx.strokeRect(pad, pad, canvas.width - (pad*2), canvas.height - (pad*2));
        }

        // 🏷️ رسم شريط اسم الشيخ والدرس (مع فحص زر الإظهار 👁️)
        const isBannerVisible = e.layerSettings && e.layerSettings.banner ? e.layerSettings.banner.visible : true;
        if ((e.speakerName || e.lessonTitle) && isBannerVisible) {
            const bWidth = canvas.width * 0.55;
            const bHeight = 75;
            const bx = e.bannerX || 40;
            const by = e.bannerY || (canvas.height - 120);

            const bGrad = ctx.createLinearGradient(bx, by, bx + bWidth, by);
            bGrad.addColorStop(0, 'rgba(15, 25, 20, 0.92)');
            bGrad.addColorStop(1, 'rgba(15, 25, 20, 0.1)');

            ctx.fillStyle = bGrad;
            ctx.fillRect(bx, by, bWidth, bHeight);

            ctx.fillStyle = "#d4af37";
            ctx.fillRect(bx, by, 6, bHeight);

            ctx.textAlign = "right";
            if (e.speakerName) {
                ctx.font = `bold ${canvas.width * 0.03}px 'Amiri', serif`;
                ctx.fillStyle = "#d4af37";
                ctx.fillText(e.speakerName, bx + bWidth - 15, by + 30);
            }
            if (e.lessonTitle) {
                ctx.font = `${canvas.width * 0.02}px 'Cairo', sans-serif`;
                ctx.fillStyle = "#ffffff";
                ctx.fillText(e.lessonTitle, bx + bWidth - 15, by + 58);
            }
        }

        // ✍️ رسم النص الرئيسي (مع فحص زر الإظهار 👁️)
        const isTextVisible = e.layerSettings && e.layerSettings.overlayText ? e.layerSettings.overlayText.visible : true;
        if (e.overlayText && isTextVisible) {
            ctx.fillStyle = e.textBgColor;
            ctx.font = `bold ${e.textSize * (canvas.width / 800)}px ${e.textFont}`;
            ctx.textAlign = "center";
            ctx.fillText(e.overlayText, e.textX, e.textY);
        }

        // 🖼️ رسم اللوجو (مع فحص زر الإظهار 👁️)
        const isLogoVisible = e.layerSettings && e.layerSettings.logo ? e.layerSettings.logo.visible : true;
        if (e.logoImage && isLogoVisible) {
            let currentLogoSize = e.logoSize;
            if (e.keyframes && e.keyframes['logoScale'] && e.keyframes['logoScale'].length > 0) {
                currentLogoSize = AthrKeyframeEngine.getValueAtTime(e.keyframes['logoScale'], video.currentTime, e.logoSize);
            }
            ctx.drawImage(e.logoImage, e.logoX, e.logoY, currentLogoSize, currentLogoSize * (e.logoImage.height / e.logoImage.width));
        }

        // 📐 المحاذاة الذكية (Smart Guides)
        if (e.isDragging && e.renderCanvas) {
            const centerX = canvas.width / 2;
            ctx.save();
            ctx.strokeStyle = "#d4af37";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);

            if (Math.abs(e.textX - centerX) < 10 || Math.abs(e.logoX - centerX) < 10 || Math.abs(e.bannerX - centerX) < 10) {
                ctx.beginPath();
                ctx.moveTo(centerX, 0);
                ctx.lineTo(centerX, canvas.height);
                ctx.stroke();
            }
            ctx.restore();
        }

        e.animFrameId = requestAnimationFrame(drawFrame);
    }

    if (e.animFrameId) cancelAnimationFrame(e.animFrameId);
    drawFrame();
};

window.updateEstimatedSize = function() {
    const originalSize = window.studioEngine.originalFileSize || 0;
    const video = window.studioEngine.videoElement;
    const speed = parseFloat(document.getElementById('sliderSpeed')?.value || 1.0);

    if (originalSize > 0) {
        const audioSizeMB = ((originalSize * 0.12) / (1024 * 1024)).toFixed(1);
        const videoSizeMB = ((originalSize / speed) / (1024 * 1024)).toFixed(1);

        document.getElementById('estVideoMB').textContent = videoSizeMB;
        document.getElementById('estAudioMB').textContent = audioSizeMB;
    }
};

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
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `صوت_منقى_أثر_${Date.now()}.mp3`;
        link.click();
        log.textContent = "✅ تم استخراج الملف الصوتي بنجاح!";
    };

    video.currentTime = window.studioEngine.clips[0]?.start || 0;
    video.play();
    recorder.start();

    const checkEnd = setInterval(() => {
        const currentClip = window.studioEngine.clips[window.studioEngine.selectedClipIndex];
        if (video.paused || video.ended || (currentClip && video.currentTime >= currentClip.end)) {
            clearInterval(checkEnd);
            if (recorder.state === "recording") {
                recorder.stop();
                video.pause();
            }
        }
    }, 500);
};

window.exportStudioFilteredVideo = function() {
    const video = window.studioEngine.videoElement;
    const canvas = window.studioEngine.renderCanvas;
    const log = document.getElementById('studioStatusLog');
    if (!video || !canvas) return;

    log.textContent = "⏳ جاري تسجيل الفيديو بالكامل... يرجى الانتظار وعدم إغلاق الصفحة";

    // 1. تجهيز تيار الصوت المصفى
    const dest = window.studioEngine.audioCtx ? window.studioEngine.audioCtx.createMediaStreamDestination() : null;
    if (dest && window.studioEngine.gainNode) {
        window.studioEngine.gainNode.connect(dest);
        if (window.studioEngine.ambientGainNode) {
            window.studioEngine.ambientGainNode.connect(dest);
        }
    }

    // 2. دمج الصورة من الكانفاس مع الصوت
    const fps = parseInt(document.getElementById('exportFPS')?.value || 30);
    const canvasStream = canvas.captureStream(fps);
    const tracks = [...canvasStream.getVideoTracks()];
    if (dest && dest.stream.getAudioTracks().length > 0) {
        tracks.push(...dest.stream.getAudioTracks());
    }

    const combinedStream = new MediaStream(tracks);

    // 3. اختيار الترميز المدعوم
    let options = { mimeType: 'video/webm;codecs=vp8,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
    }

    const recorder = new MediaRecorder(combinedStream, options);
    const chunks = [];

    recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const downloadUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `فيديو_أثر_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        log.textContent = "🎉 تم تصدير الفيديو كاملاً بنجاح!";
    };

    // 4. ضبط الفيديو للبداية والتشغيل المضمون
    const currentClip = window.studioEngine.clips[window.studioEngine.selectedClipIndex];
    const startTime = currentClip ? currentClip.start : 0;
    const endTime = currentClip ? currentClip.end : video.duration;

    video.currentTime = startTime;

    // لبدء التسجيل فقط بعد تأكد تشغيل الفيديو
    video.onseeked = () => {
        video.play();
        recorder.start(500); // تجميع البيانات كل نص ثانية
    };

    // إيقاف التسجيل فقط لما الفيديو يوصل لنهاية الكليب أو المقطع
    const timeCheck = setInterval(() => {
        if (video.currentTime >= endTime || video.ended) {
            clearInterval(timeCheck);
            video.pause();
            if (recorder.state === "recording") {
                recorder.stop();
            }
        }
    }, 200);
};

// 🔊 التحكم الحظي في مستوى صوت المؤثر
window.updateAmbientVolume = function(val) {
    if (window.studioEngine.ambientGainNode) {
        window.studioEngine.ambientGainNode.gain.value = parseFloat(val);
    }
};

// 📂 رفع ملف صوتي خاص من الجهاز
window.handleUserAmbientAudio = function(event) {
    const file = event.target.files[0];
    const e = window.studioEngine;
    if (!file) return;

    window.initStudioAudioEngine();

    if (e.ambientAudioEl) {
        e.ambientAudioEl.pause();
        e.ambientAudioEl = null;
    }

    const audioEl = new Audio(URL.createObjectURL(file));
    audioEl.loop = true;

    const source = e.audioCtx.createMediaElementSource(audioEl);
    const gain = e.audioCtx.createGain();
    gain.gain.value = parseFloat(document.getElementById('ambientVol')?.value || 0.3);

    source.connect(gain);
    gain.connect(e.audioCtx.destination);

    e.ambientNode = source;
    e.ambientGainNode = gain;
    e.ambientAudioEl = audioEl;

    if (!e.videoElement.paused) {
        audioEl.play();
    }

    document.getElementById('studioStatusLog').textContent = "✅ تم إضافة المؤثر الصوتي من جهازك بنجاح!";
};

// 📂 رفع صورة خلفية خاصة من الجهاز
window.handleStudioBgImageUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        window.studioEngine.bgCustomImage = img;
        document.getElementById('studioStatusLog').textContent = "✅ تم تحميل صورة الخلفية بنجاح! يمكنك التحكم في حجمها وشفافيتها الآن.";
    };
    img.src = URL.createObjectURL(file);
};

// 🎛️ تحديث الشفافية والحجم من السلايدرات
window.updateBgImageConfig = function() {
    const e = window.studioEngine;
    const opacityInput = document.getElementById('bgOpacitySlider');
    const scaleInput = document.getElementById('bgScaleSlider');

    if (opacityInput) e.bgImageOpacity = parseFloat(opacityInput.value);
    if (scaleInput) e.bgImageScale = parseFloat(scaleInput.value);
};

window.drawSingleStudioFrame = function() {
    const e = window.studioEngine;
    if (e.videoElement && e.renderCtx && e.renderCanvas) {
        e.renderCtx.drawImage(e.videoElement, 0, 0, e.renderCanvas.width, e.renderCanvas.height);
    }
};

// 🎯 تهيئة الاستوديو
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('studioContainer')) {
        window.renderStudioUI();
    }
});




// 🎛️ تحديث قيم تصحيح الألوان
window.updateColorAdjustments = function() {
    const e = window.studioEngine;
    if (!e.colorAdjustments) e.colorAdjustments = {};

    e.colorAdjustments.exposure = parseFloat(document.getElementById('adjExposure')?.value || 0);
    e.colorAdjustments.contrast = parseFloat(document.getElementById('adjContrast')?.value || 0);
    e.colorAdjustments.saturation = parseFloat(document.getElementById('adjSaturation')?.value || 0);
    e.colorAdjustments.hue = parseFloat(document.getElementById('adjHue')?.value || 0);
};

// 🔄 إعادة ضبط الألوان
window.resetColorAdjustments = function() {
    ['adjExposure', 'adjContrast', 'adjSaturation', 'adjHue'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = 0;
    });
    window.updateColorAdjustments();
    document.getElementById('studioStatusLog').textContent = "🔄 تم إعادة ضبط الألوان للوضع الطبيعي.";
};

// 🔑 إضافة Keyframe عند المؤشر الحالي
window.addKeyframeAtPlayhead = function(property) {
    const e = window.studioEngine;
    if (!e.videoElement) return;

    const currentTime = e.videoElement.currentTime;
    if (!e.keyframes) e.keyframes = {};
    if (!e.keyframes[property]) e.keyframes[property] = [];

    let val = 1.0;
    if (property === 'logoScale') val = e.logoSize;
    else if (property === 'textOpacity') val = 1.0;

    // إضافة أو تحديث النقطة الزمانية
    const existingIndex = e.keyframes[property].findIndex(kf => Math.abs(kf.time - currentTime) < 0.2);
    if (existingIndex !== -1) {
        e.keyframes[property][existingIndex].value = val;
    } else {
        e.keyframes[property].push({ time: currentTime, value: val, easing: 'easeInOut' });
        e.keyframes[property].sort((a, b) => a.time - b.time);
    }

    document.getElementById('studioStatusLog').textContent = `📌 تم إضافة نقطة حركة (Keyframe) لـ ${property} عند الثانية ${currentTime.toFixed(1)}s!`;
};

// 🗑️ مسح جميع النقاط
window.clearAllKeyframes = function() {
    window.studioEngine.keyframes = {};
    document.getElementById('studioStatusLog').textContent = "🗑️ تم مسح جميع نقاط الحركة.";
};




// 🕌 إضافة ملصق نصي/إيموجي
window.addTextSticker = function(textSymbol) {
    const e = window.studioEngine;
    const canvas = e.renderCanvas || { width: 1280, height: 720 };
    
    e.stickersList.push({
        id: Date.now(),
        type: 'text',
        content: textSymbol,
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 48,
        opacity: 1.0
    });
    
    document.getElementById('studioStatusLog').textContent = `✅ تم إضافة الملصق (${textSymbol})! يمكنك سحبه بيدك على الشاشة.`;
};

// 🖼️ رفع ملصق صورة مخصص
window.handleCustomStickerUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        const e = window.studioEngine;
        const canvas = e.renderCanvas || { width: 1280, height: 720 };
        e.stickersList.push({
            id: Date.now(),
            type: 'image',
            imgElement: img,
            x: canvas.width / 3,
            y: canvas.height / 3,
            size: 120,
            opacity: 1.0
        });
        document.getElementById('studioStatusLog').textContent = "✅ تم تحميل الملصق المخصص بنجاح!";
    };
    img.src = URL.createObjectURL(file);
};

// 📺 رفع طبقة PiP عائمة
window.handlePipOverlayUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        window.studioEngine.pipOverlayImage = img;
        document.getElementById('studioStatusLog').textContent = "✅ تم إضافة الطبقة العائمة (PiP)!";
    };
    img.src = URL.createObjectURL(file);
};

// 🎛️ تحديث إعدادات الـ PiP
window.updatePipConfig = function() {
    const e = window.studioEngine;
    const sizeVal = document.getElementById('pipSizeSlider')?.value;
    const opacityVal = document.getElementById('pipOpacitySlider')?.value;

    if (sizeVal) e.pipSize = parseFloat(sizeVal);
    if (opacityVal) e.pipOpacity = parseFloat(opacityVal);
};

// 🗑️ حذف كافة الملصقات والـ PiP
window.clearAllStickersAndPip = function() {
    const e = window.studioEngine;
    e.stickersList = [];
    e.pipOverlayImage = null;
    document.getElementById('studioStatusLog').textContent = "🗑️ تم إزالة كافة الملصقات والطبقات العائمة.";
};


// ⚡ 1. دالة تطبيق القوالب الجاهزة (Athr Templates)
window.applyAthrTemplate = function(type) {
    const e = window.studioEngine;

    if (type === 'dawah') {
        e.textFont = "'Amiri', serif";
        e.textColor = "#d4af37";
        e.colorFilter = 'warm-gold';
        e.enableIslamicFrame = true;
        e.enableVignette = true;
        document.getElementById('studioColorFilter').value = 'warm-gold';
        document.getElementById('islamicFrameCheck').checked = true;
        document.getElementById('vignetteCheck').checked = true;
        document.getElementById('studioStatusLog').textContent = "📜 تم تطبيق القالب الدعوي الفاخر بنجاح!";
    } else if (type === 'reels') {
        e.aspectRatio = "9:16";
        e.aspectBgStyle = "blur";
        e.textSize = 45;
        document.getElementById('studioAspectRatio').value = "9:16";
        document.getElementById('aspectBgStyleSelect').value = "blur";
        window.updateStudioLayoutConfig();
        document.getElementById('studioStatusLog').textContent = "📱 تم تحويل المشهد لقالب ريلز طولي (9:16) مع خلفية مموهة!";
    } else if (type === 'youtube') {
        e.aspectRatio = "16:9";
        e.aspectBgStyle = "dark";
        document.getElementById('studioAspectRatio').value = "16:9";
        window.updateStudioLayoutConfig();
        document.getElementById('studioStatusLog').textContent = "📺 تم تطبيق قالب يوتيوب العريض (16:9)!";
    }
};

// ⌨️ 2. اختصارات الكيبورد الاحترافية (Keyboard Shortcuts)
document.addEventListener('keydown', (evt) => {
    // التجميع مع المفاتيح المساعدة
    if (evt.code === 'Space' && evt.target.tagName !== 'INPUT' && evt.target.tagName !== 'TEXTAREA') {
        evt.preventDefault();
        const v = window.studioEngine.videoElement;
        if (v) v.paused ? v.play() : v.pause();
    }
    
    if (evt.key === 'Delete' || evt.key === 'Backspace') {
        if (evt.target.tagName !== 'INPUT' && evt.target.tagName !== 'TEXTAREA') {
            evt.preventDefault();
            window.deleteSelectedClip();
        }
    }

    if (evt.ctrlKey && evt.key.toLowerCase() === 's') {
        evt.preventDefault();
        window.studioEngine.exportAthrProject();
    }
});





// ↩️ 1. حفظ لقطة من الحالة للتراجع
window.saveStudioState = function() {
    const e = window.studioEngine;
    const snapshot = {
        clips: JSON.parse(JSON.stringify(e.clips)),
        selectedClipIndex: e.selectedClipIndex,
        overlayText: e.overlayText,
        textColor: e.textColor,
        textSize: e.textSize,
        speakerName: e.speakerName,
        lessonTitle: e.lessonTitle,
        colorFilter: e.colorFilter,
        colorAdjustments: JSON.parse(JSON.stringify(e.colorAdjustments || {}))
    };
    e.projectState.pushHistory(snapshot);
};

// ↩️ 2. تنفيذ التراجع (Undo)
window.undoStudioState = function() {
    const e = window.studioEngine;
    const prevState = e.projectState.undo();
    if (prevState) {
        e.clips = prevState.clips;
        e.selectedClipIndex = prevState.selectedClipIndex;
        e.overlayText = prevState.overlayText;
        e.textColor = prevState.textColor;
        e.textSize = prevState.textSize;
        e.speakerName = prevState.speakerName;
        e.lessonTitle = prevState.lessonTitle;
        e.colorFilter = prevState.colorFilter;
        e.colorAdjustments = prevState.colorAdjustments;

        window.renderTimelineUI();
        document.getElementById('studioStatusLog').textContent = "↩️ تم التراجع عن الخطوة الأخيرة!";
    } else {
        document.getElementById('studioStatusLog').textContent = "⚠️ لا توجد خطوات إضافية للتراجع عنها.";
    }
};

// ↪️ 3. تنفيذ الإعادة (Redo)
window.redoStudioState = function() {
    const e = window.studioEngine;
    const nextState = e.projectState.redo();
    if (nextState) {
        e.clips = nextState.clips;
        e.selectedClipIndex = nextState.selectedClipIndex;
        e.overlayText = nextState.overlayText;
        e.textColor = nextState.textColor;
        e.textSize = nextState.textSize;
        e.speakerName = nextState.speakerName;
        e.lessonTitle = nextState.lessonTitle;
        e.colorFilter = nextState.colorFilter;
        e.colorAdjustments = nextState.colorAdjustments;

        window.renderTimelineUI();
        document.getElementById('studioStatusLog').textContent = "↪️ تم إعادة الخطوة!";
    } else {
        document.getElementById('studioStatusLog').textContent = "⚠️ لا توجد خطوات لإعادتها.";
    }
};

// 🥞 1. دالة تحديث ورسم قائمة الطبقات (Layers UI)
window.renderLayersUI = function() {
    const container = document.getElementById('layersListContainer');
    if (!container) return;

    const e = window.studioEngine;
    const layers = [
        { key: 'video', name: '🎥 طبقة الفيديو الرئيسي' },
        { key: 'overlayText', name: '✍️ طبقة النصوص والآيات' },
        { key: 'logo', name: '🖼️ طبقة الشعار والواترمارك' },
        { key: 'banner', name: '🏷️ طبقة اسم الشيخ والدرس' },
        { key: 'pip', name: '📺 طبقة الصورة العائمة (PiP)' },
        { key: 'stickers', name: '🕌 طبقة الملصقات والرموز' }
    ];

    container.innerHTML = layers.map(l => {
        const set = e.layerSettings[l.key] || { visible: true, locked: false };
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--card); padding:8px 12px; border-radius:8px; border:1px solid var(--border);">
                <span style="color:var(--text); font-weight:bold;">${l.name}</span>
                <div style="display:flex; gap:8px;">
                    <button onclick="window.toggleLayerVisibility('${l.key}')" style="background:none; border:none; cursor:pointer; font-size:16px;" title="إظهار/إخفاء">${set.visible ? '👁️' : '🙈'}</button>
                    <button onclick="window.toggleLayerLock('${l.key}')" style="background:none; border:none; cursor:pointer; font-size:16px;" title="قفل/فتح السحب">${set.locked ? '🔒' : '🔓'}</button>
                </div>
            </div>
        `;
    }).join('');
};

window.toggleLayerVisibility = function(key) {
    const e = window.studioEngine;
    if (e.layerSettings[key]) {
        e.layerSettings[key].visible = !e.layerSettings[key].visible;
        window.renderLayersUI();
    }
};

window.toggleLayerLock = function(key) {
    const e = window.studioEngine;
    if (e.layerSettings[key]) {
        e.layerSettings[key].locked = !e.layerSettings[key].locked;
        window.renderLayersUI();
    }
};

// ✂️ 2. دالة قص أطراف الكليب بالمقابض (Trim)
window.updateClipTrim = function() {
    const e = window.studioEngine;
    const clip = e.clips[e.selectedClipIndex];
    const startVal = parseFloat(document.getElementById('trimStartSlider')?.value);
    const endVal = parseFloat(document.getElementById('trimEndSlider')?.value);

    if (clip && !isNaN(startVal) && !isNaN(endVal)) {
        clip.start = startVal;
        clip.end = endVal;
        document.getElementById('trimStartVal').textContent = `${startVal.toFixed(1)}s`;
        document.getElementById('trimEndVal').textContent = `${endVal.toFixed(1)}s`;
        window.renderTimelineUI();
    }
};

// تشغيل رسم الطبقات فور فتح تبويبها
const originalSwitchStudioTab = window.switchStudioTab;
window.switchStudioTab = function(tabId) {
    originalSwitchStudioTab(tabId);
    if (tabId === 'layersTab') {
        window.renderLayersUI();
    }
};
