import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch playlist details with songs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const { playlistId } = await params
    const playlistIdNum = parseInt(playlistId)
    if (isNaN(playlistIdNum)) {
      return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 })
    }
    
    // Fetch playlist
    const { data: playlist, error: fetchError } = await supabase
      .from('Playlist')
      .select('*')
      .eq('id', playlistIdNum)
      .single()
    
    if (fetchError || !playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }
    
    // Fetch songs for this playlist
    const { data: playlistSongs, error: songsError } = await supabase
      .from('PlaylistSong')
      .select(`
        song_id,
        Song(
          id,
          title,
          artist,
          album,
          cover_url,
          audio_url
        )
      `)
      .eq('playlist_id', playlistIdNum)
    
    if (songsError) {
      console.error('Error fetching playlist songs:', songsError)
      return NextResponse.json({ error: 'Failed to fetch playlist songs' }, { status: 500 })
    }
    
    // Transform the data to include songs array
    const songs = playlistSongs?.map((ps: any) => ps.Song).filter(Boolean) || []
    const playlistWithSongs = {
      ...playlist,
      songs,
      song_count: songs.length
    }
    
    return NextResponse.json(playlistWithSongs)
  } catch (error) {
    console.error('Error fetching playlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    // Get the user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { playlistId } = await params
    const playlistIdNum = parseInt(playlistId)
    if (isNaN(playlistIdNum)) {
      return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 })
    }
    
    // Check if playlist exists and belongs to user
    const { data: playlist, error: fetchError } = await supabase
      .from('Playlist')
      .select('*')
      .eq('id', playlistIdNum)
      .eq('user_id', user.id)
      .single()
    
    if (fetchError || !playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }
    
    // Delete playlist songs first (due to foreign key constraints)
    const { error: deleteSongsError } = await supabase
      .from('PlaylistSong')
      .delete()
      .eq('playlist_id', playlistIdNum)
    
    if (deleteSongsError) {
      console.error('Error deleting playlist songs:', deleteSongsError)
      return NextResponse.json({ error: 'Failed to delete playlist songs' }, { status: 500 })
    }
    
    // Delete the playlist
    const { error: deleteError } = await supabase
      .from('Playlist')
      .delete()
      .eq('id', playlistIdNum)
      .eq('user_id', user.id)
    
    if (deleteError) {
      console.error('Supabase error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Playlist deleted successfully' })
  } catch (error) {
    console.error('Error deleting playlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 