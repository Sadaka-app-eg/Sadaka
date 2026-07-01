const CACHE_NAME = 'sadaka-cache-v1';
const MUSHAF_CACHE = 'mushaf-images-v1';

// 1️⃣ حدث الـ install: التثبيت وتخطي الانتظار فوراً لطحن الكاش القديم
self.addEventListener('install', e => {
  self.skipWaiting(); // التحديث الفوري المباشر
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/Sadaka/',
        '/Sadaka/index.html',
        '/Sadaka/manifest.json',
        '/Sadaka/icon.png',
        '/Sadaka/asma2.js',
        '/Sadaka/khatma.js',
        '/Sadaka/islamicContent.js',
        '/Sadaka/rareRecitations.js'
      ]);
    })
  );
});

// 2️⃣ حدث الـ activate: تفعيل السيطرة الفورية وتنظيف الكاشات القديمة
self.addEventListener('activate', e => {
  e.waitUntil(
    self.clients.claim().then(() => { // السيطرة الفورية على جميع التبويبات المفتوحة
      return caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME && key !== MUSHAF_CACHE) {
              return caches.delete(key);
            }
          })
        );
      });
    })
  );
});

// 3️⃣ حدث الـ fetch: جلب البيانات وتشغيل التطبيق أوفلاين بالكامل
self.addEventListener('fetch', e => {
  // استثناء روابط الـ API والـ Audio الخارجية من الكاش لضمان عملها الحي
  if (e.request.url.includes('api.alquran.cloud') || 
      e.request.url.includes('mp3quran.net') || 
      e.request.url.includes('islamic.network') ||
      e.request.url.includes('aladhan.com') ||
      e.request.url.includes('quran.com')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});

// ========================================================
// ⏰ منظومة التذكير الدوري المتجدد (بالترتيب وبدون تكرار)
// ========================================================
const REMINDERS = [
  { title: '🤲 صلِّ على النبي ﷺ', body: 'اللهم صل وسلم وبارك على نبينا محمد' },
  { title: '🌟 أستغفر الله', body: 'أستغفر الله العظيم وأتوب إليه' },
  { title: '📿 سبحان الله وبحمده', body: 'سبحان الله وبحمده سبحان الله العظيم' },
  { title: '💛 لا إله إلا الله', body: 'لا إله إلا الله وحده لا شريك له' },
  { title: '🤲 يا حي يا قيوم', body: 'يا حي يا قيوم برحمتك أستغيث' },
  { title: '🌙 الحمد لله', body: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ' }
];

let timerId = null; 
let reminderMinutes = 60; // المدة الافتراضية ساعة كاملة
let currentZikrIdx = 0;   // العداد الذكي لتتبع الذكر الحالي

// الاستماع للأوامر القادمة من الـ index.html لتعديل وقت التذكير الدوري
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SET_INTERVAL') {
    reminderMinutes = e.data.minutes;
    if (timerId) clearTimeout(timerId); 
    scheduleReminder();
  }
  if (e.data && e.data.type === 'STOP') {
    reminderMinutes = 0;
    if (timerId) clearTimeout(timerId);
  }
});

// دالة الجدولة الدورية الذكية والمنسقة
function scheduleReminder() {
  if (reminderMinutes === 0) return;

  timerId = setTimeout(async () => {
    // اختيار الذكر الحالي بناءً على العداد (بالترتيب التنازلي للمصفوفة)
    const pick = REMINDERS[currentZikrIdx];
    
    try {
      await self.registration.showNotification(pick.title, {
        body: pick.body,
        icon: 'icon.png',
        vibrate: [200, 100, 200],
        tag: 'zekr-reminder',
        renotify: true
      });
    } catch (err) {
      console.log('Notification error:', err);
    }

    // 🔥 الانتقال للذكر التالي والعودة للصفر تلقائياً لو وصلنا لآخر المصفوفة
    currentZikrIdx = (currentZikrIdx + 1) % REMINDERS.length;

    // إعادة استدعاء الدالة لضمان استمرار حلقة التذكير للأبد
    scheduleReminder(); 
  }, reminderMinutes * 60 * 1000); // تحويل الدقائق لملي ثانية
}
