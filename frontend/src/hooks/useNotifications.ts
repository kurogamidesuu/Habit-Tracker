import { useEffect } from "react";
import { getToken, messaging } from '../lib/firebase';

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const useNotifications = () => {
  console.log('useNotifications hook running');
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        const activeWorker = registration.active ??
          await new Promise<ServiceWorker>(resolve => {
            const worker = registration.installing ?? registration.waiting;
            if (!worker) return;
            worker.addEventListener('statechange', (e) => {
              if ((e.target as ServiceWorker).state === 'activated') {
                resolve(e.target as ServiceWorker);
              }
            });
          });

        activeWorker.postMessage({
          type: 'FIREBASE_CONFIG',
          config: firebaseConfig,
        });

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          console.error('No FCM token received');
          return;
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const authToken = localStorage.getItem('habit-token');

        await fetch(`${API_URL}/push/subscribe`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: { fcmToken: token },
            timezone,
          })
        });

        console.log('Push subscription saved successfully');
      } catch (e) {
        console.error('Failed to setup notifications:', e);
      }
    };

    setupNotifications();
  }, []);
};