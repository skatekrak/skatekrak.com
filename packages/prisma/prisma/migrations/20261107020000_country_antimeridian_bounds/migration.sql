-- Keep dateline-crossing bounds continuous by allowing eastern longitudes in the next world copy.
ALTER TABLE "countries" DROP CONSTRAINT "countries_bounds_check";
ALTER TABLE "countries" ADD CONSTRAINT "countries_bounds_check" CHECK (
    cardinality("bounds") = 4
    AND array_ndims("bounds") = 1
    AND array_lower("bounds", 1) = 1
    AND array_position("bounds", NULL) IS NULL
    AND "bounds"[1] BETWEEN -180 AND 180
    AND "bounds"[2] BETWEEN -85.051129 AND 85.051129
    AND "bounds"[3] BETWEEN -180 AND 540
    AND "bounds"[4] BETWEEN -85.051129 AND 85.051129
    AND "bounds"[1] <> "bounds"[3]
    AND "bounds"[2] <> "bounds"[4]
    AND ABS("bounds"[3] - "bounds"[1]) <= 360
);
