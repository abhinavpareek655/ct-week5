import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "./button"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface ArtistCardProps {
  artist: {
    id: number
    name: string
    image?: string
    subtitle?: string
  }
  className?: string
  showPlayButton?: boolean
  onPlay?: (artist_id: number) => void
}

export function ArtistCard({ artist, className = "", showPlayButton = true, onPlay }: ArtistCardProps) {
  const router = useRouter()
  
  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onPlay) {
      onPlay(artist.id)
    }
  }

  const handleClick = () => {
    router.push(`/artist/${artist.id}`)
  }

  return (
    <div 
      className={`bg-[#181818] hover:bg-gradient-to-b hover:from-[#181818] hover:to-white/10 transition-all duration-300 group flex-shrink-0 w-36 flex flex-col items-center p-4 cursor-pointer border-none rounded-lg ${className}`}
      onClick={handleClick}
    >
      <div className="w-24 h-24 mb-3 relative">
        <Image
          src={artist.image || "/placeholder-user.jpg"}
          alt={artist.name}
          width={96}
          height={96}
          className="rounded-full object-cover w-full h-full shadow-[0px_0px_8px_rgba(0,0,0,0.5)] z-50"
        />
        {showPlayButton && (
            <Button
              size="icon"
              onClick={(e) => handlePlay(e)}
              className="absolute bottom-1 right-1 bg-green-500 hover:bg-green-400 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-[4px_4px_8px_rgba(0,0,0,0.6)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.8)] z-50 hover:scale-105 transition-all duration-200"
            >
              <Play className="w-4 h-4 text-black fill-black" />
            </Button>
          )}
      </div>
      <div className="w-full text-center">
        <h3 className="font-semibold text-white text-base truncate group-hover:text-white transition-colors">{artist.name}</h3>
        {artist.subtitle && <p className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors">{artist.subtitle}</p>}
      </div>
    </div>
  )
}

interface ArtistCardSkeletonProps {
  className?: string
}

export function ArtistCardSkeleton({ className = "" }: ArtistCardSkeletonProps) {
  return (
    <div className={`bg-[#181818] rounded-lg flex-shrink-0 w-36 flex flex-col items-center p-4 border-none ${className}`}>
      <div className="w-24 h-24 mb-3 relative">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
      <div className="w-full text-center space-y-2">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </div>
    </div>
  )
} 