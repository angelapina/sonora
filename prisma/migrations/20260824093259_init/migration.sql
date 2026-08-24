-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MusicianProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "tagline" TEXT,
    "avatarUrl" TEXT,
    "coverUrl" TEXT,
    "city" TEXT NOT NULL,
    "zone" TEXT,
    "bio" TEXT,
    "priceFrom" INTEGER,
    "priceNote" TEXT,
    "yearsExperience" INTEGER,
    "website" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "spotify" TEXT,
    "phone" TEXT,
    "contactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featuredUntil" DATETIME,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "ratingAvg" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MusicianProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtistType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "musicianId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT,
    "title" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AvailabilityBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "musicianId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AvailabilityBlock_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "musicianId" TEXT NOT NULL,
    "clientUserId" TEXT,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME,
    "city" TEXT,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingRequest_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookingRequest_clientUserId_fkey" FOREIGN KEY ("clientUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingRequestId" TEXT NOT NULL,
    "senderId" TEXT,
    "senderRole" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "musicianId" TEXT NOT NULL,
    "bookingRequestId" TEXT,
    "authorUserId" TEXT,
    "authorName" TEXT NOT NULL,
    "eventType" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_bookingRequestId_fkey" FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "musicianId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MusicianArtistTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MusicianArtistTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "ArtistType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicianArtistTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MusicianGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MusicianGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicianGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MusicianEventTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MusicianEventTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "EventType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicianEventTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MusicianInstruments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MusicianInstruments_A_fkey" FOREIGN KEY ("A") REFERENCES "Instrument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicianInstruments_B_fkey" FOREIGN KEY ("B") REFERENCES "MusicianProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "MusicianProfile_userId_key" ON "MusicianProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicianProfile_slug_key" ON "MusicianProfile"("slug");

-- CreateIndex
CREATE INDEX "MusicianProfile_city_idx" ON "MusicianProfile"("city");

-- CreateIndex
CREATE INDEX "MusicianProfile_status_idx" ON "MusicianProfile"("status");

-- CreateIndex
CREATE INDEX "MusicianProfile_featured_idx" ON "MusicianProfile"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistType_slug_key" ON "ArtistType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_slug_key" ON "EventType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_slug_key" ON "Instrument"("slug");

-- CreateIndex
CREATE INDEX "Media_musicianId_type_idx" ON "Media"("musicianId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityBlock_musicianId_date_key" ON "AvailabilityBlock"("musicianId", "date");

-- CreateIndex
CREATE INDEX "BookingRequest_musicianId_status_idx" ON "BookingRequest"("musicianId", "status");

-- CreateIndex
CREATE INDEX "BookingRequest_clientUserId_idx" ON "BookingRequest"("clientUserId");

-- CreateIndex
CREATE INDEX "Message_bookingRequestId_idx" ON "Message"("bookingRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingRequestId_key" ON "Review"("bookingRequestId");

-- CreateIndex
CREATE INDEX "Review_musicianId_approved_idx" ON "Review"("musicianId", "approved");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_musicianId_key" ON "Favorite"("userId", "musicianId");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicianArtistTypes_AB_unique" ON "_MusicianArtistTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicianArtistTypes_B_index" ON "_MusicianArtistTypes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicianGenres_AB_unique" ON "_MusicianGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicianGenres_B_index" ON "_MusicianGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicianEventTypes_AB_unique" ON "_MusicianEventTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicianEventTypes_B_index" ON "_MusicianEventTypes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicianInstruments_AB_unique" ON "_MusicianInstruments"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicianInstruments_B_index" ON "_MusicianInstruments"("B");
