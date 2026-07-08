// =========================================================================
// 🚀 شبكة مجتمع أثر الاجتماعية الإسلامية المتكاملة - إصدار 2026 المطور (نسخة مصححة الميديا)
// =========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, getDoc, setDoc, arrayUnion, arrayRemove, onSnapshot, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 
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

const IMGBB_API_KEY = "69ba2eb5653068e3a24c568ec75d1f87";
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

      <div id="femaleCodeContainer" style="display: none; margin-bottom: 25px; text-align: right;">
        <label style="color: var(--gold); display: block; margin-bottom: 6px; font-size: 14px;">⚠️ كود تفعيل مجلس الأخوات الموحد:</label>
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
      <div class="community-tabs" style="margin-bottom: 15px;">
        <button id="tabFeedBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
        <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
        <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
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
      <div class="community-tabs" style="margin-bottom: 15px;">
        <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
        <button id="tabChatBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
        <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
        <button id="tabPrivateBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('private')">📥 الرسائل الخاصة</button>
      </div>

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

  } else if (window.currentCommunityTab === 'fajr') {
    contentArea.innerHTML = `
      <div class="community-tabs" style="margin-bottom: 15px;">
        <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
        <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
        <button id="tabFajrBtn" class="comm-tab-btn active" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
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

  } else if (window.currentCommunityTab === 'private') {
    window.renderPrivateChatDashboard();
  }
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

window.awardPoints = async function(userName, amount) {
  try {
    const userRef = doc(db, "users_profiles", userName);
    const snap = await getDoc(userRef);
    if(snap.exists()) {
      const currentPts = snap.data().points || 0;
      await updateDoc(userRef, { points: currentPts + amount });
    }
  } catch(e) { console.error(e); }
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
      const formData = new FormData();
      formData.append("image", selectedMediaFile);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const resData = await response.json();
      if (resData.success) { mediaUrl = resData.data.url; mediaType = "image"; }
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
          mediaHtml = `<img src="${data.mediaUrl}" style="width:100%; border-radius:8px; margin-top:10px; max-height:300px; object-fit:contain; background:#000;" />`;
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
        
        // إصلاح تحديث الصورة الحقيقية للكاتب بداخل الـ Feed
        getDoc(doc(db, "users_profiles", data.name)).then(userDoc => {
          if (userDoc.exists()) {
            const uData = userDoc.data();
            const avatarImg = document.getElementById(`avatar-post-${docId}`);
            const nameTxt = document.getElementById(`name-post-${docId}`);
            
            if (uData.avatar && avatarImg) avatarImg.src = uData.avatar;
            if (nameTxt && typeof window.getUserNameClassAndStyle === 'function') {
              const styleInfo = window.getUserNameClassAndStyle(uData.points);
              nameTxt.className = styleInfo.class;
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
    if (hasLiked) { await updateDoc(postRef, { likes: arrayRemove(myName) }); } 
    else { await updateDoc(postRef, { likes: arrayUnion(myName) }); window.awardPoints(myName, 2); }
  } catch (e) { console.error(e); }
};

// =========================================================
// 💬 4️⃣ نظام تشغيل وإدارة التعليقات الحية (Comments)
// =========================================================
window.toggleCommentsSection = function(docId) {
  const wrapper = document.getElementById(`commentsWrapper-${docId}`);
  if (!wrapper) return;
  if (wrapper.style.display === "none") { wrapper.style.display = "block"; window.listenToComments(docId); } 
  else { wrapper.style.display = "none"; }
};

window.sendComment = async function(docId) {
  const input = document.getElementById(`commentInput-${docId}`);
  const myName = localStorage.getItem('athr_user_name');
  if(!myName) { alert("🔒 برجاء تسجيل الدخول أولاً للتعليق."); return; }
  if (!input || !input.value.trim()) return;

  try {
    await addDoc(collection(db, "posts", docId, "comments"), {
      name: myName,
      text: input.value.trim(),
      createdAt: serverTimestamp()
    });
    input.value = ""; 
    window.awardPoints(myName, 3); 
  } catch (e) { console.error(e); }
};

window.listenToComments = function(docId) {
  const q = query(collection(db, "posts", docId, "comments"), orderBy("createdAt", "asc"));
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
        html += `
          <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}; padding: 8px 14px; border-radius: 12px; max-width: 85%; text-align: right; margin-bottom: 5px;">
            <span onclick="window.openUserProfileCard('${data.name}')" style="display:block; font-size:11px; color:var(--gold); font-weight:bold; margin-bottom:2px; cursor:pointer; text-decoration:underline;">
              <span class="online-dot"></span>${data.name}
            </span>
            <span style="color:var(--text); font-size:14px;">${data.text}</span>
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
    <div class="community-tabs" style="margin-bottom: 15px;">
      <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
      <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
      <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
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

      <div style="display:flex; gap:6px; align-items:center;">
        <label style="background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:10px; border-radius:50%; cursor:pointer; font-size:16px; width:42px; height:42px; display:flex; align-items:center; justify-content:center;">
          🖼️
          <input type="file" id="privateChatMediaInput" accept="image/*" style="display:none;" onchange="window.handlePrivateChatMediaSelection(this)" />
        </label>
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
    <div class="community-tabs" style="margin-bottom: 15px;">
      <button id="tabFeedBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('feed')">📝 ساحة الأثر</button>
      <button id="tabChatBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('chat')">💬 مجلس الذكر</button>
      <button id="tabFajrBtn" class="comm-tab-btn" onclick="window.switchCommunityTab('fajr')">🕌 استيقاظ الفجر</button>
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
        mediaHtml = `<img src="${data.mediaUrl}" style="max-width:100%; border-radius:8px; margin-top:5px; max-height:150px; display:block;" />`;
      }

      html += `
        <div style="align-self: ${isMe ? 'flex-start' : 'flex-end'}; background: ${isMe ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}; padding: 8px 14px; border-radius: 12px; max-width: 80%; text-align: right;">
          <span style="display:block; font-size:10px; color:var(--text2); margin-bottom:2px;">${data.sender}</span>
          ${data.text ? `<span style="color:var(--text); font-size:13px;">${data.text}</span>` : ''}
          ${mediaHtml}
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

window.listenToFajrList = function(gender) {
  const q = query(collection(db, "fajr_list"), orderBy("createdAt", "desc"), limit(40));
  onSnapshot(q, (snapshot) => {
    const listArea = document.getElementById('fajrUsersList');
    if (!listArea) return;
    let html = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.gender === gender) {
        html += `
          <div class="comm-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px; background:rgba(255,255,255,0.02);">
            <div style="text-align:right;">
              <strong onclick="window.openUserProfileCard('${data.name}')" style="color:var(--text); font-size:14px; cursor:pointer; text-decoration:underline;">✨ ${data.name}</strong>
              <span style="display:block; color:var(--text2); font-size:12px; direction:ltr;">${data.phone}</span>
            </div>
            <a href="tel:${data.phone}" onclick="window.createFloatingEmoji(event, '📞')" style="background:var(--gold); color:#111; text-decoration:none; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:bold;">📞 اتصل الآن</a>
          </div>`;
      }
    });
    listArea.innerHTML = html || `<div class="comm-card"><p style="color:var(--text2); text-align:center; font-size:12px;">لا توجد أسماء مسجلة حالياً.</p></div>`;
  });
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
