  // =========================================================================
// 🚀 شبكة مجتمع أثر الاجتماعية الإسلامية المتكاملة - إصدار 2026 المطور (نسخة مصححة الميديا)
// =========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDoc, setDoc, arrayUnion, arrayRemove, onSnapshot, query, where, orderBy, limit, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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

const IMGBB_API_KEY = "3b0e9c0cb3ddf5475324fa1a126a4e3e";
const WOMEN_SECRET_CODE = "Athr2026"; 

window.currentCommunityTab = 'feed'; 
window.activePrivateRoomId = null; 
let unsubscribePosts = null; 
let unsubscribeChats = null;
let unsubscribePrivates = null;

let currentSharePostText = "";
let currentSharePostAuthor = "";
let selectedMediaFile = null; 
let selectedProfileFile = null;
let selectedChatPrivateFile = null;

let pressTimer;
window.isLongPress = false;

// حقن الاستايلات والأنميشنز والمؤثرات البصرية الملكية ديناميكياً
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .online-dot { width: 7px; height: 7px; background: #4CAF50; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; margin-left: 6px; vertical-align: middle; }
  .gold-glow-text { color: #d4af37 !important; font-weight: bold !important; text-shadow: 0 0 8px rgba(212,175,55,0.6); }
  .blue-glow-text { color: #40a9ff !important; font-weight: bold !important; text-shadow: 0 0 8px rgba(64,169,255,0.4); }
  .regular-user-text { color: #ffffff !important; }
  .profile-badge { font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-right: 5px; font-family: 'Amiri', serif; }
  .badge-male { background: rgba(64,169,255,0.15); color: #40a9ff; border: 1px solid rgba(64,169,255,0.3); }
  .badge-female { background: rgba(212,175,55,0.15); color: var(--gold); border: 1px solid rgba(212,175,55,0.3); }
`;
document.head.appendChild(style);
(function(){
  const myAccBtn = document.createElement('button');
  myAccBtn.id = 'athrMyAccountFloatBtn';
  myAccBtn.innerHTML = "👤 حسابي";
  myAccBtn.onclick = () => window.openMyAccountModal();
  myAccBtn.style.cssText = "position:fixed; top:14px; right:15px; z-index:999999; background:rgba(212,175,55,0.12); color:#d4af37; border:1px solid #d4af37; padding:8px 16px; border-radius:20px; font-family:'Amiri',serif; font-weight:bold; font-size:13px; cursor:pointer; backdrop-filter:blur(4px); display:none;";
  document.body.appendChild(myAccBtn);

  function isElementVisible(el){
    if(!el) return false;
    if(el.offsetParent === null) return false; 
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function updateAccBtnVisibility(){
    const communityEl = document.getElementById('communityContent');
    myAccBtn.style.display = isElementVisible(communityEl) ? 'block' : 'none';
  }
  updateAccBtnVisibility();
  setInterval(updateAccBtnVisibility, 500);
})();
 
// =========================================================
// 🛠️ 1️⃣ نظام التحقق وإدارة الحسابات الذكي
// =========================================================
window.checkCommunityUser = async function() {
  const contentArea = document.getElementById('communityContent');
  if (!contentArea) return;

  const CURRENT_VERSION = "v2_profile_update"; 
  const userVersion = localStorage.getItem('athr_app_version');

  if (userVersion !== CURRENT_VERSION) {
    localStorage.removeItem('athr_user_name');
    localStorage.removeItem('athr_user_gender');
    localStorage.setItem('athr_app_version', CURRENT_VERSION);
    setTimeout(() => { window.checkCommunityUser(); }, 100);
    return;
  }

  if (window.currentCommunityTab !== 'feed') {
    const googleUser = localStorage.getItem('user_display_name');
    if (!googleUser) {
      window.renderAuthRequiredBlock();
      return;
    }
  }

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');

  if (localStorage.getItem('user_display_name') && (!userGender || !userName)) {
    window.renderSetupScreen();
  } else {
    window.renderCommunityBody();
  }
};

window.renderAuthRequiredBlock = function() {
  const contentArea = document.getElementById('communityContent');
  contentArea.innerHTML = `
    <div class="comm-card" style="text-align: center; padding: 40px 15px; font-family: 'Amiri', serif; direction: rtl;">
      <div style="font-size: 50px; margin-bottom: 15px;">🔒</div>
      <h3 style="color: var(--gold); margin-bottom: 12px; font-size: 22px;">عذراً، هذا القسم خاص بالمسجلين</h3>
      <p style="color: var(--text2); font-size: 14px; margin-bottom: 25px; line-height: 1.6;">
        لحماية خصوصية مجالس الذكر الشرعية والمشاركة الفعالة ومنع الحسابات الوهمية، يشترط تسجيل دخولك عبر جوجل أولاً.
      </p>
      <button onclick="window.triggerHeaderGoogleLogin()" style="background: var(--gold); color: #111; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; font-family: 'Amiri', serif; font-size: 15px; cursor: pointer; box-shadow: 0 4px 15px rgba(212,175,55,0.2); transition: 0.2s;">
        🔑 ربط الحساب بجوجل الآن
      </button>
    </div>
  `;
};

window.renderSetupScreen = function() {
  const contentArea = document.getElementById('communityContent');
  contentArea.innerHTML = `
    <div class="comm-card" style="text-align: center; padding: 25px 15px; font-family: 'Amiri', serif; direction: rtl; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(212,175,55,0.2);">
      <h3 style="color: var(--gold); margin-bottom: 12px; font-size: 22px;">إعداد ملفك الشخصي في أثر ✨</h3>
      <p style="color: var(--text2); font-size: 13px; margin-bottom: 20px;">يرجى تدوين البيانات المطلوبة بدقة صوناً للخصوصية والأمان</p>
      
      <div style="margin-bottom: 15px; text-align: right;">
        <label style="color: var(--text); display: block; margin-bottom: 6px; font-size: 14px;">الاسم الثنائي (اسمك واسم أبيك إجباري):</label>
        <input id="commUserNameInp" type="text" placeholder="مثال: باسم أحمد..." style="width: 100%; padding: 12px; background: #000; border: 1px solid var(--border); color: var(--text); border-radius: 8px; outline: none; font-family: 'Amiri', serif;" />
      </div>

      <div style="margin-bottom: 15px; text-align: right;">
        <label style="color: var(--text); display: block; margin-bottom: 6px; font-size: 14px;">نبذة تعريفية عنك (Bio):</label>
        <textarea id="commUserBioInp" placeholder="اكتب نبذة قصيرة أو دعاء تحبه..." style="width: 100%; height: 60px; padding: 10px; background: #000; border: 1px solid var(--border); color: var(--text); border-radius: 8px; outline: none; font-family: 'Amiri', serif; resize: none;"></textarea>
      </div>

      <div style="margin-bottom: 18px; text-align: right;">
        <label style="color: var(--text); display: block; margin-bottom: 6px; font-size: 14px;">الصورة الشخصية (البروفايل):</label>
        <div style="display:flex; align-items:center; gap:10px;">
          <label style="background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text); padding:8px 15px; border-radius:8px; font-size:13px; cursor:pointer;">
            📸 اختر صورة البروفايل
            <input type="file" id="profilePicInput" accept="image/*" style="display:none;" onchange="window.handleProfilePicSelection(this)" />
          </label>
          <span id="profilePicStatus" style="color:var(--text2); font-size:12px;">لم يتم اختيار صورة</span>
        </div>
      </div>

      <div style="margin-bottom: 20px; text-align: right;">
        <label style="color: var(--text); display: block; margin-bottom: 8px; font-size: 14px;">اختر المجلس الفقهي المناسب لحسابك:</label>
        <div style="display: flex; gap: 12px; margin-bottom: 15px;">
          <button onclick="window.selectGenderSetup('male')" id="btnSelectMale" style="flex: 1; background: rgba(255,255,255,0.02); color: var(--text); border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Amiri', serif; font-weight: bold; transition: 0.2s;">🧔 مجلس الرجال</button>
          <button onclick="window.selectGenderSetup('female')" id="btnSelectFemale" style="flex: 1; background: rgba(255,255,255,0.02); color: var(--text); border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; font-family: 'Amiri', serif; font-weight: bold; transition: 0.2s;">🧕 مجلس النساء</button>
        </div>
      </div>

   //  الكود المطور والمضمون للاستبدال
<div id="femaleCodeContainer" style="display: none; margin-bottom: 25px; text-align: right;">
    <label style="color: var(--gold); display: block; margin-bottom: 6px; font-size: 14px;">⚠️ كود تفعيل مجلس الأخوات الموحد:</label>
    <div style="margin-bottom: 15px; text-align: right;">
      <button type="button" onclick="window.open('https://wa.me/201123181731?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D9%85%D8%B3%D8%A1%D9%88%D9%84%D8%A9%20%D8%A7%D9%84%D8%AA%D9%88%D8%AB%D9%8A%D9%82%D8%8C%20%D8%A3%D8%B1%D8%AC%D9%88%20%D8%A5%D8%B1%D8%B3%D8%A7%D9%84%20%D9%83%D9%88%D8%AF%20%D8%AA%D9%81%D8%B9%D9%8A%D9%84%20%D9%85%DAC%D9%84%D8%B3%20%D8%A7%D9%84%D8%B9%D9%81%D9%8A%D9%81%D8%A7%D8%AA%20%D9%81%D9%8A%20%D8%A3%D8%AB%D8%B1', '_blank')" style="display: block; width: 100%; background: #25D366; color: #fff; border: none; padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; font-family: 'Amiri', serif; box-shadow: 0 4px 12px rgba(37,211,102,0.3); transition: 0.2s; text-align: center;">
        💬 اضغطي هنا لمراسلة المشرفة وتلقي كود التفعيل فوراً
      </button>
    </div>
    <input id="commFemaleCodeInp" type="password" placeholder="أدخلي كود الخصوصية السري..." style="width: 100%; padding: 12px; background: #000; border: 1px solid var(--gold); color: var(--text); border-radius: 8px; outline: none; text-align: center;" />
</div>

      <button id="submitSetupBtn" onclick="window.processCommunitySubmit()" style="width: 100%; background: var(--gold); color: #111; border: none; padding: 14px; border-radius: 8px; font-weight: bold; font-family: 'Amiri', serif; font-size: 16px; cursor: pointer; transition: 0.2s;">حفظ الملف ودخول المجتمع 🚀</button>
    </div>
  `;
  window.selectedSetupGender = null;
  selectedProfileFile = null;
};

window.handleProfilePicSelection = function(input) {
  if(input.files[0]) {
    selectedProfileFile = input.files[0];
    document.getElementById('profilePicStatus').textContent = "✓ تم اختيار الصورة جاهزة للرفع";
    document.getElementById('profilePicStatus').style.color = "var(--gold)";
  }
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

window.processCommunitySubmit = async function() {
  const nameInp = document.getElementById('commUserNameInp');
  const bioInp = document.getElementById('commUserBioInp');
  const submitBtn = document.getElementById('submitSetupBtn');

  if (!nameInp || !nameInp.value.trim()) { alert('فضلاً، اكتب اسمك أولاً.'); return; }
  
  const trimmedName = nameInp.value.trim();
  if (!trimmedName.includes(" ") || trimmedName.split(" ").filter(Boolean).length < 2) {
    alert("⚠️ عذراً يا أخي، يرجى كتابة اسمك ثنائياً (اسمك واسم الأب) بشكل صحيح وموثق.");
    return;
  }

  if (!window.selectedSetupGender) { alert('من فضلك حدد نوع المجلس أولاً.'); return; }

  if (window.selectedSetupGender === 'female') {
    const codeInp = document.getElementById('commFemaleCodeInp');
    if (!codeInp || codeInp.value.trim() !== WOMEN_SECRET_CODE) {
      alert('❌ كود التفعيل للأخوات غير صحيح.');
      return;
    }
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري إنشاء وتوثيق الحساب... ⏳";
    
    // تصحيح الرابط الافتراضي بإزالة المسافة الفارغة الكارثية
    let avatarUrl = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/temporary-avatar.png"; 
    if (selectedProfileFile) {
      const formData = new FormData();
      formData.append("image", selectedProfileFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const resData = await res.json();
      if(resData.success) avatarUrl = resData.data.url;
    }

    const myEmail = localStorage.getItem('user_email') || trimmedName;
    
    await setDoc(doc(db, "users_profiles", trimmedName), {
      name: trimmedName,
      email: myEmail,
      bio: bioInp.value.trim() || "ذاكر لله ومحب للأثر الطيب",
      avatar: avatarUrl, // الرفع والربط يعملان الآن بشكل سليم تماماً
      gender: window.selectedSetupGender,
      points: 10, 
      createdAt: serverTimestamp()
    });

    localStorage.setItem('athr_user_name', trimmedName);
    localStorage.setItem('athr_user_gender', window.selectedSetupGender);
    
    window.triggerSparksEffect();
    window.renderCommunityBody();
  } catch(e) {
    console.error(e);
    alert("حدث مشكلة أثناء إنشاء الحساب، يرجى إعادة المحاولة.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "حفظ الملف ودخول المجتمع 🚀";
  }
};

// =========================================================
// 🎨 2️⃣ بناء واجهات المجتمع والربط الفوري والتفاعلي
// =========================================================
window.renderCommunityBody = function() {
  const contentArea = document.getElementById('communityContent');
  if (!contentArea) return;

  if (unsubscribePosts) unsubscribePosts();
  if (unsubscribeChats) unsubscribeChats();

  const userGender = localStorage.getItem('athr_user_gender') || 'male';
  const userName = localStorage.getItem('athr_user_name') || 'زائر الطيب';

  const communityLabel = userGender === 'male' ? 'ساحة الرجال (ملتقى النبلاء)' : 'ساحة النساء (مجلس العفيفات)';
  const chatLabel = userGender === 'male' ? '💬 مجلس ذكر الرجال' : '💬 مجلس ذكر النساء';

  if (window.currentCommunityTab === 'feed') {
    contentArea.innerHTML = `
      <div class="community-tabs" style="margin-bottom: 15px; display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
        <button id="tabFeedBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
        <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
        <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
        <button id="tabFamilyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('family')">🏡 التنافس العائلي</button>
        <button id="tabWeeklyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('weekly')">🌟 حلقة الأسبوع</button>
        <button id="tabLeaderBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('leaderboard')">🏆 لوحة الشرف</button>
        <button id="tabDuaBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('dua')">🤲 اطلب دعاء</button>
        <button id="tabFeaturedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('featured')">✨ الأكثر تأثيراً</button>
        <button id="tabPrivateBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('private')">📥 الرسائل الخاصة</button>
      </div>

      <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 10px; font-size: 14px; text-align: right; font-weight: bold;">📍 ${communityLabel}</div>
      
      ${localStorage.getItem('athr_user_name') ? `
      <div class="comm-card" style="display:flex; gap:10px; flex-direction:column;">
        <textarea id="postInput" placeholder="اكتب فائدة قرآنية أو تذكير بالخير يا ${userName}..." style="width:100%; height:80px; background:transparent; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:10px; resize:none; outline:none; font-family:'Amiri',serif;"></textarea>
        <div id="mediaPreviewBox" style="margin-top:10px; position:relative; text-align:center;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
          <label style="background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text); padding:8px 15px; border-radius:20px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px;">
            🖼️ إضافة صورة للفائدة
            <input type="file" id="postMediaInput" accept="image/*" style="display:none;" onchange="window.handleMediaSelection(this)" />
          </label>
          <button id="submitPostBtn" onclick="window.sendPostToFirebase()" style="background:var(--gold); color:#111; border:none; padding:8px 25px; border-radius:20px; font-weight:bold; cursor:pointer;">نشر الفائدة ✨</button>
        </div>
      </div>` : `<p style="color:var(--text2); font-size:12px; text-align:center; margin-bottom:15px;">🔒 سجل حسابك لتتمكن من مشاركة الفوائد الشرعية معنا.</p>`}

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

  } else if (window.currentCommunityTab === 'chat') {
    contentArea.innerHTML = `
      <div class="community-tabs" style="margin-bottom: 15px; display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
        <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
        <button id="tabChatBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
        <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
        <button id="tabFamilyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('family')">🏡 التنافس العائلي</button>
        <button id="tabWeeklyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('weekly')">🌟 حلقة الأسبوع</button>
        <button id="tabLeaderBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('leaderboard')">🏆 لوحة الشرف</button>
        <button id="tabDuaBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('dua')">🤲 اطلب دعاء</button>
        <button id="tabFeaturedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('featured')">✨ الأكثر تأثيراً</button>
        <button id="tabPrivateBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('private')">📥 الرسائل الخاصة</button>
      </div>

      <div style="display:flex; flex-direction:column; height: 100%; min-height: 400px; justify-content:space-between; gap:10px;">
        <div style="color: var(--gold); font-family: 'Amiri', serif; font-size: 14px; text-align: right; font-weight: bold;">📍 ${chatLabel}</div>
        <div id="chatMessages" style="flex:1; overflow-y:auto; padding:15px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; max-height: 320px;">
          <p style="color: var(--text2); text-align:center;">جاري الاتصال بمجلس الذكر... 🕊️</p>
        </div>
        <div id="chatVoiceStatus" style="text-align:center; font-size:12px; color:var(--gold); display:none;"></div>
        <div style="display:flex; gap:8px;">
          <button id="chatVoiceBtn" onclick="window.toggleVoiceRecording('group')" style="background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--gold); width:45px; height:45px; border-radius:50%; font-size:16px; cursor:pointer; flex-shrink:0;">🎙️</button>
          <input id="chatMessageInp" type="text" placeholder="اكتب رسالتك الفورية..." style="flex:1; padding:12px; background:var(--card); border:1px solid var(--border); color:var(--text); border-radius:25px; outline:none;" onkeypress="if(event.key==='Enter') window.sendChatMessageToFirebase()"/>
          <button onclick="window.sendChatMessageToFirebase()" style="background:var(--gold); color:#111; border:none; width:45px; height:45px; border-radius:50%; font-size:18px; cursor:pointer;">🕊️</button>
        </div>
      </div>
    `;
    window.listenToChats(userGender);

  } else if (window.currentCommunityTab === 'fajr') {
    contentArea.innerHTML = `
      <div class="community-tabs" style="margin-bottom: 15px; display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
        <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
        <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
        <button id="tabFajrBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
        <button id="tabFamilyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('family')">🏡 التنافس العائلي</button>
        <button id="tabWeeklyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('weekly')">🌟 حلقة الأسبوع</button>
        <button id="tabLeaderBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('leaderboard')">🏆 لوحة الشرف</button>
        <button id="tabDuaBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('dua')">🤲 اطلب دعاء</button>
        <button id="tabFeaturedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('featured')">✨ الأكثر تأثيراً</button>
        <button id="tabPrivateBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('private')">📥 الرسائل الخاصة</button>
      </div>

      <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 15px; font-size: 14px; text-align: right; font-weight: bold;">🕌 مجلس الاستيقاظ لصلاة الفجر</div>
      <div class="comm-card" style="text-align: right; margin-bottom:15px;">
        <h4 style="color:var(--gold); margin-bottom:8px;">حملة "أقم صلاتك تنر حياتك" 🕊️</h4>
        <p style="color:var(--text2); font-size:12px; margin-bottom:12px;">سجل رقمك هنا ليقوم متطوع اليوم بالاتصال بك وإيقاظك لصلاة الفجر جماعة.</p>
        <div style="display:flex; gap:8px;">
          <input id="fajrPhoneInp" type="tel" placeholder="اكتب رقم موبايلك هنا..." style="flex:1; padding:10px; background:#000; border:1px solid var(--border); color:var(--text); border-radius:8px; outline:none;" />
          <button onclick="window.registerForFajr()" style="background:var(--gold); color:#111; border:none; padding:0 20px; border-radius:8px; font-weight:bold; cursor:pointer;">سجلني للفضل ✨</button>
        </div>
      </div>

      <div class="comm-card" style="text-align: right; margin-bottom:15px; border: 1px dashed var(--gold);">
        <h4 style="color:var(--gold); margin-bottom:5px;">🧔 هل تود أن تكون متطوع اليوم؟</h4>
        <p style="color:var(--text2); font-size:12px; margin-bottom:10px;">الدال على الخير كفاعله، سجل كمتطوع لتظهر لك أرقام الأخوة لإيقاظهم.</p>
        <button onclick="window.becomeFajrVolunteer()" style="background:transparent; color:var(--gold); border:1px solid var(--gold); padding:8px 15px; border-radius:50px; font-weight:bold; cursor:pointer; font-size:12px;">تفعيل لوحة المتطوع 🔑</button>
      </div>

      <div id="fajrVolunteersSection" style="display:none;">
        <div style="color: var(--text); font-size: 13px; text-align: right; margin-bottom: 8px; font-weight:bold;">📋 قائمة طالبي الإيقاظ للفجر اليوم:</div>
        <div id="fajrUsersList" style="display: flex; flex-direction: column; gap: 8px;"></div>
      </div>
    `;

  } else if (window.currentCommunityTab === 'weekly') {
    window.renderWeeklyChallengeTab();

  } else if (window.currentCommunityTab === 'leaderboard') {
    window.renderLeaderboardTab();

  } else if (window.currentCommunityTab === 'dua') {
    window.renderDuaTab();

  } else if (window.currentCommunityTab === 'featured') {
    window.renderFeaturedTab();

  } else if (window.currentCommunityTab === 'private') {
    window.renderPrivateChatDashboard();
  }
    // أضف هذا الشرط داخل دالة renderCommunityBody مع بقية الأقسام
  else if (window.currentCommunityTab === 'family') {
    window.renderFamilyChallengeTab();
  }

};

// دالة مشتركة لعمل شريط التابات (نفس الشكل في كل الأقسام الجديدة)
window.getSharedTabsHTML = function(activeTab) {
  const tabs = [
    { id: 'feed', label: '📝 ساحة الأثر' },
    { id: 'chat', label: '💬 مجلس الذكر' },

    { id: 'fajr', label: '🕌 استيقاظ الفجر' },
        { id: 'family', label: '🏡 التنافس العائلي' },
    { id: 'weekly', label: '🌟 حلقة الأسبوع' }, // 👈 تم تصحيح حرف الـ h هنا
    { id: 'leaderboard', label: '🏆 لوحة الشرف' },
    { id: 'dua', label: '🤲 اطلب دعاء' },
    { id: 'featured', label: '✨ الأكثر تأثيراً' },
    { id: 'private', label: '📥 الرسائل الخاصة' },
  ];
  return `<div class="community-tabs" style="margin-bottom: 15px; display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
    ${tabs.map(t => `<button class="comm-tab-btn ${t.id === activeTab ? 'active' : ''}" onclick="window.switchCommunityTab('${t.id}')">${t.label}</button>`).join('')}
  </div>`;
};


// =========================================================
// 👤 3️⃣ محرك معالجة الألوان الملكية والبروفايل العائم ديناميكياً
// =========================================================
window.getUserNameClassAndStyle = function(points) {
  const pts = points || 0;
  if (pts > 500) {
    return { class: "gold-glow-text", label: "منارة الأثر 🏆" };
  } else if (pts >= 100) {
    return { class: "blue-glow-text", label: "ذاكر مجتهد 🌟" };
  } else {
    return { class: "regular-user-text", label: "مبادر الطيب 🌿" };
  }
};

window.openUserProfileCard = async function(userName) {
  const menus = document.querySelectorAll('[id^="reactionMenu-"]');
  menus.forEach(m => m.style.display = 'none');

  let modal = document.getElementById('athrProfileModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'athrProfileModal';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:99999999; direction:rtl; padding:15px;";
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `<div class="comm-card" style="width:100%; max-width:360px; text-align:center; border:1px solid var(--gold); background:#0b0f0b;"><p style="color:var(--text2);">جاري تحميل صحيفة الأثر... ✨</p></div>`;
  modal.style.display = 'flex';

  try {
    const docSnap = await getDoc(doc(db, "users_profiles", userName));
    if(!docSnap.exists()) {
      modal.innerHTML = `
        <div class="comm-card" style="width:100%; max-width:360px; text-align:center; border:1px solid var(--gold); padding:20px; background:#0b0f0b;">
          <h4 style="color:var(--gold);">الملف الشخصي غير مسجل وثائقياً</h4>
          <p style="color:var(--text2); font-size:13px; margin:10px 0;">هذا المستخدم يتصفح كزائر ولم يقم بإنشاء حساب مستقل حتى الآن.</p>
          <button onclick="document.getElementById('athrProfileModal').style.display='none'" style="background:var(--border); color:white; border:none; padding:6px 20px; border-radius:8px; cursor:pointer;">اغلاق</button>
        </div>`;
      return;
    }

    const u = docSnap.data();
    const styleInfo = window.getUserNameClassAndStyle(u.points);
    const myName = localStorage.getItem('athr_user_name');

    modal.innerHTML = `
      <div class="comm-card" style="width:100%; max-width:360px; text-align:center; border:1px solid var(--gold); padding:25px 15px; background:#070c07; position:relative; animation:fadeIn 0.3s;">
        <button onclick="document.getElementById('athrProfileModal').style.display='none'" style="position:absolute; top:12px; left:12px; background:transparent; color:#ff4d4d; border:none; font-size:18px; cursor:pointer; font-weight:bold;">✕</button>
        
        <img src="${u.avatar || 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/temporary-avatar.png'}" style="width:90px; height:90px; border-radius:50%; border:2px solid var(--gold); object-fit:cover; margin-bottom:12px; box-shadow:0 4px 15px rgba(212,175,55,0.2);" />
        
        <h3 class="${styleInfo.class}" style="font-family:'Amiri', serif; font-size:20px; margin-bottom:4px;">${u.name}</h3>
        <div style="margin-bottom:15px;">
          <span class="profile-badge ${u.gender === 'male' ? 'badge-male' : 'badge-female'}">${u.gender === 'male' ? '🧔 مجلس الرجال' : '🧕 مجلس العفيفات'}</span>
          <span style="color:var(--gold); font-size:12px; font-weight:bold;">🎖️ ${styleInfo.label} (${u.points || 0} أثر)</span>
          ${u.streakCount > 0 ? `<span style="color:#ff9d4d; font-size:12px; font-weight:bold; margin-right:8px;">🔥 ${u.streakCount} يوم متتالي</span>` : ''}
        </div>
        <div style="background:rgba(0,0,0,0.4); border:1px solid var(--border); padding:10px; border-radius:8px; text-align:right; margin-bottom:20px;">
          <small style="color:var(--gold); display:block; margin-bottom:4px; font-size:11px;">✍️ النبذة التعريفية (Bio):</small>
          <p style="color:var(--text); font-size:13px; font-family:'Amiri', serif; line-height:1.5; margin:0; white-space:pre-wrap;">${u.bio || 'لا توجد نبذة حالياً'}</p>
        </div>

        ${myName && myName !== u.name ? `
          <button onclick="window.startPrivateChatWithUser('${u.name}')" style="width:100%; background:var(--gold); color:#111; border:none; padding:12px; border-radius:25px; font-weight:bold; font-family:'Amiri',serif; cursor:pointer; font-size:14px; box-shadow:0 4px 12px rgba(212,175,55,0.25);">
            💬 بدء محادثة خاصة (واتساب ستايل)
          </button>
        ` : ''}
      </div>
    `;
  } catch(e) { console.error(e); }
};

window.getCurrentMonthId = function() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};

window.awardPoints = async function(userName, amount) {
  try {
    const userRef = doc(db, "users_profiles", userName);
    const snap = await getDoc(userRef);
    if(snap.exists()) {
      const currentPts = snap.data().points || 0;
      const monthKey = window.getCurrentMonthId();
      const monthlyPoints = snap.data().monthlyPoints || {};
      const currentMonthlyPts = monthlyPoints[monthKey] || 0;
      await updateDoc(userRef, {
        points: currentPts + amount,
        [`monthlyPoints.${monthKey}`]: currentMonthlyPts + amount
      });
    }
  } catch(e) { console.error(e); }
};
// =========================================================
// 🔥 9️⃣ نظام سلسلة الأثر (Streak) اليومي
// =========================================================
window.getTodayDateStr = function() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

window.updateUserStreak = async function(userName) {
  if(!userName) return;
  try {
    const userRef = doc(db, "users_profiles", userName);
    const snap = await getDoc(userRef);
    if(!snap.exists()) return;
    const data = snap.data();
    const today = window.getTodayDateStr();
    const lastActive = data.lastActiveDate || null;

    if(lastActive === today) return; // النشاط اتحسب النهاردة بالفعل

    let newStreak = 1;
    if(lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
      if(lastActive === yesterdayStr) {
        newStreak = (data.streakCount || 0) + 1;
      }
    }

    const longestStreak = Math.max(newStreak, data.longestStreak || 0);

    await updateDoc(userRef, {
      streakCount: newStreak,
      longestStreak: longestStreak,
      lastActiveDate: today
    });
  } catch(e) { console.error("Streak update error:", e); }
};
// =========================================================
// 👤 8️⃣ نظام "حسابي" - إدارة الملف الشخصي والإعدادات
// =========================================================
let selectedAccountAvatarFile = null;
const NAME_CHANGE_COOLDOWN_DAYS = 60;

window.openMyAccountModal = async function() {
  const myName = localStorage.getItem('athr_user_name');
  if(!myName) { alert("🔒 برجاء تسجيل حسابك أولاً."); return; }

  let modal = document.getElementById('athrMyAccountModal');
  if(!modal) {
    modal = document.createElement('div');
    modal.id = 'athrMyAccountModal';
    modal.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.88); display:flex; align-items:center; justify-content:center; z-index:999999999; direction:rtl; padding:15px; overflow-y:auto;";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `<div class="comm-card" style="width:100%; max-width:380px; text-align:center;"><p style="color:var(--text2);">جاري تحميل بيانات حسابك... ✨</p></div>`;
  modal.style.display = 'flex';

  try {
    const docRef = doc(db, "users_profiles", myName);
    const docSnap = await getDoc(docRef);
    if(!docSnap.exists()) { modal.style.display = 'none'; alert("لم يتم العثور على بياناتك."); return; }

    const u = docSnap.data();
    const styleInfo = window.getUserNameClassAndStyle(u.points);

    let daysRemaining = 0;
    if (u.lastNameChange && u.lastNameChange.toDate) {
      const lastChange = u.lastNameChange.toDate();
      const diffDays = Math.floor((new Date() - lastChange) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, NAME_CHANGE_COOLDOWN_DAYS - diffDays);
    }
    const nameLocked = daysRemaining > 0;

    modal.innerHTML = `
      <div class="comm-card" style="width:100%; max-width:380px; text-align:center; border:1px solid var(--gold); padding:25px 18px; background:#070c07; position:relative; animation:fadeIn 0.3s;">
        <button onclick="document.getElementById('athrMyAccountModal').style.display='none'" style="position:absolute; top:12px; left:12px; background:transparent; color:#ff4d4d; border:none; font-size:18px; cursor:pointer; font-weight:bold;">✕</button>
        <h3 style="color:var(--gold); font-family:'Amiri',serif; margin-bottom:18px;">⚙️ حسابي وإعداداتي</h3>

        <div style="position:relative; display:inline-block; margin-bottom:8px;">
          <img id="accAvatarPreview" src="${u.avatar || 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/temporary-avatar.png'}" style="width:90px; height:90px; border-radius:50%; border:2px solid var(--gold); object-fit:cover;" />
          <label style="position:absolute; bottom:0; left:0; background:var(--gold); color:#111; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; border:2px solid #070c07;">
            📸
            <input type="file" accept="image/*" style="display:none;" onchange="window.handleAccountAvatarSelection(this)" />
          </label>
        </div>
        <div id="accAvatarStatus" style="color:var(--text2); font-size:11px; margin-bottom:15px;"></div>

        <div style="margin-bottom:12px;">
          <span class="${styleInfo.class}" style="font-size:12px; font-weight:bold;">🎖️ ${styleInfo.label}</span>
          <span style="color:var(--gold); font-size:12px; font-weight:bold; margin-right:10px;">✨ ${u.points || 0} نقطة أثر</span>
          ${u.streakCount > 0 ? `<span style="color:#ff9d4d; font-size:12px; font-weight:bold; margin-right:10px;">🔥 ${u.streakCount} يوم</span>` : ''}
        </div>

        <div style="margin-bottom:15px; text-align:right;">
          <label style="color:var(--text); display:block; margin-bottom:6px; font-size:13px;">الاسم:</label>
          <input id="accNameInp" type="text" value="${u.name}" ${nameLocked ? 'disabled' : ''} style="width:100%; padding:10px; background:${nameLocked ? '#111' : '#000'}; border:1px solid var(--border); color:${nameLocked ? 'var(--text2)' : 'var(--text)'}; border-radius:8px; outline:none; font-family:'Amiri', serif;" />
          ${nameLocked 
            ? `<small style="color:#ff9d4d; display:block; margin-top:5px;">⏳ يمكنك تغيير اسمك بعد ${daysRemaining} يوم</small>` 
            : `<small style="color:var(--text2); display:block; margin-top:5px;">⚠️ تغيير الاسم يتيح مرة كل ${NAME_CHANGE_COOLDOWN_DAYS} يوم</small>`}
        </div>

        <div style="margin-bottom:18px; text-align:right;">
          <label style="color:var(--text); display:block; margin-bottom:6px; font-size:13px;">النبذة التعريفية (Bio):</label>
          <textarea id="accBioInp" style="width:100%; height:60px; padding:10px; background:#000; border:1px solid var(--border); color:var(--text); border-radius:8px; outline:none; font-family:'Amiri', serif; resize:none;">${u.bio || ''}</textarea>
        </div>

        <button id="accSaveBtn" onclick="window.saveAccountChanges(${nameLocked})" style="width:100%; background:var(--gold); color:#111; border:none; padding:12px; border-radius:8px; font-weight:bold; font-family:'Amiri', serif; font-size:15px; cursor:pointer;">💾 حفظ التعديلات</button>
      </div>
    `;
  } catch(e) { console.error(e); modal.style.display = 'none'; }
};

window.handleAccountAvatarSelection = function(input) {
  const file = input.files[0];
  if(!file) return;
  selectedAccountAvatarFile = file;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('accAvatarPreview').src = e.target.result;
    document.getElementById('accAvatarStatus').textContent = "✓ صورة جديدة جاهزة، اضغط حفظ للتأكيد";
    document.getElementById('accAvatarStatus').style.color = "var(--gold)";
  };
  reader.readAsDataURL(file);
};

window.saveAccountChanges = async function(nameLocked) {
  const myName = localStorage.getItem('athr_user_name');
  const nameInp = document.getElementById('accNameInp');
  const bioInp = document.getElementById('accBioInp');
  const saveBtn = document.getElementById('accSaveBtn');
  const newName = nameInp ? nameInp.value.trim() : myName;

  if (!nameLocked && newName !== myName) {
    if (!newName.includes(" ") || newName.split(" ").filter(Boolean).length < 2) {
      alert("⚠️ يرجى كتابة اسم ثنائي صحيح.");
      return;
    }
  }

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = "جاري الحفظ... ⏳";

    const updates = { bio: bioInp.value.trim() };

    if (selectedAccountAvatarFile) {
      const formData = new FormData();
      formData.append("image", selectedAccountAvatarFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const resData = await res.json();
      if(resData.success) { updates.avatar = resData.data.url; }
      else { alert("⚠️ فشل رفع الصورة الجديدة: " + (resData.error?.message || "خطأ غير معروف")); }
    }

    if (!nameLocked && newName !== myName) {
      updates.name = newName;
      updates.lastNameChange = serverTimestamp();
    }

    await updateDoc(doc(db, "users_profiles", myName), updates);

    alert(updates.name 
      ? "✅ تم تحديث اسمك. ملحوظة: بروفايلك وبوستاتك (القديمة والجديدة) هتظهر بالاسم الجديد، بس رسائل الشات القديمة هتفضل باسمك القديم." 
      : "✅ تم حفظ التعديلات بنجاح.");

    selectedAccountAvatarFile = null;
    document.getElementById('athrMyAccountModal').style.display = 'none';
    window.renderCommunityBody();
  } catch(e) {
    console.error(e);
    alert("حدث خطأ أثناء الحفظ، يرجى إعادة المحاولة.");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "💾 حفظ التعديلات";
  }
};
// =========================================================
// 📂 معالجة الميديا والرفع الحي للبوستات
// =========================================================
window.handleMediaSelection = function(input) {
  const file = input.files[0];
  if (!file) return;
  selectedMediaFile = file;
  const previewBox = document.getElementById('mediaPreviewBox');
  if(!previewBox) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    previewBox.innerHTML = `
      <div style="position:relative; display:inline-block; max-width:100%; margin-bottom:10px;">
        <img src="${e.target.result}" style="max-height:150px; border-radius:8px; border:1px solid var(--gold);" />
        <button onclick="window.clearSelectedMedia()" style="position:absolute; top:-8px; left:-8px; background:#ff4d4d; color:white; border:none; width:24px; height:24px; border-radius:50%; font-weight:bold; cursor:pointer; font-size:12px;">✕</button>
      </div>`;
  };
  reader.readAsDataURL(file);
};

window.clearSelectedMedia = function() {
  selectedMediaFile = null;
  const previewBox = document.getElementById('mediaPreviewBox');
  if(previewBox) previewBox.innerHTML = "";
};

window.sendPostToFirebase = async function() {
  const textInput = document.getElementById('postInput');
  if (!textInput) return;
  const text = textInput.value.trim();

  if (!text && !selectedMediaFile) { alert("فضلاً، اكتب نصاً أو اختر صورة للنشر ✨"); return; }

  const userGender = localStorage.getItem('athr_user_gender');
  const userName = localStorage.getItem('athr_user_name');
  const submitBtn = document.getElementById('submitPostBtn');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري النشر... ⏳";

    let mediaUrl = ""; let mediaType = "none";
    if (selectedMediaFile) {
      try {
        const formData = new FormData();
        formData.append("image", selectedMediaFile);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const resData = await response.json();
        if (resData.success) { 
          mediaUrl = resData.data.url; 
          mediaType = "image"; 
        } else {
          console.error("imgbb upload failed:", resData);
          alert("⚠️ فشل رفع الصورة:\n" + (resData.error?.message || JSON.stringify(resData)));
        }
      } catch (uploadErr) {
        console.error("imgbb network error:", uploadErr);
        alert("⚠️ خطأ في الاتصال أثناء رفع الصورة:\n" + uploadErr.message);
      }
    }
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
    window.triggerSparksEffect();
    window.awardPoints(userName, 15);
    window.updateUserStreak(userName);
  } catch (e) { console.error(e); } finally { submitBtn.disabled = false; if(submitBtn) submitBtn.textContent = "نشر الفائدة ✨"; }
};

window.listenToPosts = function(gender) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
  const myName = localStorage.getItem('athr_user_name');
  
  unsubscribePosts = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('postsList');
    if (!listArea) return;

    let html = "";
    
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      if (data.gender === gender) {
        const likesArr = data.likes || [];
        const hasLiked = likesArr.includes(myName);
        
        // جلب صورة افتراضية أولاً لحين تحميل الصورة الحقيقية للملف الشخصي
        let userAvatar = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/temporary-avatar.png";
        let nameClass = "regular-user-text";

        let mediaHtml = "";
        if (data.mediaUrl && data.mediaType === 'image') {
          mediaHtml = `<img src="${data.mediaUrl}" onclick="window.openImageLightbox('${data.mediaUrl}')" style="width:100%; border-radius:8px; margin-top:10px; max-height:300px; object-fit:contain; background:#000; cursor:pointer;" />`;
        }

        html += `
          <div class="comm-card" style="border-right: 3px solid var(--gold); text-align: right; margin-bottom: 15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;">
              
              <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.openUserProfileCard('${data.name}')">
                <img src="${userAvatar}" id="avatar-post-${docId}" style="width:35px; height:35px; border-radius:50%; border:1px solid var(--gold); object-fit:cover;" />
                <strong class="${nameClass}" id="name-post-${docId}" style="font-size:14px; text-decoration:underline;">✨ ${data.name}</strong>
              </div>
              
              <small style="color:var(--text2); font-size:11px;">${data.createdAt ? window.formatPostTime(data.createdAt) : 'الآن ✨'}</small>
            </div>
            
            ${data.text ? `<p style="color:var(--text); font-family:'Amiri', serif; font-size:15px; line-height:1.5; white-space: pre-wrap;">${data.text}</p>` : ''}
            ${mediaHtml}
            
            <div class="post-actions" style="display:flex; gap:10px; margin-top:10px; border-bottom:1px dashed var(--border); padding-bottom:8px;">
              <div style="position: relative; display: inline-block;">
                <button 
                  onmousedown="window.startReactionPress(event, '${docId}')" 
                  onmouseup="window.endReactionPress(event, '${docId}', ${hasLiked})" 
                  ontouchstart="window.startReactionPress(event, '${docId}')" 
                  ontouchend="window.endReactionPress(event, '${docId}', ${hasLiked})"
                  onclick="if(!window.isLongPress) window.togglePostLike(event, '${docId}', ${hasLiked})"
                  class="action-item-btn"
                >
                  ✨ تفاعل (${likesArr.length})
                </button>
                <div id="reactionMenu-${docId}" style="display:none; position: absolute; bottom: 40px; right: 0; background: #111; border: 1px solid var(--gold); border-radius: 30px; padding: 5px 10px; gap: 8px; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); animation: fadeIn 0.2s;">
                  <span onclick="window.selectCustomReaction(event, '${docId}', '👍')" style="cursor:pointer; font-size:20px;">👍</span>
                  <span onclick="window.selectCustomReaction(event, '${docId}', '❤️')" style="cursor:pointer; font-size:20px;">❤️</span>
                  <span onclick="window.selectCustomReaction(event, '${docId}', '🤝')" style="cursor:pointer; font-size:20px;">🤝</span>
                  <span onclick="window.selectCustomReaction(event, '${docId}', '😮')" style="cursor:pointer; font-size:20px;">😮</span>
                  <span onclick="window.selectCustomReaction(event, '${docId}', '😢')" style="cursor:pointer; font-size:20px;">😢</span>
                  <span onclick="window.selectCustomReaction(event, '${docId}', '😡')" style="cursor:pointer; font-size:20px;">😡</span>
                </div>
              </div>
              <button onclick="window.toggleCommentsSection('${docId}')" class="action-item-btn">💬 التعليقات</button>
              <button onclick="window.openCommShareSheet(\`${data.text ? data.text.replace(/"/g, '&quot;') : 'أثر طيب'}\`, '${data.name}')" class="action-item-btn">🔗 مشاركة</button>
              ${data.name === myName ? `<button onclick="window.deletePost('${docId}')" class="action-item-btn" style="color:#ff6b6b;">🗑️ حذف</button>` : ''}
              </div>

            <div id="commentsWrapper-${docId}" style="display:none; padding-top:10px;">
              <div id="commentsList-${docId}" style="max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:6px; margin-bottom:8px;"></div>
              <div style="display:flex; gap:6px;">
                <input id="commentInput-${docId}" type="text" placeholder="اكتب تعليقاً طيباً..." style="flex:1; padding:8px 12px; background:#000; border:1px solid var(--border); color:var(--text); border-radius:20px; font-size:13px; outline:none;" onkeypress="if(event.key==='Enter') window.sendComment('${docId}')" />
                <button onclick="window.sendComment('${docId}')" style="background:var(--gold); color:#111; border:none; padding:0 15px; border-radius:20px; font-size:13px; font-weight:bold; cursor:pointer;">إرسال</button>
              </div>
            </div>
          </div>
        `;
        
        // إصلاح تحديث الصورة والاسم الحقيقي للكاتب بداخل الـ Feed
        getDoc(doc(db, "users_profiles", data.name)).then(userDoc => {
          if (userDoc.exists()) {
            const uData = userDoc.data();
            const avatarImg = document.getElementById(`avatar-post-${docId}`);
            const nameTxt = document.getElementById(`name-post-${docId}`);
            
            if (uData.avatar && avatarImg) avatarImg.src = uData.avatar;
            if (nameTxt) {
              nameTxt.textContent = `✨ ${uData.name || data.name}`;
              if (typeof window.getUserNameClassAndStyle === 'function') {
                const styleInfo = window.getUserNameClassAndStyle(uData.points);
                nameTxt.className = styleInfo.class;
              }
            }
          }
        }).catch(e => console.log("Profile async fetch skip:", e));
      }
    });

    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center;">الساحة فارغة، انشر أثرك الطيب الحين...</p></div>`;
  });
};
 
window.togglePostLike = async function(event, docId, hasLiked, emoji = '❤️') {
  const myName = localStorage.getItem('athr_user_name');
  if(!myName) { alert("🔒 برجاء إعداد حسابك وتسجيل الدخول لتتمكن من التفاعل."); return; }
  const postRef = doc(db, "posts", docId);
  if (!hasLiked && event) window.createFloatingEmoji(event, emoji);
  try {
    if (hasLiked) { await updateDoc(postRef, { likes: arrayRemove(myName), likesCount: increment(-1) }); } 
    else { await updateDoc(postRef, { likes: arrayUnion(myName), likesCount: increment(1) }); window.awardPoints(myName, 2); }
  } catch (e) { console.error(e); }
};
window.deletePost = async function(docId) {
  if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.")) return;
  try {
    await deleteDoc(doc(db, "posts", docId));
  } catch(e) {
    console.error(e);
    alert("حدث خطأ أثناء حذف المنشور.");
  }
};
// =========================================================
// 💬 4️⃣ نظام تشغيل وإدارة التعليقات الحية (Comments)
// =========================================================
window.toggleCommentsSection = function(docId, colName = 'posts') {
  const wrapper = document.getElementById(`commentsWrapper-${docId}`);
  if (!wrapper) return;
  if (wrapper.style.display === "none") { wrapper.style.display = "block"; window.listenToComments(docId, colName); } 
  else { wrapper.style.display = "none"; }
};

window.sendComment = async function(docId, colName = 'posts') {
  const input = document.getElementById(`commentInput-${docId}`);
  const myName = localStorage.getItem('athr_user_name');
  if(!myName) { alert("🔒 برجاء تسجيل الدخول أولاً للتعليق."); return; }
  if (!input || !input.value.trim()) return;

  try {
    await addDoc(collection(db, colName, docId, "comments"), {
      name: myName,
      text: input.value.trim(),
      createdAt: serverTimestamp()
    });
    input.value = ""; 
    window.awardPoints(myName, 3); 
    window.updateUserStreak(myName);
  } catch (e) { console.error(e); }
};

window.listenToComments = function(docId, colName = 'posts') {
  const q = query(collection(db, colName, docId, "comments"), orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById(`commentsList-${docId}`);
    if (!listArea) return;
    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      html += `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 6px 10px; border-radius: 8px; font-size: 13px; text-align:right;">
          <strong onclick="window.openUserProfileCard('${data.name}')" style="color: var(--gold); cursor:pointer; text-decoration:underline; margin-left: 5px;">${data.name}:</strong>
          <span style="color: var(--text); white-space: pre-wrap;">${data.text}</span>
        </div>`;
    });
    listArea.innerHTML = html || `<p style="color: var(--text2); font-size:11px; text-align:center;">لا توجد تعليقات بعد.</p>`;
  });
};

// =========================================================
// 💬 5️⃣ شات غرف مجالس الذكر العامة والمجموعات
// =========================================================
window.sendChatMessageToFirebase = async function() {
  const input = document.getElementById('chatMessageInp');
  const myName = localStorage.getItem('athr_user_name');
  if(!myName) return;
  if (!input || !input.value.trim()) return;

  const userGender = localStorage.getItem('athr_user_gender');
  try {
    await addDoc(collection(db, "chats"), {
      name: myName,
      text: input.value.trim(),
      gender: userGender,
      createdAt: serverTimestamp()
    });
    input.value = "";
    window.awardPoints(myName, 1);
    window.updateUserStreak(myName);
  } catch (e) { console.error(e); }
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
        const bodyHtml = data.messageType === 'audio' && data.audioUrl
          ? `<audio controls src="${data.audioUrl}" style="max-width:220px; height:34px;"></audio>`
          : `<span style="color:var(--text); font-size:14px;">${data.text}</span>`;
        html += `
          <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}; padding: 8px 14px; border-radius: 12px; max-width: 85%; text-align: right; margin-bottom: 5px;">
            <span onclick="window.openUserProfileCard('${data.name}')" style="display:block; font-size:11px; color:var(--gold); font-weight:bold; margin-bottom:2px; cursor:pointer; text-decoration:underline;">
              <span class="online-dot"></span>${data.name}
            </span>
            ${bodyHtml}
          </div>`;
      }
    });
    chatArea.innerHTML = html || `<p style="color: var(--text2); text-align:center;">المجلس هادئ.. ابدأ بذكر الله العظيم ✨</p>`;
    chatArea.scrollTop = chatArea.scrollHeight;
  });
};

// =========================================================
// 🔒 6️⃣ نظام المحادثات الخاصة الفورية الثنائية (1-on-1 Private Chat)
// =========================================================
window.startPrivateChatWithUser = function(targetUser) {
  const myName = localStorage.getItem('athr_user_name');
  if(!myName) return;
  
  if(document.getElementById('athrProfileModal')) document.getElementById('athrProfileModal').style.display = 'none';

  const roomId = [myName, targetUser].sort().join("___");
  window.activePrivateRoomId = roomId;
  window.currentPrivateTargetUser = targetUser;
  window.markConversationSeen(roomId, myName);

  window.currentCommunityTab = 'private';
  window.renderCommunityBody();
};

window.markConversationSeen = async function(roomId, myName) {
  try {
    await setDoc(doc(db, "chat_rooms", roomId), { lastSeenBy: arrayUnion(myName) }, { merge: true });
  } catch(e) { console.error(e); }
};  
  

window.renderPrivateChatDashboard = function() {
  if (!window.activePrivateRoomId) {
    window.renderInboxList();
    return;
  }

  const contentArea = document.getElementById('communityContent');
  const target = window.currentPrivateTargetUser || "محادثة خاصة";
  
  contentArea.innerHTML = `
    <div class="community-tabs" style="margin-bottom: 15px; display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
      <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
      <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
      <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
      <button id="tabWeeklyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('weekly')">🌟 حلقة الأسبوع</button>
      <button id="tabLeaderBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('leaderboard')">🏆 لوحة الشرف</button>
      <button id="tabDuaBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('dua')">🤲 اطلب دعاء</button>
      <button id="tabFeaturedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('featured')">✨ الأكثر تأثيراً</button>
      <button id="tabPrivateBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('private')">📥 الرسائل الخاصة</button>
    </div>

    <div style="display:flex; flex-direction:column; height: 100%; min-height: 420px; justify-content:space-between; gap:10px; direction:rtl;">
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(212,175,55,0.05); padding:10px; border-radius:8px; border:1px solid var(--border);">
        <strong style="color:var(--gold);">💬 المحادثة الخاصة مع: ${target}</strong>
        <button onclick="window.activePrivateRoomId=null; window.currentPrivateTargetUser=null; window.renderPrivateChatDashboard();" style="background:transparent; color:var(--text2); border:none; cursor:pointer; font-size:12px; text-decoration:underline;">‹ رجوع للصندوق</button>
      </div>

      <div id="privateChatMessages" style="flex:1; overflow-y:auto; padding:15px; background: rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; max-height: 280px;">
        <p style="color:var(--text2); text-align:center;">جاري فتح صندوق الرسائل... 🔒</p>
      </div>

      <div id="privateMediaPreviewBox" style="text-align:center; position:relative;"></div>
      <div id="privateVoiceStatus" style="text-align:center; font-size:12px; color:var(--gold); display:none;"></div>

      <div style="display:flex; gap:6px; align-items:center;">
        <label style="background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:10px; border-radius:50%; cursor:pointer; font-size:16px; width:42px; height:42px; display:flex; align-items:center; justify-content:center;">
          🖼️
          <input type="file" id="privateChatMediaInput" accept="image/*" style="display:none;" onchange="window.handlePrivateChatMediaSelection(this)" />
        </label>
        <button id="privateVoiceBtn" onclick="window.toggleVoiceRecording('private')" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); color:var(--gold); width:42px; height:42px; border-radius:50%; font-size:16px; cursor:pointer; flex-shrink:0;">🎙️</button>
        <input id="privateChatMessageInp" type="text" placeholder="اكتب رسالة خاصة آمنة..." style="flex:1; padding:12px; background:var(--card); border:1px solid var(--border); color:var(--text); border-radius:25px; outline:none;" onkeypress="if(event.key==='Enter') window.sendPrivateMessage()"/>
        <button id="sendPrivateMsgBtn" onclick="window.sendPrivateMessage()" style="background:var(--gold); color:#111; border:none; width:42px; height:42px; border-radius:50%; font-size:16px; cursor:pointer; font-weight:bold;">🕊️</button>
      </div>
    </div>
  `;
  window.listenToPrivateMessages();
};

window.renderInboxList = function() {
  const contentArea = document.getElementById('communityContent');
  const myName = localStorage.getItem('athr_user_name');

  contentArea.innerHTML = `
    <div class="community-tabs" style="margin-bottom: 15px; display:flex; gap:6px; overflow-x:auto; padding-bottom:4px;">
      <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
      <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
      <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
      <button id="tabWeeklyBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('weekly')">🌟 حلقة الأسبوع</button>
      <button id="tabLeaderBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('leaderboard')">🏆 لوحة الشرف</button>
      <button id="tabDuaBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('dua')">🤲 اطلب دعاء</button>
      <button id="tabFeaturedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('featured')">✨ الأكثر تأثيراً</button>
      <button id="tabPrivateBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('private')">📥 الرسائل الخاصة</button>
    </div>

    <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 15px; font-size: 14px; text-align: right; font-weight: bold;">📥 صندوق رسائلك الخاصة</div>

    <div id="inboxList" style="display:flex; flex-direction:column; gap:8px;">
      <p style="color:var(--text2); text-align:center;">جاري تحميل المحادثات... ✨</p>
    </div>
  `;

  window.listenToInbox(myName);
};

window.listenToInbox = function(myName) {
  if (window.unsubscribeInbox) window.unsubscribeInbox();
  if (!myName) return;

  const q = query(collection(db, "chat_rooms"), where("participants", "array-contains", myName), orderBy("updatedAt", "desc"), limit(50));

  window.unsubscribeInbox = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('inboxList');
    if (!listArea) return;

    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const otherUser = (data.participants || []).find(p => p !== myName);
      if (!otherUser) return;

      const isUnread = data.lastSender !== myName && !(data.lastSeenBy || []).includes(myName);

      html += `
        <div class="comm-card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; padding:12px 15px;" onclick="window.openConversationFromInbox('${otherUser}', '${docSnap.id}')">
          <div style="text-align:right;">
            <strong style="color:${isUnread ? 'var(--gold)' : 'var(--text)'}; font-size:14px;">${otherUser} ${isUnread ? '🔴' : ''}</strong>
            <p style="color:var(--text2); font-size:12px; margin:4px 0 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;">
              ${data.lastSender === myName ? 'أنت: ' : ''}${data.lastMessage || '📷 صورة'}
            </p>
          </div>
          <span style="color:var(--text2); font-size:11px;">${data.updatedAt ? window.formatPostTime(data.updatedAt) : ''}</span>
        </div>`;
    });

    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center; font-size:13px;">لا توجد محادثات بعد. ابدأ محادثة من بروفايل أي شخص ✨</p></div>`;
  }, (error) => {
    console.error("Inbox error:", error);
    const listArea = document.getElementById('inboxList');
    if (listArea) {
      listArea.innerHTML = `<div class="comm-card"><p style="color:#ff6b6b; text-align:center; font-size:12px; direction:ltr;">${error.code}: ${error.message}</p></div>`;
    }
  });
};  
window.openConversationFromInbox = function(targetUser, roomId) {
  window.activePrivateRoomId = roomId;
  window.currentPrivateTargetUser = targetUser;
  window.markConversationSeen(roomId, localStorage.getItem('athr_user_name'));
  window.renderPrivateChatDashboard();
};

window.handlePrivateChatMediaSelection = function(input) {
  if(input.files[0]) {
    selectedChatPrivateFile = input.files[0];
    const box = document.getElementById('privateMediaPreviewBox');
    box.innerHTML = `<div style="display:inline-block; position:relative; margin-top:5px;"><span style="color:var(--gold); font-size:12px;">📸 تم تجهيز صورة للرفع</span><button onclick="selectedChatPrivateFile=null; document.getElementById('privateMediaPreviewBox').innerHTML=''" style="background:none; border:none; color:red; margin-right:5px; cursor:pointer;">✕</button></div>`;
  }
};

window.sendPrivateMessage = async function() {
  const input = document.getElementById('privateChatMessageInp');
  const sendBtn = document.getElementById('sendPrivateMsgBtn');
  if(!input) return;
  const text = input.value.trim();
  const myName = localStorage.getItem('athr_user_name');

  if(!text && !selectedChatPrivateFile) return;

  try {
    sendBtn.disabled = true;
    let imgUrl = ""; let type = "text";
    
    if(selectedChatPrivateFile) {
      const formData = new FormData();
      formData.append("image", selectedChatPrivateFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const resData = await res.json();
      if(resData.success) { imgUrl = resData.data.url; type = "image"; }
    }

    const msgRef = collection(db, "private_chats", window.activePrivateRoomId, "messages");
    await addDoc(msgRef, {
      sender: myName,
      text: text,
      mediaUrl: imgUrl,
      mediaType: type,
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, "chat_rooms", window.activePrivateRoomId), {
      participants: [myName, window.currentPrivateTargetUser],
      lastMessage: text || "📷 صورة",
      lastSender: myName,
      lastSeenBy: [myName],
      updatedAt: serverTimestamp()
    }, { merge: true });

    input.value = "";
    selectedChatPrivateFile = null;
    document.getElementById('privateMediaPreviewBox').innerHTML = "";
    window.updateUserStreak(myName);
  } catch(e) { console.error(e); } finally { sendBtn.disabled = false; }
};

window.listenToPrivateMessages = function() {
  if(unsubscribePrivates) unsubscribePrivates();
  if(!window.activePrivateRoomId) return;

  const q = query(collection(db, "private_chats", window.activePrivateRoomId, "messages"), orderBy("createdAt", "asc"), limit(50));
  unsubscribePrivates = onSnapshot(q, (snapshot) => {
    const area = document.getElementById('privateChatMessages');
    if(!area) return;

    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const isMe = data.sender === localStorage.getItem('athr_user_name');
      
      let mediaHtml = "";
      if(data.mediaUrl && data.mediaType === 'image') {
        mediaHtml = `<img src="${data.mediaUrl}" onclick="window.openImageLightbox('${data.mediaUrl}')" style="max-width:100%; border-radius:8px; margin-top:5px; max-height:150px; display:block; cursor:pointer;" />`;
      }
      let audioHtml = "";
      if (data.messageType === 'audio' && data.audioUrl) {
        audioHtml = `<audio controls src="${data.audioUrl}" style="max-width:220px; height:34px; margin-top:4px;"></audio>`;
      }

      html += `
        <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}; padding: 8px 14px; border-radius: 12px; max-width: 80%; text-align: right;">
          <span style="display:block; font-size:10px; color:var(--text2); margin-bottom:2px;">${data.sender}</span>
          ${data.text ? `<span style="color:var(--text); font-size:13px;">${data.text}</span>` : ''}
          ${mediaHtml}
          ${audioHtml}
        </div>`;
    });
    area.innerHTML = html || `<p style="color: var(--text2); text-align:center; font-size:12px;">لا توجد رسائل بينكما بعد، ابدأ بالسلام والخير ✨</p>`;
    area.scrollTop = area.scrollHeight;
  });
};

// =========================================================
// 🕌 7️⃣ حملة الفجر وإدارة التأثيرات الجمالية والمطولة
// =========================================================
window.switchCommunityTab = function(tab) {
  if (tab === 'private') {
    window.activePrivateRoomId = null;
    window.currentPrivateTargetUser = null;
  }
  window.currentCommunityTab = tab;
  window.checkCommunityUser();
};

window.startReactionPress = function(event, docId) {
  if (event.cancelable) event.preventDefault(); 
  window.isLongPress = false;
  pressTimer = setTimeout(() => {
    window.isLongPress = true;
    const menu = document.getElementById(`reactionMenu-${docId}`);
    if (menu) menu.style.display = 'flex';
  }, 500); 
};

window.endReactionPress = function(event, docId, hasLiked) { clearTimeout(pressTimer); };

window.selectCustomReaction = async function(event, docId, emoji) {
  event.stopPropagation();
  const menu = document.getElementById(`reactionMenu-${docId}`);
  if (menu) menu.style.display = 'none';
  window.createFloatingEmoji(event, emoji);
  window.togglePostLike(null, docId, false, emoji);
};

window.triggerSparksEffect = function() {
  for (let i = 0; i < 25; i++) {
    const spark = document.createElement('div');
    spark.innerHTML = '✨';
    spark.style.cssText = `position:fixed; left:${Math.random()*100}vw; top:${Math.random()*100}vh; font-size:${Math.random()*20+12}px; z-index:999999; pointer-events:none; transition:all 1.5s ease-out; opacity:1;`;
    document.body.appendChild(spark);
    setTimeout(() => { spark.style.transform = `translateY(-60px) scale(0.4) rotate(${Math.random()*180}deg)`; spark.style.opacity = '0'; }, 50);
    setTimeout(() => spark.remove(), 1500);
  }
};

window.createFloatingEmoji = function(event, emoji = '❤️') {
  let leftPos = window.innerWidth / 2; let topPos = window.innerHeight / 2;
  if (event && event.target) {
    const bounding = event.target.getBoundingClientRect();
    if(bounding.width > 0) { leftPos = bounding.left + bounding.width / 2 - 10; topPos = bounding.top; }
  }
  const element = document.createElement('div');
  element.innerHTML = emoji;
  element.style.cssText = `position:fixed; left:${leftPos}px; top:${topPos}px; font-size:24px; z-index:99999; pointer-events:none; transition:all 1.2s ease-in-out;`;
  document.body.appendChild(element);
  setTimeout(() => { element.style.transform = `translateY(-140px) translateX(${Math.random()*50-25}px) scale(1.6)`; element.style.opacity = '0'; }, 50);
  setTimeout(() => element.remove(), 1200);
};

window.registerForFajr = async function() {
  const phoneInp = document.getElementById('fajrPhoneInp');
  if (!phoneInp || !phoneInp.value.trim()) { alert('فضلاً، أدخل رقم هاتفك أولاً.'); return; }
  const myName = localStorage.getItem('athr_user_name');
  const userGender = localStorage.getItem('athr_user_gender');
  try {
    await addDoc(collection(db, "fajr_list"), { name: myName, phone: phoneInp.value.trim(), gender: userGender, createdAt: serverTimestamp() });
    phoneInp.value = "";
    alert('تم تسجيلك بنجاح في قائمة الفجر المباركة! تقبل الله طاعتك وغفر ذنبك ✨');
  } catch (e) { console.error(e); }
};

window.becomeFajrVolunteer = function() {
  document.getElementById('fajrVolunteersSection').style.display = 'block';
  window.listenToFajrList(localStorage.getItem('athr_user_gender'));
};

// =========================================================================
// 🕌 7️⃣ حملة الفجر المطورة - إيقاظ حي، حذف ذاتي، وتصفير يومي تلقائي
// =========================================================================

// دالة لجلب تاريخ اليوم الحالي بصيغة نصية ثابتة (YYYY-MM-DD) لتصفير القائمة يومياً
window.getFajrTodayDateStr = function() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

window.registerForFajr = async function() {
  const phoneInp = document.getElementById('fajrPhoneInp');
  if (!phoneInp || !phoneInp.value.trim()) { alert('فضلاً، أدخل رقم هاتفك أولاً.'); return; }
  
  const myName = localStorage.getItem('athr_user_name');
  const userGender = localStorage.getItem('athr_user_gender');
  const todayStr = window.getFajrTodayDateStr(); // ختم اليوم الحالي

  try {
    // تخزين الوثيقة باسم (تاريخ اليوم___اسم المستخدم) لمنع التكرار في نفس اليوم وتسهيل الحذف
    const docId = `${todayStr}___${myName}`;
    await setDoc(doc(db, "fajr_list", docId), { 
      name: myName, 
      phone: phoneInp.value.trim(), 
      gender: userGender, 
      dateStr: todayStr, // فلتر اليوم لضمان تنظيف القائمة تلقائياً
      status: "pending", // pending = مستني، called = تم الإيقاظ بنجاح
      calledBy: null,
      createdAt: serverTimestamp() 
    });
    
    phoneInp.value = "";
    alert('تم تسجيلك بنجاح في قائمة الفجر المباركة لليوم! ✨');
    window.triggerSparksEffect();
  } catch (e) { console.error(e); }
};

window.becomeFajrVolunteer = function() {
  document.getElementById('fajrVolunteersSection').style.display = 'block';
  window.listenToFajrList(localStorage.getItem('athr_user_gender'));
};

window.listenToFajrList = function(gender) {
  const todayStr = window.getFajrTodayDateStr();
  const myName = localStorage.getItem('athr_user_name');
  
  // 🎯 الفلتر السحري: يجيب فقط المسجلين بتاريخ (النهاردة) عشان القائمة تتصفر يومياً لوحدها
  const q = query(
    collection(db, "fajr_list"), 
    where("dateStr", "==", todayStr), 
    orderBy("createdAt", "desc")
  );
  
  onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('fajrUsersList');
    if (!listArea) return;
    
    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      if (data.gender === gender) {
        const isMe = data.name === myName;
        const isCalled = data.status === "called";
        
        html += `
          <div class="comm-card" style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:${isCalled ? 'rgba(76,175,80,0.03)' : 'rgba(255,255,255,0.02)'}; border:${isCalled ? '1px solid #4CAF50' : '1px solid var(--border)'};">
            <div style="text-align:right;">
              <strong onclick="window.openUserProfileCard('${data.name}')" style="color:${isCalled ? '#4CAF50' : 'var(--text)'}; font-size:14px; cursor:pointer; text-decoration:underline;">✨ ${data.name}</strong>
              <span style="display:block; color:var(--text2); font-size:12px; direction:ltr; margin-top:2px;">${data.phone}</span>
              ${isCalled ? `<small style="color:#4CAF50; display:block; margin-top:2px;">✓ تم إيقاظه بواسطة: ${data.calledBy}</small>` : ''}
            </div>
            
            <div style="display:flex; gap:6px; align-items:center;">
              ${isMe ? `
                <!-- زرار حذف ذاتي للمستخدم لو كتب غلط أو صحي لوحده -->
                <button onclick="window.deleteMyFajrRegistration('${docId}')" style="background:transparent; color:#ff4d4d; border:1px solid #ff4d4d; padding:6px 12px; border-radius:20px; font-size:11px; font-weight:bold; cursor:pointer;">🗑️ حذف نفسي</button>
              ` : ''}

              ${isCalled ? `
                <!-- يظهر علامة صح ومقفول عشان محدش يرن تاني -->
                <span style="background:rgba(76,175,80,0.15); color:#4CAF50; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:bold;">✓ تم الإيقاظ</span>
              ` : `
                <!-- زر الاتصال والاتساق الذكي للـ متطوع -->
                <a href="tel:${data.phone}" onclick="window.markAsAwake('${docId}')" style="background:var(--gold); color:#111; text-decoration:none; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:bold; display:inline-block;">📞 اتصل الآن</a>
              `}
            </div>
          </div>`;
      }
    });
    
    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center; font-size:12px;">لا توجد أسماء مسجلة لفجر اليوم حتى الآن 🕌</p></div>`;
  });
};

// دالة تغيير الحالة لـ "تم الإيقاظ" لمنع التكرار والرن المزعج
window.markAsAwake = async function(docId) {
  const volunteerName = localStorage.getItem('athr_user_name') || "متطوع الطيب";
  try {
    const docRef = doc(db, "fajr_list", docId);
    await updateDoc(docRef, {
      status: "called",
      calledBy: volunteerName
    });
    window.createFloatingEmoji(null, '✅');
  } catch(e) { console.error("Error updating fajr status:", e); }
};

// دالة حذف الحساب الفوري من سكريبت الفجر
window.deleteMyFajrRegistration = async function(docId) {
  if(!confirm("هل تود حذف اسمك ورقمك من قائمة الإيقاظ للفجر اليوم؟")) return;
  try {
    await deleteDoc(doc(db, "fajr_list", docId));
    alert("تم حذف بياناتك بنجاح من قائمة اليوم.");
  } catch(e) { console.error("Error deleting fajr document:", e); }
};

          

document.addEventListener('click', function() {
  const menus = document.querySelectorAll('[id^="reactionMenu-"]');
  menus.forEach(m => m.style.display = 'none');
});

setTimeout(() => { window.checkCommunityUser(); }, 300);

window.formatPostTime = function(timestamp) {
  if (!timestamp) return "منذ قليل ⏳";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "الآن ✨";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
};
window.openImageLightbox = function(imageUrl) {
  let lightbox = document.getElementById('athrImageLightbox');
  if(!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'athrImageLightbox';
    lightbox.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.92); display:flex; align-items:center; justify-content:center; z-index:999999999; padding:15px;";
    lightbox.onclick = function() { lightbox.style.display = 'none'; };
    document.body.appendChild(lightbox);
  }
  lightbox.innerHTML = `<img src="${imageUrl}" style="max-width:100%; max-height:100%; border-radius:8px; object-fit:contain;" onclick="event.stopPropagation();" />
    <button onclick="document.getElementById('athrImageLightbox').style.display='none'" style="position:fixed; top:15px; left:15px; background:rgba(255,255,255,0.15); color:white; border:none; width:36px; height:36px; border-radius:50%; font-size:18px; cursor:pointer;">✕</button>`;
  lightbox.style.display = 'flex';
};

// =========================================================================
// 🌟 10️⃣ نظام "حلقة الأسبوع" - تحدي جماعي أسبوعي مع شريط تقدم
// =========================================================================
// تحديات جاهزة تتغير تلقائياً كل أسبوع (مافيش حاجة يدوية ممكن "متشتغلش")
const ATHR_WEEKLY_PRESETS = [
  { title: "ختم جزء من القرآن هذا الأسبوع 📖", description: "اقرأ جزءاً كاملاً من كتاب الله قبل نهاية الأسبوع، ولو بصفحة يومياً." },
  { title: "المحافظة على أذكار الصباح والمساء 🌅", description: "التزم بقول أذكار الصباح والمساء كاملة كل يوم هذا الأسبوع." },
  { title: "قراءة 3 أحاديث نبوية يومياً 📗", description: "اقرأ واحفظ 3 أحاديث نبوية يومياً من كتاب رياض الصالحين أو غيره." },
  { title: "صيام يومي الاثنين والخميس 🌙", description: "احرص على صيام الاثنين والخميس هذا الأسبوع اقتداءً بالسنة." },
  { title: "صدقة يومية ولو بسيطة 🤲", description: "تصدق كل يوم هذا الأسبوع بأي شيء ولو قليلاً، فالصدقة تطفئ غضب الرب." },
  { title: "قيام الليل (ولو ركعتين) 🕋", description: "حاول أن تقوم الليل بركعتين على الأقل كل ليلة هذا الأسبوع." },
];

// رقم الأسبوع الحالي بمعيار ISO عشان التحدي يتغير تلقائياً كل أسبوع
window.getCurrentWeekId = function() {
  const d = new Date();
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7; // الاثنين = 0
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

window.renderWeeklyChallengeTab = function() {
  const contentArea = document.getElementById('communityContent');
  const myName = localStorage.getItem('athr_user_name');

  contentArea.innerHTML = `
    ${window.getSharedTabsHTML('weekly')}
    <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 15px; font-size: 14px; text-align: right; font-weight: bold;">🌟 حلقة التحدي الأسبوعي الجماعي</div>
    <div id="weeklyChallengeBox" class="comm-card" style="text-align:right;">
      <p style="color:var(--text2); text-align:center;">جاري تحميل تحدي الأسبوع... ✨</p>
    </div>
  `;
  window.listenToWeeklyChallenge(myName);
};

window.listenToWeeklyChallenge = async function(myName) {
  const weekId = window.getCurrentWeekId();
  const challengeRef = doc(db, "weekly_challenges", weekId);

  try {
    const existing = await getDoc(challengeRef);
    if (!existing.exists()) {
      // نختار تحدي تلقائي بناءً على رقم الأسبوع عشان يتغير كل أسبوع لوحده
      const weekNum = parseInt(weekId.split('-W')[1], 10) || 0;
      const preset = ATHR_WEEKLY_PRESETS[weekNum % ATHR_WEEKLY_PRESETS.length];
      await setDoc(challengeRef, {
        title: preset.title,
        description: preset.description,
        participants: [],
        completed: [],
        createdAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (e) { console.error("weekly challenge init error:", e); }

  if (window.unsubscribeWeekly) window.unsubscribeWeekly();
  window.unsubscribeWeekly = onSnapshot(challengeRef, (snap) => {
    const box = document.getElementById('weeklyChallengeBox');
    if (!box || !snap.exists()) return;
    const data = snap.data();
    const participants = data.participants || [];
    const completed = data.completed || [];
    const hasJoined = myName && participants.includes(myName);
    const hasCompleted = myName && completed.includes(myName);
    const progressPct = participants.length > 0 ? Math.round((completed.length / participants.length) * 100) : 0;

    box.innerHTML = `
      <h4 style="color:var(--gold); margin-bottom:8px;">${data.title}</h4>
      <p style="color:var(--text2); font-size:13px; margin-bottom:15px; line-height:1.6;">${data.description}</p>

      <div style="background:rgba(0,0,0,0.4); border-radius:20px; overflow:hidden; height:18px; margin-bottom:6px; border:1px solid var(--border);">
        <div style="background:var(--gold); height:100%; width:${progressPct}%; transition:width 0.4s;"></div>
      </div>
      <p style="color:var(--text2); font-size:11px; margin-bottom:15px;">✅ ${completed.length} من ${participants.length} خلّصوا التحدي (${progressPct}%)</p>

      ${!myName ? `<p style="color:var(--text2); font-size:12px; text-align:center;">🔒 سجل حسابك للمشاركة في التحدي.</p>` : `
        <div style="display:flex; gap:8px;">
          ${!hasJoined
            ? `<button onclick="window.joinWeeklyChallenge()" style="flex:1; background:var(--gold); color:#111; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">سجّل نفسك في التحدي ✋</button>`
            : hasCompleted
              ? `<div style="flex:1; text-align:center; color:var(--gold); font-weight:bold; padding:10px;">🎉 ما شاء الله، أنت خلّصت التحدي هذا الأسبوع!</div>`
              : `<button onclick="window.completeWeeklyChallenge()" style="flex:1; background:transparent; border:1px solid var(--gold); color:var(--gold); padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">أنا خلّصت التحدي 🎉</button>`
          }
        </div>
      `}
    `;
  }, (err) => console.error("weekly challenge listen error:", err));
};

window.joinWeeklyChallenge = async function() {
  const myName = localStorage.getItem('athr_user_name');
  if (!myName) return;
  const weekId = window.getCurrentWeekId();
  try {
    await updateDoc(doc(db, "weekly_challenges", weekId), { participants: arrayUnion(myName) });
    window.awardPoints(myName, 5);
  } catch (e) { console.error(e); }
};

window.completeWeeklyChallenge = async function() {
  const myName = localStorage.getItem('athr_user_name');
  if (!myName) return;
  const weekId = window.getCurrentWeekId();
  try {
    await updateDoc(doc(db, "weekly_challenges", weekId), { completed: arrayUnion(myName) });
    window.triggerSparksEffect();
    window.awardPoints(myName, 20);
    window.updateUserStreak(myName);
  } catch (e) { console.error(e); }
};

// =========================================================================
// 🏆 11️⃣ لوحة أهل الخير - Leaderboard شهري يتصفر تلقائياً كل شهر
// =========================================================================
window.renderLeaderboardTab = function() {
  const contentArea = document.getElementById('communityContent');
  const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const now = new Date();

  contentArea.innerHTML = `
    ${window.getSharedTabsHTML('leaderboard')}
    <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 15px; font-size: 14px; text-align: right; font-weight: bold;">🏆 لوحة أهل الخير - ${monthNames[now.getMonth()]} ${now.getFullYear()}</div>
    <p style="color:var(--text2); font-size:11px; text-align:center; margin-bottom:12px;">أعلى 10 في نقاط الأثر هذا الشهر، وتتصفر اللوحة أول كل شهر ✨</p>
    <div id="leaderboardList" style="display:flex; flex-direction:column; gap:8px;">
      <div class="comm-card"><p style="color:var(--text2); text-align:center;">جاري تحميل اللوحة... ✨</p></div>
    </div>
  `;
  window.listenToLeaderboard();
};

window.listenToLeaderboard = function() {
  const monthKey = window.getCurrentMonthId();
  const userGender = localStorage.getItem('athr_user_gender') || 'male';
  const myName = localStorage.getItem('athr_user_name');

  // بدون where على gender عشان نتفادى الحاجة لعمل composite index يدوي في Firebase Console
  if (window.unsubscribeLeaderboard) window.unsubscribeLeaderboard();
  const q = query(collection(db, "users_profiles"), orderBy(`monthlyPoints.${monthKey}`, "desc"), limit(50));
  window.unsubscribeLeaderboard = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('leaderboardList');
    if (!listArea) return;

    const medals = ['🥇','🥈','🥉'];
    let html = "";
    let rank = 0;
    snapshot.docs.forEach((docSnap) => {
      const u = docSnap.data();
      if (u.gender !== userGender) return;
      const monthlyPts = (u.monthlyPoints && u.monthlyPoints[monthKey]) || 0;
      if (monthlyPts <= 0) return;
      if (rank >= 10) return;
      const isMe = u.name === myName;
      html += `
        <div class="comm-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px; ${isMe ? 'border:1px solid var(--gold);' : ''}" onclick="window.openUserProfileCard('${u.name}')">
          <div style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <span style="font-size:18px;">${rank < 3 ? medals[rank] : `#${rank+1}`}</span>
            <img src="${u.avatar || 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/temporary-avatar.png'}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1px solid var(--gold);" />
            <strong style="color:${isMe ? 'var(--gold)' : 'var(--text)'}; font-size:14px;">${u.name}</strong>
          </div>
          <span style="color:var(--gold); font-weight:bold; font-size:13px;">${monthlyPts} نقطة</span>
        </div>`;
      rank++;
    });

    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center; font-size:13px;">لا يوجد نشاط مسجل بعد لهذا الشهر، ابدأ بالمشاركة لتتصدر اللوحة ✨</p></div>`;
  }, (err) => {
    console.error("leaderboard error:", err);
    const listArea = document.getElementById('leaderboardList');
    if (listArea) listArea.innerHTML = `<div class="comm-card"><p style="color:#ff6b6b; text-align:center; font-size:12px; direction:ltr;">${err.code}: ${err.message}</p></div>`;
  });
};

// =========================================================================
// 🎙️ 12️⃣ رسائل صوتية في مجلس الذكر الجماعي والمحادثات الخاصة
// =========================================================================
// ملحوظة: التسجيل بيتخزن كـ base64 جوه رسالة الفايرستور مباشرة (مفيش Firebase
// Storage متفعل في المشروع)، فالتسجيل بيتوقف تلقائياً بعد 15 ثانية عشان يفضل
// حجم الرسالة صغير وميضربش الحد الأقصى لحجم الوثيقة في Firestore (1 ميجا).
window.athrVoiceState = { recorder: null, chunks: [], context: null, stream: null, autoStopTimer: null };

window.toggleVoiceRecording = async function(context) {
  if (window.athrVoiceState.recorder && window.athrVoiceState.recorder.state === 'recording') {
    window.stopVoiceRecording();
    return;
  }
  await window.startVoiceRecording(context);
};

window.startVoiceRecording = async function(context) {
  const myName = localStorage.getItem('athr_user_name');
  if (!myName) { alert('🔒 برجاء تسجيل حسابك أولاً.'); return; }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('⚠️ المتصفح ده مش بيدعم تسجيل الصوت.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    window.athrVoiceState.stream = stream;
    window.athrVoiceState.context = context;
    window.athrVoiceState.chunks = [];

    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    window.athrVoiceState.recorder = recorder;

    recorder.ondataavailable = (e) => { if (e.data.size > 0) window.athrVoiceState.chunks.push(e.data); };
    recorder.onstop = () => window.handleVoiceRecordingStop(context);
    recorder.start();

    window.updateVoiceUI(context, true, 15);

    let secondsLeft = 15;
    window.athrVoiceState.autoStopTimer = setInterval(() => {
      secondsLeft--;
      window.updateVoiceUI(context, true, secondsLeft);
      if (secondsLeft <= 0) window.stopVoiceRecording();
    }, 1000);

  } catch (e) {
    console.error(e);
    alert('⚠️ لم نتمكن من الوصول للمايكروفون، تأكد من إعطاء الإذن.');
  }
};

window.stopVoiceRecording = function() {
  const st = window.athrVoiceState;
  if (st.autoStopTimer) { clearInterval(st.autoStopTimer); st.autoStopTimer = null; }
  if (st.recorder && st.recorder.state === 'recording') st.recorder.stop();
  if (st.stream) st.stream.getTracks().forEach(t => t.stop());
};

window.updateVoiceUI = function(context, recording, secondsLeft) {
  const btnId = context === 'private' ? 'privateVoiceBtn' : 'chatVoiceBtn';
  const statusId = context === 'private' ? 'privateVoiceStatus' : 'chatVoiceStatus';
  const btn = document.getElementById(btnId);
  const status = document.getElementById(statusId);
  if (btn) {
    btn.textContent = recording ? '⏹️' : '🎙️';
    btn.style.background = recording ? 'rgba(255,77,77,0.15)' : 'rgba(255,255,255,0.04)';
    btn.style.color = recording ? '#ff4d4d' : 'var(--gold)';
  }
  if (status) {
    status.style.display = recording ? 'block' : 'none';
    status.textContent = recording ? `🔴 جارِ التسجيل... (${secondsLeft} ث) اضغط ⏹️ للإيقاف والإرسال` : '';
  }
};

window.handleVoiceRecordingStop = async function(context) {
  window.updateVoiceUI(context, false, 0);
  const chunks = window.athrVoiceState.chunks;
  if (!chunks || chunks.length === 0) return;

  const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });

  // تحذير بسيط لو التسجيل كبير بشكل غير متوقع
  if (blob.size > 700000) {
    alert('⚠️ التسجيل طويل جداً، حاول تسجل رسالة أقصر.');
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Audio = e.target.result;
    if (context === 'group') {
      await window.sendGroupVoiceMessage(base64Audio);
    } else {
      await window.sendPrivateVoiceMessage(base64Audio);
    }
  };
  reader.readAsDataURL(blob);
};

window.sendGroupVoiceMessage = async function(base64Audio) {
  const myName = localStorage.getItem('athr_user_name');
  const userGender = localStorage.getItem('athr_user_gender');
  try {
    await addDoc(collection(db, "chats"), {
      name: myName,
      text: "",
      audioUrl: base64Audio,
      messageType: "audio",
      gender: userGender,
      createdAt: serverTimestamp()
    });
    window.awardPoints(myName, 1);
    window.updateUserStreak(myName);
  } catch (e) { console.error(e); alert('⚠️ حدث خطأ أثناء إرسال الرسالة الصوتية.'); }
};

window.sendPrivateVoiceMessage = async function(base64Audio) {
  const myName = localStorage.getItem('athr_user_name');
  if (!window.activePrivateRoomId) return;
  try {
    await addDoc(collection(db, "private_chats", window.activePrivateRoomId, "messages"), {
      sender: myName,
      text: "",
      audioUrl: base64Audio,
      messageType: "audio",
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, "chat_rooms", window.activePrivateRoomId), {
      participants: [myName, window.currentPrivateTargetUser],
      lastMessage: "🎙️ رسالة صوتية",
      lastSender: myName,
      lastSeenBy: [myName],
      updatedAt: serverTimestamp()
    }, { merge: true });
    window.updateUserStreak(myName);
  } catch (e) { console.error(e); alert('⚠️ حدث خطأ أثناء إرسال الرسالة الصوتية.'); }
};

// =========================================================================
// 🤲 13️⃣ نظام "اطلب دعاء" - طلبات دعاء مع خيار عدم إظهار الاسم
// =========================================================================
window.renderDuaTab = function() {
  const contentArea = document.getElementById('communityContent');
  const myName = localStorage.getItem('athr_user_name');

  contentArea.innerHTML = `
    ${window.getSharedTabsHTML('dua')}
    <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 10px; font-size: 14px; text-align: right; font-weight: bold;">🤲 اطلب دعاء من إخوانك</div>

    ${myName ? `
    <div class="comm-card" style="display:flex; gap:10px; flex-direction:column; margin-bottom:15px;">
      <textarea id="duaInput" placeholder="اكتب طلب الدعاء... (محتاج دعوة لظرف كذا)" style="width:100%; height:70px; background:transparent; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:10px; resize:none; outline:none; font-family:'Amiri',serif;"></textarea>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <label style="display:flex; align-items:center; gap:6px; color:var(--text2); font-size:12px; cursor:pointer;">
          <input type="checkbox" id="duaAnonCheck" />
          انشر بدون ظهور اسمي
        </label>
        <button onclick="window.sendDuaRequest()" style="background:var(--gold); color:#111; border:none; padding:8px 25px; border-radius:20px; font-weight:bold; cursor:pointer;">إرسال الطلب 🤲</button>
      </div>
    </div>` : `<p style="color:var(--text2); font-size:12px; text-align:center; margin-bottom:15px;">🔒 سجل حسابك لتتمكن من طلب الدعاء.</p>`}

    <div id="duaList" style="display:flex; flex-direction:column; gap:10px;">
      <div class="comm-card"><p style="color:var(--text2); text-align:center;">جاري تحميل طلبات الدعاء... ✨</p></div>
    </div>
  `;
  window.listenToDuaRequests();
};

window.sendDuaRequest = async function() {
  const input = document.getElementById('duaInput');
  const anonCheck = document.getElementById('duaAnonCheck');
  const myName = localStorage.getItem('athr_user_name');
  const userGender = localStorage.getItem('athr_user_gender');
  if (!input || !input.value.trim()) { alert('فضلاً، اكتب طلب الدعاء أولاً.'); return; }

  try {
    await addDoc(collection(db, "dua_requests"), {
      text: input.value.trim(),
      name: anonCheck && anonCheck.checked ? null : myName,
      isAnonymous: !!(anonCheck && anonCheck.checked),
      gender: userGender,
      prayedBy: [],
      createdAt: serverTimestamp()
    });
    input.value = "";
    if (anonCheck) anonCheck.checked = false;
    window.triggerSparksEffect();
  } catch (e) { console.error(e); alert('⚠️ حدث خطأ أثناء إرسال الطلب.'); }
};

window.listenToDuaRequests = function() {
  const userGender = localStorage.getItem('athr_user_gender') || 'male';
  const myName = localStorage.getItem('athr_user_name');
  const q = query(collection(db, "dua_requests"), orderBy("createdAt", "desc"), limit(40));

  if (window.unsubscribeDua) window.unsubscribeDua();
  window.unsubscribeDua = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('duaList');
    if (!listArea) return;
    let html = "";
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.gender !== userGender) return;
      const prayedArr = data.prayedBy || [];
      const hasPrayed = myName && prayedArr.includes(myName);
      const displayName = data.isAnonymous ? "أخ/أخت مجهول الهوية 🤍" : (data.name || "مجهول");

      html += `
        <div class="comm-card" style="text-align:right;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="color:var(--gold); font-size:13px;">${displayName}</strong>
            <small style="color:var(--text2); font-size:11px;">${data.createdAt ? window.formatPostTime(data.createdAt) : 'الآن'}</small>
          </div>
          <p style="color:var(--text); font-size:14px; font-family:'Amiri', serif; line-height:1.5; margin-bottom:10px; white-space:pre-wrap;">${data.text}</p>
          <div style="display:flex; gap:10px; margin-bottom:6px;">
            <button onclick="window.togglePrayForRequest('${docSnap.id}', ${hasPrayed})" style="background:${hasPrayed ? 'rgba(212,175,55,0.15)' : 'transparent'}; border:1px solid var(--gold); color:var(--gold); padding:6px 18px; border-radius:20px; font-size:13px; font-weight:bold; cursor:pointer;">
              🤲 دعيت لك (${prayedArr.length})
            </button>
            <button onclick="window.toggleCommentsSection('${docSnap.id}', 'dua_requests')" class="action-item-btn">💬 التعليقات</button>
          </div>

          <div id="commentsWrapper-${docSnap.id}" style="display:none; padding-top:10px;">
            <div id="commentsList-${docSnap.id}" style="max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:6px; margin-bottom:8px;"></div>
            <div style="display:flex; gap:6px;">
              <input id="commentInput-${docSnap.id}" type="text" placeholder="اكتب دعوة أو كلمة طيبة..." style="flex:1; padding:8px 12px; background:#000; border:1px solid var(--border); color:var(--text); border-radius:20px; font-size:13px; outline:none;" onkeypress="if(event.key==='Enter') window.sendComment('${docSnap.id}', 'dua_requests')" />
              <button onclick="window.sendComment('${docSnap.id}', 'dua_requests')" style="background:var(--gold); color:#111; border:none; padding:0 15px; border-radius:20px; font-size:13px; font-weight:bold; cursor:pointer;">إرسال</button>
            </div>
          </div>
        </div>`;
    });
    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center; font-size:13px;">لا توجد طلبات دعاء حالياً.</p></div>`;
  }, (err) => console.error("dua listen error:", err));
};

window.togglePrayForRequest = async function(docId, hasPrayed) {
  const myName = localStorage.getItem('athr_user_name');
  if (!myName) { alert('🔒 برجاء تسجيل الدخول أولاً.'); return; }
  try {
    const ref = doc(db, "dua_requests", docId);
    if (hasPrayed) { await updateDoc(ref, { prayedBy: arrayRemove(myName) }); }
    else { await updateDoc(ref, { prayedBy: arrayUnion(myName) }); window.awardPoints(myName, 1); }
  } catch (e) { console.error(e); }
};

// =========================================================================
// ✨ 14️⃣ أرشيف "الأكثر تأثيراً" - البوستات اللي وصلت لعدد تفاعل معين
// =========================================================================
window.ATHR_FEATURED_THRESHOLD = 15; // غيّرها لو حابب ترفع أو تقلل الحد المطلوب للظهور

window.renderFeaturedTab = function() {
  const contentArea = document.getElementById('communityContent');
  contentArea.innerHTML = `
    ${window.getSharedTabsHTML('featured')}
    <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 10px; font-size: 14px; text-align: right; font-weight: bold;">✨ أرشيف الفوائد الأكثر تأثيراً (${window.ATHR_FEATURED_THRESHOLD}+ تفاعل)</div>
    <div id="featuredList" style="display:flex; flex-direction:column; gap:10px;">
      <div class="comm-card"><p style="color:var(--text2); text-align:center;">جاري التحميل... ✨</p></div>
    </div>
  `;
  window.listenToFeaturedPosts();
};

window.listenToFeaturedPosts = function() {
  const userGender = localStorage.getItem('athr_user_gender') || 'male';
  const myName = localStorage.getItem('athr_user_name');
  // بدون where على gender عشان نتفادى الحاجة لـ composite index يدوي
  const q = query(collection(db, "posts"), orderBy("likesCount", "desc"), limit(40));

  if (window.unsubscribeFeatured) window.unsubscribeFeatured();
  window.unsubscribeFeatured = onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('featuredList');
    if (!listArea) return;
    let html = "";
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const likesCount = data.likesCount || (data.likes || []).length;
      if (data.gender !== userGender) return;
      if (likesCount < window.ATHR_FEATURED_THRESHOLD) return;

      const likesArr = data.likes || [];
      const hasLiked = myName && likesArr.includes(myName);
      let mediaHtml = "";
      if (data.mediaUrl && data.mediaType === 'image') {
        mediaHtml = `<img src="${data.mediaUrl}" onclick="window.openImageLightbox('${data.mediaUrl}')" style="width:100%; border-radius:8px; margin-top:10px; max-height:280px; object-fit:contain; background:#000; cursor:pointer;" />`;
      }

      html += `
        <div class="comm-card" style="border-right: 3px solid var(--gold); text-align: right;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong onclick="window.openUserProfileCard('${data.name}')" style="color:var(--gold); font-size:14px; cursor:pointer; text-decoration:underline;">✨ ${data.name}</strong>
            <small style="color:var(--text2); font-size:11px;">${data.createdAt ? window.formatPostTime(data.createdAt) : ''}</small>
          </div>
          ${data.text ? `<p style="color:var(--text); font-family:'Amiri', serif; font-size:15px; line-height:1.5; white-space:pre-wrap;">${data.text}</p>` : ''}
          ${mediaHtml}
          <div style="margin-top:10px; color:var(--gold); font-size:13px; font-weight:bold;">
            ${hasLiked ? '✨' : '🤍'} ${likesCount} تفاعل
          </div>
        </div>`;
    });
    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center; font-size:13px;">لسه مفيش بوستات وصلت للحد المطلوب من التفاعل.</p></div>`;
  }, (err) => {
    console.error("featured posts error:", err);
    const listArea = document.getElementById('featuredList');
    if (listArea) listArea.innerHTML = `<div class="comm-card"><p style="color:#ff6b6b; text-align:center; font-size:12px; direction:ltr;">${err.code}: ${err.message}</p></div>`;
  });
};
// =========================================================================
// 🏡 15️⃣ نظام "التنافس العائلي اللحظي" - التحديات المخصصة والديناميكية
// =========================================================================
let unsubscribeFamilyRoom = null;

window.renderFamilyChallengeTab = function() {
  const contentArea = document.getElementById('communityContent');
  const myName = localStorage.getItem('athr_user_name');
  const savedRoomCode = localStorage.getItem('athr_family_room_code');

  if (!myName) {
    contentArea.innerHTML = `${window.getSharedTabsHTML('family')}`;
    window.renderAuthRequiredBlock();
    return;
  }

  contentArea.innerHTML = `
    ${window.getSharedTabsHTML('family')}
    <div style="color: var(--gold); font-family: 'Amiri', serif; margin-bottom: 15px; font-size: 14px; text-align: right; font-weight: bold;">🏡 ميدان التنافس والترابط العائلي الإسلامي</div>
    <div id="familyMainDashboard">
      <div class="comm-card" style="text-align:center;"><p style="color:var(--text2);">جاري فحص اتصال الغرفة العائلية... ✨</p></div>
    </div>
  `;

  if (savedRoomCode) {
    window.listenToFamilyRoom(savedRoomCode);
  } else {
    window.renderFamilySetupScreen();
  }
};

window.renderFamilySetupScreen = function() {
  const dashboard = document.getElementById('familyMainDashboard');
  if (!dashboard) return;

  dashboard.innerHTML = `
    <div class="comm-card" style="text-align: right; padding: 25px 15px; border: 1px dashed var(--gold);">
      <h4 style="color:var(--gold); margin-bottom:10px;">🌟 أنشئ غرفة لطاعات عائلتك الحين</h4>
      <p style="color:var(--text2); font-size:12px; margin-bottom:15px; line-height:1.6;">
        يمكنك تأسيس حلقة تنافسية مغلقة تجمع أهل بيتك لمتابعة الأذكار والورد القرآني، وإضافة تحديات مخصصة ومبتكرة للبيت كله مع لوحة صدارة حية!
      </p>
      <button onclick="window.createNewFamilyRoom()" id="createFamilyBtn" style="width:100%; background:var(--gold); color:#111; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-family:'Amiri', serif;">➕ إنشاء غرفة عائلية وتوليد كود الدعوة</button>
      
      <div style="border-top:1px solid var(--border); margin:20px 0; position:relative; text-align:center;">
        <span style="position:absolute; top:-10px; background:#0b0f0b; padding:0 10px; color:var(--text2); font-size:11px; left:45%;">أو</span>
      </div>

      <h4 style="color:var(--gold); margin-bottom:10px;">🔑 انضمام لغرفة عائلتك عبر الكود</h4>
      <p style="color:var(--text2); font-size:12px; margin-bottom:12px;">إذا أرسل لك أحد أفراد عائلتك رمز الدخول، أدخله هنا لتنضم للمنافسة فوراً.</p>
      <div style="display:flex; gap:8px;">
        <input id="familyCodeInp" type="text" placeholder="A79X" style="flex:1; padding:12px; background:#000; border:1px solid var(--border); color:var(--text); border-radius:8px; outline:none; text-align:center; font-weight:bold; text-transform:uppercase;" />
        <button onclick="window.joinFamilyRoomViaCode()" id="joinFamilyBtn" style="background:transparent; color:var(--gold); border:1px solid var(--gold); padding:0 25px; border-radius:8px; font-weight:bold; cursor:pointer; font-family:'Amiri', serif;">دخول 🔑</button>
      </div>
    </div>
  `;
};

window.createNewFamilyRoom = async function() {
  const myName = localStorage.getItem('athr_user_name');
  const btn = document.getElementById('createFamilyBtn');
  btn.disabled = true; btn.textContent = "جاري تأمين الغرفة... ⏳";

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let roomCode = "";
  for (let i = 0; i < 4; i++) roomCode += chars.charAt(Math.floor(Math.random() * chars.length));

  try {
    const roomRef = doc(db, "family_rooms", roomCode);
    const initialMembers = {};
    initialMembers[myName] = {
      name: myName,
      wirdCount: 0,
      azkarCount: 0,
      customChallenges: {}, // حفظ تكرار التحديات المخصصة لكل عضو
      score: 0,
      lastUpdated: new Date().toISOString()
    };

    await setDoc(roomRef, {
      roomCode: roomCode,
      creator: myName,
      createdAt: serverTimestamp(),
      members: initialMembers,
      customChallengeList: [] // قائمة أسماء التحديات المضافة في الغرفة
    });

    localStorage.setItem('athr_family_room_code', roomCode);
    window.listenToFamilyRoom(roomCode);
  } catch(e) {
    console.error(e);
    alert("فشل إنشاء الغرفة، يرجى المحاولة مرة أخرى.");
    btn.disabled = false;
  }
};

window.joinFamilyRoomViaCode = async function() {
  const codeInp = document.getElementById('familyCodeInp');
  if(!codeInp || !codeInp.value.trim()) { alert("يرجى كتابة الكود أولاً."); return; }
  const code = codeInp.value.trim().toUpperCase();
  const myName = localStorage.getItem('athr_user_name');
  const btn = document.getElementById('joinFamilyBtn');

  try {
    btn.disabled = true;
    const roomRef = doc(db, "family_rooms", code);
    const snap = await getDoc(roomRef);

    if(!snap.exists()) {
      alert("⚠️ كود غير صحيح.");
      btn.disabled = false;
      return;
    }

    await updateDoc(roomRef, {
      [`members.${myName}`]: {
        name: myName,
        wirdCount: 0,
        azkarCount: 0,
        customChallenges: {},
        score: 0,
        lastUpdated: new Date().toISOString()
      }
    });

    localStorage.setItem('athr_family_room_code', code);
    window.listenToFamilyRoom(code);
  } catch(e) {
    console.error(e);
    btn.disabled = false;
  }
};

window.listenToFamilyRoom = function(roomCode) {
  if (unsubscribeFamilyRoom) unsubscribeFamilyRoom();
  const myName = localStorage.getItem('athr_user_name');

  unsubscribeFamilyRoom = onSnapshot(doc(db, "family_rooms", roomCode), (snap) => {
    const dashboard = document.getElementById('familyMainDashboard');
    if (!dashboard || !snap.exists()) return;

    const data = snap.data();
    const membersObj = data.members || {};
    const customChallengeList = data.customChallengeList || [];
    
    const sortedMembers = Object.values(membersObj).sort((a, b) => (b.score || 0) - (a.score || 0));
    const myData = membersObj[myName] || { wirdCount: 0, azkarCount: 0, customChallenges: {}, score: 0 };

    let membersHtml = "";
    const medals = ['🥇', '🥈', '🥉'];
    
    sortedMembers.forEach((m, index) => {
      const rankBadge = index < 3 ? medals[index] : `#${index + 1}`;
      const isCurrentMe = m.name === myName;
      
      // بناء تفاصيل الطاعات المخصصة لكل فرد في الكارت بتاعه
      let customDetailsHtml = "";
      customChallengeList.forEach(chName => {
        const count = (m.customChallenges && m.customChallenges[chName]) || 0;
        if(count > 0) {
          customDetailsHtml += ` | ${chName}: <span style="color:var(--gold); font-weight:bold;">${count} مرّة</span>`;
        }
      });

      membersHtml += `
        <div class="comm-card" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:${isCurrentMe ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)'}; border:${isCurrentMe ? '1px solid var(--gold)' : '1px solid var(--border)'}; margin-bottom:8px; text-align:right;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:18px;">${rankBadge}</span>
            <div>
              <strong style="color:${isCurrentMe ? 'var(--gold)' : 'var(--text)'}; font-size:14px;">${m.name} ${isCurrentMe ? '(أنت)' : ''}</strong>
              <div style="font-size:11px; color:var(--text2); margin-top:4px; line-height:1.5;">
                📖 الورد: <span style="color:var(--text); font-weight:bold;">${m.wirdCount || 0} صفحة</span> | 
                📿 الأذكار: <span style="color:var(--text); font-weight:bold;">${m.azkarCount || 0} مرّة</span>${customDetailsHtml}
              </div>
            </div>
          </div>
          <div style="text-align:center; background:rgba(212,175,55,0.1); border-radius:8px; padding:6px 12px; border:1px solid rgba(212,175,55,0.2);">
            <div style="font-size:10px; color:var(--text2);">النقاط</div>
            <div style="color:var(--gold); font-weight:bold; font-size:15px;">${m.score || 0}</div>
          </div>
        </div>
      `;
    });

    // بناء واجهة الأزرار للتحديات المخصصة ديناميكياً وعرضها تحت الأذكار والورد
    let customInputsHtml = "";
    customChallengeList.forEach(chName => {
      const currentChCount = (myData.customChallenges && myData.customChallenges[chName]) || 0;
      customInputsHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--border); padding-top:10px;">
          <span style="color:var(--text); font-size:13px;">🎯 تحدي: ${chName}</span>
          <div style="display:flex; align-items:center; gap:6px;">
            <button onclick="window.updateCustomChallengeStat('${chName}')" style="background:var(--card); border:1px solid var(--gold); color:var(--gold); width:32px; height:32px; border-radius:50%; font-weight:bold; cursor:pointer;">+</button>
            <strong style="color:var(--gold); font-size:14px; min-width:20px; text-align:center;">${currentChCount}</strong>
          </div>
        </div>
      `;
    });

    dashboard.innerHTML = `
      <div class="comm-card" style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; border-right:4px solid var(--gold); background:rgba(212,175,55,0.02); margin-bottom:15px; text-align:right;">
        <div>
          <span style="color:var(--text2); font-size:11px; display:block;">انقل الكود لأفراد العائلة للدخول معاً:</span>
          <strong style="color:var(--gold); font-size:18px; font-family:'monospace'; letter-spacing:2px; display:block; margin-top:2px;">🔑 ${roomCode}</strong>
        </div>
        <button onclick="window.exitFamilyRoom()" style="background:transparent; color:#ff4d4d; border:1px solid #ff4d4d; padding:5px 12px; border-radius:20px; font-size:11px; cursor:pointer; font-family:'Amiri', serif;">🚪 مغادرة الغرفة</button>
      </div>

      <div style="color:var(--text); font-size:13px; font-weight:bold; text-align:right; margin-bottom:8px;">🏆 لوحة ترتيب أفراد البيت اللحظية:</div>
      <div style="margin-bottom:20px;">${membersHtml}</div>

      <div style="color:var(--gold); font-size:13px; font-weight:bold; text-align:right; margin-bottom:8px;">🎯 لوحة طاعاتك الفورية اليوم:</div>
      <div class="comm-card" style="display:flex; flex-direction:column; gap:12px; text-align:right; margin-bottom:15px;">
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="color:var(--text); font-size:13px;">📖 قرأت من الورد القرآني اليوم:</span>
          <div style="display:flex; align-items:center; gap:6px;">
            <button onclick="window.updateFamilyStat('wird', 1)" style="background:var(--card); border:1px solid var(--border); color:var(--text); width:32px; height:32px; border-radius:50%; font-weight:bold; cursor:pointer;">+</button>
            <strong style="color:var(--gold); font-size:14px; min-width:20px; text-align:center;">${myData.wirdCount || 0}</strong>
            <span style="color:var(--text2); font-size:11px;">صفحة</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--border); padding-top:10px;">
          <span style="color:var(--text); font-size:13px;">📿 رددت من الأذكار والتهليل والتسبيح اليوم:</span>
          <div style="display:flex; align-items:center; gap:6px;">
            <button onclick="window.updateFamilyStat('azkar', 10)" style="background:var(--card); border:1px solid var(--border); color:var(--text); padding:0 10px; height:32px; border-radius:16px; font-size:12px; cursor:pointer;">+10 تسبيحات</button>
            <strong style="color:var(--gold); font-size:14px; min-width:30px; text-align:center;">${myData.azkarCount || 0}</strong>
          </div>
        </div>

        <!-- حقن قائمة التحديات المضافة ديناميكياً هنا -->
        ${customInputsHtml}

      </div>

      <!-- خانة إضافة تحدي جديد للغرفة -->
      <div class="comm-card" style="text-align:right; border:1px dashed var(--border); background:rgba(255,255,255,0.01);">
        <label style="color:var(--gold); display:block; margin-bottom:6px; font-size:13px; font-weight:bold;">➕ ابتكار تحدي عائلي جديد ومخصص لمجموعتكم:</label>
        <div style="display:flex; gap:6px;">
          <input id="newCustomChallengeInp" type="text" placeholder="مثال: صلاة الضحى، بر الوالدين، صدقة..." style="flex:1; padding:10px; background:#000; border:1px solid var(--border); color:var(--text); border-radius:6px; outline:none; font-family:'Amiri', serif; font-size:13px;" />
          <button onclick="window.addNewCustomChallengeToRoom()" style="background:var(--gold); color:#111; border:none; padding:0 15px; border-radius:6px; font-size:13px; font-weight:bold; cursor:pointer; font-family:'Amiri', serif;">إضافة تحدي 🚀</button>
        </div>
      </div>
    `;
  });
};

// دالة إضافة اسم التحدي الجديد في الـ Array السيرفري للغرفة
window.addNewCustomChallengeToRoom = async function() {
  const inp = document.getElementById('newCustomChallengeInp');
  if(!inp || !inp.value.trim()) return;
  const challengeName = inp.value.trim();

  const roomCode = localStorage.getItem('athr_family_room_code');
  if(!roomCode) return;

  try {
    const roomRef = doc(db, "family_rooms", roomCode);
    await updateDoc(roomRef, {
      customChallengeList: arrayUnion(challengeName)
    });
    window.triggerSparksEffect();
  } catch(e) { console.error(e); }
};

// دالة زيادة عدد مرات التحدي المخصص وضخ 10 نقاط للمستخدم تلقائياً
window.updateCustomChallengeStat = async function(challengeName) {
  const roomCode = localStorage.getItem('athr_family_room_code');
  const myName = localStorage.getItem('athr_user_name');
  if(!roomCode || !myName) return;

  const roomRef = doc(db, "family_rooms", roomCode);
  
  try {
    await updateDoc(roomRef, {
      [`members.${myName}.customChallenges.${challengeName}`]: increment(1),
      [`members.${myName}.score`]: increment(10), // 10 نقاط لكل تحدي مخصص
      [`members.${myName}.lastUpdated`]: new Date().toISOString()
    });
    window.awardPoints(myName, 2); // نقاط للبروفايل العام
    window.createFloatingEmoji(null, '✨');
  } catch(e) { console.error(e); }
};

window.updateFamilyStat = async function(type, incrementValue) {
  const roomCode = localStorage.getItem('athr_family_room_code');
  const myName = localStorage.getItem('athr_user_name');
  if(!roomCode || !myName) return;

  const roomRef = doc(db, "family_rooms", roomCode);
  try {
    const addedScore = type === 'wird' ? (incrementValue * 5) : (incrementValue * 0.5);
    await updateDoc(roomRef, {
      [`members.${myName}.${type}Count`]: increment(incrementValue),
      [`members.${myName}.score`]: increment(addedScore),
      [`members.${myName}.lastUpdated`]: new Date().toISOString()
    });
    window.awardPoints(myName, type === 'wird' ? 1 : 0.5);
  } catch(e) { console.error(e); }
};

window.exitFamilyRoom = function() {
  if(!confirm("هل تود الخروج من هذه الغرفة العائلية؟")) return;
  if(unsubscribeFamilyRoom) unsubscribeFamilyRoom();
  localStorage.removeItem('athr_family_room_code');
  window.renderFamilyChallengeTab();
};
