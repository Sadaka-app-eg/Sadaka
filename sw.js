// ===== الكود الموجود (خليه زي ما هو) =====
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('sadaqa-v1').then(cache => {
      return cache.addAll(['/Sadaka/', '/Sadaka/index.html']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});

const REMINDERS = [
  { title:'🤲 صلِّ على النبي ﷺ', body:'اللهم صل وسلم وبارك على نبينا محمد' },
  { title:'🌟 أستغفر الله', body:'أستغفر الله العظيم وأتوب إليه' },
  { title:'📿 سبحان الله وبحمده', body:'سبحان الله وبحمده سبحان الله العظيم' },
  { title:'💛 لا إله إلا الله', body:'لا إله إلا الله وحده لا شريك له' },
  { title:'🤲 يا حي يا قيوم', body:'يا حي يا قيوم برحمتك أستغيث' },
  { title:'🌙 الحمد لله', body:'الحمد لله على كل حال' },
];

// ⚡ 1. حط السطر ده هنا بالظبط (تحت مصفوفة الـ REMINDERS مباشرة)
let timerId = null; 
let reminderMinutes = 60;

// ⚡ 2. هنا الـ listener المطور اللي بيستقبل الأوامر ويمنع التداخل
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SET_INTERVAL') {
    reminderMinutes = e.data.minutes;
    if(timerId) clearTimeout(timerId); // إيقاف أي توقيت قديم قبل ما نشغل الجديد
    scheduleReminder();
  }
  if(e.data && e.data.type === 'STOP') {
    reminderMinutes = 0;
    if(timerId) clearTimeout(timerId);
  }
});

// ⚡ 3. هنا دالة الجدولة المحدثة المؤمنة بـ timerId
function scheduleReminder() {
  timerId = setTimeout(async () => {
    if(reminderMinutes === 0) return;
    const pick = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
    await self.registration.showNotification(pick.title, {
      body: pick.body,
      icon: 'https://img.icons8.com/emoji/192/crescent-moon-emoji.png',
      vibrate: [200, 100, 200],
      tag: 'zekr-reminder',
      renotify: true,
    });
    scheduleReminder(); // تكرار الحلقة بنجاح
  }, reminderMinutes * 60 * 1000);
}
  }
});

function scheduleReminder() {
  setTimeout(async () => {
    if(reminderMinutes === 0) return;
    const pick = REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
    await self.registration.showNotification(pick.title, {
      body: pick.body,
      icon: 'https://img.icons8.com/emoji/192/crescent-moon-emoji.png',
      vibrate: [200, 100, 200],
      tag: 'zekr-reminder',
      renotify: true,
    });
    scheduleReminder();
  }, reminderMinutes * 60 * 1000);
}
