import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { playlistId, songId } = await request.json()
    
    if (!playlistId || !songId) {
      return NextResponse.json({ error: 'Playlist ID and Song ID are required' }, { status: 400 })
    }
    
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
    
    // First, verify the playlist exists and belongs to the user
    const { data: playlist, error: playlistError } = await supabase
      .from('Playlist')
      .select('id, name')
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .single()
    
    if (playlistError || !playlist) {
      return NextResponse.json({ error: 'Playlist not found or access denied' }, { status: 404 })
    }
    
    // Check if song already exists in playlist
    const { data: existingSong, error: checkError } = await supabase
      .from('PlaylistSong')
      .select('id')
      .eq('playlist_id', playlistId)
      .eq('song_id', parseInt(songId))
      .single()
    
    if (existingSong) {
      return NextResponse.json({ error: 'Song already exists in playlist' }, { status: 409 })
    }
    
    // Add song to playlist
    const { data: playlistSong, error: insertError } = await supabase
      .from('PlaylistSong')
      .insert({
        playlist_id: playlistId,
        song_id: parseInt(songId),
        added_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error adding song to playlist:', insertError)
      return NextResponse.json({ error: 'Failed to add song to playlist' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      playlist: playlist.name,
      message: `Added to ${playlist.name}`
    })
  } catch (error) {
    console.error('Error in POST /api/playlists/add-song:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 