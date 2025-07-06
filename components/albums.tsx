"use client"
import { useEffect, useState } from "react"
import { AlbumCard, AlbumCardSkeleton } from "@/components/ui/album-card"
import { Music, Disc } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMusicPlayer } from "@/components/music-player"
import { Album } from "@/lib/types"

export function Albums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
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
        const errorText = await response.text()
        console.error('Failed to fetch albums:', response.status, errorText)
        throw new Error('Failed to fetch albums')
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
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Disc className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-bold text-white">Albums</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <AlbumCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Disc className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-bold text-white">Albums</h2>
        </div>
        <div className="text-center py-12">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-white mb-2">No Albums Found</h3>
          <p className="text-gray-400">No albums are available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Disc className="h-6 w-6 text-white" />
        <h2 className="text-2xl font-bold text-white">Albums</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onPlay={handlePlayAlbum}
            onClick={handleAlbumClick}
            showActions={true}
          />
        ))}
      </div>
    </div>
  )
} 