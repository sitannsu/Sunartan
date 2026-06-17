-- AlterTable
ALTER TABLE "ArtisanProfile" ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "hasOrganization" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "incorporationNumber" TEXT,
ADD COLUMN     "organizationName" TEXT;
