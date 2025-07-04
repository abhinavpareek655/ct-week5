"use client"
import { useEffect, useState } from "react"
import { PlaylistCard, PlaylistCardSkeleton } from "@/components/ui/playlist-card"
import { Music, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PublicPlaylist {
  id: number
  name: string
  description?: string
  cover_url?: string
  is_public: boolean
  created_at: string
  user_id: string
  song_count?: number
}

export function PublicPlaylists() {
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPublicPlaylists = async () => {
    try {
      setLoading(true)
      
      // Fetch public playlists using the API endpoint
      const response = await fetch('/api/playlists/public?limit=20')
      
      if (response.ok) {
        const data = await response.json()
        setPlaylists(data)
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch public playlists:', response.status, errorText)
        throw new Error('Failed to fetch public playlists')
      }
    } catch (error) {
      console.error('Error fetching public playlists:', error)
      toast({
        title: "Error",
        description: "Failed to load public playlists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicPlaylists()
  }, [])

  const handlePlayPlaylist = (playlistId: number) => {
    // TODO: Implement playlist playback
    console.log('Play public playlist:', playlistId)
    toast({
      title: "Coming Soon",
      description: "Playlist playback will be available soon!",
    })
  }

  const handlePlaylistClick = (playlistId: number) => {
    // TODO: Navigate to playlist detail page
    console.log('View public playlist:', playlistId)
    toast({
      title: "Coming Soon",
      description: "Playlist details will be available soon!",
    })
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Public Playlists</h2>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {loading ? (
          // Show skeleton loading using PlaylistCardSkeleton
          Array.from({ length: 6 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} variant="default" />
          ))
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={{
                id: playlist.id,
                name: playlist.name,
                description: playlist.description,
                cover_url: playlist.cover_url,
                is_public: playlist.is_public,
                created_at: playlist.created_at,
                song_count: playlist.song_count
              }}
              variant="default"
              showActions={true}
              onPlay={handlePlayPlaylist}
              onClick={handlePlaylistClick}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center w-full py-8">
            <Globe className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg mb-2">No public playlists yet</p>
            <p className="text-sm">Be the first to create a public playlist!</p>
          </div>
        )}
      </div>
    </section>
  )
} 