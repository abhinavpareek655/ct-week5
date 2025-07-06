"use client"
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Maximize2, Plus, Minimize2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Song type
export interface Song {
  id: string
  title: string
  artist: string
  audio_url: string
  cover_url?: string
  album?: string
}



// Playlist type
export interface Playlist {
  id: number
  name: string
  description?: string
  cover_url?: string
  is_public: boolean
  created_at: string
  song_count?: number
}

// Album type
export interface Album {
  id: string
  title: string
  artist: string
  cover_url?: string
  genre?: string
  release_date?: string
  song_count?: number
}

interface MusicPlayerContextType {
  currentSong: Song | null
  isPlaying: boolean
  duration: number
  progress: number
  volume: number
  isMuted: boolean
  isLooping: boolean
  isShuffling: boolean
  isFullscreen: boolean
  isLiked: boolean
  playlists: Playlist[]
  playlistsLoading: boolean
  currentPlaylist: Playlist | null
  playlistSongs: Song[]
  currentSongIndex: number
  currentAlbum: Album | null
  albumSongs: Song[]
  currentAlbumSongIndex: number
  playSong: (song: Song) => void
  playPlaylist: (playlist: Playlist) => void
  playAlbum: (album: Album) => void
  playNextSong: () => void
  playPreviousSong: () => void
  pause: () => void
  resume: () => void
  seekTo: (time: number) => void
  setVolumeLevel: (vol: number) => void
  toggleMute: () => void
  skipBack: () => void
  skipForward: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  toggleFullscreen: () => void
  toggleLike: () => void
  addToPlaylist: (playlist_id: number) => void
  refreshRecentlyPlayed: () => void
  refreshPlaylists: () => void
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
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistsLoading, setPlaylistsLoading] = useState(true)
  const [recentlyPlayedRefresh, setRecentlyPlayedRefresh] = useState(0)
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null)
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null)
  const [albumSongs, setAlbumSongs] = useState<Song[]>([])
  const [currentAlbumSongIndex, setCurrentAlbumSongIndex] = useState(0)
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('musicPlayer_volume')
    const savedIsLooping = localStorage.getItem('musicPlayer_isLooping')
    const savedIsShuffling = localStorage.getItem('musicPlayer_isShuffling')
    
    if (savedVolume) setVolume(parseFloat(savedVolume))
    if (savedIsLooping) setIsLooping(savedIsLooping === 'true')
    if (savedIsShuffling) setIsShuffling(savedIsShuffling === 'true')
  }, [])
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('musicPlayer_volume', volume.toString())
  }, [volume])
  
  useEffect(() => {
    localStorage.setItem('musicPlayer_isLooping', isLooping.toString())
  }, [isLooping])
  
  useEffect(() => {
    localStorage.setItem('musicPlayer_isShuffling', isShuffling.toString())
  }, [isShuffling])

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
    audio.src = currentSong.audio_url
    audio.volume = isMuted ? 0 : volume
    
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setProgress(audio.currentTime)
    const handleEnded = () => {
      if (currentPlaylist && playlistSongs.length > 0) {
        // Handle playlist playback
        let nextIndex = currentSongIndex + 1
        
        if (nextIndex >= playlistSongs.length) {
          if (isLooping) {
            nextIndex = 0
          } else {
            // End of playlist
            setIsPlaying(false)
            setCurrentSong(null)
            setCurrentPlaylist(null)
            setPlaylistSongs([])
            setCurrentSongIndex(0)
            return
          }
        }
        
        setCurrentSongIndex(nextIndex)
        playSong(playlistSongs[nextIndex])
      } else if (currentAlbum && albumSongs.length > 0) {
        // Handle album playback
        let nextIndex = currentAlbumSongIndex + 1
        
        if (nextIndex >= albumSongs.length) {
          if (isLooping) {
            nextIndex = 0
          } else {
            // End of album
            setIsPlaying(false)
            setCurrentSong(null)
            setCurrentAlbum(null)
            setAlbumSongs([])
            setCurrentAlbumSongIndex(0)
            return
          }
        }
        
        setCurrentAlbumSongIndex(nextIndex)
        playSong(albumSongs[nextIndex])
      } else if (isLooping) {
        // Loop the current song
        audio.currentTime = 0
        audio.play()
      } else {
        setIsPlaying(false)
      }
    }
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
  }, [currentSong, isMuted, volume, isLooping, currentPlaylist, playlistSongs, currentSongIndex])

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



  // Fetch playlists on mount and when user changes
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?.id) {
        setPlaylists([])
        setPlaylistsLoading(false)
        return
      }

      try {
        setPlaylistsLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        const response = await fetch('/api/playlists', {
          headers
        })
        
        if (response.ok) {
          const playlistsData = await response.json()
          setPlaylists(Array.isArray(playlistsData) ? playlistsData : [])
        } else {
          console.error('Failed to fetch playlists:', response.statusText)
          setPlaylists([])
        }
      } catch (error) {
        console.error('Error fetching playlists:', error)
        setPlaylists([])
      } finally {
        setPlaylistsLoading(false)
      }
    }
    fetchPlaylists()
  }, [user?.id])

  // Check if current song is liked
  useEffect(() => {
    const checkLikedStatus = async () => {
      if (!currentSong || !user) return
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }
        
        const response = await fetch(`/api/user/liked-songs/${currentSong.id}`, {
          headers
        })
        if (response.ok) {
          const data = await response.json()
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error('Error checking liked status:', error)
      }
    }
    checkLikedStatus()
  }, [currentSong, user])

  const playSong = useCallback(async (song: Song) => {
    console.log('🎵 Playing song:', song.title, 'by', song.artist)
    console.log('📝 Song object:', song)
    console.log('👤 User object:', user)
    
    setCurrentSong(song)
    setIsPlaying(true)
    
    // Record the play if user is logged in
    if (user?.id) {
      try {
        const requestData = {
          song_id: song.id,
          user_id: user.id
        }
        
        console.log('📊 Recording play with data:', requestData)
        console.log('🔗 API endpoint: /api/songs/play')
        
        const response = await fetch('/api/songs/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        })
        
        console.log('📮 API response status:', response.status)
        
        if (response.ok) {
          const responseData = await response.json()
          console.log('✅ Play recorded successfully:', responseData)
          // Trigger recently played refresh after a short delay
          setTimeout(() => {
            setRecentlyPlayedRefresh(prev => prev + 1)
          }, 500)
        } else {
          const errorText = await response.text()
          console.error('❌ Failed to record play:', response.status, errorText)
          
          // Try to parse error as JSON for more details
          try {
            const errorJson = JSON.parse(errorText)
            console.error('📝 Error details:', errorJson)
          } catch {
            console.error('📝 Raw error text:', errorText)
          }
        }
      } catch (error) {
        console.error('❌ Error recording play:', error)
        // Don't fail the play action if recording fails
      }
    } else {
      console.log('👤 User not logged in, skipping play recording')
    }
  }, [user?.id])

  const playPlaylist = useCallback(async (playlist: Playlist) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/playlists/${playlist.id}`, {
        headers
      })
      
      if (response.ok) {
        const playlistData = await response.json()
        const songs = playlistData.songs || []
        
        if (songs.length === 0) {
          toast({
            title: "Empty Playlist",
            description: "This playlist has no songs to play",
            variant: "destructive",
          })
          return
        }

        setCurrentPlaylist(playlist)
        
        // Shuffle songs if shuffle is enabled
        const shuffledSongs = isShuffling ? [...songs].sort(() => Math.random() - 0.5) : songs
        setPlaylistSongs(shuffledSongs)
        setCurrentSongIndex(0)
        
        // Start playing the first song
        await playSong(shuffledSongs[0])
        
        toast({
          title: "Playing Playlist",
          description: `Now playing ${playlist.name}`,
        })
      } else {
        throw new Error('Failed to load playlist')
      }
    } catch (error) {
      console.error('Error playing playlist:', error)
      toast({
        title: 'Error',
        description: 'Failed to load playlist',
        variant: 'destructive',
      })
    }
  }, [playSong, toast, isShuffling])

  const playAlbum = useCallback(async (album: Album) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/albums/${album.id}`, {
        headers
      })
      
      if (response.ok) {
        const albumData = await response.json()
        const songs = albumData.songs || []
        
        if (songs.length === 0) {
          toast({
            title: "Empty Album",
            description: "This album has no songs to play",
            variant: "destructive",
          })
          return
        }

        setCurrentAlbum(album)
        
        // Shuffle songs if shuffle is enabled
        const shuffledSongs = isShuffling ? [...songs].sort(() => Math.random() - 0.5) : songs
        setAlbumSongs(shuffledSongs)
        setCurrentAlbumSongIndex(0)
        
        // Start playing the first song
        await playSong(shuffledSongs[0])
        
        toast({
          title: "Playing Album",
          description: `Now playing ${album.title}`,
        })
      } else {
        throw new Error('Failed to load album')
      }
    } catch (error) {
      console.error('Error playing album:', error)
      toast({
        title: 'Error',
        description: 'Failed to load album',
        variant: 'destructive',
      })
    }
  }, [playSong, toast, isShuffling])

  const playNextSong = useCallback(() => {
    if (playlistSongs.length === 0) return
    
    let nextIndex = currentSongIndex + 1
    
    if (nextIndex >= playlistSongs.length) {
      if (isLooping) {
        nextIndex = 0
      } else {
        // End of playlist
        setIsPlaying(false)
        setCurrentSong(null)
        setCurrentPlaylist(null)
        setPlaylistSongs([])
        setCurrentSongIndex(0)
        return
      }
    }
    
    setCurrentSongIndex(nextIndex)
    playSong(playlistSongs[nextIndex])
  }, [playlistSongs, currentSongIndex, isLooping, playSong])

  const playPreviousSong = useCallback(() => {
    if (playlistSongs.length === 0) return
    
    let prevIndex = currentSongIndex - 1
    
    if (prevIndex < 0) {
      if (isLooping) {
        prevIndex = playlistSongs.length - 1
      } else {
        // Beginning of playlist
        return
      }
    }
    
    setCurrentSongIndex(prevIndex)
    playSong(playlistSongs[prevIndex])
  }, [playlistSongs, currentSongIndex, isLooping, playSong])

  const pause = useCallback(() => setIsPlaying(false), [])
  const resume = useCallback(() => setIsPlaying(true), [])
  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setProgress(time)
    }
  }, [])
  const setVolumeLevel = useCallback((vol: number) => {
    setVolume(vol)
    if (vol > 0) setIsMuted(false)
  }, [])
  const toggleMute = useCallback(() => setIsMuted(m => !m), [])
  const skipBack = useCallback(() => {
    if (currentPlaylist && playlistSongs.length > 0) {
      playPreviousSong()
    } else {
      seekTo(Math.max(progress - 10, 0))
    }
  }, [currentPlaylist, playlistSongs.length, playPreviousSong, progress, seekTo])
  const skipForward = useCallback(() => {
    if (currentPlaylist && playlistSongs.length > 0) {
      playNextSong()
    } else {
      seekTo(Math.min(progress + 10, duration))
    }
  }, [currentPlaylist, playlistSongs.length, playNextSong, progress, duration, seekTo])
  
  const toggleLoop = useCallback(() => setIsLooping(prev => !prev), [])
  const toggleShuffle = useCallback(() => setIsShuffling(prev => !prev), [])
  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), [])
  
  const toggleLike = useCallback(async () => {
    if (!currentSong || !user) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      
      const body = JSON.stringify({ song_id: currentSong.id, user_id: user.id })
      const response = await fetch('/api/user/liked-songs', {
        method: isLiked ? 'DELETE' : 'POST',
        headers,
        body,
      })
      
      if (response.ok) {
        setIsLiked(!isLiked)
        toast({
          title: isLiked ? 'Removed from liked songs' : 'Added to liked songs',
          description: `${currentSong.title} by ${currentSong.artist}`,
        })
      } else {
        throw new Error('Failed to update liked status')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: 'Error',
        description: 'Failed to update liked status',
        variant: 'destructive',
      })
    }
  }, [currentSong, user, isLiked, toast])
  

  
  const addToPlaylist = useCallback(async (playlist_id: number) => {
    if (!currentSong || !user) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      
      const response = await fetch('/api/playlists/add-song', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          playlist_id,
          song_id: currentSong.id
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Added to playlist',
          description: `${currentSong.title} added to playlist`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add to playlist')
      }
    } catch (error) {
      console.error('Error adding to playlist:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add song to playlist',
        variant: 'destructive',
      })
    }
  }, [currentSong, user, toast])
  
  const refreshRecentlyPlayed = useCallback(() => {
    setRecentlyPlayedRefresh(prev => prev + 1)
  }, [])
  
  const refreshPlaylists = useCallback(() => {
    // Trigger playlist refresh by updating user dependency
    setPlaylistsLoading(true)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (currentSong) {
            isPlaying ? pause() : resume()
          }
          break
        case 'ArrowLeft':
          if (e.shiftKey) {
            e.preventDefault()
            skipBack()
          }
          break
        case 'ArrowRight':
          if (e.shiftKey) {
            e.preventDefault()
            skipForward()
          }
          break
        case 'KeyL':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (currentSong && user) {
              toggleLike()
            }
          } else {
            e.preventDefault()
            toggleLoop()
          }
          break
        case 'KeyS':
          if (!(e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            toggleShuffle()
          }
          break
        case 'KeyF':
          if (e.altKey) {
            e.preventDefault()
            toggleFullscreen()
          }
          break
        case 'KeyM':
          e.preventDefault()
          toggleMute()
          break
        case 'ArrowUp':
          if (e.altKey) {
            e.preventDefault()
            setVolumeLevel(Math.min(volume + 0.1, 1))
          }
          break
        case 'ArrowDown':
          if (e.altKey) {
            e.preventDefault()
            setVolumeLevel(Math.max(volume - 0.1, 0))
          }
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [currentSong, isPlaying, user, volume, pause, resume, skipBack, skipForward, toggleLike, toggleLoop, toggleShuffle, toggleFullscreen, toggleMute, setVolumeLevel])

  return (
    <MusicPlayerContext.Provider value={{
      currentSong, isPlaying, duration, progress,
      volume, isMuted, isLooping, isShuffling, isFullscreen, isLiked,
      playlists, playlistsLoading,
      currentPlaylist, playlistSongs, currentSongIndex,
      currentAlbum, albumSongs, currentAlbumSongIndex,
      playSong, playPlaylist, playAlbum, playNextSong, playPreviousSong,
      pause, resume, seekTo, setVolumeLevel, toggleMute,
      skipBack, skipForward, toggleLoop, toggleShuffle, toggleFullscreen,
      toggleLike, addToPlaylist, refreshRecentlyPlayed, refreshPlaylists
    }}>
      {children}
      {currentSong && <MusicPlayerUI playlists={playlists || []} />}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error("useMusicPlayer must be used within a MusicPlayerProvider")
  return ctx
}

// UI Component
function MusicPlayerUI({ playlists }: { playlists: Playlist[] }) {
  const {
    currentSong: song, isPlaying, duration, progress,
    volume, isMuted, isLooping, isShuffling, isFullscreen, isLiked,
    currentPlaylist, playlistSongs, currentSongIndex,
    pause, resume, seekTo, setVolumeLevel, toggleMute, skipBack, skipForward,
    toggleLoop, toggleShuffle, toggleFullscreen, toggleLike, addToPlaylist
  } = useMusicPlayer()
  const formatTime = (sec: number) => `${Math.floor(sec/60)}:${Math.floor(sec%60).toString().padStart(2,'0')}`
  
  // Early return if no song is playing
  if (!song) return null
  
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Now Playing</h1>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <Minimize2 className="w-6 h-6 text-white" />
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Album Art */}
            <div className="flex-shrink-0">
              <Image 
                src={song.cover_url || '/placeholder.svg'} 
                alt={song.title} 
                width={400} 
                height={400} 
                className="rounded-xl shadow-2xl" 
              />
            </div>
            
            {/* Song Info & Controls */}
            <div className="flex-1 w-full max-w-md">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">{song.title}</h2>
                <p className="text-xl text-gray-300">{song.artist}</p>
                {song.album && <p className="text-lg text-gray-400 mt-1">{song.album}</p>}
              </div>
              
              {/* Controls */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-center space-x-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleShuffle}
                    className={isShuffling ? 'text-green-400' : 'text-gray-400'}
                  >
                    <Shuffle className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={skipBack}>
                    <SkipBack className="w-8 h-8 text-white" />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={() => isPlaying ? pause() : resume()} 
                    className="bg-white text-black w-16 h-16 rounded-full hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={skipForward}>
                    <SkipForward className="w-8 h-8 text-white" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleLoop}
                    className={isLooping ? 'text-green-400' : 'text-gray-400'}
                  >
                    <Repeat className="w-6 h-6" />
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400 w-12 text-right">{formatTime(progress)}</span>
                  <Slider 
                    value={[progress]} 
                    onValueChange={(val) => seekTo(val[0])} 
                    max={duration} 
                    step={0.1} 
                    className="flex-1" 
                  />
                  <span className="text-sm text-gray-400 w-12">{formatTime(duration)}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleLike}
                    className={isLiked ? 'text-red-500' : 'text-gray-400'}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <AddToPlaylistDialog playlists={playlists || []} onAddToPlaylist={addToPlaylist} />
                  
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted || volume === 0 ? 
                      <VolumeX className="w-6 h-6 text-gray-400" /> : 
                      <Volume2 className="w-6 h-6 text-gray-400" />
                    }
                  </Button>
                  <Slider 
                    value={[isMuted ? 0 : volume * 100]} 
                    onValueChange={(val) => setVolumeLevel(val[0] / 100)} 
                    max={100} 
                    step={1} 
                    className="w-32" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Image src={song.cover_url||'/placeholder.svg'} alt={song.title} width={60} height={60} className="rounded-lg" />
          <div className="min-w-0">
            <h4 className="text-white truncate">{song.title}</h4>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLike}
            className={isLiked ? 'text-red-500' : 'text-gray-400'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <AddToPlaylistDialog playlists={playlists || []} onAddToPlaylist={addToPlaylist} />
        </div>
        {/* Controls */}
        <div className="flex flex-col items-center flex-1 max-w-md mx-8 space-y-2">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleShuffle}
              className={isShuffling ? 'text-green-400' : 'text-gray-400'}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={skipBack}><SkipBack className="w-5 h-5 text-white"/></Button>
            <Button size="icon" onClick={() => isPlaying?pause():resume()} className="bg-white text-black w-10 h-10 rounded-full">
              {isPlaying?<Pause className="w-5 h-5"/>:<Play className="w-5 h-5"/>}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipForward}><SkipForward className="w-5 h-5 text-white"/></Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLoop}
              className={isLooping ? 'text-green-400' : 'text-gray-400'}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center w-full space-x-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(progress)}</span>
            <Slider value={[progress]} onValueChange={val=>seekTo(val[0])} max={duration} step={0.1} className="flex-1" />
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>
        {/* Volume & Extra */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted||volume===0?<VolumeX className="w-4 h-4 text-gray-400"/>:<Volume2 className="w-4 h-4 text-gray-400"/>}
          </Button>
          <Slider value={[isMuted?0:volume*100]} onValueChange={val=>setVolumeLevel(val[0]/100)} max={100} step={1} className="w-24" />
        </div>
      </div>
    </div>
  )
}



// Add to Playlist Dialog Component
const AddToPlaylistDialog = React.memo(({ playlists, onAddToPlaylist }: { playlists: Playlist[], onAddToPlaylist: (playlist_id: number) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('')
  
  const handleAddToPlaylist = useCallback(() => {
    if (selectedPlaylist) {
      onAddToPlaylist(parseInt(selectedPlaylist))
      setIsOpen(false)
      setSelectedPlaylist('')
    }
  }, [selectedPlaylist, onAddToPlaylist])
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={!playlists || playlists.length === 0}
          title={!playlists || playlists.length === 0 ? "No playlists available" : "Add to playlist"}
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#181818] border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select a playlist" />
            </SelectTrigger>
            <SelectContent className="bg-[#181818] border-white/20">
              {playlists && playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <SelectItem key={playlist.id} value={playlist.id.toString()} className="text-white hover:bg-white/10">
                    {playlist.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled className="text-gray-400">
                  No playlists available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddToPlaylist} 
              disabled={!selectedPlaylist}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Add to Playlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})

export { MusicPlayerUI as MusicPlayer }
