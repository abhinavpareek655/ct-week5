import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { songId } = await request.json()
    
    // Get the user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Add song to liked songs
    const { error } = await supabase
      .from('UserLikedSongs')
      .insert({
        user_id: user.id,
        song_id: parseInt(songId),
        liked_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error adding liked song:', error)
      return NextResponse.json({ error: 'Failed to add liked song' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/user/liked-songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { songId } = await request.json()
    
    // Get the user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Remove song from liked songs
    const { error } = await supabase
      .from('UserLikedSongs')
      .delete()
      .eq('user_id', user.id)
      .eq('song_id', parseInt(songId))
    
    if (error) {
      console.error('Error removing liked song:', error)
      return NextResponse.json({ error: 'Failed to remove liked song' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/user/liked-songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
