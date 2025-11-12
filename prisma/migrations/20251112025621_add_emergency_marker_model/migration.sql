-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MODERATE', 'CRITICAL');

-- CreateTable
CREATE TABLE "EmergencyMarker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "landmarks" JSONB,
    "contact_number" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "severity" "Severity" NOT NULL,

    CONSTRAINT "EmergencyMarker_pkey" PRIMARY KEY ("id")
);
