import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, Music } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PlaylistCardProps {
  playlist: {
    id: number
    name: string
    description?: string
    cover_url?: string
    is_public: boolean
    created_at: string
    song_count?: number
  }
  variant?: "default" | "compact"
  showActions?: boolean
  className?: string
  onPlay?: (playlistId: number) => void
  onMore?: (playlistId: number) => void
  onClick?: (playlistId: number) => void
}

export function PlaylistCard({
  playlist,
  variant = "default",
  showActions = false,
  className = "",
  onPlay,
  onMore,
  onClick,
}: PlaylistCardProps) {
  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onPlay?.(playlist.id)
  }

  const handleMore = () => {
    onMore?.(playlist.id)
  }

  const handleCardClick = () => {
    onClick?.(playlist.id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
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
                src={playlist.cover_url || "/placeholder.svg"}
                alt={playlist.name}
                width={64}
                height={64}
                className="rounded-lg object-cover w-full h-full"
              />
              <Button
                size="icon"
                className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-400 rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-[4px_4px_8px_rgba(0,0,0,0.5)] z-100"
                onClick={(e) => handlePlay(e)}
              >
                <Play className="w-3 h-3 fill-black text-black" />
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-xs truncate">
                {playlist.song_count || 0} songs
              </p>
              {playlist.description && (
                <p className="text-gray-500 text-xs truncate">{playlist.description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {playlist.is_public && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">Public</Badge>
              )}
              {showActions && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                  onClick={handleMore}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card 
      className={`bg-[#181818] hover:bg-gradient-to-b hover:from-[#181818] hover:to-white/10 transition-all duration-300 group flex-shrink-0 w-48 border-none cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Image
            src={playlist.cover_url || "/placeholder.svg"}
            alt={playlist.name}
            width={160}
            height={160}
            className="w-full aspect-square object-cover rounded-lg shadow-lg"
          />
          <Button
            size="icon"
            onClick={(e) => handlePlay(e)}
            className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-[4px_4px_8px_rgba(0,0,0,0.6)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.8)] z-50 hover:scale-105 transition-all duration-200"
          >
            <Play className="w-4 h-4 text-black fill-black" />
          </Button>
          {playlist.is_public && (
            <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
              Public
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
          <p className="text-gray-400 text-sm mb-2 truncate">
            {playlist.song_count || 0} songs
          </p>
          {playlist.description && (
            <p className="text-gray-500 text-xs mb-1 truncate">{playlist.description}</p>
          )}
          <p className="text-gray-500 text-xs">{formatDate(playlist.created_at)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface PlaylistCardSkeletonProps {
  variant?: "default" | "compact"
  className?: string
}

export function PlaylistCardSkeleton({ variant = "default", className = "" }: PlaylistCardSkeletonProps) {
  if (variant === "compact") {
    return (
      <Card className={`bg-white/10 backdrop-blur-md border-white/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-15 h-15 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
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