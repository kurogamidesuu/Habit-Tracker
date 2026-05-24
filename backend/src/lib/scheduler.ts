import { messaging } from "./firebase"
import cron from 'node-cron';
import { prisma } from "./prisma";

const sendNotificationToUser = async (fcmToken: string, title: string, body: string) => {
  try {
    await messaging.send({
      token: fcmToken,
      notification: { title, body },
      webpush: {
        notification: {
          title,
          body,
          icon: 'https://habit-tracker-chi-azure.vercel.app//pwa-192x192.png',
          badge: 'https://habit-tracker-chi-azure.vercel.app//pwa-192x192.png',
        }
      }
    });
  } catch (e) {
    console.error(`Failed to send notifications to ${fcmToken}:`, e);
  }
}

cron.schedule('* * * * *', async () => {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      include: {
        user: {
          include: {
            habits: true,
          }
        }
      }
    });

    for (const sub of subscriptions) {
      const { subscription, timezone } = sub;
      const fcmToken = JSON.parse(subscription).fcmToken;

      const now = new Date();
      const userTime = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(now);

      const hour = parseInt(userTime.find(p => p.type === 'hour')!.value);
      const minute = parseInt(userTime.find(p => p.type === 'minute')!.value);

      if (hour === 20 && minute === 0) {
        const incomplete = sub.user.habits.filter(h => !h.isComplete);
        if (incomplete.length > 0) {
          await sendNotificationToUser(
            fcmToken,
            'Kintsugin Reminder',
            `${sub.user.username}! Here to remind you that you have ${incomplete.length} habit${incomplete.length > 1 ? 's' : ''} left to complete today!`,
          );
        }
      }

      if (hour === 23 && minute === 0) {
        const atRisk = sub.user.habits.filter(h => !h.isComplete && h.currentStreak > 0);
        if (atRisk.length > 0) {
          await sendNotificationToUser(
            fcmToken,
            'Streak At Risk!',
            `${sub.user.username}! Your ${atRisk.length} streak${atRisk.length > 1 ? 's' : ''} will reset at midnight. Complete them now!`,
          );
        }
      }
    }
  } catch (e) {
    console.error('Scheduler Error:', e);
  }
});

console.log('Scheduler started');