// =========================================================================
// 👑 لوحة تحكم المشرف الشاملة - تطبيق أثر (الإصدار المحترف 2026)
// =========================================================================

window.ADMIN_EMAILS = [
  "ahmedmohamedhosny100@gmail.com" // 👈 غيّر هذا لإيميلك المسجل في جوجل
];

window.isAdminUser = function() {
  const userEmail = localStorage.getItem('user_email');
  if (!userEmail) return false;
  return window.ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail.toLowerCase());
};

// 1. فتح المودال الرئيسي
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
    <div style="width:100%; max-width:960px; height:90vh; background:#0c130e; border:1px solid var(--gold, #d4af37); border-radius:20px; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.9); overflow:hidden;">
      
      <!-- الهيدر -->
      <div style="padding:15px 20px; background:#121e14; border-bottom:1px solid var(--border, #222); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">👑</span>
          <div>
            <strong style="color:var(--gold, #d4af37); font-size:18px;">لوحة الإدارة الشاملة (أثر)</strong>
            <div style="font-size:11px; color:var(--text2, #888);">التحكم المباشر في جميع المستخدمين، الدروس، والتلاوات</div>
          </div>
        </div>
        <button onclick="document.getElementById('athrAdminDashboardModal').remove()" style="background:rgba(255,77,77,0.2); border:1px solid #ff4d4d; color:#ff4d4d; border-radius:50%; width:32px; height:32px; font-weight:bold; cursor:pointer;">✕</button>
      </div>

      <!-- تبويبات اللوحة -->
      <div style="display:flex; background:#080d09; border-bottom:1px solid var(--border, #222);">
        <button class="admin-tab-btn active" id="admTab_users" onclick="window.switchAdminTab('users')" style="flex:1; padding:12px; border:none; background:rgba(212,175,55,0.15); color:var(--gold, #d4af37); font-weight:bold; cursor:pointer; font-family:inherit; border-bottom:2px solid var(--gold, #d4af37);">👥 المستخدمين وتواريخ الدخول</button>
        <button class="admin-tab-btn" id="admTab_lectures" onclick="window.switchAdminTab('lectures')" style="flex:1; padding:12px; border:none; background:transparent; color:var(--text2, #888); font-weight:bold; cursor:pointer; font-family:inherit;">🎙️ الدروس والمواعظ الشاملة</button>
        <button class="admin-tab-btn" id="admTab_recitations" onclick="window.switchAdminTab('recitations')" style="flex:1; padding:12px; border:none; background:transparent; color:var(--text2, #888); font-weight:bold; cursor:pointer; font-family:inherit;">🎧 تلاوات خاشعة</button>
      </div>

      <!-- محتوى التبويبات -->
      <div id="adminTabContent" style="flex:1; overflow-y:auto; padding:20px; color:var(--text, #fff);">
        <div style="text-align:center; padding:40px; color:var(--gold);">⏳ جاري التحميل...</div>
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

// 3. جدول المستخدمين المصلح
window.renderAdminUsersList = async function(container) {
  container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--gold);">⏳ جاري جلب سجل المستخدمين من Firestore...</div>`;
  
  try {
    const firestoreDb = window.firebaseDb || (window.getFirestore && window.getFirestore());
    if (!firestoreDb) throw new Error("Firestore غير متصل حالياً");

    const getDocsFn = window.getDocs;
    const collectionFn = window.collection;

    if (typeof getDocsFn !== 'function' || typeof collectionFn !== 'function') {
      throw new Error("دوال Firestore لم يتم تصديرها في index.html");
    }

    const usersSnap = await getDocsFn(collectionFn(firestoreDb, "users"));
    let usersList = [];
    
    usersSnap.forEach(docSnap => {
      usersList.push({ id: docSnap.id, ...docSnap.data() });
    });

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
              <th style="padding:10px;">آخر ظهور</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (usersList.length === 0) {
      html += `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text2);">لا يوجد مستخدمين مسجلين بعد.</td></tr>`;
    } else {
      usersList.forEach((u, i) => {
        const lastDate = u.lastSeen ? new Date(u.lastSeen).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : 'غير مسجل';
        html += `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05); background:${i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'};">
            <td style="padding:10px; color:var(--text2);">${i + 1}</td>
            <td style="padding:10px; font-weight:bold; color:var(--text);">${u.name || 'مستخدم بدون اسم'}</td>
            <td style="padding:10px; color:#40a9ff; direction:ltr; text-align:right;">${u.email || '—'}</td>
            <td style="padding:10px; color:var(--green, #6fbf73); font-family:sans-serif; font-size:11.5px;">${lastDate}</td>
          </tr>
        `;
      });
    }

    html += `</tbody></table></div>`;
    container.innerHTML = html;

  } catch (err) {
    console.error("Admin users load error:", err);
    container.innerHTML = `<div style="color:#ff4d4d; text-align:center; padding:20px;">⚠️ تعذر جلب المستخدمين: ${err.message}</div>`;
  }
};

// 4. قسم كل الدروس والمواعظ (الكود الثابت + السحابي معاً)
window.renderAdminLecturesList = function(container) {
  const allLectures = window.lecturesData || [];
  const cloudList = window.cloudLecturesList || [];

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
      <div>
        <span style="font-size:15px; color:var(--gold);">🎙️ إجمالي كل الدروس في التطبيق: <b>${allLectures.length}</b></span>
        <div style="font-size:11.5px; color:var(--text2); margin-top:2px;">(منها ${cloudList.length} درس مضاف سحابياً عبر Firestore)</div>
      </div>
      <div style="display:flex; gap:8px;">
        <button onclick="window.openAddLectureModal()" style="background:var(--gold); color:#111; border:none; padding:8px 16px; border-radius:10px; font-weight:bold; cursor:pointer;">➕ إضافة سلسلة / درس جديد</button>
      </div>
    </div>

    <!-- حقل بحث سريع داخل الدروس -->
    <input type="text" placeholder="🔍 ابحث في كل الدروس بالعنوان أو القسم..." oninput="window.filterAdminLectures(this.value)" style="width:100%; padding:10px 14px; border-radius:10px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:15px; outline:none; box-sizing:border-box;" />

    <div id="adminLecturesContainer" style="display:grid; gap:8px; max-height:55vh; overflow-y:auto;">
  `;

  html += window.buildAdminLecturesCards(allLectures);
  html += `</div>`;

  container.innerHTML = html;
};

window.buildAdminLecturesCards = function(list) {
  if (!list || list.length === 0) {
    return `<div style="text-align:center; padding:20px; color:var(--text2);">لا توجد دروس مطابقة للبحث.</div>`;
  }

  const cloudIds = (window.cloudLecturesList || []).map(c => c.src);

  return list.map((item, idx) => {
    const isCloud = cloudIds.includes(item.src) || !!item.id;
    const isYoutube = (item.src && (item.src.includes('youtube') || item.src.includes('youtu.be'))) || item.type === 'youtube';
    const isVideo = item.type === 'video';

    return `
      <div class="adm-lecture-card" style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
        <div style="flex:1; min-width:0;">
          <div style="font-weight:bold; color:var(--text); font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${isYoutube ? '📺 ' : (isVideo ? '🎥 ' : '🎙️ ')}${item.title}
          </div>
          <div style="font-size:11px; color:var(--gold); margin-top:3px;">
            📁 ${item.category} • <span style="color:${isCloud ? '#6fbf73' : 'var(--text2)'};">${isCloud ? 'سحابي (Firestore)' : 'مثبت برمجياً'}</span>
          </div>
        </div>
        <div style="display:flex; gap:6px; flex-shrink:0;">
          <button onclick="window.openLectureNowPlaying('${item.src}')" style="background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;">▶ تشغيل</button>
          ${isCloud ? `
            <button onclick="window.deleteCloudLectureCategory('${item.category}')" style="background:rgba(255,77,77,0.15); border:1px solid #ff4d4d; color:#ff4d4d; padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;" title="حذف السلسلة من السحابة">🗑️ حذف</button>
          ` : `
            <button onclick="window.removeLocalLectureItem(${idx})" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--text2); padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;" title="إخفاء من القائمة">✕ إخفاء</button>
          `}
        </div>
      </div>
    `;
  }).join('');
};

window.filterAdminLectures = function(q) {
  const container = document.getElementById('adminLecturesContainer');
  if (!container) return;
  const cleanQ = (q || '').trim().toLowerCase();
  const all = window.lecturesData || [];
  
  if (!cleanQ) {
    container.innerHTML = window.buildAdminLecturesCards(all);
    return;
  }

  const filtered = all.filter(l => (l.title && l.title.toLowerCase().includes(cleanQ)) || (l.category && l.category.toLowerCase().includes(cleanQ)));
  container.innerHTML = window.buildAdminLecturesCards(filtered);
};

window.removeLocalLectureItem = function(idx) {
  if (!confirm("هل ترغب في إخفاء هذا الدرس من القائمة الحالية؟")) return;
  window.lecturesData.splice(idx, 1);
  window.renderAdminLecturesList(document.getElementById('adminTabContent'));
  if (typeof renderLectures === 'function') renderLectures();
};

// 5. قسم التلاوات الخاشعة الشامل
window.renderAdminRecitationsList = function(container) {
  const allRecitations = window.rareRecitationsData || [];

  container.innerHTML = `
    <!-- نموذج إضافة تلاوة جديدة -->
    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:14px; padding:15px; margin-bottom:15px;">
      <h4 style="color:var(--gold); margin:0 0 10px 0; font-size:15px;">➕ إضافة تلاوة خاشعة جديدة (يوتيوب أو MP3)</h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <input id="admRecitTitle" type="text" placeholder="عنوان التلاوة (مثال: سورة مريم خاشعة باكية)" style="padding:10px; background:#000; border:1px solid var(--border); color:#fff; border-radius:8px; outline:none;" />
        <input id="admRecitSheikh" type="text" placeholder="اسم القارئ (مثال: الشيخ عبد الباسط)" style="padding:10px; background:#000; border:1px solid var(--border); color:#fff; border-radius:8px; outline:none;" />
        <input id="admRecitUrl" type="url" placeholder="رابط يوتيوب أو MP3 مباشر" style="padding:10px; background:#000; border:1px solid var(--border); color:#fff; border-radius:8px; outline:none;" />
        <button onclick="window.handleAdminAddRecitation()" style="background:var(--gold); color:#111; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer;">🚀 نشر التلاوة الآن في التطبيق</button>
      </div>
    </div>

    <div style="font-size:15px; color:var(--gold); margin-bottom:10px;">🎧 قائمة التلاوات المسجلة (${allRecitations.length} تلاوة):</div>
    <div style="display:grid; gap:8px; max-height:45vh; overflow-y:auto;">
      ${allRecitations.map((r, i) => `
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:var(--text); font-size:13.5px; display:block;">${r.title || r.name}</strong>
            <span style="color:var(--text2); font-size:11.5px;">👤 ${r.sheikh || r.reciter || 'تلاوة خاشعة'}</span>
          </div>
          <button onclick="window.playRare ? window.playRare('${r.src || r.url}') : window.openLectureNowPlaying('${r.src || r.url}')" style="background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer;">▶ تشغيل</button>
        </div>
      `).join('')}
    </div>
  `;
};

window.handleAdminAddRecitation = async function() {
  const title = document.getElementById('admRecitTitle').value.trim();
  const sheikh = document.getElementById('admRecitSheikh').value.trim();
  const url = document.getElementById('admRecitUrl').value.trim();

  if (!title || !url) {
    alert("⚠️ يرجى ملء العنوان والرابط.");
    return;
  }

  const ytId = window.getYoutubeId ? window.getYoutubeId(url) : null;
  const avatar = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "image/mwa.png";

  try {
    const firestoreDb = window.firebaseDb;
    const addDocFn = window.addDoc;
    const collectionFn = window.collection;

    if (firestoreDb && addDocFn && collectionFn) {
      await addDocFn(collectionFn(firestoreDb, "custom_lectures"), {
        category: "تلاوات خاشعة",
        title: `${title} - ${sheikh || ''}`,
        src: url,
        type: ytId ? "youtube" : "audio",
        avatar: avatar,
        sheikh: sheikh || "قارئ",
        desc: "تلاوة مضافة من الإدارة 👑",
        addedBy: "الإدارة 👑",
        addedAt: new Date()
      });
    }

    if (window.lecturesData) {
      window.lecturesData.unshift({
        title: `${title} - ${sheikh || ''}`,
        src: url,
        category: "تلاوات خاشعة",
        type: ytId ? "youtube" : "audio"
      });
    }

    alert("✅ تم نشر التلاوة بنجاح في المنصة!");
    window.renderAdminRecitationsList(document.getElementById('adminTabContent'));
    if (typeof renderLectures === 'function') renderLectures();
  } catch(e) {
    alert("⚠️ حدث خطأ أثناء النشر: " + e.message);
  }
};
