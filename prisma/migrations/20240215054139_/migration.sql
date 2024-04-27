/*
  Warnings:

  - A unique constraint covering the columns `[contact]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "altContact" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "employeeID" TEXT,
ADD COLUMN     "govtID" TEXT,
ADD COLUMN     "referenceEmployee" TEXT,
ADD COLUMN     "reportingManager" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_key" ON "User"("contact");
