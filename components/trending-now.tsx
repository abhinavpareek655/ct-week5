import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SongCard, SongCardSkeleton } from "@/components/ui/song-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, TrendingUp, Heart, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

export function TrendingNow() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrendingSongs() {
      setLoading(true)
      const { data, error } = await supabase
        .from("Song")
        .select("*")
        .order("plays", { ascending: false })
        .limit(5)
      if (!error && data) setSongs(data)
      setLoading(false)
    }
    fetchTrendingSongs()
  }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
        </div>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-4 space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SongCardSkeleton key={i} variant="compact" />
            ))
          ) : songs.length === 0 ? (
            <div className="text-gray-400 p-4">No trending songs found.</div>
          ) : (
            songs.map((song) => (
              <SongCard 
                key={song.id} 
                song={song} 
                variant="compact" 
                showActions={true}
                onPlay={(songId) => console.log('Play song:', songId)}
                onLike={(songId) => console.log('Like song:', songId)}
                onMore={(songId) => console.log('More options for song:', songId)}
                onClick={(songId) => console.log('Card clicked:', songId)}
              />
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}