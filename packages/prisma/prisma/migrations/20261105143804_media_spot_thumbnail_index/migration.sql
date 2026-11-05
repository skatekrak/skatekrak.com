-- CreateIndex
CREATE INDEX CONCURRENTLY "media_spotId_type_createdAt_idx" ON "media"("spotId", "type", "createdAt" DESC);
