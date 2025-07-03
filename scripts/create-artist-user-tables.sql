-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_type VARCHAR(50) DEFAULT 'free',
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create Artist table
CREATE TABLE IF NOT EXISTS "Artist" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    monthly_listeners INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    country VARCHAR(100),
    genre VARCHAR(100),
    social_links JSONB
);

-- Add artist_id column to Song table
ALTER TABLE "Song" ADD COLUMN IF NOT EXISTS artist_id INTEGER;

-- Add foreign key constraint to Song table
ALTER TABLE "Song" 
ADD CONSTRAINT fk_song_artist 
FOREIGN KEY (artist_id) REFERENCES "Artist"(id) ON DELETE SET NULL;

-- Insert sample artists
INSERT INTO "Artist" (name, bio, image_url, verified, monthly_listeners, country, genre) VALUES
('Dua Lipa', 'British-Albanian singer and songwriter known for her disco-influenced pop music.', '/placeholder-user.jpg', true, 50000000, 'United Kingdom', 'Pop'),
('Ed Sheeran', 'English singer-songwriter known for his acoustic sound and heartfelt lyrics.', '/placeholder-user.jpg', true, 45000000, 'United Kingdom', 'Pop'),
('Harry Styles', 'English singer and actor, former member of One Direction.', '/placeholder-user.jpg', true, 40000000, 'United Kingdom', 'Pop'),
('JVKE', 'American singer-songwriter and producer known for viral hits.', '/placeholder-user.jpg', true, 15000000, 'United States', 'Pop'),
('Kendrick Lamar', 'American rapper, songwriter, and record producer.', '/placeholder-user.jpg', true, 35000000, 'United States', 'Hip Hop'),
('SZA', 'American singer-songwriter known for her alternative R&B style.', '/placeholder-user.jpg', true, 30000000, 'United States', 'R&B'),
('Lizzo', 'American singer, rapper, and flutist known for her empowering music.', '/placeholder-user.jpg', true, 25000000, 'United States', 'Pop'),
('The Weeknd', 'Canadian singer, songwriter, and record producer.', '/placeholder-user.jpg', true, 40000000, 'Canada', 'R&B');

-- Update existing songs with artist_id (assuming the songs exist)
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'Dua Lipa') WHERE artist = 'Dua Lipa';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'Ed Sheeran') WHERE artist = 'Ed Sheeran';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'Harry Styles') WHERE artist = 'Harry Styles';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'JVKE') WHERE artist = 'JVKE';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'Kendrick Lamar') WHERE artist = 'Kendrick Lamar';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'SZA') WHERE artist = 'SZA';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'Lizzo') WHERE artist = 'Lizzo';
UPDATE "Song" SET artist_id = (SELECT id FROM "Artist" WHERE name = 'The Weeknd') WHERE artist = 'The Weeknd';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_song_artist_id ON "Song"(artist_id);
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_artist_name ON "Artist"(name);

-- Create a view for songs with artist information
CREATE OR REPLACE VIEW songs_with_artists AS
SELECT 
    s.id,
    s.title,
    s.artist,
    s.album,
    s.genre,
    s.coverUrl,
    s.audioUrl,
    s.lyrics,
    s.plays,
    s.artist_id,
    a.name as artist_name,
    a.bio as artist_bio,
    a.image_url as artist_image,
    a.verified as artist_verified,
    a.monthly_listeners
FROM "Song" s
LEFT JOIN "Artist" a ON s.artist_id = a.id;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Artist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Song" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to artists" ON "Artist"
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to songs" ON "Song"
    FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to manage their own profile" ON "User"
    FOR ALL USING (auth.uid()::text = id::text);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_updated_at BEFORE UPDATE ON "Artist"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 