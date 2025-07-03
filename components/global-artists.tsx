import { ArtistCard } from "@/components/ui/artist-card"

const topArtists = [
  { id: 1, name: "A. R. Rahman", image: "/placeholder-user.jpg" },
  { id: 2, name: "Arijit Singh", image: "/placeholder-user.jpg" },
  { id: 3, name: "Shreya Ghoshal", image: "/placeholder-user.jpg" },
  { id: 4, name: "Pritam", image: "/placeholder-user.jpg" },
  { id: 5, name: "Armaan Malik", image: "/placeholder-user.jpg" },
]

export function GlobalArtists() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Global Artists</h2>
        <span className="text-gray-400 text-sm cursor-pointer hover:text-white">Show all</span>
      </div>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {topArtists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
      </div>
    </section>
  )
} 