import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface ArtistCardProps {
  artist: {
    id: number
    name: string
    image?: string
    subtitle?: string
  }
  className?: string
}

export function ArtistCard({ artist, className = "" }: ArtistCardProps) {
  return (
    <div className={`bg-[#181818] hover:bg-gradient-to-b hover:from-[#181818] hover:to-white/10 transition-all duration-300 group flex-shrink-0 w-36 flex flex-col items-center p-4 cursor-pointer border-none rounded-lg ${className}`}>
      <div className="w-24 h-24 mb-3 relative">
        <Image
          src={artist.image || "/placeholder-user.jpg"}
          alt={artist.name}
          width={96}
          height={96}
          className="rounded-full object-cover w-full h-full shadow-[0px_0px_8px_rgba(0,0,0,0.5)] z-50"
        />
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