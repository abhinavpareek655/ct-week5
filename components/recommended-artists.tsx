import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, UserPlus, Sparkles } from "lucide-react"
import Image from "next/image"

const recommendedArtists = [
  {
    id: 1,
    name: "Billie Eilish",
    genre: "Alternative Pop",
    followers: "89.2M",
    image: "/placeholder.svg?height=200&width=200",
    isVerified: true,
  },
  {
    id: 2,
    name: "Bad Bunny",
    genre: "Reggaeton",
    followers: "67.8M",
    image: "/placeholder.svg?height=200&width=200",
    isVerified: true,
  },
  {
    id: 3,
    name: "Olivia Rodrigo",
    genre: "Pop Rock",
    followers: "45.3M",
    image: "/placeholder.svg?height=200&width=200",
    isVerified: true,
  },
  {
    id: 4,
    name: "Lil Nas X",
    genre: "Hip Hop",
    followers: "34.7M",
    image: "/placeholder.svg?height=200&width=200",
    isVerified: true,
  },
]

export function RecommendedArtists() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Global Artists</h2>
        </div>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto scrollbar-hide">
        {recommendedArtists.map((artist) => (
          <Card
            key={artist.id}
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 mx-auto rounded-full shadow-lg object-cover"
                />
                {artist.isVerified && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{artist.name}</h3>
              <p className="text-gray-300 text-sm mb-1">{artist.genre}</p>
              <p className="text-gray-400 text-xs mb-4">{artist.followers} followers</p>

              <div className="flex items-center justify-center space-x-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
