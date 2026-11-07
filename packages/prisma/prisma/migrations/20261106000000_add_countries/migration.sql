CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "edito" TEXT NOT NULL DEFAULT '',
    "about" TEXT NOT NULL DEFAULT '',
    "videos" TEXT[],
    "soundtrack" TEXT[],
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "zoom" DOUBLE PRECISION NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "countries_code_check" CHECK ("code" ~ '^[A-Z]{2}$'),
    CONSTRAINT "countries_latitude_check" CHECK ("latitude" BETWEEN -85.051129 AND 85.051129),
    CONSTRAINT "countries_longitude_check" CHECK ("longitude" BETWEEN -180 AND 180),
    CONSTRAINT "countries_zoom_check" CHECK ("zoom" BETWEEN 2 AND 19)
);

CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");
