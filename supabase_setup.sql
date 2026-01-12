-- Execute this SQL in your Supabase SQL Editor to create the necessary table

CREATE TABLE public.pets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    mood TEXT NOT NULL DEFAULT 'HAPPY',
    hunger INTEGER NOT NULL DEFAULT 100,
    energy INTEGER NOT NULL DEFAULT 100,
    cleanliness INTEGER NOT NULL DEFAULT 100,
    happiness INTEGER NOT NULL DEFAULT 100,
    satisfaction INTEGER NOT NULL DEFAULT 100,
    is_sleeping BOOLEAN NOT NULL DEFAULT FALSE,
    image_url TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    owner_id UUID -- Optional: Link to auth.users if implementing login
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read/write (for development/demo purposes)
-- WARNING: In production, change this to verify auth.uid()
CREATE POLICY "Enable all access for all users" ON public.pets
FOR ALL USING (true) WITH CHECK (true);

-- Fix for UUID type casting if using string 'default_pet' as ID in dev
-- Note: Requires changing column type to TEXT or using valid UUIDs in code.
-- For this prototype code, I recommend changing the table ID to TEXT temporarily:
ALTER TABLE public.pets ALTER COLUMN id TYPE TEXT;
