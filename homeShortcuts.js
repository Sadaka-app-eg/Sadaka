// =========================================================================
// 🖼️ مصفوفة صور وتوصيفات الاختصارات السريعة
// =========================================================================
window.shortcutsData = {
  quran: {
    title: "القرآن الكريم",
    desc: "تلاوات، تفسير ميسر، أسباب النزول وتدبر السلف",
    img: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&auto=format&fit=crop"
  },
  communityPage: {
    title: "👥 مجتمع أثر",
    desc: "ساحة التفاعل والتواصل الإيماني",
    img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=500&auto=format&fit=crop"
  },
  islamicContent: {
    title: "📚 المكتبة العلمية",
    desc: "موسوعة الفقه والأحاديث والقصص",
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500&auto=format&fit=crop"
  },
  obeyPlanPage: {
    title: "🌿 خطة الطاعة",
    desc: "جدولك اليومي للاستقامة",
    img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500&auto=format&fit=crop"
  },
  azkar: {
    title: "🤲 الأذكار كاملة",
    desc: "أذكار الصباح والمساء والصلاة",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop"
  },
  tasbeh: {
    title: "📿 السبحة الإلكترونية",
    desc: "عداد التسبيح مع حفظ إحصائياتك",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop"
  },
  rareRecitationsPage: {
    title: "🎧 تلاوات خاشعة",
    desc: "نخبة من التلاوات المتميزة للقراء",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop"
  },
  lecturesPage: {
    title: "🎙️ مواعظ ودروس",
    desc: "محاضرات ودروس علمية مؤلمة",
    img: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=500&auto=format&fit=crop"
  },
  studioPage: {
    title: "🎬 استوديو أثر",
    desc: "إنتاج وتصفية المقاطع أوفلاين",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500&auto=format&fit=crop"
  },
  radioPage: {
    title: "📻 إذاعات مباشرة",
    desc: "البث الحي لإذاعات القرآن",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=500&auto=format&fit=crop"
  },
  janazaPage: {
    title: "🕊️ قسم الجنائز",
    desc: "تنبيهات وإعلانات الجنائز",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop"
  },
  shareKhairPage: {
    title: "💝 شارك في الخير",
    desc: "تصميم ونشر البطاقات الدعوية",
    img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500&auto=format&fit=crop"
  },
  abwabElmPage: {
    title: "📚 أبواب العلم",
    desc: "موسوعة العلوم الشرعية الميسرة",
    img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=500&auto=format&fit=crop"
  },
  shareAppPage: {
    title: "💖 ساهم في تطوير التطبيق ونشر الأثر",
    desc: "شارِك الأجر وادعم استمرار العمل",
    img: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=800&auto=format&fit=crop"
  }
};

window.initHomeShortcuts = function() {
  const container = document.getElementById('homeShortcutsContainer');
  if (!container) return;

  const data = window.shortcutsData;
  const bm = JSON.parse(localStorage.getItem('quran_bookmark') || 'null');

  let bookmarkHtml = '';
  if (bm) {
    bookmarkHtml = `
      <div onclick="window.goToHomeBookmarkFromShortcut()" style="background: rgba(212,175,55,0.15); border: 1px solid var(--gold); border-radius: 12px; padding: 10px 14px; margin-top: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; direction: rtl; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🔖</span>
          <span style="font-size: 13px; color: var(--gold); font-family: 'Amiri', serif; font-weight: bold;">
            علامة وقفك: سورة ${bm.surahName} — الآية ${typeof toArabicDigits === 'function' ? toArabicDigits(bm.ayah) : bm.ayah}
          </span>
        </div>
        <span style="color: var(--gold); font-size: 12px; font-weight: bold;">اذهب إليها ➔</span>
      </div>
    `;
  }

  const shortcutsHTML = `
    <div style="direction: rtl; font-family: 'Amiri', serif; margin: 15px 0 20px;">
      
      <!-- 📖 1. كارت القرآن الكريم المصور الصريح -->
      <div onclick="showPage('quran', null)" class="quran-banner-card" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%), url('${data.quran.img}');">
        <div style="display: flex; align-items: center; gap: 14px; position: relative; z-index: 2;">
          <div style="background: var(--gold); color: #111; width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 4px 12px rgba(212,175,55,0.4); flex-shrink: 0;">📖</div>
          <div>
            <div style="font-size: 18px; font-weight: bold; color: #fff; line-height: 1.2; text-shadow: 0 2px 6px rgba(0,0,0,0.8);">${data.quran.title}</div>
            <div style="font-size: 11px; color: #e2d1d1; margin-top: 3px; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">${data.quran.desc}</div>
          </div>
        </div>
        <div style="background: var(--gold); color: #111; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: bold; white-space: nowrap; position: relative; z-index: 2;">
          اقرأ الآن ➔
        </div>
      </div>

      ${bookmarkHtml}

      <!-- 🟢 شبكة الكروت الثلاثية المصورة مع التوضيح السريع -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 12px 0;">
        
        <div onclick="showPage('communityPage', null)" class="home-img-card" style="background-image: url('${data.communityPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.communityPage.title}</span>
          <span class="sc-desc">${data.communityPage.desc}</span>
        </div>

        <div onclick="showPage('islamicContent', null)" class="home-img-card" style="background-image: url('${data.islamicContent.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.islamicContent.title}</span>
          <span class="sc-desc">${data.islamicContent.desc}</span>
        </div>

        <div onclick="showPage('obeyPlanPage', null)" class="home-img-card" style="background-image: url('${data.obeyPlanPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.obeyPlanPage.title}</span>
          <span class="sc-desc">${data.obeyPlanPage.desc}</span>
        </div>

        <div onclick="showPage('azkar', null)" class="home-img-card" style="background-image: url('${data.azkar.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.azkar.title}</span>
          <span class="sc-desc">${data.azkar.desc}</span>
        </div>

        <div onclick="showPage('tasbeh', null)" class="home-img-card" style="background-image: url('${data.tasbeh.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.tasbeh.title}</span>
          <span class="sc-desc">${data.tasbeh.desc}</span>
        </div>

        <div onclick="showPage('rareRecitationsPage', null)" class="home-img-card" style="background-image: url('${data.rareRecitationsPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.rareRecitationsPage.title}</span>
          <span class="sc-desc">${data.rareRecitationsPage.desc}</span>
        </div>

        <div onclick="showPage('lecturesPage', null)" class="home-img-card" style="background-image: url('${data.lecturesPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.lecturesPage.title}</span>
          <span class="sc-desc">${data.lecturesPage.desc}</span>
        </div>

        <div onclick="showPage('studioPage', null)" class="home-img-card" style="background-image: url('${data.studioPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.studioPage.title}</span>
          <span class="sc-desc">${data.studioPage.desc}</span>
        </div>

        <div onclick="showPage('radioPage', null)" class="home-img-card" style="background-image: url('${data.radioPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.radioPage.title}</span>
          <span class="sc-desc">${data.radioPage.desc}</span>
        </div>

        <div onclick="showPage('janazaPage', null)" class="home-img-card" style="background-image: url('${data.janazaPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.janazaPage.title}</span>
          <span class="sc-desc">${data.janazaPage.desc}</span>
        </div>

        <div onclick="showPage('shareKhairPage', null)" class="home-img-card" style="background-image: url('${data.shareKhairPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.shareKhairPage.title}</span>
          <span class="sc-desc">${data.shareKhairPage.desc}</span>
        </div>

        <div onclick="showPage('abwabElmPage', null)" class="home-img-card" style="background-image: url('${data.abwabElmPage.img}');">
          <div class="card-overlay"></div>
          <span class="sc-title">${data.abwabElmPage.title}</span>
          <span class="sc-desc">${data.abwabElmPage.desc}</span>
        </div>

      </div>

      <!-- 💖 كارت المساهمة في الختام -->
      <div onclick="showPage('shareAppPage', null)" class="share-app-banner-card" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url('${data.shareAppPage.img}');">
        <div style="display: flex; align-items: center; gap: 10px; position: relative; z-index: 2;">
          <span style="font-size: 22px;">💖</span>
          <div>
            <div style="font-size: 14px; font-weight: bold; color: #fff;">${data.shareAppPage.title}</div>
            <div style="font-size: 11px; color: #ddd; margin-top: 2px;">${data.shareAppPage.desc}</div>
          </div>
        </div>
        <span style="color: var(--gold); font-size: 18px; position: relative; z-index: 2;">➔</span>
      </div>

    </div>
  `;

  container.innerHTML = shortcutsHTML;
};

window.goToHomeBookmarkFromShortcut = function() {
  const bm = JSON.parse(localStorage.getItem('quran_bookmark') || 'null');
  if (bm && typeof openSurah === 'function') {
    showPage('quran', null);
    openSurah(bm.surah, bm.ayah);
  }
};

(function injectShortcutStyles() {
  if (document.getElementById('homeShortcutStyles')) return;
  const style = document.createElement('style');
  style.id = 'homeShortcutStyles';
  style.innerHTML = `
    .quran-banner-card {
      border: 1.5px solid var(--gold);
      border-radius: 20px;
      padding: 16px 18px;
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
      height: 98px;
      border-radius: 16px;
      background-size: cover;
      background-position: center;
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
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
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 100%);
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
    .home-img-card .sc-desc {
      position: relative;
      z-index: 2;
      font-size: 9px;
      color: var(--gold);
      text-align: center;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      font-family: 'Amiri', serif;
      opacity: 0.9;
    }
    .share-app-banner-card {
      border-radius: 16px;
      padding: 14px 18px;
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

document.addEventListener('DOMContentLoaded', () => {
  window.initHomeShortcuts();
});
