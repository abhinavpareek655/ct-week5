-- RECENTLY PLAYED SONGS SETUP FOR SUPABASE
-- Single, robust script that handles existing tables and columns
-- Run this entire script in Supabase SQL Editor

-- ========================================
-- 1. Create PlayHistory Table
-- ========================================

CREATE TABLE IF NOT EXISTS "PlayHistory" (
    id SERIAL PRIMARY KEY,
    "userId" UUID NOT NULL,
    "songId" INTEGER NOT NULL,
    "playedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to auth.users (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'playhistory_user_fkey' 
        AND table_name = 'PlayHistory'
    ) THEN
        ALTER TABLE "PlayHistory" 
        ADD CONSTRAINT playhistory_user_fkey 
        FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes (only if not exists)
CREATE INDEX IF NOT EXISTS idx_playhistory_userid_playedat ON "PlayHistory"("userId", "playedAt" DESC);
CREATE INDEX IF NOT EXISTS idx_playhistory_songid ON "PlayHistory"("songId");
CREATE INDEX IF NOT EXISTS idx_playhistory_userid_songid ON "PlayHistory"("userId", "songId");

-- ========================================
-- 2. Create/Update Song Table
-- ========================================

CREATE TABLE IF NOT EXISTS "Song" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    genre VARCHAR(100),
    "coverUrl" TEXT,
    "audioUrl" TEXT NOT NULL,
    plays INTEGER DEFAULT 0
);

-- Add missing columns to Song table if they don't exist
DO $$
BEGIN
    -- Add plays column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Song' AND column_name = 'plays'
    ) THEN
        ALTER TABLE "Song" ADD COLUMN plays INTEGER DEFAULT 0;
    END IF;
    
    -- Add album_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Song' AND column_name = 'album_id'
    ) THEN
        ALTER TABLE "Song" ADD COLUMN album_id INTEGER;
    END IF;
END $$;

-- Add foreign key from PlayHistory to Song (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'playhistory_song_fkey' 
        AND table_name = 'PlayHistory'
    ) THEN
        ALTER TABLE "PlayHistory" 
        ADD CONSTRAINT playhistory_song_fkey 
        FOREIGN KEY ("songId") REFERENCES "Song"(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for Song table
CREATE INDEX IF NOT EXISTS idx_song_artist ON "Song"(artist);
CREATE INDEX IF NOT EXISTS idx_song_plays ON "Song"(plays DESC);

-- ========================================
-- 3. Create UserLikedSongs Table
-- ========================================

CREATE TABLE IF NOT EXISTS "UserLikedSongs" (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    song_id INTEGER NOT NULL,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'userlikedsongs_user_id_song_id_key' 
        AND table_name = 'UserLikedSongs'
    ) THEN
        ALTER TABLE "UserLikedSongs" ADD CONSTRAINT userlikedsongs_user_id_song_id_key UNIQUE(user_id, song_id);
    END IF;
END $$;

-- Add foreign keys (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'userlikedsongs_user_fkey' 
        AND table_name = 'UserLikedSongs'
    ) THEN
        ALTER TABLE "UserLikedSongs" 
        ADD CONSTRAINT userlikedsongs_user_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'userlikedsongs_song_fkey' 
        AND table_name = 'UserLikedSongs'
    ) THEN
        ALTER TABLE "UserLikedSongs" 
        ADD CONSTRAINT userlikedsongs_song_fkey 
        FOREIGN KEY (song_id) REFERENCES "Song"(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_userlikedsongs_userid ON "UserLikedSongs"(user_id);
CREATE INDEX IF NOT EXISTS idx_userlikedsongs_songid ON "UserLikedSongs"(song_id);

-- ========================================
-- 4. Create Album Table
-- ========================================

CREATE TABLE IF NOT EXISTS "Album" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER,
    cover_url TEXT,
    release_date DATE,
    genre VARCHAR(100)
);

-- Add foreign key from Song to Album (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'song_album_fkey' 
        AND table_name = 'Song'
    ) THEN
        ALTER TABLE "Song" 
        ADD CONSTRAINT song_album_fkey 
        FOREIGN KEY (album_id) REFERENCES "Album"(id);
    END IF;
END $$;

-- Add index for album_id
CREATE INDEX IF NOT EXISTS idx_song_album_id ON "Song"(album_id);

-- ========================================
-- 5. Enable Row Level Security
-- ========================================

-- Enable RLS on all tables
ALTER TABLE "PlayHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserLikedSongs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Song" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Album" ENABLE ROW LEVEL SECURITY;

-- PlayHistory policies
DROP POLICY IF EXISTS "Users can view their own play history" ON "PlayHistory";
CREATE POLICY "Users can view their own play history" ON "PlayHistory"
FOR SELECT USING (auth.uid() = "userId");

DROP POLICY IF EXISTS "Users can insert their own play history" ON "PlayHistory";
CREATE POLICY "Users can insert their own play history" ON "PlayHistory"
FOR INSERT WITH CHECK (auth.uid() = "userId");

-- UserLikedSongs policies
DROP POLICY IF EXISTS "Users can view their own liked songs" ON "UserLikedSongs";
CREATE POLICY "Users can view their own liked songs" ON "UserLikedSongs"
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own liked songs" ON "UserLikedSongs";
CREATE POLICY "Users can insert their own liked songs" ON "UserLikedSongs"
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own liked songs" ON "UserLikedSongs";
CREATE POLICY "Users can delete their own liked songs" ON "UserLikedSongs"
FOR DELETE USING (auth.uid() = user_id);

-- Song policies (public read)
DROP POLICY IF EXISTS "Songs are publicly viewable" ON "Song";
CREATE POLICY "Songs are publicly viewable" ON "Song"
FOR SELECT USING (true);

-- Album policies (public read)
DROP POLICY IF EXISTS "Albums are publicly viewable" ON "Album";
CREATE POLICY "Albums are publicly viewable" ON "Album"
FOR SELECT USING (true);

-- ========================================
-- 6. Create Functions and Triggers
-- ========================================

-- Function to increment play count
CREATE OR REPLACE FUNCTION increment_song_plays(song_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE "Song" 
    SET plays = COALESCE(plays, 0) + 1
    WHERE id = song_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to auto-increment plays
CREATE OR REPLACE FUNCTION update_song_plays()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Song" 
    SET plays = COALESCE(plays, 0) + 1
    WHERE id = NEW."songId";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_song_plays ON "PlayHistory";
CREATE TRIGGER trigger_update_song_plays
    AFTER INSERT ON "PlayHistory"
    FOR EACH ROW
    EXECUTE FUNCTION update_song_plays();

-- ========================================
-- 7. Grant Permissions
-- ========================================

-- Grant sequence permissions (ignore errors if already granted)
DO $$
BEGIN
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
EXCEPTION
    WHEN others THEN
        -- Ignore permission errors
        NULL;
END $$;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION increment_song_plays(INTEGER) TO authenticated;

-- ========================================
-- 8. Insert Sample Data
-- ========================================

-- Insert sample albums (ignore conflicts)
DO $$
BEGIN
    INSERT INTO "Album" (title, artist_id, cover_url, genre) VALUES
    ('Favorites', 1, null, 'Mixed'),
    ('Recently Added', 1, null, 'Mixed'),
    ('My Playlist', 1, null, 'Mixed');
EXCEPTION
    WHEN others THEN
        -- Ignore insert errors (duplicates)
        NULL;
END $$;

-- ========================================
-- 9. Verification and Success Message
-- ========================================

-- Check what was created
DO $$
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('PlayHistory', 'Song', 'UserLikedSongs', 'Album');
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename IN ('PlayHistory', 'Song', 'UserLikedSongs', 'Album');
    
    -- Count functions
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('increment_song_plays', 'update_song_plays');
    
    RAISE NOTICE '✅ SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '📊 Tables created/updated: %', table_count;
    RAISE NOTICE '🔒 RLS policies: %', policy_count;
    RAISE NOTICE '⚙️ Functions: %', function_count;
    RAISE NOTICE '🎵 Ready for recently played songs!';
END $$;
