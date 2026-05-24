/*
  Warnings:

  - You are about to drop the column `streak` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `currentStreak` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStreak` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "streak",
ADD COLUMN     "currentStreak" INTEGER NOT NULL,
ADD COLUMN     "maxStreak" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "HabitLog" (
    "id" SERIAL NOT NULL,
    "habitId" INTEGER NOT NULL,
    "dateString" TEXT NOT NULL,

    CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_dateString_key" ON "HabitLog"("habitId", "dateString");

-- AddForeignKey
ALTER TABLE "HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
