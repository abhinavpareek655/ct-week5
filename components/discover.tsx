import { genres } from "@/assets/constants"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { SongCard, SongCardSkeleton } from "@/components/ui/song-card"
import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"
import { ChevronLeft, ChevronRight, Binoculars } from "lucide-react"
import { useMusicPlayer } from "@/components/music-player"

type Song = {
  id: number
  title: string
  artist: string
  album: string
  genre: string
  coverUrl: string
  audioUrl: string
  plays: number
}

export function Discover() {
    const [isLoading, setIsLoading] = useState(true)
    const [songs, setSongs] = useState<Song[]>([])
    const [selectedGenre, setSelectedGenre] = useState<string>("Genre")
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const { playSong } = useMusicPlayer();

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

    const fetchSongs = async () => {
        setIsLoading(true)
        let query = supabase.from('Song').select('*')
        if (selectedGenre !== "Genre" && selectedGenre !== "ALL") {
            query = query.eq('genre', selectedGenre)
        }
        const { data, error } = await query
        if (!error && data) {
            setSongs(data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchSongs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGenre])

    useEffect(() => {
        checkScrollButtons()
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScrollButtons)
            return () => container.removeEventListener('scroll', checkScrollButtons)
        }
    }, [songs])
    
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Binoculars className="w-6 h-6 text-purple-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Discover</h2>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                            {selectedGenre === "Genre" ? "Genre" : genres.find(genre => genre.value === selectedGenre)?.title}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className="bg-white/50 hover:bg-white/70 backdrop-blur-md border-white/20 max-h-60 overflow-y-auto rounded-lg z-[9999]" 
                        sideOffset={8}
                        align="end"
                    >
                        {genres.map((genre) => (
                            <DropdownMenuItem 
                                key={genre.value}
                                className="text-gray-600 hover:text-gray-900 cursor-pointer m-4"
                                onClick={() => setSelectedGenre(genre.value)}
                            >
                                {genre.title}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
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
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <SongCardSkeleton key={i} variant="default" />
                        ))
                    ) : (
                        songs.length > 0 ? (
                            songs.map(song => (
                                <SongCard 
                                    key={song.id} 
                                    song={song} 
                                    variant="default"
                                    showMetadata={true}
                                    onPlay={() => playSong({
                                        ...song,
                                        id: String(song.id) // ensure id is string for player
                                    })}
                                    onClick={() => playSong({
                                        ...song,
                                        id: String(song.id) // ensure id is string for player
                                    })}
                                />
                            ))
                        ) : (
                            <div className="text-white text-center w-full py-8">No songs found.</div>
                        )
                    )}
                </div>
            </div>
        </section>
    )
}