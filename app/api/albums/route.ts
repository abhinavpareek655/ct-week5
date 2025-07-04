import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch unique albums from Song table using Supabase
    const { data: songsWithAlbums, error } = await supabase
      .from('Song')
      .select('album, artist')
      .not('album', 'is', null)

    if (error) {
      throw error
    }

    // Create album objects from unique song albums
    const uniqueAlbums = Array.from(
      new Map(
        (songsWithAlbums || []).map(song => [song.album, song])
      ).values()
    )

    const albums = uniqueAlbums.map((song, index) => ({
      id: (index + 1).toString(),
      title: song.album || 'Unknown Album',
      artist_id: '1', // placeholder
      cover_url: null
    }))

    // Add some default albums if none exist
    if (albums.length === 0) {
      const defaultAlbums = [
        {
          id: '1',
          title: 'Favorites',
          artist_id: '1',
          cover_url: null
        },
        {
          id: '2', 
          title: 'Recently Added',
          artist_id: '1',
          cover_url: null
        },
        {
          id: '3',
          title: 'My Playlist',
          artist_id: '1', 
          cover_url: null
        }
      ]
      return NextResponse.json(defaultAlbums)
    }

    return NextResponse.json(albums)
  } catch (error) {
    console.error('Error in GET /api/albums:', error)
    // Return default albums as fallback
    const fallbackAlbums = [
      {
        id: '1',
        title: 'Favorites',
        artist_id: '1',
        cover_url: null
      },
      {
        id: '2',
        title: 'Recently Added', 
        artist_id: '1',
        cover_url: null
      },
      {
        id: '3',
        title: 'My Playlist',
        artist_id: '1',
        cover_url: null
      }
    ]
    return NextResponse.json(fallbackAlbums)
  }
}
