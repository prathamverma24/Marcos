ALTER TABLE "Blog" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Blog" ADD COLUMN "homepageOrder" INTEGER;

CREATE INDEX "Blog_showOnHomepage_status_publishedAt_idx" ON "Blog"("showOnHomepage", "status", "publishedAt");
