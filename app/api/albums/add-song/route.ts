import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { albumId, songId } = await request.json()
    
    // Get the user from the authorization header (optional for this action)
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
    
    // Check if the song is already in the album (if using a junction table)
    // For now, we'll update the song's album_id directly
    const { error } = await supabase
      .from('Song')
      .update({ album_id: parseInt(albumId) })
      .eq('id', parseInt(songId))
    
    if (error) {
      console.error('Error adding song to album:', error)
      return NextResponse.json({ error: 'Failed to add song to album' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/albums/add-song:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
