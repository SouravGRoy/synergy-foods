ALTER TABLE "product_variants" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "compare_at_price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "cost_per_item" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "compare_at_price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "cost_per_item" SET DATA TYPE numeric(10, 2);