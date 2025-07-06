import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, Music, Disc } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Album } from "@/lib/types"

interface AlbumCardProps {
  album: Album
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
        className={`group bg-[#181818] rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={album.cover_url || "/placeholder.svg"}
                alt={album.title}
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
              <h3 className="font-semibold text-white text-sm truncate">{album.title}</h3>
              <p className="text-gray-400 text-xs truncate">{album.artist}</p>
              {album.song_count !== undefined && (
                <p className="text-gray-500 text-xs truncate">
                  {album.song_count} song{(album.song_count !== 1) ? 's' : ''}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                      onClick={handleMore}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#181818] border-white/20">
                    <DropdownMenuItem 
                      onClick={handleCardClick}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      View Album
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            src={album.cover_url || "/placeholder.svg"}
            alt={album.title}
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
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-white mb-1 truncate">{album.title}</h3>
          <p className="text-gray-400 text-sm mb-2 truncate">{album.artist}</p>
          
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
        </div>
      </CardContent>
    </Card>
  )
}

export function AlbumCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Card className="bg-[#181818] rounded-xl shadow-md hover:shadow-xl transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
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
    <Card className="bg-[#181818] hover:bg-gradient-to-b hover:from-[#181818] hover:to-white/10 transition-all duration-300 flex-shrink-0 w-48 border-none">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  )
} 