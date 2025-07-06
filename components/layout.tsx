"use client"

import type React from "react"

import { useState } from "react"
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

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Around You", href: "/search", icon: Image },
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
  const pathname = usePathname()
  const { user } = useAuth()
  const { isPlaying, currentSong } = useMusicPlayer();
  
  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith('/auth/')

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
          <div className="relative ml-2 sm:ml-8 w-40 sm:w-72 md:w-96 lg:w-[32rem] xl:w-[40rem]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              className="w-full pl-12 pr-4 py-3 rounded-full bg-[#181818] border-none text-white placeholder-gray-400 hover:bg-[#232323] transition-colors duration-300 focus:bg-[#232323]"
              placeholder="Search"
              type="search"
            />
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
