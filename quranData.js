// مصفوفة بيانات القراءات العشر وشيوخها (آية آية) المعتمدة للتطبيق
const quranReadingsData = [
  {
    id: "hafs",
    name: "رواية حفص عن عاصم (الأساسية)",
    mushafType: "حفص - الخط العثماني",
    isHafs: true, // علامة مميزة لحفص عشان نرجع قائمة شيوخك الـ 10
    readers: [
      { name: "المنشاوي", id: "minsh" },
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
    readers: [{ name: "الشيخ عبد الباسط عبد الصمد (ورش)", id: "basit_warsh", apiId: "ar.abdullahbasfar" }] // اختيار سيرفر ورش المستقر آية آية
  },
  {
    id: "qaloon",
    name: "رواية قالون عن نافع",
    mushafType: "قالون - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ علي بن عبد الرحمن الحذيفي", id: "hudhaify_qaloon", apiId: "ar.hudhaify" }]
  },
  {
    id: "duri",
    name: "رواية الدوري عن أبي عمرو",
    mushafType: "الدوري - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ مفتاح السلطني", id: "silteni_duri" }]
  },
  {
    id: "soosi",
    name: "رواية السوسي عن أبي عمرو",
    mushafType: "السوسي - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ ماهر المعيقلي", id: "muaiqly_soosi" }]
  },
  {
    id: "shuabah",
    name: "رواية شعبة عن عاصم",
    mushafType: "شعبة - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ مشاري بن راشد العفاسي", id: "afasy_shuabah" }]
  },
  {
    id: "khalaf",
    name: "رواية خلف عن حمزة",
    mushafType: "خلف عن حمزة - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ عبد الرشيد صوفي", id: "sofi_khalaf" }]
  },
  {
    id: "kisaee",
    name: "رواية الدوري عن الكسائي",
    mushafType: "الكسائي - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ ياسر الدوسري", id: "dosari_kisaee" }]
  },
  {
    id: "bazzi",
    name: "رواية البزي عن ابن كثير",
    mushafType: "البزي - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ الدوكالي محمد العالم", id: "dokali_bazzi" }]
  },
  {
    id: "qumbul",
    name: "رواية قنبل عن ابن كثير",
    mushafType: "قنبل - بالرسم العثماني",
    isHafs: false,
    readers: [{ name: "الشيخ محمد عبد الحكيم سعيد", id: "saeed_qumbul" }]
  }
];

// تصدير المصفوفة للنطاق العام للتطبيق
window.quranReadingsData = quranReadingsData;
window.currentSelectedRoaya = "hafs"; // التلقائي الثابت دايماً هو حفص
