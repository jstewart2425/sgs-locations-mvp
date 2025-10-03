-- CreateIndex
CREATE INDEX "Location_approved_createdAt_idx" ON "Location"("approved", "createdAt");

-- CreateIndex
CREATE INDEX "Location_approved_title_idx" ON "Location"("approved", "title");

-- CreateIndex
CREATE INDEX "Location_approved_city_idx" ON "Location"("approved", "city");

-- CreateIndex
CREATE INDEX "Location_approved_propertyType_idx" ON "Location"("approved", "propertyType");
