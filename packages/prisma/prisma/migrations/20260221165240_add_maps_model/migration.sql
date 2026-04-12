-- CreateTable
CREATE TABLE "maps" (
    "id" TEXT NOT NULL,
    "categories" TEXT[],
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "edito" TEXT NOT NULL DEFAULT '',
    "about" TEXT NOT NULL DEFAULT '',
    "staging" BOOLEAN NOT NULL DEFAULT false,
    "videos" TEXT[],
    "soundtrack" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);
