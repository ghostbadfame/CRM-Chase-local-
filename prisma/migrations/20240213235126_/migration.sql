/*
  Warnings:

  - The primary key for the `Lead` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_pkey",
ALTER COLUMN "lead_id" DROP DEFAULT,
ALTER COLUMN "lead_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lead_pkey" PRIMARY KEY ("lead_id");
DROP SEQUENCE "Lead_lead_id_seq";
