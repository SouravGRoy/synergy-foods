ALTER TABLE "products" ADD COLUMN "is_marketed" boolean DEFAULT false NOT NULL;
ALTER TABLE "products" ADD COLUMN "marketed_at" timestamp;
