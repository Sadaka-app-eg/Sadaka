// =========================================================================
// 🌟 محرك المؤثرات البصرية والجماليات الملكية لشبكة أثر - إصدار 2026 (v2)
// =========================================================================
// يشمل: جزيئات ساقطة هادئة + احترام إعدادات المستخدم + توقف عند الخلفية
// + توهج الأزرار + خلفية متدرجة بطيئة + ظهور الآيات بنور + نبضة التسبيح
// + اهتزاز خفيف + إطار زخرفي + تقليب الصفحات + عداد الصلاة الدائري
// + skeleton loading زخرفي + fade شاشة كامل + تهنئة إتمام العمل
// =========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 0️⃣ إعداد عام: احترام تفضيل "تقليل الحركة" في الجهاز
  // -----------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // -----------------------------------------------------------------------
  // 1️⃣ حقن كل الستايلات دفعة واحدة
  // -----------------------------------------------------------------------
  const athrStyles = document.createElement('style');
  athrStyles.innerHTML = `
    /* ===== أنميشن الهبوط الانسيابي ===== */
    @keyframes athrFall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.4; }
      100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
    }

    /* ===== أنميشن التلألؤ الخلفي الهادئ ===== */
    @keyframes athrTwinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 0.7; transform: scale(1.2); }
    }

    .athr-particle {
      position: fixed;
      pointer-events: none;
      z-index: 1;
      font-family: 'Amiri', serif;
      line-height: 1;
      user-select: none;
    }

    /* ===== توهج هادئ حوالين الأزرار الأساسية ===== */
    .athr-glow-btn {
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.25);
      transition: box-shadow 0.6s ease;
    }
    .athr-glow-btn:hover,
    .athr-glow-btn:focus-visible {
      box-shadow: 0 0 16px rgba(212, 175, 55, 0.45);
    }

    /* ===== خلفية متدرجة بطيئة (إحساس نور متحرك) ===== */
    .athr-ambient-bg {
      background: linear-gradient(120deg, #0f1b12, #1a2e1f, #0f1b12);
      background-size: 200% 200%;
      animation: athrGradientShift 25s ease infinite;
    }
    @keyframes athrGradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* ===== ظهور الآيات/الأدعية بنور منساب ===== */
    .athr-verse-reveal {
      opacity: 0;
      animation: athrFadeGlow 1.2s ease-out forwards;
    }
    @keyframes athrFadeGlow {
      0% { opacity: 0; transform: translateY(8px); text-shadow: 0 0 0 rgba(212,175,55,0); }
      60% { text-shadow: 0 0 12px rgba(212,175,55,0.3); }
      100% { opacity: 1; transform: translateY(0); text-shadow: 0 0 4px rgba(212,175,55,0.15); }
    }

    /* ===== نبضة عداد التسبيح ===== */
    .athr-tasbih-count {
      display: inline-block;
      transition: transform 0.25s ease;
    }
    .athr-tasbih-count.pulse {
      animation: athrPulse 0.35s ease;
    }
    @keyframes athrPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.25); color: #d4af37; }
      100% { transform: scale(1); }
    }

    /* ===== إطار زخرفي إسلامي بسيط حوالين البطاقات ===== */
    .athr-frame {
      position: relative;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 12px;
    }
    .athr-frame::before,
    .athr-frame::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border: 1px solid rgba(212, 175, 55, 0.5);
      pointer-events: none;
    }
    .athr-frame::before {
      top: -1px; right: -1px;
      border-left: none; border-bottom: none;
      border-top-right-radius: 10px;
    }
    .athr-frame::after {
      bottom: -1px; left: -1px;
      border-right: none; border-top: none;
      border-bottom-left-radius: 10px;
    }

    /* ===== تقليب الصفحات ===== */
    .athr-page-turn {
      animation: athrTurn 0.5s ease;
      transform-origin: left center;
    }
    @keyframes athrTurn {
      0% { transform: rotateY(15deg); opacity: 0.3; }
      100% { transform: rotateY(0deg); opacity: 1; }
    }

    /* ===== عداد وقت الصلاة الدائري ===== */
    .athr-prayer-ring {
      transform: rotate(-90deg);
    }
    .athr-prayer-ring circle {
      fill: none;
      stroke-width: 4;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s linear, stroke 1s ease;
    }
    .athr-prayer-ring .athr-ring-track {
      stroke: rgba(212, 175, 55, 0.12);
    }
    .athr-prayer-ring .athr-ring-progress {
      stroke: #4CAF50;
    }
    .athr-prayer-ring .athr-ring-progress.athr-ring-warning {
      stroke: #d4af37;
    }

    /* ===== Skeleton loading زخرفي ===== */
    .athr-skeleton {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      animation: athrTwinkle 1.6s ease-in-out infinite;
      font-size: 20px;
    }

    /* ===== Overlay فيد ناعم لشاشة كاملة ===== */
    .athr-fade-overlay {
      position: fixed;
      inset: 0;
      background: #0f1b12;
      z-index: 9999;
      opacity: 1;
      pointer-events: none;
      transition: opacity 0.8s ease;
    }
    .athr-fade-overlay.athr-fade-out {
      opacity: 0;
    }

    /* ===== تهنئة إتمام العمل (ورد / سورة / صلاة) ===== */
    .athr-completion-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(15, 27, 18, 0.95);
      color: #d4af37;
      border: 1px solid rgba(212, 175, 55, 0.3);
      padding: 12px 24px;
      border-radius: 999px;
      font-family: 'Amiri', serif;
      font-size: 15px;
      opacity: 0;
      z-index: 9998;
      transition: opacity 0.4s ease, transform 0.4s ease;
      pointer-events: none;
    }
    .athr-completion-toast.athr-show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .athr-confetti-particle {
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      font-size: 16px;
      user-select: none;
    }
    @keyframes athrConfettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(120px) rotate(180deg); opacity: 0; }
    }

    /* احترام تقليل الحركة على مستوى النظام كله */
    @media (prefers-reduced-motion: reduce) {
      .athr-particle,
      .athr-ambient-bg,
      .athr-skeleton,
      .athr-confetti-particle {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(athrStyles);

  // -----------------------------------------------------------------------
  // 2️⃣ محرك الجزيئات الساقطة بهدوء (Falling Ambiance)
  // -----------------------------------------------------------------------
  let fallingIntervalId = null;

  function createFallingParticle() {
    if (document.querySelectorAll('.athr-particle').length > 15) return;

    const shapes = ['✨', '🌿', '🌙', '•'];
    const particle = document.createElement('div');
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

    particle.className = 'athr-particle';
    particle.innerHTML = randomShape;

    let size = Math.random() * 12 + 8;
    let color = 'var(--gold, #d4af37)';

    if (randomShape === '🌿') {
      color = '#4CAF50';
      size = Math.random() * 10 + 6;
    } else if (randomShape === '•') {
      color = '#d4af37';
      size = Math.random() * 6 + 4;
    }

    const leftPos = Math.random() * 100;
    const duration = Math.random() * 8 + 8;
    const delay = Math.random() * 5;

    particle.style.cssText = `
      left: ${leftPos}vw;
      top: -20px;
      font-size: ${size}px;
      color: ${color};
      opacity: 0;
      animation: athrFall ${duration}s linear ${delay}s infinite;
    `;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000);
  }

  window.initAthrFallingAmbiance = function () {
    if (prefersReducedMotion) return; // احترام تفضيل المستخدم
    if (fallingIntervalId) return; // منع التكرار لو اتنادت أكتر من مرة
    fallingIntervalId = setInterval(createFallingParticle, 2500);
  };

  window.stopAthrFallingAmbiance = function () {
    if (fallingIntervalId) {
      clearInterval(fallingIntervalId);
      fallingIntervalId = null;
    }
  };

  // إيقاف مؤقت للجزيئات لما التطبيق يروح للخلفية (توفير بطارية)
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.athr-particle').forEach((p) => {
      p.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
  });

  // -----------------------------------------------------------------------
  // 3️⃣ ظهور الآيات/الأدعية بنور منساب
  // -----------------------------------------------------------------------
  // الاستخدام: أضف class="athr-verse-reveal" للعنصر عند إدراجه في الـ DOM
  window.athrRevealVerse = function (element) {
    if (!element) return;
    element.classList.remove('athr-verse-reveal');
    // إعادة تشغيل الأنميشن حتى لو العنصر موجود بالفعل
    void element.offsetWidth;
    element.classList.add('athr-verse-reveal');
  };

  // -----------------------------------------------------------------------
  // 4️⃣ عداد التسبيح: نبضة + اهتزاز خفيف عند كل ضغطة
  // -----------------------------------------------------------------------
  window.athrTasbihTap = function (counterElement) {
    // اهتزاز خفيف جداً لو الجهاز بيدعم ذلك
    if (navigator.vibrate) {
      navigator.vibrate(8);
    }

    if (counterElement) {
      counterElement.classList.remove('pulse');
      void counterElement.offsetWidth;
      counterElement.classList.add('pulse');
    }
  };

  // -----------------------------------------------------------------------
  // 5️⃣ تأثير تقليب الصفحة عند التنقل بين صفحات القرآن
  // -----------------------------------------------------------------------
  window.athrTurnPage = function (element) {
    if (!element || prefersReducedMotion) return;
    element.classList.remove('athr-page-turn');
    void element.offsetWidth;
    element.classList.add('athr-page-turn');
  };

  // -----------------------------------------------------------------------
  // 6️⃣ عداد وقت الصلاة القادمة (Progress Ring)
  // -----------------------------------------------------------------------
  // svgElement لازم يحتوي على دايرتين: .athr-ring-track و .athr-ring-progress
  // percentRemaining: نسبة من 0 لـ 100 (100 = لسه بدري، 0 = الوقت قرب أوي)
  window.athrUpdatePrayerRing = function (svgElement, percentRemaining) {
    if (!svgElement) return;
    const progressCircle = svgElement.querySelector('.athr-ring-progress');
    if (!progressCircle) return;

    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, percentRemaining));
    const offset = circumference - (clamped / 100) * circumference;

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = offset;

    // يتحول للون الذهبي تحذيرياً لما الوقت يقرب (أقل من 15%)
    progressCircle.classList.toggle('athr-ring-warning', clamped < 15);
  };

  // -----------------------------------------------------------------------
  // 7️⃣ Skeleton Loading زخرفي (هلال نابض بدل الرمادي التقليدي)
  // -----------------------------------------------------------------------
  window.athrCreateSkeleton = function (shape) {
    const el = document.createElement('span');
    el.className = 'athr-skeleton';
    el.innerHTML = shape || '🌙';
    return el;
  };

  // -----------------------------------------------------------------------
  // 8️⃣ Overlay فيد ناعم (بيستخدم مع صوت الأذان أو تنبيه هام)
  // -----------------------------------------------------------------------
  window.athrShowFadeOverlay = function (durationMs) {
    const overlay = document.createElement('div');
    overlay.className = 'athr-fade-overlay';
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      setTimeout(() => {
        overlay.classList.add('athr-fade-out');
        setTimeout(() => overlay.remove(), 800);
      }, durationMs || 400);
    });

    return overlay;
  };

  // -----------------------------------------------------------------------
  // 9️⃣ رسالة تهنئة بإتمام عمل (ختم سورة / ورد / صلاة) + كونفيتي خفيف
  // -----------------------------------------------------------------------
  window.athrShowCompletionToast = function (message) {
    const toast = document.createElement('div');
    toast.className = 'athr-completion-toast';
    toast.textContent = message || 'بارك الله فيك، تم بحمد الله ✨';
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('athr-show'));

    setTimeout(() => {
      toast.classList.remove('athr-show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);

    if (!prefersReducedMotion) {
      spawnAthrConfetti();
    }
  };

  function spawnAthrConfetti() {
    const shapes = ['✨', '🌿'];
    const count = 10; // كمية خفيفة عشان يفضل هادي مش صاخب

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'athr-confetti-particle';
        piece.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];

        const leftPos = 40 + Math.random() * 20; // متمركزة في النص
        piece.style.cssText = `
          left: ${leftPos}vw;
          bottom: 80px;
          animation: athrConfettiFall 1.4s ease-out forwards;
        `;

        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
      }, i * 60);
    }
  }

  // -----------------------------------------------------------------------
  // 🔟 تشغيل الأجواء الجمالية تلقائياً بمجرد تحميل الصفحة
  // -----------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    window.initAthrFallingAmbiance();
  });
})();
