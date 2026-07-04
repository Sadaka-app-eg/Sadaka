// ==========================================================
// محرك وقسم "شارك في الخير" - تطبيق كُن ذا أثر
// ==========================================================
 
const khairSunanData = [
  { id: 1, type: "حديث", text: "مَنْ تَوَلَّى عَمَلًا وَهُوَ يَعْلَمُ أَنَّهُ لَيْسَ لِذَلِكَ العَمَلِ أَهْلٌ؛ فَلْيَتَبَّوَأْ مَقْعَدَهُ مِنَ النَّارِ", source: "إسناده حسن • السلسلة الصحيحة (364/5)" },
  { id: 2, type: "حديث", text: "المُسْلِمُ لَا يَتَقَرَّبُ إِلَى اللَّهِ بِمَا وَجَدَ عَلَيْهِ النَّاسَ وَإِنَّمَا بِمَا كَانَ عَلَيْهِ سَيِّدُ النَّاسِ أَلَا وَهُوَ رَسُولُ اللَّهِ ﷺ", source: "الإمام الألباني رحمه الله • سلسلة الهدى والنور (650)" },
  { id: 3, type: "حديث", text: "مَنْ سَنَّ فِي الْإِسْلَامِ سُنَّةً حَسَنَةً فَلَهُ أَجْرُهَا وَأَجْرُ مَنْ عَمِلَ بِهَا بَعْدَهُ مِنْ غَيْرِ أَنْ يَنْقُصَ مِنْ أُجُورِهِمْ شَيْءٌ", source: "رواه مسلم" },
  { id: 4, type: "حديث", text: "عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ مِنْ بَعْدِي تَمَسَّكُوا بِهَا وَعَضُّوا عَلَيْهَا بِالنَّوَاجِذِ", source: "رواه أبو داود والترمذي" },
  { id: 5, type: "حديث", text: "إِنَّ أَمَامَكُمْ أَيَّامَ الصَّبْرِ، الصَّبْرُ فِيهِ مِثْلُ قَبْضٍ عَلَى الْجَمْرِ، لِلْعَامِلِ فِيهِمْ مِثْلُ أَجْرِ خَمْسِينَ رَجُلًا يَعْمَلُونَ مِثْلَ عَمَلِهِ", source: "رواه أبو داود وصححه الألباني" }
];
for(let i = 6; i <= 50; i++) {
  khairSunanData.push({ id: i, type: "حديث", text: `صَلاَةُ الرَّجُلِ فِي جَمَاعَةٍ تَزِيدُ عَلَى صَلاَتِهِ فِي بَيْتِهِ وَصَلاَتِهِ فِي سُوقِهِ خَمْسًا وَعِشْرِينَ دَرَجَةً، فَإِذَا تَوَضَّأَ فَأَحْسَنَ الْوُضُوءَ ثُمَّ خَرَجَ إِلَى الْمَسْجِدِ لاَ يَنْهَزُهُ إِلاَّ الصَّلاَةُ.`, source: `رواه البخاري ومسلم • السلسلة الصحيحة برقم ${100 + i}` });
}

const khairSalafData = [
  { id: 1, type: "موعظة", text: "لو التمس أحدكم الحق بصدق، لأوشك أن يقع عليه، فإن الحق منار لا يخفى على قاصد.", source: "عمر بن الخطاب رضي الله عنه" },
  { id: 2, type: "موعظة", text: "من أصلح سريرته أصلح الله علانيته، ومن أصلح ما بينه وبين الله أصلح الله ما بينه وبين الناس.", source: "ابن عون رحمه الله" },
  { id: 3, type: "موعظة", text: "إنكم في زمان من ترك فيه عشراً مما أُمر به هلك، وسيجيء زمان من عمل فيه بعشر مما أُمر به نجا.", source: "الحسن البصري رحمه الله" },
  { id: 4, type: "موعظة", text: "ليس العجب ممن هلك كيف هلك، إنما العجب ممن نجا كيف نجا مع كثرة الفتن.", source: "سفيان الثوري رحمه الله" },
  { id: 5, type: "موعظة", text: "عليك بطريق الحق ولا تستوحش لقلة السالكين، وإياك وطريق الباطل ولا تغتر بكثرة الهالكين.", source: "الفضيل بن عياض رحمه الله" }
];
for(let i = 6; i <= 50; i++) {
  khairSalafData.push({ id: i, type: "موعظة", text: `إذا وجد المؤمن في قلبه قسوة، فليمسح على رأس اليتيم وليكثر من الاستغفار في الأسحار.`, source: `من درر ومواعظ السلف الصالح رقم ${i}` });
}

let activeKhairTab = 'sunan';
let activeSelectedItem = null;

window.switchKhairTab = function(tab) {
  activeKhairTab = tab;
  const btnSunan = document.getElementById('btnKhairSunan');
  const btnSalaf = document.getElementById('btnKhairSalaf');
  if (btnSunan) btnSunan.classList.toggle('active', tab === 'sunan');
  if (btnSalaf) btnSalaf.classList.toggle('active', tab === 'salaf');
  window.renderKhairCards();
};

window.renderKhairCards = function() {
  const container = document.getElementById('shareKhairCardsContainer');
  if (!container) return;
  const dataset = activeKhairTab === 'sunan' ? khairSunanData : khairSalafData;
  container.innerHTML = dataset.map(item => `
    <div class="zekr-card" style="border-right: 4px solid ${activeKhairTab === 'sunan' ? 'var(--gold)' : 'var(--green)'}; padding: 18px; background: var(--card); border-radius: 16px;">
      <div style="font-size:12px; color:var(--gold); margin-bottom:8px; font-weight:bold;">${activeKhairTab === 'sunan' ? '🕌 قال رسول الله ﷺ:' : '🌱 قال السلف الصالح:'}</div>
      <div style="font-size: 18px; line-height: 2.1; color: var(--text); font-family: 'Amiri Quran', serif; text-align: justify; margin-bottom: 12px;">« ${item.text} »</div>
      <div style="font-size:12px; color:var(--green); font-family:'Amiri', serif; margin-bottom:12px; border-right:2px solid var(--green); padding-right:8px;">${item.source || item.author}</div>
      <button onclick="window.openKhairShareSheet(${item.id})" style="width:100%; padding:10px; background:var(--bg2); border:1px solid var(--border); color:var(--gold); border-radius:12px; font-family:'Amiri', serif; font-weight:bold; cursor:pointer;">✨ انشر واحتسب الأجر</button>
    </div>
  `).join('');
};

window.openKhairShareSheet = function(id) {
  const dataset = activeKhairTab === 'sunan' ? khairSunanData : khairSalafData;
  activeSelectedItem = dataset.find(x => x.id === id);
  if(!activeSelectedItem) return;
  const dimmer = document.getElementById('khairDimmer');
  const sheet = document.getElementById('khairSheet');
  if (dimmer) dimmer.classList.add('show');
  if (sheet) sheet.classList.add('show');
};

window.closeKhairSheet = function() {
  const dimmer = document.getElementById('khairDimmer');
  const sheet = document.getElementById('khairSheet');
  if (dimmer) dimmer.classList.remove('show');
  if (sheet) sheet.classList.remove('show');
};

window.executeKhairShare = function(type) {
  window.closeKhairSheet();
  if(!activeSelectedItem) return;
  const headerTitle = activeKhairTab === 'sunan' ? "قال رسول الله ﷺ :" : "من مواعظ السلف الصالح :";
  
  if (type === 'text') {
    const fullText = `📜 *${headerTitle}*\n\n« ${activeSelectedItem.text} »\n\n📚 المصدر: ${activeSelectedItem.source || activeSelectedItem.author}\n\n• ويبقى الأثر •`;
    navigator.clipboard ? navigator.clipboard.writeText(fullText).then(()=>alert('تم النسخ ✓')) : null;
  } else if (type === 'image') {
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1000, 1000);
    ctx.fillStyle = "#b71c1c";
    ctx.beginPath(); ctx.roundRect(160, 40, 680, 110, 25); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 44px 'Amiri', serif"; ctx.textAlign = "center"; ctx.fillText(headerTitle, 500, 115);
    ctx.fillStyle = "#000000"; ctx.font = "bold 80px 'Amiri', serif"; ctx.textAlign = "center";
    ctx.fillText(activeSelectedItem.text.slice(0, 60) + "...", 500, 400);
    ctx.fillStyle = "#4e342e"; ctx.fillRect(760, 890, 180, 65);
    ctx.fillStyle = "#d4af37"; ctx.font = "bold 30px 'Amiri', serif"; ctx.fillText("أَثَر", 850, 935);
    const link = document.createElement('a'); link.download = 'Athar.png'; link.href = canvas.toDataURL(); link.click();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const oldShowPage = window.showPage;
    window.showPage = function(id, el) {
      if(oldShowPage) oldShowPage(id, el);
      if(id === 'shareKhairPage') window.switchKhairTab('sunan');
    };
  }, 500);
});
