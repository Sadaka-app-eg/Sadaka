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
window.askShariaAI = async function() {
  const inputEl = document.getElementById('shariaQuestionInput');
  const btnEl = document.getElementById('shariaSendBtn');
  const chatArea = document.getElementById('shariaChatArea');

  const question = inputEl.value.trim();
  if (!question) { alert('من فضلك اكتب سؤالك الشرعي الفقهي أولاً 🙏'); return; }

  // تنظيف سؤال المستخدم للأمان
  const safeQuestion = escapeHtml(question);

  // تجهيز الواجهة وتفعيل تأثير التحميل وحظر الضغط المتكرر
  inputEl.disabled = true;
  btnEl.disabled = true;
  btnEl.textContent = '⏳ جاري البحث والتدقيق...';

  // ضخ سؤال المستخدم فوراً في شاشة المحادثة بتصميم شيك ومؤمن
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

  // الـ Prompt الحاكم الصارم الذي يجبر السيرفر على لزوم النص والدليل وعزل الشذوذ
  const systemPrompt = `أنت عالم وباحث شرعي إسلامي منضبط على منهج أهل السنة والجماعة.
مهمتك الإجابة على أسئلة المستخدمين بدقة ووقار صامت وعميق.
شروطك الصارمة التي لا تخرج عنها أبداً:
1. يجب أن تكون الإجابة مبنية ومستندة فقط وحصرياً على (القرآن الكريم، الأحاديث الصحيحة من صحيح البخاري ومسلم، أو الفتاوى الصادرة عن المجامع الفقهية وهيئات كبار العلماء الموثوقة).
2. يجب في نهاية الإجابة تقسم الكلام وتكتب عنوان واضح وبخط بارز اسمه "📚 المصادر والأدلة الشاهدة" تذكر فيه اسم السورة ورقم الآية أو راوي الحديث والكتاب، أو اسم العالم/اللجنة الفقهية صاحبة الفتوى.
3. إذا كان السؤال خارج النطاق الشرعي أو الإسلامي، أو لم تجد له حكماً صريحاً وموثوقاً، اعتذر بأدب ووقار وقل: "عذراً، لم أجد دليلاً نصياً أو فتوى موثوقة في مظانّنا الشرعية".
4. لا تذكر روابط إنترنت، بل اذكر نصوص الكتب والمصادر بوضوح باللغة العربية الفصحى.`;

  try {
    // نداء الـ Cloudflare Worker المأمن (الذي يخبئ المفتاح داخله في السيرفر)
    const response = await fetch(SHARIA_AI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemPrompt: systemPrompt,
        question: question
      })
    });

    if (!response.ok) {
      throw new Error(`سيرفر البروكسي رد بـ خطأ: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.candidates[0].content.parts[0].text;

    // تنظيف نص الاستجابة مبدئياً لحمايتها بالكامل
    aiResponse = escapeHtml(aiResponse);

    // تحويل تنسيقات الـ Markdown البسيطة إلى وسوم مظهر فخمة ومنسقة متوافقة مع هويتك البصرية
    aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--gold); font-size:16px;">$1</strong>');
    aiResponse = aiResponse.replace(/\*(.*?)\*/g, '<span style="color:var(--green); font-style:italic;">$1</span>');
    aiResponse = aiResponse.replace(/\n/g, '<br>');

    // مسح كارت التحميل المؤقت وضخ الإجابة النهائية الموثقة والآمنة
    const loadingStatus = document.getElementById('shariaLoadingStatus');
    if (loadingStatus) loadingStatus.remove();

    chatArea.innerHTML += `
      <div class="mood-result-card" style="background: var(--card); border: 1px solid var(--border); border-right: 4px solid var(--green); padding: 18px; border-radius: 16px; margin-bottom: 6px; animation: moodFadeIn 0.4s ease;">
        <div style="font-size: 15px; color: var(--green); font-weight: bold; margin-bottom: 8px; font-family: 'Amiri', serif;">✨ الإجابة الشرعية الموثقة:</div>
        <div style="font-size: 16px; line-height: 2.1; color: var(--text); font-family: 'Amiri', serif; text-align: justify; direction: rtl;">
          ${aiResponse}
        </div>
      </div>
      <div style="text-align:center; font-size:11px; color:var(--text2); margin-bottom:14px; font-family:'Amiri', serif; opacity: 0.85;">
        ⚠️ هذه الإجابة مولّدة استرشادياً، ويُنصح دوماً بمراجعة الهيئات الرسمية أو دار الإفتاء في النوازل الفردية الحساسة.
      </div>
    `;

    // تفعيل شعلة أثر المستخدم بمقدار 5 نقاط لتشجيعه وتحفيزه على الفقه والتعلم
    if (typeof boostFlame === 'function') boostFlame(5);

  } catch (error) {
    console.error(error);
    const loadingStatus = document.getElementById('shariaLoadingStatus');
    if (loadingStatus) loadingStatus.remove();
    chatArea.innerHTML += `
      <div style="text-align:center; padding:15px; color:#ff6b6b; font-size:13px; font-family: 'Amiri', serif;">
        ⚠️ عذراً يا هندسة، فشل الاتصال بالبوابة الشرعية المؤمنة الآن. تأكد من سلامة اتصالك السحابي 🌐
      </div>
    `;
  }

  // فك تجميد الحقول وإفراغ مربع الكتابة لاستقبال مسألة فقهية جديدة
  inputEl.disabled = false;
  btnEl.disabled = false;
  btnEl.textContent = '🎬 استشر الذكاء الاصطناعي الشرعي';
  inputEl.value = '';
  chatArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
};
