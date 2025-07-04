"use client"
import { useEffect, useState } from "react"
import { PlaylistCard, PlaylistCardSkeleton } from "@/components/ui/playlist-card"
import { CreatePlaylistDialog } from "@/components/ui/create-playlist-dialog"
import { Plus, Music } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Playlist {
  id: number
  name: string
  description?: string
  cover_url?: string
  is_public: boolean
  created_at: string
  song_count?: number
}

export function UserPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchPlaylists = async () => {
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

      const response = await fetch('/api/playlists', {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setPlaylists(data)
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch playlists:', response.status, errorText)
        toast({
          title: "Error",
          description: "Failed to load playlists",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching playlists:', error)
      toast({
        title: "Error",
        description: "Failed to load playlists",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [user?.id])

  const handlePlaylistCreated = () => {
    fetchPlaylists()
  }

  const handlePlayPlaylist = (playlistId: number) => {
    // TODO: Implement playlist playback
    console.log('Play playlist:', playlistId)
    toast({
      title: "Coming Soon",
      description: "Playlist playback will be available soon!",
    })
  }

  const handlePlaylistClick = (playlistId: number) => {
    // TODO: Navigate to playlist detail page
    console.log('View playlist:', playlistId)
    toast({
      title: "Coming Soon",
      description: "Playlist details will be available soon!",
    })
  }

  if (!user) {
    return null // Don't show playlists for non-authenticated users
  }

  return (
    <section>
      <div className="flex flex-col space-y-4 overflow-y-auto pb-4 scrollbar-hide">
        {loading ? (
          // Show skeleton loading
          Array.from({ length: 3 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} variant="compact" />
          ))
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              variant="compact"
              showActions={true}
              onPlay={handlePlayPlaylist}
              onClick={handlePlaylistClick}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center w-full py-8">
            <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg mb-2">No playlists yet</p>
            <p className="text-sm">Create your first playlist to get started!</p>
          </div>
        )}
      </div>
    </section>
  )
} 