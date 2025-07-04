import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // First try to get albums from Song table (since songs have album field)
    const songsWithAlbums = await prisma.song.findMany({
      where: {
        album: {
          not: null
        }
      },
      select: {
        album: true,
        artist: true
      },
      distinct: ['album']
    })
    
    // Create album objects from unique song albums
    const albums = songsWithAlbums.map((song, index) => ({
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
