-- AlterTable
ALTER TABLE "ArtisanProfile" ADD COLUMN     "bankBranch" TEXT,
ADD COLUMN     "bankSwiftCode" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "fullAddress" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "payoutType" TEXT,
ADD COLUMN     "paypalEmail" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "returnPolicy" TEXT,
ADD COLUMN     "shippingCharges" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "shippingPolicy" TEXT,
ADD COLUMN     "storeAbout" TEXT,
ADD COLUMN     "storeDescription" TEXT,
ADD COLUMN     "taxNumber" TEXT,
ADD COLUMN     "zone" TEXT;

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "artisanProfileId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "adminNote" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_artisanProfileId_fkey" FOREIGN KEY ("artisanProfileId") REFERENCES "ArtisanProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
