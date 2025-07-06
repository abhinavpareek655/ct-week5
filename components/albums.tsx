"use client"
import { useState, useEffect, useRef } from "react"
import { AlbumCard, AlbumCardSkeleton } from "@/components/ui/album-card"
import { Music, Disc, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMusicPlayer } from "@/components/music-player"
import { Album } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function Albums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { playAlbum } = useMusicPlayer()

  const fetchAlbums = async () => {
    try {
      setLoading(true)
      
      // Fetch albums using the API endpoint
      const response = await fetch('/api/albums?limit=20')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Albums data:', data)
        setAlbums(data)
      } else {
        console.error('Failed to fetch albums:', response.status)
        toast({
          title: "Error",
          description: "Failed to load albums",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching albums:', error)
      toast({
        title: "Error",
        description: "Failed to load albums",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [albums])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const handlePlayAlbum = (album_id: string) => {
    const album = albums.find(a => a.id === album_id)
    if (album) {
      playAlbum(album)
    }
  }

  const handleAlbumClick = (album_id: string) => {
    // Navigate to album detail page
    window.location.href = `/album/${album_id}`
  }

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Disc className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Albums</h2>
          </div>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <AlbumCardSkeleton key={i} variant="default" />
          ))}
        </div>
      </section>
    )
  }

  if (albums.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Disc className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Albums</h2>
          </div>
        </div>
        <div className="text-center py-12">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-white mb-2">No Albums Found</h3>
          <p className="text-gray-400">No albums are available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Disc className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Albums</h2>
        </div>
      </div>

      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            onClick={scrollLeft}
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 opacity-0 transition-opacity z-10 shadow-lg song-scroll-button"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            onClick={scrollRight}
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 opacity-0 transition-opacity z-10 shadow-lg song-scroll-button"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-2 song-container"
        >
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              variant="default"
              onPlay={handlePlayAlbum}
              onClick={handleAlbumClick}
              showActions={true}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 