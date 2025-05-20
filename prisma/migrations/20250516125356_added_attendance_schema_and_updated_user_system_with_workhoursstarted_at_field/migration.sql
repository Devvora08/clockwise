-- AlterTable
ALTER TABLE "UserSystem" ADD COLUMN     "workHoursStartedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "pauseTimes" JSONB,
    "endTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_systemId_date_key" ON "Attendance"("userId", "systemId", "date");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_systemId_fkey" FOREIGN KEY ("userId", "systemId") REFERENCES "UserSystem"("userId", "systemId") ON DELETE CASCADE ON UPDATE CASCADE;
