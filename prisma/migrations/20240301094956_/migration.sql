/*
  Warnings:

  - A unique constraint covering the columns `[govtID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `govtID` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "assignToDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "previous_id" DROP NOT NULL,
ALTER COLUMN "previous_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "govtID" SET NOT NULL;

-- CreateTable
CREATE TABLE "designs" (
    "designId" TEXT NOT NULL,
    "leadNO" TEXT NOT NULL,
    "empNo" TEXT NOT NULL,
    "empName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "design" TEXT NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("designId")
);

-- CreateIndex
CREATE UNIQUE INDEX "designs_designId_key" ON "designs"("designId");

-- CreateIndex
CREATE UNIQUE INDEX "User_govtID_key" ON "User"("govtID");

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_leadNO_fkey" FOREIGN KEY ("leadNO") REFERENCES "Lead"("leadNo") ON DELETE RESTRICT ON UPDATE CASCADE;
