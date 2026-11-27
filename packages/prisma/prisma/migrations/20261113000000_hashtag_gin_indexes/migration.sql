-- CreateIndex
CREATE INDEX CONCURRENTLY "media_hashtags_idx" ON "media" USING GIN ("hashtags");
