-- Create notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
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
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications" ("user_id");
CREATE INDEX IF NOT EXISTS "notifications_type_idx" ON "notifications" ("type");
CREATE INDEX IF NOT EXISTS "notifications_is_read_idx" ON "notifications" ("is_read");
CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications" ("created_at");

-- Add check constraints for enum values
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_type_check" 
CHECK ("type" IN ('new_order', 'low_stock', 'customer_inquiry', 'product_review', 'payment_received', 'order_cancelled', 'inventory_alert', 'system_alert'));

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_priority_check" 
CHECK ("priority" IN ('low', 'medium', 'high', 'urgent'));