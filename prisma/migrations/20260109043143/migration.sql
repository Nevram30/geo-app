/*
  Warnings:

  - The values [PENDING,UNDER_REVIEW,REQUIRES_REVISION] on the enum `ZoningApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ZoningApplicationStatus_new" AS ENUM ('SUBMITTED', 'REVIEWING', 'REJECTED', 'APPROVED', 'FOR_EVALUATION');
ALTER TABLE "public"."ZoningApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ZoningApplication" ALTER COLUMN "status" TYPE "ZoningApplicationStatus_new" USING ("status"::text::"ZoningApplicationStatus_new");
ALTER TYPE "ZoningApplicationStatus" RENAME TO "ZoningApplicationStatus_old";
ALTER TYPE "ZoningApplicationStatus_new" RENAME TO "ZoningApplicationStatus";
DROP TYPE "public"."ZoningApplicationStatus_old";
ALTER TABLE "ZoningApplication" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
COMMIT;

-- AlterTable
ALTER TABLE "ZoningApplication" ADD COLUMN     "otherDocuments" TEXT,
ADD COLUMN     "proofOfOwnership" TEXT,
ADD COLUMN     "siteDevelopmentPlan" TEXT,
ADD COLUMN     "taxDeclaration" TEXT,
ADD COLUMN     "vicinityMap" TEXT,
ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
