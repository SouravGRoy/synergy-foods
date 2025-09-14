CREATE TABLE "promotional_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text DEFAULT 'carousel' NOT NULL,
	"media" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cta_label" text,
	"cta_link" text,
	"location" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promotional_banners_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX "promotional_banner_location_idx" ON "promotional_banners" USING btree ("location");--> statement-breakpoint
CREATE INDEX "promotional_banner_type_idx" ON "promotional_banners" USING btree ("type");--> statement-breakpoint
CREATE INDEX "promotional_banner_order_idx" ON "promotional_banners" USING btree ("order");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "is_marketed";