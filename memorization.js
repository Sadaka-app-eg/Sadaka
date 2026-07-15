/**
 * 🧠 مُصَحِّحُ التَّسْمِيعِ الصَّوْتِيِّ وَالنَّصِّيِّ (محاكاة ذكية للوجيك ترتيل) - كُن ذا أثر
 * نظام المطابقة العائمة لمنع "الجر" والأخطاء المتتالية عند اختلاف النطق أو التجويد.
 */

window.memoWords = [];
window.currentWordIndex = 0;
window.memoErrors = [];
window.recognition = null;
window.isListening = false;
window.currentMemoMode = 'voice';

// تنظيف الحروف والرموز والتشكيل لرفع دقة المطابقة الصامتة
window.cleanArabicText = function(text) {
    if (!text) return "";
    return text
        .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
        .replace(/[أإآا]/g, "ا")         // توحيد الهمزات
        .replace(/ة/g, "ه")              // التاء المربوطة والهاء
        .replace(/ى/g, "ي")              // الألف المقصورة والياء
        .replace(/[0-9]/g, "")           // إزالة الأرقام
        .replace(/[ۖۗۚۛ区分۞۩]/g, "")    // إزالة علامات الوقف المصحفية
        .trim();
};

window.injectMemoModeSelectors = function() {
    const inputArea = document.getElementById('memoInputArea');
    if (!inputArea) return;
    if (document.getElementById('memoModeWrapper')) return;

    const modeHtml = `
        <div id="memoModeWrapper" style="margin-bottom: 14px; text-align: center;">
            <label style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px; font-weight: bold;">🎯 اختر وضع التسميع المفضل:</label>
            <div style="display: flex; gap: 8px;">
                <button id="btnMemoVoiceMode" onclick="window.setMemoMode('voice')" class="mode-btn active" style="flex:1; padding:10px; font-family:inherit;">🎙️ تسميع صوتي (مثل ترتيل)</button>
                <button id="btnMemoTextMode" onclick="window.setMemoMode('text')" class="mode-btn" style="flex:1; padding:10px; font-family:inherit;">📝 تسميع كتابي مخفي</button>
            </div>
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

window.initMemorizationSession = function(customText = null) {
    let rawText = customText || document.getElementById('memoTargetText').value.trim();
    
    if (!rawText) {
        alert('الرجاء اختيار آيات من المصحف أو كتابة نص أولاً! 📝');
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
            if(statusLabel) statusLabel.innerHTML = `<span style="color:#ff4d4d; font-weight:bold;">🎙️ وضع اضطراري:</span> متصفحك لا يدعم الصوت، تحولنا للكتابة المَخفية.`;
            window.setMemoMode('text');
            window.setupInputInterfaceBasedOnMode();
            return;
        }
        if(statusLabel) statusLabel.textContent = 'اضغط المايك وابدأ التلاوة.. النص مخفي وسيظهر كلمة بكلمة مع صوتك ✨';
        window.initSpeechEngine();
    } else {
        if(micBtn) micBtn.style.display = 'none';
        if(statusLabel) statusLabel.textContent = 'اكتب الكلمة التالية غيباً واضغط مسافة لتظهر إن كانت صحيحة:';
        
        const inputField = document.createElement('input');
        inputField.id = 'memoTextInputField';
        inputField.type = 'text';
        inputField.placeholder = 'اكتب الكلمة التالية...';
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
    window.recognition.interimResults = true; // نتائج فورية للحاق بالصوت
    window.recognition.lang = 'ar-SA';

    window.recognition.onstart = function() {
        window.isListening = true;
        window.micBtnActiveStyle(true);
        const lbl = document.getElementById('memoStatusLabel');
        if(lbl) lbl.textContent = '🎤 مصحح أثر يستمع لتلاوتك الآن.. اتلُ غيباً...';
    };

    window.recognition.onresult = function(event) {
        // نأخذ آخر عبارة تم النطق بها بالكامل للتحليل الذكي
        let lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
            const words = lastResult[0].transcript.trim().split(/\s+/);
            // معالجة الجملة المكتملة دفعة واحدة بنظام الفحص التدريجي
            window.processSpokenPhrase(words);
        }
    };

    window.recognition.onerror = function() { window.stopListeningState(); };
    window.recognition.onend = function() { window.stopListeningState(); };
};

// 🌟 محرك المطابقة الذكي المشابه لترتيل لمنع الإكسات العشوائية
window.processSpokenPhrase = function(spokenWords) {
    spokenWords.forEach(spokenWord => {
        if (window.currentWordIndex >= window.memoWords.length) return;

        // فحص الكلمة الحالية (الهدف)
        let targetWord = window.memoWords[window.currentWordIndex];
        let cleanTarget = window.cleanArabicText(targetWord);
        let cleanSpoken = window.cleanArabicText(spokenWord);

        if (!cleanSpoken) return;

        // 1. التطابق المباشر أو الجزئي مع الكلمة الحالية
        if (cleanTarget === cleanSpoken || cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget)) {
            window.currentWordIndex++;
            window.renderMemoWordsUI();
            return;
        }

        // 2. النظرة الاستباقية (Look-ahead): هل المستخدم تخطى الكلمة الحالية ونطق الكلمة التالية؟
        if (window.currentWordIndex + 1 < window.memoWords.length) {
            let nextTarget = window.cleanArabicText(window.memoWords[window.currentWordIndex + 1]);
            if (nextTarget === cleanSpoken || nextTarget.includes(cleanSpoken)) {
                // المستخدم غيّر أو أخطأ في الكلمة السابقة وتخطاها -> علم السابقة خطأ وتحرك فوراً مجاراةً لصوته
                window.memoErrors.push(window.currentWordIndex);
                window.currentWordIndex += 2; // تخطي الكلمة الحالية والتالية
                window.renderMemoWordsUI();
                if (navigator.vibrate) navigator.vibrate(80);
                return;
            }
        }

        // 3. إذا لم يتطابق مع الحالية ولا التالية، المتصفح التقط صوتاً عابراً أو حكماً تجويدياً غير دقيق؛ 
        // ننتظر الكلمة التالية ولا نحكم بالخطأ فوراً لمنع "الجر" العشوائي للأحمر.
    });

    window.checkSessionEnd();
};

// تشغيل دالة الإدخال النصي الفردي كالمعتاد
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
        if (idx === window.currentWordIndex) {
            return `<span id="mword_${idx}" style="display: inline-block; margin: 0 4px; color: var(--gold); font-weight: bold; border-bottom: 2px dashed var(--gold); min-width: 30px; text-align: center;">...</span>`;
        } else if (idx < window.currentWordIndex) {
            if (window.memoErrors.includes(idx)) {
                return `<span id="mword_${idx}" style="display: inline-block; margin: 0 4px; color: #ff4d4d; font-weight: bold; text-decoration: line-through;">${word} ❌</span>`;
            } else {
                return `<span id="mword_${idx}" style="display: inline-block; margin: 0 4px; color: var(--green); font-weight: bold;">${word}</span>`;
            }
        } else {
            return `<span id="mword_${idx}" style="display: none;">${word}</span>`;
        }
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
                <span style="color: var(--gold); font-weight: bold; display: block; margin-bottom: 6px; font-size: 16px;">🎉 اكتملت جلسة المراجعة الغيبية!</span>
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

window.startMemoFromQuranSelection = function(startIdx, endIdx) {
    let ayahsSource = window.currentAyahsData || (typeof currentAyahsData !== 'undefined' ? currentAyahsData : null);
    
    if (!ayahsSource) {
        alert('تنبيه: لم نتمكن من لقط بيانات الآيات، تأكد من فتح السورة أولاً 📖');
        return;
    }

    let selectedTextCombined = "";
    for (let i = startIdx; i <= endIdx; i++) {
        if (ayahsSource[i]) {
            selectedTextCombined += ayahsSource[i].text + " ";
        }
    }
    
    let memoTabElement = null;
    const tabs = document.querySelectorAll('.tabs .tab');
    tabs.forEach(t => {
        if (t.getAttribute('onclick') && t.getAttribute('onclick').includes('memorizationPage')) {
            memoTabElement = t;
        }
    });

    window.showPage('memorizationPage', memoTabElement);
    
    setTimeout(() => {
        window.resetMemoSession();
        window.initMemorizationSession(selectedTextCombined.trim());
    }, 350);
};

setTimeout(window.injectMemoModeSelectors, 500);
