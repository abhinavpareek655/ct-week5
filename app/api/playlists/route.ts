import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Fetch user's playlists
export async function GET(request: NextRequest) {
  try {
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
    
    // Fetch user's playlists
    const { data: playlists, error: fetchError } = await supabase
      .from('Playlist')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.error('Supabase error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
    }
    
    return NextResponse.json(playlists || [])
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new playlist
export async function POST(request: NextRequest) {
  try {
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
    
    const body = await request.json()
    const { name, description, cover_url, is_public } = body
    
    if (!name) {
      return NextResponse.json({ error: 'Playlist name is required' }, { status: 400 })
    }
    
    // Create new playlist
    const { data: playlist, error: createError } = await supabase
      .from('Playlist')
      .insert({
        name,
        user_id: user.id,
        description: description || null,
        cover_url: cover_url || null,
        is_public: is_public || false
      })
      .select()
      .single()
    
    if (createError) {
      console.error('Supabase error:', createError)
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 })
    }
    
    return NextResponse.json(playlist)
  } catch (error) {
    console.error('Error creating playlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 