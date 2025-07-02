import { generes } from "@/assets/constants"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { SongCard, SongCardSkeleton } from "@/components/ui/song-card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

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
    
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Discover</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                            {selectedGenre === "Genre" ? "Genre" : generes.find(genre => genre.value === selectedGenre)?.title}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className="bg-white/50 hover:bg-white/70 backdrop-blur-md border-white/20 max-h-60 overflow-y-auto rounded-lg z-[9999]" 
                        sideOffset={8}
                        align="end"
                    >
                        {generes.map((genre) => (
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
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
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
                            />
                        ))
                    ) : (
                        <div className="text-white text-center w-full py-8">No songs found.</div>
                    )
                )}
            </div>
        </section>
    )
}