import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // First try to fetch from the Album table
    const { data: albumData, error: albumError } = await supabase
      .from('Album')
      .select(`
        id,
        title,
        cover_url,
        genre,
        release_date,
        Artist (
          id,
          name
        )
      `)
      .order('title')

    if (!albumError && albumData && albumData.length > 0) {
      // Transform the data to include artist name
      const transformedAlbums = albumData.map(album => ({
        id: album.id.toString(),
        title: album.title,
        artist: (album.Artist as any)?.name || 'Unknown Artist',
        cover_url: album.cover_url,
        genre: album.genre,
        release_date: album.release_date,
        song_count: 0 // We'll calculate this separately
      }))

      // Get song counts for each album
      const albumsWithCounts = await Promise.all(
        transformedAlbums.map(async (album) => {
          const { count } = await supabase
            .from('Song')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', parseInt(album.id))
          
          return {
            ...album,
            song_count: count || 0
          }
        })
      )

      return NextResponse.json(albumsWithCounts)
    }

    // Fallback: Fetch unique albums from Song table
    const { data: songsWithAlbums, error } = await supabase
      .from('Song')
      .select('album, artist, cover_url')
      .not('album', 'is', null)
      .not('album', 'eq', '')

    if (error) {
      throw error
    }

    // Create album objects from unique song albums
    const uniqueAlbums = Array.from(
      new Map(
        (songsWithAlbums || []).map(song => [song.album, song])
      ).values()
    )

    const fallbackAlbums = uniqueAlbums.map((song, index) => ({
      id: (index + 1).toString(),
      title: song.album || 'Unknown Album',
      artist: song.artist || 'Unknown Artist',
      cover_url: song.cover_url,
      genre: null,
      release_date: null,
      song_count: 0 // We'll calculate this separately
    }))

    // Get song counts for each album
    const fallbackAlbumsWithCounts = await Promise.all(
      fallbackAlbums.map(async (album) => {
        const { count } = await supabase
          .from('Song')
          .select('*', { count: 'exact', head: true })
          .eq('album', album.title)
        
        return {
          ...album,
          song_count: count || 0
        }
      })
    )

    return NextResponse.json(fallbackAlbumsWithCounts)
  } catch (error) {
    console.error('Error in GET /api/albums:', error)
    // Return empty array as fallback
    return NextResponse.json([])
  }
}
