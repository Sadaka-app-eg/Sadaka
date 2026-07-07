// =========================================================
// 🚀 ربط واستدعاء مكتبات الفايربيز (Firebase SDK) تلقائياً
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 🔥 تم حقن مفاتيح مشروعك Sadaka-App بنجاح هنا
const firebaseConfig = {
  apiKey: "AIzaSyCuLaDRVQ9SWSO7zs2WL3D-ANj-wHeoYWg",
  authDomain: "sadaka-app-6637e.firebaseapp.com",
  projectId: "sadaka-app-6637e",
  storageBucket: "sadaka-app-6637e.firebasestorage.app",
  messagingSenderId: "425677494061",
  appId: "1:425677494061:web:0aacb04e72f767ad8925a4",
  measurementId: "G-WE16D4JC8F"
};

// تشغيل الفايربيز وقاعدة البيانات Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// كود التفعيل السري المعتمد للأخوات
const WOMEN_SECRET_CODE = "Athr2026"; 

window.currentCommunityTab = 'feed'; // التبويب الافتراضي: الساحة
let unsubscribePosts = null; 
let unsubscribeChats = null;

// =========================================================
// 🛠️ 1️⃣ نظام التحقق وإعداد الحساب
// =========================================================
window.checkCommunityUser = function() {
  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');
  
  const contentArea = document.getElementById('communityContent');
  if (!contentArea) return;

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

            <!-- حقل كود التفعيل السري للأخوات -->
      <div id="femaleCodeContainer" style="display: none; margin-bottom: 25px; text-align: right;">
        <label style="color: var(--gold); display: block; margin-bottom: 6px; font-size: 14px;">⚠️ كود التفعيل للأخوات (مطلوب):</label>
        <input id="commFemaleCodeInp" type="password" placeholder="أدخلي كود الخصوصية السري..." style="width: 100%; padding: 12px; background: #000; border: 1px solid var(--gold); color: var(--text); border-radius: 8px; outline: none; text-align: center;" />
        
        <!-- الرابط السحري للتواصل مع المشرفة -->
        <small style="display:block; color: var(--text2); margin-top: 8px; font-size: 12px; line-height: 1.6; text-align: center;">
          * هذا القسم مغلق لحماية خصوصية الأخوات. <br>
          للحصول على كود التفعيل، يرجى التواصل مع الأخت المشرفة عبر: <br>
          <a href="https://wa.me/201234567890?text=السلام%20عليكم%20ورحمة%20الله%20وبركاته،%20أريد%20الحصول%20على%20كود%20تفعيل%20مجلس%20النساء%20في%20تطبيق%20أثر" 
             target="_blank" 
             style="color: var(--gold); text-decoration: underline; font-weight: bold; display: inline-block; margin-top: 4px;">
             💬 رابط الواتساب المباشر للمشرفة اضغطي هنا
          </a>
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
// 🎨 2️⃣ بناء واجهات المجتمع والربط الفوري (Real-time)
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
        <button onclick="window.sendPostToFirebase()" style="background:var(--gold); color:#111; border:none; padding:8px 20px; border-radius:8px; font-weight:bold; align-self:flex-start; cursor:pointer;">نشر الفائدة ✨</button>
      </div>
      <div id="postsList" style="display: flex; flex-direction: column; gap: 10px;">
        <div class="comm-card"><p style="color:var(--text2); text-align:center;">جاري تحميل ساحة الخير... ✨</p></div>
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
          <input id="chatInput" type="text" placeholder="اكتب رسالتك الفورية..." style="flex:1; padding:12px; background:var(--card); border:1px solid var(--border); color:var(--text); border-radius:25px; outline:none;" onkeypress="if(event.key==='Enter') window.sendChatMessageToFirebase()"/>
          <button onclick="window.sendChatMessageToFirebase()" style="background:var(--gold); color:#111; border:none; width:45px; height:45px; border-radius:50%; font-size:18px; cursor:pointer;">🕊️</button>
        </div>
      </div>
    `;
    window.listenToChats(userGender);
  }
};

// =========================================================
// 🔥 3️⃣ منطق التعامل مع قاعدة البيانات (Firestore Operations)
// =========================================================
window.sendPostToFirebase = async function() {
  const input = document.getElementById('postInput');
  if (!input || !input.value.trim()) return;

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');

  try {
    await addDoc(collection(db, "posts"), {
      name: userName,
      text: input.value.trim(),
      gender: userGender,
      createdAt: serverTimestamp()
    });
    input.value = "";
  } catch (e) { console.error("خطأ في النشر:", e); }
};

window.listenToPosts = function(gender) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
  
  unsubscribePosts = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('postsList');
    if (!listArea) return;

    let html = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.gender === gender) {
        html += `
          <div class="comm-card" style="border-right: 3px solid var(--gold); text-align: right;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <strong style="color:var(--gold); font-size:14px;">✨ ${data.name}</strong>
              <small style="color:var(--text2); font-size:11px;">الآن</small>
            </div>
            <p style="color:var(--text); font-family:'Amiri', serif; font-size:15px; line-height:1.5; white-space: pre-wrap;">${data.text}</p>
          </div>
        `;
      }
    });
    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center;">الساحة فارغة، انشر أثرك الطيب الحين...</p></div>`;
  });
};

window.sendChatMessageToFirebase = async function() {
  const input = document.getElementById('chatInput');
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
  } catch (e) { console.error("خطأ في الإرسال:", e); }
};

window.listenToChats = function(gender) {
  const q = query(collection(db, "chats"), orderBy("createdAt", "asc"), limit(100));
  
  unsubscribeChats = onSnapshot(q, (snapshot) => {
    const chatArea = document.getElementById('chatMessages');
    if (!chatArea) return;

    let html = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.gender === gender) {
        const isMe = data.name === localStorage.getItem('athr_user_name');
        html += `
          <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'rgba(212,175,55,0.1)' : 'var(--card)'}; border: 1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}; padding: 8px 14px; border-radius: 12px; max-width: 80%; text-align: right;">
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
