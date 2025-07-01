import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Play } from "lucide-react"
import Image from "next/image"

const globalCharts = [
  {
    country: "Global",
    flag: "🌍",
    songs: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Kill Bill", artist: "SZA", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Creepin'", artist: "Metro Boomin", cover: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    country: "United States",
    flag: "🇺🇸",
    songs: [
      { title: "Last Night", artist: "Morgan Wallen", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Flowers", artist: "Miley Cyrus", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Kill Bill", artist: "SZA", cover: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    songs: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Miracle", artist: "Calvin Harris", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Kill Bill", artist: "SZA", cover: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    songs: [
      { title: "Flowers", artist: "Miley Cyrus", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Komet", artist: "Udo Lindenberg", cover: "/placeholder.svg?height=40&width=40" },
      { title: "Kill Bill", artist: "SZA", cover: "/placeholder.svg?height=40&width=40" },
    ],
  },
]

export function GlobalCharts() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Global Charts</h2>
        </div>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          View All Countries
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalCharts.map((chart, index) => (
          <Card
            key={index}
            className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-white">
                <span className="text-2xl">{chart.flag}</span>
                <span className="text-lg">{chart.country}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {chart.songs.map((song, songIndex) => (
                <div key={songIndex} className="flex items-center space-x-3 group">
                  <span className="text-gray-400 font-mono text-sm w-4">{songIndex + 1}</span>
                  <Image
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{song.title}</h4>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm text-gray-400 hover:text-white mt-4">
                View Full Chart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
