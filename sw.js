/**
 * كُن ذا أثر - Service Worker (Offline First Architecture)
 * مبرمج بالكامل للعمل بدون إنترنت وحفظ الخط العثماني والمصحف والإشعارات
 */

const CACHE_NAME = 'ken-za-athar-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // الخطوط العثمانية وخطوط العناوين لضمان ظهورها بدون نت
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  // ملفات الـ JS الفرعية الخاصة بك (إذا كانت موجودة منفصلة)
  './asma2.js',
  './khatma.js',
  './islamicContent.js',
  './rareRecitations.js',
  './radio.js',
  './quranData.js',
  './quranInsights.js',
  './obeyPlan.js',
  './janaza.js',
  './shareKhair.js'
];

// 1. مرحلة التثبيت: حفظ الملفات الأساسية والخطوط في الكاش فوراً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('--- [Service Worker] تم فتح الكاش بنجاح وحفظ الأصول الأساسية والخطوط ---');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. مرحلة التنشيط: تنظيف أي كاش قديم لضمان تحديثات خفيفة ومستقرة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] حذف الكاش القديم المتضارب:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. استراتيجية جلب البيانات (Cache First / Network Fallback) للعمل الكامل أوفلاين
self.addEventListener('fetch', (event) => {
  // عدم التدخل في طلبات البث الحي للإذاعات أو قواعد بيانات Firebase الخارجية
  if (event.request.url.includes('firebase') || event.request.url.includes('stream') || event.request.url.includes('.mp3')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // إرجاع النسخة المخزنة فوراً (سريعة وبدون نت)
      }

      // إذا لم تكن موجودة، يتم جلبها من الشبكة وحفظها تلقائياً (مثل استدعاءات آيات القرآن والتفاسير)
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // في حال انقطاع النت التام وطلب صفحة فرعية، يتم إرجاع الصفحة الرئيسية المخبأة
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ==========================================
// 4. محرك إدارة الإشعارات والتذكيرات في الخلفية (Background Notifications)
// ==========================================
let notifTimer = null;
let config = {
  intervalMinutes: 60,
  mode: 'sequential',
  items: [],
  currentIndex: 0
};

// استقبال التكوينات من واجهة التطبيق الرئيسية (ملف الـ JS والـ HTML)
self.addEventListener('message', (event) => {
  const data = event.data;
  
  if (data.type === 'SET_NOTIF_CONFIG') {
    config.intervalMinutes = data.intervalMinutes || 60;
    config.mode = data.mode || 'sequential';
    config.items = data.items || [];
    config.currentIndex = 0;
    
    // إعادة ضبط وتدوير المؤقت تلقائياً
    resetNotificationTimer();
    console.log('✅ [Service Worker] تم استقبال أذكار التذكير المخصصة وتفعيل العداد الدورية بنجاح.');
  }
  
  if (data.type === 'CLEAR_NOTIF_CONFIG') {
    if (notifTimer) clearInterval(notifTimer);
    config.items = [];
    console.log('🔕 [Service Worker] تم تعطيل جميع الإشعارات الخلفية الدورية بناءً على رغبة المستخدم.');
  }
});

function resetNotificationTimer() {
  if (notifTimer) clearInterval(notifTimer);
  if (config.items.length === 0) return;

  const intervalMs = config.intervalMinutes * 60 * 1000;
  
  notifTimer = setInterval(() => {
    sendNotificationBroadcast();
  }, intervalMs);
}

function sendNotificationBroadcast() {
  if (config.items.length === 0) return;
  
  let textToShow = '';
  
  if (config.mode === 'random') {
    const randomIndex = Math.floor(Math.random() * config.items.length);
    textToShow = config.items[randomIndex];
  } else {
    // الترتيب المتوالي
    if (config.currentIndex >= config.items.length) {
      config.currentIndex = 0;
    }
    textToShow = config.items[config.currentIndex];
    config.currentIndex++;
  }

  const options = {
    body: textToShow,
    icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png', // أيقونة إسلامية افتراضية راقية
    badge: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png',
    dir: 'rtl',
    lang: 'ar',
    tag: 'daily-reminder',
    renotify: true,
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification('✨ كُنْ ذَا أَثَرٍ.. ذِكْرُ الرَّحْمَنِ', options);
}

// التفاعل عند ضغط المستخدم على الإشعار في هاتف الأندرويد أو الآيفون
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // فتح التطبيق فوراً عند الضغط على التذكير
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('./');
    })
  );
});

