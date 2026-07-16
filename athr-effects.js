// =========================================================================
// 🌟 محرك المؤثرات البصرية والجماليات الملكية الفاخرة لشبكة أثر - الإصدار الثالث (v3)
// =========================================================================
// تصميم وهندسة: خبير UX/UI ومهندس Front-End
// مكتبة متكاملة ومستقلة تماماً لإضفاء طابع إسلامي ملكي انسيابي ذو أداء فائق (60FPS)
// مع مراعاة كاملة لاستهلاك البطارية، الذاكرة، والأجهزة الضعيفة.
// =========================================================================

(function () {
  'use strict';

  // لضمان عدم تكرار تعريف المكتبة إذا تم استدعاؤها مرتين
  if (window.AthrEffects) return;

  // -----------------------------------------------------------------------
  // ⚙️ التفضيلات والتهيئات الافتراضية الداخية
  // -----------------------------------------------------------------------
  const CONFIG = {
    quality: 'high',            // 'low' | 'medium' | 'high'
    particlesEnabled: true,
    soundsEnabled: true,
    motionEnabled: true,
    glowEnabled: true,
    maxParticles: { low: 5, medium: 12, high: 22 },
    isBackground: false
  };

  // احترام تفضيل نظام التشغيل لتقليل الحركة
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    CONFIG.motionEnabled = false;
  }

  // -----------------------------------------------------------------------
  // 🎨 حقن الستايلات الشاملة (CSS Injection) دفعة واحدة داخل الـ <head>
  // -----------------------------------------------------------------------
  const styles = document.createElement('style');
  styles.id = 'athr-effects-v3-styles';
  styles.innerHTML = `
    :root {
      --athr-gold: #d4af37;
      --athr-gold-rgb: 212, 175, 55;
      --athr-green: #4CAF50;
      --athr-green-rgb: 76, 175, 80;
      --athr-bg: #0f1b12;
      --athr-bg-rgb: 15, 27, 18;
    }

    /* 1️⃣ جزيئات السقوط الهادئ والنجوم المتلألئة */
    .athr-particle {
      position: fixed;
      pointer-events: none;
      z-index: 10;
      font-family: 'Amiri', serif;
      line-height: 1;
      user-select: none;
      will-change: transform, opacity;
    }
    @keyframes athrFallAnim {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
      15% { opacity: 0.7; }
      85% { opacity: 0.4; }
      100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
    }
    @keyframes athrTwinkleAnim {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.2); }
    }

    /* 2️⃣ أشعة النور الذهبية الناعمة (Light Rays) */
    .athr-light-rays-container {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 60vh;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      opacity: 0.15;
      mix-blend-mode: screen;
      will-change: opacity;
    }
    .athr-ray {
      position: absolute;
      top: -10%;
      width: 30vw;
      height: 120vh;
      background: linear-gradient(to right, rgba(var(--athr-gold-rgb), 0) 0%, rgba(var(--athr-gold-rgb), 0.18) 50%, rgba(var(--athr-gold-rgb), 0) 100%);
      transform-origin: top center;
      transform: rotate(-15deg);
      animation: athrRaySwing 22s ease-in-out infinite alternate;
    }
    .athr-ray:nth-child(2) {
      left: 35%;
      width: 40vw;
      animation-duration: 32s;
      animation-delay: -5s;
    }
    .athr-ray:nth-child(3) {
      left: 70%;
      width: 25vw;
      animation-duration: 18s;
      animation-delay: -10s;
    }
    @keyframes athrRaySwing {
      0% { transform: rotate(-20deg) scaleX(0.9); }
      100% { transform: rotate(-5deg) scaleX(1.1); }
    }

    /* 3️⃣ الضباب الناعم (Soft Fog) */
    .athr-fog-container {
      position: fixed;
      bottom: 0; left: 0; width: 100%; height: 35vh;
      pointer-events: none;
      z-index: 2;
      overflow: hidden;
      opacity: 0.08;
      mix-blend-mode: screen;
    }
    .athr-fog-layer {
      position: absolute;
      bottom: 0; width: 200%; height: 100%;
      background: radial-gradient(circle at 50% 100%, rgba(var(--athr-gold-rgb), 0.25), transparent 70%);
      animation: athrFogMove 50s linear infinite;
      will-change: transform;
    }
    .athr-fog-layer-2 {
      position: absolute;
      bottom: 0; width: 200%; height: 100%;
      background: radial-gradient(circle at 30% 100%, rgba(var(--athr-green-rgb), 0.2), transparent 60%);
      animation: athrFogMove 35s linear infinite reverse;
      will-change: transform;
    }
    @keyframes athrFogMove {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }

    /* 4️⃣ الخلفية التفاعلية المتدرجة */
    .athr-ambient-bg {
      background: linear-gradient(135deg, #070d09, #0f1b12, #182c1e, #0f1b12);
      background-size: 300% 300%;
      transition: background 1.5s ease;
    }
    .athr-ambient-bg-animate {
      animation: athrGradientShift 28s ease infinite;
    }
    @keyframes athrGradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* 5️⃣ تأثير التموج والارتداد على الأزرار (Ripple Effect) */
    .athr-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(var(--athr-gold-rgb), 0.4);
      transform: scale(0);
      pointer-events: none;
      animation: athrRippleAnim 0.65s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
    }
    @keyframes athrRippleAnim {
      to { transform: scale(4); opacity: 0; }
    }

    /* 6️⃣ توهج هادئ للأزرار الكبيرة */
    .athr-glow-btn {
      position: relative;
      outline: none;
      transition: box-shadow 0.5s ease, border-color 0.5s ease, transform 0.2s ease;
    }
    .athr-glow-btn-active {
      box-shadow: 0 0 10px rgba(var(--athr-gold-rgb), 0.25);
    }
    .athr-glow-btn-active:hover,
    .athr-glow-btn-active:focus-visible {
      box-shadow: 0 0 20px rgba(var(--athr-gold-rgb), 0.55), inset 0 0 6px rgba(var(--athr-gold-rgb), 0.2);
      border-color: var(--athr-gold) !important;
    }

    /* 7️⃣ ظهور الآيات بنور دافئ وارتفاع ناعم */
    .athr-verse-reveal {
      opacity: 0;
      will-change: transform, opacity;
    }
    .athr-verse-reveal-active {
      animation: athrVerseIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes athrVerseIn {
      0% { opacity: 0; transform: translateY(18px); filter: blur(4px); text-shadow: 0 0 0 rgba(var(--athr-gold-rgb), 0); }
      50% { text-shadow: 0 0 15px rgba(var(--athr-gold-rgb), 0.4); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); text-shadow: 0 0 6px rgba(var(--athr-gold-rgb), 0.2); }
    }

    /* 8️⃣ تأثير الآلة الكاتبة سطراً بسطر */
    .athr-typewriter-line {
      display: block;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.8s ease, transform 0.8s ease;
      margin-bottom: 6px;
    }
    .athr-typewriter-line.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* 9️⃣ العداد الدائري لأوقات الصلاة */
    .athr-prayer-ring {
      transform: rotate(-90deg);
      transform-origin: center;
    }
    .athr-prayer-ring circle {
      fill: none;
      stroke-width: 5;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.8s ease;
    }
    .athr-ring-track {
      stroke: rgba(var(--athr-gold-rgb), 0.1);
    }
    .athr-ring-progress {
      stroke: var(--athr-green);
    }
    .athr-ring-progress.warning {
      stroke: var(--athr-gold);
    }
    .athr-ring-progress.danger {
      stroke: #f44336;
    }

    /* 🔟 تقليب الصفحات (كتابة مصحف) */
    .athr-page-turn-active {
      animation: athrPageTurnAnim 0.75s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
      transform-origin: right center;
      backface-visibility: hidden;
    }
    @keyframes athrPageTurnAnim {
      0% { transform: perspective(1200px) rotateY(0deg); filter: brightness(1); }
      40% { filter: brightness(0.85); }
      100% { transform: perspective(1200px) rotateY(-180deg); filter: brightness(1.05); opacity: 0; }
    }

    /* 1️⃣1️⃣ نقل الصفحات بتأثير الفيد والضباب */
    .athr-page-transition {
      animation: athrPageTransAnim 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }
    @keyframes athrPageTransAnim {
      0% { opacity: 0; filter: blur(8px); transform: scale(0.98); }
      100% { opacity: 1; filter: blur(0); transform: scale(1); }
    }

    /* 1️⃣2️⃣ هالة تشغيل الصوتيات الدائرية المتسعة */
    .athr-halo-container {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .athr-halo-ring {
      position: absolute;
      inset: -8px;
      border: 1px solid rgba(var(--athr-gold-rgb), 0.4);
      border-radius: 50%;
      pointer-events: none;
      animation: athrHaloPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
      will-change: transform, opacity;
    }
    .athr-halo-ring:nth-child(2) {
      animation-delay: 0.8s;
    }
    .athr-halo-ring:nth-child(3) {
      animation-delay: 1.6s;
    }
    @keyframes athrHaloPulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      100% { transform: scale(1.45); opacity: 0; }
    }

    /* 1️⃣3️⃣ نبضات عداد التسبيح */
    .athr-tasbih-element {
      display: inline-block;
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.2s ease;
    }
    .athr-tasbih-pulse {
      animation: athrTasbihPulseAnim 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .athr-tasbih-pulse-major {
      animation: athrTasbihPulseMajorAnim 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5) forwards;
    }
    @keyframes athrTasbihPulseAnim {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); text-shadow: 0 0 10px rgba(var(--athr-gold-rgb), 0.6); }
      100% { transform: scale(1); }
    }
    @keyframes athrTasbihPulseMajorAnim {
      0% { transform: scale(1); }
      40% { transform: scale(1.35); text-shadow: 0 0 22px rgba(var(--athr-gold-rgb), 0.9); color: var(--athr-gold); }
      100% { transform: scale(1); }
    }

    /* 1️⃣4️⃣ الإطار الإسلامي الزخرفي الفاخر */
    .athr-frame {
      position: relative;
      border: 1px solid rgba(var(--athr-gold-rgb), 0.25);
      border-radius: 14px;
      background: rgba(var(--athr-bg-rgb), 0.65);
      backdrop-filter: blur(8px);
      box-sizing: border-box;
    }
    .athr-frame::before,
    .athr-frame::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border: 1px solid rgba(var(--athr-gold-rgb), 0.55);
      pointer-events: none;
      box-sizing: border-box;
    }
    .athr-frame::before {
      top: -1px; right: -1px;
      border-left: none; border-bottom: none;
      border-top-right-radius: 12px;
    }
    .athr-frame::after {
      bottom: -1px; left: -1px;
      border-right: none; border-top: none;
      border-bottom-left-radius: 12px;
    }
    /* إضافات زوايا هندسية إسلامية صغيرة بالداخل */
    .athr-frame-corner-tr, .athr-frame-corner-bl {
      position: absolute;
      width: 6px; height: 6px;
      background: var(--athr-gold);
      pointer-events: none;
    }
    .athr-frame-corner-tr { top: 3px; right: 3px; border-radius: 50%; }
    .athr-frame-corner-bl { bottom: 3px; left: 3px; border-radius: 50%; }

    /* 1️⃣5️⃣ الـ Skeleton Loading الإسلامي الهلالي */
    .athr-skeleton-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      padding: 16px;
    }
    .athr-skeleton-bar {
      height: 16px;
      background: linear-gradient(90deg, rgba(var(--athr-gold-rgb), 0.05) 25%, rgba(var(--athr-gold-rgb), 0.15) 50%, rgba(var(--athr-gold-rgb), 0.05) 75%);
      background-size: 200% 100%;
      animation: athrSkeletonShimmer 2s infinite linear;
      border-radius: 4px;
    }
    .athr-skeleton-crescent {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: rgba(var(--athr-gold-rgb), 0.45);
      animation: athrSkeletonPulse 1.6s ease-in-out infinite;
    }
    @keyframes athrSkeletonShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes athrSkeletonPulse {
      0%, 100% { opacity: 0.3; transform: scale(0.9) rotate(-10deg); }
      50% { opacity: 0.8; transform: scale(1.1) rotate(10deg); }
    }

    /* 1️⃣6️⃣ لوحة تهنئة إتمام العمل والعبادة (Toast) */
    .athr-toast {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%) translateY(30px);
      background: rgba(var(--athr-bg-rgb), 0.96);
      color: var(--athr-gold);
      border: 1px solid rgba(var(--athr-gold-rgb), 0.35);
      padding: 14px 28px;
      border-radius: 30px;
      font-family: 'Amiri', serif;
      font-size: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      opacity: 0;
      z-index: 10000;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .athr-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .athr-confetti {
      position: fixed;
      pointer-events: none;
      z-index: 10001;
      font-size: 18px;
      user-select: none;
      will-change: transform, opacity;
    }
    @keyframes athrConfettiAnim {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
      100% { transform: translate3d(var(--x), var(--y), 0) rotate(360deg); opacity: 0; }
    }

    /* 1️⃣7️⃣ الأثر المتبقي الذهبي أثناء السحب واللمس (Trail Effect) */
    .athr-trail-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background: var(--athr-gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      opacity: 0.8;
      box-shadow: 0 0 6px var(--athr-gold);
      will-change: transform, opacity;
      transition: transform 0.4s ease-out, opacity 0.4s ease-out;
    }

    /* 1️⃣8️⃣ ساعة الحائط الإسلامية الفاخرة */
    .athr-clock-container {
      width: 160px;
      height: 160px;
      border: 2px solid rgba(var(--athr-gold-rgb), 0.3);
      border-radius: 50%;
      position: relative;
      background: rgba(var(--athr-bg-rgb), 0.4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .athr-clock-hand {
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform-origin: bottom center;
      background: var(--athr-gold);
      border-radius: 4px;
      transform: translateX(-50%) rotate(0deg);
      will-change: transform;
    }
    .athr-clock-hour { height: 40px; width: 3px; }
    .athr-clock-minute { height: 55px; width: 2px; background: #fff; }
    .athr-clock-second { height: 62px; width: 1px; background: var(--athr-green); }
    .athr-clock-center {
      position: absolute;
      width: 8px; height: 8px;
      background: var(--athr-gold);
      border-radius: 50%;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    /* 1️⃣9️⃣ الهلال المتحرك (Moon Animation) */
    .athr-moon-container {
      position: relative;
      width: 120px; height: 120px;
    }
    .athr-moon-body {
      width: 100px; height: 100px;
      border-radius: 50%;
      box-shadow: 15px 15px 0 0 var(--athr-gold);
      position: absolute;
      top: 10px; left: -5px;
      transform-origin: center;
      animation: athrMoonFloat 8s ease-in-out infinite alternate;
      will-change: transform;
    }
    @keyframes athrMoonFloat {
      0% { transform: translateY(0) rotate(-5deg); }
      100% { transform: translateY(-10px) rotate(5deg); }
    }

    /* 2️⃣0️⃣ تنفس البطاقات المهدئ للروح (Breathing Card) */
    .athr-card-breath {
      animation: athrBreathAnim 7s ease-in-out infinite alternate;
      will-change: transform;
    }
    @keyframes athrBreathAnim {
      0% { transform: scale(1); }
      100% { transform: scale(1.02); }
    }

    /* 2️⃣1️⃣ الزجاج الخلفي للبطاقات (Glass Effect) */
    .athr-glass {
      background: rgba(var(--athr-bg-rgb), 0.55);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-top: 1px solid rgba(var(--athr-gold-rgb), 0.15);
    }

    /* 2️⃣2️⃣ غطاء تعتيم وضباب خلفي للـ Dialogs */
    .athr-blur-overlay {
      position: fixed;
      inset: 0;
      background: rgba(var(--athr-bg-rgb), 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 999;
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
    .athr-blur-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }

    /* 2️⃣3️⃣ نجاح العبادة الفخم (Success Celebration Fullscreen) */
    .athr-success-screen {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle, rgba(var(--athr-green-rgb), 0.25) 0%, rgba(var(--athr-bg-rgb), 0.95) 100%);
      z-index: 100000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .athr-success-screen.show {
      opacity: 1;
      pointer-events: auto;
    }
    .athr-success-glow {
      font-size: 80px;
      color: var(--athr-gold);
      text-shadow: 0 0 40px rgba(var(--athr-gold-rgb), 0.8);
      animation: athrSuccessPop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes athrSuccessPop {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* احترام تفضيل نظام التشغيل لتقليل الحركة */
    @media (prefers-reduced-motion: reduce) {
      .athr-particle, .athr-ray, .athr-fog-layer, .athr-fog-layer-2,
      .athr-ambient-bg-animate, .athr-halo-ring, .athr-card-breath, .athr-moon-body {
        animation: none !important;
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(styles);

  // -----------------------------------------------------------------------
  // 🎵 إدارة الأصوات المحيطية (Ambient Sounds Core)
  // -----------------------------------------------------------------------
  const AudioEngine = {
    sources: {
      rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // روابط كمثال حقيقي وصحيح وقابل للتشغيل والتحميل
      river: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      birds: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      wind: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      ocean: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    instances: {},
    
    play(track, volume = 0.5) {
      if (!CONFIG.soundsEnabled || !this.sources[track]) return;
      
      if (!this.instances[track]) {
        const audio = new Audio(this.sources[track]);
        audio.loop = true;
        this.instances[track] = audio;
      }
      
      const audio = this.instances[track];
      audio.volume = volume;
      audio.play().catch(err => console.log('تعذر تشغيل الصوت حتى يلمس المستخدم الشاشة.', err));
    },

    pause(track) {
      if (this.instances[track]) {
        this.instances[track].pause();
      }
    },

    setVolume(track, volume) {
      if (this.instances[track]) {
        this.instances[track].volume = Math.max(0, Math.min(1, volume));
      }
    },

    stopAll() {
      Object.keys(this.instances).forEach(key => {
        this.instances[key].pause();
      });
    }
  };

  // -----------------------------------------------------------------------
  // ☀️ التحول اللوني للاقتراب من موعد الأذان (Prayer Time Transition)
  // -----------------------------------------------------------------------
  function applyPrayerTimeColorShift() {
    // تدرج لوني دافئ برتقالي محمر هادئ يمتزج بالخلفية للإشارة لعدم بقاء سوى 10 دقائق للأذان
    const targetBg = 'linear-gradient(135deg, #181105, #0f1b12, #0d0812)';
    const el = document.querySelector('.athr-ambient-bg');
    if (el) {
      el.style.background = targetBg;
    }
  }

  // -----------------------------------------------------------------------
  // 📝 الرسائل الترحيبية اليومية المتنوعة
  // -----------------------------------------------------------------------
  const DAILY_GREETINGS = [
    "﴿فاذكروني أذكركم﴾",
    "اللهم اجعل يومنا مباركاً وعامراً بذكرك",
    "صلاة واحدة على النبي ﷺ ترفعك بها عشر درجات",
    "﴿ألا بذكر الله تطمئن القلوب﴾",
    "ابدأ يومك بنية طيبة وعمل صالح يترك أثراً",
    "اللهم بك أصبحنا وبك أمسينا وبك نحيا"
  ];

  // -----------------------------------------------------------------------
  // 💫 محرك المؤثرات العامة والوظائف
  // -----------------------------------------------------------------------
  let activeFallingInterval = null;
  const trailPool = [];

  const AthrEffects = {
    // 🛠️ تمكين وتعطيل الميزات الكلية
    enable() {
      CONFIG.particlesEnabled = true;
      CONFIG.soundsEnabled = true;
      CONFIG.motionEnabled = true;
      CONFIG.glowEnabled = true;
      this.enableParticles();
      const bg = document.querySelector('.athr-ambient-bg');
      if (bg && CONFIG.motionEnabled) bg.classList.add('athr-ambient-bg-animate');
    },

    disable() {
      CONFIG.particlesEnabled = false;
      CONFIG.soundsEnabled = false;
      CONFIG.motionEnabled = false;
      CONFIG.glowEnabled = false;
      this.disableParticles();
      AudioEngine.stopAll();
      const bg = document.querySelector('.athr-ambient-bg');
      if (bg) bg.classList.remove('athr-ambient-bg-animate');
    },

    enableParticles() {
      CONFIG.particlesEnabled = true;
      if (!activeFallingInterval && !CONFIG.isBackground) {
        const speed = CONFIG.quality === 'low' ? 4000 : CONFIG.quality === 'medium' ? 2500 : 1500;
        activeFallingInterval = setInterval(() => this._spawnFallingParticle(), speed);
      }
    },

    disableParticles() {
      CONFIG.particlesEnabled = false;
      if (activeFallingInterval) {
        clearInterval(activeFallingInterval);
        activeFallingInterval = null;
      }
      document.querySelectorAll('.athr-particle').forEach(p => p.remove());
    },

    enableSounds() {
      CONFIG.soundsEnabled = true;
    },

    disableSounds() {
      CONFIG.soundsEnabled = false;
      AudioEngine.stopAll();
    },

    enableMotion() {
      CONFIG.motionEnabled = true;
      const bg = document.querySelector('.athr-ambient-bg');
      if (bg) bg.classList.add('athr-ambient-bg-animate');
    },

    disableMotion() {
      CONFIG.motionEnabled = false;
      const bg = document.querySelector('.athr-ambient-bg');
      if (bg) bg.classList.remove('athr-ambient-bg-animate');
    },

    enableGlow() {
      CONFIG.glowEnabled = true;
      document.querySelectorAll('.athr-glow-btn').forEach(btn => btn.classList.add('athr-glow-btn-active'));
    },

    disableGlow() {
      CONFIG.glowEnabled = false;
      document.querySelectorAll('.athr-glow-btn').forEach(btn => btn.classList.remove('athr-glow-btn-active'));
    },

    setQuality(level) {
      if (['low', 'medium', 'high'].includes(level)) {
        CONFIG.quality = level;
        // إعادة تهيئة سرعة تساقط الجزيئات بالتوافق مع الأداء
        if (CONFIG.particlesEnabled) {
          this.disableParticles();
          this.enableParticles();
        }
      }
    },

    // 1️⃣ تساقط الجزيئات الموزعة عشوائياً وبكفاءة
    _spawnFallingParticle() {
      if (CONFIG.isBackground || !CONFIG.particlesEnabled) return;
      const currentCount = document.querySelectorAll('.athr-particle').length;
      if (currentCount >= CONFIG.maxParticles[CONFIG.quality]) return;

      const shapes = ['✨', '🌿', '🌙', '•'];
      const el = document.createElement('div');
      el.className = 'athr-particle';
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      el.textContent = shape;

      let size = Math.random() * 10 + 10;
      let color = 'var(--athr-gold)';
      if (shape === '🌿') {
        color = 'var(--athr-green)';
        size = Math.random() * 8 + 8;
      } else if (shape === '•') {
        size = Math.random() * 4 + 4;
      }

      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10; // نزول هادئ للغاية وبطيء جداً
      const delay = Math.random() * 4;

      el.style.cssText = `
        left: ${left}vw;
        top: -30px;
        font-size: ${size}px;
        color: ${color};
        opacity: 0;
        animation: athrFallAnim ${duration}s linear ${delay}s infinite;
      `;

      document.body.appendChild(el);

      // تدمير وتنظيف الذاكرة بعد انتهاء دورة الحركة بالكامل
      setTimeout(() => {
        el.remove();
      }, (duration + delay) * 1000);
    },

    // 2️⃣ تهيئة النور والضباب الخلفي (Light Rays & Soft Fog)
    initAtmosphericEffects() {
      if (document.querySelector('.athr-light-rays-container')) return;

      const raysContainer = document.createElement('div');
      raysContainer.className = 'athr-light-rays-container';
      raysContainer.innerHTML = `
        <div class="athr-ray"></div>
        <div class="athr-ray"></div>
        <div class="athr-ray"></div>
      `;
      document.body.appendChild(raysContainer);

      const fogContainer = document.createElement('div');
      fogContainer.className = 'athr-fog-container';
      fogContainer.innerHTML = `
        <div class="athr-fog-layer"></div>
        <div class="athr-fog-layer-2"></div>
      `;
      document.body.appendChild(fogContainer);
    },

    // 3️⃣ النجوم المتلألئة الهادئة جداً (Twinkling Stars)
    spawnTwinklingStars(count = 10) {
      if (CONFIG.isBackground || prefersReducedMotion) return;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'athr-particle';
        star.textContent = '✦';
        star.style.cssText = `
          top: ${Math.random() * 70}vh;
          left: ${Math.random() * 100}vw;
          color: var(--athr-gold);
          font-size: ${Math.random() * 6 + 4}px;
          animation: athrTwinkleAnim ${Math.random() * 3 + 2}s ease-in-out infinite;
        `;
        fragment.appendChild(star);
        setTimeout(() => star.remove(), 10000);
      }
      document.body.appendChild(fragment);
    },

    // 4️⃣ تأثير التموج عند الضغط على الأزرار (Ripple)
    attachRipple(buttonElement) {
      if (!buttonElement) return;
      buttonElement.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        circle.className = 'athr-ripple';
        
        const rect = buttonElement.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;

        buttonElement.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
      }, { passive: true });
    },

    // 5️⃣ تشغيل الأزرار المضيئة
    applyGlow(element) {
      if (!element) return;
      element.classList.add('athr-glow-btn');
      if (CONFIG.glowEnabled) {
        element.classList.add('athr-glow-btn-active');
      }
    },

    // 6️⃣ إظهار الآيات بظهور نوري متكامل وناعم
    revealVerse(element) {
      if (!element) return;
      element.classList.remove('athr-verse-reveal-active');
      element.classList.add('athr-verse-reveal');
      // استخدام ريفلو لإعادة تشغيل الأنميشن
      void element.offsetWidth;
      element.classList.add('athr-verse-reveal-active');
    },

    // 7️⃣ الكتابة سطر بعد سطر
    typewriterVerse(container, lines = [], delayMs = 1200) {
      if (!container || lines.length === 0) return;
      container.innerHTML = '';
      
      lines.forEach((lineText, idx) => {
        const lineEl = document.createElement('span');
        lineEl.className = 'athr-typewriter-line';
        lineEl.textContent = lineText;
        container.appendChild(lineEl);

        setTimeout(() => {
          lineEl.classList.add('visible');
        }, idx * delayMs);
      });
    },

    // 8️⃣ عداد وقت الصلاة الدائري مع الألوان الديناميكية
    updatePrayerRing(svgElement, percentRemaining) {
      if (!svgElement) return;
      const progressCircle = svgElement.querySelector('.athr-ring-progress');
      if (!progressCircle) return;

      const radius = progressCircle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const clampVal = Math.max(0, Math.min(100, percentRemaining));
      const offset = circumference - (clampVal / 100) * circumference;

      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = offset;

      // تغيير الألوان بالتوافق مع النسبة
      progressCircle.classList.remove('warning', 'danger');
      if (clampVal < 15) {
        progressCircle.classList.add('danger');
      } else if (clampVal < 40) {
        progressCircle.classList.add('warning');
      }
    },

    // 9️⃣ تأثير تقليب الصفحات المصحفية الاحترافي
    turnPage(pageElement, onComplete) {
      if (!pageElement) return;
      if (prefersReducedMotion) {
        if (onComplete) onComplete();
        return;
      }
      pageElement.classList.add('athr-page-turn-active');
      pageElement.addEventListener('animationend', () => {
        pageElement.classList.remove('athr-page-turn-active');
        if (onComplete) onComplete();
      }, { once: true });
    },

    // 🔟 انتقال الصفحة بطريقة الـ Blur و Fade
    transitionPage(container) {
      if (!container) return;
      container.classList.remove('athr-page-transition');
      void container.offsetWidth;
      container.classList.add('athr-page-transition');
    },

    // 1️⃣1️⃣ الهالة الصوتية لزر التشغيل
    attachAudioHalo(buttonContainer) {
      if (!buttonContainer) return;
      buttonContainer.classList.add('athr-halo-container');
      
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'athr-halo-ring';
        buttonContainer.appendChild(ring);
      }
    },

    // 1️⃣2️⃣ اهتزاز ونبض التسبيح الذكي
    tasbihTap(counterElement, count) {
      if (!counterElement) return;

      // اهتزاز محرك الهاتف بدقة فائقة للهواتف المتوافقة
      if (navigator.vibrate) {
        if (count === 33 || count === 66 || count === 99) {
          navigator.vibrate([20, 50, 20]);
        } else {
          navigator.vibrate(10);
        }
      }

      counterElement.classList.remove('athr-tasbih-pulse', 'athr-tasbih-pulse-major');
      void counterElement.offsetWidth;

      if (count === 33 || count === 66 || count === 99) {
        counterElement.classList.add('athr-tasbih-pulse-major');
      } else {
        counterElement.classList.add('athr-tasbih-pulse');
      }
    },

    // 1️⃣3️⃣ لوحة إنهاء العبادات الراقية مع المؤثرات البصرية والكونفيتي
    showCompletionToast(message) {
      const existing = document.querySelector('.athr-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'athr-toast';
      toast.innerHTML = `<span>✨</span><span>${message}</span>`;
      document.body.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add('show'));

      // تلاشي التوست التلقائي
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 3500);

      this.spawnConfettiParticles();
    },

    spawnConfettiParticles() {
      if (prefersReducedMotion) return;
      const fragment = document.createDocumentFragment();
      const shapes = ['✨', '🌿', '🌙'];
      
      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'athr-confetti';
        p.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance - 40; // اتجاه للأعلى قليلاً
        
        p.style.setProperty('--x', `${x}px`);
        p.style.setProperty('--y', `${y}px`);
        p.style.left = '50%';
        p.style.bottom = '80px';
        p.style.animation = 'athrConfettiAnim 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        
        fragment.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
      document.body.appendChild(fragment);
    },

    // 1️⃣4️⃣ الإطار الإسلامي الزخرفي الفاخر للبطاقات
    applyIslamicFrame(container) {
      if (!container) return;
      container.classList.add('athr-frame');
      
      const tr = document.createElement('div');
      tr.className = 'athr-frame-corner-tr';
      const bl = document.createElement('div');
      bl.className = 'athr-frame-corner-bl';

      container.appendChild(tr);
      container.appendChild(bl);
    },

    // 1️⃣5️⃣ الـ Skeleton Loading الزخرفي ذو الهوية الإسلامية
    createSkeletonLoading(parentContainer) {
      if (!parentContainer) return;
      parentContainer.innerHTML = '';
      const sk = document.createElement('div');
      sk.className = 'athr-skeleton-container';
      sk.innerHTML = `
        <div class="athr-skeleton-crescent">🌙</div>
        <div class="athr-skeleton-bar" style="width: 80%;"></div>
        <div class="athr-skeleton-bar" style="width: 95%;"></div>
        <div class="athr-skeleton-bar" style="width: 60%;"></div>
      `;
      parentContainer.appendChild(sk);
    },

    // 1️⃣6️⃣ التحكم بالأصوات المحيطية
    playAmbientSound(track, volume) {
      AudioEngine.play(track, volume);
    },

    pauseAmbientSound(track) {
      AudioEngine.pause(track);
    },

    setAmbientSoundVolume(track, volume) {
      AudioEngine.setVolume(track, volume);
    },

    stopAllAmbientSounds() {
      AudioEngine.stopAll();
    },

    // 1️⃣7️⃣ الحصول على الرسائل اليومية المباركة
    getDailyGreeting() {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000);
      return DAILY_GREETINGS[dayOfYear % DAILY_GREETINGS.length];
    },

    // 1️⃣8️⃣ الأثر الذهبي المتبقي أثناء السحب والتحريك بالأصابع (Trail Effect)
    initTrailEffect() {
      const handleMove = (e) => {
        if (CONFIG.isBackground || !CONFIG.motionEnabled) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        this._spawnTrailDot(clientX, clientY);
      };

      window.addEventListener('mousemove', handleMove, { passive: true });
      window.addEventListener('touchmove', handleMove, { passive: true });
    },

    _spawnTrailDot(x, y) {
      let dot;
      if (trailPool.length > 0) {
        dot = trailPool.pop();
        dot.style.opacity = '0.8';
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
      } else {
        dot = document.createElement('div');
        dot.className = 'athr-trail-dot';
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      document.body.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.1)`;
        dot.style.opacity = '0';
      });

      setTimeout(() => {
        dot.remove();
        if (trailPool.length < 20) {
          trailPool.push(dot);
        }
      }, 400);
    },

    // 1️⃣9️⃣ تصميم ساعة حائط إسلامية دائرية الشكل وفخمة
    createIslamicClock(parent) {
      if (!parent) return;
      const clock = document.createElement('div');
      clock.className = 'athr-clock-container';
      clock.innerHTML = `
        <div class="athr-clock-hand athr-clock-hour" id="athr-h"></div>
        <div class="athr-clock-hand athr-clock-minute" id="athr-m"></div>
        <div class="athr-clock-hand athr-clock-second" id="athr-s"></div>
        <div class="athr-clock-center"></div>
      `;
      parent.appendChild(clock);

      const updateClock = () => {
        const d = new Date();
        const hr = d.getHours();
        const min = d.getMinutes();
        const sec = d.getSeconds();

        const hrAngle = (hr % 12) * 30 + min * 0.5;
        const minAngle = min * 6;
        const secAngle = sec * 6;

        const hEl = clock.querySelector('#athr-h');
        const mEl = clock.querySelector('#athr-m');
        const sEl = clock.querySelector('#athr-s');

        if (hEl) hEl.style.transform = `translateX(-50%) rotate(${hrAngle}deg)`;
        if (mEl) mEl.style.transform = `translateX(-50%) rotate(${minAngle}deg)`;
        if (sEl) sEl.style.transform = `translateX(-50%) rotate(${secAngle}deg)`;
      };

      setInterval(updateClock, 1000);
      updateClock();
    },

    // 2️⃣0️⃣ هلال العبادة والراحة النفسية (Moon Animation)
    createMoonAnimation(parent) {
      if (!parent) return;
      const moon = document.createElement('div');
      moon.className = 'athr-moon-container';
      moon.innerHTML = `<div class="athr-moon-body"></div>`;
      parent.appendChild(moon);
    },

    // 2️⃣1️⃣ تنفس مهدئ للبطاقات واللوحات (Breathing Cards)
    applyCardBreathing(element) {
      if (!element) return;
      element.classList.add('athr-card-breath');
    },

    // 2️⃣2️⃣ الزجاج الشفاف فائق النقاء والأناقة (Glass Effect)
    applyGlassEffect(element) {
      if (!element) return;
      element.classList.add('athr-glass');
    },

    // 2️⃣3️⃣ التعتيم الكلي الفاخر لخلفيات النوافذ المنبثقة والـ Dialogs
    showBlurOverlay() {
      let overlay = document.querySelector('.athr-blur-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'athr-blur-overlay';
        document.body.appendChild(overlay);
      }
      requestAnimationFrame(() => overlay.classList.add('show'));
    },

    hideBlurOverlay() {
      const overlay = document.querySelector('.athr-blur-overlay');
      if (overlay) {
        overlay.classList.remove('show');
      }
    },

    // 2️⃣4️⃣ مؤثرات النجاح الكبرى للعبادات اليومية والخدمات
    triggerSuccessCelebration(title = "تقبل الله طاعتكم", subtitle = "تمت العبادة والورد بنجاح") {
      let scr = document.querySelector('.athr-success-screen');
      if (!scr) {
        scr = document.createElement('div');
        scr.className = 'athr-success-screen';
        document.body.appendChild(scr);
      }

      scr.innerHTML = `
        <div class="athr-success-glow">✨</div>
        <h2 style="color: var(--athr-gold); font-family: 'Amiri', serif; margin: 15px 0 5px; font-size: 28px;">${title}</h2>
        <p style="color: #fff; font-size: 16px; opacity: 0.8; margin: 0;">${subtitle}</p>
      `;

      scr.classList.add('show');
      this.spawnConfettiParticles();
      this.spawnTwinklingStars(15);

      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      setTimeout(() => {
        scr.classList.remove('show');
      }, 4000);
    },

    // 2️⃣5️⃣ تتبع ديناميكيات الظلال مع حركة الماوس بدقة (Dynamic Shadows)
    enableDynamicShadows(element) {
      if (!element) return;
      window.addEventListener('mousemove', (e) => {
        if (CONFIG.isBackground) return;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        // حساب زاوية الظل بالنسبة للمؤشر
        const shadowX = -x * 0.08;
        const shadowY = -y * 0.08;
        const blur = Math.min(25, Math.max(10, Math.sqrt(x*x + y*y) * 0.05));

        element.style.boxShadow = `${shadowX}px ${shadowY}px ${blur}px rgba(0, 0, 0, 0.45)`;
      }, { passive: true });
    },

    // 2️⃣6️⃣ جزيئات أيقونية عائمة ببطء (Floating Icons)
    spawnFloatingIcons() {
      if (CONFIG.isBackground || prefersReducedMotion) return;
      const icons = ['🌿', '✨', '☾'];
      const count = CONFIG.quality === 'low' ? 3 : CONFIG.quality === 'medium' ? 6 : 10;
      
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const floatEl = document.createElement('div');
        floatEl.className = 'athr-particle';
        floatEl.textContent = icons[Math.floor(Math.random() * icons.length)];
        floatEl.style.cssText = `
          top: ${Math.random() * 80 + 10}vh;
          left: ${Math.random() * 90 + 5}vw;
          font-size: ${Math.random() * 14 + 12}px;
          opacity: 0.25;
          animation: athrTwinkleAnim ${Math.random() * 6 + 6}s ease-in-out infinite alternate;
        `;
        fragment.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 12000);
      }
      document.body.appendChild(fragment);
    }
  };

  // -----------------------------------------------------------------------
  // ⚡ إدارة وتحسين دورة حيوية التطبيق وأداء البطارية والذاكرة
  // -----------------------------------------------------------------------
  // مراقبة ذهاب الصفحة إلى الخلفية لخفض جودة الأداء وإيقاف الحركات فوراً
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      CONFIG.isBackground = true;
      AthrEffects.disableParticles();
      AudioEngine.stopAll();
    } else {
      CONFIG.isBackground = false;
      if (CONFIG.particlesEnabled) {
        AthrEffects.enableParticles();
      }
    }
  });

  // استخدام IntersectionObserver لتعليق عمل الأجسام غير الظاهرة على الشاشة
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          entry.target.style.animationPlayState = 'paused';
        } else {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    // تتبع العناصر المتحركة باستمرار تلقائياً
    AthrEffects.observeAnimation = function(element) {
      if (element) observer.observe(element);
    };
  }

  // -----------------------------------------------------------------------
  // 🚀 تهيئة ميزات المحرك تلقائياً وتصديره كواجهة برمجية كاملة
  // -----------------------------------------------------------------------
  window.AthrEffects = AthrEffects;

  document.addEventListener('DOMContentLoaded', () => {
    // تشغيل الخلفية التفاعلية الهادئة والجزئيات التجميلية
    AthrEffects.initAtmosphericEffects();
    AthrEffects.enableParticles();
    AthrEffects.initTrailEffect();

    const bg = document.body;
    if (bg) {
      bg.classList.add('athr-ambient-bg');
      if (CONFIG.motionEnabled) {
        bg.classList.add('athr-ambient-bg-animate');
      }
    }
  });

})();
