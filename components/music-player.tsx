"use client"
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Maximize2 } from "lucide-react"
import Image from "next/image"

// Song type
export interface Song {
  id: string
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
}

interface MusicPlayerContextType {
  currentSong: Song | null
  isPlaying: boolean
  duration: number
  progress: number
  volume: number
  isMuted: boolean
  playSong: (song: Song) => void
  pause: () => void
  resume: () => void
  seekTo: (time: number) => void
  setVolumeLevel: (vol: number) => void
  toggleMute: () => void
  skipBack: () => void
  skipForward: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  // Load new song
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    
    audio.pause()
    audio.src = currentSong.audioUrl
    audio.volume = isMuted ? 0 : volume
    
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setProgress(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      console.error('Audio loading error')
      setIsPlaying(false)
    }
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [currentSong, isMuted, volume])

  // Sync play/pause with isPlaying
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    
    const playAudio = async () => {
      try {
        if (isPlaying) {
          await audio.play()
        } else {
          audio.pause()
        }
      } catch (error) {
        console.error('Playback error:', error)
        setIsPlaying(false)
      }
    }
    
    playAudio()
  }, [isPlaying, currentSong])

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }
  const pause = () => setIsPlaying(false)
  const resume = () => setIsPlaying(true)
  const seekTo = (time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setProgress(time)
    }
  }
  const setVolumeLevel = (vol: number) => {
    setVolume(vol)
    if (vol > 0) setIsMuted(false)
  }
  const toggleMute = () => setIsMuted(m => !m)
  const skipBack = () => seekTo(Math.max(progress - 10, 0))
  const skipForward = () => seekTo(Math.min(progress + 10, duration))

  return (
    <MusicPlayerContext.Provider value={{
      currentSong, isPlaying, duration, progress,
      volume, isMuted, playSong, pause, resume,
      seekTo, setVolumeLevel, toggleMute, skipBack, skipForward
    }}>
      {children}
      {currentSong && <MusicPlayerUI />}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error("useMusicPlayer must be used within a MusicPlayerProvider")
  return ctx
}

// UI Component
function MusicPlayerUI() {
  const {
    currentSong: song, isPlaying, duration, progress,
    volume, isMuted, pause, resume,
    seekTo, setVolumeLevel, toggleMute, skipBack, skipForward
  } = useMusicPlayer()
  const formatTime = (sec: number) => `${Math.floor(sec/60)}:${Math.floor(sec%60).toString().padStart(2,'0')}`

  return (
    <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Image src={song.coverUrl||'/placeholder.svg'} alt={song.title} width={60} height={60} className="rounded-lg" />
          <div className="min-w-0">
            <h4 className="text-white truncate">{song.title}</h4>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>
          <Button variant="ghost" size="icon"><Heart className="w-4 h-4 text-gray-400"/></Button>
        </div>
        {/* Controls */}
        <div className="flex flex-col items-center flex-1 max-w-md mx-8 space-y-2">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon"><Shuffle className="w-4 h-4 text-gray-400"/></Button>
            <Button variant="ghost" size="icon" onClick={skipBack}><SkipBack className="w-5 h-5 text-white"/></Button>
            <Button size="icon" onClick={() => isPlaying?pause():resume()} className="bg-white text-black w-10 h-10 rounded-full">
              {isPlaying?<Pause className="w-5 h-5"/>:<Play className="w-5 h-5"/>}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipForward}><SkipForward className="w-5 h-5 text-white"/></Button>
            <Button variant="ghost" size="icon"><Repeat className="w-4 h-4 text-gray-400"/></Button>
          </div>
          <div className="flex items-center w-full space-x-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(progress)}</span>
            <Slider value={[progress]} onValueChange={val=>seekTo(val[0])} max={duration} step={0.1} className="flex-1" />
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>
        {/* Volume & Extra */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button variant="ghost" size="icon"><Maximize2 className="w-4 h-4 text-gray-400"/></Button>
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted||volume===0?<VolumeX className="w-4 h-4 text-gray-400"/>:<Volume2 className="w-4 h-4 text-gray-400"/>}
          </Button>
          <Slider value={[isMuted?0:volume*100]} onValueChange={val=>setVolumeLevel(val[0]/100)} max={100} step={1} className="w-24" />
        </div>
      </div>
    </div>
  )
}

export { MusicPlayerUI as MusicPlayer }
