-- FIX: Add missing delivery columns to orders table
-- Run this in your Supabase SQL Editor to resolve the 'schema cache' error.

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'processing' CHECK (delivery_status IN ('processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0;

-- Refresh PostgREST cache (optional but helpful)
NOTIFY pgrst, 'reload schema';
