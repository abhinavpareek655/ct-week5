import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch recently played songs with song details
    const { data, error } = await supabase
      .from('PlayHistory')
      .select(`
        played_at,
        Song (
          id,
          title,
          artist,
          album,
          cover_url,
          audio_url
        )
      `)
      .eq('user_id', user_id)
      .order('played_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recently played:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recently played songs' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const recentlyPlayed = data?.map(item => ({
      id: item.Song.id,
      title: item.Song.title,
      artist: item.Song.artist,
      album: item.Song.album,
      cover_url: item.Song.cover_url,
      audio_url: item.Song.audio_url,
      played_at: formatTimeAgo(new Date(item.played_at))
    })) || []

    return NextResponse.json(recentlyPlayed)
  } catch (error) {
    console.error('Error in recently played fetch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return `${Math.floor(diffInSeconds / 2592000)} months ago`
} 