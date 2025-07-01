import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock } from "lucide-react"
import Image from "next/image"

const recentSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "/placeholder.svg?height=160&width=160",
    playedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    cover: "/placeholder.svg?height=160&width=160",
    playedAt: "5 hours ago",
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "/placeholder.svg?height=160&width=160",
    playedAt: "1 day ago",
  },
  {
    id: 4,
    title: "Good as Hell",
    artist: "Lizzo",
    cover: "/placeholder.svg?height=160&width=160",
    playedAt: "2 days ago",
  },
  {
    id: 5,
    title: "Circles",
    artist: "Post Malone",
    cover: "/placeholder.svg?height=160&width=160",
    playedAt: "3 days ago",
  },
]

export function RecentlyPlayed() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Recently Played</h2>
        </div>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          Show all
        </Button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {recentSongs.map((song) => (
          <Card
            key={song.id}
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group flex-shrink-0 w-48"
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Image
                  src={song.cover || "/placeholder.svg"}
                  alt={song.title}
                  width={160}
                  height={160}
                  className="w-full aspect-square object-cover rounded-lg shadow-lg"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                >
                  <Play className="w-4 h-4 text-white" />
                </Button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
              <p className="text-gray-400 text-sm mb-2 truncate">{song.artist}</p>
              <p className="text-gray-500 text-xs">{song.playedAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
