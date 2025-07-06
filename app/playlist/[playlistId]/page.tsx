"use client"
import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Play, Music } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useMusicPlayer } from "@/components/music-player"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Song {
  id: string
  title: string
  artist: string
  album?: string
  cover_url?: string
  audio_url: string
}

interface Playlist {
  id: number
  name: string
  description?: string
  cover_url?: string
  is_public: boolean
  created_at: string
  song_count?: number
  songs?: Song[]
}

export default function PlaylistDetailPage() {
  const params = useParams()
  const playlistId = params.playlistId as string
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { playSong } = useMusicPlayer()
  const { toast } = useToast()

  const fetchPlaylist = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/playlists/${playlistId}`, {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setPlaylist(data)
      } else {
        throw new Error('Failed to fetch playlist')
      }
    } catch (error) {
      console.error('Error fetching playlist:', error)
      toast({
        title: "Error",
        description: "Failed to load playlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [playlistId, toast])

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist()
    }
  }, [playlistId, fetchPlaylist])

  const handlePlaySong = (song: Song) => {
    playSong(song)
  }

  const handleBack = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="w-full aspect-square bg-white/10 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                      <div className="w-12 h-12 bg-white/10 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold text-white mb-2">Playlist Not Found</h1>
          <p className="text-gray-400 mb-6">The playlist you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={handleBack} className="bg-blue-500 hover:bg-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button onClick={handleBack} variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Playlist Info */}
          <div className="md:col-span-1">
            <div className="bg-white/5 rounded-lg p-6">
              <Image
                src={playlist.cover_url || "/placeholder.svg"}
                alt={playlist.name}
                width={300}
                height={300}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold text-white mb-2">{playlist.name}</h2>
              {playlist.description && (
                <p className="text-gray-400 mb-4">{playlist.description}</p>
              )}
              <p className="text-gray-400 text-sm mb-4">
                {playlist.song_count || 0} song{(playlist.song_count || 0) !== 1 ? 's' : ''}
              </p>
              <p className="text-gray-500 text-xs">
                Created {new Date(playlist.created_at).toLocaleDateString()}
              </p>
              {playlist.is_public && (
                <div className="mt-4">
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    Public Playlist
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Songs List */}
          <div className="md:col-span-2">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Songs</h3>
                {user && (
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Songs
                  </Button>
                )}
              </div>
              
              {playlist.songs && Array.isArray(playlist.songs) && playlist.songs.length > 0 ? (
                <div className="space-y-2">
                  {playlist.songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image
                          src={song.cover_url || "/placeholder.svg"}
                          alt={song.title}
                          width={48}
                          height={48}
                          className="rounded object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{song.title}</h4>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg mb-2">No songs in this playlist</p>
                  <p className="text-sm">Add some songs to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 