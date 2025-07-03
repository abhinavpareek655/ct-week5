import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Heart, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface SongCardProps {
  song: {
    id: number
    title: string
    artist: string
    album?: string
    genre?: string
    coverUrl?: string
    duration?: string
    playedAt?: string
    trend?: string
    rank?: number
    lyrics?: string
  }
  variant?: "default" | "compact" | "featured"
  showPlayButton?: boolean
  showActions?: boolean
  showMetadata?: boolean
  className?: string
  onPlay?: (songId: number) => void
  onLike?: (songId: number) => void
  onMore?: (songId: number) => void
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
}: SongCardProps) {
  const handlePlay = () => {
    onPlay?.(song.id)
  }

  const handleLike = () => {
    onLike?.(song.id)
  }

  const handleMore = () => {
    onMore?.(song.id)
  }

  if (variant === "compact") {
    return (
      <Card className={`group bg-[#181818] rounded-xl shadow-md hover:shadow-xl transition-all duration-200 w-44 flex-shrink-0 cursor-pointer ${className}`}>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={song.coverUrl || "/placeholder.svg"}
              alt={song.title}
              width={160}
              height={160}
              className="rounded-lg object-cover w-full h-full"
            />
            {showPlayButton && (
              <Button
                size="icon"
                className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                onClick={handlePlay}
              >
                <Play className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>
          <h3 className="font-semibold text-white text-base mb-1 w-full truncate text-center">{song.title}</h3>
          <p className="text-gray-400 text-sm w-full truncate text-center">{song.artist}</p>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group flex-shrink-0 w-48 ${className}`}>
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Image
              src={song.coverUrl || "/placeholder.svg"}
              alt={song.title}
              width={160}
              height={160}
              className="w-full aspect-square object-cover rounded-lg shadow-lg"
            />
            {showPlayButton && (
              <Button
                size="icon"
                onClick={handlePlay}
                className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
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
          {song.playedAt && (
            <p className="text-gray-500 text-xs mt-2">{song.playedAt}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant (similar to recently played)
  return (
    <Card className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group flex-shrink-0 w-48 ${className}`}>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Image
            src={song.coverUrl || "/placeholder.svg"}
            alt={song.title}
            width={160}
            height={160}
            className="w-full aspect-square object-cover rounded-lg shadow-lg"
          />
          {showPlayButton && (
            <Button
              size="icon"
              onClick={handlePlay}
              className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
            >
              <Play className="w-4 h-4 text-white" />
            </Button>
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
        {song.playedAt && (
          <p className="text-gray-500 text-xs">{song.playedAt}</p>
        )}
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
