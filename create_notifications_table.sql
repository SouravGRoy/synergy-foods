-- Create notifications table
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    priority text NOT NULL DEFAULT 'medium',
    is_read boolean NOT NULL DEFAULT false,
    metadata jsonb,
    action_url text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);
CREATE INDEX notifications_type_idx ON public.notifications USING btree (type);
CREATE INDEX notifications_is_read_idx ON public.notifications USING btree (is_read);
CREATE INDEX notifications_created_at_idx ON public.notifications USING btree (created_at);

-- Add check constraints for enum values (optional but recommended)
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('new_order', 'low_stock', 'customer_inquiry', 'product_review', 'payment_received', 'order_cancelled', 'inventory_alert', 'system_alert'));

ALTER TABLE public.notifications ADD CONSTRAINT notifications_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));