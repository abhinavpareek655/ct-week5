import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Heart, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { genres } from "@/assets/constants"
import { AddToPlaylistDialog } from "./add-to-playlist-dialog"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from "react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SongCardProps {
  song: {
    id: number
    title: string
    artist: string
    album?: string
    genre?: string
    cover_url?: string
    duration?: string
    played_at?: string
    trend?: string
    rank?: number
    lyrics?: string
  }
  variant?: "default" | "compact" | "featured"
  showPlayButton?: boolean
  showActions?: boolean
  showMetadata?: boolean
  className?: string
  onPlay?: (song_id: number) => void
  onLike?: (song_id: number) => void
  onMore?: (song_id: number) => void
  onClick?: (song_id: number) => void
}

export function SongCard({
  song,
  variant = "default",
  showPlayButton = true,
  showActions = false,
  showMetadata = false,
  className = "",
  onPlay,
  onLike,
  onMore,
  onClick,
}: SongCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [likingInProgress, setLikingInProgress] = useState(false)

  // Check if song is already liked
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user?.id) return

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) return

        const response = await fetch('/api/user/liked-songs', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.ok) {
          const likedSongs = await response.json()
          setIsLiked(likedSongs.some((likedSong: any) => parseInt(likedSong.id) === song.id))
        }
      } catch (error) {
        console.error('Error checking liked status:', error)
      }
    }

    checkIfLiked()
  }, [user?.id, song.id])

  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onPlay?.(song.id)
  }

  const handleLike = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    
    if (!user?.id) {
      toast({
        title: "Login Required",
        description: "Please login to like songs",
        variant: "destructive",
      })
      return
    }

    if (likingInProgress) return

    try {
      setLikingInProgress(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      }

      if (isLiked) {
        // Unlike the song
        const response = await fetch('/api/user/liked-songs', {
          method: 'DELETE',
          headers,
          body: JSON.stringify({
            song_id: song.id,
            user_id: user.id
          })
        })

        if (response.ok) {
          setIsLiked(false)
          toast({
            title: "Removed from liked songs",
            description: `"${song.title}" has been removed from your liked songs`,
          })
        } else {
          throw new Error('Failed to unlike song')
        }
      } else {
        // Like the song
        const response = await fetch('/api/user/liked-songs', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            song_id: song.id,
            user_id: user.id
          })
        })

        if (response.ok) {
          setIsLiked(true)
          toast({
            title: "Added to liked songs",
            description: `"${song.title}" has been added to your liked songs`,
          })
        } else {
          throw new Error('Failed to like song')
        }
      }
    } catch (error) {
      console.error('Error handling like:', error)
      toast({
        title: "Error",
        description: "Failed to update liked status",
        variant: "destructive",
      })
    } finally {
      setLikingInProgress(false)
    }

    // Call the original onLike callback if provided
    onLike?.(song.id)
  }

  const handleMore = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onMore?.(song.id)
  }

  const handleCardClick = () => {
    onClick?.(song.id)
  }

  if (variant === "compact") {
    return (
      <Card 
        className={`group bg-[#181818] rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={song.cover_url || "/placeholder.svg"}
                alt={song.title}
                width={64}
                height={64}
                className="rounded-lg object-cover w-full h-full"
              />
              {showPlayButton && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-400 rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-[4px_4px_8px_rgba(0,0,0,0.5)] z-100"
                    onClick={(e) => handlePlay(e)}
                  >
                    <Play className="w-3 h-3 fill-black text-black" />
                  </Button>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">{song.title}</h3>
              <p className="text-gray-400 text-xs truncate">{song.artist}</p>
              {song.album && (
                <p className="text-gray-500 text-xs truncate">{song.album}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Like Button */}
              <Button
                size="icon"
                variant="ghost"
                className={`opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 ${
                  isLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'
                }`}
                onClick={handleLike}
                disabled={likingInProgress}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              {/* Add to Playlist Button */}
              <AddToPlaylistDialog
                trigger={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                }
                songId={song.id}
                songTitle={song.title}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card 
        className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group flex-shrink-0 w-48 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Image
              src={song.cover_url || "/placeholder.svg"}
              alt={song.title}
              width={160}
              height={160}
              className="w-full aspect-square object-cover rounded-lg shadow-lg"
            />
            {showPlayButton && (
              <Button
                size="icon"
                onClick={(e) => handlePlay(e)}
                className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
              >
                <Play className="w-4 h-4 text-white" />
              </Button>
            )}
            {song.rank && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                #{song.rank}
              </div>
            )}
            {song.trend && (
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                song.trend.startsWith('+') ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
              }`}>
                {song.trend}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
          <p className="text-gray-400 text-sm mb-2 truncate">{song.artist}</p>
          {showMetadata && song.album && (
            <p className="text-gray-500 text-xs mb-1 truncate">{song.album}</p>
          )}
          {showMetadata && song.genre && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs">{song.genre}</Badge>
          )}
          {song.played_at && (
            <p className="text-gray-500 text-xs mt-2">{song.played_at}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant (similar to recently played)
  return (
    <Card 
      className={`bg-[181818] hover:bg-gradient-to-b hover:from-[#181818] hover:to-white/10 transition-all duration-300 group flex-shrink-0 w-48 border-none cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Image
            src={song.cover_url || "/placeholder.svg"}
            alt={song.title}
            width={160}
            height={160}
            className="w-full aspect-square object-cover rounded-lg shadow-lg"
          />
          {showPlayButton && (
            <Button
              size="icon"
              onClick={(e) => handlePlay(e)}
              className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-[4px_4px_8px_rgba(0,0,0,0.6)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.8)] z-50 hover:scale-105 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-black fill-black" />
            </Button>
          )}
        </div>
        <div>
            <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
            <p className="text-gray-400 text-sm mb-2 truncate">{song.artist}</p>
            {showMetadata && song.album && (
            <p className="text-gray-500 text-xs mb-1 truncate">{song.album}</p>
            )}
            {showMetadata && song.genre && (
            <Badge className="bg-white text-black font-bold">{genres.find(genre => genre.value === song.genre)?.title}</Badge>
            )}
            {song.played_at && (
            <p className="text-gray-500 text-xs">{song.played_at}</p>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

interface SongCardSkeletonProps {
  variant?: "default" | "compact" | "featured"
  className?: string
}

export function SongCardSkeleton({ variant = "default", className = "" }: SongCardSkeletonProps) {
  if (variant === "compact") {
    return (
      <Card className={`bg-white/10 backdrop-blur-md border-white/20 max-w-full w-full ${className}`}>
        <CardContent className="p-4 w-full max-w-full">
          <div className="flex items-center space-x-4 w-full max-w-full">
            <Skeleton className="w-15 h-15 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton className="h-4 w-3/4 max-w-full" />
              <Skeleton className="h-3 w-1/2 max-w-full" />
              <Skeleton className="h-3 w-1/3 max-w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card className={`bg-white/10 backdrop-blur-md border-white/20 flex-shrink-0 w-48 ${className}`}>
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="absolute top-2 left-2">
              <Skeleton className="w-6 h-5 rounded text-xs" />
            </div>
            <div className="absolute top-2 right-2">
              <Skeleton className="w-8 h-5 rounded text-xs" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant skeleton
  return (
    <Card className={`bg-white/10 backdrop-blur-md border-white/20 flex-shrink-0 w-48 ${className}`}>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardContent>
    </Card>
  )
}
