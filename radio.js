// دالة التحكم في تبديل الإذاعات وتحديث الإطار (iframe)
function changeRadio(radioType, element) {
  const iframe = document.getElementById('radioIframe');
  if (!iframe) return;

  // 1. إعادة تهيئة شكل كل الأزرار عشان الزرار النشط بس ينور بالدهبي
  const buttons = document.querySelectorAll('.radio-btn');
  buttons.forEach(btn => {
    btn.style.background = '#222';
    btn.style.color = '#fff';
    btn.style.border = '1px solid var(--border)';
  });

  // 2. تلوين الزرار اللي ضغطت عليه حالياً
  element.style.background = 'var(--gold)';
  element.style.color = '#111';
  element.style.border = 'none';

  // 3. تغيير رابط الإطار بناءً على اختيارك والروابط الشغالة المضمونة
  if (radioType === 'cairo') {
    iframe.src = "https://stream.radiojar.com/8s5u5tpdtwzuv";
  } else if (radioType === 'makkah') {
    iframe.src = "https://surahquran.com/Radio-Quran-Saudi.html";
  } else if (radioType === 'riyadh') {
    iframe.src = "https://makkahlive.org/radio/quran-saudi";
  } else if (radioType === 'heweny') {
    iframe.src = "https://zeno.fm/radio/radio-abo-ashak-alheweny/";
  }
}
