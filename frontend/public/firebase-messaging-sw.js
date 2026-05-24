importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

const urlParams = new URL(location.href).searchParams;

const firebaseConfig = {
  apiKey: urlParams.get("apiKey"),
  authDomain: urlParams.get("authDomain"),
  projectId: urlParams.get("projectId"),
  storageBucket: urlParams.get("storageBucket"),
  messagingSenderId: urlParams.get("messagingSenderId"),
  appId: urlParams.get("appId"),
};

if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification?.title || "Kintsugi";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
