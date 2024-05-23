-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "referenceMonth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "electricEnergyId" INTEGER,
    "sceeEnergyId" INTEGER,
    "compensatedEnergyId" INTEGER,
    "municipalPublicLightingContributionId" INTEGER,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricEnergy" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricEnergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCEEEnergy" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SCEEEnergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompensatedEnergy" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompensatedEnergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MunicipalPublicLightingContribution" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MunicipalPublicLightingContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_electricEnergyId_key" ON "Invoice"("electricEnergyId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_sceeEnergyId_key" ON "Invoice"("sceeEnergyId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_compensatedEnergyId_key" ON "Invoice"("compensatedEnergyId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_municipalPublicLightingContributionId_key" ON "Invoice"("municipalPublicLightingContributionId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_electricEnergyId_fkey" FOREIGN KEY ("electricEnergyId") REFERENCES "ElectricEnergy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_sceeEnergyId_fkey" FOREIGN KEY ("sceeEnergyId") REFERENCES "SCEEEnergy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_compensatedEnergyId_fkey" FOREIGN KEY ("compensatedEnergyId") REFERENCES "CompensatedEnergy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_municipalPublicLightingContributionId_fkey" FOREIGN KEY ("municipalPublicLightingContributionId") REFERENCES "MunicipalPublicLightingContribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
