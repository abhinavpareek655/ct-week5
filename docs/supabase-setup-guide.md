# Supabase Setup Guide for Recently Played Songs

## Prerequisites
1. Access to your Supabase project dashboard
2. SQL Editor access in Supabase
3. Authentication already set up in your project

## Quick Setup Instructions

### Single Script Setup (Recommended)
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `scripts/supabase-simple-migration.sql`
4. Click **Run** to execute all commands at once
5. ✅ Done! The script handles existing tables and columns automatically

## What Gets Created

### Tables
- **`PlayHistory`** - Tracks when users play songs
- **`Song`** - Main songs table with play counts
- **`UserLikedSongs`** - Stores user liked songs
- **`Album`** - Albums for organizing songs

### Security (RLS)
- Row Level Security enabled on all tables
- Users can only access their own data
- Songs and albums are publicly readable

### Performance
- Indexes on frequently queried columns
- Optimized for recent plays queries
- Foreign key constraints for data integrity

### Automation
- Triggers automatically increment play counts
- Functions for common operations
- Timestamp management

## Testing the Setup

After running the migration, test with these queries:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('PlayHistory', 'Song', 'UserLikedSongs', 'Album');

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('PlayHistory', 'Song', 'UserLikedSongs', 'Album');
```

## Sample Data (Optional)

The migration includes optional sample data:
- 3 default albums (Favorites, Recently Added, My Playlist)
- 2 sample songs

## API Integration

After setup, your Next.js APIs will work with these tables:
- `/api/user/recently-played` - Get user's play history
- `/api/user/liked-songs` - Manage liked songs
- `/api/albums` - Get available albums
- `/api/songs/play` - Record song plays

## Environment Variables

Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Common Issues

1. **Authentication errors**
   - Ensure RLS policies are correctly applied
   - Check that auth.users table exists

2. **Permission denied**
   - Verify the user role has necessary permissions
   - Check that GRANT statements executed successfully

3. **Foreign key errors**
   - Ensure tables are created in the correct order
   - Verify auth.users table exists before creating foreign keys

### Script Features

- ✅ **Handles existing tables** - Won't fail if tables already exist
- ✅ **Checks for existing columns** - Safely adds missing columns
- ✅ **Robust error handling** - Ignores conflicts and permission errors
- ✅ **Comprehensive setup** - Creates tables, policies, functions, and sample data
- ✅ **Verification included** - Shows what was created at the end

## Next Steps

After setup:
1. Add your actual song data to the `Song` table
2. Test the music player functionality
3. Verify recently played songs are being recorded
4. Check that liked songs feature works

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify all SQL commands executed without errors
3. Test with a simple INSERT to verify permissions
4. Use the verification queries to check setup

## Database Schema

```
PlayHistory
├── id (SERIAL PRIMARY KEY)
├── userId (UUID) → auth.users(id)
├── songId (INTEGER) → Song(id)
└── playedAt (TIMESTAMP)

Song
├── id (SERIAL PRIMARY KEY)
├── title (VARCHAR)
├── artist (VARCHAR)
├── album (VARCHAR)
├── coverUrl (TEXT)
├── audioUrl (TEXT)
├── plays (INTEGER)
└── album_id (INTEGER) → Album(id)

UserLikedSongs
├── id (SERIAL PRIMARY KEY)
├── user_id (UUID) → auth.users(id)
├── song_id (INTEGER) → Song(id)
└── liked_at (TIMESTAMP)

Album
├── id (SERIAL PRIMARY KEY)
├── title (VARCHAR)
├── artist_id (INTEGER)
├── cover_url (TEXT)
└── genre (VARCHAR)
```
