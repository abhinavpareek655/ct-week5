"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface CreatePlaylistDialogProps {
  onPlaylistCreated?: () => void
  trigger?: React.ReactNode
}

export function CreatePlaylistDialog({ onPlaylistCreated, trigger }: CreatePlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false
  })
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
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

      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public
        })
      })

      if (response.ok) {
        const playlist = await response.json()
        toast({
          title: "Success",
          description: `Playlist "${playlist.name}" created successfully!`,
        })
        setOpen(false)
        setFormData({ name: '', description: '', is_public: false })
        onPlaylistCreated?.()
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
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-white text-black font-bold rounded-full px-4 py-2 w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Create playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#181818] border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Playlist'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 