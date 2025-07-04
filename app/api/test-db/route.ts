import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const results: any = {}
    
    // Test 1: Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['Song', 'PlayHistory', 'UserLikedSongs', 'Album'])
    
    results.tables = {
      error: tablesError?.message,
      found: tables?.map(t => t.table_name) || []
    }
    
    // Test 2: Check Song table
    const { data: songs, error: songsError } = await supabase
      .from('Song')
      .select('id, title, artist')
      .limit(5)
    
    results.songs = {
      error: songsError?.message,
      count: songs?.length || 0,
      sample: songs?.slice(0, 2) || []
    }
    
    // Test 3: Check PlayHistory table
    const { data: playHistory, error: playError } = await supabase
      .from('PlayHistory')
      .select('id, userId, songId')
      .limit(5)
    
    results.playHistory = {
      error: playError?.message,
      count: playHistory?.length || 0
    }
    
    // Test 4: Check UserLikedSongs table
    const { data: likedSongs, error: likedError } = await supabase
      .from('UserLikedSongs')
      .select('id, user_id, song_id')
      .limit(5)
    
    results.likedSongs = {
      error: likedError?.message,
      count: likedSongs?.length || 0
    }
    
    // Test 5: Check Albums table
    const { data: albums, error: albumsError } = await supabase
      .from('Album')
      .select('id, title')
      .limit(5)
    
    results.albums = {
      error: albumsError?.message,
      count: albums?.length || 0,
      sample: albums || []
    }
    
    return NextResponse.json({
      status: 'Database connection test completed',
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      results
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
