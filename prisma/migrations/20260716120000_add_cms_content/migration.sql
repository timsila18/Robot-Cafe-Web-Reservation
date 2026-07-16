CREATE TABLE "cms_content" (
    "key" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_content_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "branches" ADD COLUMN "phone" TEXT;
ALTER TABLE "branches" ADD COLUMN "phoneIntl" TEXT;

UPDATE "branches"
SET "phone" = '0769 30 30 30',
    "phoneIntl" = '+254 769 303030'
WHERE "id" = 'lana-plaza';

UPDATE "branches"
SET "phone" = '0140 30 30 30',
    "phoneIntl" = '+254 140 303030'
WHERE "id" = 'imaara-mall';

ALTER TABLE "cms_content" ENABLE ROW LEVEL SECURITY;
