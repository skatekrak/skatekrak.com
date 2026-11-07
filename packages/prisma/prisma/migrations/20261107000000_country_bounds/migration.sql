ALTER TABLE "countries" ADD COLUMN "bounds" DOUBLE PRECISION[];

-- Old cameras have no viewport size; approximate their zone using a 1024x768 Mercator viewport.
WITH cameras AS (
    SELECT "id", "longitude",
        (1 - LN(TAN(PI() / 4 + RADIANS("latitude") / 2)) / PI()) / 2 AS y,
        360 / POWER(2, "zoom") AS longitude_radius,
        384 / (512 * POWER(2, "zoom")) AS y_radius
    FROM "countries"
)
UPDATE "countries" SET "bounds" = ARRAY[
    GREATEST(-180, cameras."longitude" - longitude_radius),
    DEGREES(ATAN(SINH(PI() * (1 - 2 * LEAST(1, y + y_radius))))),
    LEAST(180, cameras."longitude" + longitude_radius),
    DEGREES(ATAN(SINH(PI() * (1 - 2 * GREATEST(0, y - y_radius)))))
]
FROM cameras WHERE "countries"."id" = cameras."id";

ALTER TABLE "countries"
    ALTER COLUMN "bounds" SET NOT NULL,
    DROP COLUMN "latitude",
    DROP COLUMN "longitude",
    DROP COLUMN "zoom",
    ADD CONSTRAINT "countries_bounds_check" CHECK (
        cardinality("bounds") = 4
        AND array_ndims("bounds") = 1
        AND array_lower("bounds", 1) = 1
        AND array_position("bounds", NULL) IS NULL
        AND "bounds"[1] BETWEEN -180 AND 180
        AND "bounds"[2] BETWEEN -85.051129 AND 85.051129
        AND "bounds"[3] BETWEEN -180 AND 180
        AND "bounds"[4] BETWEEN -85.051129 AND 85.051129
        AND "bounds"[1] <> "bounds"[3]
        AND "bounds"[2] <> "bounds"[4]
    );
