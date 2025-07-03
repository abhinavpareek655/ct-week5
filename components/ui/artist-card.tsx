import Image from "next/image"

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
    <div className={`bg-[#181818] rounded-xl shadow-md hover:shadow-xl transition-all duration-200 w-36 flex-shrink-0 flex flex-col items-center p-4 cursor-pointer ${className}`}>
      <div className="w-24 h-24 mb-3 relative">
        <Image
          src={artist.image || "/placeholder-user.jpg"}
          alt={artist.name}
          width={96}
          height={96}
          className="rounded-full object-cover w-full h-full border-4 border-[#232323]"
        />
      </div>
      <div className="w-full text-center">
        <h3 className="font-semibold text-white text-base truncate">{artist.name}</h3>
        {artist.subtitle && <p className="text-gray-400 text-xs truncate">{artist.subtitle}</p>}
      </div>
    </div>
  )
} 