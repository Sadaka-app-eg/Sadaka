// =========================================================================
// 🌟 محرك المؤثرات البصرية والجماليات الملكية - الإصدار المطور لمنع عزل الأزرار
// =========================================================================
(function () {
  'use strict';

  if (window.AthrEffects) return;

  const CONFIG = {
    quality: 'high',
    particlesEnabled: true,
    motionEnabled: true,
    glowEnabled: true,
    maxParticles: { low: 5, medium: 12, high: 22 },
    isBackground: false
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) CONFIG.motionEnabled = false;

  // 📋 مصفوفة الأدعية المباشرة المخصصة
  const DUA_POOL = [
    "اللهم اغفر لعلي غانم وارحمه وعافه واعفُ عنه",
    "اللهم اغفر لشيماء سعيد وارحمها واجعل قبرها روضة من رياض الجنة",
    "اللهم اغفر لزينب مسعد وارحمها ونقّها من الخطايا كما ينقى الثوب الأبيض"
  ];

  // 🎨 حقن الستايلات المحسنة مع تأمين الـ pointer-events
  const styles = document.createElement('style');
  styles.id = 'athr-effects-v3-styles';
  styles.innerHTML = `
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
      0%, 100% { opacity: 0.05; transform: scale(0.7); }
      50% { opacity: 0.75; transform: scale(1.15); text-shadow: 0 0 8px #d4af37; }
    }

    .athr-trail-dot {
      position: absolute;
      width: 6px; height: 6px;
      background: #d4af37;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      opacity: 0.8;
      box-shadow: 0 0 6px #d4af37;
      will-change: transform, opacity;
      transition: transform 0.4s ease-out, opacity 0.4s ease-out;
    }

    .athr-toast {
      position: fixed;
      bottom: 40px; left: 50%;
      transform: translateX(-50%) translateY(30px);
      background: #121e14;
      color: #d4af37;
      border: 1px solid rgba(212,175,55,0.35);
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

    /* ===== كارت الدعاء المطور كلياً لمنع حجب العناصر تحت الحذف أو الإخفاء ===== */
    .athr-dua-reminder-card {
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: rgba(18, 30, 20, 0.92);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-right: 4px solid #d4af37;
      padding: 15px 20px;
      border-radius: 14px;
      color: #fff;
      font-family: 'Amiri', serif;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      transform: translateY(40px);
      opacity: 0;
      visibility: hidden; /* إخفاء كامل عن السيستم */
      pointer-events: none; /* إلغاء التفاعل تماماً وهو مختفي عشان تضغط براحتك تحته */
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, visibility 0.5s;
      max-width: 320px;
      direction: rtl;
      cursor: pointer; /* تلميح للمستخدم إنه قابل للضغط وقابل للإغلاق البصري */
    }
    
    /* عند التفعيل يرجع يتفاعل ويظهر بصرياً */
    .athr-dua-reminder-card.athr-show {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
      pointer-events: auto; /* السماح بالضغط عليه للإغلاق */
    }
  `;
  document.head.appendChild(styles);

  let activeFallingInterval = null;
  let activeStarInterval = null;
  let activeDuaInterval = null;
  let duaTimeoutTracker = null; // متتبع لمنع تداخل أوقات الـ setTimeout
  const trailPool = [];

  const AthrEffects = {
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

    startContinuousStars() {
      if (prefersReducedMotion) return;
      if (!activeStarInterval) {
        activeStarInterval = setInterval(() => {
          this.spawnTwinklingStars(Math.floor(Math.random() * 3) + 2);
        }, 4000);
      }
    },

    stopContinuousStars() {
      if (activeStarInterval) {
        clearInterval(activeStarInterval);
        activeStarInterval = null;
      }
    },

    // 🤲 تشغيل محرك كروت الدعاء العشوائي الذكي
    startContinuousDuaReminder() {
      if (!activeDuaInterval) {
        this._injectDuaCardUI();
        // ⏰ يشتغل دورياً كل ربع ساعة بالتمام والكمال (15 دقيقة = 900000 مللي ثانية)
        activeDuaInterval = setInterval(() => {
          this._cycleDuaReminder();
        }, 900000); 
        
        // أول ظهور تجريبي خفيف بعد فتح التطبيق بـ 5 ثوانٍ
        setTimeout(() => this._cycleDuaReminder(), 5000); 
      }
    },

    stopContinuousDuaReminder() {
      if (activeDuaInterval) {
        clearInterval(activeDuaInterval);
        activeDuaInterval = null;
      }
      if (duaTimeoutTracker) clearTimeout(duaTimeoutTracker);
      document.getElementById('athrDuaReminder')?.remove();
    },

    _injectDuaCardUI() {
      if (document.getElementById('athrDuaReminder')) return;
      const card = document.createElement('div');
      card.id = 'athrDuaReminder';
      card.className = 'athr-dua-reminder-card';
      
      // ⚡ عند الضغط المباشر على الكارت يختفي فوراً بدون انتظار انتهاء الـ 3 ثوانٍ
      card.onclick = () => {
        card.classList.remove('athr-show');
        if (duaTimeoutTracker) clearTimeout(duaTimeoutTracker);
      };

      document.body.appendChild(card);
    },

    _cycleDuaReminder() {
      if (CONFIG.isBackground) return;
      const card = document.getElementById('athrDuaReminder');
      if (!card) return;

      // إخفاء مبدئي لتنظيف الأبعاد
      card.classList.remove('athr-show');
      if (duaTimeoutTracker) clearTimeout(duaTimeoutTracker);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * DUA_POOL.length);
        const randomDuaText = DUA_POOL[randomIndex];
        
        card.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px; user-select:none;">
            <span style="font-size:24px;">🤲</span>
            <div style="flex:1;">
              <div style="font-size:11px; color:#d4af37; font-weight:bold; letter-spacing:0.5px;">دُعَاءٌ طَيِّبٌ لِأَهْلِ الأَثَرِ:</div>
              <div style="font-size:14.5px; line-height:1.6; margin-top:4px; font-weight:500; color:#fff;">"${randomDuaText}"</div>
            </div>
          </div>
        `;
        
        // إظهار الكارت وتفعيل الـ pointer-events تلقائياً
        card.classList.add('athr-show');

        // ⏱️ يختفي الكارت تلقائياً بالملي بعد 3 ثوانٍ (3000 مللي ثانية) من ظهوره
        duaTimeoutTracker = setTimeout(() => {
          card.classList.remove('athr-show');
        }, 3000);

      }, 400);
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
      let color = '#d4af37';
      if (shape === '🌿') { color = '#4CAF50'; size = Math.random() * 8 + 8; }
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

    spawnTwinklingStars(count = 10) {
      if (CONFIG.isBackground || prefersReducedMotion) return;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'athr-particle';
        star.textContent = '✦';
        star.style.cssText = `
          top: ${Math.random() * 85}vh; left: ${Math.random() * 100}vw; color: #d4af37;
          font-size: ${Math.random() * 5 + 4}px; animation: athrTwinkleAnim ${Math.random() * 2.5 + 2}s ease-in-out infinite;
        `;
        fragment.appendChild(star);
        setTimeout(() => star.remove(), 4500);
      }
      document.body.appendChild(fragment);
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

    initHomeCardBreathing() {
      const heroCard = document.getElementById('homeHeroCard');
      if (heroCard && CONFIG.motionEnabled) {
        heroCard.style.transition = 'transform 7s ease-in-out';
        heroCard.style.transform = 'scale(1)';
        setInterval(() => {
          heroCard.style.transform = heroCard.style.transform === 'scale(1.02)' ? 'scale(1)' : 'scale(1.02)';
        }, 7000);
      }
    }
  };

  document.addEventListener('visibilitychange', () => {
    CONFIG.isBackground = document.hidden;
    if (document.hidden) { 
      AthrEffects.disableParticles(); 
      AthrEffects.stopContinuousStars();
      AthrEffects.stopContinuousDuaReminder();
    } else {
      AthrEffects.enableParticles();
      AthrEffects.startContinuousStars();
      AthrEffects.startContinuousDuaReminder();
    }
  });

  window.AthrEffects = AthrEffects;

  document.addEventListener('DOMContentLoaded', () => {
    AthrEffects.enableParticles();
    AthrEffects.startContinuousStars();
    AthrEffects.startContinuousDuaReminder();
    AthrEffects.initTrailEffect();
    AthrEffects.initHomeCardBreathing();
  });

})();
