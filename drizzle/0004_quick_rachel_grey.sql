CREATE TABLE "home_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "home_banners_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX "banner_location_idx" ON "home_banners" USING btree ("location");