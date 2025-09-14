CREATE TABLE "category_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"parent_category_id" uuid,
	"parent_subcategory_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewer_id" text,
	"reviewed_at" text,
	"review_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_requests_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "commission_rate" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "product_types" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "product_types" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategories" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "subcategories" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "category_requests" ADD CONSTRAINT "category_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_requests" ADD CONSTRAINT "category_requests_parent_category_id_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_requests" ADD CONSTRAINT "category_requests_parent_subcategory_id_subcategories_id_fk" FOREIGN KEY ("parent_subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_requests" ADD CONSTRAINT "category_requests_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;