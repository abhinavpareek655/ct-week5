import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Library, Play } from "lucide-react"
import Image from "next/image"

const playlists = [
  {
    id: 1,
    title: "Today's Top Hits",
    description: "The most played songs right now",
    cover: "/placeholder.svg?height=200&width=200",
    songs: 50,
  },
  {
    id: 2,
    title: "Chill Vibes",
    description: "Relax and unwind with these mellow tracks",
    cover: "/placeholder.svg?height=200&width=200",
    songs: 75,
  },
  {
    id: 3,
    title: "Workout Motivation",
    description: "High-energy tracks to fuel your workout",
    cover: "/placeholder.svg?height=200&width=200",
    songs: 40,
  },
  {
    id: 4,
    title: "Indie Discoveries",
    description: "Fresh indie tracks you'll love",
    cover: "/placeholder.svg?height=200&width=200",
    songs: 60,
  },
]

export function FeaturedPlaylists() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Library className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Playlists</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Image
                  src={playlist.cover || "/placeholder.svg"}
                  alt={playlist.title}
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover rounded-lg shadow-lg"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                >
                  <Play className="w-5 h-5 text-white" />
                </Button>
              </div>
              <h3 className="font-semibold text-white mb-2 truncate">{playlist.title}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>
              <p className="text-gray-500 text-xs">{playlist.songs} songs</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
