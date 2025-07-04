"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'
import { useToast } from "@/hooks/use-toast"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function TestLikeFeature() {
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Test song ID (you can change this to any song ID that exists in your database)
  const song_id = "1"

  const checkLikedStatus = async () => {
    if (!user) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      
      const response = await fetch(`/api/user/liked-songs/${song_id}`, {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
      }
    } catch (error) {
      console.error('Error checking liked status:', error)
    }
  }

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like songs",
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
      
      const response = await fetch('/api/user/liked-songs', {
        method: isLiked ? 'DELETE' : 'POST',
        headers,
        body: JSON.stringify({ song_id: song_id, user_id: user.id }),
      })
      
      if (response.ok) {
        setIsLiked(!isLiked)
        toast({
          title: isLiked ? 'Removed from liked songs' : 'Added to liked songs',
          description: `Song ${song_id}`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update liked status')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update liked status',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-900">
      <h3 className="text-lg font-semibold mb-4">Test Like Feature</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Current Status: {isLiked ? 'Liked' : 'Not Liked'}</p>
          <p className="text-sm text-gray-400">User: {user ? user.email : 'Not logged in'}</p>
          <p className="text-sm text-gray-400">Song ID: {song_id}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={checkLikedStatus}
            variant="outline"
            size="sm"
          >
            Check Status
          </Button>
          
          <Button 
            onClick={toggleLike}
            disabled={loading || !user}
            size="sm"
            className={isLiked ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {loading ? 'Loading...' : (isLiked ? 'Unlike' : 'Like')}
          </Button>
        </div>
      </div>
    </div>
  )
} 