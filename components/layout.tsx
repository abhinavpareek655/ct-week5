"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Search, Hash, Image, Heart, PlusCircle, Menu, X, Music, Users, TrendingUp } from "lucide-react"
import { MusicPlayer, useMusicPlayer } from "@/components/music-player"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/components/auth-provider"
import { TrendingNow } from "@/components/trending-now"
import { GlobalArtists } from "@/components/global-artists"
import { GlobalCharts } from "@/components/global-charts"
import { RecommendedArtists } from "./recommended-artists"
import { UserPlaylists } from "./user-playlists"
import { CreatePlaylistDialog } from "./ui/create-playlist-dialog"
import { LikedSongs } from "./liked-songs"
import { SongCard } from "./ui/song-card"
import { supabase } from "@/lib/supabaseClient"
import { useDebounce } from "@/hooks/use-debounce"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Around You", href: "/around-you", icon: Image },
  { name: "Top Artists", href: "/lyrics", icon: Users },
  { name: "Top Charts", href: "/library", icon: Hash },
]

function SidebarContent() {
  const { user } = useAuth()
  
  return (
    <>
      {/* Navigation */}
      <nav className="mb-4">
          {navigation.map((item) => {
          const isActive = usePathname() === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors text-base font-medium ${
                  isActive
                  ? "bg-[#232323] text-white"
                  : "text-gray-300 hover:bg-[#232323] hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      {/* Library Section */}
      <div className="mb-6 mx-2">
        <div className="space-y-6 overflow-y-auto scrollbar-hide">
          {user ? (
            <div className="space-y-6 overflow-y-auto scrollbar-hide max-h-[380px] w-full">
              <LikedSongs />
              <UserPlaylists />
            </div>
          ) : (
            <div className="bg-[#232323] rounded-lg p-4">
              <div className="text-white font-semibold mb-1">Sign in to access features</div>
              <div className="text-gray-400 text-sm mb-3">Like adding playlists, liking songs, and viewing recently played</div>
              <Button 
                variant="outline" 
                className="w-full text-white border-gray-600 hover:bg-white hover:text-black"
                onClick={() => window.location.href = '/auth/signin'}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
    )
  }

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { user } = useAuth()
  const { isPlaying, currentSong, playSong } = useMusicPlayer()
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith('/auth/')

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    try {
      const { data: songs, error } = await supabase
        .from('Song')
        .select('*')
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`)
        .limit(8)

      if (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } else {
        setSearchResults(songs || [])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Search effect
  useEffect(() => {
    performSearch(debouncedSearchQuery)
  }, [debouncedSearchQuery])

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSearchResults(value.length >= 2)
  }

  const handlePlaySong = (song: any) => {
    playSong({
      id: String(song.id),
      title: song.title,
      artist: song.artist,
      audio_url: song.audio_url || `/songs/${song.title}.webm`,
      cover_url: song.cover_url,
      album: song.album
    })
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handlePlaySongById = (song_id: number) => {
    const song = searchResults.find(s => s.id === song_id)
    if (song) {
      handlePlaySong(song)
    }
  }

  if (isAuthPage) {
    return (
      <div>
        {children}
      </div>
    )
  }

  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-8 py-4 bg-black rounded-t-xl">        
        <div className="flex items-center">
          <button
            className="flex lg:hidden md:hidden items-center justify-center w-10 h-10 rounded-full bg-[#232323] text-white focus:outline-none mr-2 sm:mr-8"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
          <Menu className="w-6 h-6" />
        </button>
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="ml-3 text-2xl font-bold text-white tracking-tight hidden sm:block">Lyrics</span>
          </Link>
          <div className="relative ml-2 sm:ml-8 w-40 sm:w-72 md:w-96 lg:w-[32rem] xl:w-[40rem]" ref={searchRef}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              className="w-full pl-12 pr-4 py-3 rounded-full bg-[#181818] border-none text-white placeholder-gray-400 hover:bg-[#232323] transition-colors duration-300 focus:bg-[#232323]"
              placeholder="Search"
              type="search"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] rounded-xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Search Results</h3>
                    {isSearching && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-gray-400 text-sm">Searching...</span>
                      </div>
                    )}
                  </div>
                  
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((song) => (
                        <SongCard
                          key={song.id}
                          song={song}
                          variant="default"
                          onPlay={handlePlaySongById}
                          onClick={handlePlaySongById}
                          className="w-full"
                        />
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 && !isSearching ? (
                    <div className="text-center py-8">
                      <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No results found</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 ml-8">
          {!user && (
            <Link href="/auth/register" className="text-gray-400 hover:font-semibold hover:text-white hover:scale-105 transition-all duration-100">Sign up</Link>
          )}
          <UserMenu />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#121212] rounded-r-xl shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-white font-bold text-lg">Menu</span>
          <Button size="icon" variant="ghost" className="text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      <div className="h-screen flex bg-black">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-80 p-4 bg-[#121212] rounded-xl m-2 mr-0 min-h-[calc(100vh-16px)]">
          <SidebarContent />
        </aside>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <main className="flex-1 bg-[#181818] rounded-xl m-2 p-8 overflow-y-auto scrollbar-hide">
            {children}
          </main>
        </div>
        {/* Top Charts */}
        <div className="w-1/4 flex-col hidden lg:block p-4 rounded-xl mt-2 mb-2 mr-2 bg-[#181818] overflow-y-auto scrollbar-hide py-8 space-y-12">
          <TrendingNow />
          <GlobalArtists />
          <GlobalCharts />
        </div>
      </div>
      {/* Global Music Player: fixed at bottom, always visible when playing */}
      {isPlaying && currentSong && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <MusicPlayer playlists={[]} />
        </div>
      )}
    </>
  )
}
