
// ===========================================
// sw.js — Service Worker لتطبيق "كُن ذا أثر"
// ===========================================
const APP_VERSION = 'v10';
const APP_SHELL_CACHE = `athr-app-shell-${APP_VERSION}`;
const AUDIO_CACHE  = 'athr-audio-cache-v1';   // دائم — سور/تلاوات/أذان محمّلة يدويًا
const MUSHAF_CACHE = 'athr-mushaf-cache-v1';  // دائم — صفحات المصحف المصوّر

// ملفات قشرة التطبيق (خفيفة، تتحمّل تلقائيًا)
const APP_SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './asma2.js',
  './khatma.js',
  './islamicContent.js',
  './rareRecitations.js',
  './radio.js',

  './quranInsights.js',
  './obeyPlan.js',
  './janaza.js',
  './athr-effects.js',
  './shareKhair.js',
  './abwabElm.js',
  './athrAcademy.js',
  './adhanPlayer.js',
  './shareApp.js',
  './heartMirror.js',
  './downloadsManager.js',
  './community/community.js',
  './community/community.css',
  './prayforthem/prayforthem.js',
  './prayforthem/prayforthem.css'
];

const MUSHAF_IMAGE_HOST = 'cdn.myquran.com';
const CACHEABLE_AUDIO_HOSTS = [
  'server10.mp3quran.net', 'server13.mp3quran.net', 'server8.mp3quran.net',
  'server7.mp3quran.net', 'server12.mp3quran.net', 'server11.mp3quran.net',
  'server16.mp3quran.net', 'cdn.islamic.network', 'www.everyayah.com'
];

// ===========================================
// التثبيت والتفعيل
// ===========================================
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(cache =>
      cache.addAll(APP_SHELL_FILES).catch(err => console.log('shell cache warn:', err))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(k => k.startsWith('athr-app-shell-') && k !== APP_SHELL_CACHE)
        .map(k => caches.delete(k))
      // ملاحظة: كاش المصحف والصوتيات (AUDIO_CACHE / MUSHAF_CACHE) لا يُحذفان هنا أبدًا
      // حتى لا تُفقد التحميلات اللي المستخدم عملها يدويًا
    )).then(() => self.clients.claim())
  );
});

// ===========================================
// الفلترة
// ===========================================
function isMushafImage(url) {
  return url.hostname === MUSHAF_IMAGE_HOST;
}
function isCacheableAudio(url) {
  if (CACHEABLE_AUDIO_HOSTS.includes(url.hostname)) return true;
 if (url.pathname.includes('/audio/')) return true; // ملفات محلية (تلاوات خاشعة / أذان)
  return false;
}

// ===========================================
// الاعتراض (fetch)
// ===========================================
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  if (isMushafImage(url)) {
    event.respondWith(cacheFirst(req, MUSHAF_CACHE));
    return;
  }
  if (isCacheableAudio(url)) {
    event.respondWith(cacheFirst(req, AUDIO_CACHE));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req, APP_SHELL_CACHE));
    return;
  }
  // أي حاجة تانية (APIs خارجية، إلخ) تسيبها تعدي عادي من غير كاش
});
async function cacheFirst(request, cacheName) {
  console.log('🔵 [SW] طلب جديد:', request.url, '| Range:', request.headers.get('range'));

  const cache = await caches.open(cacheName);
  const rangeHeader = request.headers.get('range');
  const lookupRequest = rangeHeader ? new Request(request.url, { method: 'GET' }) : request;

  const cached = await cache.match(lookupRequest);
  console.log('🔵 [SW] نتيجة البحث في الكاش:', cached ? 'لقيت الملف ✅' : 'مش لاقي حاجة ❌');

  if (cached) {
    if (rangeHeader) {
      console.log('🔵 [SW] هقطّع الملف بسبب Range header');
      return serveRangeFromCachedResponse(cached, rangeHeader);
    }
    return cached;
  }

  try {
    const response = await fetch(request);
    console.log('🔵 [SW] جبت من النت، الحالة:', response.status);
    if (response && response.status === 200) {
      cache.put(lookupRequest, response.clone());
    }
    return response;
  } catch (e) {
    console.log('🔴 [SW] فشل الجلب من النت (طبيعي لو أوفلاين):', e.message);
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function serveRangeFromCachedResponse(cachedResponse, rangeHeader) {
  try {
    const blob = await cachedResponse.clone().blob();
    const size = blob.size;
    console.log('🔵 [SW] حجم الملف في الكاش:', size, 'bytes');
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    const start = match ? parseInt(match[1], 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : size - 1;
    const chunk = blob.slice(start, end + 1);

    return new Response(chunk, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Type': blob.type || 'audio/mpeg',
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunk.size,
        'Accept-Ranges': 'bytes'
      }
    });
  } catch (e) {
    console.log('🔴 [SW] خطأ أثناء التقطيع:', e.message);
    return new Response('', { status: 500 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then(response => {
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  }).catch(() => cached || new Response('', { status: 504, statusText: 'Offline' }));
  return cached || networkPromise;
}
// ===========================================
// الرسائل (Messages من index.html)
// ===========================================
self.addEventListener('message', (event) => {
  const data = event.data || {};
  const client = event.source;

  switch (data.type) {
    case 'DOWNLOAD_MUSHAF':
      downloadMushafPages(client);
      break;

    case 'CACHE_AUDIO_URL':
      cacheAudioUrl(data.url, client, data.label || '');
      break;

    case 'CACHE_AUDIO_BATCH':
      cacheAudioBatch(data.items, client);
      break;

    case 'DELETE_MUSHAF_CACHE':
      caches.delete(MUSHAF_CACHE).then(() =>
        notifyClient(client, { type: 'MUSHAF_DELETED' })
      );
      break;

    case 'DELETE_ALL_AUDIO':
      caches.delete(AUDIO_CACHE).then(() =>
        notifyClient(client, { type: 'AUDIO_CACHE_CLEARED' })
      );
      break;

    case 'GET_CACHE_INFO':
      getCacheInfo(client);
      break;

    case 'SET_NOTIF_CONFIG':
      setNotifConfig(data);
      break;

    case 'CLEAR_NOTIF_CONFIG':
      clearNotifConfig();
      break;
  }
});

function notifyClient(client, msg) {
  if (client && client.postMessage) client.postMessage(msg);
}

// ===========================================
// تحميل صفحات المصحف المصوّر (604 صفحة) — بزرار فقط
// ===========================================
async function downloadMushafPages(client) {
  const cache = await caches.open(MUSHAF_CACHE);
  const total = 604;
  let done = 0, failed = 0, totalBytes = 0;

  for (let p = 1; p <= total; p++) {
    const url = `https://cdn.myquran.com/img/page/${p}.png`;
    try {
      const already = await cache.match(url);
      if (!already) {
        const res = await fetch(url);
        if (res && res.ok) {
          const cl = res.headers.get('content-length');
          if (cl) totalBytes += parseInt(cl, 10);
          await cache.put(url, res.clone());
        } else failed++;
      } else {
        const cl = already.headers.get('content-length');
        if (cl) totalBytes += parseInt(cl, 10);
      }
    } catch (e) { failed++; }
    done++;
    notifyClient(client, { type: 'MUSHAF_PROGRESS', done, total, failed, totalBytes });
    await new Promise(r => setTimeout(r, 25));
  }
  notifyClient(client, { type: 'MUSHAF_DONE', done, total, failed, totalBytes });
}

// ===========================================
// تحميل ملف صوت واحد (سورة بقارئ معيّن / تلاوة / أذان) وتخزينه دائمًا
// ===========================================
async function cacheAudioUrl(url, client, label) {
  if (!url) return;
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const existing = await cache.match(url);
    if (existing) {
      notifyClient(client, { type: 'AUDIO_CACHED', url, label, alreadyCached: true });
      return;
    }
    const response = await fetch(url);
    if (response && response.ok) {
      await cache.put(url, response.clone());
      notifyClient(client, { type: 'AUDIO_CACHED', url, label, alreadyCached: false });
    } else {
      notifyClient(client, { type: 'AUDIO_CACHE_FAILED', url, label });
    }
  } catch (e) {
    notifyClient(client, { type: 'AUDIO_CACHE_FAILED', url, label, error: String(e) });
  }
}

// ===========================================
// تحميل مجموعة ملفات صوتية بالتتابع (مثلاً كل سور قارئ معيّن) مع تقرير تقدّم
// ===========================================
async function cacheAudioBatch(items, client) {
  if (!items || !items.length) return;
  const cache = await caches.open(AUDIO_CACHE);
  let done = 0, failed = 0, totalBytes = 0;
  const total = items.length;

  for (const item of items) {
    try {
      const already = await cache.match(item.url);
      if (!already) {
        const res = await fetch(item.url);
        if (res && res.ok) {
          const cl = res.headers.get('content-length');
          if (cl) totalBytes += parseInt(cl, 10);
          await cache.put(item.url, res.clone());
        } else failed++;
      } else {
        const cl = already.headers.get('content-length');
        if (cl) totalBytes += parseInt(cl, 10);
      }
    } catch (e) { failed++; }
    done++;
    notifyClient(client, { type: 'BATCH_PROGRESS', done, total, failed, batchId: item.batchId, totalBytes });
    await new Promise(r => setTimeout(r, 30));
  }
  notifyClient(client, { type: 'BATCH_DONE', done, total, failed, batchId: items[0] ? items[0].batchId : null, totalBytes });
}
// ===========================================
// معلومات الكاش (لعرضها في شاشة الإعدادات)
// ===========================================
async function getCacheInfo(client) {
  try {
    const audioCache = await caches.open(AUDIO_CACHE);
    const mushafCache = await caches.open(MUSHAF_CACHE);
    const audioKeys = await audioCache.keys();
    const mushafKeys = await mushafCache.keys();
    notifyClient(client, {
      type: 'CACHE_INFO',
      audioCount: audioKeys.length,
      mushafCount: mushafKeys.length,
      mushafTotal: 604
    });
  } catch (e) {}
}

// ===========================================
// نظام الإشعارات الدورية (تذكير بالأذكار)
// ملاحظة: المتصفح ممكن يقفل الـ Service Worker بعد فترة خمول،
// فالتوقيت هنا "أفضل مجهود" مش مضمون 100% زي Push حقيقي من سيرفر.
// ===========================================
let notifConfig = null;
let notifIndex = 0;

function setNotifConfig(data) {
  notifConfig = {
    intervalMinutes: data.intervalMinutes || 60,
    mode: data.mode || 'sequential',
    items: data.items || []
  };
  notifIndex = 0;
  sendNotifTick();
}

function clearNotifConfig() {
  notifConfig = null;
}

function sendNotifTick() {
  if (!notifConfig || !notifConfig.items.length) return;
  
  let text;
  if (notifConfig.mode === 'random') {
    text = notifConfig.items[Math.floor(Math.random() * notifConfig.items.length)];
  } else {
    text = notifConfig.items[notifIndex % notifConfig.items.length];
    notifIndex++;
  }

  self.registration.showNotification('تذكير من "أثر" 🕌', {
    body: text,
    icon: './icon.png',
    badge: './icon.png',
    dir: 'rtl',
    lang: 'ar',
    tag: 'athr-reminder',
    renotify: true
  });
}

// =========================================================================
// المحرك السحري: استقبال نبضات السيرفر (FCM) لتشغيل الأذان والإشعارات غصب عن النظام أوفلاين
// =========================================================================
self.addEventListener('push', (event) => {
  let payload = { title: 'تذكير الصلاة', body: 'حان الآن وقت الصلاة' };
  try { payload = event.data.json(); } catch (e) {}

  const options = {
    body: payload.body,
    icon: './icon.png',
    badge: './icon.png',
    dir: 'rtl',
    lang: 'ar',
    tag: payload.tag || 'adhan-trigger',
    renotify: true,
    data: { audioUrl: payload.audioUrl || 'audio/adhan_notification.mp3' }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notifData = event.notification.data || {};

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'PLAY_BACKGROUND_AUDIO', url: notifData.audioUrl });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./').then(windowClient => {
          setTimeout(() => {
            if (windowClient) windowClient.postMessage({ type: 'PLAY_BACKGROUND_AUDIO', url: notifData.audioUrl });
          }, 1500);
        });
      }
    })
  );
});
