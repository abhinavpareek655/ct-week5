import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { useMusicPlayer } from "@/components/music-player"
import { createClient } from '@supabase/supabase-js'
import { SongCard, SongCardSkeleton } from "@/components/ui/song-card"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface RecentlyPlayedSong {
  id: string
  title: string
  artist: string
  album?: string
  cover_url?: string
  audio_url: string
  lastplayed_at: string
  plays?: number
}

export function RecentlyPlayed() {
  const [recentSongs, setRecentSongs] = useState<RecentlyPlayedSong[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { playSong, currentSong, refreshRecentlyPlayed } = useMusicPlayer()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const fetchRecentlyPlayed = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/user/recently-played', {
        headers
      })
      
      console.log('Recently played API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Recently played data:', data)
        setRecentSongs(data.slice(0, 6)) // Show only first 6 for horizontal scroll
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch recently played songs:', response.status, errorText)
      }
    } catch (error) {
      console.error('Error fetching recently played:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentlyPlayed()
  }, [user?.id])
  
  // Listen for refresh trigger from music player
  useEffect(() => {
    if (user?.id) {
      // Add a small delay to ensure the play was recorded in the database
      const timer = setTimeout(() => {
        console.log('🔄 Refreshing recently played due to new song play')
        fetchRecentlyPlayed()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [refreshRecentlyPlayed, user?.id])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [recentSongs])

  const handlePlaySong = (song: RecentlyPlayedSong) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audio_url: song.audio_url,
      cover_url: song.cover_url,
      album: song.album
    })
  }

  const handlePlaySongById = (song_id: number) => {
    const song = recentSongs.find(s => parseInt(s.id) === song_id)
    if (song) {
      handlePlaySong(song)
    }
  }
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (!user) {
    return null // Don't show recently played for non-authenticated users
  }

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Recently Played</h2>
        </div>
      </div>

      <div className="relative group">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            onClick={scrollLeft}
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            onClick={scrollRight}
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-2"
        >
          {loading ? (
            // Show skeleton loading using SongCardSkeleton
            Array.from({ length: 5 }).map((_, i) => (
              <SongCardSkeleton key={i} variant="default" />
            ))
          ) : recentSongs.length > 0 ? (
            recentSongs.map((song) => (
              <SongCard
                key={song.id}
                song={{
                  id: parseInt(song.id),
                  title: song.title,
                  artist: song.artist,
                  album: song.album,
                  cover_url: song.cover_url,
                  duration: formatTimeAgo(song.lastplayed_at)
                }}
                variant="default"
                showMetadata={true}
                onPlay={handlePlaySongById}
                onClick={handlePlaySongById}
              />
            ))
          ) : (
            <div className="text-gray-400 text-center w-full py-8">
              No recently played songs yet. Start listening to some music!
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
