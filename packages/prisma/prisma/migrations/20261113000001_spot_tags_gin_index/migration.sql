-- CreateIndex
CREATE INDEX CONCURRENTLY "spots_tags_idx" ON "spots" USING GIN ("tags");
