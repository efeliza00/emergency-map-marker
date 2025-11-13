-- CreateTable
CREATE TABLE "SafeMarker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isSafe" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SafeMarker_pkey" PRIMARY KEY ("id")
);
