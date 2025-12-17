-- CreateEnum
CREATE TYPE "LotOwnershipType" AS ENUM ('TRANSFER_CERTIFICATE_OF_TITLE', 'LEASE_CONTRACT', 'AWARD_NOTICE', 'DEED_OF_SALE', 'MEMORANDUM_OF_AGREEMENT', 'AFFIDAVIT_OF_CONSENT', 'SPECIAL_POWER_OF_ATTORNEY');

-- CreateEnum
CREATE TYPE "ZoningApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REQUIRES_REVISION');

-- CreateTable
CREATE TABLE "ZoningApplication" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantAddress" TEXT NOT NULL,
    "applicantContact" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "projectDescription" TEXT,
    "projectBoundaries" TEXT,
    "projectObjectives" TEXT,
    "zoningExceptionReason" TEXT,
    "isRepresentative" BOOLEAN NOT NULL DEFAULT false,
    "representativeName" TEXT,
    "lotOwnershipType" "LotOwnershipType",
    "taxClearanceOriginal" TEXT,
    "taxClearancePhotocopy" TEXT,
    "transferCertificateOfTitle" TEXT,
    "leaseContract" TEXT,
    "awardNotice" TEXT,
    "deedOfSale" TEXT,
    "memorandumOfAgreement" TEXT,
    "affidavitOfConsent" TEXT,
    "specialPowerOfAttorney" TEXT,
    "authorityToSign" TEXT,
    "lotPlan" TEXT,
    "architecturalPlan" TEXT,
    "professionalTaxReceipt" TEXT,
    "longFolder" BOOLEAN NOT NULL DEFAULT false,
    "projectDescriptionDoc" TEXT,
    "projectDescriptionPhotocopy" TEXT,
    "authorizationLetter" TEXT,
    "representedPersonId" TEXT,
    "representativeId" TEXT,
    "status" "ZoningApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "remarks" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoningApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZoningApplication_applicationNo_key" ON "ZoningApplication"("applicationNo");

-- CreateIndex
CREATE INDEX "ZoningApplication_status_idx" ON "ZoningApplication"("status");

-- CreateIndex
CREATE INDEX "ZoningApplication_userId_idx" ON "ZoningApplication"("userId");

-- CreateIndex
CREATE INDEX "ZoningApplication_applicationNo_idx" ON "ZoningApplication"("applicationNo");

-- AddForeignKey
ALTER TABLE "ZoningApplication" ADD CONSTRAINT "ZoningApplication_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoningApplication" ADD CONSTRAINT "ZoningApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
