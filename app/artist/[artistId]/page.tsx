"use client"
import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Music, User } from "lucide-react"
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
  genre?: string
  plays?: number
}

interface Artist {
  id: number
  name: string
  image_url?: string
  country?: string
  monthly_listeners?: number
  songs?: Song[]
}

export default function ArtistPage() {
  const params = useParams()
  const artistId = params.artistId as string
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const { playSong } = useMusicPlayer()
  const { toast } = useToast()

  const fetchArtistData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch artist info
      const { data: artistData, error: artistError } = await supabase
        .from('Artist')
        .select('*')
        .eq('id', artistId)
        .single()

      if (artistError) {
        throw new Error('Failed to fetch artist data')
      }

      // Fetch artist's songs
      const { data: songsData, error: songsError } = await supabase
        .from('Song')
        .select('*')
        .eq('artist', artistData.name)
        .order('plays', { ascending: false })

      if (songsError) {
        console.error('Error fetching songs:', songsError)
      }

      setArtist({
        ...artistData,
        songs: songsData || []
      })
    } catch (error) {
      console.error('Error fetching artist data:', error)
      toast({
        title: "Error",
        description: "Failed to load artist data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [artistId, toast])

  useEffect(() => {
    if (artistId) {
      fetchArtistData()
    }
  }, [artistId, fetchArtistData])

  const handlePlaySong = (song: Song) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audio_url: song.audio_url,
      cover_url: song.cover_url,
      album: song.album
    })
  }

  const handlePlayAllSongs = () => {
    if (artist?.songs && artist.songs.length > 0) {
      handlePlaySong(artist.songs[0])
    }
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
                <div className="w-full aspect-square bg-white/10 rounded-full mb-4"></div>
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

  if (!artist) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold text-white mb-2">Artist Not Found</h1>
          <p className="text-gray-400 mb-6">The artist you're looking for doesn't exist.</p>
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
          <h1 className="text-2xl font-bold text-white">{artist.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Artist Info */}
          <div className="md:col-span-1">
            <div className="bg-white/5 rounded-lg p-6">
              <Image
                src={artist.image_url || "/placeholder-user.jpg"}
                alt={artist.name}
                width={300}
                height={300}
                className="w-full aspect-square object-cover rounded-full mb-4"
              />
              <h2 className="text-xl font-bold text-white mb-2">{artist.name}</h2>
              {artist.country && (
                <p className="text-gray-400 mb-4">{artist.country}</p>
              )}
              {artist.monthly_listeners && (
                <p className="text-gray-400 text-sm mb-4">
                  {artist.monthly_listeners.toLocaleString()} monthly listeners
                </p>
              )}
              <p className="text-gray-400 text-sm mb-4">
                {artist.songs?.length || 0} song{(artist.songs?.length || 0) !== 1 ? 's' : ''}
              </p>
              
              {artist.songs && artist.songs.length > 0 && (
                <Button 
                  onClick={handlePlayAllSongs}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play All Songs
                </Button>
              )}
            </div>
          </div>

          {/* Songs List */}
          <div className="md:col-span-2">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Popular Songs</h3>
              </div>
              
              {artist.songs && Array.isArray(artist.songs) && artist.songs.length > 0 ? (
                <div className="space-y-2">
                  {artist.songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-400 text-sm group-hover:hidden">
                          {index + 1}
                        </span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block" />
                      </div>
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
                        <p className="text-gray-400 text-sm truncate">{song.album || 'Single'}</p>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {song.plays ? `${song.plays.toLocaleString()} plays` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg mb-2">No songs available</p>
                  <p className="text-sm">This artist doesn't have any songs yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}