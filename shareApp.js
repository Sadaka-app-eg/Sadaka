// =========================================================================
// 💝 نظام المساهمة ونشر وتطوير التطبيق - كُن ذا أثر 2026
// =========================================================================

// دالة بناء واجهة تبويب الدعم والمشاركة ديناميكياً
window.initShareAppPage = function() {
  const container = document.getElementById('shareAppPageContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px; direction: rtl; text-align: right; font-family: 'Amiri', serif;">
      
      <div style="background: var(--card); border-radius: 20px; padding: 24px; border: 1px solid var(--border); border-right: 4px solid var(--gold); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="font-size: 35px; margin-bottom: 10px; text-align: center;">🚀</div>
        <h3 style="color: var(--gold); font-size: 18px; font-weight: bold; margin-bottom: 10px; text-align: center;">ساهم في نشر التطبيق (الدال على الخير كفاعله)</h3>
        <p style="color: var(--text2); font-size: 14px; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
          تخيل كم من الأجور ستنالها حين يستيقظ أحدهم لصلاة الفجر، أو يذكر الله، أو يقرأ آية من كتاب الله بسبب مشاركتك؟ انشر التطبيق في مجموعات الواتساب، التليجرام، أو مع عائلتك وأصدقائك واجعل لك أثراً ممتداً لا ينقطع.
        </p>
        
        <button onclick="window.executeGlobalAppShare()" style="width: 100%; background: var(--gold); color: #111; border: none; padding: 14px; border-radius: 12px; font-weight: bold; font-family: 'Amiri', serif; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(212,175,55,0.2); transition: 0.2s;">
          📢 انقر هنا لمشاركة التطبيق الآن
        </button>
      </div>

      <div style="background: var(--card); border-radius: 20px; padding: 24px; border: 1px solid var(--border); border-right: 4px solid var(--green); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="font-size: 35px; margin-bottom: 10px; text-align: center;">💝</div>
        <h3 style="color: var(--green); font-size: 18px; font-weight: bold; margin-bottom: 10px; text-align: center;">دعم وتطوير سـيرفرات الأثـر الطيب</h3>
        <p style="color: var(--text2); font-size: 14px; line-height: 1.8; margin-bottom: 15px; text-align: justify;">
          الاستمرار في تطوير الميزات الإيمانية، والحفاظ على السيرفرات حية ومستقرة، ورفع جودة الصوتيات والمصحف الشريف يحتاج إلى دعمكم المادي. مساهمتك -مهما كانت بسيطة- تُشكل فارقاً كبيراً في استمرار هذا المشروع الدعوي وتحديثه دورياً وتوفيره للجميع بلا إعلانات مزعجة.
        </p>

        <div style="background: rgba(0,0,0,0.2); border: 1px dashed var(--green); padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 5px;">
          <span style="font-size: 13px; color: var(--text2); display: block; margin-bottom: 4px;">يمكنك التبرع والمساهمة عبر فودافون كاش:</span>
          <strong style="font-size: 20px; color: var(--green); font-family: monospace; letter-spacing: 1px; display: block; margin: 5px 0;">01069168725</strong>
          <span style="font-size: 11px; color: var(--gold);">جعلها الله صدقة جارية مقبولة في صحيفتك 🌿</span>
        </div>
      </div>

      <div style="background: var(--card); border-radius: 20px; padding: 24px; border: 1px solid var(--border); border-right: 4px solid #25D366; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <div style="font-size: 35px; margin-bottom: 10px; text-align: center;">💬</div>
        <h3 style="color: #25D366; font-size: 18px; font-weight: bold; margin-bottom: 10px; text-align: center;">تحدث إلينا</h3>
        <p style="color: var(--text2); font-size: 14px; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
          عندك اقتراح، ميزة حابب تشوفها، أو واجهتك مشكلة في التطبيق؟ نسعد بتواصلك معنا مباشرة على الواتساب في أي وقت.
        </p>

        <button onclick="window.openWhatsAppContact()" style="width: 100%; background: #25D366; color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: bold; font-family: 'Amiri', serif; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,211,102,0.25); transition: 0.2s;">
          💬 تواصل معنا عبر الواتساب
        </button>
      </div>

    </div>
  `;
};

// محرك المشاركة الرسمي الذكي
window.executeGlobalAppShare = function() {
  // اللينك المعتمد المأخوذ من مسار المشروع الفعلي عندك على GitHub Pages
  const appLink = "https://athar-two-pearl.vercel.app/";
  const shareText = `💎 *تطبيق كُن ذا أثر الإيماني المتكامل* 💎\n\nبرنامجك اليومي الشامل للاستقامة وطاعة الرحمن (مصحف المدينة، أذكار حية، مجالس ذكر تكافلية، ودفتر نعم وشعلة الأثر الحية) بدون إعلانات تماماً!\n\n👇 *رابط فتح وتثبيت التطبيق مباشرة:* \n${appLink}\n\n🌿 _انشره الآن واجعل لك أثراً طيباً وصدقة جارية لا تنقطع_ 🌿`;

  if (navigator.share) {
    navigator.share({
      title: 'تطبيق كُن ذا أثر',
      text: shareText
    }).catch(err => console.log("تم إلغاء المشاركة"));
  } else {
    navigator.clipboard.writeText(shareText);
    alert('📋 تم نسخ رابط التطبيق ورسالة النشر بنجاح! يمكنك الآن لصقها ومشاركتها في أي مكان بروقان. ✓');
  }
};
// دالة فتح واتساب للتواصل المباشر
window.openWhatsAppContact = function() {
  const phoneNumber = "201101579399"; // كود مصر + الرقم بدون الصفر
  const message = `السلام عليكم ورحمة الله وبركاته 🌿\n\nتحية طيبة، أنا حد من مستخدمي تطبيق "كُن ذا أثر"، وحابب أتواصل معاكم بخصوص:\n\n`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};
