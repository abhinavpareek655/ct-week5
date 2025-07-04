"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Play, Heart, MoreHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useMusicPlayer } from "@/components/music-player"

const searchResults = {
  songs: [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: "2:54",
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      cover: "/placeholder.svg?height=60&width=60",
    },
  ],
  artists: [
    { id: 1, name: "The Weeknd", followers: "89.2M", image: "/placeholder.svg?height=120&width=120" },
    { id: 2, name: "Harry Styles", followers: "67.8M", image: "/placeholder.svg?height=120&width=120" },
    { id: 3, name: "Dua Lipa", followers: "71.4M", image: "/placeholder.svg?height=120&width=120" },
  ],
  albums: [
    { id: 1, title: "After Hours", artist: "The Weeknd", year: "2020", cover: "/placeholder.svg?height=160&width=160" },
    { id: 2, title: "Fine Line", artist: "Harry Styles", year: "2019", cover: "/placeholder.svg?height=160&width=160" },
    {
      id: 3,
      title: "Future Nostalgia",
      artist: "Dua Lipa",
      year: "2020",
      cover: "/placeholder.svg?height=160&width=160",
    },
  ],
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { playSong } = useMusicPlayer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-24">
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for songs, artists, albums, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 rounded-2xl"
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {searchQuery && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md border-white/20 mb-8">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
                All
              </TabsTrigger>
              <TabsTrigger value="songs" className="data-[state=active]:bg-white/20">
                Songs
              </TabsTrigger>
              <TabsTrigger value="artists" className="data-[state=active]:bg-white/20">
                Artists
              </TabsTrigger>
              <TabsTrigger value="albums" className="data-[state=active]:bg-white/20">
                Albums
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Top Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.songs.slice(0, 3).map((song) => (
                    <Card
                      key={song.id}
                      className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={song.cover || "/placeholder.svg"}
                            alt={song.title}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{song.title}</h3>
                            <p className="text-gray-300 text-sm truncate">{song.artist}</p>
                            <p className="text-gray-400 text-xs">{song.duration}</p>
                          </div>
                          <Button
                            size="icon"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={() => playSong({
                              id: String(song.id),
                              title: song.title,
                              artist: song.artist,
                              audio_url: `/songs/${song.title}.webm`,
                              cover_url: song.cover,
                              album: song.album
                            })}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="songs">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Songs</h2>
                {searchResults.songs.map((song) => (
                  <Card
                    key={song.id}
                    className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={song.cover || "/placeholder.svg"}
                            alt={song.title}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-white">{song.title}</h3>
                            <p className="text-gray-300 text-sm">
                              {song.artist} • {song.album}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm">{song.duration}</span>
                          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={() => playSong({
                              id: String(song.id),
                              title: song.title,
                              artist: song.artist,
                              audio_url: `/songs/${song.title}.webm`,
                              cover_url: song.cover,
                              album: song.album
                            })}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="artists">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.artists.map((artist) => (
                    <Card
                      key={artist.id}
                      className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          width={120}
                          height={120}
                          className="rounded-full mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-white text-lg">{artist.name}</h3>
                        <p className="text-gray-300 text-sm">{artist.followers} followers</p>
                        <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500">Artist</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="albums">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Albums</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {searchResults.albums.map((album) => (
                    <Card
                      key={album.id}
                      className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <CardContent className="p-4">
                        <Image
                          src={album.cover || "/placeholder.svg"}
                          alt={album.title}
                          width={160}
                          height={160}
                          className="rounded-lg w-full mb-4"
                        />
                        <h3 className="font-semibold text-white truncate">{album.title}</h3>
                        <p className="text-gray-300 text-sm truncate">{album.artist}</p>
                        <p className="text-gray-400 text-xs">{album.year}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!searchQuery && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Search Lyrics</h2>
            <p className="text-gray-400">Find your favorite songs, artists, albums, and more</p>
          </div>
        )}
      </div>
    </div>
  )
}
