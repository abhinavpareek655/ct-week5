"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Maximize2 } from "lucide-react"
import Image from "next/image"

const currentSong = {
  title: "Blinding Lights",
  artist: "The Weeknd",
  cover: "/placeholder.svg?height=60&width=60",
  duration: 200, // in seconds
  currentTime: 105,
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState([52.5])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <Image
            src={currentSong.cover || "/placeholder.svg"}
            alt={currentSong.title}
            width={60}
            height={60}
            className="rounded-lg shadow-lg"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium truncate">{currentSong.title}</h4>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white flex-shrink-0">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl mx-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black hover:bg-gray-200 w-10 h-10 rounded-full"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentSong.currentTime)}</span>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={0.1}
              className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            />
            <span className="text-xs text-gray-400 w-10">{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Volume & Extra Controls */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white"
          >
            {isMuted || volume[0] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={(value) => {
              setVolume(value)
              setIsMuted(value[0] === 0)
            }}
            max={100}
            step={1}
            className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
          />
        </div>
      </div>
    </div>
  )
}
