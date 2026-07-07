// =========================================================
// 🚀 ربط مجتمع أثر بسيرفر رفع ميديا مجاني 100% بدون فيزا
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// مفاتيح مشروعك الحقيقية والنشطة Sadaka-App
const firebaseConfig = {
  apiKey: "AIzaSyCuLaDRVQ9SWSO7zs2WL3D-ANj-wHeoYWg",
  authDomain: "sadaka-app-6637e.firebaseapp.com",
  projectId: "sadaka-app-6637e",
  storageBucket: "sadaka-app-6637e.firebasestorage.app",
  messagingSenderId: "425677494061",
  appId: "1:425677494061:web:0aacb04e72f767ad8925a4",
  measurementId: "G-WE16D4JC8F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔑 مفتاح الرفع المجاني المفتوح لتطبيقك (ImgBB API Key)
const IMGBB_API_KEY = "69ba2eb5653068e3a24c568ec75d1f87";

const WOMEN_SECRET_CODE = "Athr2026"; 
window.currentCommunityTab = 'feed'; 
let unsubscribePosts = null; 
let unsubscribeChats = null;

let currentSharePostText = "";
let currentSharePostAuthor = "";
let selectedMediaFile = null; 

// =========================================================
// 🛠️ 1️⃣ نظام التحقق وإعداد الحساب
// =========================================================
window.checkCommunityUser = function() {
  const contentArea = document.getElementById('communityContent');
  if (!contentArea) return;

  const googleUser = localStorage.getItem('user_display_name'); 
  
  if (!googleUser) {
    contentArea.innerHTML = `
      <div class="comm-card" style="text-align: center; padding: 40px 15px; font-family: 'Amiri', serif; direction: rtl;">
        <div style="font-size: 50px; margin-bottom: 15px;">🔒</div>
        <h3 style="color: var(--gold); margin-bottom: 12px; font-size: 22px;">عذراً، هذا القسم خاص بالمسجلين</h3>
        <p style="color: var(--text2); font-size: 14px; margin-bottom: 25px; line-height: 1.6;">
          لحماية خصوصية المجتمع ومنع الحسابات الوهمية، يشترط ربط حسابك بجوجل أولاً لتتمكن من نشر الفوائد والمشاركة في مجالس الذكر.
        </p>
        <button onclick="window.triggerHeaderGoogleLogin()" style="background: var(--gold); color: #111; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-family: 'Amiri', serif; font-size: 15px; cursor: pointer; box-shadow: 0 4px 15px rgba(212,175,55,0.2); transition: 0.2s;">
          🔑 ربط الحساب بجوجل الآن
        </button>
      </div>
    `;
    return;
  }

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');

  if (!userGender || !userName) {
    window.renderSetupScreen();
  } else {
    window.renderCommunityBody();
  }
};

window.renderSetupScreen = function() {
  const contentArea = document.getElementById('communityContent');
  contentArea.innerHTML = `
    <div class="comm-card" style="text-align: center; padding: 25px 15px; font-family: 'Amiri', serif; direction: rtl;">
      <h3 style="color: var(--gold); margin-bottom: 12px; font-size: 22px;">مرحباً بك في مجتمع أثر ✨</h3>
      <p style="color: var(--text2); font-size: 13px; margin-bottom: 20px;">يرجى تدوين الاسم وتحديد المجلس (يتم الفصل التام والكامل بين الرجال والنساء صوناً للخصوصية)</p>
      
      <div style="margin-bottom: 18px; text-align: right;">
        <label style="color: var(--text); display: block; margin-bottom: 6px; font-size: 14px;">الاسم (مستعار أو حقيقي):</label>
        <input id="commUserNameInp" type="text" placeholder="اكتب اسمك هنا..." style="width: 100%; padding: 12px; background: #000; border: 1px solid var(--border); color: var(--text); border-radius: 8px; outline: none; font-family: 'Amiri', serif;" />
      </div>

      <div style="margin-bottom: 20px; text-align: right;">
        <label style="color: var(--text); display: block; margin-bottom: 8px; font-size: 14px;">اختر المجلس الفقهي المناسب لحسابك:</label>
        <div style="display: flex; gap: 12px; margin-bottom: 15px;">
          <button onclick="window.selectGenderSetup('male')" id="btnSelectMale" style="flex: 1; background: rgba(255,255,255,0.02); color: var(--text); border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Amiri', serif; font-weight: bold; transition: 0.2s;">🧔 مجلس الرجال</button>
          <button onclick="window.selectGenderSetup('female')" id="btnSelectFemale" style="flex: 1; background: rgba(255,255,255,0.02); color: var(--text); border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Amiri', serif; font-weight: bold; transition: 0.2s;">🧕 مجلس النساء</button>
        </div>
      </div>

      <div id="femaleCodeContainer" style="display: none; margin-bottom: 25px; text-align: right;">
        <label style="color: var(--gold); display: block; margin-bottom: 6px; font-size: 14px;">⚠️ كود التفعيل للأخوات (مطلوب):</label>
        <input id="commFemaleCodeInp" type="password" placeholder="أدخلي كود الخصوصية السري..." style="width: 100%; padding: 12px; background: #000; border: 1px solid var(--gold); color: var(--text); border-radius: 8px; outline: none; text-align: center;" />
        <small style="display:block; color: var(--text2); margin-top: 8px; font-size: 12px; line-height: 1.6; text-align: center;">
          * هذا القسم مغلق لحماية خصوصية الأخوات. <br>
          للحصول على كود التفعيل، يرجى التواصل مع الأخت المشرفة عبر: <br>
          <a href="https://wa.me/201234567890?text=السلام%20عليكم%20ورحمة%20الله%20وبركاته،%20أريد%20الحصول%20على%20كود%20تفعيل%20مجلس%20النساء%20في%20تطبيق%20أثر" target="_blank" style="color: var(--gold); text-decoration: underline; font-weight: bold; display: inline-block; margin-top: 4px;">💬 رابط الواتساب المباشر للمشرفة اضغطي هنا</a>
        </small>
      </div>

      <button onclick="window.processCommunitySubmit()" style="width: 100%; background: var(--gold); color: #111; border: none; padding: 14px; border-radius: 8px; font-weight: bold; font-family: 'Amiri', serif; font-size: 16px; cursor: pointer; transition: 0.2s;">دخول مجتمع أثر 🚀</button>
    </div>
  `;
  window.selectedSetupGender = null;
};

window.selectGenderSetup = function(gender) {
  window.selectedSetupGender = gender;
  const maleBtn = document.getElementById('btnSelectMale');
  const femaleBtn = document.getElementById('btnSelectFemale');
  const codeBox = document.getElementById('femaleCodeContainer');

  if (gender === 'male') {
    maleBtn.style.borderColor = 'var(--gold)';
    maleBtn.style.background = 'rgba(212,175,55,0.08)';
    femaleBtn.style.borderColor = 'var(--border)';
    femaleBtn.style.background = 'transparent';
    codeBox.style.display = 'none';
  } else {
    femaleBtn.style.borderColor = 'var(--gold)';
    femaleBtn.style.background = 'rgba(212,175,55,0.08)';
    maleBtn.style.borderColor = 'var(--border)';
    maleBtn.style.background = 'transparent';
    codeBox.style.display = 'block';
  }
};

window.processCommunitySubmit = function() {
  const nameInp = document.getElementById('commUserNameInp');
  if (!nameInp || !nameInp.value.trim()) { alert('فضلاً، اكتب الاسم أولاً.'); return; }
  if (!window.selectedSetupGender) { alert('من فضلك حدد نوع المجلس أولاً.'); return; }

  if (window.selectedSetupGender === 'female') {
    const codeInp = document.getElementById('commFemaleCodeInp');
    if (!codeInp || codeInp.value.trim() !== WOMEN_SECRET_CODE) {
      alert('❌ كود التفعيل للأخوات غير صحيح.');
      return;
    }
  }

  localStorage.setItem('athr_user_name', nameInp.value.trim());
  localStorage.setItem('athr_user_gender', window.selectedSetupGender);
  window.renderCommunityBody();
};

// =========================================================
// 🎨 2️⃣ بناء واجهات المجتمع والربط الفوري والتفاعلي
// =========================================================
window.renderCommunityBody = function() {
  const contentArea = document.getElementById('communityContent');
  if (!contentArea) return;

  if (unsubscribePosts) unsubscribePosts();
  if (unsubscribeChats) unsubscribeChats();

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');

  const communityLabel = userGender === 'male' ? 'ساحة الرجال (ملتقى النبلاء)' : 'ساحة النساء (مجلس العفيفات)';
  const chatLabel = userGender === 'male' ? '💬 مجلس ذكر الرجال' : '💬 مجلس ذكر النساء';

  if (window.currentCommunityTab === 'feed') {
    contentArea.innerHTML = `
      <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 10px; font-size: 14px; text-align: right; font-weight: bold;">📍 ${communityLabel}</div>
      <div class="comm-card" style="display:flex; gap:10px; flex-direction:column;">
        <textarea id="postInput" placeholder="اكتب فائدة قرآنية أو تذكير بالخير يا ${userName}..." style="width:100%; height:80px; background:transparent; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:10px; resize:none; outline:none; font-family:'Amiri',serif;"></textarea>
        
        <div id="mediaPreviewArea" style="display:none; margin: 10px 0; position:relative; max-height:180px; overflow:hidden; border-radius:8px; border:1px solid var(--border);"></div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
          <label style="background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text); padding:8px 15px; border-radius:20px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px;">
            🖼️ إضافة صورة للفائدة
            <input type="file" id="postMediaInput" accept="image/*" style="display:none;" onchange="window.handleMediaSelection(this)" />
          </label>
          
          <button id="submitPostBtn" onclick="window.sendPostToFirebase()" style="background:var(--gold); color:#111; border:none; padding:8px 25px; border-radius:20px; font-weight:bold; cursor:pointer;">نشر الفائدة ✨</button>
        </div>
      </div>
      <div id="postsList" style="display: flex; flex-direction: column; gap: 10px;">
        <div class="comm-card"><p style="color:var(--text2); text-align:center;">جاري تحميل ساحة الخير... ✨</p></div>
      </div>

      <div class="overlay-dimmer" id="commShareDimmer" onclick="window.closeCommShareSheet()"></div>
      <div class="action-sheet" id="commShareSheet" style="z-index: 99999999;">
        <div class="action-title">👥 خيارات مشاركة فائدة الأثر</div>
        <div style="padding: 10px 0; display:flex; flex-direction:column; gap:8px;">
          <button class="action-btn" onclick="window.executeCommShare('text')"><span>📝</span> مشاركة كنص مبرمج جاهز</button>
          <button class="action-btn" onclick="window.executeCommShare('image')"><span>🖼️</span> تصميم ومشاركة كبطاقة فخمة</button>
          <button class="action-btn action-cancel" onclick="window.closeCommShareSheet()"><span>✕</span> إلغاء</button>
        </div>
      </div>
    `;
    window.listenToPosts(userGender);
  } else {
    contentArea.innerHTML = `
      <div style="display:flex; flex-direction:column; height: 100%; min-height: 400px; justify-content:space-between; gap:10px;">
        <div style="color: var(--gold); font-family: 'Amiri', serif; font-size: 14px; text-align: right; font-weight: bold;">📍 ${chatLabel}</div>
        <div id="chatMessages" style="flex:1; overflow-y:auto; padding:15px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; max-height: 320px;">
          <p style="color: var(--text2); text-align:center;">جاري الاتصال بمجلس الذكر... 🕊️</p>
        </div>
        <div style="display:flex; gap:8px;">
          <input id="chatMessageInp" type="text" placeholder="اكتب رسالتك الفورية..." style="flex:1; padding:12px; background:var(--card); border:1px solid var(--border); color:var(--text); border-radius:25px; outline:none;" onkeypress="if(event.key==='Enter') window.sendChatMessageToFirebase()"/>
          <button onclick="window.sendChatMessageToFirebase()" style="background:var(--gold); color:#111; border:none; width:45px; height:45px; border-radius:50%; font-size:18px; cursor:pointer;">🕊️</button>
        </div>
      </div>
    `;
    window.listenToChats(userGender);
  }
};

// =========================================================
// 📂 معالجة ومعاينة الميديا المفتوحة من جهاز المستخدم
// =========================================================
window.handleMediaSelection = function(input) {
  const file = input.files[0];
  if (!file) return;

  selectedMediaFile = file;
  const poolArea = document.getElementById('communityContent');
  const previewContainerId = 'mediaPreviewContainer';
  
  let previewBox = document.getElementById(sidebarMediaPreviewId);
  if(!previewBox) {
    previewBox = document.createElement('div');
    previewBox.id = 'mediaPreviewBox';
    previewBox.style.cssText = "margin-top:10px; position:relative; text-align:center;";
    const postInput = document.getElementById('postInput');
    postInput.parentNode.insertBefore(p, postInput.nextSibling);
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    previewBox.innerHTML = `
      <div style="position:relative; display:inline-block; max-width:100%;">
        <img src="${e.target.result}" style="max-height:150px; border-radius:8px; border:1px solid var(--gold);" />
        <button onclick="window.clearSelectedMedia()" style="position:absolute; top:-8px; left:-8px; background:#ff4d4d; color:white; border:none; width:24px; height:24px; border-radius:50%; font-weight:bold; cursor:pointer; font-size:12px;">✕</button>
      </div>`;
  };
  reader.readAsDataURL(file);
};

window.clearSelectedMedia = function() {
  selectedMediaFile = null;
  const previewBox = document.getElementById('mediaPreviewBox');
  if(previewBox) previewBox.remove();
};

// =========================================================
// 🔥 3️⃣ الرفع المجاني والنشر عبر السيرفر البديل بدون فيزا
// =========================================================
window.sendPostToFirebase = async function() {
  const textInput = document.getElementById('postInput');
  if (!textInput) return;
  const text = textInput.value.trim();

  if (!text && !selectedMediaFile) {
    alert("فضلاً، اكتب نصاً أو اختر صورة للنشر ✨");
    return;
  }

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');
  const submitBtn = document.getElementById('submitPostBtn');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري النشر... ⏳";

    let mediaUrl = "";
    let mediaType = "none";

    // إذا كان هناك ملف ميديا، يتم رفعه فوراً عبر سيرفر ميديا مجاني بديل
    if (selectedMediaFile) {
      const formData = new FormData();
      formData.append("image", selectedMediaFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
      });

      const resData = await response.json();
      if (resData.success) {
        mediaUrl = resData.data.url; // رابط الصورة المباشر والنهائي
        mediaType = "image";
      } else {
        throw new Error("سيرفر الميديا المجاني لم يستجب.");
      }
    }

    // كتابة وحفظ البوست بنجاح في الفايرستور النصي المجاني 100%
    await addDoc(collection(db, "posts"), {
      name: userName,
      text: text,
      gender: userGender,
      mediaUrl: mediaUrl,   
      mediaType: mediaType, 
      likes: [],
      createdAt: serverTimestamp()
    });

    textInput.value = "";
    window.clearSelectedMedia();
  } catch (e) {
    console.error("خطأ في النشر:", e);
    alert("عذراً، حدثت مشكلة في شبكة رفع الصور المجانية، جرب مجدداً ⚠️");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "نشر الفائدة ✨";
  }
};

window.listenToPosts = function(gender) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
  const myName = localStorage.getItem('athr_user_name');
  
  unsubscribePosts = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('postsList');
    if (!listArea) return;

    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      if (data.gender === gender) {
        const likesArr = data.likes || [];
        const hasLiked = likesArr.includes(myName);
        
        let mediaHtml = "";
        if (data.mediaUrl && data.mediaType === 'image') {
          mediaHtml = `<img src="${data.mediaUrl}" style="width:100%; border-radius:8px; margin-top:10px; max-height:300px; object-fit:contain; background:#000;" />`;
        }

        html += `
          <div class="comm-card" style="border-right: 3px solid var(--gold); text-align: right;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <strong style="color:var(--gold); font-size:14px;">✨ ${data.name}</strong>
              <small style="color:var(--text2); font-size:11px;">منذ قليل</small>
            </div>
            ${data.text ? `<p style="color:var(--text); font-family:'Amiri', serif; font-size:15px; line-height:1.5; white-space: pre-wrap;">${data.text}</p>` : ''}
            
            ${mediaHtml}
            
            <div class="post-actions">
              <button onclick="window.togglePostLike('${docId}', ${hasLiked})" class="action-item-btn ${hasLiked ? 'like-btn-heart' : ''}">
                ${hasLiked ? '❤️' : '🤍'} تفاعل (${likesArr.length})
              </button>
              <button onclick="window.openCommShareSheet(\`${data.text ? data.text.replace(/"/g, '&quot;') : 'أثر طيب'}\`, '${data.name}')" class="action-item-btn">
                🔗 مشاركة الأثر
              </button>
            </div>
          </div>
        `;
      }
    });
    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center;">الساحة فارغة، انشر أثرك الطيب الحين...</p></div>`;
  });
};

window.togglePostLike = async function(docId, hasLiked) {
  const myName = localStorage.getItem('athr_user_name');
  const postRef = doc(db, "posts", docId);
  try {
    if (hasLiked) {
      await updateDoc(postRef, { likes: arrayRemove(myName) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(myName) });
    }
  } catch (e) { console.error("فشل التفاعل:", e); }
};

window.openCommShareSheet = function(text, author) {
  currentSharePostText = text;
  currentSharePostAuthor = author;
  document.getElementById('commShareDimmer').classList.add('show');
  document.getElementById('commShareSheet').classList.add('show');
};

window.closeCommShareSheet = function() {
  document.getElementById('commShareDimmer').classList.remove('show');
  document.getElementById('commShareSheet').classList.remove('show');
};

window.executeCommShare = function(type) {
  window.closeCommShareSheet();
  const fullFormattedText = `✨ *من فوائد مجتمع أثر كُون ذا أثر*:\n\n"${currentSharePostText}"\n\n✍️ الناشر: الأثر الطيب لـ [${currentSharePostAuthor}]\n🕊️ صدقة جارية`;
  
  if (type === 'text') {
    if (navigator.share) {
      navigator.share({ title: 'فوائد أثر', text: fullFormattedText });
    } else {
      navigator.clipboard.writeText(fullFormattedText);
      alert('تم نسخ نص الفائدة المباركة بنجاح! ✓');
    }
  } else {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1350; 
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#060c07'); grad.addColorStop(1, '#0e1a10');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.textAlign = "center"; ctx.direction = "rtl";
    ctx.fillStyle = '#d4af37'; ctx.font = "bold 35px 'Amiri', serif";
    ctx.fillText("🌿 قَطُوفٌ مِنْ مَجْلَسِ أَثَرٍ الشَّرْعِيِّ 🌿", 540, 150);

    ctx.fillStyle = '#ffffff'; ctx.font = "40px 'Amiri', serif";
    
    const words = currentSharePostText.split(' ');
    let line = ''; let y = 350; const lineHeight = 75;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > 850 && n > 0) {
        ctx.fillText(line.trim(), 540, y);
        line = words[n] + ' '; y += lineHeight;
      } else { line = testLine; }
    }
    ctx.fillText(line.trim(), 540, y);

    ctx.fillStyle = 'rgba(212,175,55,0.8)'; ctx.font = "bold 30px 'Amiri', serif";
    ctx.fillText(`✍️ كاتب الأثر: ${currentSharePostAuthor}`, 540, canvas.height - 180);

    canvas.toBlob((blob) => {
      const imgFile = new File([blob], "Athr_Community_Post.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [imgFile] })) {
        navigator.share({ files: [imgFile], title: 'أثر طيب' });
      } else {
        const link = document.createElement('a'); link.download = 'Athr_Post.png';
        link.href = canvas.toDataURL(); link.click();
        alert("تم حفظ بطاقة التصميم الفخمة في معرض الصور بجهازك بنجاح! 🖼️🔥");
      }
    });
  }
};

// =========================================================
// شات المجموعات (المجلس الفوري الخفيف)
// =========================================================
window.sendChatMessageToFirebase = async function() {
  const input = document.getElementById('chatMessageInp');
  if (!input || !input.value.trim()) return;

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');

  try {
    await addDoc(collection(db, "chats"), {
      name: userName,
      text: input.value.trim(),
      gender: userGender,
      createdAt: serverTimestamp()
    });
    input.value = "";
  } catch (e) { console.error("خطأ إرسال الرسالة:", e); }
};

window.listenToChats = function(gender) {
  const q = query(collection(db, "chats"), orderBy("createdAt", "asc"), limit(60));
  unsubscribeChats = onSnapshot(q, (snapshot) => {
    const chatArea = document.getElementById('chatMessages');
    if (!chatArea) return;

    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.gender === gender) {
        const isMe = data.name === localStorage.getItem('athr_user_name');
        html += `
          <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}; padding: 8px 14px; border-radius: 12px; max-width: 85%; text-align: right; margin-bottom: 5px;">
            <span style="display:block; font-size:11px; color:var(--gold); font-weight:bold; margin-bottom:2px;">${data.name}</span>
            <span style="color:var(--text); font-size:14px;">${data.text}</span>
          </div>
        `;
      }
    });
    chatArea.innerHTML = html || `<p style="color: var(--text2); text-align:center;">المجلس هادئ.. ابدأ بذكر الله العظيم ✨</p>`;
    chatArea.scrollTop = chatArea.scrollHeight;
  });
};

window.switchCommunityTab = function(tab) {
  window.currentCommunityTab = tab;
  document.getElementById('tabFeedBtn').classList.toggle('active', tab === 'feed');
  document.getElementById('tabChatBtn').classList.toggle('active', tab === 'chat');
  window.checkCommunityUser();
};

setTimeout(() => { window.checkCommunityUser(); }, 200);
