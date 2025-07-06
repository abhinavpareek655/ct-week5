import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch album details with songs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params
    
    // Fetch songs for this album
    const { data: songs, error: songsError } = await supabase
      .from('Song')
      .select('*')
      .eq('album', albumId)
      .order('title')
    
    if (songsError) {
      console.error('Error fetching album songs:', songsError)
      return NextResponse.json({ error: 'Failed to fetch album songs' }, { status: 500 })
    }
    
    // Get artist info from the first song (assuming all songs in album have same artist)
    const artist = songs && songs.length > 0 ? songs[0].artist : 'Unknown Artist'
    const coverUrl = songs && songs.length > 0 ? songs[0].cover_url : null
    
    // Create album object
    const album = {
      id: albumId,
      title: albumId,
      artist: artist,
      cover_url: coverUrl,
      songs: songs || [],
      song_count: songs?.length || 0,
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json(album)
  } catch (error) {
    console.error('Error fetching album:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 