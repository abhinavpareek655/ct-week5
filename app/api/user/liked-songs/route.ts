import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseWithAuth(accessToken: string | undefined) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      : undefined
  )
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')
    const supabase = getSupabaseWithAuth(accessToken)

    const body = await request.json()
    const { song_id, user_id } = body

    if (!song_id || !user_id) {
      return NextResponse.json(
        { error: 'Song ID and User ID are required' },
        { status: 400 }
      )
    }

    const insertData = {
      user_id,
      song_id: parseInt(song_id),
      liked_at: new Date().toISOString()
    }

    const { data, error: likedSongsError } = await supabase
      .from('UserLikedSongs')
      .insert(insertData)
      .select()

    if (likedSongsError) {
      return NextResponse.json(
        {
          error: 'Failed to add liked song',
          details: likedSongsError.message,
          code: likedSongsError.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')
    const supabase = getSupabaseWithAuth(accessToken)
    const { song_id, user_id } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove song from liked songs
    const { error } = await supabase
      .from('UserLikedSongs')
      .delete()
      .eq('user_id', user.id)
      .eq('song_id', parseInt(song_id))

    if (error) {
      return NextResponse.json({ error: 'Failed to remove liked song' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')
    const supabase = getSupabaseWithAuth(accessToken)
    if (!accessToken) {
      return NextResponse.json([], { status: 200 })
    }

    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return NextResponse.json([], { status: 200 })
    }

    // Fetch liked songs for the user, join with Song table for details
    const { data, error } = await supabase
      .from('UserLikedSongs')
      .select(`song_id, liked_at, Song!UserLikedSongs_song_id_fkey (id, title, artist, album, cover_url, audio_url, plays)`)
      .eq('user_id', user.id)
      .order('liked_at', { ascending: false })

    if (error) {
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
    return NextResponse.json([], { status: 200 })
  }
}
