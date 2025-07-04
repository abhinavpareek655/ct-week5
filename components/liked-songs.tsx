"use client"
import { useEffect, useState } from "react"
import { SongCard, SongCardSkeleton } from "@/components/ui/song-card"
import { Heart, Music } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useMusicPlayer } from "@/components/music-player"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface LikedSong {
  id: string
  title: string
  artist: string
  album?: string
  cover_url?: string
  audio_url: string
  plays?: number
}

export function LikedSongs() {
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { playSong } = useMusicPlayer()
  const { toast } = useToast()

  const fetchLikedSongs = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/user/liked-songs', {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setLikedSongs(data.slice(0, 5)) // Show only first 5 for sidebar
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch liked songs:', response.status, errorText)
      }
    } catch (error) {
      console.error('Error fetching liked songs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLikedSongs()
  }, [user?.id])

  const handlePlaySong = (song: LikedSong) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audio_url: song.audio_url,
      cover_url: song.cover_url,
      album: song.album
    })
  }

  const handlePlaySongById = (songId: number) => {
    const song = likedSongs.find(s => parseInt(s.id) === songId)
    if (song) {
      handlePlaySong(song)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Heart className="w-5 h-5 text-red-500" />
        <span className="text-white font-semibold text-sm">Liked Songs</span>
      </div>
      
      <div className="space-y-2">
        {loading ? (
          // Show skeleton loading
          Array.from({ length: 3 }).map((_, i) => (
            <SongCardSkeleton key={i} variant="compact" />
          ))
        ) : likedSongs.length > 0 ? (
          likedSongs.map((song) => (
            <SongCard
              key={song.id}
              song={{
                id: parseInt(song.id),
                title: song.title,
                artist: song.artist,
                album: song.album,
                cover_url: song.cover_url
              }}
              variant="compact"
              showActions={false}
              onPlay={handlePlaySongById}
              onClick={handlePlaySongById}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-4">
            <Heart className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-xs">No liked songs yet</p>
          </div>
        )}
      </div>
      
      {likedSongs.length > 0 && (
        <div className="pt-2 border-t border-gray-700">
          <button 
            className="text-gray-400 hover:text-white text-xs transition-colors"
            onClick={() => {
              // TODO: Navigate to full liked songs page
              toast({
                title: "Coming Soon",
                description: "Full liked songs page will be available soon!",
              })
            }}
          >
            View all {likedSongs.length} liked songs
          </button>
        </div>
      )}
    </div>
  )
} 