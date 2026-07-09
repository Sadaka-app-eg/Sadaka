/**
 * محرك الذكاء الاصطناعي الشرعي المنضبط - نسخة معدّلة وآمنة 100%
 * تطبيق كُن ذا أثر - باسم أحمد شيمي
 */

// رابط الـ Worker (البروكسي السيرفري الآمن) الخاص بك على Cloudflare
const SHARIA_AI_PROXY_URL = "https://sharia-ai-proxy.ahmedmohamedhosny100.workers.dev";

/**
 * دالة تنظيف وتأمين مدخلات المستخدم قبل رسمها (منع ثغرات الخرق الأمنية XSS)
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * الدالة الرئيسية للاتصال بالذكاء الاصطناعي الشرعي وضخ الأجوبة
 */
/**
 * محرك الذكاء الاصطناعي الشرعي المنضبط - نسخة التنقيح واكتشاف الأخطاء
 * تطبيق كُن ذا أثر - باسم أحمد شيمي
 */

const SHARIA_AI_PROXY_URL = "https://sharia-ai-proxy.ahmedmohamedhosny100.workers.dev";

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.askShariaAI = async function() {
  const inputEl = document.getElementById('shariaQuestionInput');
  const btnEl = document.getElementById('shariaSendBtn');
  const chatArea = document.getElementById('shariaChatArea');

  const question = inputEl.value.trim();
  if (!question) { alert('من فضلك اكتب سؤالك الشرعي الفقهي أولاً 🙏'); return; }

  const safeQuestion = escapeHtml(question);

  inputEl.disabled = true;
  btnEl.disabled = true;
  btnEl.textContent = '⏳ جاري البحث والتدقيق...';

  chatArea.innerHTML = `
    <div style="background: rgba(212,175,55,0.08); border: 1px solid var(--border); border-right: 4px solid var(--gold); padding: 14px; border-radius: 12px; margin-bottom: 16px; text-align: right;">
      <div style="font-size: 12px; color: var(--gold); font-weight: bold; margin-bottom: 4px;">❓ سؤالك:</div>
      <div style="font-size: 15px; color: var(--text); font-family: 'Amiri', serif; line-height: 1.7;">${safeQuestion}</div>
    </div>
    <div id="shariaLoadingStatus" style="text-align: center; color: var(--text2); font-size: 13px; margin: 20px 0; font-family: 'Amiri', serif;">
      ⏳ جاري استخراج الأدلة النصية وتدقيق أقوال العلماء المعتمدين...
    </div>
  `;
  chatArea.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const systemPrompt = `أنت عالم وباحث شرعي إسلامي منضبط على منهج أهل السنة والجماعة.
مهمتك الإجابة على أسئلة المستخدمين بدقة ووقار صامت وعميق.
شروطك الصارمة التي لا تخرج عنها أبداً:
1. يجب أن تكون الإجابة مبنية ومستندة فقط وحصرياً على (القرآن الكريم، الأحاديث الصحيحة من صحيح البخاري ومسلم، أو الفتاوى الصادرة عن المجامع الفقهية وهيئات كبار العلماء الموثوقة).
2. يجب في نهاية الإجابة تقسم الكلام وتكتب عنوان واضح وبخط بارز اسمه "📚 المصادر والأدلة الشاهدة" تذكر فيه اسم السورة ورقم الآية أو راوي الحديث والكتاب، أو اسم العالم/اللجنة الفقهية صاحبة الفتوى.
3. إذا كان السؤال خارج النطاق الشرعي أو الإسلامي، أو لم تجد له حكماً صريحاً وموثوقاً، اعتذر بأدب ووقار وقل: "عذراً، لم أجد دليلاً نصياً أو فتوى موثوقة في مظانّنا الشرعية".
4. لا تذكر روابط إنترنت، بل اذكر نصوص الكتب والمصادر بوضوح باللغة العربية الفصحى.`;

  try {
    console.log("🚀 جاري إرسال الطلب إلى الرابط:", SHARIA_AI_PROXY_URL);
    
    const response = await fetch(SHARIA_AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, question })
    });

    console.log("📥 استجابة السيرفر الواردة، الحالة (Status):", response.status);

    // إذا السيرفر رجع خطأ، نحاول نقرأ النص الداخلي للخطأ عشان نفهم السبب
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`كود السيرفر: ${response.status} | تفاصيل: ${errorText}`);
    }

    const data = await response.json();
    console.log("📦 البيانات المستلمة بالكامل من الـ Worker:", data);

    // فحص للتأكد من بنية الـ Response وهل تحتوي على خطأ من جيمني نفسه
    if (data.error) {
      throw new Error(`خطأ من جيمني: ${data.error.message || JSON.stringify(data.error)}`);
    }

    let aiResponse = data.candidates[0].content.parts[0].text;
    aiResponse = escapeHtml(aiResponse);

    aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--gold); font-size:16px;">$1</strong>');
    aiResponse = aiResponse.replace(/\*(.*?)\*/g, '<span style="color:var(--green); font-style:italic;">$1</span>');
    aiResponse = aiResponse.replace(/\n/g, '<br>');

    const loadingStatus = document.getElementById('shariaLoadingStatus');
    if (loadingStatus) loadingStatus.remove();

    chatArea.innerHTML += `
      <div class="mood-result-card" style="background: var(--card); border: 1px solid var(--border); border-right: 4px solid var(--green); padding: 18px; border-radius: 16px; margin-bottom: 6px; animation: moodFadeIn 0.4s ease;">
        <div style="font-size: 15px; color: var(--green); font-weight: bold; margin-bottom: 8px; font-family: 'Amiri', serif;">✨ الإجابة الشرعية الموثقة:</div>
        <div style="font-size: 16px; line-height: 2.1; color: var(--text); font-family: 'Amiri', serif; text-align: justify; direction: rtl;">
          ${aiResponse}
        </div>
      </div>
    `;

    if (typeof boostFlame === 'function') boostFlame(5);

  } catch (error) {
    // طباعة الخطأ بالتفصيل الممل في الـ Console الخاص بالمتصفح
    console.error("❌ حدث خطأ مفصل أثناء تشغيل المحرك الشرعي:", error);

    const loadingStatus = document.getElementById('shariaLoadingStatus');
    if (loadingStatus) loadingStatus.remove();
    
    // حقن الخطأ الحقيقي مباشرة على شاشة التطبيق عشان نشوفه في الموبايل أو المتصفح علطول
    chatArea.innerHTML += `
      <div style="text-align:right; padding:15px; color:#ff6b6b; font-size:13px; font-family: 'monospace', sans-serif; background: rgba(255,0,0,0.05); border: 1px dashed #ff6b6b; border-radius: 12px;">
        <strong>⚠️ تفاصيل الخطأ البرمجي الحقيقي:</strong><br>
        <span style="direction: ltr; display: block; margin-top: 5px;">${error.message}</span>
      </div>
    `;
  }

  inputEl.disabled = false;
  btnEl.disabled = false;
  btnEl.textContent = '🎬 استشر الذكاء الاصطناعي الشرعي';
  inputEl.value = '';
  chatArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
};
