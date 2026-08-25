-- AlterTable
ALTER TABLE "ArtistType" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'musico';

-- CreateIndex
CREATE INDEX "ArtistType_kind_idx" ON "ArtistType"("kind");
