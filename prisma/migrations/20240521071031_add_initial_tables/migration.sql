/*
  Warnings:

  - You are about to drop the `municipalPublicLightingContribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_municipalPublicLightingContributionId_fkey";

-- DropTable
DROP TABLE "municipalPublicLightingContribution";

-- CreateTable
CREATE TABLE "MunicipalPublicLightingContribution" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MunicipalPublicLightingContribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_municipalPublicLightingContributionId_fkey" FOREIGN KEY ("municipalPublicLightingContributionId") REFERENCES "MunicipalPublicLightingContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
