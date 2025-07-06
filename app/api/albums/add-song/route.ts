import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { albumId, song_id } = await request.json()
    
    if (!albumId || !song_id) {
      return NextResponse.json({ error: 'Album ID and Song ID are required' }, { status: 400 })
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
    
    // Get the album name from our predefined albums
    const albumNames = {
      '1': 'Favorites',
      '2': 'Recently Added', 
      '3': 'My Playlist'
    }
    
    const albumName = albumNames[albumId as keyof typeof albumNames] || 'Favorites'
    
    // Update the song's album field using Supabase
    const { data: updatedSong, error: updateError } = await supabase
      .from('Song')
      .update({ album: albumName })
      .eq('id', parseInt(song_id))
      .select()
      .single()
    
    if (updateError || !updatedSong) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, album: albumName })
  } catch (error) {
    console.error('Error in POST /api/albums/add-song:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
