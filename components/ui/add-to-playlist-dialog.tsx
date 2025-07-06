"use client"
import { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"
import { Music, Plus } from "lucide-react"
import { CreatePlaylistDialog } from "./create-playlist-dialog"

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

interface AddToPlaylistDialogProps {
  trigger: React.ReactNode
  songId: number
  songTitle: string
}

export function AddToPlaylistDialog({ trigger, songId, songTitle }: AddToPlaylistDialogProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchPlaylists = useCallback(async () => {
    if (!user?.id) return

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
        throw new Error('Failed to fetch playlists')
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
  }, [user?.id, toast])

  useEffect(() => {
    if (open) {
      fetchPlaylists()
    }
  }, [open, fetchPlaylists])

  const handleAddToPlaylist = async (playlistId: number) => {
    if (!user?.id) return

    try {
      setAdding(playlistId)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/playlists/add-song', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          playlist_id: playlistId,
          song_id: songId
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || `Added "${songTitle}" to playlist`,
        })
        setOpen(false)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to add song to playlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error)
      toast({
        title: "Error",
        description: "Failed to add song to playlist",
        variant: "destructive",
      })
    } finally {
      setAdding(null)
    }
  }

  const handlePlaylistCreated = () => {
    fetchPlaylists()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#181818] border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Add "{songTitle}" to a playlist</p>
          
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-white/10 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  className="w-full justify-start text-left p-4 h-auto hover:bg-white/10"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={adding === playlist.id}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                      <Music className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{playlist.name}</div>
                      <div className="text-gray-400 text-sm">
                        {playlist.song_count || 0} songs
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Music className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-lg mb-2">No playlists yet</p>
              <p className="text-sm mb-4">Create your first playlist to get started!</p>
            </div>
          )}
          
          <div className="border-t border-white/20 pt-4">
            <CreatePlaylistDialog 
              trigger={
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Playlist
                </Button>
              }
              onPlaylistCreated={handlePlaylistCreated}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}