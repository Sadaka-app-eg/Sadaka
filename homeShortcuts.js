// =========================================================================
// 🖼️ مصفوفة صور أقسام الاختصارات (استبدل أي رابط بأي صورة من جوجل)
// =========================================================================
window.shortcutsImages = {
  // 1. كارت القرآن الكريم المميز الكلي
  "quran": "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop",

  // 2. كروت الأقسام الفرعية (شبكة 3 في الصف)
  "communityPage": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=500&auto=format&fit=crop", // مجتمع أثر
  "islamicContent": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500&auto=format&fit=crop", // المكتبة العلمية
  "obeyPlanPage": "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500&auto=format&fit=crop", // خطة الطاعة

  "azkar": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop", // الأذكار كاملة
  "tasbeh": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop", // السبحة الإلكترونية
  "rareRecitationsPage": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop", // تلاوات خاشعة

  "lecturesPage": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=500&auto=format&fit=crop", // مواعظ ودروس
  "studioPage": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop", // استوديو أثر
  "radioPage": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=500&auto=format&fit=crop", // إذاعات مباشرة

  "janazaPage": "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop", // قسم الجنائز
  "shareKhairPage": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500&auto=format&fit=crop", // شارك في الخير
  "abwabElmPage": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=500&auto=format&fit=crop", // أبواب العلم

  // 3. كارت المساهمة السفلي
  "shareAppPage": "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=800&auto=format&fit=crop"
};

// =========================================================================
// 🚀 شبكة الاختصارات السريعة المصورة للصفحة الرئيسية (Home Shortcuts Grid)
// =========================================================================

window.initHomeShortcuts = function() {
  const container = document.getElementById('homeShortcutsContainer');
  if (!container) return;

  const imgs = window.shortcutsImages;

  // 🔖 جلب بيانات علامة الوقف (البوكمارك) المحفوظة إن وجدت
  const bm = JSON.parse(localStorage.getItem('quran_bookmark') || 'null');
  
  // شريط البوكمارك الذكي الذي سيظهر تحت كارت القرآن مباشرة
  let bookmarkHtml = '';
  if (bm) {
    bookmarkHtml = `
      <div onclick="window.goToHomeBookmarkFromShortcut()" style="background: rgba(212,175,55,0.12); border: 1px solid var(--gold); border-radius: 12px; padding: 10px 14px; margin-top: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; direction: rtl; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🔖</span>
          <span style="font-size: 13px; color: var(--gold); font-family: 'Amiri', serif; font-weight: bold;">
            علامة وقفك: سورة ${bm.surahName} — الآية ${toArabicDigits ? toArabicDigits(bm.ayah) : bm.ayah}
          </span>
        </div>
        <span style="color: var(--gold); font-size: 13px;">اذهب إليها ➔</span>
      </div>
    `;
  }

  const shortcutsHTML = `
    <div style="direction: rtl; font-family: 'Amiri', serif; margin: 20px 0 25px;">
      
      <!-- 📖 1. كارت القرآن الكريم المصور الخرافي في الصدارة -->
      <div onclick="showPage('quran', null)" class="quran-banner-card" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%), url('${imgs.quran}');">
        <div style="display: flex; align-items: center; gap: 14px; position: relative; z-index: 2;">
          <div style="background: var(--gold); color: #111; width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 4px 15px rgba(212,175,55,0.4); flex-shrink: 0;">📖</div>
          <div>
            <div style="font-size: 19px; font-weight: bold; color: #fff; line-height: 1.2; text-shadow: 0 2px 6px rgba(0,0,0,0.8);">القرآن الكريم</div>
            <div style="font-size: 12px; color: #e2d1d1; margin-top: 4px; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">تلاوات، تفسير، أسباب النزول وتدبر السلف</div>
          </div>
        </div>
        <div style="background: var(--gold); color: #111; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: bold; white-space: nowrap; position: relative; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          اقرأ الآن ➔
        </div>
      </div>

      <!-- 🔖 شريط علامة الوقف المندمج تحت كارت القرآن (لو موجودة) -->
      ${bookmarkHtml}

      <!-- 🟢 شبكة الكروت الثلاثية المصورة الموزعة بأناقة (3 في الصف) -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 14px 0;">
        
        <!-- السطر 1 -->
        <div onclick="showPage('communityPage', null)" class="home-img-card" style="background-image: url('${imgs.communityPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">👥 مجتمع أثر</span>
        </div>

        <div onclick="showPage('islamicContent', null)" class="home-img-card" style="background-image: url('${imgs.islamicContent}');">
          <div class="card-overlay"></div>
          <span class="sc-title">📚 المكتبة العلمية</span>
        </div>

        <div onclick="showPage('obeyPlanPage', null)" class="home-img-card" style="background-image: url('${imgs.obeyPlanPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">🌿 خطة الطاعة</span>
        </div>

        <!-- السطر 2 -->
        <div onclick="showPage('azkar', null)" class="home-img-card" style="background-image: url('${imgs.azkar}');">
          <div class="card-overlay"></div>
          <span class="sc-title">🤲 الأذكار كاملة</span>
        </div>

        <div onclick="showPage('tasbeh', null)" class="home-img-card" style="background-image: url('${imgs.tasbeh}');">
          <div class="card-overlay"></div>
          <span class="sc-title">📿 السبحة الإلكترونية</span>
        </div>

        <div onclick="showPage('rareRecitationsPage', null)" class="home-img-card" style="background-image: url('${imgs.rareRecitationsPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">🎧 تلاوات خاشعة</span>
        </div>

        <!-- السطر 3 -->
        <div onclick="showPage('lecturesPage', null)" class="home-img-card" style="background-image: url('${imgs.lecturesPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">🎙️ مواعظ ودروس</span>
        </div>

        <div onclick="showPage('studioPage', null)" class="home-img-card" style="background-image: url('${imgs.studioPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">🎬 استوديو أثر</span>
        </div>

        <div onclick="showPage('radioPage', null)" class="home-img-card" style="background-image: url('${imgs.radioPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">📻 إذاعات مباشرة</span>
        </div>

        <!-- السطر 4 -->
        <div onclick="showPage('janazaPage', null)" class="home-img-card" style="background-image: url('${imgs.janazaPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">🕊️ قسم الجنائز</span>
        </div>

        <div onclick="showPage('shareKhairPage', null)" class="home-img-card" style="background-image: url('${imgs.shareKhairPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">💝 شارك في الخير</span>
        </div>

        <div onclick="showPage('abwabElmPage', null)" class="home-img-card" style="background-image: url('${imgs.abwabElmPage}');">
          <div class="card-overlay"></div>
          <span class="sc-title">📚 أبواب العلم</span>
        </div>

      </div>

      <!-- 💖 2. كارت المساهمة المصور في الختام -->
      <div onclick="showPage('shareAppPage', null)" class="share-app-banner-card" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url('${imgs.shareAppPage}');">
        <div style="display: flex; align-items: center; gap: 10px; position: relative; z-index: 2;">
          <span style="font-size: 24px;">💖</span>
          <span style="font-size: 14px; font-weight: bold; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">ساهم في تطوير التطبيق ونشر الأثر</span>
        </div>
        <span style="color: var(--gold); font-size: 18px; position: relative; z-index: 2;">➔</span>
      </div>

    </div>
  `;

  container.innerHTML = shortcutsHTML;
};

// دالة الانتقال السريع عند النقر على علامة الوقف الجديدة
window.goToHomeBookmarkFromShortcut = function() {
  const bm = JSON.parse(localStorage.getItem('quran_bookmark') || 'null');
  if (bm && typeof openSurah === 'function') {
    showPage('quran', null);
    openSurah(bm.surah, bm.ayah);
  }
};

// إضافة ستايل الصور والتأثيرات البصرية في الـ Head ديناميكياً
(function injectShortcutStyles() {
  if (document.getElementById('homeShortcutStyles')) return;
  const style = document.createElement('style');
  style.id = 'homeShortcutStyles';
  style.innerHTML = `
    .quran-banner-card {
      border: 1.5px solid var(--gold);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-size: cover;
      background-position: center;
      box-shadow: 0 8px 25px rgba(0,0,0,0.4);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .quran-banner-card:active {
      transform: scale(0.98);
    }
    .home-img-card {
      position: relative;
      height: 90px;
      border-radius: 16px;
      background-size: cover;
      background-position: center;
      border: 1px solid var(--border);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 8px 4px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.2s, border-color 0.2s;
    }
    .home-img-card:active {
      transform: scale(0.95);
      border-color: var(--gold);
    }
    .home-img-card .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%);
      z-index: 1;
    }
    .home-img-card .sc-title {
      position: relative;
      z-index: 2;
      font-size: 11.5px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 1.2;
      text-shadow: 0 2px 5px rgba(0,0,0,0.9);
      font-family: 'Amiri', serif;
    }
    .share-app-banner-card {
      border-radius: 16px;
      padding: 16px 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-size: cover;
      background-position: center;
      border: 1px solid var(--border);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    }
    .share-app-banner-card:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);
})();

// تشغيل الاختصارات فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.initHomeShortcuts();
});
