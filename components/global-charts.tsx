import { ChartCard, ChartCardSkeleton } from "@/components/ui/chart-card"
import { Button } from "@/components/ui/button"
import { Globe, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"

interface ChartData {
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

export function GlobalCharts() {
  const [charts, setCharts] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    async function fetchCharts() {
      setLoading(true)
      
      // Fetch charts from GlobalCharts table with song details
      const { data, error } = await supabase
        .from("GlobalCharts")
        .select(`
          id,
          region,
          chart_type,
          position,
          song_id,
          Song(
            id,
            title,
            artist,
            "coverUrl"
          )
        `)
        .order("position", { ascending: true })

      if (!error && data) {
        // Group songs by region and chart type
        const chartMap = new Map<string, ChartData>()
        
        data.forEach((chartEntry) => {
          const key = `${chartEntry.region}_${chartEntry.chart_type}`
          
          if (!chartMap.has(key)) {
            chartMap.set(key, {
              id: chartMap.size + 1,
              region: chartEntry.region,
              chart_type: chartEntry.chart_type,
              songs: []
            })
          }
          
          const chart = chartMap.get(key)!
          chart.songs.push({
            id: chartEntry.Song.id,
            title: chartEntry.Song.title,
            artist: chartEntry.Song.artist,
            coverUrl: chartEntry.Song.coverUrl,
            position: chartEntry.position
          })
        })
        
        // Convert map to array and sort songs by position
        const chartData = Array.from(chartMap.values()).map(chart => ({
          ...chart,
          songs: chart.songs.sort((a, b) => a.position - b.position)
        }))
        
        setCharts(chartData)
      } else {
        console.error('Error fetching charts:', error)
        setCharts([])
      }
      
      setLoading(false)
    }

    fetchCharts()
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [charts])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  const handlePlay = (songId: number) => {
    console.log('Play song:', songId)
    // Add your play logic here
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Global Charts</h2>
        </div>
      </div>

      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            onClick={scrollLeft}
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 opacity-0 transition-opacity z-10 shadow-lg chart-scroll-button"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            onClick={scrollRight}
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-black/80 hover:bg-black text-white rounded-full w-10 h-10 opacity-0 transition-opacity z-10 shadow-lg chart-scroll-button"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2 px-2"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80">
                <ChartCardSkeleton />
              </div>
            ))
          ) : charts.length === 0 ? (
            <div className="text-gray-400 p-4">No charts found.</div>
          ) : (
            charts.map((chart) => (
              <div key={chart.id} className="flex-shrink-0 w-80">
                <ChartCard 
                  chart={chart} 
                  onPlay={handlePlay}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
