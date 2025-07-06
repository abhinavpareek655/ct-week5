import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Layout } from "@/components/layout"
import { AuthProvider } from "@/components/auth-provider"
import { MusicPlayerProvider } from "@/components/music-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lyrics - Next-Generation Music Streaming",
  description:
    "Discover millions of songs with synchronized lyrics, personalized recommendations, and an immersive listening experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <MusicPlayerProvider>
            <Layout>{children}</Layout>
          </MusicPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
