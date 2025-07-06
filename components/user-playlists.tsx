"use client"
import { useEffect, useState, useCallback } from "react"
import { PlaylistCard, PlaylistCardSkeleton } from "@/components/ui/playlist-card"
import { CreatePlaylistDialog } from "@/components/ui/create-playlist-dialog"
import { Plus, Music, PlusCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"
import { useMusicPlayer } from "@/components/music-player"
import { Button } from "./ui/button"

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
  const { playPlaylist } = useMusicPlayer()

  const fetchPlaylists = useCallback(async () => {
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
  }, [user?.id])

  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  const handlePlaylistCreated = useCallback(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  const handlePlayPlaylist = (playlist_id: number) => {
    const playlist = playlists.find(p => p.id === playlist_id)
    if (playlist) {
      playPlaylist(playlist)
    }
  }

  const handlePlaylistClick = (playlist_id: number) => {
    // Navigate to playlist detail page
    window.location.href = `/playlist/${playlist_id}`
  }

  const handlePlaylistDeleted = useCallback(() => {
    // Refresh playlists after deletion
    fetchPlaylists()
  }, [fetchPlaylists])

  if (!user) {
    return null // Don't show playlists for non-authenticated users
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2 mb-2">
        <Music className="w-5 h-5 text-blue-500" />
        <span className="text-white font-semibold text-sm">Your Playlists</span>
      </div>
      <CreatePlaylistDialog 
            trigger={
              <Button size="icon" variant="ghost" className="text-white">
                <PlusCircle className="h-5 w-5" />
              </Button>
            }
          />
          </div>
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
              onPlaylistDeleted={handlePlaylistDeleted}
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