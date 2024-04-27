/*
  Warnings:

  - You are about to drop the column `remark` on the `Lead` table. All the data in the column will be lost.
  - The `followupDate` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[lead_id]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "remark",
ADD COLUMN     "previous_id" TEXT[],
DROP COLUMN "followupDate",
ADD COLUMN     "followupDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Remarks" (
    "remarkId" TEXT NOT NULL,
    "leadNO" TEXT NOT NULL,
    "empNo" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "empName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Remarks_pkey" PRIMARY KEY ("remarkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Remarks_remarkId_key" ON "Remarks"("remarkId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_lead_id_key" ON "Lead"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Remarks" ADD CONSTRAINT "Remarks_leadNO_fkey" FOREIGN KEY ("leadNO") REFERENCES "Lead"("leadNo") ON DELETE RESTRICT ON UPDATE CASCADE;
