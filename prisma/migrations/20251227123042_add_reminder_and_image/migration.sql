-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('monthly', 'date');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "reminderType" "ReminderType";
