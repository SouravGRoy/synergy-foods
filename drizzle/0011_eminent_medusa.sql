CREATE TABLE "delivery_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"origin_city" text NOT NULL,
	"origin_country" text NOT NULL,
	"destination_city" text NOT NULL,
	"destination_country" text NOT NULL,
	"weight" numeric(10, 2) NOT NULL,
	"length" numeric(10, 2) NOT NULL,
	"width" numeric(10, 2) NOT NULL,
	"height" numeric(10, 2) NOT NULL,
	"delivery_provider" text NOT NULL,
	"service_name" text NOT NULL,
	"cost" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'AED' NOT NULL,
	"estimated_days" text NOT NULL,
	"description" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_rates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "delivery_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"tracking_number" text NOT NULL,
	"delivery_provider" text NOT NULL,
	"origin_name" text NOT NULL,
	"origin_phone" text NOT NULL,
	"origin_street" text NOT NULL,
	"origin_city" text NOT NULL,
	"origin_state" text NOT NULL,
	"origin_country" text NOT NULL,
	"origin_postal_code" text NOT NULL,
	"destination_name" text NOT NULL,
	"destination_phone" text NOT NULL,
	"destination_street" text NOT NULL,
	"destination_city" text NOT NULL,
	"destination_state" text NOT NULL,
	"destination_country" text NOT NULL,
	"destination_postal_code" text NOT NULL,
	"package_weight" numeric(10, 2) NOT NULL,
	"package_length" numeric(10, 2) NOT NULL,
	"package_width" numeric(10, 2) NOT NULL,
	"package_height" numeric(10, 2) NOT NULL,
	"package_description" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"estimated_delivery" timestamp,
	"actual_delivery" timestamp,
	"shipping_cost" numeric(10, 2),
	"currency" text DEFAULT 'AED' NOT NULL,
	"provider_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_shipments_id_unique" UNIQUE("id"),
	CONSTRAINT "delivery_shipments_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "delivery_tracking_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"tracking_number" text NOT NULL,
	"status" text NOT NULL,
	"location" text,
	"description" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"provider_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_tracking_updates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"action_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "delivery_shipments" ADD CONSTRAINT "delivery_shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_tracking_updates" ADD CONSTRAINT "delivery_tracking_updates_shipment_id_delivery_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."delivery_shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "delivery_rates_route_idx" ON "delivery_rates" USING btree ("origin_city","origin_country","destination_city","destination_country");--> statement-breakpoint
CREATE INDEX "delivery_rates_provider_idx" ON "delivery_rates" USING btree ("delivery_provider");--> statement-breakpoint
CREATE INDEX "delivery_rates_expires_at_idx" ON "delivery_rates" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "delivery_shipments_order_id_idx" ON "delivery_shipments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "delivery_shipments_tracking_number_idx" ON "delivery_shipments" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "delivery_shipments_status_idx" ON "delivery_shipments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "delivery_shipments_provider_idx" ON "delivery_shipments" USING btree ("delivery_provider");--> statement-breakpoint
CREATE INDEX "delivery_shipments_created_at_idx" ON "delivery_shipments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "delivery_tracking_updates_shipment_id_idx" ON "delivery_tracking_updates" USING btree ("shipment_id");--> statement-breakpoint
CREATE INDEX "delivery_tracking_updates_tracking_number_idx" ON "delivery_tracking_updates" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "delivery_tracking_updates_timestamp_idx" ON "delivery_tracking_updates" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notifications_is_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");