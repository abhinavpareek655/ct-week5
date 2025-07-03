import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardProps {
  chart: {
    id: number
    region: string
    chart_type: string
    songs: Array<{
      id: number
      title: string
      artist: string
      coverUrl: string
      position: number
    }>
  }
  className?: string
  onPlay?: (songId: number) => void
}

export function ChartCard({ chart, className = "", onPlay }: ChartCardProps) {
  const getFlagEmoji = (countryCode: string) => {
    const country = countryCode.toLowerCase()
    const flagMap: { [key: string]: string } = {
      'global': '🌍',
      'united states': '🇺🇸',
      'united kingdom': '🇬🇧',
      'germany': '🇩🇪',
      'france': '🇫🇷',
      'japan': '🇯🇵',
      'south korea': '🇰🇷',
      'india': '🇮🇳',
      'brazil': '🇧🇷',
      'canada': '🇨🇦',
      'australia': '🇦🇺',
      'spain': '🇪🇸',
      'italy': '🇮🇹',
      'netherlands': '🇳🇱',
      'sweden': '🇸🇪',
      'norway': '🇳🇴',
      'denmark': '🇩🇰',
      'finland': '🇫🇮',
      'poland': '🇵🇱',
      'russia': '🇷🇺',
      'china': '🇨🇳',
      'mexico': '🇲🇽',
      'argentina': '🇦🇷',
      'chile': '🇨🇱',
      'colombia': '🇨🇴',
      'peru': '🇵🇪',
      'venezuela': '🇻🇪',
      'ecuador': '🇪🇨',
      'bolivia': '🇧🇴',
      'paraguay': '🇵🇾',
      'uruguay': '🇺🇾',
      'guyana': '🇬🇾',
      'suriname': '🇸🇷',
      'french guiana': '🇬🇫',
      'falkland islands': '🇫🇰',
      'south georgia': '🇬🇸',
      'antarctica': '🇦🇶'
    }
    return flagMap[country] || '🌍'
  }

  return (
    <Card className={`bg-[#181818] hover:bg-gradient-to-b hover:from-[#181818] hover:to-white/10 transition-all duration-300 group border-none ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-white">
          <span className="text-2xl">{getFlagEmoji(chart.region)}</span>
          <span className="text-lg capitalize">{chart.region.replace('_', ' ')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {chart.songs.map((song, index) => (
          <div key={song.id} className="flex items-center space-x-3 group/song hover:bg-white/5 rounded-lg p-2 transition-colors">
            <span className="text-gray-400 font-mono text-sm w-4 text-center">{song.position}</span>
            <Image
              src={song.coverUrl || "/placeholder.svg"}
              alt={song.title}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">{song.title}</h4>
              <p className="text-gray-400 text-xs truncate">{song.artist}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 opacity-0 group-hover/song:opacity-100 transition-opacity text-gray-400 hover:text-white"
              onClick={() => onPlay?.(song.id)}
            >
              <Play className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface ChartCardSkeletonProps {
  className?: string
}

export function ChartCardSkeleton({ className = "" }: ChartCardSkeletonProps) {
  return (
    <Card className={`bg-[#181818] border-none ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-10 h-10 rounded-md" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        ))}
        
      </CardContent>
    </Card>
  )
} 