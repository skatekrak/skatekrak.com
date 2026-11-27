-- CreateIndex
CREATE INDEX CONCURRENTLY "media_hashtags_idx" ON "media" USING GIN ("hashtags");

-- CreateIndex
CREATE INDEX CONCURRENTLY "spots_tags_idx" ON "spots" USING GIN ("tags");
