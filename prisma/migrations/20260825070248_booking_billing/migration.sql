-- AlterTable
ALTER TABLE "BookingRequest" ADD COLUMN     "agreedPrice" INTEGER,
ADD COLUMN     "artistCommission" INTEGER,
ADD COLUMN     "artistPayout" INTEGER,
ADD COLUMN     "cancellationPolicy" TEXT NOT NULL DEFAULT 'moderada',
ADD COLUMN     "clientFee" INTEGER,
ADD COLUMN     "clientTotal" INTEGER,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "payoutReleaseAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MusicianProfile" ADD COLUMN     "cancellationPolicy" TEXT NOT NULL DEFAULT 'moderada';
