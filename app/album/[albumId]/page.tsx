"use client"
import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Play, Music, Disc } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useMusicPlayer } from "@/components/music-player"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Album, Song } from "@/lib/types"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AlbumDetailPage() {
  const params = useParams()
  const albumId = params.albumId as string
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { playSong } = useMusicPlayer()
  const { toast } = useToast()

  const fetchAlbum = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/albums/${albumId}`, {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setAlbum(data)
      } else {
        throw new Error('Failed to fetch album')
      }
    } catch (error) {
      console.error('Error fetching album:', error)
      toast({
        title: "Error",
        description: "Failed to load album",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [albumId, toast])

  useEffect(() => {
    if (albumId) {
      fetchAlbum()
    }
  }, [albumId, fetchAlbum])

  const handlePlaySong = (song: Song) => {
    playSong(song)
  }

  const handleBack = () => {
    window.history.back()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.getFullYear()
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

  if (!album) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <Disc className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold text-white mb-2">Album Not Found</h1>
          <p className="text-gray-400 mb-6">The album you're looking for doesn't exist or you don't have access to it.</p>
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
          <h1 className="text-2xl font-bold text-white">{album.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Album Info */}
          <div className="md:col-span-1">
            <div className="bg-white/5 rounded-lg p-6">
              <Image
                src={album.cover_url || "/placeholder.svg"}
                alt={album.title}
                width={300}
                height={300}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold text-white mb-2">{album.title}</h2>
              <p className="text-gray-400 mb-2">{album.artist}</p>
              {album.genre && (
                <p className="text-gray-400 mb-4">{album.genre}</p>
              )}
              <p className="text-gray-400 text-sm mb-4">
                {album.song_count || 0} song{(album.song_count || 0) !== 1 ? 's' : ''}
              </p>
              {album.release_date && (
                <p className="text-gray-500 text-xs mb-4">
                  Released {formatDate(album.release_date)}
                </p>
              )}
            </div>
          </div>

          {/* Songs List */}
          <div className="md:col-span-2">
            <div className="space-y-2">
              {album.songs && album.songs.length > 0 ? (
                album.songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => handlePlaySong(song)}
                  >
                    <div className="w-12 h-12 relative">
                      <Image
                        src={song.cover_url || "/placeholder.svg"}
                        alt={song.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlaySong(song)
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Songs</h3>
                  <p className="text-gray-400">This album has no songs yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 