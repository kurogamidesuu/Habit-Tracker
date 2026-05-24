import { useEffect } from "react";
import { getToken, messaging } from '../lib/firebase';

const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const useNotifications = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(),
        });

        if (!token) return;

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
      } catch (e) {
        console.error('Failed to setup notifications:', e);
      }
    };

    setupNotifications();
  }, []);
}