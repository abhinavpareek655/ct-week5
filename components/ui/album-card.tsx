import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, Music, Disc } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AlbumCardProps {
  album: {
    id: string
    title: string
    artist: string
    cover_url?: string
    genre?: string
    release_date?: string
    song_count?: number
  }
  variant?: "default" | "compact"
  showActions?: boolean
  className?: string
  onPlay?: (album_id: string) => void
  onMore?: (album_id: string) => void
  onClick?: (album_id: string) => void
}

export function AlbumCard({
  album,
  variant = "default",
  showActions = false,
  className = "",
  onPlay,
  onMore,
  onClick,
}: AlbumCardProps) {
  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onPlay?.(album.id)
  }

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMore?.(album.id)
  }

  const handleCardClick = () => {
    onClick?.(album.id)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.getFullYear()
  }

  if (variant === "compact") {
    return (
      <Card 
        className={`cursor-pointer hover:bg-white/5 transition-colors ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={album.cover_url || "/placeholder.svg"}
                alt={album.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-sm">{album.title}</h3>
              <p className="text-gray-400 text-xs truncate">{album.artist}</p>
              {album.song_count !== undefined && (
                <p className="text-gray-500 text-xs">{album.song_count} song{(album.song_count !== 1) ? 's' : ''}</p>
              )}
            </div>
            {showActions && (
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/10"
                  onClick={handlePlay}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-white/10"
                      onClick={handleMore}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCardClick}>
                      View Album
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={`cursor-pointer hover:bg-white/5 transition-colors ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Album Cover */}
          <div className="relative aspect-square">
            <Image
              src={album.cover_url || "/placeholder.svg"}
              alt={album.title}
              fill
              className="object-cover rounded-lg"
            />
            {showActions && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={handlePlay}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              </div>
            )}
          </div>

          {/* Album Info */}
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-white truncate">{album.title}</h3>
              <p className="text-gray-400 text-sm truncate">{album.artist}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Disc className="h-4 w-4 text-gray-400" />
                {album.song_count !== undefined && (
                  <span className="text-gray-400 text-sm">
                    {album.song_count} song{(album.song_count !== 1) ? 's' : ''}
                  </span>
                )}
              </div>
              
              {album.genre && (
                <Badge variant="secondary" className="text-xs">
                  {album.genre}
                </Badge>
              )}
            </div>

            {album.release_date && (
              <p className="text-gray-500 text-xs">
                {formatDate(album.release_date)}
              </p>
            )}

            {showActions && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/10"
                  onClick={handlePlay}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-white/10"
                      onClick={handleMore}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCardClick}>
                      View Album
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AlbumCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Card className="cursor-pointer hover:bg-white/5 transition-colors">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer hover:bg-white/5 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 