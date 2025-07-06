import { ArtistCard, ArtistCardSkeleton } from "@/components/ui/artist-card"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export function GlobalArtists() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    async function fetchArtists() {
      setLoading(true)
      const { data, error } = await supabase
        .from("Artist")
        .select("*")
        .order("monthly_listeners", { ascending: false })
        .limit(10)
      if (!error && data) setArtists(data)
      setLoading(false)
    }
    fetchArtists()
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [artists])

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Global Artists</h2>
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
          className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 px-2 song-container"
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <ArtistCardSkeleton key={i} />
            ))
          ) : artists.length === 0 ? (
            <div className="text-gray-400 p-4">No artists found.</div>
          ) : (
            artists.map(artist => (
              <ArtistCard 
                key={artist.id} 
                artist={{
                  id: artist.id,
                  name: artist.name,
                  image: artist.image_url || "/placeholder-user.jpg",
                  subtitle: artist.country
                }} 
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
} 