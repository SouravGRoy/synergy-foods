-- Create order tables only (extracted from 0009_black_red_skull.sql)

CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"product_title" text NOT NULL,
	"product_slug" text NOT NULL,
	"variant_name" text,
	"product_image" text,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"product_sku" text,
	"product_weight" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_items_id_unique" UNIQUE("id")
);

CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"previous_status" text,
	"new_status" text NOT NULL,
	"changed_by" text,
	"change_reason" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_status_history_id_unique" UNIQUE("id")
);

CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"user_id" text NOT NULL,
	"customer_email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'AED' NOT NULL,
	"shipping_address_id" uuid,
	"billing_address_id" uuid,
	"order_notes" text,
	"customer_notes" text,
	"shipping_method" text,
	"tracking_number" text,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "orders_id_unique" UNIQUE("id"),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);

-- Add Foreign Keys
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_addresses_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;

-- Create Indexes
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");
CREATE INDEX "order_items_variant_id_idx" ON "order_items" USING btree ("variant_id");
CREATE INDEX "order_status_history_order_id_idx" ON "order_status_history" USING btree ("order_id");
CREATE INDEX "order_status_history_status_idx" ON "order_status_history" USING btree ("new_status");
CREATE INDEX "order_status_history_created_at_idx" ON "order_status_history" USING btree ("created_at");
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");
CREATE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
CREATE INDEX "orders_stripe_session_idx" ON "orders" USING btree ("stripe_session_id");
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
