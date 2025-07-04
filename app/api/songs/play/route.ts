import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for server-side operations, fallback to anon key if service role is not available
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🎵 Play API called')
    
    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing both SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    const body = await request.json()
    console.log('📝 Request body:', body)
    
    const { songId, user_id } = body
    
    if (!songId || !user_id) {
      console.error('❌ Missing required fields:', { songId, user_id })
      return NextResponse.json(
        { error: 'Song ID and User ID are required' },
        { status: 400 }
      )
    }

    console.log('📊 Recording play for user:', user_id, 'song:', songId)

    // Record the play in PlayHistory
    const insertData = {
      user_id,
      songId: parseInt(songId),
      played_at: new Date().toISOString()
    }
    
    console.log('📝 Insert data:', insertData)
    
    const { data, error: playHistoryError } = await supabase
      .from('PlayHistory')
      .insert(insertData)
      .select()

    if (playHistoryError) {
      console.error('❌ Supabase error details:', {
        message: playHistoryError.message,
        details: playHistoryError.details,
        hint: playHistoryError.hint,
        code: playHistoryError.code
      })
      return NextResponse.json(
        { 
          error: 'Failed to record play history',
          details: playHistoryError.message,
          code: playHistoryError.code
        },
        { status: 500 }
      )
    }

    console.log('✅ Play recorded successfully:', data)

    // Note: Play count increment is handled by the database trigger
    // So we don't need to manually update the Song table

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('❌ Unexpected error in play recording:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
