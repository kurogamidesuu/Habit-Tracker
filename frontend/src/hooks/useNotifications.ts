import { useEffect } from "react";
import { firebaseConfig, getToken, messaging } from '../lib/firebase';
import { useAuth } from "./useAuth";

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const useNotifications = () => {
  const { accessToken } = useAuth();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const configParams = new URLSearchParams({
          apiKey: firebaseConfig.apiKey || '',
          authDomain: firebaseConfig.authDomain || '',
          projectId: firebaseConfig.projectId || '',
          storageBucket: firebaseConfig.storageBucket || '',
          messagingSenderId: firebaseConfig.messagingSenderId || '',
          appId: firebaseConfig.appId || '',
        }).toString();

        const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${configParams}`);

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          console.error('No FCM token received');
          return;
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        await fetch(`${API_URL}/push/subscribe`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: { fcmToken: token },
            timezone,
          })
        });
      } catch (e) {
        console.error('Failed to setup notifications:', e);
      }
    };

    setupNotifications();
  }, []);
};