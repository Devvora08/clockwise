/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `System` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "System_adminId_key" ON "System"("adminId");
