/*
  Warnings:

  - The primary key for the `Lead` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `leadCreationid` on the `Lead` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contact]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_pkey",
DROP COLUMN "leadCreationid",
ADD COLUMN     "lead_id" SERIAL NOT NULL,
ALTER COLUMN "clientStatus" SET DEFAULT 'welcome',
ALTER COLUMN "priority" SET DEFAULT 'p1',
ADD CONSTRAINT "Lead_pkey" PRIMARY KEY ("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_contact_key" ON "Lead"("contact");
