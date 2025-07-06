// Shared types for the music app

export interface Song {
  id: string
  title: string
  artist: string
  audio_url: string
  cover_url?: string
  album?: string
}

export interface Album {
  id: string
  title: string
  artist: string
  cover_url?: string
  genre?: string
  release_date?: string
  song_count?: number
  songs?: Song[]
}

export interface Playlist {
  id: number
  name: string
  description?: string
  cover_url?: string
  is_public: boolean
  created_at: string
  song_count?: number
} 