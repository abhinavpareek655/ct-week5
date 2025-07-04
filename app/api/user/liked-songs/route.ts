import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/user/liked-songs')

    const body = await request.json()
    console.log('📝 Request body:', body)

    const { song_id, user_id } = body

    if (!song_id || !user_id) {
      console.error('❌ Missing required fields:', { song_id, user_id })
      return NextResponse.json(
        { error: 'Song ID and User ID are required' },
        { status: 400 }
      )
    }

    console.log('📊 Recording play for user:', user_id, 'song:', song_id)

    const insertData = {
      user_id,
      song_id: parseInt(song_id),
      liked_at: new Date().toISOString()
    }

    console.log('📝 Insert data:', insertData)
    
    const { data, error: likedSongsError } = await supabase
      .from('UserLikedSongs')
      .insert(insertData)
      .select()
    
    if (likedSongsError) {
      console.error('❌ Supabase error details:', {
        message: likedSongsError.message,
        details: likedSongsError.details,
        hint: likedSongsError.hint,
        code: likedSongsError.code
      })
      return NextResponse.json(
        { 
          error: 'Failed to add liked song',
          details: likedSongsError.message,
          code: likedSongsError.code
        },
        { status: 500 }
      )
    }

    console.log('✅ Liked song added successfully:', data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/user/liked-songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { songId } = await request.json()
    
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
    
    // Remove song from liked songs
    const { error } = await supabase
      .from('UserLikedSongs')
      .delete()
      .eq('user_id', user.id)
      .eq('song_id', parseInt(songId))
    
    if (error) {
      console.error('Error removing liked song:', error)
      return NextResponse.json({ error: 'Failed to remove liked song' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/user/liked-songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json([], { status: 200 }) // Return empty array if not logged in
    }

    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json([], { status: 200 }) // Return empty array if not logged in
    }

    // Fetch liked songs for the user, join with Song table for details
    const { data, error } = await supabase
      .from('UserLikedSongs')
      .select(`song_id, liked_at, Song!UserLikedSongs_song_id_fkey (id, title, artist, album, cover_url, audio_url, plays)`)
      .eq('user_id', user.id)
      .order('liked_at', { ascending: false })

    if (error) {
      console.error('Error fetching liked songs:', error)
      return NextResponse.json([], { status: 200 })
    }

    // Transform the data to match the expected format
    const likedSongs = (data || []).map(item => {
      const song = Array.isArray(item.Song) ? item.Song[0] : item.Song;
      return {
        id: song?.id?.toString() || '',
        title: song?.title || '',
        artist: song?.artist || '',
        album: song?.album || '',
        cover_url: song?.cover_url || '',
        audio_url: song?.audio_url || '',
        plays: song?.plays,
        likedAt: item.liked_at
      }
    })

    return NextResponse.json(likedSongs)
  } catch (error) {
    console.error('Error in GET /api/user/liked-songs:', error)
    return NextResponse.json([], { status: 200 })
  }
}
