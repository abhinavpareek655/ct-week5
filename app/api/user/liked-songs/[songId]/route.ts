import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  context: { params: { songId: string } }
) {
  try {
    const { songId } = await context.params
    
    // Get the user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ isLiked: false })
    }
    
    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return NextResponse.json({ isLiked: false })
    }
    
    // Check if song is liked
    const { data, error } = await supabase
      .from('UserLikedSongs')
      .select('id')
      .eq('user_id', user.id)
      .eq('song_id', parseInt(songId))
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking liked status:', error)
      return NextResponse.json({ isLiked: false })
    }
    
    return NextResponse.json({ isLiked: !!data })
  } catch (error) {
    console.error('Error in GET /api/user/liked-songs/[songId]:', error)
    return NextResponse.json({ isLiked: false })
  }
}
