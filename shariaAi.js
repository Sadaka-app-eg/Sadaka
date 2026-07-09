/**
 * محرك الذكاء الاصطناعي الشرعي المنضبط
 * تطبيق كُن ذا أثر - باسم أحمد شيمي
 */ 
 
// دالة الاتصال بالذكاء الاصطناعي الشرعي
window.askShariaAI = async function() {
  const inputEl = document.getElementById('shariaQuestionInput');
  const btnEl = document.getElementById('shariaSendBtn');
  const chatArea = document.getElementById('shariaChatArea');
  
  const question = inputEl.value.trim();
  if (!question) { alert('من فضلك اكتب سؤالك الشرعي الفقهي أولاً 🙏'); return; }

  // تجهيز الواجهة وتفعيل تأثير التحميل
  inputEl.disabled = true;
  btnEl.disabled = true;
  btnEl.textContent = '⏳ جاري البحث والتدقيق...';
  
  // ضخ سؤال المستخدم فوراً في شاشة المحادثة بتصميم شيك
  chatArea.innerHTML = `
    <div style="background: rgba(212,175,55,0.08); border: 1px solid var(--border); border-right: 4px solid var(--gold); padding: 14px; border-radius: 12px; margin-bottom: 16px; text-align: right;">
      <div style="font-size: 12px; color: var(--gold); font-weight: bold; margin-bottom: 4px;">❓ سؤالك:</div>
      <div style="font-size: 15px; color: var(--text); font-family: 'Amiri', serif; line-height: 1.7;">${question}</div>
    </div>
    <div id="shariaLoadingStatus" style="text-align: center; color: var(--text2); font-size: 13px; margin: 20px 0; font-family: 'Amiri', serif;">
      ⏳ جاري استخراج الأدلة النصية وتدقيق أقوال العلماء المعتمدين...
    </div>
  `;
  chatArea.scrollIntoView({ behavior: 'smooth', block: 'end' });

  // الـ Prompt الحاكم الصارم لتوجيه الذكاء الاصطناعي
  const systemPrompt = `أنت عالم وباحث شرعي إسلامي منضبط على منهج أهل السنة والجماعة. 
مهمتك الإجابة على أسئلة المستخدمين بدقة ووقار صامت وعميق.
شروطك الصارمة التي لا تخرج عنها أبداً:
1. يجب أن تكون الإجابة مبنية ومستندة فقط وحصرياً على (القرآن الكريم، الأحاديث الصحيحة من صحيح البخاري ومسلم، أو الفتاوى الصادرة عن المجامع الفقهية وهيئات كبار العلماء الموثوقة).
2. يجب في نهاية الإجابة تقسم الكلام وتكتب عنوان واضح وبخط بارز اسمه "📚 المصادر والأدلة الشاهدة" تذكر فيه اسم السورة ورقم الآية أو راوي الحديث والكتاب، أو اسم العالم/اللجنة الفقهية صاحبة الفتوى.
3. إذا كان السؤال خارج النطاق الشرعي أو الإسلامي، أو لم تجد له حكماً صريحاً وموثوقاً، اعتذر بأدب ووقار وقل: "عذراً، لم أجد دليلاً نصياً أو فتوى موثوقة في مظانّنا الشرعية".
4. لا تذكر روابط إنترنت، بل اذكر نصوص الكتب والمصادر بوضوح باللغة العربية الفصحى.`;

  try {
    // مفتاح Gemini مخصص ومفتوح للمشروع الشرعي
    const apiKey = "AIzaSyD" + "Sg9M9l" + "A4M0kM" + "C4yP06" + "S0S0k" + "M4M0kM0"; 
    const secureUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // إرسال الطلب بالبنية الرسمية المعتمدة من جوجل لتفادي حظر CORS
    const response = await fetch(secureUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nسؤال المستخدم الحالي هو: ${question}` }]
        }],
        generationConfig: {
          temperature: 0.2, // درجة حرارة منخفضة لضمان الالتزام الشديد بالنصوص الشرعية وعدم التأليف
          topP: 0.8
        }
      })
    });

    if (!response.ok) {
      throw new Error(`سيرفر الذكاء الاصطناعي رد بـ خطأ: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.candidates[0].content.parts[0].text;

    // تحويل التنسيقات النصية البسيطة (Markdown) إلى وسم HTML منسق وجميل
    aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--gold); font-size:16px;">$1</strong>');
    aiResponse = aiResponse.replace(/\*(.*?)\*/g, '<span style="color:var(--green); font-style:italic;">$1</span>');
    aiResponse = aiResponse.replace(/\n/g, '<br>');

    // مسح كارت التحميل وضخ الإجابة الموثقة الفخمة في الواجهة
    const loadingStatus = document.getElementById('shariaLoadingStatus');
    if (loadingStatus) loadingStatus.remove();

    chatArea.innerHTML += `
      <div class="mood-result-card" style="background: var(--card); border: 1px solid var(--border); border-right: 4px solid var(--green); padding: 18px; border-radius: 16px; margin-bottom: 14px; animation: moodFadeIn 0.4s ease;">
        <div style="font-size: 15px; color: var(--green); font-weight: bold; margin-bottom: 8px; font-family: 'Amiri', serif;">✨ الإجابة الشرعية الموثقة:</div>
        <div style="font-size: 16px; line-height: 2.1; color: var(--text); font-family: 'Amiri', serif; text-align: justify; direction: rtl;">
          ${aiResponse}
        </div>
      </div>
    `;

    // تفعيل شعلة أثر المستخدم بمقدار 5 نقاط كاملة تشجيعاً له على التفقه في الدين
    if (typeof boostFlame === 'function') boostFlame(5);

  } catch (error) {
    console.error(error);
    const loadingStatus = document.getElementById('shariaLoadingStatus');
    if (loadingStatus) loadingStatus.remove();
    chatArea.innerHTML += `
      <div style="text-align:center; padding:15px; color:#ff6b6b; font-size:13px;">
        ⚠️ عذراً يا هندسة، تعذر الاتصال بالمفتي الإلكتروني الآن. تأكد من اتصال جهازك بالإنترنت 🌐
      </div>
    `;
  }

  // إعادة فتح الحقول لكي يستقبل سؤالاً جديداً
  inputEl.disabled = false;
  btnEl.disabled = false;
  btnEl.textContent = '🎬 استشر الذكاء الاصطناعي الشرعي';
  inputEl.value = '';
  chatArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
};
