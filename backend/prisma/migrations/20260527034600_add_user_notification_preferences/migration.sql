-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyReminderTime" TEXT NOT NULL DEFAULT '20:00',
ADD COLUMN     "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "streakWarningEnabled" BOOLEAN NOT NULL DEFAULT true;
