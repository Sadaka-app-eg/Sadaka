// =========================================================================
// 👑 لوحة تحكم المشرف الشاملة - تطبيق أثر (إصدار قوائم التشغيل وإدارة الأعضاء 2026)
// =========================================================================

window.ADMIN_EMAILS = [
  "admin@gmail.com",
  "ahmedmohamedhosny100@gmail.com" // إيميلك المعتمد
];

window.isAdminUser = function() {
  const userEmail = localStorage.getItem('user_email');
  if (!userEmail) return false;
  return window.ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail.toLowerCase().trim());
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
    modal.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.92); backdrop-filter:blur(12px); z-index:10000000; display:flex; align-items:center; justify-content:center; padding:10px; direction:rtl; font-family:'Amiri', serif;";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="width:100%; max-width:980px; height:92vh; background:#0b110d; border:1.5px solid var(--gold, #d4af37); border-radius:20px; display:flex; flex-direction:column; box-shadow:0 25px 70px rgba(0,0,0,0.95); overflow:hidden;">
      
      <!-- الهيدر -->
      <div style="padding:14px 20px; background:#121e14; border-bottom:1px solid var(--border, #222); display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:26px;">👑</span>
          <div>
            <strong style="color:var(--gold, #d4af37); font-size:18px;">لوحة الإدارة والتحكم الشاملة</strong>
            <div style="font-size:11px; color:var(--text2, #888);">إدارة المستخدمين، قوائم وسلاسل الدروس، والتلاوات الخاشعة</div>
          </div>
        </div>
        <button onclick="document.getElementById('athrAdminDashboardModal').remove()" style="background:rgba(255,77,77,0.2); border:1px solid #ff4d4d; color:#ff4d4d; border-radius:50%; width:32px; height:32px; font-weight:bold; cursor:pointer;">✕</button>
      </div>

      <!-- تبويبات اللوحة الرئيسية -->
      <div style="display:flex; background:#070b08; border-bottom:1px solid var(--border, #222); flex-shrink:0;">
        <button class="admin-tab-btn active" id="admTab_users" onclick="window.switchAdminTab('users')" style="flex:1; padding:12px 6px; border:none; background:rgba(212,175,55,0.15); color:var(--gold, #d4af37); font-weight:bold; cursor:pointer; font-family:inherit; border-bottom:2px solid var(--gold, #d4af37); font-size:13px;">👥 المستخدمين (${window._cachedUsersCount || '...'})</button>
        <button class="admin-tab-btn" id="admTab_lectures" onclick="window.switchAdminTab('lectures')" style="flex:1; padding:12px 6px; border:none; background:transparent; color:var(--text2, #888); font-weight:bold; cursor:pointer; font-family:inherit; font-size:13px;">📁 سلاسل ودورات العلم</button>
        <button class="admin-tab-btn" id="admTab_recitations" onclick="window.switchAdminTab('recitations')" style="flex:1; padding:12px 6px; border:none; background:transparent; color:var(--text2, #888); font-weight:bold; cursor:pointer; font-family:inherit; font-size:13px;">🎧 التلاوات ومقاطع القرآن</button>
      </div>

      <!-- محتوى التبويبات -->
      <div id="adminTabContent" style="flex:1; overflow-y:auto; padding:16px; color:var(--text, #fff);">
        <div style="text-align:center; padding:40px; color:var(--gold);">⏳ جاري فتح قاعدة البيانات...</div>
      </div>

    </div>
  `;

  modal.style.display = 'flex';
  window.switchAdminTab('users');
};

// 2. التبديل بين التبويبات
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
  if (tabName === 'lectures') window.renderAdminLecturesPlaylists(content);
  if (tabName === 'recitations') window.renderAdminRecitationsPlaylists(content);
};

// =========================================================================
// 👥 1. قسم المستخدمين المطور (سجل الدخول + ميزة الحظر/الطرد)
// =========================================================================
window.renderAdminUsersList = async function(container) {
  container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--gold);">⏳ جاري مزامنة بيانات المستخدمين من السحابة...</div>`;
  
  try {
    const firestoreDb = window.firebaseDb;
    if (!firestoreDb || !window.getDocs || !window.collection) {
      throw new Error("تأكد من تصدير دوال Firestore على window في index.html");
    }

    const usersSnap = await window.getDocs(window.collection(firestoreDb, "users"));
    let usersList = [];
    
    usersSnap.forEach(docSnap => {
      usersList.push({ id: docSnap.id, ...docSnap.data() });
    });

    window._cachedUsersCount = usersList.length;
    usersList.sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0));

    window._allAdminUsers = usersList;

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:15px; color:var(--gold);">📊 إجمالي المستخدمين: <b>${usersList.length}</b> مسجل</span>
        <button onclick="window.renderAdminUsersList(document.getElementById('adminTabContent'))" style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:var(--gold); padding:6px 14px; border-radius:8px; cursor:pointer; font-size:12px;">🔄 تحديث السجل</button>
      </div>

      <input type="text" placeholder="🔍 ابحث عن مستخدم بالاسم أو الإيميل..." oninput="window.filterAdminUsersTable(this.value)" style="width:100%; padding:10px 14px; border-radius:10px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:12px; outline:none; box-sizing:border-box;" />

      <div style="overflow-x:auto; border:1px solid var(--border); border-radius:12px;" id="adminUsersTableWrap">
        ${window.buildAdminUsersTableHTML(usersList)}
      </div>
    `;

    container.innerHTML = html;

  } catch (err) {
    console.error("Admin users load error:", err);
    container.innerHTML = `<div style="color:#ff4d4d; text-align:center; padding:20px; line-height:1.8;">⚠️ تعذر جلب سجل المستخدمين:<br>${err.message}</div>`;
  }
};

window.buildAdminUsersTableHTML = function(usersList) {
  if (usersList.length === 0) {
    return `<div style="text-align:center; padding:20px; color:var(--text2);">لا يوجد مستخدمين مسجلين بعد.</div>`;
  }

  let rows = usersList.map((u, i) => {
    const isBanned = u.isBanned === true;
    const lastDate = u.lastSeen ? new Date(u.lastSeen).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }) : '—';
    const emailStr = u.email || 'حساب زائر/بدون بريد';

    return `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05); background:${isBanned ? 'rgba(255,77,77,0.08)' : (i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent')};">
        <td style="padding:10px 8px; color:var(--text2); text-align:center;">${i + 1}</td>
        <td style="padding:10px 8px;">
          <strong style="color:${isBanned ? '#ff6b6b' : 'var(--text)'}; font-size:13.5px; display:block;">${u.name || 'بدون اسم'}</strong>
          ${isBanned ? '<span style="font-size:10px; color:#ff4d4d; font-weight:bold;">⛔ محظور ومطرود</span>' : ''}
        </td>
        <td style="padding:10px 8px; color:#40a9ff; direction:ltr; text-align:right; font-size:12px;">${emailStr}</td>
        <td style="padding:10px 8px; color:var(--green, #6fbf73); font-size:11px; white-space:nowrap;">${lastDate}</td>
        <td style="padding:10px 8px; text-align:center;">
          ${isBanned ? `
            <button onclick="window.toggleBanUser('${u.id}', false, '${(u.name||'').replace(/'/g, "\\'")}')" style="background:#2e7d32; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer;">فك الحظر</button>
          ` : `
            <button onclick="window.toggleBanUser('${u.id}', true, '${(u.name||'').replace(/'/g, "\\'")}')" style="background:rgba(255,77,77,0.2); border:1px solid #ff4d4d; color:#ff4d4d; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer;">⛔ طرد وحظر</button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <table style="width:100%; border-collapse:collapse; text-align:right; font-size:13px;">
      <thead>
        <tr style="background:#152217; color:var(--gold); border-bottom:1.5px solid var(--border);">
          <th style="padding:10px 8px; text-align:center; width:35px;">#</th>
          <th style="padding:10px 8px;">الاسم</th>
          <th style="padding:10px 8px;">حساب Google</th>
          <th style="padding:10px 8px;">آخر ظهور</th>
          <th style="padding:10px 8px; text-align:center;">إجراء</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

window.filterAdminUsersTable = function(q) {
  const wrap = document.getElementById('adminUsersTableWrap');
  if (!wrap || !window._allAdminUsers) return;
  const cleanQ = (q || '').trim().toLowerCase();
  
  if (!cleanQ) {
    wrap.innerHTML = window.buildAdminUsersTableHTML(window._allAdminUsers);
    return;
  }

  const filtered = window._allAdminUsers.filter(u => 
    (u.name && u.name.toLowerCase().includes(cleanQ)) ||
    (u.email && u.email.toLowerCase().includes(cleanQ))
  );

  wrap.innerHTML = window.buildAdminUsersTableHTML(filtered);
};

window.toggleBanUser = async function(userId, banState, userName) {
  const actionText = banState ? "حظر وطرد" : "إلغاء حظر";
  if (!confirm(`هل أنت متأكد من ${actionText} المستخدم (${userName})؟`)) return;

  try {
    const firestoreDb = window.firebaseDb;
    await window.setDoc(window.doc(firestoreDb, "users", userId), {
      isBanned: banState,
      bannedAt: banState ? new Date().toISOString() : null
    }, { merge: true });

    alert(`✅ تم ${actionText} (${userName}) بنجاح.`);
    window.renderAdminUsersList(document.getElementById('adminTabContent'));
  } catch(e) {
    alert("⚠️ حدث خطأ: " + e.message);
  }
};

// =========================================================================
// 📁 2. قسم قوائم وسلاسل الدروس (Playlists Folders View)
// =========================================================================
window.renderAdminLecturesPlaylists = function(container) {
  const allLectures = window.lecturesData || [];
  
  // تجميع الدروس حسب السلسلة / القسم (Playlist)
  const categoriesMap = {};
  allLectures.forEach((item, index) => {
    const cat = item.category || "دروس عامة";
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push({ ...item, globalIndex: index });
  });

  const categories = Object.keys(categoriesMap);
  const cloudList = window.cloudLecturesList || [];

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="font-size:15px; color:var(--gold);">📁 إجمالي السلاسل والقوائم: <b>${categories.length}</b> سلسلة</span>
        <div style="font-size:11px; color:var(--text2);">إجمالي الحلقات: ${allLectures.length} درس</div>
      </div>
      <button onclick="window.openAddLectureModal()" style="background:var(--gold); color:#111; border:none; padding:8px 16px; border-radius:10px; font-weight:bold; cursor:pointer;">➕ إضافة سلسلة / دروس جديدة</button>
    </div>

    <!-- حقل البحث في السلاسل -->
    <input type="text" placeholder="🔍 ابحث عن سلسلة أو دورة علمية..." oninput="window.filterAdminPlaylists(this.value)" style="width:100%; padding:10px 14px; border-radius:10px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:14px; outline:none; box-sizing:border-box;" />

    <div id="adminPlaylistsWrap" style="display:grid; gap:10px;">
  `;

  html += window.buildPlaylistsAccordionHTML(categoriesMap);
  html += `</div>`;

  container.innerHTML = html;
};

window.buildPlaylistsAccordionHTML = function(categoriesMap) {
  const categories = Object.keys(categoriesMap);
  if (categories.length === 0) {
    return `<div style="text-align:center; padding:20px; color:var(--text2);">لا توجد سلاسل مطابقة.</div>`;
  }

  return categories.map((cat, catIdx) => {
    const lessons = categoriesMap[cat];
    const isCloud = (window.cloudLecturesList || []).some(c => c.category === cat);
    const avatar = window.getLectureSheikhAvatar ? window.getLectureSheikhAvatar(cat) : 'image/moha.png';

    return `
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:14px; overflow:hidden; transition:border-color 0.2s;">
        
        <!-- هيدر القائمة / السلسلة -->
        <div style="padding:12px 16px; background:#121813; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="window.togglePlaylistDetails('pl_${catIdx}')">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${avatar}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1.5px solid var(--gold);" />
            <div>
              <strong style="color:var(--gold); font-size:14.5px; display:block;">${cat}</strong>
              <span style="color:var(--text2); font-size:11.5px;">(${lessons.length} درس) • ${isCloud ? '<span style="color:#6fbf73;">سحابية ☁️</span>' : 'مبرمجة محلياً 💾'}</span>
            </div>
          </div>
          
          <div style="display:flex; align-items:center; gap:6px;" onclick="event.stopPropagation()">
            ${isCloud ? `
              <button onclick="window.deleteCloudLectureCategory('${cat}')" style="background:rgba(255,77,77,0.15); border:1px solid #ff4d4d; color:#ff4d4d; padding:4px 8px; border-radius:6px; font-size:11px; cursor:pointer;">🗑️ حذف السلسلة</button>
            ` : ''}
            <button onclick="window.togglePlaylistDetails('pl_${catIdx}')" style="background:transparent; border:none; color:var(--gold); font-size:14px; cursor:pointer;">📂 عرض الدروس ▾</button>
          </div>
        </div>

        <!-- قائمة دروس السلسلة المنسدلة -->
        <div id="pl_${catIdx}" style="display:none; padding:12px; background:#070a08; border-top:1px dashed var(--border); flex-direction:column; gap:6px;">
          ${lessons.map((l, lIdx) => {
            const isYt = (l.src && (l.src.includes('youtube') || l.src.includes('youtu.be'))) || l.type === 'youtube';
            return `
              <div style="padding:8px 12px; background:rgba(255,255,255,0.02); border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:12.5px;">
                <span style="color:var(--text); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-left:10px;">
                  ${lIdx + 1}. ${isYt ? '📺 ' : '🎙️ '}${l.title}
                </span>
                <div style="display:flex; gap:6px; flex-shrink:0;">
                  <button onclick="window.openLectureNowPlaying('${l.src}')" style="background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); padding:3px 8px; border-radius:5px; font-size:11px; cursor:pointer;">▶ تشغيل</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }).join('');
};

window.togglePlaylistDetails = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isHidden = el.style.display === 'none' || !el.style.display;
  el.style.display = isHidden ? 'flex' : 'none';
};

window.filterAdminPlaylists = function(q) {
  const wrap = document.getElementById('adminPlaylistsWrap');
  if (!wrap) return;
  const cleanQ = (q || '').trim().toLowerCase();

  const allLectures = window.lecturesData || [];
  const categoriesMap = {};
  allLectures.forEach((item, index) => {
    const cat = item.category || "دروس عامة";
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push({ ...item, globalIndex: index });
  });

  if (!cleanQ) {
    wrap.innerHTML = window.buildPlaylistsAccordionHTML(categoriesMap);
    return;
  }

  const filteredMap = {};
  Object.keys(categoriesMap).forEach(cat => {
    if (cat.toLowerCase().includes(cleanQ) || categoriesMap[cat].some(l => l.title.toLowerCase().includes(cleanQ))) {
      filteredMap[cat] = categoriesMap[cat];
    }
  });

  wrap.innerHTML = window.buildPlaylistsAccordionHTML(filteredMap);
};

// =========================================================================
// 🎧 3. قسم التلاوات الشامل (المثبتة والجديدة)
// =========================================================================
window.renderAdminRecitationsPlaylists = function(container) {
  // جلب التلاوات من كل المصادر في التطبيق
  const allRecitations = window.rareRecitations || window.rareRecitationsData || [];

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

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <span style="font-size:15px; color:var(--gold);">🎧 قائمة التلاوات المتاحة في التطبيق (<b>${allRecitations.length}</b> تلاوة):</span>
    </div>

    <div style="display:grid; gap:8px; max-height:48vh; overflow-y:auto;">
      ${allRecitations.length === 0 ? `
        <div style="text-align:center; padding:20px; color:var(--text2);">لا توجد تلاوات مسجلة بعد. أضف أول تلاوة من النموذج أعلاه!</div>
      ` : allRecitations.map((r, i) => {
        const title = r.title || r.name || "تلاوة خاشعة";
        const sheikh = r.sheikh || r.reciter || "قارئ";
        const src = r.src || r.url || "";
        const isYt = src.includes('youtube') || src.includes('youtu.be');

        return `
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <div>
              <strong style="color:var(--text); font-size:13.5px; display:block;">${isYt ? '📺 ' : '🎧 '}${title}</strong>
              <span style="color:var(--text2); font-size:11.5px;">👤 ${sheikh}</span>
            </div>
            <button onclick="window.playRare ? window.playRare('${src}') : window.openLectureNowPlaying('${src}')" style="background:rgba(212,175,55,0.15); border:1px solid var(--gold); color:var(--gold); padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer;">▶ تشغيل</button>
          </div>
        `;
      }).join('')}
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
    if (firestoreDb && window.addDoc && window.collection) {
      await window.addDoc(window.collection(firestoreDb, "custom_lectures"), {
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

    const newItem = {
      title: `${title} - ${sheikh || ''}`,
      src: url,
      category: "تلاوات خاشعة",
      type: ytId ? "youtube" : "audio"
    };

    if (window.lecturesData) window.lecturesData.unshift(newItem);
    if (window.rareRecitations) window.rareRecitations.unshift(newItem);

    alert("✅ تم نشر التلاوة بنجاح في المنصة!");
    window.renderAdminRecitationsPlaylists(document.getElementById('adminTabContent'));
    if (typeof renderLectures === 'function') renderLectures();
  } catch(e) {
    alert("⚠️ حدث خطأ أثناء النشر: " + e.message);
  }
};
