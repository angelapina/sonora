-- AlterTable
ALTER TABLE "MusicianProfile" ADD COLUMN     "equipmentIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "formats" TEXT,
ADD COLUMN     "gigsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "influences" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "membersCount" INTEGER,
ADD COLUMN     "minDurationMin" INTEGER,
ADD COLUMN     "repertoire" TEXT,
ADD COLUMN     "respondsFast" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "travelRadiusKm" INTEGER,
ADD COLUMN     "venueTypes" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "ratingCommunication" INTEGER,
ADD COLUMN     "ratingMusic" INTEGER,
ADD COLUMN     "ratingProfessionalism" INTEGER,
ADD COLUMN     "ratingPunctuality" INTEGER,
ADD COLUMN     "ratingValue" INTEGER,
ADD COLUMN     "verifiedBooking" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PricingPackage" (
    "id" TEXT NOT NULL,
    "musicianId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "durationMin" INTEGER,
    "includes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PricingPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PricingPackage_musicianId_idx" ON "PricingPackage"("musicianId");

-- CreateIndex
CREATE INDEX "MusicianProfile_verified_idx" ON "MusicianProfile"("verified");

-- AddForeignKey
ALTER TABLE "PricingPackage" ADD CONSTRAINT "PricingPackage_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "MusicianProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
