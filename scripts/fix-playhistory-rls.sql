-- Fix RLS policies for PlayHistory table
-- This script will enable RLS and create the necessary policies

-- First, enable RLS on the PlayHistory table
ALTER TABLE "public"."PlayHistory" ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow users to insert their own play history" ON "public"."PlayHistory";
DROP POLICY IF EXISTS "Allow service role to insert play history" ON "public"."PlayHistory";
DROP POLICY IF EXISTS "Allow authenticated users to insert play history" ON "public"."PlayHistory";
DROP POLICY IF EXISTS "Users can view their own play history" ON "public"."PlayHistory";
DROP POLICY IF EXISTS "Users can insert their own play history" ON "public"."PlayHistory";

-- Create policy to allow authenticated users to insert their own play history
-- Note: auth.uid() returns UUID, userId is text, so we cast userId to UUID
CREATE POLICY "Allow authenticated users to insert play history"
ON "public"."PlayHistory"
FOR INSERT
WITH CHECK (auth.uid() = "userId"::uuid);

-- Create policy to allow users to view their own play history
CREATE POLICY "Allow users to view their own play history"
ON "public"."PlayHistory"
FOR SELECT
USING (auth.uid() = "userId"::uuid);

-- Create policy to allow service role to insert play history (for API routes)
-- This allows the API route to insert records for any user
CREATE POLICY "Allow service role to insert play history"
ON "public"."PlayHistory"
FOR INSERT
WITH CHECK (true);

-- Create policy to allow service role to select play history (for API routes)
CREATE POLICY "Allow service role to select play history"
ON "public"."PlayHistory"
FOR SELECT
USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'PlayHistory'; 