"use client"
import { FeaturedPlaylists } from "@/components/featured-playlists"
import { TrendingNow } from "@/components/trending-now"
import { GlobalCharts } from "@/components/global-charts"
import { RecentlyPlayed } from "@/components/recently-played"
import { RecommendedArtists } from "@/components/recommended-artists"
import { Discover } from "@/components/discover"

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="space-y-8 pb-24">
        <div className="px-4 md:px-6 lg:px-8 space-y-12">
          <RecentlyPlayed />
          <Discover />
          <FeaturedPlaylists />
          <TrendingNow />
          <RecommendedArtists />
          <GlobalCharts />
        </div>
      </div>
    </div>
  )
}
