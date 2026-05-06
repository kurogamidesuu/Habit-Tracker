import { App } from "@capacitor/app";
import { useEffect } from "react"

export const useResetStreak = (onMidnight: () => void) => {
  useEffect(() => {
    let currentDay = new Date().toLocaleDateString('en-CA');

    const checkMidnight = () => {
      const rightNow = new Date().toLocaleDateString('en-CA');
      if (rightNow !== currentDay) {
        currentDay = rightNow;
        onMidnight();
      }
    };

    const intervalId = setInterval(checkMidnight, 60000);

    const appStateListener = App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        checkMidnight();
      }
    });

    return () => {
      clearInterval(intervalId);
      appStateListener.then(listener => listener.remove());
    }
  }, [onMidnight]);
};