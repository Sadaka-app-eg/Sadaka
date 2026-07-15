/**
 * 🧠 مُصَحِّحُ التَّسْمِيعِ الصَّوْتِيِّ وَالنَّصِّيِّ المُمِتَدِّ - كُن ذا أثر
 * يربط مع اختيار المصحف مباشرة، ويدعم وضعي التسميع (الصوتي والكتابي)
 */

(function() {
    let memoWords = [];
    let currentWordIndex = 0;
    let memoErrors = [];
    let recognition = null;
    let isListening = false;
    let currentMemoMode = 'voice'; // 'voice' أو 'text'

    // تنظيف النصوص لضمان دقة المقارنة الصوتية والنصية
    function cleanArabicText(text) {
        if (!text) return "";
        return text
            .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
            .replace(/[أإآا]/g, "ا")         // توحيد الهمزات
            .replace(/ة/g, "ه")              // التاء المربوطة
            .replace(/ى/g, "ي")              // الألف المقصورة
            .replace(/[0-9]/g, "")           // إزالة أرقام الآيات إن وجدت
            .trim();
    }

    // تهيئة الصفحة وإضافة أزرار اختيار وضع التسميع
    function injectMemoModeSelectors() {
        const inputArea = document.getElementById('memoInputArea');
        if (!inputArea) return;

        // التحقق من وجود أزرار الاختيار مسبقاً لمنع التكرار
        if (document.getElementById('memoModeWrapper')) return;

        const modeHtml = `
            <div id="memoModeWrapper" style="margin-bottom: 14px; text-align: center;">
                <label style="color: var(--gold); font-size: 13px; display: block; margin-bottom: 8px; font-weight: bold;">🎯 اختر وضع التسميع المفضل:</label>
                <div style="display: flex; gap: 8px;">
                    <button id="btnMemoVoiceMode" onclick="window.setMemoMode('voice')" class="mode-btn active" style="flex:1; padding:10px;">🎙️ تسميع صوتي ذكي</button>
                    <button id="btnMemoTextMode" onclick="window.setMemoMode('text')" class="mode-btn" style="flex:1; padding:10px;">📝 تسميع كتابي (نصي)</button>
                </div>
            </div>
            <div id="quranSelectionHint" style="background: rgba(212,175,55,0.08); border: 1px dashed var(--gold); padding: 10px; border-radius: 10px; margin-bottom: 14px; font-size: 13px; text-align: center; color: var(--text);">
                💡 <span style="color:var(--gold); font-weight:bold;">طريقة التسميع من المصحف:</span> اذهب لقسم القرآن الكريم، حدد الآيات المراد تسميعها بالضغط المطول، ثم ستجد خيار "تسميع النطاق المحدد" متاحاً للبدء فوراً.
            </div>
        `;
        inputArea.insertAdjacentHTML('afterbegin', modeHtml);
    }

    window.setMemoMode = function(mode) {
        currentMemoMode = mode;
        document.getElementById('btnMemoVoiceMode').classList.toggle('active', mode === 'voice');
        document.getElementById('btnMemoTextMode').classList.toggle('active', mode === 'text');
    };

    // الدالة الرئيسية التي يتم استدعاؤها لبدء الجلسة من المصحف أو عبر النص المدخل
    window.initMemorizationSession = function(customText = null) {
        let rawText = customText || document.getElementById('memoTargetText').value.trim();
        
        if (!rawText) {
            alert('الرجاء اختيار آيات من المصحف أو كتابة نص مراد تسميعه أولاً! 📝');
            return;
        }

        memoWords = rawText.split(/\s+/).filter(w => w.length > 0);
        currentWordIndex = 0;
        memoErrors = [];

        if (memoWords.length === 0) return;

        // تحضير الواجهة النشطة
        document.getElementById('memoInputArea').style.display = 'none';
        document.getElementById('memoActiveArea').style.display = 'block';

        renderMemoWordsUI();
        setupInputInterfaceBasedOnMode();
    };

    function setupInputInterfaceBasedOnMode() {
        const statusLabel = document.getElementById('memoStatusLabel');
        const micBtn = document.getElementById('memoMicBtn');
        
        // إزالة حقل الإدخال النصي القديم لو كان موجوداً
        const oldInp = document.getElementById('memoTextInputField');
        if (oldInp) oldInp.remove();

        if (currentMemoMode === 'voice') {
            micBtn.style.display = 'flex';
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                statusLabel.innerHTML = `<span style="color:#ff4d4d; font-weight:bold;">🎙️ التسميع اليدوي:</span> جهازك لا يدعم التعرف الصوتي. تحول تلقائياً للوضع النصي أو استخدم الأزرار.`;
                window.setMemoMode('text');
                setupInputInterfaceBasedOnMode();
                return;
            }
            statusLabel.textContent = 'انقر على الميكروفون وابدأ التلاوة بصوت مسموع...';
            initSpeechEngine();
        } else {
            // وضع التسميع النصي (الكتابة)
            micBtn.style.display = 'none';
            statusLabel.textContent = 'اكتب الكلمة التالية واضغط مسافة أو إدخال للتأكيد:';
            
            const inputField = document.createElement('input');
            inputField.id = 'memoTextInputField';
            inputField.type = 'text';
            inputField.placeholder = 'اكتب الكلمة النشطة هنا...';
            inputField.style.cssText = "width:100%; max-width:280px; padding:12px; border-radius:10px; background:var(--bg); color:var(--text); border:1px solid var(--gold); text-align:center; font-size:16px; font-family:inherit; outline:none; margin-bottom:12px;";
            
            // الاستماع للكتابة والضغط على المسافة للتأكد
            inputField.addEventListener('keypress', function(e) {
                if (e.key === ' ' || event.keyCode === 32 || e.key === 'Enter') {
                    e.preventDefault();
                    const val = inputField.value.trim();
                    if(val) handleSpokenOrWrittenWord(val);
                    inputField.value = '';
                }
            });

            micBtn.parentNode.insertBefore(inputField, micBtn);
            inputField.focus();
        }
    }

    function initSpeechEngine() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'ar-SA';

        recognition.onstart = function() {
            isListening = true;
            micBtnActiveStyle(true);
            document.getElementById('memoStatusLabel').textContent = '🎤 أنا أسمعك الآن.. اتلُ كتاب الله...';
        };

        recognition.onresult = function(event) {
            const transcript = event.results[event.resultIndex][0].transcript.trim();
            const spokenWords = transcript.split(/\s+/);
            spokenWords.forEach(w => handleSpokenOrWrittenWord(w));
        };

        recognition.onerror = function() { stopListeningState(); };
        recognition.onend = function() { stopListeningState(); };
    }

    function handleSpokenOrWrittenWord(word) {
        if (currentWordIndex >= memoWords.length) return;

        const targetWord = memoWords[currentWordIndex];
        const cleanTarget = cleanArabicText(targetWord);
        const cleanInput = cleanArabicText(word);

        if (cleanTarget === cleanInput || cleanTarget.includes(cleanInput) || cleanInput.includes(cleanTarget)) {
            currentWordIndex++;
        } else {
            memoErrors.push(currentWordIndex);
            currentWordIndex++;
            if (navigator.vibrate) navigator.vibrate(80);
        }

        renderMemoWordsUI();
        checkSessionEnd();
    }

    function renderMemoWordsUI() {
        const container = document.getElementById('memoWordsContainer');
        if (!container) return;

        container.innerHTML = memoWords.map((word, idx) => {
            let colorStyle = 'color: var(--text2); opacity: 0.25;';
            let borderStyle = '';

            if (idx === currentWordIndex) {
                colorStyle = 'color: var(--gold); font-weight: bold; font-size: 28px;';
                borderStyle = 'border-bottom: 2px solid var(--gold);';
            } else if (idx < currentWordIndex) {
                if (memoErrors.includes(idx)) {
                    colorStyle = 'color: #ff4d4d; font-weight: bold; position: relative;';
                    word += ' ❌'; // علامة حمراء واضحة عند الخطأ زي ترتيل
                } else {
                    colorStyle = 'color: var(--green); font-weight: bold;';
                }
            }
            return `<span id="mword_${idx}" style="display: inline-block; margin: 0 4px; ${colorStyle} ${borderStyle}">${word}</span>`;
        }).join(' ');

        const activeWordEl = document.getElementById(`mword_${currentWordIndex}`);
        if (activeWordEl) activeWordEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function micBtnActiveStyle(active) {
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
    }

    function stopListeningState() {
        isListening = false;
        micBtnActiveStyle(false);
        const lbl = document.getElementById('memoStatusLabel');
        if(lbl && currentMemoMode === 'voice') lbl.textContent = '⏸️ الميكروفون متوقف. انقر للبدء.';
    }

    window.toggleMemoListening = function() {
        if (!recognition) return;
        if (isListening) recognition.stop();
        else recognition.start();
    };

    window.manualMemoAdvance = function(isCorrect) {
        if (currentWordIndex >= memoWords.length) return;
        if (!isCorrect) memoErrors.push(currentWordIndex);
        currentWordIndex++;
        renderMemoWordsUI();
        checkSessionEnd();
    };

    function checkSessionEnd() {
        if (currentWordIndex >= memoWords.length) {
            if (recognition && isListening) recognition.stop();
            const inpField = document.getElementById('memoTextInputField');
            if (inpField) inpField.disabled = true;

            const total = memoWords.length;
            const wrong = memoErrors.length;
            const accuracy = Math.round(((total - wrong) / total) * 100);

            if (typeof window.boostFlame === 'function') window.boostFlame(Math.max(2, Math.round(accuracy/10)));

            document.getElementById('memoStatusLabel').innerHTML = `
                <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 14px; border-radius: 12px; margin-top: 10px; line-height: 1.8;">
                    <span style="color: var(--gold); font-weight: bold; display: block; margin-bottom: 6px; font-size: 16px;">🎉 اكتملت جلسة المراجعة!</span>
                    الكلمات الإجمالية: ${total} | الأخطاء: <span style="color:#ff4d4d; font-weight:bold;">${wrong}</span> | نسبة الإتقان: <span style="color:var(--green); font-weight:bold;">${accuracy}%</span>
                </div>
            `;
        }
    }

    window.resetMemoSession = function() {
        if (recognition && isListening) recognition.stop();
        memoWords = [];
        currentWordIndex = 0;
        memoErrors = [];
        document.getElementById('memoInputArea').style.display = 'block';
        document.getElementById('memoActiveArea').style.display = 'none';
        const inp = document.getElementById('memoTextInputField');
        if(inp) inp.remove();
    };

    // ربط تلقائي عند تحميل الصفحة لتجهيز أزرار الخيارات الجاهزة
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(injectMemoModeSelectors, 1000);
    });

    // 🔗 الربط الذهبي مع مصحفك: دالة مخصصة تُستدعى من شاشة خيارات الآية (Action Sheet)
    window.startMemoFromQuranSelection = function(startIdx, endIdx) {
        if (!window.currentAyahsData) return;
        let selectedTextCombined = "";
        for (let i = startIdx; i <= endIdx; i++) {
            selectedTextCombined += window.currentAyahsData[i].text + " ";
        }
        
        // الانتقال لصفحة التسميع وضخ النص بداخلها أوتوماتيكياً
        showPage('memorizationPage', null);
        setTimeout(() => {
            window.resetMemoSession();
            window.initMemorizationSession(selectedTextCombined.trim());
        }, 300);
    };

})();
