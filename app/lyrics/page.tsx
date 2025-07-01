"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Heart, Share, Download, Volume2 } from "lucide-react"
import Image from "next/image"

const currentSong = {
  title: "Blinding Lights",
  artist: "The Weeknd",
  album: "After Hours",
  cover: "/placeholder.svg?height=300&width=300",
  duration: "3:20",
  currentTime: "1:45",
}

const lyrics = [
  { time: "0:00", text: "Yeah" },
  { time: "0:15", text: "I've been tryna call" },
  { time: "0:18", text: "I've been on my own for long enough" },
  { time: "0:22", text: "Maybe you can show me how to love, maybe" },
  { time: "0:29", text: "I feel like I'm just missing something when you're gone" },
  { time: "0:36", text: "But I feel like I'm just missing something when you're gone" },
  { time: "0:43", text: "But I feel like I'm just missing something when you're gone" },
  { time: "0:50", text: "But I feel like I'm just missing something when you're gone" },
  { time: "0:57", text: "I said, ooh, I'm blinded by the lights" },
  { time: "1:04", text: "No, I can't sleep until I feel your touch" },
  { time: "1:11", text: "I said, ooh, I'm drowning in the night" },
  { time: "1:18", text: "Oh, when I'm like this, you're the one I trust" },
  { time: "1:25", text: "I'm running out of time" },
  { time: "1:29", text: "'Cause I can see the sun light up the sky" },
  { time: "1:36", text: "So I hit the road in overdrive, baby, oh" },
  { time: "1:45", text: "The city's cold and empty (Oh)" },
  { time: "1:50", text: "No one's around to judge me (Oh)" },
  { time: "1:54", text: "I can't see clearly when you're gone" },
]

export default function LyricsPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(16)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-24">
      <div className="px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Song Info & Controls */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <Image
                    src={currentSong.cover || "/placeholder.svg"}
                    alt={currentSong.title}
                    width={120}
                    height={120}
                    className="rounded-xl shadow-2xl"
                  />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">{currentSong.title}</h1>
                    <p className="text-lg text-gray-300 mb-1">{currentSong.artist}</p>
                    <p className="text-gray-400">{currentSong.album}</p>
                    <div className="flex items-center space-x-2 mt-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Pop</Badge>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">Synthwave</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full w-12 h-12"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <div className="text-white">
                      <span className="text-sm">{currentSong.currentTime}</span>
                      <span className="text-gray-400 mx-2">/</span>
                      <span className="text-sm text-gray-400">{currentSong.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <Share className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <Download className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Song Analysis */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Song Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">120</div>
                    <div className="text-sm text-gray-400">BPM</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-pink-400">C# Minor</div>
                    <div className="text-sm text-gray-400">Key</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">High</div>
                    <div className="text-sm text-gray-400">Energy</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">0.8</div>
                    <div className="text-sm text-gray-400">Danceability</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lyrics Display */}
          <div>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 h-[600px]">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Real-time Lyrics
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto">
                <div className="space-y-4">
                  {lyrics.map((lyric, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-300 ${
                        index === currentLyricIndex
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                          : index < currentLyricIndex
                            ? "text-gray-500"
                            : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-xs text-gray-400 font-mono min-w-[40px]">{lyric.time}</span>
                      <span
                        className={`text-lg leading-relaxed ${
                          index === currentLyricIndex ? "text-white font-semibold text-xl" : ""
                        }`}
                      >
                        {lyric.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
