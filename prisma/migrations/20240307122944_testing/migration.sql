/*
  Warnings:

  - You are about to drop the column `employeeID` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "altContact" DROP NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 'p3';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "employeeID";
