/*
  Warnings:

  - You are about to drop the column `workHours` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "workHours";

-- AlterTable
ALTER TABLE "UserSystem" ADD COLUMN     "workHours" INTEGER NOT NULL DEFAULT 0;
