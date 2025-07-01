"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Search, Library, Heart, PlusCircle, Menu, X, Music, Mic2, TrendingUp, User } from "lucide-react"
import { MusicPlayer } from "@/components/music-player"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Lyrics", href: "/lyrics", icon: Mic2 },
  { name: "Library", href: "/library", icon: Library },
  { name: "Trending", href: "/trending", icon: TrendingUp },
]

const playlists = ["Liked Songs", "My Playlist #1", "Chill Vibes", "Workout Mix", "Road Trip"]

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="h-screen flex overflow-hidden bg-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-black/50 backdrop-blur-md border-b border-white/10">
          <Button
            variant="ghost"
            size="icon"
            className="px-4 text-white md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    className="block w-full pl-10 pr-3 py-2 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-full"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon" className="text-white">
                <User className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">{children}</main>

        {/* Music Player */}
        <MusicPlayer />
      </div>
    </div>
  )

  function SidebarContent() {
    return (
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Lyrics</span>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-r-2 border-purple-500"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 px-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Your Library</span>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white w-6 h-6">
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
          <nav className="mt-2 space-y-1">
            {playlists.map((playlist) => (
              <Link
                key={playlist}
                href="#"
                className="group flex items-center px-2 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors"
              >
                {playlist === "Liked Songs" ? (
                  <Heart className="mr-3 h-4 w-4 text-green-500" />
                ) : (
                  <Music className="mr-3 h-4 w-4" />
                )}
                {playlist}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    )
  }
}
