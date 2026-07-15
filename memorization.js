/**
 * 🧠 مُصَحِّحُ التَّسْمِيعِ الصَّوْتِيِّ وَالنَّصِّيِّ المُمِتَدِّ - كُن ذا أثر
 * النسخة المصلحة 100% لتفادي التجمد عبر تصدير الدوال للـ Scope العام
 */

// متغيرات الجلسة العامة
window.memoWords = [];
window.currentWordIndex = 0;
window.memoErrors = [];
window.recognition = null;
window.isListening = false;
window.currentMemoMode = 'voice'; // 'voice' أو 'text'

// 1. تنظيف النصوص لضمان دقة المقارنة الصوتية والنصية
window.cleanArabicText = function(text) {
    if (!text) return "";
    return text
        .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
        .replace(/[أإآا]/g, "ا")         // توحيد الهمزات
        .replace(/ة/g, "ه")              // التاء المربوطة
        .replace(/ى/g, "ي")              // الألف المقصورة
        .replace(/[0-9]/g, "")           // إزالة أرقام الآيات
        .trim();
};

// 2. حقن أزرار اختيار الوضع
window.injectMemoModeSelectors = function() {
    const inputArea = document.getElementById('memoInputArea');
    if (!inputArea) return;
    if (document.getElementById('memoModeWrapper')) return;

    const modeHtml = `
        <div id="memoModeWrapper" style="margin-bottom: 14px; text-align: center;">
            <label style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px; font-weight: bold;">🎯 اختر وضع التسميع المفضل:</label>
            <div style="display: flex; gap: 8px;">
                <button id="btnMemoVoiceMode" onclick="window.setMemoMode('voice')" class="mode-btn active" style="flex:1; padding:10px; font-family:inherit;">🎙️ تسميع صوتي ذكي</button>
                <button id="btnMemoTextMode" onclick="window.setMemoMode('text')" class="mode-btn" style="flex:1; padding:10px; font-family:inherit;">📝 تسميع كتابي (نصي)</button>
            </div>
        </div>
        <div id="quranSelectionHint" style="background: rgba(212,175,55,0.08); border: 1px dashed var(--gold); padding: 10px; border-radius: 10px; margin-bottom: 14px; font-size: 13px; text-align: center; color: var(--text);">
            💡 <span style="color:var(--gold); font-weight:bold;">طريقة التسميع من المصحف:</span> حدد الآيات في المصحف عبر "تحديد للتشغيل"، ثم افتح الأكشن شيت واضغط "تسميع النطاق المحدد" للبدء فوراً.
        </div>
    `;
    inputArea.insertAdjacentHTML('afterbegin', modeHtml);
};

window.setMemoMode = function(mode) {
    window.currentMemoMode = mode;
    const btnVoice = document.getElementById('btnMemoVoiceMode');
    const btnText = document.getElementById('btnMemoTextMode');
    if(btnVoice) btnVoice.classList.toggle('active', mode === 'voice');
    if(btnText) btnText.classList.toggle('active', mode === 'text');
};

// 3. الدالة الرئيسية لبدء الجلسة (مكشوفة بالكامل للـ HTML الآن)
window.initMemorizationSession = function(customText = null) {
    let rawText = customText || document.getElementById('memoTargetText').value.trim();
    
    if (!rawText) {
        alert('الرجاء اختيار آيات من المصحف أو كتابة نص مراد تسميعه أولاً! 📝');
        return;
    }

    window.memoWords = rawText.split(/\s+/).filter(w => w.length > 0);
    window.currentWordIndex = 0;
    window.memoErrors = [];

    if (window.memoWords.length === 0) return;

    document.getElementById('memoInputArea').style.display = 'none';
    document.getElementById('memoActiveArea').style.display = 'block';

    window.renderMemoWordsUI();
    window.setupInputInterfaceBasedOnMode();
};

window.setupInputInterfaceBasedOnMode = function() {
    const statusLabel = document.getElementById('memoStatusLabel');
    const micBtn = document.getElementById('memoMicBtn');
    
    const oldInp = document.getElementById('memoTextInputField');
    if (oldInp) oldInp.remove();

    if (window.currentMemoMode === 'voice') {
        if(micBtn) micBtn.style.display = 'flex';
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if(statusLabel) statusLabel.innerHTML = `<span style="color:#ff4d4d; font-weight:bold;">🎙️ التسميع اليدوي:</span> جهازك لا يدعم التعرف الصوتي. تحول تلقائياً للوضع النصي.`;
            window.setMemoMode('text');
            window.setupInputInterfaceBasedOnMode();
            return;
        }
        if(statusLabel) statusLabel.textContent = 'انقر على الميكروفون وابدأ التلاوة بصوت مسموع...';
        window.initSpeechEngine();
    } else {
        if(micBtn) micBtn.style.display = 'none';
        if(statusLabel) statusLabel.textContent = 'اكتب الكلمة التالية واضغط مسافة أو Enter بالتوالي:';
        
        const inputField = document.createElement('input');
        inputField.id = 'memoTextInputField';
        inputField.type = 'text';
        inputField.placeholder = 'اكتب الكلمة النشطة هنا...';
        inputField.style.cssText = "width:100%; max-width:280px; padding:12px; border-radius:10px; background:var(--bg); color:var(--text); border:1px solid var(--gold); text-align:center; font-size:16px; font-family:inherit; outline:none; margin-bottom:12px;";
        
        inputField.addEventListener('keypress', function(e) {
            if (e.key === ' ' || e.keyCode === 32 || e.key === 'Enter') {
                e.preventDefault();
                const val = inputField.value.trim();
                if(val) window.handleSpokenOrWrittenWord(val);
                inputField.value = '';
            }
        });

        if(micBtn) micBtn.parentNode.insertBefore(inputField, micBtn);
        inputField.focus();
    }
};

window.initSpeechEngine = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.recognition = new SpeechRecognition();
    window.recognition.continuous = true;
    window.recognition.interimResults = false;
    window.recognition.lang = 'ar-SA';

    window.recognition.onstart = function() {
        window.isListening = true;
        window.micBtnActiveStyle(true);
        const lbl = document.getElementById('memoStatusLabel');
        if(lbl) lbl.textContent = '🎤 محرك أثر يستمع إليك الآن.. اتلُ آيات الله...';
    };

    window.recognition.onresult = function(event) {
        const transcript = event.results[event.resultIndex][0].transcript.trim();
        const spokenWords = transcript.split(/\s+/);
        spokenWords.forEach(w => window.handleSpokenOrWrittenWord(w));
    };

    window.recognition.onerror = function() { window.stopListeningState(); };
    window.recognition.onend = function() { window.stopListeningState(); };
};

window.handleSpokenOrWrittenWord = function(word) {
    if (window.currentWordIndex >= window.memoWords.length) return;

    const targetWord = window.memoWords[window.currentWordIndex];
    const cleanTarget = window.cleanArabicText(targetWord);
    const cleanInput = window.cleanArabicText(word);

    if (cleanTarget === cleanInput || cleanTarget.includes(cleanInput) || cleanInput.includes(cleanTarget)) {
        window.currentWordIndex++;
    } else {
        window.memoErrors.push(window.currentWordIndex);
        window.currentWordIndex++;
        if (navigator.vibrate) navigator.vibrate(80);
    }

    window.renderMemoWordsUI();
    window.checkSessionEnd();
};

window.renderMemoWordsUI = function() {
    const container = document.getElementById('memoWordsContainer');
    if (!container) return;

    container.innerHTML = window.memoWords.map((word, idx) => {
        let colorStyle = 'color: var(--text2); opacity: 0.25;';
        let borderStyle = '';

        if (idx === window.currentWordIndex) {
            colorStyle = 'color: var(--gold); font-weight: bold; font-size: 28px;';
            borderStyle = 'border-bottom: 2px solid var(--gold);';
        } else if (idx < window.currentWordIndex) {
            if (window.memoErrors.includes(idx)) {
                colorStyle = 'color: #ff4d4d; font-weight: bold;';
                word += ' ❌'; // علامة حمراء واضحة للخطأ زي تطبيق ترتيل بالظبط
            } else {
                colorStyle = 'color: var(--green); font-weight: bold;';
            }
        }
        return `<span id="mword_${idx}" style="display: inline-block; margin: 0 4px; ${colorStyle} ${borderStyle}">${word}</span>`;
    }).join(' ');

    const activeWordEl = document.getElementById(`mword_${window.currentWordIndex}`);
    if (activeWordEl) activeWordEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};

window.micBtnActiveStyle = function(active) {
    const micBtn = document.getElementById('memoMicBtn');
    if (!micBtn) return;
    if (active) {
        micBtn.style.background = 'var(--gold)';
        micBtn.style.color = '#111';
        micBtn.style.boxShadow = '0 0 15px var(--gold)';
    } else {
        micBtn.style.background = 'rgba(212,175,55,0.12)';
        micBtn.style.color = 'var(--gold)';
        micBtn.style.boxShadow = 'none';
    }
};

window.stopListeningState = function() {
    window.isListening = false;
    window.micBtnActiveStyle(false);
    const lbl = document.getElementById('memoStatusLabel');
    if(lbl && window.currentMemoMode === 'voice') lbl.textContent = '⏸️ الميكروفون متوقف. انقر للبدء.';
};

window.toggleMemoListening = function() {
    if (!window.recognition) return;
    if (window.isListening) window.recognition.stop();
    else window.recognition.start();
};

window.manualMemoAdvance = function(isCorrect) {
    if (window.currentWordIndex >= window.memoWords.length) return;
    if (!isCorrect) window.memoErrors.push(window.currentWordIndex);
    window.currentWordIndex++;
    window.renderMemoWordsUI();
    window.checkSessionEnd();
};

window.checkSessionEnd = function() {
    if (window.currentWordIndex >= window.memoWords.length) {
        if (window.recognition && window.isListening) window.recognition.stop();
        const inpField = document.getElementById('memoTextInputField');
        if (inpField) inpField.disabled = true;

        const total = window.memoWords.length;
        const wrong = window.memoErrors.length;
        const accuracy = Math.round(((total - wrong) / total) * 100);

        if (typeof window.boostFlame === 'function') window.boostFlame(Math.max(2, Math.round(accuracy/10)));

        document.getElementById('memoStatusLabel').innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 14px; border-radius: 12px; margin-top: 10px; line-height: 1.8;">
                <span style="color: var(--gold); font-weight: bold; display: block; margin-bottom: 6px; font-size: 16px;">🎉 اكتملت جلسة المراجعة!</span>
                الكلمات الإجمالية: ${total} | الأخطاء: <span style="color:#ff4d4d; font-weight:bold;">${wrong}</span> | نسبة الإتقان: <span style="color:var(--green); font-weight:bold;">${accuracy}%</span>
            </div>
        `;
    }
};

window.resetMemoSession = function() {
    if (window.recognition && window.isListening) window.recognition.stop();
    window.memoWords = [];
    window.currentWordIndex = 0;
    window.memoErrors = [];
    document.getElementById('memoInputArea').style.display = 'block';
    document.getElementById('memoActiveArea').style.display = 'none';
    const pInp = document.getElementById('memoTextInputField');
    if(pInp) pInp.remove();
};

// الربط مع واجهة اختيار المصحف الفعلي
window.startMemoFromQuranSelection = function(startIdx, endIdx) {
    if (!window.currentAyahsData) return;
    let selectedTextCombined = "";
    for (let i = startIdx; i <= endIdx; i++) {
        selectedTextCombined += window.currentAyahsData[i].text + " ";
    }
    
    window.showPage('memorizationPage', null);
    setTimeout(() => {
        window.resetMemoSession();
        window.initMemorizationSession(selectedTextCombined.trim());
    }, 350);
};

// حقن أزرار الاختيار فور التحميل
setTimeout(window.injectMemoModeSelectors, 500);
