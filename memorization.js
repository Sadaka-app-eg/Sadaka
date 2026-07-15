/**
 * 🧠 مُصَحِّحُ التَّسْمِيعِ الصَّوْتِيِّ الذَّكِيِّ - كُن ذا أثر
 * ملف مستقل يعمل فرونت إند بالكامل عبر Web Speech API مع Fallback يدوي فخم للآيفون
 */

(function() {
    let memoWords = [];
    let currentWordIndex = 0;
    let memoErrors = [];
    let recognition = null;
    let isListening = false;

    // تنظيف النصوص العربية من التشكيل والهمزات لضمان دقة المقارنة الصامتة
    function cleanArabicText(text) {
        if (!text) return "";
        return text
            .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل بالكامل
            .replace(/[أإآا]/g, "ا")         // توحيد الألفات
            .replace(/ة/g, "ه")              // التاء المربوطة
            .replace(/ى/g, "ي")              // الألف المقصورة
            .trim();
    }

    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;
        
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'ar-SA';
        return rec;
    }

    window.initMemorizationSession = function() {
        const rawText = document.getElementById('memoTargetText').value.trim();
        if (!rawText) {
            alert('الرجاء كتابة أو لصق الكلمات أو الآيات المراد مراجعتها أولاً! 📝');
            return;
        }

        memoWords = rawText.split(/\s+/).filter(w => w.length > 0);
        currentWordIndex = 0;
        memoErrors = [];

        if (memoWords.length === 0) return;

        document.getElementById('memoInputArea').style.display = 'none';
        document.getElementById('memoActiveArea').style.display = 'block';

        renderMemoWordsUI();

        recognition = initSpeechRecognition();
        const statusLabel = document.getElementById('memoStatusLabel');
        
        if (!recognition) {
            statusLabel.innerHTML = `<span style="color:#ff6b6b; font-weight:bold;">🎙️ وضع التسميع اليدوي نشط:</span> متصفحك الحالي لا يدعم التعرف الصوتي (مثل متصفح Safari على آيفون). يمكنك استعمال الأزرار اليدوية بالأسفل للتسميع بكفاءة وسلاسة تامة.`;
            document.getElementById('memoMicBtn').style.display = 'none';
        } else {
            statusLabel.textContent = 'انقر على الميكروفون وابدأ القراءة بصوت واضح ومسموع...';
            setupRecognitionEvents();
        }
    };

    function renderMemoWordsUI() {
        const container = document.getElementById('memoWordsContainer');
        if (!container) return;

        container.innerHTML = memoWords.map((word, idx) => {
            let colorStyle = 'color: var(--text2); opacity: 0.35;'; 
            let borderStyle = '';

            if (idx === currentWordIndex) {
                colorStyle = 'color: var(--gold); font-weight: bold; font-size: 28px;'; 
                borderStyle = 'border-bottom: 2px solid var(--gold);';
            } else if (idx < currentWordIndex) {
                if (memoErrors.includes(idx)) {
                    colorStyle = 'color: #ff4d4d; text-decoration: line-through; font-weight: bold;'; 
                } else {
                    colorStyle = 'color: var(--green); font-weight: bold;'; 
                }
            }

            return `<span id="mword_${idx}" style="display: inline-block; margin: 0 5px; padding: 2px; transition: all 0.2s; ${colorStyle} ${borderStyle}">${word}</span>`;
        }).join(' ');

        const activeWordEl = document.getElementById(`mword_${currentWordIndex}`);
        if (activeWordEl) {
            activeWordEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function setupRecognitionEvents() {
        if (!recognition) return;

        recognition.onstart = function() {
            isListening = true;
            const micBtn = document.getElementById('memoMicBtn');
            if (micBtn) {
                micBtn.style.background = 'var(--gold)';
                micBtn.style.color = '#111';
                micBtn.style.boxShadow = '0 0 15px var(--gold)';
            }
            document.getElementById('memoStatusLabel').textContent = '🎤 محرك أثر يستمع إليك الآن.. اقرأ...';
        };

        recognition.onresult = function(event) {
            const resultIndex = event.resultIndex;
            const transcript = event.results[resultIndex][0].transcript.trim();
            const spokenWords = transcript.split(/\s+/);
            
            spokenWords.forEach(spokenWord => {
                if (currentWordIndex >= memoWords.length) return;

                const targetWord = memoWords[currentWordIndex];
                const cleanTarget = cleanArabicText(targetWord);
                const cleanSpoken = cleanArabicText(spokenWord);

                if (cleanTarget === cleanSpoken || cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget)) {
                    currentWordIndex++;
                } else {
                    memoErrors.push(currentWordIndex);
                    currentWordIndex++;
                    if (navigator.vibrate) navigator.vibrate(80); 
                }
            });

            renderMemoWordsUI();
            checkSessionEnd();
        };

        recognition.onerror = function() {
            stopListeningState();
        };

        recognition.onend = function() {
            stopListeningState();
        };
    }

    function stopListeningState() {
        isListening = false;
        const micBtn = document.getElementById('memoMicBtn');
        if (micBtn) {
            micBtn.style.background = 'rgba(212,175,55,0.12)';
            micBtn.style.color = 'var(--gold)';
            micBtn.style.boxShadow = 'none';
        }
        const statusLabel = document.getElementById('memoStatusLabel');
        if (statusLabel && recognition) {
            statusLabel.textContent = '⏸️ تم إيقاف الميكروفون. انقر مجدداً للمتابعة.';
        }
    }

    window.toggleMemoListening = function() {
        if (!recognition) return;
        if (isListening) recognition.stop();
        else recognition.start();
    };

    window.manualMemoAdvance = function(isCorrect) {
        if (currentWordIndex >= memoWords.length) return;

        if (!isCorrect) {
            memoErrors.push(currentWordIndex);
            if (navigator.vibrate) navigator.vibrate(60);
        }

        currentWordIndex++;
        renderMemoWordsUI();
        checkSessionEnd();
    };

    function checkSessionEnd() {
        if (currentWordIndex >= memoWords.length) {
            if (recognition && isListening) recognition.stop();
            
            const totalWords = memoWords.length;
            const wrongCount = memoErrors.length;
            const rightCount = totalWords - wrongCount;
            const accuracy = Math.round((rightCount / totalWords) * 100);

            if (typeof window.boostFlame === 'function') {
                window.boostFlame(Math.max(2, Math.round(accuracy / 10)));
            }

            document.getElementById('memoStatusLabel').innerHTML = `
                <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 14px; border-radius: 12px; margin-top: 10px; line-height: 1.8;">
                    <span style="color: var(--gold); font-weight: bold; display: block; margin-bottom: 6px; font-size: 16px;">🎉 اكتملت جلسة المراجعة بنجاح!</span>
                    إجمالي الكلمات المسمّعة: ${totalWords} | عدد الأخطاء: <span style="color:#ff4d4d; font-weight:bold;">${wrongCount}</span><br>
                    نسبة جودة الإتقان: <span style="color: var(--green); font-weight: bold;">${accuracy}%</span>
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
        document.getElementById('memoTargetText').value = '';
    };
})();
