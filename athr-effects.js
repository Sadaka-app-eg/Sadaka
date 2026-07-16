// =========================================================================
// 🌟 محرك المؤثرات البصرية والجماليات الملكية الفاخرة لشبكة أثر - الإصدار الثالث الكامل (v3)
// =========================================================================
// تصميم وهندسة: خبير UX/UI ومهندس Front-End
// مكتبة متكاملة ومستقلة تماماً لإضفاء طابع إسلامي ملكي انسيابي ذو أداء فائق (60FPS)
// تم ربطها وهندستها لتتوافق مباشرة مع كلاسات ومعرفات الـ DOM الأصلي لتطبيقك.
// =========================================================================

(function () {
  'use strict';

  if (window.AthrEffects) return;

  // -----------------------------------------------------------------------
  // ⚙️ التفضيلات والتهيئات الافتراضية الداخلية
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

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    CONFIG.motionEnabled = false;
  }

  // -----------------------------------------------------------------------
  // 🎨 حقن الستايلات الشاملة (CSS Injection) المتوافقة مع ستايل تطبيقك
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

    /* 4️⃣ الخلفية التفاعلية المتدرجة الشاملة لـ body التطبيق */
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

    /* 6️⃣ توهج هادئ واحترافي للأزرار وقوائم التبويبات للتطبيق */
    .icon-btn, .tab, .cat-btn, .tasbeh-circle, .zekr-btn {
      position: relative;
      outline: none;
      transition: box-shadow 0.5s ease, border-color 0.5s ease, transform 0.2s ease !important;
    }
    .athr-glow-btn-active:hover,
    .icon-btn:hover, .cat-btn:hover {
      box-shadow: 0 0 16px rgba(var(--athr-gold-rgb), 0.55);
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
    .athr-halo-ring:nth-child(2) { animation-delay: 0.8s; }
    .athr-halo-ring:nth-child(3) { animation-delay: 1.6s; }
    @keyframes athrHaloPulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      100% { transform: scale(1.45); opacity: 0; }
    }

    /* 1️⃣3️⃣ الإطار الإسلامي الزخرفي الفاخر للبطاقات */
    .athr-frame {
      position: relative;
      border: 1px solid rgba(var(--athr-gold-rgb), 0.25);
      border-radius: 14px;
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
    .athr-frame-corner-tr, .athr-frame-corner-bl {
      position: absolute;
      width: 6px; height: 6px;
      background: var(--athr-gold);
      pointer-events: none;
    }
    .athr-frame-corner-tr { top: 3px; right: 3px; border-radius: 50%; }
    .athr-frame-corner-bl { bottom: 3px; left: 3px; border-radius: 50%; }

    /* 1️⃣4️⃣ الـ Skeleton Loading الإسلامي الهلالي */
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
      width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; color: rgba(var(--athr-gold-rgb), 0.45);
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

    /* 1️⃣5️⃣ لوحة تهنئة إتمام العمل والعبادة (Toast) والكونفيتي */
    .athr-toast {
      position: fixed;
      bottom: 40px; left: 50%;
      transform: translateX(-50%) translateY(30px);
      background: #121e14;
      color: var(--athr-gold);
      border: 1px solid rgba(var(--athr-gold-rgb), 0.35);
      padding: 14px 28px;
      border-radius: 30px;
      font-family: 'Amiri', serif;
      font-size: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      opacity: 0; z-index: 10000;
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
      pointer-events: none;
      display: flex; align-items: center; gap: 10px;
    }
    .athr-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    
    .athr-confetti {
      position: fixed; pointer-events: none; z-index: 10001;
      font-size: 18px; user-select: none; will-change: transform, opacity;
    }
    @keyframes athrConfettiAnim {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
      100% { transform: translate3d(var(--x), var(--y), 0) rotate(360deg); opacity: 0; }
    }

    /* 1️⃣6️⃣ الأثر المتبقي الذهبي أثناء السحب واللمس (Trail Effect) */
    .athr-trail-dot {
      position: absolute;
      width: 6px; height: 6px;
      background: var(--athr-gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      opacity: 0.8;
      box-shadow: 0 0 6px var(--athr-gold);
      will-change: transform, opacity;
      transition: transform 0.4s ease-out, opacity 0.4s ease-out;
    }

    /* 1️⃣7️⃣ ساعة الحائط الإسلامية الفاخرة */
    .athr-clock-container {
      width: 160px; height: 160px;
      border: 2px solid rgba(var(--athr-gold-rgb), 0.3);
      border-radius: 50%; position: relative;
      background: rgba(var(--athr-bg-rgb), 0.4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .athr-clock-hand {
      position: absolute; bottom: 50%; left: 50%;
      transform-origin: bottom center; background: var(--athr-gold);
      border-radius: 4px; transform: translateX(-50%) rotate(0deg);
      will-change: transform;
    }
    .athr-clock-hour { height: 40px; width: 3px; }
    .athr-clock-minute { height: 55px; width: 2px; background: #fff; }
    .athr-clock-second { height: 62px; width: 1px; background: var(--athr-green); }
    .athr-clock-center {
      position: absolute; width: 8px; height: 8px;
      background: var(--athr-gold); border-radius: 50%;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
    }

    /* 1️⃣8️⃣ الهلال المتحرك (Moon Animation) */
    .athr-moon-container { position: relative; width: 120px; height: 120px; }
    .athr-moon-body {
      width: 100px; height: 100px; border-radius: 50%;
      box-shadow: 15px 15px 0 0 var(--athr-gold);
      position: absolute; top: 10px; left: -5px; transform-origin: center;
      animation: athrMoonFloat 8s ease-in-out infinite alternate;
      will-change: transform;
    }
    @keyframes athrMoonFloat {
      0% { transform: translateY(0) rotate(-5deg); }
      100% { transform: translateY(-10px) rotate(5deg); }
    }

    /* 1️⃣9️⃣ الزجاج الخلفي للبطاقات (Glass Effect) */
    .athr-glass {
      background: rgba(var(--athr-bg-rgb), 0.55);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-top: 1px solid rgba(var(--athr-gold-rgb), 0.15);
    }

    /* 2️⃣٠️⃣ غطاء تعتيم وضباب خلفي للـ Dialogs */
    .athr-blur-overlay {
      position: fixed; inset: 0; background: rgba(var(--athr-bg-rgb), 0.6);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      z-index: 999; opacity: 0; transition: opacity 0.5s ease; pointer-events: none;
    }
    .athr-blur-overlay.show { opacity: 1; pointer-events: auto; }

    /* 2️⃣1️⃣ نجاح العبادة الفخم (Success Celebration Fullscreen) */
    .athr-success-screen {
      position: fixed; inset: 0;
      background: radial-gradient(circle, rgba(var(--athr-green-rgb), 0.25) 0%, rgba(var(--athr-bg-rgb), 0.95) 100%);
      z-index: 100000; display: flex; flex-direction: column; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none; transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .athr-success-screen.show { opacity: 1; pointer-events: auto; }
    .athr-success-glow {
      font-size: 80px; color: var(--athr-gold); text-shadow: 0 0 40px rgba(var(--athr-gold-rgb), 0.8);
      animation: athrSuccessPop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes athrSuccessPop {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .athr-particle, .athr-ray, .athr-fog-layer, .athr-fog-layer-2,
      .athr-ambient-bg-animate, .athr-halo-ring, .athr-moon-body {
        animation: none !important; transform: none !important;
      }
    }
  `;
  document.head.appendChild(styles);

  // -----------------------------------------------------------------------
  // 🎵 إدارة الأصوات المحيطية (Ambient Sounds Core)
  // -----------------------------------------------------------------------
  const AudioEngine = {
    sources: {
      rain: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
      audio.play().catch(err => console.log('بانتظار تفاعل لمس الشاشة لتشغيل الهندسة الصوتية المحيطية.', err));
    },

    pause(track) {
      if (this.instances[track]) this.instances[track].pause();
    },

    setVolume(track, volume) {
      if (this.instances[track]) this.instances[track].volume = Math.max(0, Math.min(1, volume));
    },

    stopAll() {
      Object.keys(this.instances).forEach(key => this.instances[key].pause());
    }
  };

  // -----------------------------------------------------------------------
  // 💫 مصفوفة محرك الأثر والجماليات الأساسية للربط والتكامل
  // -----------------------------------------------------------------------
  let activeFallingInterval = null;
  const trailPool = [];

  const AthrEffects = {
    enable() {
      CONFIG.particlesEnabled = true; CONFIG.soundsEnabled = true;
      CONFIG.motionEnabled = true; CONFIG.glowEnabled = true;
      this.enableParticles();
      const bg = document.body;
      if (bg && CONFIG.motionEnabled) bg.classList.add('athr-ambient-bg-animate');
    },

    disable() {
      CONFIG.particlesEnabled = false; CONFIG.soundsEnabled = false;
      CONFIG.motionEnabled = false; CONFIG.glowEnabled = false;
      this.disableParticles(); AudioEngine.stopAll();
      const bg = document.body;
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
        clearInterval(activeFallingInterval); activeFallingInterval = null;
      }
      document.querySelectorAll('.athr-particle').forEach(p => p.remove());
    },

    setQuality(level) {
      if (['low', 'medium', 'high'].includes(level)) {
        CONFIG.quality = level;
        if (CONFIG.particlesEnabled) { this.disableParticles(); this.enableParticles(); }
      }
    },

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
      if (shape === '🌿') { color = 'var(--athr-green)'; size = Math.random() * 8 + 8; }
      else if (shape === '•') { size = Math.random() * 4 + 4; }

      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 4;

      el.style.cssText = `
        left: ${left}vw; top: -30px; font-size: ${size}px; color: ${color};
        opacity: 0; animation: athrFallAnim ${duration}s linear ${delay}s infinite;
      `;
      document.body.appendChild(el);
      setTimeout(() => { el.remove(); }, (duration + delay) * 1000);
    },

    initAtmosphericEffects() {
      if (document.querySelector('.athr-light-rays-container')) return;
      const rays = document.createElement('div');
      rays.className = 'athr-light-rays-container';
      rays.innerHTML = '<div class="athr-ray"></div><div class="athr-ray"></div><div class="athr-ray"></div>';
      document.body.appendChild(rays);

      const fog = document.createElement('div');
      fog.className = 'athr-fog-container';
      fog.innerHTML = '<div class="athr-fog-layer"></div><div class="athr-fog-layer-2"></div>';
      document.body.appendChild(fog);
    },

    spawnTwinklingStars(count = 10) {
      if (CONFIG.isBackground || prefersReducedMotion) return;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'athr-particle';
        star.textContent = '✦';
        star.style.cssText = `
          top: ${Math.random() * 70}vh; left: ${Math.random() * 100}vw; color: var(--athr-gold);
          font-size: ${Math.random() * 6 + 4}px; animation: athrTwinkleAnim ${Math.random() * 3 + 2}s ease-in-out infinite;
        `;
        fragment.appendChild(star);
        setTimeout(() => star.remove(), 10000);
      }
      document.body.appendChild(fragment);
    },

    attachRipple(buttonElement) {
      if (!buttonElement) return;
      buttonElement.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        circle.className = 'athr-ripple';
        const rect = buttonElement.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - (diameter/2)}px`;
        circle.style.top = `${e.clientY - rect.top - (diameter/2)}px`;
        buttonElement.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
      }, { passive: true });
    },

    revealVerse(element) {
      if (!element) return;
      element.classList.remove('athr-verse-reveal-active');
      element.classList.add('athr-verse-reveal');
      void element.offsetWidth;
      element.classList.add('athr-verse-reveal-active');
    },

    typewriterVerse(container, lines = [], delayMs = 1200) {
      if (!container || lines.length === 0) return;
      container.innerHTML = '';
      lines.forEach((lineText, idx) => {
        const lineEl = document.createElement('span');
        lineEl.className = 'athr-typewriter-line';
        lineEl.textContent = lineText;
        container.appendChild(lineEl);
        setTimeout(() => { lineEl.classList.add('visible'); }, idx * delayMs);
      });
    },

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
      progressCircle.classList.remove('warning', 'danger');
      if (clampVal < 15) progressCircle.classList.add('danger');
      else if (clampVal < 40) progressCircle.classList.add('warning');
    },

    tasbihTap(counterElement, count) {
      if (!counterElement) return;
      if (navigator.vibrate) {
        if (count === 33 || count === 66 || count === 99) navigator.vibrate([20, 50, 20]);
        else navigator.vibrate(10);
      }
      counterElement.style.transform = (count % 33 === 0 && count > 0) ? 'scale(1.35)' : 'scale(1.15)';
      counterElement.style.textShadow = '0 0 12px #d4af37';
      setTimeout(() => {
        counterElement.style.transform = 'scale(1)'; counterElement.style.textShadow = 'none';
      }, 200);
      if (count === 33 || count === 66 || count === 99) {
        this.showCompletionToast("الحمد لله، تم إتمام ورد تسبيح مبارك 📿");
      }
    },

    showCompletionToast(message) {
      const existing = document.querySelector('.athr-toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = 'athr-toast';
      toast.innerHTML = `<span>✨</span><span>${message}</span>`;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
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
        p.className = 'athr-confetti'; p.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        const angle = Math.random() * Math.PI * 2; const distance = Math.random() * 120 + 60;
        const x = Math.cos(angle) * distance; const y = Math.sin(angle) * distance - 40;
        p.style.setProperty('--x', `${x}px`); p.style.setProperty('--y', `${y}px`);
        p.style.left = '50%'; p.style.bottom = '80px';
        p.style.animation = 'athrConfettiAnim 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        fragment.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
      document.body.appendChild(fragment);
    },

    applyIslamicFrame(container) {
      if (!container) return; container.classList.add('athr-frame');
      const tr = document.createElement('div'); tr.className = 'athr-frame-corner-tr';
      const bl = document.createElement('div'); bl.className = 'athr-frame-corner-bl';
      container.appendChild(tr); container.appendChild(bl);
    },

    playAmbientSound(track, volume) { AudioEngine.play(track, volume); },
    pauseAmbientSound(track) { AudioEngine.pause(track); },
    stopAllAmbientSounds() { AudioEngine.stopAll(); },

    initTrailEffect() {
      const handleMove = (e) => {
        if (CONFIG.isBackground || prefersReducedMotion) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this._spawnTrailDot(clientX, clientY);
      };
      window.addEventListener('mousemove', handleMove, { passive: true });
      window.addEventListener('touchmove', handleMove, { passive: true });
    },

    _spawnTrailDot(x, y) {
      let dot = trailPool.length > 0 ? trailPool.pop() : document.createElement('div');
      dot.className = 'athr-trail-dot'; dot.style.opacity = '0.8';
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.1)`; dot.style.opacity = '0';
      });
      setTimeout(() => { dot.remove(); if (trailPool.length < 20) trailPool.push(dot); }, 400);
    },

    createIslamicClock(parent) {
      if (!parent) return;
      const clock = document.createElement('div'); clock.className = 'athr-clock-container';
      clock.innerHTML = '<div class="athr-clock-hand athr-clock-hour" id="athr-h"></div><div class="athr-clock-hand athr-clock-minute" id="athr-m"></div><div class="athr-clock-hand athr-clock-second" id="athr-s"></div><div class="athr-clock-center"></div>';
      parent.appendChild(clock);
      const update = () => {
        const d = new Date(); const h = d.getHours(); const m = d.getMinutes(); const s = d.getSeconds();
        const hA = (h % 12) * 30 + m * 0.5; const mA = m * 6; const sA = s * 6;
        const hE = clock.querySelector('#athr-h'); const mE = clock.querySelector('#athr-m'); const sE = clock.querySelector('#athr-s');
        if (hE) hE.style.transform = `translateX(-50%) rotate(${hA}deg)`;
        if (mE) mE.style.transform = `translateX(-50%) rotate(${mA}deg)`;
        if (sE) sE.style.transform = `translateX(-50%) rotate(${sA}deg)`;
      };
      setInterval(update, 1000); update();
    },

    initHomeCardBreathing() {
      // ربط التنفس التلقائي بكارت الشاشة الرئيسية الأصلي لتطبيقك
      const heroCard = document.getElementById('homeHeroCard');
      if (heroCard && CONFIG.motionEnabled) {
        heroCard.style.transition = 'transform 7s ease-in-out';
        setInterval(() => {
          heroCard.style.transform = heroCard.style.transform === 'scale(1.02)' ? 'scale(1)' : 'scale(1.02)';
        }, 7000);
      }
    },

    enableDynamicShadows(element) {
      if (!element) return;
      window.addEventListener('mousemove', (e) => {
        if (CONFIG.isBackground) return;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        const sX = -x * 0.08; const sY = -y * 0.08;
        const blur = Math.min(25, Math.max(10, Math.sqrt(x*x + y*y) * 0.05));
        element.style.boxShadow = `${sX}px ${sY}px ${blur}px rgba(0, 0, 0, 0.45)`;
      }, { passive: true });
    }
  };

  // -----------------------------------------------------------------------
  // ⚡ إدارة وتحسين دورة حيوية التطبيق وأداء البطارية والذاكرة
  // -----------------------------------------------------------------------
  document.addEventListener('visibilitychange', () => {
    CONFIG.isBackground = document.hidden;
    if (document.hidden) { AthrEffects.disableParticles(); AudioEngine.stopAll(); }
    else if (CONFIG.particlesEnabled) AthrEffects.enableParticles();
  });

  window.AthrEffects = AthrEffects;

  document.addEventListener('DOMContentLoaded', () => {
    AthrEffects.initAtmosphericEffects();
    AthrEffects.enableParticles();
    AthrEffects.initTrailEffect();
    AthrEffects.initHomeCardBreathing();

    // صب كلاس التدرج اللوني على body التطبيق فوراً
    document.body.classList.add('athr-ambient-bg');
    if (CONFIG.motionEnabled) document.body.classList.add('athr-ambient-bg-animate');
  });

})();
