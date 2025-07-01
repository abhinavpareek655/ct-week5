import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, TrendingUp, Heart, MoreHorizontal } from "lucide-react"
import Image from "next/image"

const trendingSongs = [
  {
    id: 1,
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    cover: "/placeholder.svg?height=60&width=60",
    duration: "3:20",
    trend: "+12",
    rank: 1,
  },
  {
    id: 2,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    cover: "/placeholder.svg?height=60&width=60",
    duration: "2:47",
    trend: "+5",
    rank: 2,
  },
  {
    id: 3,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    cover: "/placeholder.svg?height=60&width=60",
    duration: "3:58",
    trend: "-1",
    rank: 3,
  },
  {
    id: 4,
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    album: "F*CK LOVE 3",
    cover: "/placeholder.svg?height=60&width=60",
    duration: "2:21",
    trend: "+8",
    rank: 4,
  },
  {
    id: 5,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    cover: "/placeholder.svg?height=60&width=60",
    duration: "2:58",
    trend: "+3",
    rank: 5,
  },
]

export function TrendingNow() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
        </div>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          View Charts
        </Button>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-0">
          <div className="space-y-1">
            {trendingSongs.map((song, index) => (
              <div key={song.id} className="flex items-center space-x-4 p-4 hover:bg-white/10 transition-colors group">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-mono text-sm w-6 text-center">{song.rank}</span>
                    <Badge
                      className={`text-xs px-2 py-1 ${
                        song.trend.startsWith("+")
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {song.trend}
                    </Badge>
                  </div>

                  <Image
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    width={60}
                    height={60}
                    className="rounded-lg shadow-md"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate">{song.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    <p className="text-gray-500 text-xs truncate">{song.album}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">{song.duration}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
