import { ArtistCard } from "@/components/ui/artist-card"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"

const topArtists = [
  { id: 1, name: "A. R. Rahman", image: "/placeholder-user.jpg" },
  { id: 2, name: "Arijit Singh", image: "/placeholder-user.jpg" },
  { id: 3, name: "Shreya Ghoshal", image: "/placeholder-user.jpg" },
  { id: 4, name: "Pritam", image: "/placeholder-user.jpg" },
  { id: 5, name: "Armaan Malik", image: "/placeholder-user.jpg" },
]

export function GlobalArtists() {
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

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Global Artists</h2>
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
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 px-2"
        >
          {topArtists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      </div>
    </section>
  )
} 