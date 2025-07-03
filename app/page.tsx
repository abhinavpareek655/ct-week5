"use client"
import { FeaturedPlaylists } from "@/components/featured-playlists"
import { TrendingNow } from "@/components/trending-now"
import { GlobalCharts } from "@/components/global-charts"
import { RecentlyPlayed } from "@/components/recently-played"
import { Discover } from "@/components/discover"
import { GlobalArtists } from "@/components/global-artists"

export default function HomePage() {
  return (
    <div>
      <div className="space-y-8 pb-24">
        <div className="space-y-12">
          <RecentlyPlayed />
          <Discover />
          <FeaturedPlaylists />
        </div>
        <div className="lg:hidden space-y-12">
          <TrendingNow />
          <GlobalArtists />
          <GlobalCharts />
        </div>
      </div>
    </div>
  )
}
