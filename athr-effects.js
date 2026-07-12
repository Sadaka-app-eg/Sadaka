// =========================================================================
// 🌟 محرك المؤثرات البصرية والجماليات الملكية لشبكة أثر - إصدار 2026
// =========================================================================

// 1️⃣ حقن ستايلات الأنميشنز ديناميكياً لتوفير مساحة ملفات الـ CSS
const athrStyles = document.createElement('style');
athrStyles.innerHTML = `
  /* أنميشن الهبوط الانسيابي */
  @keyframes athrFall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.4; }
    100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
  }
  
  /* أنميشن التلألؤ الخلفي الهادئ */
  @keyframes athrTwinkle {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 0.7; transform: scale(1.2); }
  }

  .athr-particle {
    position: fixed;
    pointer-events: none;
    z-index: 1; /* خلف القوائم والأزرار عشان ميتعبش العين */
    font-family: 'Amiri', serif;
    line-height: 1;
    user-select: none;
  }
`;
document.head.appendChild(athrStyles);

// 2️⃣ محرك توليد الجزيئات الساقطة بهدوء وبشكل متزن (Falling Particles)
window.initAthrFallingAmbiance = function() {
  // الأشكال المستخدمة: نقاط ذهبية، هلال، أوراق خير خضراء بنعومة
  const shapes = ['✨', '🌿', '🌙', '•']; 
  
  // دالة تصنيع الجزيء الواحد
  function createParticle() {
    // حماية لأداء الموبايل: لو عدد الجزيئات زاد في الشاشة متعملش جديد
    if (document.querySelectorAll('.athr-particle').length > 15) return;

    const particle = document.createElement('div');
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    particle.className = 'athr-particle';
    particle.innerHTML = randomShape;

    // تخصيص الألوان والأحجام العشوائية بناء على الشكل
    let size = Math.random() * 12 + 8; // حجم ناعم صغير
    let color = 'var(--gold)';
    
    if (randomShape === '🌿') {
      color = '#4CAF50'; // لون أخضر إسلامي هادئ للأوراق
      size = Math.random() * 10 + 6;
    } else if (randomShape === '•') {
      color = '#d4af37';
      size = Math.random() * 6 + 4; // نقاط غبار ذهبي صغيرة جداً
    }

    // إحداثيات الظهور العشوائي من عرض الشاشة العلوي
    const leftPos = Math.random() * 100;
    const duration = Math.random() * 8 + 8; // سرعة هبوط بطيئة جداً (من 8 لـ 16 ثانية) للحفاظ على الهدوء
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

    // تنظيف الميموري وحذف العنصر بعد انتهاء الأنميشن
    setTimeout(() => { particle.remove(); }, (duration + delay) * 1000);
  }

  // إطلاق جزيء جديد كل فترة زمنية متزنة عشان الشاشة متتزحمش
  setInterval(createParticle, 2500);
};

// 3️⃣ تشغيل الأجواء الجمالية تلقائياً بمجرد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // تشغيل حملة الغبار والزينة الذهبية الساقطة بهدوء
  window.initAthrFallingAmbiance();
});
