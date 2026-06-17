CREATE TABLE "survey_responses" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "tableCode" TEXT,
    "source" TEXT NOT NULL DEFAULT 'qr',
    "priceRating" INTEGER NOT NULL,
    "priceTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "waiterServiceRating" INTEGER NOT NULL,
    "waiterServiceTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "robotExperienceRating" INTEGER NOT NULL,
    "robotExperienceTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ambienceRating" INTEGER NOT NULL,
    "ambienceTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "foodFlavorRating" INTEGER NOT NULL,
    "foodFlavorTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "foodValueRating" INTEGER NOT NULL,
    "foodValueTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "foodPortionRating" INTEGER NOT NULL,
    "foodPortionTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overallRating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "survey_responses_branchId_createdAt_idx" ON "survey_responses"("branchId", "createdAt");
CREATE INDEX "survey_responses_createdAt_idx" ON "survey_responses"("createdAt");

ALTER TABLE "survey_responses"
  ADD CONSTRAINT "survey_responses_branchId_fkey"
  FOREIGN KEY ("branchId") REFERENCES "branches"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "survey_responses" ENABLE ROW LEVEL SECURITY;
