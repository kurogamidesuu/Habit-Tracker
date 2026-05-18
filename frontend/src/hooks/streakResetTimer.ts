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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkMidnight();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [onMidnight]);
};