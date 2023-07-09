-- CreateEnum
CREATE TYPE "LocationPlaceType" AS ENUM ('wood', 'food');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "wood" INTEGER NOT NULL,
    "food" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "wood" INTEGER NOT NULL,
    "food" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT,
    "locationPlace" "LocationPlaceType",

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
