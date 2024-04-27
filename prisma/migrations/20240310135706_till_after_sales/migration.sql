-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "afterSaleService" BOOLEAN,
ADD COLUMN     "engineerTask" TEXT,
ADD COLUMN     "technicianTask" TEXT;

-- AlterTable
ALTER TABLE "Remarks" ADD COLUMN     "afterSaleService" BOOLEAN,
ADD COLUMN     "clientStatus" TEXT,
ADD COLUMN     "engineerTask" TEXT,
ADD COLUMN     "siteStage" TEXT,
ADD COLUMN     "technicianTask" TEXT;
