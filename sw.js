const CACHE_NAME = 'sadaka-cache-v1';
const MUSHAF_CACHE = 'mushaf-images-v1';

// حدث الـ install القديم والمضمون
self.addEventListener('install', e => {
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

// حدث الـ activate القديم والمضمون
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== MUSHAF_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// حدث الـ fetch القديم والمضمون
self.addEventListener('fetch', e => {
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

// منظومة التذكير القديمة البسيطة اللي كانت شغالة بـ setTimeout
let timerId = null;
let reminderMinutes = 60;

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

function scheduleReminder() {
  if (reminderMinutes === 0) return;
  timerId = setTimeout(async () => {
    try {
      await self.registration.showNotification('🤲 تذكير بالذكر', {
        body: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ',
        icon: 'icon.png',
        vibrate: [200, 100, 200],
        tag: 'zekr-reminder',
        renotify: true
      });
    } catch (err) {
      console.log(err);
    }
    scheduleReminder();
  }, reminderMinutes * 60 * 1000);
}
