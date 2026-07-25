// ==========================================
// 🚀 Service Worker الخاص بإشعارات Firebase FCM
// ==========================================

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// نفس بيانات تهيئة فايرباز الموجودة عندك
const firebaseConfig = {
  apiKey: "AIzaSyCULaDRVQ9SWS07zs2WL3D-ANj-wHeoYWg",
  authDomain: "sadaka-app-6637e.firebaseapp.com",
  projectId: "sadaka-app-6637e",
  storageBucket: "sadaka-app-6637e.firebasestorage.app",
  messagingSenderId: "425677494061",
  appId: "1:425677494061:web:0aacb04e72f767ad8925a4",
  measurementId: "G-WE16D4JC8F"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// استقبال الإشعار من السيرفر والموبايل مقفول تماماً
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] وصل إشعار في الخلفية:', payload);
  
  const notificationTitle = payload.notification.title || '✨ أثر - ذكر الله';
  const notificationOptions = {
    body: payload.notification.body,
    icon: './icon.png',
    badge: './icon.png',
    tag: 'athr-fcm-notif',
    renotify: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// فتح التطبيق عند النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('./index.html');
    })
  );
});
