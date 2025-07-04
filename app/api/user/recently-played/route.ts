import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
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
    
    // Get recently played songs with full song details using Supabase
    const { data: recentlyPlayed, error: fetchError } = await supabase
      .from('PlayHistory')
      .select(`
        *,
        Song (
          id,
          title,
          artist,
          album,
          cover_url,
          audio_url,
          plays
        )
      `)
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(20)
    
    if (fetchError) {
      console.error('Supabase error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch recently played songs' }, { status: 500 })
    }
    
    if (!recentlyPlayed || recentlyPlayed.length === 0) {
      return NextResponse.json([])
    }
    
    // Remove duplicates by song ID and transform the data
    const uniqueSongs = new Map()
    
    recentlyPlayed.forEach(play => {
      if (play.Song && !uniqueSongs.has(play.Song.id)) {
        uniqueSongs.set(play.Song.id, {
          id: play.Song.id.toString(),
          title: play.Song.title,
          artist: play.Song.artist,
          album: play.Song.album,
          audio_url: play.Song.audio_url,
          cover_url: play.Song.cover_url,
          plays: play.Song.plays,
          lastplayed_at: play.played_at
        })
      }
    })
    
    const songs = Array.from(uniqueSongs.values())
    
    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching recently played songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
