// مصفوفة بيانات القراءات العشر وشيوخها المعتمدة للتطبيق بالروابط الصحيحة من ملف روابط_القراءات_كما_بالصور.csv
const quranReadingsData = [
  {
    id: "hafs",
    name: "رواية حفص عن عاصم (الأساسية)",
    mushafType: "حفص - الخط العثماني",
    isHafs: true, // علامة مميزة لحفص عشان قائمة شيوخك الـ 10
    readers: [
      { name: "المنشاوي", id: "minsh", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Hafs-A-n-Assem/" },
      { name: "الحصري", id: "husary" },
      { name: "مشاري العفاسي", id: "afs" },
      { name: "فارس عباد", id: "frs_a" },
      { name: "عبد الباسط عبد الصمد", id: "basit" },
      { name: "ماهر المعيقلي", id: "maher" },
      { name: "أحمد العجمي", id: "ajm" },
      { name: "سعود الشريم", id: "shrim" },
      { name: "ياسر الدوسري", id: "dosr" },
      { name: "عبدالله القرافي", id: "qarafi" }
    ]
  },
  {
    id: "warsh",
    name: "رواية ورش عن نافع",
    mushafType: "ورش - بالخط العثماني المعتمد",
    isHafs: false,
    readers: [{ name: "الشيخ عبد الباسط عبد الصمد (ورش)", id: "basit_warsh", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Alazraq/" }]
  },
  {
    id: "qaloon",
    name: "رواية قالون عن نافع",
    mushafType: "قالون - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ علي بن عبد الرحمن الحذيفي", id: "hudhaify_qaloon", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Qalon-A-n-Nafi/" }]
  },
  {
    id: "duri",
    name: "رواية الدوري عن أبي عمرو",
    mushafType: "الدوري - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ مفتاح السلطني", id: "silteni_duri", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Aldori-A-n-Abi-Amr/" }]
  },
  {
    id: "soosi",
    name: "رواية السوسي عن أبي عمرو",
    mushafType: "السوسي - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ ماهر المعيقلي", id: "muaiqly_soosi", serverUrl: "https://server16.mp3quran.net/soufi/Rewayat-Assosi-A-n-Abi-Amr/" }]
  },
  {
    id: "shuabah",
    name: "رواية شعبة عن عاصم",
    mushafType: "شعبة - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ مشاري بن راشد العفاسي", id: "afasy_shuabah", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Sho-bah-A-n-Asim/" }]
  },
  {
    id: "khalaf",
    name: "رواية خلف عن حمزة",
    mushafType: "خلف عن حمزة - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ عبد الرشيد صوفي", id: "sofi_khalaf", serverUrl: "https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/" }]
  },
  {
    id: "kisaee",
    name: "رواية الدوري عن الكسائي",
    mushafType: "الكسائي - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ ياسر الدوسري", id: "dosari_kisaee", serverUrl: "https://server14.mp3quran.net/muftah_sultany/Rewayat-AlDorai-A-n-Al-Kisa-ai/" }]
  },
  {
    id: "bazzi",
    name: "رواية البزي عن ابن كثير",
    mushafType: "البزي - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ الدوكالي محمد العالم", id: "dokali_bazzi", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Albizi-A-n-Ibn-Katheer/" }]
  },
  {
    id: "qumbul",
    name: "رواية قنبل عن ابن كثير",
    mushafType: "قنبل - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ محمد عبد الحكيم سعيد", id: "saeed_qumbul", serverUrl: "https://server16.mp3quran.net/deban/Rewayat-Qunbol-A-n-Ibn-Katheer/" }]
  }
];

// تصدير المصفوفة للنطاق العام للتطبيق
window.quranReadingsData = quranReadingsData;
window.currentSelectedRoaya = "hafs"; 
