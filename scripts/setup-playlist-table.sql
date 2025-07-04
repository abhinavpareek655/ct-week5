-- Setup Playlist table with RLS policies
-- This script creates the Playlist table and sets up proper security

-- Create Playlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Playlist" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_playlist_user_id ON "Playlist"(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_created_at ON "Playlist"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playlist_public ON "Playlist"(is_public) WHERE is_public = true;

-- Enable Row Level Security
ALTER TABLE "Playlist" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own playlists" ON "Playlist";
DROP POLICY IF EXISTS "Users can view public playlists" ON "Playlist";
DROP POLICY IF EXISTS "Users can insert their own playlists" ON "Playlist";
DROP POLICY IF EXISTS "Users can update their own playlists" ON "Playlist";
DROP POLICY IF EXISTS "Users can delete their own playlists" ON "Playlist";
DROP POLICY IF EXISTS "Service role can manage all playlists" ON "Playlist";

-- Create RLS policies

-- Users can view their own playlists
CREATE POLICY "Users can view their own playlists" ON "Playlist"
FOR SELECT USING (auth.uid() = user_id);

-- Users can view public playlists
CREATE POLICY "Users can view public playlists" ON "Playlist"
FOR SELECT USING (is_public = true);

-- Users can insert their own playlists
CREATE POLICY "Users can insert their own playlists" ON "Playlist"
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own playlists
CREATE POLICY "Users can update their own playlists" ON "Playlist"
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own playlists
CREATE POLICY "Users can delete their own playlists" ON "Playlist"
FOR DELETE USING (auth.uid() = user_id);

-- Service role can manage all playlists (for API routes)
CREATE POLICY "Service role can manage all playlists" ON "Playlist"
FOR ALL USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_playlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_playlist_updated_at ON "Playlist";

-- Create trigger
CREATE TRIGGER trigger_update_playlist_updated_at
    BEFORE UPDATE ON "Playlist"
    FOR EACH ROW
    EXECUTE FUNCTION update_playlist_updated_at();

-- Grant permissions
GRANT USAGE, SELECT ON SEQUENCE "Playlist_id_seq" TO authenticated;

-- Verify the setup
DO $$
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'Playlist';
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'Playlist';
    
    RAISE NOTICE '✅ PLAYLIST SETUP COMPLETED!';
    RAISE NOTICE '📊 Playlist table: %', CASE WHEN table_count > 0 THEN 'Created' ELSE 'Missing' END;
    RAISE NOTICE '🔒 RLS policies: %', policy_count;
    RAISE NOTICE '🎵 Ready for playlist functionality!';
END $$; 