const CACHE_NAME = 'athr-static-v2';
const DYNAMIC_CACHE_NAME = 'athr-dynamic-v2';

// 1. الملفات الأساسية للواجهة والخطوط والمكتبات التي يجب تحميلها فور التثبيت
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'community/community.css',
  'prayforthem/prayforthem.css',
  'asma2.js',
  'khatma.js',
  'islamicContent.js',
  'rareRecitations.js',
  'radio.js',
  'quranData.js',
  'quranInsights.js',
  'obeyPlan.js',
  'janaza.js',
  'shareKhair.js',
  'abwabElm.js',
  'athrAcademy.js',
  'adhanPlayer.js',
  'shareApp.js',
  'heartMirror.js'
];

// تثبيت الـ Service Worker وحفظ الأصول الثابتة فوراً
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🔬 [Service Worker] Caching Static Assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل وتطهير الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log('🗑️ [Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية الكاش الذكية: Cache First للأصول الثابتة، و Network First للمجتمع
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // إذا كان الطلب يخص قراءة قنوات المجتمع أو الفايرباز، نستخدم Network First لحفظ آخر حالة
  if (requestUrl.origin.includes('firestore.googleapis.com') || requestUrl.pathname.includes('community')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const resClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request)) // إذا فصل نت يرجع آخر حاجة مخزنة
    );
    return;
  }

  // باقي الطلبات (الصور، الآيات، الصوتيات المحملة) تعمل بنظام Cache First
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        // لا نحفظ الملفات الصوتية تلقائياً لمنع امتلاء المساحة إلا لو استدعتها دالة التحميل المخصصة
        if (requestUrl.pathname.endsWith('.mp3') || requestUrl.pathname.endsWith('.png')) {
          return networkResponse; 
        }
        return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// الاستماع لرسائل التشغيل والتذكيرات بالخلفية
let notifTimer = null;
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SET_NOTIF_CONFIG') {
    const { intervalMinutes, items, mode } = event.data;
    if (notifTimer) clearInterval(notifTimer);
    
    let currentIndex = 0;
    notifTimer = setInterval(() => {
      if (items.length === 0) return;
      let text = items[currentIndex];
      if (mode === 'random') {
        text = items[Math.floor(Math.random() * items.length)];
      } else {
        currentIndex = (currentIndex + 1) % items.length;
      }

      self.registration.showNotification('✨ ذكر الأثر الخفي', {
        body: text,
        icon: 'icon.png',
        badge: 'icon.png',
        tag: 'athr-reminder'
      });
    }, intervalMinutes * 60 * 1000);
  }

  if (event.data && event.data.type === 'CLEAR_NOTIF_CONFIG') {
    if (notifTimer) clearInterval(notifTimer);
  }
});
