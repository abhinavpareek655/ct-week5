import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://ajeezinbkzdtshjttcmf.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey!)

// Song metadata mapping based on the files in the songs folder
const songMetadata = {
  'The Weeknd - Blinding Lights (Official Video).webm': {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Pop",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273a3eff72f62782fb589a492f9",
    audioUrl: "/songs/The Weeknd - Blinding Lights (Official Video).webm",
    plays: 0,
    lyrics: `Yeah
I've been tryna call
I've been on my own for long enough
Maybe you can show me how to love, maybe
I feel like I'm just missing something when you're gone
But I feel like I'm just missing something when you're gone
I said, ooh, I'm blinded by the lights
No, I can't sleep until I feel your touch
I said, ooh, I'm drowning in the night
Oh, when I'm like this, you're the one I trust
I'm running out of time
'Cause I can see the sun light up the sky
So I hit the road in overdrive, baby, oh
The city's cold and empty (Oh)
No one's around to judge me (Oh)
I can't see clearly when you're gone`
  },
  'Harry Styles - Watermelon Sugar (Official Audio).webm': {
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    genre: "Pop",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a",
    audioUrl: "/songs/Harry Styles - Watermelon Sugar (Official Audio).webm",
    plays: 0,
    lyrics: `Tastes like strawberries on a summer evenin'
And it sounds just like a song
I want more berries and that summer feelin'
It's so wonderful and warm
Breathe me in, breathe me out
I don't know if I could ever go without
I'm just thinking out loud
I don't know if I could ever go without
Watermelon sugar high
Watermelon sugar high
Watermelon sugar high
Watermelon sugar high`
  },
  'Dua Lipa - Levitating (Lyrics).webm': {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    genre: "Pop",
    coverUrl: "https://i1.sndcdn.com/artworks-zJ5PAT4bhg4zmkSQ-qmb8iw-t500x500.jpg",
    audioUrl: "/songs/Dua Lipa - Levitating (Lyrics).webm",
    plays: 0,
    lyrics: `If you wanna run away with me, I know a galaxy
And I can take you for a ride
I had a premonition that we fell into a rhythm
Where the music don't stop for life
Glitter in the sky, glitter in my eyes
Shining just the way I like
If you're feeling like you need a little bit of company
You met me at the perfect time
You want me, I want you, baby
My sugarboo, I'm levitating
The Milky Way is liberating
Yeah, yeah, yeah, yeah, yeah`
  },
  'Lizzo - Good As Hell (Lyrics).webm': {
    title: "Good As Hell",
    artist: "Lizzo",
    album: "Cuz I Love You",
    genre: "Pop",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Lizzo_-_Good_as_Hell.png",
    audioUrl: "/songs/Lizzo - Good As Hell (Lyrics).webm",
    plays: 0,
    lyrics: `I do my hair toss, check my nails
Baby how you feelin'? (Feeling good as hell)
Hair toss, check my nails
Baby how you feelin'? (Feeling good as hell)
Woo child, tired of the bullshit
Go on dust your shoulders off, keep it moving
Yes Lord, tryna get some new shit
In there, swimwear, going to the pool shit
Come now, come dry your eyes
You know you a star, you can touch the sky
I know that it's hard but you have to try
If you need advice, let me simplify`
  },
  'Ed Sheeran - Shape of You (Official Music Video).webm': {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    genre: "Pop",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
    audioUrl: "/songs/Ed Sheeran - Shape of You (Official Music Video).webm",
    plays: 0,
    lyrics: `The club isn't the best place to find a lover
So the bar is where I go
Me and my friends at the table doing shots
Drinking fast and then we talk slow
And you come over and start up a conversation with just me
And trust me I'll give it a chance now
Take my hand, stop, put Van the Man on the jukebox
And then we start to dance, and now I'm singing like`
  },
  'JVKE - this is what space feels like [Official Lyric Video].webm': {
    title: "this is what space feels like",
    artist: "JVKE",
    album: "this is what space feels like",
    genre: "Pop",
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273b4bf03e0316b9835600c55af",
    audioUrl: "/songs/JVKE - this is what space feels like [Official Lyric Video].webm",
    plays: 0,
    lyrics: `I'm floating in the atmosphere
I'm weightless, I'm free
I'm looking down at Earth below
And it's beautiful to me
I'm floating in the atmosphere
I'm weightless, I'm free
I'm looking down at Earth below
And it's beautiful to me`
  },
  'The Weeknd, Kendrick Lamar - Pray For Me (Official Lyric Video).webm': {
    title: "Pray For Me",
    artist: "The Weeknd, Kendrick Lamar",
    album: "Black Panther: The Album",
    genre: "Hip Hop",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Pray_for_Me_by_The_Weeknd_and_Kendrick_Lamar_single_cover.jpg",
    audioUrl: "/songs/The Weeknd, Kendrick Lamar - Pray For Me (Official Lyric Video).webm",
    plays: 0,
    lyrics: `I'm always ready for a war again
Go down that road again
It's all the same
I'm always ready to take a life again
You know I'll ride again
It's all the same
I'm always ready to take a life again
You know I'll ride again
It's all the same
I'm always ready for a war again
Go down that road again
It's all the same`
  },
  'Kendrick Lamar, SZA - All The Stars.webm': {
    title: "All The Stars",
    artist: "Kendrick Lamar, SZA",
    album: "Black Panther: The Album",
    genre: "Hip Hop",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/8/8f/Black_Panther_The_Album_cover.jpg",
    audioUrl: "/songs/Kendrick Lamar, SZA - All The Stars.webm",
    plays: 0,
    lyrics: `Love, let's talk about love
Is it anything and everything you hoped for?
Or do the feeling haunt you?
I know the feeling haunt you
This may be the night that my dreams might let me know
All the stars are closer, all the stars are closer, all the stars are closer
This may be the night that my dreams might let me know
All the stars are closer, all the stars are closer, all the stars are closer`
  }
}

async function main() {
  console.log('Starting to add songs to Supabase...')
  
  if (!supabaseKey) {
    console.error('❌ SUPABASE_KEY environment variable is not set')
    process.exit(1)
  }
  
  // Get all files from the songs directory
  const songsDir = path.join(process.cwd(), 'songs')
  const files = fs.readdirSync(songsDir)
  
  console.log(`Found ${files.length} files in songs directory`)
  
  for (const file of files) {
    const metadata = songMetadata[file as keyof typeof songMetadata]
    
    if (metadata) {
      try {
        // Check if song already exists
        const { data: existingSong, error: checkError } = await supabase
          .from('Song')
          .select('id')
          .eq('title', metadata.title)
          .eq('artist', metadata.artist)
          .single()
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`❌ Error checking for existing song:`, checkError)
          continue
        }
        
        if (existingSong) {
          console.log(`Song already exists: ${metadata.title} by ${metadata.artist}`)
          continue
        }
        
        // Create the song (without lyrics field)
        const { title, artist, album, genre, coverUrl, audioUrl, plays, lyrics } = metadata
        const songData = { title, artist, album, genre, coverUrl, audioUrl, plays }
        
        const { data: song, error: insertError } = await supabase
          .from('Song')
          .insert([songData])
          .select()
          .single()
        
        if (insertError) {
          console.error(`❌ Error adding ${file}:`, insertError)
          continue
        }
        
        console.log(`✅ Added: ${song.title} by ${song.artist}`)
        
        // Add lyrics to the database
        if (metadata.lyrics) {
          const { error: lyricError } = await supabase
            .from('Lyric')
            .insert([{
              songId: song.id,
              content: metadata.lyrics,
              synced: false
            }])
          
          if (lyricError) {
            console.error(`❌ Error adding lyrics for ${song.title}:`, lyricError)
          } else {
            console.log(`  📝 Added lyrics for: ${song.title}`)
          }
        }
        
      } catch (error) {
        console.error(`❌ Error adding ${file}:`, error)
      }
    } else {
      console.log(`⚠️  No metadata found for: ${file}`)
    }
  }
  
  console.log('Finished adding songs to Supabase!')
}

main()
  .catch((e) => {
    console.error('Script failed:', e)
    process.exit(1)
  }) 