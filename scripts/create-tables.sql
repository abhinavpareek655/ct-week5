-- Create Song table
CREATE TABLE IF NOT EXISTS "Song" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "artist" TEXT NOT NULL,
  "album" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "coverUrl" TEXT NOT NULL,
  "audioUrl" TEXT NOT NULL,
  "plays" INTEGER DEFAULT 0
);

-- Create Lyric table
CREATE TABLE IF NOT EXISTS "Lyric" (
  "id" SERIAL PRIMARY KEY,
  "songId" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "synced" BOOLEAN DEFAULT false,
  "timestamps" JSONB,
  FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Song_title_artist_idx" ON "Song"("title", "artist");
CREATE INDEX IF NOT EXISTS "Lyric_songId_idx" ON "Lyric"("songId"); 