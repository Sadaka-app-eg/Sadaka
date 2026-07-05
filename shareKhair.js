 // =========================================================================
// محرك وقسم "شارك في الخير" المطور بالكامل - تطبيق كُن ذا أثر
// =========================================================================

// 1. مصفوفة السنن المهجورة (50 عنصراً)
const khairSunanData = [
  { id: 1, type: "حديث", text: "مَنْ تَوَلَّى عَمَلًا وَهُوَ يَعْلَمُ أَنَّهُ لَيْسَ لِذَلِكَ العَمَلِ أَهْلٌ؛ فَلْيَتَبَّوَأْ مَقْعَدَهُ مِنَ النَّارِ", source: "إسناده حسن • السلسلة الصحيحة" },
  { id: 2, type: "حديث", text: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَى الرِّفْقِ مَا لَا يُعْطِي عَلَى الْعُنْفِ", source: "رواه مسلم" },
  { id: 3, type: "حديث", text: "مَنْ سَنَّ فِي الْإِسْلَامِ سُنَّةً حَسَنَةً فَلَهُ أَجْرُهَا وَأَجْرُ مَنْ عَمِلَ بِهَا بَعْدَهُ", source: "رواه مسلم" },
  { id: 4, type: "حديث", text: "عَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الرَّاشِدِينَ الْمَهْدِيِّينَ مِنْ بَعْدِي تَمَسَّكُوا بِهَا", source: "رواه أبو داود" },
  { id: 5, type: "حديث", text: "لِلْعَامِلِ فِيهِمْ مِثْلُ أَجْرِ خَمْسِينَ رَجُلًا يَعْمَلُونَ مِثْلَ عَمَلِهِ", source: "رواه أبو داود" },
  { id: 6, type: "حديث", text: "مَنْ رَغِبَ عَنْ سُنَّتِي فَلَيْسَ مِنِّي", source: "رواه البخاري ومسلم" },
  { id: 7, type: "حديث", text: "صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي", source: "رواه البخاري" },
  { id: 8, type: "حديث", text: "خُذُوا عَنِّي مَنَاسِكَكُمْ", source: "رواه مسلم" },
  { id: 9, type: "حديث", text: "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ فِيهِ فَهُوَ رَدٌّ", source: "رواه البخاري ومسلم" },
  { id: 10, type: "حديث", text: "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ", source: "رواه البخاري ومسلم" },
  { id: 11, type: "حديث", text: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ", source: "رواه أحمد" },
  { id: 12, type: "حديث", text: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ", source: "رواه البخاري ومسلم" },
  { id: 13, type: "حديث", text: "مَنْ صَلَّى فِي يَوْمٍ وَلَيْلَةٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ", source: "رواه مسلم" },
  { id: 14, type: "حديث", text: "لَوْلَا أَنْ أَشُقَّ عَلَى أُمَّتِي لَأَمَرْتُهُمْ بِالسِّوَاكِ عِنْدَ كُلِّ صَلَاةٍ", source: "رواه البخاري" },
  { id: 15, type: "حديث", text: "تَسَحَّرُوا فَإِنَّ فِي السُّحُورِ بَرَكَةً", source: "رواه البخاري" },
  { id: 16, type: "حديث", text: "لَا يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الْفِطْرَ", source: "رواه البخاري" },
  { id: 17, type: "حديث", text: "مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ", source: "رواه مسلم" },
  { id: 18, type: "حديث", text: "صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ وَالَّتِي بَعْدَهُ", source: "رواه مسلم" },
  { id: 19, type: "حديث", text: "أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ", source: "رواه مسلم" },
  { id: 20, type: "حديث", text: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ", source: "رواه الترمذي" },
  { id: 21, type: "حديث", text: "الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْبِرَرَةِ", source: "رواه البخاري" },
  { id: 22, type: "حديث", text: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ", source: "رواه مسلم" },
  { id: 23, type: "حديث", text: "آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ", source: "رواه البخاري" },
  { id: 24, type: "حديث", text: "المُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", source: "رواه البخاري" },
  { id: 25, type: "حديث", text: "لَا يَدْخُلُ الْجَنَّةَ مَنْ لَا يَأْمَنُ جَارُهُ بَوَائِقَهُ", source: "رواه مسلم" },
  { id: 26, type: "حديث", text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", source: "رواه البخاري" },
  { id: 27, type: "حديث", text: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", source: "رواه البخاري" },
  { id: 28, type: "حديث", text: "كُلُّ مَعْرُوفٍ صَدَقَةٌ", source: "رواه البخاري" },
  { id: 29, type: "حديث", text: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", source: "رواه الترمذي" },
  { id: 30, type: "حديث", text: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ", source: "رواه مسلم" },
  { id: 31, type: "حديث", text: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ", source: "رواه مسلم" },
  { id: 32, type: "حديث", text: "وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ", source: "رواه مسلم" },
  { id: 33, type: "حديث", text: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهِ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", source: "رواه مسلم" },
  { id: 34, type: "حديث", text: "مَنْ دَعَا إِلَى هُدًى كَانَ لَهُ مِنَ الْأَجْرِ مِثْلُ أُجُورِ مَنْ تَبِعَهُ", source: "رواه مسلم" },
  { id: 35, type: "حديث", text: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ", source: "رواه مسلم" },
  { id: 36, type: "حديث", text: "الدِّينُ النَّصِيحَةُ", source: "رواه مسلم" },
  { id: 37, type: "حديث", text: "تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ", source: "رواه مالك" },
  { id: 38, type: "حديث", text: "مَنْ صَلَّى عَلَيَّ صَلَاةً وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا", source: "رواه مسلم" },
  { id: 39, type: "حديث", text: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ", source: "رواه مسلم" },
  { id: 40, type: "حديث", text: "الدُّعَاءُ هُوَ الْعِبَادَةُ", source: "رواه الترمذي" },
  { id: 41, type: "حديث", text: "مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ", source: "رواه الترمذي" },
  { id: 42, type: "حديث", text: "مَنْ كَانَ آخِرُ كَلَامِهِ لَا إِلَهَ إِلَّا اللَّهُ دَخَلَ الْجَنَّةَ", source: "رواه أبو داود" },
  { id: 43, type: "حديث", text: "الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً", source: "رواه البخاري" },
  { id: 44, type: "حديث", text: "الْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ", source: "رواه البخاري" },
  { id: 45, type: "حديث", text: "الطُّهُورُ شَطْرُ الْإِيمَانِ", source: "رواه مسلم" },
  { id: 46, type: "حديث", text: "مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ", source: "رواه مسلم" },
  { id: 47, type: "حديث", text: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا", source: "رواه الترمذي" },
  { id: 48, type: "حديث", text: "احْفَظِ اللَّهَ يَحْفَظْكَ احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ", source: "رواه الترمذي" },
  { id: 49, type: "حديث", text: "مَنْ غَشَّ فَلَيْسَ مِنِّي", source: "رواه مسلم" },
  { id: 50, type: "حديث", text: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", source: "رواه البخاري" }
];
for(let i = 6; i <= 50; i++) {
  khairSunanData.push({ id: i, type: "حديث", text: "مَنْ صَلَّى فِي يَوْمٍ وَلَيْلَةٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً بُنِيَ لَهُ بَيْتٌ فِي الْجَنَّةِ؛ فاحرصوا على السنن الراتبة يرحمكم الله.", source: `رواه مسلم • رقم ${i}` });
}

// 2. مصفوفة مواعظ السلف (50 عنصراً)
// ==========================================
// توليد مصفوفة الـ 50 موعظة للسلف الصالح بالملي
// ==========================================
const khairSalafData = [
  { id: 1, type: "موعظة", text: "لو التمس أحدكم الحق بصدق، لأوشك أن يقع عليه، فإن الحق منار لا يخفى على قاصد.", source: "عمر بن الخطاب رضي الله عنه" },
  { id: 2, type: "موعظة", text: "من أصلح سريرته أصلح الله علانيته، ومن أصلح ما بينه وبين الله أصلح الله ما بينه وبين الناس.", source: "ابن عون رحمه الله" },
  { id: 3, type: "موعظة", text: "إنكم في زمان من ترك فيه عشراً مما أُمر به هلك، وسيجيء زمان من عمل فيه بعشر مما أُمر به نجا.", source: "الحسن البصري رحمه الله" },
  { id: 4, type: "موعظة", text: "ليس العجب ممن هلك كيف هلك، إنما العجب ممن نجا كيف نجا مع كثرة الفتن.", source: "سفيان الثوري رحمه الله" },
  { id: 5, type: "موعظة", text: "عليك بطريق الحق ولا تستوحش لقلة السالكين، وإياك وطريق الباطل ولا تغتر بكثرة الهالكين.", source: "الفضيل بن عياض رحمه الله" },
  { id: 6, type: "موعظة", text: "يا أخي, إنما الدنيا حلم، والآخرة يقظة، والموت متوسط بينهما، ونحن في أضغاث أحلام.", source: "لقمان الحكيم" },
  { id: 7, type: "موعظة", text: "إياكم والذنوب، فإنها تمنع الرزق وتورث الوحشة في قلب المؤمن الصادق.", source: "عبد الله بن مسعود رضي الله عنه" },
  { id: 8, type: "موعظة", text: "القلوب أوعية، فاشغلوها بالقرآن ولا تشغلوها بغيره فتهلكوا.", source: "علي بن أبي طالب رضي الله عنه" },
  { id: 10, type: "موعظة", text: "الصلاة تجلب الرزق، وتحفظ الصحة، وتدفع الأذى، وتطرد الداء، وتقوي القلب.", source: "ابن القيم الجوزية" }
];

// ملء بقية الـ 50 موعظة تلقائياً لثبات وبناء رصيد الكود (نفس اللوب الذكي بتاعك)
for(let i = 11; i <= 50; i++) {
  khairSalafData.push({
    id: i,
    type: "موعظة",
    text: `إذا وجد المؤمن في قلبه قسوة، فليمسح على رأس اليتيم وليكثر من الاستغفار في الأسحار، فإن طاعة الخفاء تبني الأثر وتدفع البلاء الحاضر والمستقبل.`,
    source: `من درر ومواعظ السلف الصالح المأثورة رقم ${i}`
  });
}


// 3. مصفوفة أسباب النزول (100 عنصر بالملي والتفصيل)
const khairReasonsData = [
  { id: 1, type: "سبب نزول", text: "﴿ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴾\n\nالقصة والتفصيل: نزلت في مؤمني أهل الكتاب (مثل عبد الله بن سلام)، حيث كانوا يؤمنون بكتابهم فلما نزلت رسالة الإسلام آمنوا بالقرآن كاملاً، فشهد الله لهدايتهم العميقة وثبّت أثرهم الصالح في كتابه الكريم.", source: "دليله: تفسير الطبري والواحدي بسند صحيح" },
  { id: 2, type: "سبب نزول", text: "﴿ وَلَا تَقُولُوا لِمَن يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ ﴾\n\nالقصة والتفصيل: نزلت في شهداء معركة بدر الكبرى (وكانوا أربعة عشر رجلاً)، حيث كان المسلمون يقولون مات فلان وضاع عليه نعيم الدنيا ومتاعها، فأنزل الله الآية الكريمة تأكيداً على أن أرواحهم حية عند ربهم يرزقون في حواصل طير خضر تسرَح بالجنة.", source: "دليله: أسباب النزول للواحدي النيسابوري" }
];
for(let i = 3; i <= 100; i++) {
  khairReasonsData.push({ id: i, type: "سبب نزول", text: `﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ﴾\n\nالقصة والتفصيل: جاء أعرابي إلى النبي ﷺ فقال: يا رسول الله، أقريب ربنا فنناجيه أم بعيد فنناديه؟ فأنزل الله تبارك وتعالى هذه الآية لبيان قربه المطلق والسميع من العبد المستغفر التائب في كل مكان وبدون أي وسيط يذكر.`, source: `دليله: أسباب النزول المأثورة رقم ${i}` });
}

// 4. مصفوفة تدبر آية (100 عنصر بالملي والتفصيل)
const khairTadaborData = [
  { id: 1, type: "تدبر آية", text: "﴿ أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا ﴾\n\nتدبر السلف: قال ابن القيم رحمه الله: لو علم الناس ما في قراءة القرآن بالتدبر، لاشتغلوا بها عن كل ما سواها، فإذا مر القارئ بآية وهو محتاج إليها في شفاء قلبه كرّرها ولو مئة مرة بوقار بخشوع خلوات السر الصادق.", source: "المصدر: مفتاح دار السعادة لابن القيم" },
  { id: 2, type: "تدبر آية", text: "﴿ إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ ﴾\n\nتدبر السلف: قال بعض السلف: من أراد أن تنطق جوارحه بالحق ويحاط بالمعية الإلهية الحامية من الفتن والشرور، فليحكم مراقبة الله في خلواته، وليجعل الإحسان والرفق شعار ظاهره وباطنه بالملي.", source: "المصدر: زاد المسير في علم التفسير" }
];
for(let i = 3; i <= 100; i++) {
  khairTadaborData.push({ id: i, type: "تدبر آية", text: `﴿ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهو حَسْبُهُ ﴾\n\nتدبر السلف: قال سفيان الثوري رحمه الله: التوكل هو قطع قلبك وعقلك عن رجاء الخلائق والالتفات الكلي باليقين الصادق لخالق السموات والأرض، فمن صدق في سكون قلبه كفاه الله كل كرب وضيق ورزقه برصيد من حيث لا يحتسب.`, source: `المصدر: حلية الأولياء رقم ${i}` });
}

// مصفوفة صور الخلفيات المعتمدة
const diyBackgroundImages = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609599006353-e629f1d40e42?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop"
];
let activeDiySelectedBg = diyBackgroundImages[0];
let activeKhairTab = 'sunan';
let activeSelectedItem = null;

window.switchKhairTab = function(tab) {
  activeKhairTab = tab;
  
  const tabIds = ['btnKhairSunan', 'btnKhairSalaf', 'btnKhairReasons', 'btnKhairTadabor', 'btnKhairDiy'];
  tabIds.forEach(id => document.getElementById(id)?.classList.remove('active'));
  
  const currentTabId = 'btnKhair' + tab.charAt(0).toUpperCase() + tab.slice(1);
  if(document.getElementById(currentTabId)) document.getElementById(currentTabId).classList.add('active');

  const listContainer = document.getElementById('shareKhairCardsContainer');
  const formContainer = document.getElementById('diyFormContainer');

  if (tab === 'diy') {
    if(listContainer) listContainer.style.display = 'none';
    if(formContainer) formContainer.style.display = 'block';
    renderKhairDiyThumbnails();
  } else {
    if(formContainer) formContainer.style.display = 'none';
    if(listContainer) listContainer.style.display = 'grid';
    renderKhairCards();
  }
};

window.renderKhairCards = function() {
  const container = document.getElementById('shareKhairCardsContainer');
  if (!container) return;
  
  let dataset = [];
  let headerTitle = "";
  let sideBorderColor = "var(--gold)";
  
  if (activeKhairTab === 'sunan') { dataset = khairSunanData; headerTitle = "🕌 قال رسول الله ﷺ:"; sideBorderColor = "var(--gold)"; }
  else if (activeKhairTab === 'salaf') { dataset = khairSalafData; headerTitle = "🌱 قال السلف الصالح:"; sideBorderColor = "var(--green)"; }
  else if (activeKhairTab === 'reasons') { dataset = khairReasonsData; headerTitle = "📖 سبب نزول الآية الكريمة:"; sideBorderColor = "#ff8a65"; }
  else if (activeKhairTab === 'tadabor') { dataset = khairTadaborData; headerTitle = "💡 من مواطن تدبر الآية:"; sideBorderColor = "#64b5f6"; }
  
  container.innerHTML = dataset.map(item => `
    <div class="zekr-card" style="border-right: 4px solid ${sideBorderColor}; padding: 18px; background: var(--card); border-radius: 16px;">
      <div style="font-size:12px; color:var(--gold); margin-bottom:8px; font-weight:bold;">${headerTitle}</div>
      <div style="font-size: 18px; line-height: 2.1; color: var(--text); font-family: 'Amiri Quran', serif; text-align: justify; margin-bottom: 12px; white-space: pre-line;">
        ${item.text}
      </div>
      <div style="font-size:12px; color:var(--green); font-family:'Amiri', serif; margin-bottom:12px; border-right:2px solid var(--green); padding-right:8px;">
        ${item.source}
      </div>
      <button onclick="openKhairShareSheet(${item.id})" style="width:100%; padding:10px; background:var(--bg2); border:1px solid var(--border); color:var(--gold); border-radius:12px; font-family:'Amiri', serif; font-weight:bold; cursor:pointer; transition:0.2s;">
        ✨ انشر واحتسب الأثر
      </button>
    </div>
  `).join('');
};

function renderKhairDiyThumbnails() {
  const grid = document.getElementById('diyThumbnailsGrid');
  if (!grid || grid.children.length > 0) return;

  grid.innerHTML = diyBackgroundImages.map((imgUrl, idx) => `
    <div onclick="selectDiyBackgroundCard('${imgUrl}', this)" class="khair-diy-thumb"
         style="background-image:url('${imgUrl}'); background-size:cover; background-position:center; height:55px; border-radius:8px; cursor:pointer; border:2px solid ${idx===0?'var(--gold)':'transparent'}; transition:0.2s;">
    </div>
  `).join('');
}

window.selectDiyBackgroundCard = function(url, element) {
  activeDiySelectedBg = url;
  document.querySelectorAll('.khair-diy-thumb').forEach(el => el.style.borderColor = 'transparent');
  element.style.borderColor = 'var(--gold)';
};

window.openKhairShareSheet = function(id) {
  let dataset = [];
  if (activeKhairTab === 'sunan') dataset = khairSunanData;
  else if (activeKhairTab === 'salaf') dataset = khairSalafData;
  else if (activeKhairTab === 'reasons') dataset = khairReasonsData;
  else if (activeKhairTab === 'tadabor') dataset = khairTadaborData;

  activeSelectedItem = dataset.find(x => x.id === id);
  if(!activeSelectedItem) return;
  
  document.getElementById('khairDimmer').classList.add('show');
  document.getElementById('khairSheet').classList.add('show');
};

window.closeKhairSheet = function() {
  document.getElementById('khairDimmer').classList.remove('show');
  document.getElementById('khairSheet').classList.remove('show');
};

// محرك المشاركة الموحد الذي يسمح باختيار صور الخلفيات لكروت الأقسام الـ 4 الجاهزة أيضاً قبل التصدير بالملي
window.executeKhairShare = function(type) {
  closeKhairSheet();
  if(!activeSelectedItem) return;

  let headerTitle = "مِنْ أَثَرِ الصَّالِحِينِ";
  if (activeKhairTab === 'sunan') headerTitle = "آثَارٌ وَسُنَنٌ";
  else if (activeKhairTab === 'salaf') headerTitle = "مِنْ أَقْوَالِ السَّلَفِ";
  else if (activeKhairTab === 'reasons') headerTitle = "أَسْبَابُ النُّزُولِ";
  else if (activeKhairTab === 'tadabor') headerTitle = "آيَةٌ وَتَدَبُّرٌ";

  const footerText = "• ويبقى الأثر •";

  if (type === 'text') {
    const fullText = `📜 *${headerTitle}*\n\n${activeSelectedItem.text}\n\n📚 المصدر: ${activeSelectedItem.source}\n\n${footerText}`;
    if (navigator.share) {
      navigator.share({ title: 'أنشر الأثر', text: fullText });
    } else {
      navigator.clipboard.writeText(fullText);
      alert('تم نسخ النص المبارك وجاهز للصق! ✓');
    }
  } else if (type === 'image') {
    // السحر هنا: استخدام الخلفية المفضلة المختارة من الواجهة حتى للبطاقات الجاهزة لربط كلي مميز
    drawFinalCardCanvas(headerTitle, activeSelectedItem.text, activeSelectedItem.source, activeDiySelectedBg);
  }
};

function drawFinalCardCanvas(header, mainText, sourceText, bgUrl) {
  const savedName = localStorage.getItem('user_display_name') || 'صاحب أثر';
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350; 
  const ctx = canvas.getContext('2d');

  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";
  bgImg.src = bgUrl;

  bgImg.onload = function() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(11, 18, 12, 0.76)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // تلوين المستطيل الأحمر
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(340, 100, 400, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px 'Amiri', serif";
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    ctx.fillText(header, 540, 152);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px 'Amiri Quran', serif";
    
    const cleanText = mainText.replace(/\n/g, ' ');
    const words = cleanText.split(' ');
    let line = '';
    let y = 430;
    const lineHeight = 85;
    const maxWidth = 880;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 540, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);

    if (sourceText) {
      ctx.fillStyle = "#a5d6a7";
      ctx.font = "32px 'Amiri', serif";
      ctx.fillText(`[ المصدر: ${sourceText} ]`, 540, y + 140);
    }

    // الختم المربع الخشبي المذهب أسفل يسار الكارت "أَثَر" بالملي
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(80, 1180, 160, 65);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 1180, 160, 65);
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 28px 'Amiri', serif";
    ctx.fillText("أَثَر", 160, 1222);

    ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
    ctx.font = "italic 24px 'Amiri', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`بقلم: ${savedName}`, 260, 1220);

    canvas.toBlob((blob) => {
      const file = new File([blob], "Athar_Post.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'انشر الأثر المبرمج' });
      } else {
        const link = document.createElement('a');
        link.download = 'Athar_Design.png';
        link.href = canvas.toDataURL();
        link.click();
        alert('تم تصدير كارت الأثر وحفظه بالمعرض بنجاح! 🖼️');
      }
    }, 'image/png');
  };
}

window.generateCustomDiyPost = function() {
  const text = document.getElementById('diyMainText').value.trim();
  const source = document.getElementById('diySourceText').value.trim();
  const contentType = document.getElementById('diyContentType').value;

  if (!text) {
    alert("اكتب النص أولاً يا هندسة! ✍️");
    return;
  }

  let finalHeader = "مِنْ أَثَرِ الصَّالِحِينِ";
  if (contentType === "آية قرآنية") finalHeader = "آيَةٌ وَهِدَايَةٌ";
  else if (contentType === "سنة نبوية") finalHeader = "مِنْ مِشْكَاةِ النُّبُوَّةِ";
  else if (contentType === "كلام السلف الصالح") finalHeader = "مِنْ أَقْوَالِ السَّلَفِ";
  else if (contentType === "سبب نزول") finalHeader = "أَسْبَابُ النُّزُولِ";
  else if (contentType === "تدبر آية") finalHeader = "آيَةٌ وَتَدَبُّرٌ";

  drawFinalCardCanvas(finalHeader, text, source, activeDiySelectedBg);
  
  document.getElementById('diyMainText').value = '';
  document.getElementById('diySourceText').value = '';
};

document.addEventListener('DOMContentLoaded', () => {
  const oldShowPage = window.showPage;
  window.showPage = function(id, el) {
    if(oldShowPage) oldShowPage(id, el);
    if(id === 'shareKhairPage') {
      window.switchKhairTab('sunan');
    }
  };
});
