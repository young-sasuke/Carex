/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactDesignation` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationInDays` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freeOrPaid` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interests` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stream` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "date",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "contactDesignation" TEXT NOT NULL,
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL,
ADD COLUMN     "durationInDays" INTEGER NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "freeOrPaid" TEXT NOT NULL,
ADD COLUMN     "interests" TEXT NOT NULL,
ADD COLUMN     "organizerName" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stream" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";
