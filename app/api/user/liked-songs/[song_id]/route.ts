import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseWithAuth(accessToken: string | undefined) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      : undefined
  )
}

export async function GET(
  request: NextRequest,
  context: { params: { song_id: string } }
) {
  try {
    const { song_id } = await context.params
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')
    const supabase = getSupabaseWithAuth(accessToken)
    if (!accessToken) {
      return NextResponse.json({ isLiked: false })
    }

    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return NextResponse.json({ isLiked: false })
    }

    // Check if song is liked
    const { data, error } = await supabase
      .from('UserLikedSongs')
      .select('id')
      .eq('user_id', user.id)
      .eq('song_id', parseInt(song_id))
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking liked status:', error)
      return NextResponse.json({ isLiked: false })
    }

    return NextResponse.json({ isLiked: !!data })
  } catch (error) {
    console.error('Error in GET /api/user/liked-songs/[song_id]:', error)
    return NextResponse.json({ isLiked: false })
  }
}
