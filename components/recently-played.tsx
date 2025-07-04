import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useMusicPlayer } from "@/components/music-player"

interface RecentlyPlayedSong {
  id: number
  title: string
  artist: string
  album: string
  coverUrl: string
  audioUrl: string
  playedAt: string
}

export function RecentlyPlayed() {
  const [recentSongs, setRecentSongs] = useState<RecentlyPlayedSong[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { playSong } = useMusicPlayer()

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/songs/recently-played?userId=${user.id}&limit=10`)
        if (response.ok) {
          const data = await response.json()
          setRecentSongs(data)
        } else {
          console.error('Failed to fetch recently played songs')
        }
      } catch (error) {
        console.error('Error fetching recently played:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyPlayed()
  }, [user?.id])

  const handlePlaySong = (song: RecentlyPlayedSong) => {
    playSong({
      ...song,
      id: String(song.id)
    })
  }

  if (!user) {
    return null // Don't show recently played for non-authenticated users
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Recently Played</h2>
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {loading ? (
          // Show skeleton loading
          Array.from({ length: 5 }).map((_, i) => (
            <Card
              key={i}
              className="bg-white/10 backdrop-blur-md border-white/20 flex-shrink-0 w-48"
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <div className="w-full aspect-square bg-gray-700 rounded-lg animate-pulse" />
                </div>
                <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-3 bg-gray-700 rounded mb-2 animate-pulse w-3/4" />
                <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : recentSongs.length > 0 ? (
          recentSongs.map((song) => (
            <Card
              key={song.id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group flex-shrink-0 w-48 cursor-pointer"
              onClick={() => handlePlaySong(song)}
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Image
                    src={song.coverUrl || "/placeholder.svg"}
                    alt={song.title}
                    width={160}
                    height={160}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaySong(song)
                    }}
                  >
                    <Play className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm mb-2 truncate">{song.artist}</p>
                <p className="text-gray-500 text-xs">{song.playedAt}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-gray-400 text-center w-full py-8">
            No recently played songs yet. Start listening to some music!
          </div>
        )}
      </div>
    </section>
  )
}
