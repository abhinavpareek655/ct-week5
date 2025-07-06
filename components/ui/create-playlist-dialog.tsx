"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Loader2, Music } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'
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
  plays?: number
}

interface CreatePlaylistDialogProps {
  trigger?: React.ReactNode
}

export function CreatePlaylistDialog({ trigger }: CreatePlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false
  })
  const { toast } = useToast()
  const { user } = useAuth()
  const isMounted = useRef(false) // Add ref to track mount state

  // Add mount status check to prevent initial fetch
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchLikedSongs = useCallback(async () => {
    if (!user?.id) return

    try {
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
        const newData = data.slice(0, 20) // Show up to 20 liked songs
        
        // Add mount check before state update
        if (isMounted.current) {
          setLikedSongs(prev => {
            const prevIds = prev.map((song: Song) => song.id).join(',')
            const newIds = newData.map((song: Song) => song.id).join(',')
            return prevIds === newIds ? prev : newData
          })
        }
      }
    } catch (error) {
      console.error('Error fetching liked songs:', error)
    }
  }, [user?.id])

  useEffect(() => {
    // Only fetch if mounted and dialog is open
    if (open && user?.id && isMounted.current) {
      fetchLikedSongs()
    }
  }, [open, user?.id]) // Remove fetchLikedSongs from dependencies

  const handleSongToggle = useCallback((songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    )
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a playlist",
        variant: "destructive",
      })
      return
    }

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Playlist name is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      // Get current state values to avoid dependency issues
      const currentSelectedSongs = selectedSongs;
      const currentLikedSongs = likedSongs;
      
      if (currentSelectedSongs.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one song for your playlist",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Get the first selected song for cover
      const firstSong = currentLikedSongs.find((song: Song) => song.id === currentSelectedSongs[0])
      const cover_url = firstSong?.cover_url

      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          cover_url
        })
      })

      if (response.ok) {
        const playlist = await response.json()
        
        // Add songs to playlist
        for (const songId of currentSelectedSongs) {
          const addSongResponse = await fetch('/api/playlists/add-song', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              playlist_id: playlist.id,
              song_id: songId
            })
          })
          
          if (!addSongResponse.ok) {
            console.error('Failed to add song to playlist:', songId)
          }
        }

        toast({
          title: "Success",
          description: `Playlist "${playlist.name}" created with ${currentSelectedSongs.length} song${currentSelectedSongs.length !== 1 ? 's' : ''}!`,
        })
        
        // Use setTimeout to ensure state updates happen after the current render cycle
        setTimeout(() => {
          setOpen(false)
          setFormData({ name: '', description: '', is_public: false })
          setSelectedSongs([])
          
          // Trigger a page refresh to update playlists
          window.location.reload()
        }, 0)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create playlist')
      }
    } catch (error) {
      console.error('Error creating playlist:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create playlist",
        variant: "destructive",
      })
    } finally {
      // Ensure loading state is reset after the current render cycle
      setTimeout(() => {
        setLoading(false)
      }, 0)
    }
  }, [user, formData, toast])

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset state when dialog closes
      setSelectedSongs([])
      setFormData({ name: '', description: '', is_public: false })
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-white text-black font-bold rounded-full px-4 py-2 w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Create playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#181818] border-white/20 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Playlist Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter playlist name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add a description (optional)"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={formData.is_public}
                onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                disabled={loading}
              />
              <Label htmlFor="public" className="text-white">Make playlist public</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-white" />
              <Label className="text-white">Select Songs *</Label>
              <span className="text-gray-400 text-sm">
                ({selectedSongs.length} selected)
              </span>
            </div>
            
            {likedSongs.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {likedSongs.map((song: Song) => {
                  const isSelected = selectedSongs.includes(song.id);
                  return (
                    <div
                      key={song.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                      
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      onKeyDown={e => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleSongToggle(song.id);
                        }
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSongToggle(song.id)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <Image
                        src={song.cover_url || "/placeholder.svg"}
                        alt={song.title}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{song.title}</p>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p>No liked songs</p>
                <p className="text-sm">Like some songs first to create a playlist</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || selectedSongs.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create Playlist (${selectedSongs.length} song${selectedSongs.length !== 1 ? 's' : ''})`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 