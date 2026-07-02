function changeRadio(radioType, element) {
  const iframe = document.getElementById('radioIframe');
  const statusMsg = document.getElementById('radioStatusMsg');
  if (!iframe) return;

  // 1. إعادة تهيئة شكل كل الأزرار
  const buttons = document.querySelectorAll('.radio-btn');
  buttons.forEach(btn => {
    btn.style.background = '#222';
    btn.style.color = '#fff';
    btn.style.border = '1px solid var(--border)';
  });

  // 2. تلوين الزرار الحالي
  element.style.background = 'var(--gold)';
  element.style.color = '#111';
  element.style.border = 'none';

  // تنظيف الرسائل السابقة وإيقاف أي صوت خارجي
  if (statusMsg) statusMsg.innerHTML = "";

  // 3. التوزيع البرمجي الصحيح والمضمون 100%
  if (radioType === 'cairo') {
    // القاهرة بث صوتي مباشر: هنخفي الـ iframe ونعرض مشغل صوت شيك ونظيف جوه الصندوق
    iframe.style.display = "none";
    iframe.src = ""; 
    
    if (statusMsg) {
      statusMsg.innerHTML = `
        <div style="text-align:center; padding:40px 10px;">
          <p style="color:var(--gold); font-size:16px; margin-bottom:15px;">📻 جاري تشغيل بث إذاعة القاهرة المباشر...</p>
          <audio src="https://stream.radiojar.com/8s5u5tpdtwzuv" controls autoplay style="width:100%; max-width:280px; accent-color:var(--gold);"></audio>
        </div>
      `;
    }
  } else if (radioType === 'makkah') {
    iframe.style.display = "block";
    iframe.src = "https://surahquran.com/Radio-Quran-Saudi.html";
  } else if (radioType === 'riyadh') {
    iframe.style.display = "block";
    iframe.src = "https://makkahlive.org/radio/quran-saudi";
  } else if (radioType === 'heweny') {
    iframe.style.display = "none";
    iframe.src = "";
    window.open("https://zeno.fm/radio/radio-abo-ashak-alheweny/", "_blank");
    if (statusMsg) {
      statusMsg.innerHTML = `<p style="color: var(--text2); font-size: 14px;">جاري تشغيل إذاعة الشيخ الحويني في نافذة خارجية... 📻</p>`;
    }
  }
}
