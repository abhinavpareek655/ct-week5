import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch public playlists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Fetch public playlists
    const { data: playlists, error: fetchError } = await supabase
      .from('Playlist')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (fetchError) {
      console.error('Supabase error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch public playlists' }, { status: 500 })
    }
    
    // Get song counts for each playlist (same approach as regular playlists API)
    const playlistsWithCounts = await Promise.all(
      (playlists || []).map(async (playlist) => {
        const { count } = await supabase
          .from('PlaylistSong')
          .select('*', { count: 'exact', head: true })
          .eq('playlist_id', playlist.id)
        
        return {
          ...playlist,
          song_count: count || 0
        }
      })
    )
    
    return NextResponse.json(playlistsWithCounts)
  } catch (error) {
    console.error('Error fetching public playlists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 