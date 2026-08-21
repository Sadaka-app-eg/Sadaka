// =========================================================================
// 👑 لوحة تحكم المشرف العامة - تطبيق أثر (Admin Dashboard)
// =========================================================================

// 🔒 اكتب إيميلك هنا (الذي تسجل به الدخول بجوجل)
window.ADMIN_EMAILS = [
  "ahmedmohamedhosny100@gmail.com" // 👈 غيّر هذا لإيميلك الحقيقي المسجل في جوجل
];

// دالة فحص هل المستخدم الحالي هو المشرف
window.isAdminUser = function() {
  const userEmail = localStorage.getItem('user_email');
  if (!userEmail) return false;
  return window.ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail.toLowerCase());
};

// 1. فتح نافذة لوحة التحكم
window.openAdminDashboardModal = async function() {
  if (!window.isAdminUser()) {
    alert("⛔ هذه اللوحة مخصصة لإدارة المنصة فقط!");
    return;
  }

  let modal = document.getElementById('athrAdminDashboardModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'athrAdminDashboardModal';
    modal.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.92); backdrop-filter:blur(10px); z-index:10000000; display:flex; align-items:center; justify-content:center; padding:15px; direction:rtl; font-family:'Amiri', serif;";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="width:100%; max-width:900px; height:90vh; background:#0c130e; border:1px solid var(--gold, #d4af37); border-radius:20px; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.9); overflow:hidden;">
      
      <!-- الهيدر -->
      <div style="padding:15px 20px; background:#121e14; border-bottom:1px solid var(--border, #222); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">👑</span>
          <div>
            <strong style="color:var(--gold, #d4af37); font-size:18px;">لوحة الإدارة الشاملة (أثر)</strong>
            <div style="font-size:11px; color:var(--text2, #888);">التحكم السحابي في المحتوى والمستخدمين</div>
          </div>
        </div>
        <button onclick="document.getElementById('athrAdminDashboardModal').remove()" style="background:rgba(255,77,77,0.2); border:1px solid #ff4d4d; color:#ff4d4d; border-radius:50%; width:32px; height:32px; font-weight:bold; cursor:pointer;">✕</button>
      </div>

      <!-- تبويبات اللوحة -->
      <div style="display:flex; background:#080d09; border-bottom:1px solid var(--border, #222);">
        <button class="admin-tab-btn active" id="admTab_users" onclick="window.switchAdminTab('users')" style="flex:1; padding:12px; border:none; background:rgba(212,175,55,0.15); color:var(--gold, #d4af37); font-weight:bold; cursor:pointer; font-family:inherit; border-bottom:2px solid var(--gold, #d4af37);">👥 المستخدمين وتواريخ الدخول</button>
        <button class="admin-tab-btn" id="admTab_lectures" onclick="window.switchAdminTab('lectures')" style="flex:1; padding:12px; border:none; background:transparent; color:var(--text2, #888); font-weight:bold; cursor:pointer; font-family:inherit;">🎙️ الدروس والمواعظ</button>
        <button class="admin-tab-btn" id="admTab_recitations" onclick="window.switchAdminTab('recitations')" style="flex:1; padding:12px; border:none; background:transparent; color:var(--text2, #888); font-weight:bold; cursor:pointer; font-family:inherit;">🎧 تلاوات خاشعة</button>
      </div>

      <!-- محتوى التبويبات -->
      <div id="adminTabContent" style="flex:1; overflow-y:auto; padding:20px; color:var(--text, #fff);">
        <div style="text-align:center; padding:40px; color:var(--gold);">⏳ جاري تحميل بيانات المنصة...</div>
      </div>

    </div>
  `;

  modal.style.display = 'flex';
  window.switchAdminTab('users');
};

// 2. التنقل بين التبويبات
window.switchAdminTab = function(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.style.background = 'transparent';
    btn.style.color = 'var(--text2, #888)';
    btn.style.borderBottom = 'none';
  });

  const activeBtn = document.getElementById(`admTab_${tabName}`);
  if (activeBtn) {
    activeBtn.style.background = 'rgba(212,175,55,0.15)';
    activeBtn.style.color = 'var(--gold, #d4af37)';
    activeBtn.style.borderBottom = '2px solid var(--gold, #d4af37)';
  }

  const content = document.getElementById('adminTabContent');
  if (!content) return;

  if (tabName === 'users') window.renderAdminUsersList(content);
  if (tabName === 'lectures') window.renderAdminLecturesList(content);
  if (tabName === 'recitations') window.renderAdminRecitationsList(content);
};

// 3. قسم المستخدمين وتواريخ الدخول
window.renderAdminUsersList = async function(container) {
  container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--gold);">⏳ جاري جلب سجل المستخدمين من Firestore...</div>`;
  
  try {
    const firestoreDb = window.firebaseDb || window.db;
    if (!firestoreDb) throw new Error("Firestore غير مهيأ");

    const usersSnap = await window.getDocs(window.collection(firestoreDb, "users"));
    let usersList = [];
    
    usersSnap.forEach(docSnap => {
      usersList.push({ id: docSnap.id, ...docSnap.data() });
    });

    // ترتيب المستخدمين من الأحدث دخولا
    usersList.sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0));

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <span style="font-size:16px; color:var(--gold);">📊 إجمالي المسجلين: <b>${usersList.length}</b> مستخدم</span>
        <button onclick="window.renderAdminUsersList(document.getElementById('adminTabContent'))" style="background:transparent; border:1px solid var(--border); color:var(--gold); padding:6px 12px; border-radius:8px; cursor:pointer;">🔄 تحديث السجل</button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:right; font-size:13px;">
          <thead>
            <tr style="background:#162419; color:var(--gold); border-bottom:2px solid var(--border);">
              <th style="padding:10px;">#</th>
              <th style="padding:10px;">الاسم</th>
              <th style="padding:10px;">حساب Google</th>
              <th style="padding:10px;">آخر ظهور (Last Seen)</th>
            </tr>
          </thead>
          <tbody>
    `;

    usersList.forEach((u, i) => {
      const lastDate = u.lastSeen ? new Date(u.lastSeen).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : 'غير محدد';
      html += `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05); background:${i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'};">
          <td style="padding:10px; color:var(--text2);">${i + 1}</td>
          <td style="padding:10px; font-weight:bold; color:var(--text);">${u.name || 'مستخدم بدون اسم'}</td>
          <td style="padding:10px; color:#40a9ff; direction:ltr; text-align:right;">${u.email || '—'}</td>
          <td style="padding:10px; color:var(--green, #6fbf73); font-family:sans-serif; font-size:11.5px;">${lastDate}</td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;

  } catch (err) {
    console.error("Admin users load error:", err);
    container.innerHTML = `<div style="color:#ff4d4d; text-align:center; padding:20px;">⚠️ تعذر جلب المستخدمين: ${err.message}</div>`;
  }
};

// 4. قسم الدروس والمواعظ
window.renderAdminLecturesList = function(container) {
  const customList = window.cloudLecturesList || [];
  
  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
      <span style="font-size:15px; color:var(--gold);">🎙️ الدروس المرفوعة سحابياً: <b>${customList.length}</b></span>
      <button onclick="window.openAddLectureModal()" style="background:var(--gold); color:#111; border:none; padding:8px 16px; border-radius:10px; font-weight:bold; cursor:pointer;">➕ إضافة سلسلة جديدة</button>
    </div>
  `;

  if (customList.length === 0) {
    html += `<div style="text-align:center; padding:30px; color:var(--text2);">لا توجد سلاسل أو دروس مضافة سحابياً بعد.</div>`;
  } else {
    html += `<div style="display:grid; gap:10px;">`;
    customList.forEach(item => {
      html += `
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:var(--gold); font-size:14px; display:block;">${item.title}</strong>
            <span style="color:var(--text2); font-size:12px;">📁 ${item.category} • بواسطة: ${item.addedBy || 'أحد الأعضاء'}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button onclick="window.openLectureNowPlaying('${item.src}')" style="background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); padding:6px 12px; border-radius:8px; cursor:pointer;">▶ تشغيل</button>
            <button onclick="window.deleteCloudLectureCategory('${item.category}')" style="background:rgba(255,77,77,0.15); border:1px solid #ff4d4d; color:#ff4d4d; padding:6px 12px; border-radius:8px; cursor:pointer;">🗑️ حذف</button>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
};

// 5. قسم التلاوات الخاشعة
window.renderAdminRecitationsList = function(container) {
  container.innerHTML = `
    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:14px; padding:15px; margin-bottom:15px;">
      <h4 style="color:var(--gold); margin:0 0 10px 0;">➕ إضافة تلاوة خاشعة سريعة للمنصة</h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <input id="admRecitTitle" type="text" placeholder="عنوان التلاوة (مثال: سورة مريم خاشعة باكية)" style="padding:10px; background:#000; border:1px solid var(--border); color:#fff; border-radius:8px;" />
        <input id="admRecitSheikh" type="text" placeholder="اسم القارئ (مثال: الشيخ عبد الباسط)" style="padding:10px; background:#000; border:1px solid var(--border); color:#fff; border-radius:8px;" />
        <input id="admRecitUrl" type="url" placeholder="رابط يوتيوب أو MP3 مباشر" style="padding:10px; background:#000; border:1px solid var(--border); color:#fff; border-radius:8px;" />
        <button onclick="window.handleAdminAddRecitation()" style="background:var(--gold); color:#111; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer;">🚀 نشر التلاوة الآن للجميع</button>
      </div>
    </div>
  `;
};

// دالة نشر التلاوة بواسطة المشرف
window.handleAdminAddRecitation = async function() {
  const title = document.getElementById('admRecitTitle').value.trim();
  const sheikh = document.getElementById('admRecitSheikh').value.trim();
  const url = document.getElementById('admRecitUrl').value.trim();

  if (!title || !url) {
    alert("⚠️ يرجى كتابة العنوان والرابط.");
    return;
  }

  const ytId = window.getYoutubeId ? window.getYoutubeId(url) : null;
  const avatar = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "image/mwa.png";

  try {
    const firestoreDb = window.firebaseDb || window.db;
    await window.addDoc(window.collection(firestoreDb, "custom_lectures"), {
      category: "تلاوات خاشعة",
      title: `${title} - ${sheikh}`,
      src: url,
      type: ytId ? "youtube" : "audio",
      avatar: avatar,
      sheikh: sheikh || "قارئ",
      desc: "تلاوة مضافة من الإدارة",
      addedBy: "الإدارة 👑",
      addedAt: new Date()
    });

    alert("✅ تم نشر التلاوة بنجاح في المنصة!");
    document.getElementById('admRecitTitle').value = '';
    document.getElementById('admRecitUrl').value = '';
  } catch(e) {
    alert("⚠️ حدث خطأ: " + e.message);
  }
};
