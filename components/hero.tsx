import { Button } from "@/components/ui/button"
import { Play, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl" />
      <div className="relative px-4 md:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">New: Real-time Lyrics Experience</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Music That
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Speaks </span>
            To Your Soul
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover millions of songs with synchronized lyrics, personalized recommendations, and an immersive
            listening experience like never before.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Listening Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold bg-transparent"
            >
              Explore Features
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50M+</div>
              <div className="text-gray-400">Songs Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Real-time</div>
              <div className="text-gray-400">Lyrics Sync</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">AI-Powered</div>
              <div className="text-gray-400">Recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
